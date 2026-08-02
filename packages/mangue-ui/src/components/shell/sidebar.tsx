"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { transitions } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { Kbd } from "../ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { IconType, LinkComponent, NavItem, NavSection } from "./types";

export interface SidebarProps {
  sections: NavSection[];
  /** Marks the active item by its `key`. */
  activeKey?: string;
  /** Logo / brand area (top). Hidden when collapsed. */
  header?: React.ReactNode;
  /**
   * What the top-left square shows while COLLAPSED. Given one, the brand takes
   * the reopen button's place and cross-fades to it on hover — the whole square
   * being the expand button. Without it, a plain reopen button.
   */
  collapsedBrand?: React.ReactNode;
  /** User menu / actions area (bottom). */
  footer?: React.ReactNode;
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Identifies WHICH nav is showing (e.g. "home" vs `project-<id>`). Changing
   * it animates the nav region across, brand and footer staying put. Navigating
   * between pages of the same mode keeps the key, so nothing replays.
   */
  modeKey?: string;
  /**
   * Which way the mode swap travels: `forward` (default) enters from the right
   * — stepping *into* something; `backward` enters from the left — stepping
   * back out. Only the direction is the app's call, since only the app knows
   * which of its modes is the outer one.
   */
  modeDirection?: "forward" | "backward";
  /**
   * The app reports its chord prefix as armed: each row with a `shortcut`
   * surfaces its completion key as a trailing `Kbd`. The chord state itself
   * stays with the app.
   */
  chordArmed?: boolean;
  /**
   * Separator between the chord prefix and the item key inside a row's tooltip
   * ("G then M"). Defaults to the English "then".
   */
  chordPrefix?: string;
  chordSeparator?: string;
  /**
   * Warm-up hook, wired on both `onMouseEnter` AND `onFocus` of a row — the
   * place to prefetch the caches of the page it points at.
   */
  onItemHover?: (item: NavItem) => void;
  /** Pass Next.js's <Link> for client-side nav; falls back to <a>. */
  linkComponent?: LinkComponent;
  labels?: Partial<SidebarLabels>;
  className?: string;
}

export interface SidebarLabels {
  expand: string;
  collapse: string;
}

const DEFAULT_LABELS: SidebarLabels = {
  expand: "Expand sidebar",
  collapse: "Collapse sidebar",
};

const EXPANDED_WIDTH = 256;
const COLLAPSED_WIDTH = 56;

