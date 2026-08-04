"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, type LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { transitions } from "../../lib/motion"
import { useScrollFade } from "../../lib/hooks/use-scroll-fade"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  SecondarySidebar,
  useSecondarySidebarContext,
} from "../shell/secondary-sidebar"
import { matchesFilter } from "../shell/sidebar-filter-field"
import { settingsSectionAnchor } from "./settings-group"

/**
 * The settings page layout, in two shapes:
 *
 * - **`sidebar`** — the tab rail is a SECONDARY SIDEBAR: it leaves the content
 *   column for the navigation column, full height, left of the header — the same
 *   place and the same grammar as any other list-and-detail screen. The screen's
 *   title is that pane's title row, so it is no longer written above the cards
 *   where it doubled the breadcrumb. This is what you get inside a
 *   `<SecondarySidebarProvider>`.
 * - **`inline`** — the older shape: a centred column with a page header and a
 *   sticky rail beside the cards. What a settings screen looks like in an app
 *   with no second navigation level.
 *
 * **Controlled or not.** Pass `value` + `onValueChange` to drive the active tab
 * yourself — that is how you make tabs deep-linkable (`?tab=`), survive a
 * reload, and emit analytics. The library owns no router: read the query param
 * in your app (under a `<Suspense>` boundary if the route is prerendered) and
 * hand the result down. Omit `value` and the layout keeps its own state from
 * `defaultValue`.
 *
 * The active tab is marked by a pill that SLIDES between tabs (a shared
 * `layoutId`, not a class that toggles) and holds still under
 * `prefers-reduced-motion`.
 */

export type SettingsTabItem = {
  value: string
  label: string
  icon?: LucideIcon
  /** Kept out of the rail entirely — for a tab gated by a plan or a role. */
  hidden?: boolean
  /**
   * Attention dot on the tab — something inside is incomplete. The string is
   * both the tooltip and what a screen reader announces: the dot alone would
   * teach nothing to whoever cannot see it.
   */
  indicator?: string
  /** Extra words the rail's filter should match on ("theme" finding "Appearance"). */
  keywords?: string[]
  content: React.ReactNode
}

/**
 * One CARD of the screen, named. A tab answers "where is it?", but what people
 * type is the name of the card — "cadence", "danger zone", "act on your behalf"
 * — and none of those is a tab. Give the layout this catalogue and the rail's
 * filter searches cards: picking one opens the right tab, scrolls to it and
 * rings it. The ids must match the `sectionId` of your `<SettingsGroup>`s.
 */
export type SettingsSectionItem = {
  id: string
  title: string
  /** The `value` of the tab that holds it. */
  tab: string
  icon?: LucideIcon
  keywords?: string[]
}

export type SettingsLayoutLabels = {
  /** Names the list, and says how big it is: "Filter 18 settings…". */
  filterPlaceholder: (count: number) => string
  clearFilter: string
  noMatch: string
  /** Accessible name of the mobile back button, i.e. the rail's name. */
  back: string
}

const DEFAULT_LABELS: SettingsLayoutLabels = {
  filterPlaceholder: (count) => `Filter ${count} settings…`,
  clearFilter: "Clear filter",
  noMatch: "No match.",
  back: "Settings",
}

/** The width of a settings column. Exported so a route skeleton can match it. */
export const SETTINGS_LAYOUT_MAX_WIDTH = "max-w-[1040px]"
/**
 * The width of the card column once the rail has moved out into the secondary
 * sidebar — the same centred column as any other detail pane.
 */
export const SETTINGS_CONTENT_MAX_WIDTH = "max-w-3xl"

/** How long the ring lasts: the time it takes to land an eye on it, no more. */
const FOCUS_HIGHLIGHT_MS = 2000
/** Past that, the requested card is not coming (a tab without it, rights that
 *  never render it, a failed request): stop watching for it. */
const FOCUS_WAIT_MS = 5000

/**
 * Scrolls to the requested card and rings it.
 *
 * It almost never exists on the frame the request arrives: the tab has just
 * changed, and most cards wait on a request. Hence the watch rather than a
 * single try — without it one card in two received nothing and the reader landed
 * at the top of a tab, hunting for what they had just named.
 */
function useSectionFocus(
  target: { id: string; nonce: number } | null,
  reduceMotion: boolean
) {
  React.useEffect(() => {
    if (!target) return
    const domId = settingsSectionAnchor(target.id)
    const deadline = Date.now() + FOCUS_WAIT_MS
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let marked: HTMLElement | null = null

    const look = () => {
      const el = document.getElementById(domId)
      if (!el) {
        if (Date.now() < deadline) frame = requestAnimationFrame(look)
        return
      }
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      })
      el.setAttribute("data-settings-focus", "")
      marked = el
      timer = setTimeout(
        () => el.removeAttribute("data-settings-focus"),
        FOCUS_HIGHLIGHT_MS
      )
    }
    frame = requestAnimationFrame(look)

    return () => {
      cancelAnimationFrame(frame)
      if (timer) clearTimeout(timer)
      marked?.removeAttribute("data-settings-focus")
    }
  }, [target, reduceMotion])
}

