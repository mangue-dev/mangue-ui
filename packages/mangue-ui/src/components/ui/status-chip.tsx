import * as React from "react"

import { cn } from "../../lib/utils"

export type StatusChipTone = "neutral" | "info" | "success" | "warning" | "danger"
export type StatusChipSize = "sm" | "default"

const TONE_CLASSES: Record<StatusChipTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-brand/10 text-brand border-brand/20 dark:text-brand",
  success:
    "bg-success/10 text-success border-success/20 dark:bg-success/15",
  warning:
    "bg-warning/15 text-warning-foreground border-warning/30 dark:bg-warning/20 dark:text-warning",
  danger:
    "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/15",
}

const SIZE_CLASSES: Record<StatusChipSize, string> = {
  sm: "h-6 px-2.5 text-2xs gap-1 [&_svg]:size-3",
  default: "h-7 px-3 text-xs gap-1.5 [&_svg]:size-3.5",
}

export interface StatusChipProps extends React.ComponentProps<"span"> {
  tone?: StatusChipTone
  size?: StatusChipSize
  icon?: React.ReactNode
}

export function StatusChip({
  tone = "neutral",
  size = "default",
  icon,
  className,
  children,
  ...props
}: StatusChipProps) {
  return (
    <span
      data-slot="status-chip"
      data-tone={tone}
      data-size={size}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border font-medium whitespace-nowrap leading-none [&_svg]:shrink-0",
        SIZE_CLASSES[size],
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