export function Sidebar({
  sections,
  activeKey,
  header,
  collapsedBrand,
  footer,
  collapsible = true,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  modeKey,
  modeDirection = "forward",
  chordArmed = false,
  chordPrefix = "G",
  chordSeparator = "then",
  onItemHover,
  linkComponent,
  labels,
  className,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? internalCollapsed;
  const reduceMotion = useReducedMotion();
  const t = { ...DEFAULT_LABELS, ...labels };

  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const nav = (
    <SidebarNav
      sections={sections}
      activeKey={activeKey}
      collapsed={collapsed}
      chordArmed={chordArmed}
      chordPrefix={chordPrefix}
      chordSeparator={chordSeparator}
      onItemHover={onItemHover}
      linkComponent={linkComponent}
    />
  );

  return (
    <motion.aside
      data-collapsed={collapsed}
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 34 }
      }
      className={cn(
        "flex h-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* Header / logo + collapse toggle */}
      <div
        className={cn(
          "flex h-[60px] items-center",
          collapsed ? "justify-center px-0" : "justify-between px-3.5",
        )}
      >
        {collapsed ? (
          collapsible ? (
            // Collapsed: the brand sits where the reopen button would be and
            // cross-fades to it on hover — the whole square is the button.
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label={t.expand}
              title={t.expand}
              className="group relative flex size-8 items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {collapsedBrand ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sidebar-foreground transition-opacity duration-150 group-hover:opacity-0">
                  {collapsedBrand}
                </span>
              ) : null}
              <span
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center text-sidebar-foreground/60 transition-opacity duration-150 group-hover:text-sidebar-foreground",
                  collapsedBrand && "opacity-0 group-hover:opacity-100",
                )}
              >
                <PanelLeftOpen className="h-[18px] w-[18px]" />
              </span>
            </button>
          ) : (
            collapsedBrand
          )
        ) : (
          <>
            {header ? <div className="min-w-0 flex-1">{header}</div> : null}
            {collapsible ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label={t.collapse}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <PanelLeftClose className="h-[18px] w-[18px]" />
              </button>
            ) : null}
          </>
        )}
      </div>

      {/* Navigation — animated swap between modes when `modeKey` changes. The
          direction alternates so a step "down" into a project enters from the
          right and a step back out enters from the left.

          Reduced motion zeroes the TRANSITION rather than dropping the wrapper:
          `useReducedMotion` reads `matchMedia` on the client's first render, so
          branching the tree SHAPE on it makes the server and the client
          disagree and React throws the whole page away and re-renders it. A
          transition never reaches the server HTML, so varying it is safe. */}
      {modeKey === undefined ? (
        nav
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={modeKey}
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, x: modeDirection === "forward" ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: modeDirection === "forward" ? 16 : -16 }}
            transition={reduceMotion ? { duration: 0 } : transitions.fade}
          >
            {nav}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Footer / user */}
      {footer ? (
        <div className={cn("pt-2 pb-4", collapsed ? "px-2.5" : "px-3.5")}>
          {footer}
        </div>
      ) : null}
    </motion.aside>
  );
}