export type SettingsLayoutProps = {
  title: React.ReactNode
  /** Shown under the title in `inline` shape only — the `sidebar` one has no
   *  page header to hang it from. */
  description?: React.ReactNode
  /** Rendered above the tab content (banners, a composer…). */
  topSlot?: React.ReactNode
  tabs: SettingsTabItem[]
  /** The card catalogue the rail's filter searches. Without it the filter falls
   *  back to the tabs themselves. */
  sections?: SettingsSectionItem[]
  /** Controlled active tab. Omit to let the layout hold its own. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * `auto` (default) takes the `sidebar` shape inside a
   * `<SecondarySidebarProvider>` and the `inline` one everywhere else.
   */
  variant?: "auto" | "sidebar" | "inline"
  /**
   * Reveal a card by id — wire your `?section=` param here. The layout switches
   * to the tab holding it, scrolls to it and rings it, then calls
   * `onSectionFocused` so you can drop the param from the URL. Asking for the
   * same id twice replays it.
   */
  focusSection?: string | null
  onSectionFocused?: (id: string) => void
  /**
   * Below `md`, rail and cards take turns full screen. Start on the cards when
   * the URL named a tab: you arrived from a link, not from the rail.
   */
  openOnMobile?: boolean
  /** `inline` shape: the width of the whole screen. */
  maxWidthClassName?: string
  /** `sidebar` shape: the width of the card column. */
  contentMaxWidthClassName?: string
  labels?: Partial<SettingsLayoutLabels>
  className?: string
}

