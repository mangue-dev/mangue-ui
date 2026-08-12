"use client";

// The single shared shell for every searchable dropdown built on cmdk: the
// field pickers (search-select.tsx, trigger-anchored) and pointer-anchored
// menus (right-click field shortcuts, relation pickers). A cmdk <Command>
// inside a Popover, anchored either to a trigger element or to a viewport
// position. The search field (icon + plain input + separator) is the same one
// a right-click context menu can render (see DropdownSearchRow), so every
// searchable dropdown shares one look.

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandSeparator,
} from "./command";
import { Kbd } from "./kbd";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/** Shared styling for the search input inside any dropdown (cmdk or Radix). */
export const searchInputClass =
  "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground";

/**
 * The search row (magnifier + input) shared by every searchable dropdown — the
 * cmdk shell below and a Radix context menu both render it, so the field looks
 * identical everywhere. Pass the actual input (cmdk or plain) as child.
 */
export function DropdownSearchRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      {children}
    </div>
  );
}

export type SearchMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Trigger-anchored mode: the element the menu hangs off. */
  trigger?: React.ReactNode;
  /**
   * Pointer-anchored mode: viewport coordinates (mutually exclusive with
   * `trigger`). `null` renders nothing (closed).
   */
  position?: { x: number; y: number } | null;
  /** Optional tooltip on the trigger (trigger mode only). */
  tooltip?: string;
  /** Key badge (e.g. "S") shown next to the tooltip — surfaces the shortcut. */
  shortcutHint?: string;
  searchPlaceholder?: string;
  /**
   * Controls the search text. cmdk owns it by default; passing it is for menus
   * that step from one stage to the next without closing (pick a type, then a
   * target) and must restart from an empty field.
   */
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  emptyText?: string;
  /**
   * Hides the "no results" row. Menus that carry a create row keep it visible
   * when nothing matches: that row IS the answer, and a "no results" line right
   * above it would say nothing more.
   */
  hideEmpty?: boolean;
  align?: "start" | "center" | "end";
  contentClassName?: string;
  /**
   * Portal target. Inside a modal Sheet/Dialog, react-remove-scroll blocks the
   * wheel on anything portalled to <body>: portalling the menu INTO the panel
   * is what keeps its list scrollable.
   */
  container?: HTMLElement | null;
  /** Stop pointer/click from bubbling to a draggable/clickable ancestor. */
  stopPropagation?: boolean;
  /** cmdk groups/items (each caller wraps its options in a CommandGroup). */
  children: React.ReactNode;
};

export function SearchMenu({
  open,
  onOpenChange,
  trigger,
  position,
  tooltip,
  shortcutHint,
  searchPlaceholder = "Search…",
  searchValue,
  onSearchValueChange,
  emptyText = "No results",
  hideEmpty,
  align = "start",
  contentClassName,
  container,
  stopPropagation,
  children,
}: SearchMenuProps) {
  const stop = stopPropagation
    ? (e: React.SyntheticEvent) => e.stopPropagation()
    : undefined;

  const content = (
    <PopoverContent
      align={align}
      container={container}
      // rounded-xl for the same reason as Combobox: <Command> paints this
      // surface at 20px, rows sit 8px in (Command's p-1 + CommandGroup's p-1)
      // and carry 12px — 20 − 8 = 12, concentric.
      className={cn("w-60 overflow-hidden rounded-xl p-0", contentClassName)}
      onClick={stop}
      onPointerDown={stop}
    >
      <Command>
        <DropdownSearchRow>
          <CommandPrimitive.Input
            autoFocus
            placeholder={searchPlaceholder}
            className={searchInputClass}
            {...(searchValue !== undefined
              ? { value: searchValue, onValueChange: onSearchValueChange }
              : {})}
          />
        </DropdownSearchRow>
        <CommandSeparator className="my-1" />
        <CommandList>
          {!hideEmpty && <CommandEmpty>{emptyText}</CommandEmpty>}
          {children}
        </CommandList>
      </Command>
    </PopoverContent>
  );

  // Pointer-anchored mode: a zero-size anchor pinned at the viewport point.
  if (position !== undefined) {
    if (!position) return null;
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverAnchor asChild>
          <span
            aria-hidden
            style={{ position: "fixed", left: position.x, top: position.y }}
          />
        </PopoverAnchor>
        {content}
      </Popover>
    );
  }

  // Trigger-anchored mode.
  const popover = (
    <Popover open={open} onOpenChange={onOpenChange}>
      {tooltip ? (
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        </PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      )}
      {content}
    </Popover>
  );

  if (!tooltip) return popover;
  return (
    <Tooltip>
      {popover}
      <TooltipContent className="flex items-center gap-1.5">
        {tooltip}
        {shortcutHint && <Kbd size="sm">{shortcutHint}</Kbd>}
      </TooltipContent>
    </Tooltip>
  );
}
