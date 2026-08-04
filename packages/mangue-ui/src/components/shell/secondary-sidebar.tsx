"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";

import { transitions } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { useIsMobileLayout } from "../../lib/hooks/use-mobile";
import {
  SidebarFilterField,
  type SidebarFilterFieldProps,
} from "./sidebar-filter-field";

/** Width of the column (`w-80`), shared by the pane and its gutter. */
export const SECONDARY_SIDEBAR_WIDTH = 320;

/**
 * The SECONDARY sidebar — a page's own navigation column: the list of pull
 * requests, of agent sessions, of triaged items, of settings sections.
 *
 * It is WRITTEN inside the page, together with the selection state that drives
 * the detail next to it; it is DISPLAYED in the app chrome, left of the header,
 * full height, flush against the primary sidebar. It is a second level of
 * navigation, not a piece of the content — so the header and its breadcrumb
 * start AFTER it, just as they start after the primary one.
 *
 * This context is the thread between the two halves: a teleport target (`slot`,
 * placed by the chrome) and a count of mounted panes (`present`, which puts the
 * primary sidebar into rail mode). The portal is what lets the pane change place
 * in the DOM without leaving its component: selection, filters and queries stay
 * where you read them.
 *
 * Below `desktop` (1200px) none of this applies: the pane stays where it is
 * written, inside the page, and the mobile behaviour does not move.
 */
export interface SecondarySidebarContextValue {
  /** The chrome element pages teleport their pane into (desktop only). */
  slot: HTMLElement | null;
  setSlot: (el: HTMLElement | null) => void;
  /** Is a page mounting a secondary sidebar right now? */
  present: boolean;
  /** Call on mount; the returned function takes the pane back out of the count. */
  register: () => () => void;
  /**
   * Should the chrome be laid out for a secondary sidebar? `present` is the
   * truth and suffices — EXCEPT before hydration, where nothing is mounted yet.
   * That is what the provider's `reserve` answers (see below).
   */
  expected: boolean;
}

const SecondarySidebarContext =
  React.createContext<SecondarySidebarContextValue | null>(null);

/** The raw context, `null` outside a provider. For the shell's own plumbing. */
export function useSecondarySidebarContext(): SecondarySidebarContextValue | null {
  return React.useContext(SecondarySidebarContext);
}

export function useSecondarySidebar(): SecondarySidebarContextValue {
  const ctx = React.useContext(SecondarySidebarContext);
  if (!ctx) {
    throw new Error(
      "useSecondarySidebar must be used within a <SecondarySidebarProvider>",
    );
  }
  return ctx;
}

/**
 * Is the chrome laid out for a secondary sidebar right now? `false` outside a
 * provider, so a plain single-sidebar app can call it without a guard — this is
 * what `<Sidebar>` uses to decide, on its own, whether to go into rail mode.
 */
export function useSecondarySidebarExpected(): boolean {
  return React.useContext(SecondarySidebarContext)?.expected ?? false;
}

export function SecondarySidebarProvider({
  reserve = false,
  children,
}: {
  /**
   * "This route is known to mount a secondary sidebar" — pass the answer your
   * router can give BEFORE hydration (a table of paths, a layout segment).
   *
   * The count below is the truth and it suffices, except on the server, where no
   * pane is mounted yet: without this hint the server HTML would ship with the
   * primary sidebar expanded and the content full width, only to re-lay
   * everything out at hydration. It does not have to be exact — a forgotten
   * route costs one re-layout on first paint, not a bug.
   */
  reserve?: boolean;
  children: React.ReactNode;
}) {
  const [slot, setSlot] = React.useState<HTMLElement | null>(null);
  // A COUNT, not a boolean: between two pages that both have a secondary
  // sidebar, the old one unmounts AFTER the new one mounts. A boolean would dip
  // to false in between, for the length of one frame — enough to see the primary
  // sidebar unfold and fold straight back.
  const [count, setCount] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const register = React.useCallback(() => {
    setCount((c) => c + 1);
    return () => setCount((c) => c - 1);
  }, []);

  const present = count > 0;
  const value = React.useMemo<SecondarySidebarContextValue>(
    () => ({
      slot,
      setSlot,
      present,
      register,
      expected: present || (!hydrated && reserve),
    }),
    [slot, present, register, hydrated, reserve],
  );

  return (
    <SecondarySidebarContext.Provider value={value}>
      {children}
    </SecondarySidebarContext.Provider>
  );
}

/**
 * Registration must happen BEFORE paint: it is what decides whether the primary
 * sidebar is railed. Through an ordinary effect you would see the primary
 * expanded for one frame on every navigation to a two-sidebar page.
 */
