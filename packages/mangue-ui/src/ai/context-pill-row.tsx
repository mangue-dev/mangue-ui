"use client";

import * as React from "react";

import { HorizontalScroller } from "../components/ui/horizontal-scroller";
import { cn } from "../lib/utils";

export interface ContextPillRowProps {
  /** The pills — `ContextPill` elements, or anything of that size. */
  children?: React.ReactNode;
  /**
   * Trailing control that never scrolls away — the "@" button that adds
   * context. Whatever fetches its options is the app's business.
   */
  action?: React.ReactNode;
  /** Re-measure when the pill count changes (see HorizontalScroller). */
  deps?: React.DependencyList;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

/**
 * The AI composer's context row: what the assistant has in front of it, plus
 * the control that adds to it.
 *
 * The row NEVER wraps — a board with a view, a cycle and a selection would grow
 * the composer by three rows. It scrolls horizontally with no visible bar, and
 * two chevrons that only appear on hover and only where something is left to
 * see. No edge fade: half-faded pills read as a rendering bug, not as a hint.
 */
export function ContextPillRow({
  children,
  action,
  deps = [],
  prevLabel,
  nextLabel,
  className,
}: ContextPillRowProps) {
  const hasPills = React.Children.count(children) > 0;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {hasPills && (
        <HorizontalScroller
          className="min-w-0 flex-1"
          revealOnHover
          edgeFade={false}
          arrowSize="sm"
          deps={deps}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        >
          <div className="flex w-max items-center gap-1.5">{children}</div>
        </HorizontalScroller>
      )}
      {action}
    </div>
  );
}
