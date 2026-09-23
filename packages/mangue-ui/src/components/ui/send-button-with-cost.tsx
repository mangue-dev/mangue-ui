"use client";

import { ArrowUp, Coins, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";

interface SendButtonWithCostProps {
  /** Credit cost to display next to the icon. Pass `null` to hide the cost (icon-only button). */
  cost: number | null;
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
  tooltipLabel: React.ReactNode;
  ariaLabel: string;
}

export function SendButtonWithCost({
  cost,
  isLoading,
  disabled,
  onClick,
  tooltipLabel,
  ariaLabel,
}: SendButtonWithCostProps) {
  const showCost = cost !== null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-full text-[11px] font-medium tabular-nums transition-colors",
            "bg-primary text-primary-foreground shadow-sm",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
            "enabled:hover:bg-primary-hover",
            showCost ? "gap-1.5 px-2.5" : "w-8",
          )}
        >
          {showCost ? (
            <>
              <span className="inline-flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {cost}
              </span>
              <span className="h-3 w-px bg-primary-foreground/30" />
            </>
          ) : null}
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ArrowUp className="h-3.5 w-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
}