const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface SecondarySidebarProps {
  /**
   * The name of the column. It is not WRITTEN on the title row — the breadcrumb
   * already carries it, on the same horizontal band 340px away — but it stays
   * the pane's accessible label, and the fallback when the page offers no
   * filter. Omitted by route SKELETONS, which hold the pane's place while the
   * screen loads: without them the primary sidebar would unfold and the gutter
   * close on every navigation, only to reopen half a second later.
   */
  title?: string;
  /**
   * The list's text filter, which takes over the title row.
   *
   * Passed as DATA rather than as a `ReactNode`: every screen with a secondary
   * sidebar must offer the same gesture, in the same place, with the same look —
   * a `ReactNode` would let each of them reinvent its own version.
   *
   * There is NO counter next to it: the number of items belongs in the
   * placeholder ("Filter 12 pull requests…").
   */
  filter?: Omit<SidebarFilterFieldProps, "className">;
  /** Title-row actions (filters, a create button…), pushed to the right. */
  actions?: React.ReactNode;
  /**
   * Below `md`, list and detail take turns full screen: pass the page's "the
   * detail is open" state here. No effect above `md`.
   */
  hiddenOnMobile?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Two renders, one component:
 *
 * - **≥ 1200px**: teleported into the chrome, full height, left of the header.
 *   Its title row is the height of the header and carries the same bottom
 *   border — a single horizontal line crosses the screen.
 * - **< 1200px**: rendered in place — a column of the page from `md` up, the
 *   whole page below, with `hiddenOnMobile` yielding it to the detail.
 */
export function SecondarySidebar({
  title,
  filter,
  actions,
  hiddenOnMobile,
  className,
  children,
}: SecondarySidebarProps) {
  const { slot, register } = useSecondarySidebar();
  const isMobileLayout = useIsMobileLayout();
  // Nothing on the server: the room to take in the chrome is reserved there by
  // the route (the provider's `reserve`), and rendering the pane here before
  // knowing where it goes would diverge from the server HTML.
  const [mounted, setMounted] = React.useState(false);

  useIsoLayoutEffect(() => {
    setMounted(true);
    return register();
  }, [register]);

  if (!mounted) return null;

  const hoisted = !isMobileLayout && slot !== null;

  const aside = (
    <aside
      aria-label={title}
      className={cn(
        "min-h-0 flex-col",
        hoisted
          ? "flex h-full w-full border-r border-sidebar-border bg-sidebar"
          : cn(
              "w-full shrink-0 border-border md:flex md:w-80 md:border-r",
              hiddenOnMobile ? "hidden" : "flex",
            ),
        className,
      )}
    >
      {/* The title row COMMANDS the column, it does not name it: the list's
          filter, what narrows it, what can be created in it. It is the pane's
          only pinned band — everything that drives the list belongs here, and
          not in `children`, which scrolls away with it. */}
      <div className="flex h-[60px] shrink-0 items-center gap-2 border-b border-border px-4">
        {filter ? (
          <SidebarFilterField {...filter} />
        ) : title ? (
          <h1 className="min-w-0 flex-1 truncate font-display text-lg font-semibold tracking-tight">
            {title}
          </h1>
        ) : (
          <div className="flex-1" />
        )}
        {actions ? (
          <div className="flex shrink-0 items-center">{actions}</div>
        ) : null}
      </div>
      <div className="scrollbar-quiet flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </aside>
  );

  return hoisted ? createPortal(aside, slot) : aside;
}

/**
 * The landing point, placed by the chrome between the primary sidebar and the
 * header + content column. Empty, it takes no room; `expected` gives it its
 * width before the page has mounted its pane (first paint), so the content does
 * not start full width and then shrink.
 *
 * It also carries half of the slide between the two modes: its gutter opens and
 * closes (0 ↔ 320) on the SAME curve as the primary sidebar's width
 * (`transitions.shell`), and the header, the breadcrumb and the content follow
 * as one block. The pane inside keeps its width for the whole trip — the gutter
 * uncovers or covers it, it never squeezes.
 *
 * It is painted in the SIDEBAR's colours rather than left transparent: on the
 * way out of a two-sidebar page, the page unmounts at once and the gutter is
 * left empty for the 320ms of its closing. Without a background you saw the
 * chrome's `bg-background` through it — a light band opening between the primary
 * sidebar and the header, both of them `bg-sidebar`. With it, the column closes
 * like a shutter, with no hole.
 *
 * `<AppShell>` renders this on its own as soon as a `<SecondarySidebarProvider>`
 * is above it; you only place it by hand in a custom chrome.
 */
export function SecondarySidebarSlot({ className }: { className?: string }) {
  const { setSlot, expected } = useSecondarySidebar();
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(
        "relative h-full shrink-0 overflow-hidden bg-sidebar",
        className,
      )}
      // Explicit `initial`: that is the value framer writes into the server
      // HTML, and it is what reserves the column on first paint (see the
      // provider's `reserve`).
      initial={{ width: expected ? SECONDARY_SIDEBAR_WIDTH : 0 }}
      animate={{ width: expected ? SECONDARY_SIDEBAR_WIDTH : 0 }}
      transition={reduce ? { duration: 0 } : transitions.shell}
    >
      {/* The line that runs under the header and under the pane's title row,
          replayed here for the same reason: emptied, the gutter would break it
          across its whole width while it closes.
          It passes BEHIND the pane (which is `relative`, so it paints over it),
          and above all not on top: `--border` is 8% white in dark theme, and two
          stacked lines make one at 15% — a brighter line exactly as wide as the
          pane, in the middle of a line that crosses the whole screen. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[60px] border-b border-border"
      />
      <div
        ref={setSlot}
        className="relative h-full"
        style={{ width: SECONDARY_SIDEBAR_WIDTH }}
      />
    </motion.div>
  );
}
