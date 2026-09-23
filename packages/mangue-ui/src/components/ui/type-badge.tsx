import * as React from "react"
import { Camera, Clapperboard, Lock, Scissors } from "lucide-react"

import { cn } from "../../lib/utils"

export type TypeBadgeKind = "video" | "clip" | "screenshot" | "locked"

const KIND_STYLES: Record<TypeBadgeKind, { Icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  video: {
    Icon: Clapperboard,
    classes:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  clip: {
    Icon: Scissors,
    classes:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  screenshot: {
    Icon: Camera,
    classes:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  locked: {
    Icon: Lock,
    classes:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400",
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
        "inline-flex h-7 items-center gap-1.5 shrink-0 px-3 rounded-full text-xs font-semibold leading-none",
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
