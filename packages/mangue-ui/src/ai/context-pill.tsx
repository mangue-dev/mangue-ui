"use client";

// The AI context pill: what the assistant has in front of it, one thing per
// pill.
//
// Two details carry the whole look:
//
//  • CONCENTRIC RADII. The icon square is a child of the pill, so its radius is
//    "the pill's radius − the padding". The pill has p-1 (4px): at `rounded-md`
//    (14px) the icon sits at 10px, at `rounded-full` it is round too
//    (14 − 4 = 10 = half of its 20px). A fixed-radius square inside a round
//    pill is exactly the mistake this corrects.
//
//  • THE EYE. Ambient context is not an attachment: you do not remove it, you
//    ignore it. The eye appears on hover, dims the pill (grey, with the crossed
//    eye left visible to say there is a way back), and the matching field
//    leaves the context that gets sent. What was pinned by hand, on the other
//    hand, is removed for good — a cross.

import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { cn } from "../lib/utils";

/** Inner radius = the pill's radius − its padding (4px). */
const INNER_RADIUS = {
  full: "rounded-full",
  md: "rounded-[10px]",
} as const;

export type ContextPillRadius = keyof typeof INNER_RADIUS;

export interface ContextPillLabels {
  /** Accessible name of the cross. */
  remove: string;
  /** Accessible name of the eye when the pill is live. */
  disable: string;
  /** Accessible name of the crossed eye when the pill is off. */
  enable: string;
  /** Tooltip wording once the pill is off. Receives the pill's own tooltip. */
  ignored: (tooltip: React.ReactNode) => React.ReactNode;
}

const DEFAULT_LABELS: ContextPillLabels = {
  remove: "Remove from context",
  disable: "Ignore this context",
  enable: "Use this context again",
  ignored: (tooltip) => <>Ignored — {tooltip}</>,
};

export interface ContextPillProps {
  label: string;
  /** Hover explanation. Defaults to `label`. */
  tooltip?: React.ReactNode;
  /**
   * The leading visual. Either a ready-made node (an avatar, a project orb —
   * things that carry their own figure), or an icon plus its tint, which the
   * pill wraps in the concentric rounded square.
   */
  visual?:
    | React.ReactNode
    | {
        icon: React.ComponentType<{ className?: string }>;
        /** Tailwind classes for the badge — e.g. `bg-blue-500/12 text-blue-600`. */
        tint?: string;
      };
  /** Radius of the pill — the icon follows (see INNER_RADIUS). */
  radius?: ContextPillRadius;
  /** Deselected context: the pill stays, greyed, and is no longer sent. */
  disabled?: boolean;
  /** Toggles the selection (ambient context). Absent = inert pill. */
  onToggle?: () => void;
  /** Removes the pill (context pinned by hand). Wins over `onToggle`. */
  onRemove?: () => void;
  labels?: Partial<ContextPillLabels>;
  className?: string;
}

function isIconVisual(
  visual: ContextPillProps["visual"],
): visual is { icon: React.ComponentType<{ className?: string }>; tint?: string } {
  return (
    typeof visual === "object" &&
    visual !== null &&
    "icon" in (visual as Record<string, unknown>)
  );
}

export function ContextPill({
  label,
  tooltip,
  visual,
  radius = "full",
  disabled = false,
  onToggle,
  onRemove,
  labels,
  className,
}: ContextPillProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const action = onRemove ?? onToggle;
  const actionLabel = onRemove
    ? t.remove
    : disabled
      ? t.enable
      : t.disable;
  const hint = tooltip ?? label;

  let leading: React.ReactNode = null;
  if (isIconVisual(visual)) {
    const Icon = visual.icon;
    leading = (
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center",
          INNER_RADIUS[radius],
          disabled ? "bg-muted text-muted-foreground" : visual.tint,
        )}
      >
        <Icon className="h-3 w-3" />
      </span>
    );
  } else if (visual) {
    // A ready-made figure (avatar, orb, favicon) is worn as-is, with no tinted
    // badge around it: a generic icon would say less. Off, it goes grey with
    // the rest — it is the extinction one reads then, not the entity.
    leading = (
      <span className={cn("shrink-0", disabled && "grayscale")}>{visual}</span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={label}
          data-disabled={disabled || undefined}
          className={cn(
            "group/pill relative flex max-w-[14rem] shrink-0 items-center gap-1.5 border border-border bg-card py-1 pl-1 pr-2.5 text-xs shadow-sm transition-opacity",
            radius === "full" ? "rounded-full" : "rounded-md",
            disabled && "opacity-60",
            className,
          )}
        >
          {leading}
          <span
            className={cn(
              "min-w-0 truncate font-medium",
              disabled
                ? "text-muted-foreground line-through"
                : "text-foreground/80",
            )}
          >
            {label}
          </span>
          {action && (
            // The control sits ON TOP of the end of the label, it does not take
            // room beside it: reserving a gutter would leave a hole to the
            // right of every pill at rest, for a button you only see on hover.
            // The gradient towards the pill's own color makes the text under it
            // disappear instead of striking it through.
            <span
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-[inherit] bg-gradient-to-l from-card via-card to-transparent pl-4 pr-1 transition-opacity",
                // Off, the control stays visible: it is the only way back to
                // the context. On the keyboard it is the button's focus that
                // reveals it — otherwise you would tab onto an invisible thing.
                disabled
                  ? "opacity-100"
                  : "opacity-0 group-hover/pill:opacity-100 has-[:focus-visible]:opacity-100",
              )}
            >
              <button
                type="button"
                aria-label={actionLabel}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action();
                }}
                className="pointer-events-auto flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none"
              >
                {onRemove ? (
                  <X className="size-3" />
                ) : disabled ? (
                  <EyeOff className="size-3" />
                ) : (
                  <Eye className="size-3" />
                )}
              </button>
            </span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="end" sideOffset={6}>
        {disabled ? t.ignored(hint) : hint}
      </TooltipContent>
    </Tooltip>
  );
}
