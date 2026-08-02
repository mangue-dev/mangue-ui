"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { useElapsed, type Elapsed } from "../lib/hooks/use-elapsed";
import { cn } from "../lib/utils";

export interface WorkDuration extends Elapsed {
  /** Still running — the caller usually words the label differently. */
  active: boolean;
}

/** English default: "Working for 1 min 12 s" / "Worked for 12 s". */
function defaultFormatDuration({ minutes, seconds, active }: WorkDuration) {
  const verb = active ? "Working for" : "Worked for";
  return minutes > 0
    ? `${verb} ${minutes} min ${seconds} s`
    : `${verb} ${seconds} s`;
}

export interface WorkAccordionProps {
  /** ISO timestamp (or ms epoch) when the turn started. */
  startedAt: string | number;
  /** ISO timestamp (or ms epoch) when it ended; `null` while still working. */
  endedAt?: string | number | null;
  active: boolean;
  /**
   * Wording of the header. Receives the live duration; the default is English.
   * This is where an i18n'd app plugs its own strings in.
   */
  formatDuration?: (duration: WorkDuration) => React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * The collapsible trace of ONE turn's work — one mechanic, one look:
 *  • ACTIVE → open by default, header "Working for X" counting live.
 *  • finished → the header becomes "Worked for X" and the accordion closes
 *    itself (still foldable by hand).
 *
 * The caller renders the turn's ANSWER right underneath: the reader follows the
 * work in progress, then reads the final message, instead of receiving the turn
 * in one block.
 *
 * Mount it with a STABLE `key` across the active and finished states of the
 * same turn: it is the same instance that plays the closing animation.
 */
export function WorkAccordion({
  startedAt,
  endedAt = null,
  active,
  formatDuration = defaultFormatDuration,
  className,
  children,
}: WorkAccordionProps) {
  // Open by default while it WORKS; closes itself on the work → done
  // transition, while staying foldable by hand.
  const [open, setOpen] = React.useState(active);
  const wasActive = React.useRef(active);
  React.useEffect(() => {
    if (wasActive.current && !active) setOpen(false);
    wasActive.current = active;
  }, [active]);

  const elapsed = useElapsed({ startedAt, endedAt, active });
  const label = formatDuration({ ...elapsed, active });

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger className="group flex w-full items-center gap-1.5 pb-2.5 text-xs font-medium text-muted-foreground outline-hidden transition-colors hover:text-foreground">
        <ChevronRight className="size-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
        {/* Running → the label itself shimmers (no spinner: text that breathes
            already says "this is going", without adding a spinning object). */}
        <span className={cn(active && "text-shimmer")}>{label}</span>
      </CollapsibleTrigger>
      {/* Fixed full-width border under the toggle: separates the indicator from
          the messages. Always visible (open or closed), it never moves — the
          content animates below it. */}
      <div className="border-t border-border" />
      <CollapsibleContent>
        <div className="flex flex-col gap-3 pt-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
