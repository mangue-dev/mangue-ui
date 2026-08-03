"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/**
 * The small ⓘ that opens the long explanation — it takes prose OUT of the screen.
 *
 * A settings screen is read at a glance: what is on, what is picked, what it
 * costs. The paragraph explaining *why* has a place, but not between one switch
 * and the next — put it there and the page stops looking like an organised list
 * and starts looking like text. So it lives here, one click away.
 *
 * `label` is what a screen reader announces and what the trigger is named. It
 * defaults to English, like every other string in this library.
 */
function HelpHint({
  children,
  label = "Learn more",
  align = "start",
  className,
  contentClassName,
}: {
  children: React.ReactNode
  label?: string
  align?: "start" | "center" | "end"
  className?: string
  contentClassName?: string
}) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 outline-hidden transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <Info className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          "max-w-xs text-xs leading-relaxed text-muted-foreground",
          contentClassName
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export { HelpHint }
