"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../ui/command";
import type { IconType } from "./types";

export interface CommandMenuItem {
  key: string;
  label: string;
  icon?: IconType;
  /** Extra terms to match against when searching. */
  keywords?: string[];
  /** Trailing shortcut hint (e.g. "⌘P"). */
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface CommandMenuGroup {
  key?: string;
  heading?: string;
  items: CommandMenuItem[];
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandMenuGroup[];
  placeholder?: string;
  emptyMessage?: string;
}

/** A ready-to-use command palette (⌘K-style). Pair with `useCommandMenu`. */
export function CommandMenu({
  open,
  onOpenChange,
  groups,
  placeholder = "Type a command or search...",
  emptyMessage = "No results found.",
}: CommandMenuProps) {
  const run = (item: CommandMenuItem) => {
    onOpenChange(false);
    item.onSelect?.();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
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
                  {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Small helper that manages open state and a keyboard shortcut (⌘K / Ctrl+K).
 *
 *   const { open, setOpen } = useCommandMenu();
 *   <CommandMenu open={open} onOpenChange={setOpen} groups={...} />
 */
export function useCommandMenu(shortcutKey = "k") {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcutKey && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shortcutKey]);

  return { open, setOpen };
}
