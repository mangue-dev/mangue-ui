"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { transitions } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { Kbd } from "../ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useSecondarySidebarExpected } from "./secondary-sidebar";
import type { IconType, LinkComponent, NavItem, NavSection } from "./types";

export interface SidebarProps {
  sections: NavSection[];
  /** Marks the active item by its `key`. */
  activeKey?: string;
  /** Logo / brand area (top). */
  header?: React.ReactNode;
  /**
   * The mark the rail shows in place of `header`, in its 36px box. The two
   * cross-fade into each other as the rail opens, both staying mounted —
   * swapping them would unmount what a tab just aimed at. Without one, `header`
   * stays put and the rail simply clips it.
   */
  collapsedBrand?: React.ReactNode;
  /** User menu / actions area (bottom). */
  footer?: React.ReactNode;
  /**
   * RAIL mode: the page carries a secondary sidebar and the primary one yields
   * the room. It keeps only its 56px of icons IN THE FLOW and unfolds OVER the
   * secondary one on hover (or when keyboard focus enters), without shifting
   * anything — the layout of a two-sidebar page is the same whether the primary
   * is open or not.
   *
   * This is the ONLY fold. There is no button to fold the bar by hand and no
   * ⌘B: the rail exists where a second column needs the room, and everywhere
   * else the bar is simply open. A manual fold on top of this one meant two
   * folded bars for two different reasons, one of which you had to know a
   * shortcut to undo.
   *
   * Left out, it follows the `<SecondarySidebarProvider>` above it, so a page
   * that mounts a `<SecondarySidebar>` rails the primary one on its own. Pass a
   * boolean to decide yourself.
   */
  overlay?: boolean;
  /**
   * Feed it your pathname to have the rail forget any keyboard focus it was
   * holding on navigation. Navigating unmounts the row that had focus, and a
   * `blur` then has nobody to fire on — without this reset the rail could stay
   * unfolded on the next page.
   */
  railResetKey?: string;
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
  className?: string;
}

export const SIDEBAR_EXPANDED_WIDTH = 256;
export const SIDEBAR_COLLAPSED_WIDTH = 56;

/**
 * ─── The icon column ──────────────────────────────────────────────────
 *
 * An icon must NOT move by a single pixel between the open and the folded
 * sidebar: it is the only landmark that survives the animation, and seeing it
 * drift a few pixels makes the whole bar look like it floats.
 *
 * The alignment starts from the rail, where the icon sits in the middle:
 *
 *     rail 56 = 10 (gutter) + 9 + 18 (icon) + 9 + 10
 *                              └── centre at 28, left edge at 19 ──┘
 *
 * Hence two constants held by hand in both states — the nav's gutter (`px-2.5`)
 * and a row's inset (`pl-[9px]`). Changing one without redoing the arithmetic
 * brings the drift back.
 *
 * What matters is the CENTRE at 28, not the edge at 19: the edge only works for
 * 18px glyphs. Anything wider (an avatar, a wordmark) is CENTRED in the 36px box
 * instead of aligned from the left.
 */
/** Gutter of the nav, the footer and the brand row. Both states. */
const GUTTER = "px-2.5";
/** A row's inset: an 18px icon → left edge 19px into the bar. */
const ROW_PL = "pl-[9px]";
/** The box of a folded row: 9 + 18 + 9. Centre 28px into the bar. */
const ROW_BOX = "w-9";
/**
 * Rail tooltips wait before showing. Without the delay they pop under a pointer
 * that is only crossing the bar on its way out, and land across the secondary
 * sidebar. `disableHoverableContent` finishes the job: a tooltip you cannot
 * hover cannot hold on to a pointer you thought had left.
 */
const RAIL_TOOLTIP_DELAY_MS = 600;
/** How long the rail waits before folding once the pointer leaves. Short enough
 *  to follow the gesture, long enough to forgive a brush past. */
const RAIL_CLOSE_DELAY_MS = 150;

/* ─── Shared state ─────────────────────────────────────────────────── */

