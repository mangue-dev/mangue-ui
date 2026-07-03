"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Command as CommandPrimitive } from "cmdk";
import { Ellipsis, Menu, Search, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { commandFilter } from "../../lib/command-filter";
import { Button } from "../ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { LinkComponent, NavItem, NavSection } from "./types";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu";

/** How small the pill gets when compact (fraction of full size). */
const COMPACT_SCALE = 0.6;
/** Ignore scroll jitter below this delta before reacting. */
const SCROLL_DELTA = 6;
/** Don't compact until the user has scrolled at least this far down. */
const COMPACT_AFTER = 24;

export interface MobileNavProps {
  /** Sidebar sections — shown (flattened) in the menu sheet and the auto menu. */
  sections?: NavSection[];
  /** Command-palette groups — shown in the search sheet and the auto menu. */
  commandGroups?: CommandMenuGroup[];
  /** Brand/header shown at the top of the menu sheet. */
  menuHeader?: React.ReactNode;
  /** Footer (e.g. a user block) shown at the bottom of the menu sheet. */
  menuFooter?: React.ReactNode;
  /**
   * Extra action buttons inserted between the search button and the auto menu.
   * Wrap each in <MobileNavItem> for consistent sizing.
   */
  actions?: React.ReactNode;
  /** Match a nav item as active. */
  activeKey?: string;
  linkComponent?: LinkComponent;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * The mobile bottom bar (<desktop): a floating pill with the sidebar in a menu
 * sheet (left), the command palette in a search sheet (centre), optional custom
 * actions, and an auto "more" menu that flattens the sidebar + command palette
 * so every destination stays reachable. Mirrors project's mobile nav.
 */
export function MobileNav({
  sections = [],
  commandGroups = [],
  menuHeader,
  menuFooter,
  actions,
  activeKey,
  linkComponent,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
}: MobileNavProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [compact, setCompact] = React.useState(false);
  const reduce = useReducedMotion();
  const lastScrollTop = React.useRef(0);

  // Shrink the pill when scrolling down so it stays out of the way; restore it
  // on scroll-up (or a tap while compact). Scrolling happens inside the app's
  // inner panel (body scroll is locked), so listen in the capture phase on the
  // document to catch it from whichever element scrolls.
  React.useEffect(() => {
    const onScroll = (event: Event) => {
      const target = event.target;
      const top =
        target && "scrollTop" in target
          ? (target as HTMLElement).scrollTop
          : window.scrollY;
      const previous = lastScrollTop.current;
      const delta = top - previous;
      if (Math.abs(delta) < SCROLL_DELTA) return;
      lastScrollTop.current = top;
      if (delta > 0 && top > COMPACT_AFTER) setCompact(true);
      else if (delta < 0) setCompact(false);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () =>
      document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <>
      <nav
        aria-label="Navigation"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))] desktop:hidden",
          className,
        )}
      >
        {/* Fade the content scrolling beneath the pill — softened while compact. */}
        <motion.div
          aria-hidden
          animate={{ opacity: compact ? 0.18 : 1 }}
          transition={spring}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background via-background/80 to-background/0"
        />
        <motion.div
          animate={{ scale: compact ? COMPACT_SCALE : 1 }}
          transition={spring}
          style={{ transformOrigin: "center bottom" }}
          // While compact, a tap only restores the pill — it must not fall
          // through to one of the buttons.
          onClickCapture={(event) => {
            if (compact) {
              event.preventDefault();
              event.stopPropagation();
              setCompact(false);
            }
          }}
          className={cn(
            "pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card/95 px-2 shadow-lg supports-backdrop-filter:backdrop-blur-md",
            compact && "cursor-pointer",
          )}
        >
          <MobileNavItem label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Menu className="size-[22px]" strokeWidth={2} />
          </MobileNavItem>
          <PileDivider />
          <MobileNavItem label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)}>
            <Search className="size-[22px]" strokeWidth={2} />
          </MobileNavItem>
          {actions ? (
            <>
              <PileDivider />
              {actions}
            </>
          ) : null}
          <PileDivider />
          <AutoActionsMenu
            sections={sections}
            commandGroups={commandGroups}
            linkComponent={linkComponent}
          />
        </motion.div>
      </nav>

      <MobileNavSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        sections={sections}
        header={menuHeader}
        footer={menuFooter}
        activeKey={activeKey}
        linkComponent={linkComponent}
      />
      <MobileSearchSheet
        open={searchOpen}
        onOpenChange={setSearchOpen}
        groups={commandGroups}
        placeholder={searchPlaceholder}
        emptyMessage={emptyMessage}
      />
    </>
  );
}

/** A touch-sized, round icon button for the pill. Exported for custom `actions`. */
export const MobileNavItem = React.forwardRef<
  HTMLButtonElement,
  { label: string; children: React.ReactNode } & React.ComponentPropsWithoutRef<"button">
>(function MobileNavItem({ label, children, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      {...props}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-full text-foreground/80 outline-none transition-colors hover:bg-muted active:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </button>
  );
});

function PileDivider() {
  return <span aria-hidden className="h-6 w-px shrink-0 bg-border/70" />;
}

/* ── Auto "more" menu — flattened sidebar + command palette ─────────────────── */

