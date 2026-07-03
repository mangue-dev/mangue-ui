"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "../../lib/utils";
import { Kbd } from "../ui/kbd";

export interface HeaderProps {
  /** Left slot — breadcrumb, page title, back button. */
  left?: React.ReactNode;
  /** Center slot — typically a search trigger (hidden on mobile). */
  center?: React.ReactNode;
  /** Right slot — actions, notifications, avatar. */
  right?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function Header({ left, center, right, sticky = true, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-[60px] shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur",
        sticky && "sticky top-0 z-30",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">{left}</div>
      {center ? (
        <div className="hidden flex-1 justify-center desktop:flex">{center}</div>
      ) : null}
      <div className="flex shrink-0 items-center gap-1.5">{right}</div>
    </header>
  );
}

export interface HeaderSearchProps {
  onClick?: () => void;
  placeholder?: string;
  /** Keyboard hint shown on the right (e.g. "⌘K"). Pass null to hide. */
  shortcut?: string | null;
  className?: string;
}

/**
 * A search button styled like an input, with a keyboard hint. Wire `onClick`
 * to open a <CommandMenu>.
 */
export function HeaderSearch({
  onClick,
  placeholder = "Search...",
  shortcut = "⌘K",
  className,
}: HeaderSearchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate text-left">{placeholder}</span>
      {shortcut ? <Kbd>{shortcut}</Kbd> : null}
    </button>
  );
}
