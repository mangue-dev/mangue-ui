"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { transitions } from "../../lib/motion"
import { Skeleton } from "../ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

/**
 * The settings page layout: a centered column with a page header, an optional
 * top slot, then a sticky vertical tab rail beside the content pane.
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
  content: React.ReactNode
}

/** The width of a settings column. Exported so a route skeleton can match it. */
export const SETTINGS_LAYOUT_MAX_WIDTH = "max-w-[1040px]"

function SettingsLayout({
  title,
  description,
  topSlot,
  tabs,
  value,
  defaultValue,
  onValueChange,
  maxWidthClassName = SETTINGS_LAYOUT_MAX_WIDTH,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  /** Rendered between the header and the tab grid (banners, a composer…). */
  topSlot?: React.ReactNode
  tabs: SettingsTabItem[]
  /** Controlled active tab. Omit to let the layout hold its own. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  maxWidthClassName?: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  // `layoutId` is GLOBAL to framer-motion: two rails mounted at once (a route
  // transition that overlaps two screens) would steal each other's pill. One id
  // per instance closes that door.
  const pillId = `settings-tab-pill-${React.useId()}`

  const visibleTabs = React.useMemo(
    () => tabs.filter((t) => !t.hidden),
    [tabs]
  )
  const fallback = React.useMemo(() => {
    const values = new Set(visibleTabs.map((t) => t.value))
    return defaultValue && values.has(defaultValue)
      ? defaultValue
      : (visibleTabs[0]?.value ?? "")
  }, [defaultValue, visibleTabs])

  const [internal, setInternal] = React.useState(fallback)
  const active = value ?? internal
  const handleValueChange = React.useCallback(
    (next: string) => {
      setInternal(next)
      onValueChange?.(next)
    },
    [onValueChange]
  )

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
                    "w-full justify-start gap-2 px-2.5 py-2",
                    "data-active:bg-transparent dark:data-active:bg-transparent",
                    "dark:data-active:border-transparent",
                    "group-data-[variant=default]/tabs-list:data-active:shadow-none"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={pillId}
                      aria-hidden
                      className="absolute inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-control"
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
          </TabsList>
        </aside>

        <div className="min-w-0">
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
        </div>
      </Tabs>
    </div>
  )
}

/**
 * The loading state of a settings page, laid out like the real thing — rail on
 * the left, cards on the right. A skeleton that doesn't fall in the same place
 * makes the page jump when it resolves, which is worse than the blank it fills.
 */
function SettingsLayoutSkeleton({
  tabs = 6,
  rows = 3,
  topSlot = true,
  maxWidthClassName = SETTINGS_LAYOUT_MAX_WIDTH,
  className,
}: {
  tabs?: number
  rows?: number
  topSlot?: boolean
  maxWidthClassName?: string
  className?: string
}) {
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
        <div className="flex min-w-0 flex-col gap-4">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export { SettingsLayout, SettingsLayoutSkeleton }
