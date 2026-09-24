import * as React from "react"

import { cn } from "../../lib/utils"

export type StatusChipTone = "neutral" | "info" | "success" | "warning" | "danger"

const TONE_CLASSES: Record<StatusChipTone, string> = {
  neutral: "bg-control text-foreground",
  info: "bg-surface-info text-brand",
  success: "bg-surface-success text-success",
  warning: "bg-surface-warning text-warning-foreground dark:text-warning",
  danger: "bg-surface-danger text-destructive",
}

export interface StatusChipProps extends React.ComponentProps<"span"> {
  tone?: StatusChipTone
  icon?: React.ReactNode
}

export function StatusChip({
  tone = "neutral",
  icon,
  className,
  children,
  ...props
}: StatusChipProps) {
  return (
    <span
      data-slot="status-chip"
      data-tone={tone}
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium whitespace-nowrap leading-none [&_svg]:size-3.5 [&_svg]:shrink-0",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  )
}
