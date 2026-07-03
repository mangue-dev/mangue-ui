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
}

export interface NavSection {
  key?: string;
  /** Optional heading (hidden when the sidebar is collapsed). */
  label?: string;
  items: NavItem[];
}