export interface SidebarState {
  /** Is the bar showing icons only right now? */
  collapsed: boolean;
  /** Is it in rail mode (folded because a secondary sidebar took the room)? */
  overlay: boolean;
  /**
   * Report a menu of yours as open. A dropdown opens in a portal, OUTSIDE the
   * bar, so moving the pointer into it counts as leaving — the rail would fold
   * under the menu it just opened. Wire this to your footer menu's
   * `onOpenChange`. No-op outside rail mode.
   */
  setMenuOpen: (open: boolean) => void;
}

const noop = () => {};
const SidebarStateContext = React.createContext<SidebarState>({
  collapsed: false,
  overlay: false,
  setMenuOpen: noop,
});

/**
 * What the sidebar is doing, for the pieces an app plugs into it (a footer, an
 * account menu). Safe outside a `<Sidebar>`: it then reads as expanded.
 */
export function useSidebarState(): SidebarState {
  return React.useContext(SidebarStateContext);
}

/* ─── Sidebar ──────────────────────────────────────────────────────── */

export function Sidebar({
  sections,
  activeKey,
  header,
  collapsedBrand,
  footer,
  overlay: overlayProp,
  railResetKey,
  modeKey,
  modeDirection = "forward",
  chordArmed = false,
  chordPrefix = "G",
  chordSeparator = "then",
  onItemHover,
  linkComponent,
  className,
}: SidebarProps) {
  const reduceMotion = useReducedMotion();

  // No `overlay` given: follow the chrome. A page that mounts a secondary
  // sidebar rails this one, and nothing else has to be wired.
  const expected = useSecondarySidebarExpected();
  const overlay = overlayProp ?? expected;

  // Rail mode: what unfolds the bar. Hover, keyboard focus (tabbing into the nav
  // has to read it), and a footer menu — it opens outside the bar (portal), so
  // going into it would otherwise count as leaving.
  const [hovered, setHovered] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  // Belt and braces: navigation unmounts the row that had focus, and no `blur`
  // ever arrives.
  React.useEffect(() => setFocusWithin(false), [railResetKey]);

  // Same story for hover and the footer menu, but on the way OUT of rail mode:
  // their setters are wired on `overlay`. Leaving a two-sidebar page THROUGH THE
  // BAR (you hover it, it unfolds, you click "Home") unwires `onPointerLeave`
  // with the pointer still on it: nobody will ever see it leave, and `hovered`
  // stays true forever. The next two-sidebar page — reached from the palette, so
  // without going over the bar — would then open with the primary UNFOLDED over
  // the secondary, pointer at the other end of the screen, and nothing left to
  // close it.
  React.useEffect(() => {
    if (overlay) return;
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHovered(false);
    setMenuOpen(false);
  }, [overlay]);

  const openRail = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHovered(true);
  };
  const closeRail = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(
      () => setHovered(false),
      RAIL_CLOSE_DELAY_MS,
    );
  };

  // Rail mode, and nothing else, folds the bar.
  const collapsed = overlay && !(hovered || focusWithin || menuOpen);

  // Two widths, and that is the whole mechanism: the one the bar OCCUPIES in the
  // flow, and the one it MEASURES. In rail mode the first stays at the rail come
  // what may — the bar unfolds over the secondary sidebar, never beside it.
  // Outside rail mode the two are equal, and the bar is in the flow without
  // looking like it is.
  //
  // That ghost is also what makes the MODE CHANGE animatable: leaving a
  // two-sidebar page changes no structure, only widths — 56 → 256 here, 320 → 0
  // for the gutter next door, on the same curve. Everything to the right glides
  // as one block instead of jumping.
  const flowWidth = overlay
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;
  const asideWidth = collapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;
  const shellTransition = reduceMotion ? { duration: 0 } : transitions.shell;

  const state = React.useMemo<SidebarState>(
    () => ({ collapsed, overlay, setMenuOpen: overlay ? setMenuOpen : noop }),
    [collapsed, overlay],
  );

  const nav = (
    <SidebarNav
      sections={sections}
      activeKey={activeKey}
      collapsed={collapsed}
      overlay={overlay}
      chordArmed={chordArmed}
      chordPrefix={chordPrefix}
      chordSeparator={chordSeparator}
      onItemHover={onItemHover}
      linkComponent={linkComponent}
    />
  );

  return (
    <SidebarStateContext.Provider value={state}>
      {/* The bar is ALWAYS laid over its own ghost, rail mode or not: that is
          what makes going from one to the other a matter of widths only.
          Outside rail mode the ghost is exactly its width, and nothing shows. */}
      <div className="relative h-full shrink-0">
        {/* Explicit `initial`, not `initial={false}`: this is what framer writes
            into the server HTML. With no width on first paint the gutter would
            start at zero and the whole chrome would settle at hydration. On
            mount it already equals the target: nothing animates. */}
        <motion.div
          aria-hidden
          className="h-full shrink-0"
          initial={{ width: flowWidth }}
          animate={{ width: flowWidth }}
          transition={shellTransition}
        />
        <motion.aside
          data-collapsed={collapsed}
          data-overlay={overlay || undefined}
          initial={{ width: asideWidth }}
          animate={{ width: asideWidth }}
          transition={shellTransition}
          onPointerEnter={overlay ? openRail : undefined}
          // Landing on a two-sidebar page folds the bar under a pointer that is
          // not moving: it was the click on a nav row that navigated, so the
          // pointer was already on it and no `pointerenter` will come. The
          // slightest move catches that up, instead of waiting for a leave and
          // a re-enter.
          onPointerMove={overlay ? openRail : undefined}
          onPointerLeave={overlay ? closeRail : undefined}
          onFocusCapture={
            overlay
              ? (e) => {
                  // `:focus-visible`, not "has focus": CLICKING a row focuses
                  // it, and the bar would then stay unfolded once the pointer
                  // left — we just navigated, which is precisely when it must
                  // fold. Only focus that CAME FROM THE KEYBOARD holds it open,
                  // because there is no pointer there to reopen it.
                  const el = e.target as HTMLElement;
                  if (el.matches?.(":focus-visible")) setFocusWithin(true);
                }
              : undefined
          }
          onBlurCapture={
            overlay
              ? (e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setFocusWithin(false);
                  }
                }
              : undefined
          }
          className={cn(
            "absolute inset-y-0 left-0 z-40 flex h-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
            // Unfolded over the secondary sidebar, the two bars share a
            // background: without a drop shadow only the border separates them,
            // and it vanishes in dark theme. An explicit shadow rather than
            // `shadow-2xl`, which does not show on black. It fades instead of
            // cutting out: leaving a two-sidebar page while hovering the bar
            // puts it out as everything else settles back.
            "transition-shadow duration-300",
            overlay && !collapsed && "shadow-[8px_0_32px_-8px_rgba(0,0,0,0.45)]",
            className,
          )}
        >
          {/* The brand row. Same height and same bottom border as the header and
              as a secondary sidebar's title row: one single horizontal line
              crosses the app, edge to edge.

              Its content is the SAME element whatever the state — no button to
              fold the bar, and nothing swapped at unfold: swapping would unmount
              what a tab just aimed at, and the first tab into the rail would
              lose its focus. Given a `collapsedBrand`, the two cross-fade in
              place; without one, the brand stays put and the 56px rail simply
              clips it (`overflow-hidden`), so it never moves either. */}
          <div
            className={cn(
              "flex h-[60px] shrink-0 items-center border-b border-sidebar-border",
              GUTTER,
            )}
          >
            {collapsedBrand ? (
              <div className={cn("relative flex shrink-0 items-center", ROW_BOX)}>
                <span
                  className={cn(
                    "flex w-full items-center justify-center transition-opacity duration-150",
                    collapsed ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  {collapsedBrand}
                </span>
                {/* `whitespace-nowrap`: the box it hangs off is 36px wide, and an
                    absolute child is capped by its containing block — a wordmark
                    would fold onto two lines inside the rail. It overflows
                    instead, and the bar clips it. */}
                <span
                  className={cn(
                    "absolute top-1/2 left-0 flex -translate-y-1/2 items-center whitespace-nowrap transition-opacity duration-150",
                    collapsed ? "pointer-events-none opacity-0" : "opacity-100",
                  )}
                >
                  {header}
                </span>
              </div>
            ) : (
              <div className="min-w-0 flex-1">{header}</div>
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
            <div className={cn("pt-2 pb-4", GUTTER)}>{footer}</div>
          ) : null}
        </motion.aside>
      </div>
    </SidebarStateContext.Provider>
  );
}

