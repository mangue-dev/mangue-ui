"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

/**
 * Why a tooltip reopens on its own when you come back to the tab.
 *
 * Radix opens the tooltip on ANY `focus` of the trigger, unconditionally
 * (`@radix-ui/react-tooltip`: `onFocus: … if (!isPointerDownRef.current)
 * context.onOpen()`). But the browser RESTORES focus to whatever element held
 * it when the tab — or the window — becomes active again: Chrome then fires a
 * `focus` that nothing tells apart from a user pressing Tab. So a tooltip pops
 * open on a button nobody hovered, minutes after the last interaction. Radix
 * knows and won't fix it (primitives#705: the focus comes from the browser, not
 * from them), so the guard belongs here, once, for every consumer.
 *
 * Two rules:
 *
 *  1. **Restored focus is not a gesture.** A `focus` arriving right after the
 *     window regained control is the browser tidying up. The element must still
 *     take focus — otherwise the keyboard starts over — but it opens nothing.
 *  2. **A focus that isn't visible opens nothing.** `:focus-visible` is exactly
 *     the question "does the browser think the user is navigating by keyboard?".
 *     Focus landing from a click, or handed back by code closing a popover, is
 *     not visible, and a tooltip opening there answers no one's request.
 *
 * Untouched: hover, and real keyboard tabbing — a genuine Tab is preceded by a
 * `keydown`, which clears the flag, and lands as `:focus-visible`.
 */
let refocusPending = false
let guardInstalled = false

function installFocusGuard() {
  if (guardInstalled || typeof window === "undefined") return
  guardInstalled = true
  const markRefocus = () => {
    refocusPending = true
  }
  window.addEventListener("focus", markRefocus)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") markRefocus()
  })
  // A gesture proves the user is driving, and gives the next focus back its
  // usual meaning. Capture phase: the flag must drop before the `focus` that
  // this very gesture triggers.
  const markGesture = () => {
    refocusPending = false
  }
  window.addEventListener("keydown", markGesture, { capture: true })
  window.addEventListener("pointerdown", markGesture, { capture: true })
}

/** Consumes the flag: the browser's tidying up concerns a single `focus`. */
function consumeRefocus() {
  const was = refocusPending
  refocusPending = false
  return was
}

function isFocusVisible(element: Element) {
  try {
    return element.matches(":focus-visible")
  } catch {
    // A browser that doesn't know the selector falls back to the old behaviour.
    return true
  }
}

function TooltipTrigger({
  onFocus,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  React.useEffect(installFocusGuard, [])
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onFocus={(event) => {
        onFocus?.(event)
        if (event.defaultPrevented) return
        const restored = consumeRefocus()
        // `preventDefault` on a React synthetic event flags `defaultPrevented`
        // even though `focus` isn't cancelable, and that flag is what Radix's
        // `composeEventHandlers` reads to give up on opening. The element keeps
        // its focus: only the tooltip is held back.
        if (restored || !isFocusVisible(event.currentTarget))
          event.preventDefault()
      }}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 5,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-[60] max-w-[220px] rounded-md bg-foreground px-2.5 py-2 text-xs leading-snug text-background text-center animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
