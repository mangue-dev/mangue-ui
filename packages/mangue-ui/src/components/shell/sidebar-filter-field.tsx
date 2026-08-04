"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "../../lib/utils";

export interface SidebarFilterFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** "Filter 12 pull requests…" — also the accessible label. */
  placeholder: string;
  /** Label of the clear button (screen readers + hover). */
  clearLabel?: string;
  /**
   * Key that focuses the field from anywhere on the page. `null` disables it.
   * Only one secondary sidebar is mounted at a time, so there is no ambiguity
   * about the target.
   */
  shortcut?: string | null;
  className?: string;
}

/** Inputs, textareas and rich-text hosts: never steal a key from them. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    el.isContentEditable
  );
}

/**
 * The filter field of a secondary sidebar's title row.
 *
 * This is NOT the app's search — the header's one opens the palette, a modal
 * that searches everywhere and takes you elsewhere. This one narrows the list
 * right below it, in place, and nothing else. Hence the vocabulary ("Filter…",
 * never "Search") and the look: no border, no background, the same quiet
 * grammar as a filter trigger, not a form field. Two search boxes on the same
 * 60px band, at either end of the screen, must not look alike.
 *
 * The placeholder NAMES the list: it takes over the role of the title that was
 * removed from this row (the breadcrumb already writes it, 340px to the right).
 */
export function SidebarFilterField({
  value,
  onChange,
  placeholder,
  clearLabel = "Clear filter",
  shortcut = "/",
  className,
}: SidebarFilterFieldProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  // The `offsetParent` test rules out the case where the sidebar is folded away
  // (mobile, detail open), where stealing focus into an invisible field would
  // lead nowhere.
  React.useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // No `shiftKey` guard: on AZERTY, "/" IS typed with Shift. `e.key` is what
      // decides, and it cannot be both "/" and "?" at once.
      if (e.key !== shortcut || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      const input = ref.current;
      if (!input || input.offsetParent === null) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      input.focus();
      input.select();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [shortcut]);

  return (
    <div className={cn("flex min-w-0 flex-1 items-center gap-2", className)}>
      <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        // `text-base` below md: under 16px, iOS zooms into the field on focus
        // and never zooms back out.
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          // The key must not bubble: it would close the mobile sheet or the
          // parent dialog when all we wanted was to empty the filter.
          e.stopPropagation();
          if (value) onChange("");
          else ref.current?.blur();
        }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            ref.current?.focus();
          }}
          aria-label={clearLabel}
          title={clearLabel}
          className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

/**
 * The normalisation shared by every sidebar filter: lowercase, accent-free.
 * "Décor" must be found by typing "decor", and the other way round.
 */
export function normalizeFilterText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * True when EVERY word of the query is found in one of the given fields. Words,
 * not the whole string: "numo auth" must match a row whose title carries one and
 * whose branch carries the other.
 */
export function matchesFilter(
  query: string,
  fields: (string | null | undefined)[],
): boolean {
  const words = normalizeFilterText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeFilterText(
    fields.filter((f): f is string => !!f).join(" "),
  );
  return words.every((w) => haystack.includes(w));
}