function SidebarNav({
  sections,
  activeKey,
  collapsed,
  overlay,
  chordArmed,
  chordPrefix,
  chordSeparator,
  onItemHover,
  linkComponent,
}: {
  sections: NavSection[];
  activeKey?: string;
  collapsed: boolean;
  overlay: boolean;
  chordArmed: boolean;
  chordPrefix: string;
  chordSeparator: string;
  onItemHover?: (item: NavItem) => void;
  linkComponent?: LinkComponent;
}) {
  return (
    <nav
      className={cn(
        "scrollbar-quiet flex-1 overflow-x-hidden overflow-y-auto pt-3 pb-2",
        GUTTER,
      )}
    >
      {sections.map((section, index) => (
        <div key={section.key ?? index} className={cn(index > 0 && "mt-4")}>
          {section.label && !collapsed ? (
            <div
              className={cn(
                "truncate pt-1 pr-3 pb-1 text-[11px] font-medium tracking-wide text-sidebar-foreground/45",
                ROW_PL,
              )}
            >
              {section.label}
            </div>
          ) : null}
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => (
              <li key={item.key}>
                <SidebarRow
                  item={item}
                  collapsed={collapsed}
                  overlay={overlay}
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
  overlay: boolean;
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
  overlay,
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
    "group relative flex h-9 items-center gap-3 rounded-lg text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
    // The left inset is the SAME in both states (see "the icon column" at the
    // top of this file): the icon does not move while the bar animates. Folded,
    // the row closes down to 36px around its icon — 9 + 18 + 9.
    ROW_PL,
    collapsed ? cn(ROW_BOX, "gap-0 pr-[9px]") : "pr-3",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
    item.disabled && "pointer-events-none opacity-50",
  );

  const collapsedBadge = item.badgeCollapsed ?? item.badge;

  const inner = (
    <>
      {Icon ? <Icon className="h-[18px] w-[18px] shrink-0" /> : null}
      {/* `truncate` (so no wrapping): the label stays mounted while the bar
          animates from 56 to 256px, and without it a long one folds onto three
          lines in the first frames of the unfold before flattening back out.
          Cut short, it is simply clipped by the bar's `overflow-hidden`. */}
      {!collapsed ? <span className="min-w-0 truncate">{item.label}</span> : null}
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
        <span className="absolute top-1 right-1 flex items-center justify-center rounded-full bg-sidebar">
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
      <Tooltip
        delayDuration={overlay ? RAIL_TOOLTIP_DELAY_MS : undefined}
        disableHoverableContent={overlay}
      >
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
  /** Left out, it follows the sidebar it sits in (`useSidebarState`). */
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
  collapsed: collapsedProp,
  active = false,
  trailingIcon: TrailingIcon,
  linkComponent: Link,
  className,
}: SidebarFooterRowProps) {
  const { collapsed: fromContext, overlay } = useSidebarState();
  const collapsed = collapsedProp ?? fromContext;

  const rowClass = cn(
    "flex h-9 items-center rounded-lg text-sm font-medium outline-none transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
    active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground",
    ROW_PL,
    collapsed ? cn(ROW_BOX, "justify-center pr-[9px]") : "w-full gap-3 pr-3 text-left",
    className,
  );

  const inner = (
    <>
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && TrailingIcon && (
        <TrailingIcon className="size-4 shrink-0" />
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
      <Tooltip
        delayDuration={overlay ? RAIL_TOOLTIP_DELAY_MS : undefined}
        disableHoverableContent={overlay}
      >
        <TooltipTrigger asChild>{row}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return row;
}