function SidebarNav({
  sections,
  activeKey,
  collapsed,
  chordArmed,
  chordPrefix,
  chordSeparator,
  onItemHover,
  linkComponent,
}: {
  sections: NavSection[];
  activeKey?: string;
  collapsed: boolean;
  chordArmed: boolean;
  chordPrefix: string;
  chordSeparator: string;
  onItemHover?: (item: NavItem) => void;
  linkComponent?: LinkComponent;
}) {
  return (
    <nav
      className={cn(
        "flex-1 overflow-x-hidden overflow-y-auto pt-3 pb-2",
        collapsed ? "px-2.5" : "px-3.5",
      )}
    >
      {sections.map((section, index) => (
        <div key={section.key ?? index} className={cn(index > 0 && "mt-4")}>
          {section.label && !collapsed ? (
            <div className="px-2.5 pt-1 pb-1 text-[11px] font-medium tracking-wide text-sidebar-foreground/45">
              {section.label}
            </div>
          ) : null}
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => (
              <li key={item.key}>
                <SidebarRow
                  item={item}
                  collapsed={collapsed}
                  active={item.active ?? item.key === activeKey}
                  chordArmed={chordArmed}
                  chordPrefix={chordPrefix}
                  chordSeparator={chordSeparator}
                  onItemHover={onItemHover}
                  linkComponent={linkComponent}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

interface SidebarRowProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  chordArmed: boolean;
  chordPrefix: string;
  chordSeparator: string;
  onItemHover?: (item: NavItem) => void;
  linkComponent?: LinkComponent;
}

function SidebarRow({
  item,
  collapsed,
  active,
  chordArmed,
  chordPrefix,
  chordSeparator,
  onItemHover,
  linkComponent: Link,
}: SidebarRowProps) {
  const Icon = item.icon;
  // While a chord is armed, this row's completion key takes the trailing slot
  // over the badge, for the moment it lasts.
  const hint = !collapsed && chordArmed && item.shortcut ? item.shortcut : null;

  const rowClass = cn(
    "group relative flex h-9 items-center gap-3 rounded-lg px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
    // Collapsed: a fixed-width, left-anchored icon box, so the icon keeps a
    // constant position while the sidebar's width animates (no drift to centre).
    collapsed && "w-9 justify-center gap-0 px-0",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
    item.disabled && "pointer-events-none opacity-50",
  );

  const collapsedBadge = item.badgeCollapsed ?? item.badge;

  const inner = (
    <>
      {Icon ? <Icon className="h-[18px] w-[18px] shrink-0" /> : null}
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
      {hint ? (
        <Kbd size="sm" className="ml-auto shrink-0">
          {hint}
        </Kbd>
      ) : !collapsed && item.badge != null ? (
        <span className="ml-auto flex items-center">{item.badge}</span>
      ) : null}
      {/* Collapsed: the badge (a running spinner, an unread dot) folds into a
          corner pip on the icon — otherwise the information vanishes in rail
          mode. */}
      {collapsed && item.showBadgeCollapsed && collapsedBadge != null ? (
        <span className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-sidebar">
          {collapsedBadge}
        </span>
      ) : null}
    </>
  );

  const warm = onItemHover ? () => onItemHover(item) : undefined;
  const hoverProps = { onMouseEnter: warm, onFocus: warm };
  const tapProps = { whileTap: { scale: 0.97 }, transition: transitions.snappy };

  // Memoised per link component: `motion.create` builds a new component type,
  // and rebuilding it every render would remount the row on every keystroke
  // anywhere in the app.
  const MotionLink = React.useMemo(
    () => (Link ? motion.create(Link) : null),
    [Link],
  );

  let row: React.ReactNode;
  if (item.href && MotionLink) {
    row = (
      <MotionLink
        href={item.href}
        className={rowClass}
        aria-current={active ? "page" : undefined}
        {...hoverProps}
        {...tapProps}
      >
        {inner}
      </MotionLink>
    );
  } else if (item.href) {
    row = (
      <a
        href={item.href}
        className={rowClass}
        aria-current={active ? "page" : undefined}
        {...hoverProps}
      >
        {inner}
      </a>
    );
  } else {
    row = (
      <motion.button
        type="button"
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(rowClass, "text-left", !collapsed && "w-full")}
        {...hoverProps}
        {...tapProps}
      >
        {inner}
      </motion.button>
    );
  }

  if (collapsed || item.shortcut) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{row}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{item.tooltip ?? item.label}</span>
          {item.shortcut && (
            <>
              <Kbd size="sm">{chordPrefix}</Kbd>
              <span>{chordSeparator}</span>
              <Kbd size="sm">{item.shortcut}</Kbd>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return row;
}

export interface SidebarFooterRowProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
  href?: string;
  collapsed?: boolean;
  active?: boolean;
  /** Trailing icon — e.g. an "opens elsewhere" arrow. Hidden when collapsed. */
  trailingIcon?: IconType;
  linkComponent?: LinkComponent;
  className?: string;
}

/**
 * One row of the sidebar's footer (trash, feedback, account…). Same geometry as
 * a nav row but quieter, and it carries its label in a right-hand tooltip once
 * the sidebar is collapsed — so an app composes its footer without copying
 * these classes.
 */
export function SidebarFooterRow({
  icon: Icon,
  label,
  onClick,
  href,
  collapsed = false,
  active = false,
  trailingIcon: TrailingIcon,
  linkComponent: Link,
  className,
}: SidebarFooterRowProps) {
  const rowClass = cn(
    "flex h-9 items-center rounded-lg text-sm font-medium outline-none transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
    active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground",
    collapsed ? "w-9 justify-center" : "w-full gap-3 px-3.5 text-left",
    className,
  );

  const inner = (
    <>
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && label}
      {!collapsed && TrailingIcon && (
        <TrailingIcon className="ml-auto size-4 shrink-0" />
      )}
    </>
  );

  let row: React.ReactNode;
  if (href && Link) {
    row = (
      <Link href={href} className={rowClass}>
        {inner}
      </Link>
    );
  } else if (href) {
    row = (
      <a href={href} className={rowClass}>
        {inner}
      </a>
    );
  } else {
    row = (
      <button type="button" onClick={onClick} className={rowClass}>
        {inner}
      </button>
    );
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{row}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return row;
}
