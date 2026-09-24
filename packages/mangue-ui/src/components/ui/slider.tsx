"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

export interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  label?: React.ReactNode
  valueLabel?: React.ReactNode
  tickCount?: number
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  valueLabel,
  tickCount = 5,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SliderProps) {
  const values = React.useMemo(
    () => value ?? defaultValue ?? [min],
    [value, defaultValue, min]
  )
  const resolvedDefaultValue = defaultValue ?? [min]
  const normalizedTickCount = Math.max(0, Math.floor(tickCount))
  const thumbLabel =
    ariaLabel ?? (typeof label === "string" ? label : undefined)
  const thumbValueText =
    typeof valueLabel === "string" || typeof valueLabel === "number"
      ? String(valueLabel)
      : undefined
  const hasLabels = label !== undefined || valueLabel !== undefined

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={resolvedDefaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-horizontal:cursor-ew-resize data-vertical:cursor-ns-resize data-disabled:cursor-not-allowed data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-2xl bg-control data-horizontal:h-11 data-horizontal:w-full data-vertical:h-full data-vertical:w-11 md:data-horizontal:h-9 md:data-vertical:w-9"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-control-hover select-none data-horizontal:h-full data-vertical:w-full"
        />
        {hasLabels ? (
          <span
            data-slot="slider-labels"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-3.5 text-base font-medium leading-none text-foreground data-vertical:hidden md:text-sm"
          >
            <span>{label}</span>
            <span className="tabular-nums">{valueLabel}</span>
          </span>
        ) : null}
        {normalizedTickCount > 0 ? (
          <span
            data-slot="slider-ticks"
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 z-10 flex items-center justify-between data-vertical:hidden",
              hasLabels ? "left-[27%] right-[27%]" : "inset-x-0"
            )}
          >
            {Array.from({ length: normalizedTickCount }, (_, index) => (
              <span
                key={index}
                className="h-4 w-px bg-foreground/15"
              />
            ))}
          </span>
        ) : null}
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-valuetext={thumbValueText}
          className="relative block size-4 shrink-0 rounded-full border-0 bg-transparent outline-none ring-0 transition-[box-shadow] after:absolute after:left-1/2 after:top-1/2 after:h-4 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-foreground/20 after:content-[''] hover:after:bg-foreground/40 focus-visible:ring-3 focus-visible:ring-ring/50 data-horizontal:cursor-ew-resize data-vertical:cursor-ns-resize data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
