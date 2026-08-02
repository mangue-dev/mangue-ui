import type * as React from "react";

export type IconType = React.ComponentType<{ className?: string }>;

/**
 * A framework-agnostic link component. Pass Next.js's <Link> here to get
 * client-side navigation; if omitted, items with an `href` fall back to a
 * plain <a>. This is what keeps the shell decoupled from any router.
 */
export type LinkComponent = React.ComponentType<
  {
    href: string;
    className?: string;
    children?: React.ReactNode;
  } & Record<string, unknown>
>;

export interface NavItem {
  /** Stable identifier, also used to match the active item. */
  key: string;
  label: string;
  icon?: IconType;
  /** Render as a link when set; otherwise a button using `onClick`. */
  href?: string;
  onClick?: () => void;
  /** Optional trailing content (a count, dot, chip, etc.). */
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Force active state; otherwise derived from `activeKey`. */
  active?: boolean;
  /** Label shown in a tooltip when the sidebar is collapsed. */
  tooltip?: string;
  /**
   * Second key of the chord that jumps here (e.g. "M" for "G then M"). It shows
   * in the row's tooltip, and — while the app reports the chord as armed
   * (`Sidebar`'s `chordArmed`) — as a trailing `Kbd` on the row itself.
   */
  shortcut?: string;
  /**
   * Replays `badge` in a corner of the icon while the sidebar is COLLAPSED
   * (normal badges are not rendered there, for lack of room). For compact
   * indicators only — a running spinner, an unread dot — not for counters.
   */
  showBadgeCollapsed?: boolean;
  /**
   * What the corner pip carries instead of `badge`, when that one would not
   * fit. Real case: a "Home" entry that stacks an alert triangle and a counter;
   * collapsed, only the triangle can go.
   */
  badgeCollapsed?: React.ReactNode;
}

export interface NavSection {
  key?: string;
  /** Optional heading (hidden when the sidebar is collapsed). */
  label?: string;
  items: NavItem[];
}

/**
 * One step in the header breadcrumb. The last level is the current page; on
 * mobile (<desktop) the header collapses to a back button pointing at the
 * previous level plus the current level centred.
 */
export interface BreadcrumbLevel {
  key: string;
  label: string;
  icon?: IconType;
  /** Navigate here when clicked (used by the mobile back button too). */
  href?: string;
  onClick?: () => void;
}
