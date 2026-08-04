"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type KbdProps = React.ComponentProps<"kbd"> & {
  size?: "sm" | "default";
};

/**
 * Une touche est CARRÉE quand elle tient en un seul glyphe — une lettre, ⌘, ⇧,
 * →, ou une icône — et large seulement quand c'est un mot : Ctrl, Space, Esc,
 * Tab. C'est la forme d'un vrai clavier, où seuls les modificateurs écrits en
 * toutes lettres débordent.
 *
 * Sans cette règle, `px-1.5` s'appliquait à tout : un « ⌘ » sortait plus large
 * que le « K » posé à côté, et deux touches censées être jumelles ne l'étaient
 * pas. Le cas se voit partout où un raccourci se rend en plusieurs pastilles
 * (cheat sheet, pill de recherche), c'est-à-dire partout.
 */
function isSingleGlyph(children: React.ReactNode): boolean {
  // Une icône occupe la pastille entière : carrée, comme une lettre.
  if (React.isValidElement(children)) return true;
  const text = typeof children === "number" ? String(children) : children;
  if (typeof text !== "string") return false;
  // Points de code, pas unités UTF-16 : une flèche composée ou un emoji pèsent
  // deux unités et ne sont pas moins une seule touche.
  return [...text.trim()].length === 1;
}

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
  const square = isSingleGlyph(children);
  return (
    <kbd
      data-slot="kbd"
      data-square={square || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded border border-border bg-muted text-foreground font-mono",
        square
          ? size === "sm"
            ? "size-4 text-[10px]"
            : "size-5 text-xs"
          : size === "sm"
            ? "h-4 min-w-4 px-1.5 text-[10px]"
            : "h-5 min-w-5 px-1.5 text-xs",
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
