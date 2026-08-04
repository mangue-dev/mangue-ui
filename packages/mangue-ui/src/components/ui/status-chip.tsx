import * as React from "react"

import { cn } from "../../lib/utils"

export type StatusChipTone = "neutral" | "info" | "success" | "warning" | "danger"

const TONE_CLASSES: Record<StatusChipTone, string> = {
  neutral: "bg-control text-foreground border-border",
  info: "bg-brand/10 text-brand border-brand/20 dark:text-brand",
  success:
    "bg-success/10 text-success border-success/20 dark:bg-success/15",
  warning:
    "bg-warning/15 text-warning-foreground border-warning/30 dark:bg-warning/20 dark:text-warning",
  danger:
    "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/15",
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
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap leading-none [&_svg]:size-3.5 [&_svg]:shrink-0",
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