function SettingsLayout({
  title,
  description,
  topSlot,
  tabs,
  sections,
  value,
  defaultValue,
  onValueChange,
  variant = "auto",
  focusSection,
  onSectionFocused,
  openOnMobile = false,
  maxWidthClassName = SETTINGS_LAYOUT_MAX_WIDTH,
  contentMaxWidthClassName = SETTINGS_CONTENT_MAX_WIDTH,
  labels,
  className,
}: SettingsLayoutProps) {
  const reduceMotion = useReducedMotion()
  const hasChrome = useSecondarySidebarContext() !== null
  const railed = variant === "sidebar" || (variant === "auto" && hasChrome)
  const t = { ...DEFAULT_LABELS, ...labels }

  // `layoutId` is GLOBAL to framer-motion: two rails mounted at once (a route
  // transition that overlaps two screens) would steal each other's pill. One id
  // per instance closes that door.
  const pillId = `settings-tab-pill-${React.useId()}`

  const visibleTabs = React.useMemo(
    () => tabs.filter((tab) => !tab.hidden),
    [tabs]
  )
  const tabValues = React.useMemo(
    () => new Set(visibleTabs.map((tab) => tab.value)),
    [visibleTabs]
  )
  const fallback = React.useMemo(() => {
    return defaultValue && tabValues.has(defaultValue)
      ? defaultValue
      : (visibleTabs[0]?.value ?? "")
  }, [defaultValue, tabValues, visibleTabs])

  const [internal, setInternal] = React.useState(fallback)
  const active = value ?? internal
  // Below `md`, rail and cards take turns full screen: picking a tab is what
  // opens the cards. Declared here because `handleValueChange` needs it.
  const [mobileDetail, setMobileDetail] = React.useState(openOnMobile)
  const handleValueChange = React.useCallback(
    (next: string) => {
      setInternal(next)
      setMobileDetail(true)
      onValueChange?.(next)
    },
    [onValueChange]
  )

  // ── The rail's filter ────────────────────────────────────────────────────
  // Cards when a catalogue is given, tabs otherwise: one code path, because
  // "narrow this column" is one gesture whatever it lists.
  const [query, setQuery] = React.useState("")
  const searchable = React.useMemo<SettingsSectionItem[]>(() => {
    const catalogue =
      sections ??
      visibleTabs.map((tab) => ({
        id: tab.value,
        title: tab.label,
        tab: tab.value,
        icon: tab.icon,
        keywords: tab.keywords,
      }))
    // A hidden tab (rights, plan) renders no card: sending someone there would
    // land them on the default tab with nothing, and the watch would stare at a
    // missing anchor for five seconds.
    return catalogue.filter((s) => tabValues.has(s.tab))
  }, [sections, visibleTabs, tabValues])

  const tabLabel = React.useCallback(
    (tabValue: string) =>
      visibleTabs.find((tab) => tab.value === tabValue)?.label ?? "",
    [visibleTabs]
  )

  const matches = React.useMemo(() => {
    if (!query.trim()) return []
    return searchable.filter((s) =>
      matchesFilter(query, [s.title, tabLabel(s.tab), ...(s.keywords ?? [])])
    )
  }, [query, searchable, tabLabel])

  // ── Reaching one card by name ────────────────────────────────────────────
  const [target, setTarget] = React.useState<{
    id: string
    nonce: number
  } | null>(null)
  useSectionFocus(target, !!reduceMotion)

  const openSection = React.useCallback(
    (section: SettingsSectionItem) => {
      setQuery("")
      handleValueChange(section.tab)
      // A tab standing in for a card (no catalogue) has no anchor to ring.
      if (sections) {
        // A counter, not the id alone: asking for the same card TWICE must
        // scroll to it again, and its id has not changed.
        setTarget((prev) => ({
          id: section.id,
          nonce: (prev?.nonce ?? 0) + 1,
        }))
      }
    },
    [handleValueChange, sections]
  )

  // `focusSection` is CONSUMED on read, so switching tabs afterwards does not
  // drag it along and a reload does not replay a card nobody is looking for.
  const consumed = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!focusSection) {
      consumed.current = null
      return
    }
    if (consumed.current === focusSection) return
    consumed.current = focusSection
    const section = searchable.find((s) => s.id === focusSection)
    if (section) handleValueChange(section.tab)
    setTarget((prev) => ({
      id: focusSection,
      nonce: (prev?.nonce ?? 0) + 1,
    }))
    onSectionFocused?.(focusSection)
  }, [focusSection, searchable, handleValueChange, onSectionFocused])

  // Arriving from a link that names a card: the cards, not the rail.
  React.useEffect(() => {
    if (focusSection) setMobileDetail(true)
  }, [focusSection])
  const contentFade = useScrollFade<HTMLDivElement>()
  const activeLabel = tabLabel(active)

  const cards = (
    <>
      {visibleTabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          /* Spacing lives BETWEEN the cards: each group carries its own
             border, so a large `space-y` would open holes instead. */
          className="mt-0 flex flex-col gap-4"
        >
          {tab.content}
        </TabsContent>
      ))}
    </>
  )

  const rail = (
    <>
      {visibleTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.value === active
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            /* The active pill is drawn below, not by `data-active:bg-*`:
               a class cannot slide from one tab to the next, a shared
               element can. */
            className={cn(
              "w-full justify-start gap-2",
              railed ? "rounded-lg px-3 py-2.5" : "px-2.5 py-2",
              "data-active:bg-transparent dark:data-active:bg-transparent",
              "dark:data-active:border-transparent",
              "group-data-[variant=default]/tabs-list:data-active:shadow-none"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={pillId}
                aria-hidden
                className={cn(
                  "absolute inset-0",
                  railed
                    ? "rounded-lg bg-muted"
                    : "rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-control"
                )}
                transition={
                  reduceMotion ? { duration: 0 } : transitions.snappy
                }
              />
            )}
            {/* Positioned, so it paints ABOVE the pill (same stack, DOM
                order): without this span the absolute pill would cover
                the label, which is not positioned. */}
            <span className="relative flex min-w-0 flex-1 items-center gap-2">
              {Icon && <Icon className="size-4 shrink-0" />}
              <span className="truncate">{tab.label}</span>
              {tab.indicator && (
                <span
                  className="ml-auto flex items-center"
                  title={tab.indicator}
                >
                  <span
                    className="size-1.5 rounded-full bg-amber-500"
                    aria-hidden
                  />
                  <span className="sr-only">{tab.indicator}</span>
                </span>
              )}
            </span>
          </TabsTrigger>
        )
      })}
    </>
  )

  if (!railed) {
    return (
      <div
        data-slot="settings-layout"
        className={cn(
          "mx-auto w-full space-y-8 p-4 md:p-8",
          maxWidthClassName,
          className
        )}
      >
        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </header>

        {topSlot}

        <Tabs
          orientation="vertical"
          value={active}
          onValueChange={handleValueChange}
          className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-start md:gap-8"
        >
          <aside className="md:sticky md:top-4 md:self-start">
            <TabsList className="h-auto w-full items-stretch gap-0.5">
              {rail}
            </TabsList>
          </aside>

          <div className="flex min-w-0 flex-col gap-4">{cards}</div>
        </Tabs>
      </div>
    )
  }

  return (
    // The Tabs root is the screen's ROW: the rail leaves for the secondary
    // sidebar (through a portal, so it stays under this `Tabs` on the React side
    // — the Radix context follows, and so do the arrow keys) and the cards stay
    // on the right.
    <Tabs
      data-slot="settings-layout"
      orientation="vertical"
      value={active}
      onValueChange={handleValueChange}
      className={cn("flex h-full min-h-0 gap-0", className)}
    >
      <SecondarySidebar
        title={typeof title === "string" ? title : t.back}
        hiddenOnMobile={mobileDetail}
        filter={{
          value: query,
          onChange: setQuery,
          placeholder: t.filterPlaceholder(searchable.length),
          clearLabel: t.clearFilter,
        }}
      >
        {/* A running search REPLACES the rail: they are two answers to the same
            question — where to go — and stacking them would make a column with
            two lists in it. The rail comes back as soon as the field is empty. */}
        {query.trim() ? (
          matches.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t.noMatch}
            </p>
          ) : (
            <ul className="flex flex-col gap-1 px-2 pt-2 pb-4">
              {matches.map((section) => {
                const Icon = section.icon
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => openSection(section)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60"
                    >
                      {Icon && (
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {section.title}
                      </span>
                      {/* The tab that holds it, dimmed — the same reading as a
                          command palette row. */}
                      {sections && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {tabLabel(section.tab)}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )
        ) : (
          /* `flex-col` SPELT OUT, not through the Tabs orientation: the list is
             stacked by `group-data-vertical/tabs:flex-col`, a DESCENDANT
             selector — and the portal takes this list out of the `<Tabs>` DOM.
             The React context follows it, the CSS variant does not. Same reason
             for the `w-full justify-start` on each trigger above. */
          <TabsList
            onClick={() => setMobileDetail(true)}
            className="h-auto w-full flex-col items-stretch gap-1 rounded-none bg-transparent p-0 px-2 pt-2 pb-4"
          >
            {rail}
          </TabsList>
        )}
      </SecondarySidebar>

      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col md:flex",
          mobileDetail ? "flex" : "hidden"
        )}
      >
        {/* Panel header, MOBILE only: the way back to the rail and the name of
            the open tab. On desktop the rail is on screen and already highlights
            it — one more bar would have nothing to say, and would push the cards
            down to repeat it. */}
        <div className="flex shrink-0 items-center gap-2 px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t.back}
            onClick={() => setMobileDetail(false)}
          >
            <ChevronLeft />
          </Button>
          <span className="truncate text-sm font-medium">{activeLabel}</span>
        </div>

        <div
          ref={contentFade.ref}
          {...contentFade.scrollProps}
          className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-8 md:px-6 md:pt-6"
        >
          <div
            className={cn(
              "mx-auto flex flex-col gap-4",
              contentMaxWidthClassName
            )}
          >
            {topSlot}
            {cards}
          </div>
        </div>
      </div>
    </Tabs>
  )
}

/**
 * The loading state of a settings page, laid out like the real thing — rail on
 * the left, cards on the right. A skeleton that doesn't fall in the same place
 * makes the page jump when it resolves, which is worse than the blank it fills.
 *
 * In the `sidebar` shape it mounts a REAL `<SecondarySidebar>` rather than a
 * column that looks like one: mounting it is what rails the primary sidebar.
 * Without that, navigating to settings would unfold the primary and close the
 * gutter for the length of the load, only to reopen everything on arrival.
 */
function SettingsLayoutSkeleton({
  tabs = 6,
  rows = 3,
  topSlot = true,
  variant = "auto",
  maxWidthClassName = SETTINGS_LAYOUT_MAX_WIDTH,
  contentMaxWidthClassName = SETTINGS_CONTENT_MAX_WIDTH,
  className,
}: {
  tabs?: number
  rows?: number
  topSlot?: boolean
  variant?: "auto" | "sidebar" | "inline"
  maxWidthClassName?: string
  contentMaxWidthClassName?: string
  className?: string
}) {
  const hasChrome = useSecondarySidebarContext() !== null
  const railed = variant === "sidebar" || (variant === "auto" && hasChrome)

  const cards = Array.from({ length: rows }).map((_, i) => (
    <Skeleton key={i} className="h-32 rounded-xl" />
  ))

  if (railed) {
    return (
      <div className={cn("flex h-full min-h-0", className)}>
        <SecondarySidebar>
          <div className="flex flex-col gap-1 px-2 pt-2 pb-4">
            {Array.from({ length: tabs }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </SecondarySidebar>
        <div className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-8 md:px-6 md:pt-6">
            <div
              className={cn(
                "mx-auto flex flex-col gap-4",
                contentMaxWidthClassName
              )}
            >
              {topSlot && <Skeleton className="h-14 w-full rounded-xl" />}
              {cards}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "mx-auto w-full space-y-8 p-4 md:p-8",
        maxWidthClassName,
        className
      )}
    >
      <Skeleton className="h-8 w-56" />
      {topSlot && <Skeleton className="h-14 w-full rounded-xl" />}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-start md:gap-8">
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: tabs }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-4">{cards}</div>
      </div>
    </div>
  )
}

export { SettingsLayout, SettingsLayoutSkeleton }
