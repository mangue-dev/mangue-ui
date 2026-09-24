"use client";

import { X } from "lucide-react";

import { cn } from "../../lib/utils";

export interface CategoryChipProps {
  label: string;
  /** Any CSS color — the dot is the only place the category's color shows. */
  color?: string;
  /** Renders a trailing cross that removes the chip. */
  onRemove?: () => void;
  /** Accessible label of the remove button. Defaults to `Remove {label}`. */
  removeLabel?: string;
  className?: string;
}

/**
 * A removable colored label — what a category looks like once it is ON
 * something (an issue's fields, a filter bar). Distinct from `CategoryPill`,
 * which is a filter TOGGLE: this one states a fact, that one is a control.
 */
export function CategoryChip({
  label,
  color,
  onRemove,
  removeLabel,
  className,
}: CategoryChipProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border border-border px-1 py-0.5 text-xs",
        className,
      )}
    >
      {color ? (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ) : null}
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 shrink-0 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
          aria-label={removeLabel ?? `Remove ${label}`}
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
