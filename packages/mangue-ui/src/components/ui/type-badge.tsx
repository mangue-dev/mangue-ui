import * as React from "react"
import { Camera, Clapperboard, Lock, Scissors } from "lucide-react"

import { cn } from "../../lib/utils"

export type TypeBadgeKind = "video" | "clip" | "screenshot" | "locked"

const KIND_STYLES: Record<TypeBadgeKind, { Icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  video: {
    Icon: Clapperboard,
    classes:
      "bg-surface-type-video text-violet-600 dark:text-violet-400",
  },
  clip: {
    Icon: Scissors,
    classes:
      "bg-surface-type-clip text-emerald-600 dark:text-emerald-400",
  },
  screenshot: {
    Icon: Camera,
    classes:
      "bg-surface-type-screenshot text-sky-600 dark:text-sky-400",
  },
  locked: {
    Icon: Lock,
    classes:
      "bg-surface-type-locked text-orange-600 dark:text-orange-400",
  },
}

export interface TypeBadgeProps extends React.ComponentProps<"span"> {
  kind: TypeBadgeKind
  label?: React.ReactNode
  showLabel?: boolean
}

export function TypeBadge({
  kind,
  label,
  showLabel = true,
  className,
  ...props
}: TypeBadgeProps) {
  const { Icon, classes } = KIND_STYLES[kind]

  return (
    <span
      data-slot="type-badge"
      data-kind={kind}
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold leading-none",
        classes,
        className
      )}
      {...props}
    >
      <Icon className="h-3.5 w-3.5" />
      {showLabel && label}
    </span>
  )
}
