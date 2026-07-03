"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type KbdProps = React.ComponentProps<"kbd"> & {
  size?: "sm" | "default";
};

/**
 * Keyboard key indicator. Locks text color to `text-foreground` so the key
 * stays readable on its `bg-muted` background regardless of the parent's
 * text color (tooltips invert foreground/background, etc.).
 */
export function Kbd({
  className,
  size = "default",
  children,
  ...props
}: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex items-center justify-center rounded border border-border bg-muted text-foreground px-1.5 font-mono",
        size === "sm" ? "h-4 min-w-4 text-[10px]" : "h-5 min-w-5 text-xs",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export type KbdSequenceProps = {
  keys: string[][];
  /**
   * Separator rendered between successive chord steps. Accepts either a
   * plain string (wrapped automatically with the muted "then…" styling so
   * callers can pass a translated label) or any ReactNode for full control.
   * Defaults to the English "then".
   */
  separator?: React.ReactNode | string;
  size?: "sm" | "default";
  className?: string;
};

function renderSeparator(separator: React.ReactNode | string | undefined) {
  if (separator === undefined) separator = "then";
  if (typeof separator === "string") {
    return (
      <span className="text-current opacity-60 text-[10px]">{separator}</span>
    );
  }
  return separator;
}

export function KbdSequence({
  keys,
  separator,
  size = "default",
  className,
}: KbdSequenceProps) {
  const sep = renderSeparator(separator);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((parts, i) => (
        <React.Fragment key={i}>
          {i > 0 && sep}
          <span className="inline-flex items-center gap-0.5">
            {parts.map((p, j) => (
              <Kbd key={j} size={size}>
                {p}
              </Kbd>
            ))}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}
