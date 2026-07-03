import * as React from "react"
import { Camera, Clapperboard, Lock, Scissors } from "lucide-react"

import { cn } from "../../lib/utils"

export type TypeBadgeKind = "video" | "clip" | "screenshot" | "locked"

const KIND_STYLES: Record<TypeBadgeKind, { Icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  video: {
    Icon: Clapperboard,
    classes:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  clip: {
    Icon: Scissors,
    classes:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  screenshot: {
    Icon: Camera,
    classes:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  locked: {
    Icon: Lock,
    classes:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
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
        "inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-full text-xs font-semibold leading-none border",
        classes,
        className
      )}
      {...props}
    >
      <Icon className="h-3 w-3" />
      {showLabel && label}
    </span>
  )
}
