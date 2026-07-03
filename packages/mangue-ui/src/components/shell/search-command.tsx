"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "../../lib/utils";
import { commandFilter } from "../../lib/command-filter";
import { Kbd } from "../ui/kbd";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../ui/command";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu";

export interface SearchCommandProps {
  groups: CommandMenuGroup[];
  placeholder?: string;
  emptyMessage?: string;
  /** Keyboard hint shown inside the pill (e.g. "F"). Pass null to hide. */
  shortcut?: string | null;
  /** Alignment of the results popover relative to the pill. */
  align?: "start" | "center" | "end";
  /** className for the search pill (the anchor). */
  className?: string;
  /** className for the results popover. */
  contentClassName?: string;
  /** Controlled open state. Leave undefined for the built-in behaviour
   *  (opens on focus/click, closes on Escape or select). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * An inline, expanding search bar backed by cmdk: a rounded pill whose input
 * grows on focus, with a popover panel of grouped, filterable results anchored
 * to it. Pair with the same `CommandMenuGroup[]` shape as `CommandMenu`.
 *
 *   <SearchCommand groups={groups} placeholder="Search or jump to..." />
 */
export function SearchCommand({
  groups,
  placeholder = "Search...",
  emptyMessage = "No results found.",
  shortcut = "F",
  align = "end",
  className,
  contentClassName,
  open: openProp,
  onOpenChange,
}: SearchCommandProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value);
      if (openProp === undefined) setUncontrolledOpen(value);
    },
    [onOpenChange, openProp],
  );

  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
  }, [setOpen]);

  const run = (item: CommandMenuItem) => {
    close();
    item.onSelect?.();
  };

  return (
    <CommandPrimitive filter={commandFilter} shouldFilter loop label={placeholder}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <PopoverAnchor asChild>
          <div
            ref={anchorRef}
            role="search"
            onClick={() => {
              inputRef.current?.focus();
              setOpen(true);
            }}
            className={cn(
              "flex h-8 cursor-text items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[0.8rem] font-medium shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 dark:border-input dark:bg-input/30",
              className,
            )}
          >
            <Search className="size-4 shrink-0" strokeWidth={2} />
            <CommandPrimitive.Input
              ref={inputRef}
              value={query}
              onValueChange={(value) => {
                setQuery(value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  close();
                  inputRef.current?.blur();
                }
              }}
              placeholder={placeholder}
              className="hidden w-20 bg-transparent outline-none transition-[width] duration-200 ease-out placeholder:text-muted-foreground focus:w-56 sm:inline-block"
            />
            {shortcut ? (
              <Kbd className="ml-1 hidden opacity-60 sm:inline-flex">{shortcut}</Kbd>
            ) : null}
          </div>
        </PopoverAnchor>
        <PopoverContent
          align={align}
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => {
            const target = event.target as Node | null;
            if (target && anchorRef.current?.contains(target)) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            const target = event.target as Node | null;
            if (target && anchorRef.current?.contains(target)) event.preventDefault();
          }}
          className={cn(
            "w-[560px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl p-0 shadow-lg",
            contentClassName,
          )}
        >
          <CommandList className="max-h-[340px] scroll-py-2 p-1.5">
            <CommandEmpty className="py-10 text-center text-sm text-muted-foreground/60">
              {emptyMessage}
            </CommandEmpty>
            {groups.map((group, index) => (
              <CommandGroup key={group.key ?? index} heading={group.heading}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.key}
                      value={`${item.label} ${(item.keywords ?? []).join(" ")}`}
                      disabled={item.disabled}
                      onSelect={() => run(item)}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      <span>{item.label}</span>
                      {item.shortcut ? (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </PopoverContent>
      </Popover>
    </CommandPrimitive>
  );
}