function AutoActionsMenu({
  sections,
  commandGroups,
  linkComponent: Link,
}: {
  sections: NavSection[];
  commandGroups: CommandMenuGroup[];
  linkComponent?: LinkComponent;
}) {
  const navItems = sections.flatMap((s) => s.items);
  const commandItems = commandGroups.flatMap((g) => g.items);
  if (navItems.length === 0 && commandItems.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MobileNavItem label="More options">
          <Ellipsis className="size-[22px]" strokeWidth={2} />
        </MobileNavItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={12}
        className="max-h-[60vh] w-56 overflow-y-auto"
      >
        {navItems.length > 0 ? <DropdownMenuLabel>Navigate</DropdownMenuLabel> : null}
        {navItems.map((item) => (
          <AutoNavMenuItem key={`nav-${item.key}`} item={item} linkComponent={Link} />
        ))}
        {commandItems.length > 0 ? (
          <>
            {navItems.length > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {commandItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={`cmd-${item.key}`}
                  disabled={item.disabled}
                  onSelect={() => item.onSelect?.()}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.shortcut ? (
                    <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                  ) : null}
                </DropdownMenuItem>
              );
            })}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AutoNavMenuItem({
  item,
  linkComponent: Link,
}: {
  item: NavItem;
  linkComponent?: LinkComponent;
}) {
  const Icon = item.icon;
  const inner = (
    <>
      {Icon ? <Icon className="size-4" /> : null}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge}
    </>
  );
  if (item.href && Link) {
    return (
      <DropdownMenuItem asChild disabled={item.disabled}>
        <Link href={item.href}>{inner}</Link>
      </DropdownMenuItem>
    );
  }
  if (item.href) {
    return (
      <DropdownMenuItem asChild disabled={item.disabled}>
        <a href={item.href}>{inner}</a>
      </DropdownMenuItem>
    );
  }
  return (
    <DropdownMenuItem disabled={item.disabled} onSelect={() => item.onClick?.()}>
      {inner}
    </DropdownMenuItem>
  );
}

/* ── Full-screen sheets ─────────────────────────────────────────────────────── */

function FullScreenSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-background outline-none duration-200 data-open:animate-in data-open:slide-in-from-bottom-4 data-closed:animate-out data-closed:slide-out-to-bottom-4"
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function MobileNavSheet({
  open,
  onOpenChange,
  sections,
  header,
  footer,
  activeKey,
  linkComponent: Link,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: NavSection[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  activeKey?: string;
  linkComponent?: LinkComponent;
}) {
  const close = () => onOpenChange(false);
  return (
    <FullScreenSheet open={open} onOpenChange={onOpenChange} title="Menu">
      <div className="flex h-[60px] shrink-0 items-center justify-between gap-2 px-4">
        <div className="min-w-0 flex-1">
          {header ?? <span className="text-base font-semibold">Menu</span>}
        </div>
        <DialogPrimitive.Close asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Close" className="rounded-full">
            <X />
          </Button>
        </DialogPrimitive.Close>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-24">
        {sections.map((section, index) => (
          <div key={section.key ?? index}>
            {section.label ? (
              <p className="px-3 pt-4 pb-1.5 text-xs font-medium text-muted-foreground">
                {section.label}
              </p>
            ) : null}
            {section.items.map((item) => (
              <MobileNavSheetLink
                key={item.key}
                item={item}
                active={item.active ?? item.key === activeKey}
                linkComponent={Link}
                onNavigate={close}
              />
            ))}
          </div>
        ))}
      </div>
      {footer ? <div className="shrink-0 border-t border-border p-3">{footer}</div> : null}
    </FullScreenSheet>
  );
}

function MobileNavSheetLink({
  item,
  active,
  linkComponent: Link,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  linkComponent?: LinkComponent;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const cls = cn(
    "flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
    active ? "bg-muted text-foreground" : "text-foreground/80 hover:bg-muted/60",
    item.disabled && "pointer-events-none opacity-50",
  );
  const inner = (
    <>
      {Icon ? <Icon className="size-5 shrink-0" /> : null}
      <span className="flex-1 truncate text-left">{item.label}</span>
      {item.badge}
    </>
  );
  if (item.href && Link) {
    return (
      <Link href={item.href} className={cls} onClick={onNavigate}>
        {inner}
      </Link>
    );
  }
  if (item.href) {
    return (
      <a href={item.href} className={cls} onClick={onNavigate}>
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={cn(cls, "w-full")}
      onClick={() => {
        item.onClick?.();
        onNavigate();
      }}
    >
      {inner}
    </button>
  );
}

function MobileSearchSheet({
  open,
  onOpenChange,
  groups,
  placeholder,
  emptyMessage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandMenuGroup[];
  placeholder: string;
  emptyMessage: string;
}) {
  const [query, setQuery] = React.useState("");
  const run = (item: CommandMenuItem) => {
    onOpenChange(false);
    setQuery("");
    item.onSelect?.();
  };
  return (
    <FullScreenSheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
      title="Search"
    >
      <CommandPrimitive filter={commandFilter} shouldFilter loop className="flex h-full flex-col">
        <div className="flex h-[60px] shrink-0 items-center gap-2 px-3">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <CommandPrimitive.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
              className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close" className="rounded-full">
              <X />
            </Button>
          </DialogPrimitive.Close>
        </div>
        <CommandList className="min-h-0 flex-1 overflow-y-auto p-2">
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
                    className="h-11 hover:bg-muted! data-selected:bg-transparent"
                  >
                    {Icon ? <Icon className="size-4" /> : null}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandPrimitive>
    </FullScreenSheet>
  );
}
