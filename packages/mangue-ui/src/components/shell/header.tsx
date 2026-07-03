"use client";

import * as React from "react";
import { ChevronLeft, Search } from "lucide-react";

import { cn } from "../../lib/utils";
import { Kbd } from "../ui/kbd";
import { Button } from "../ui/button";
import type { BreadcrumbLevel, LinkComponent } from "./types";

export interface HeaderProps {
  /**
   * Structured breadcrumb. On desktop (≥`desktop`) the full trail renders in the
   * left slot; below it the header collapses to a back button (previous level)
   * plus the current level centred — and `center`/`right` are hidden, since
   * those actions move to the <MobileNav>. Takes precedence over `left`.
   */
  breadcrumb?: BreadcrumbLevel[];
  /** Left slot — breadcrumb, page title, back button. Ignored when `breadcrumb` is set. */
  left?: React.ReactNode;
  /** Center slot — typically a search trigger (desktop only). */
  center?: React.ReactNode;
  /** Right slot — actions, notifications, avatar (desktop only when `breadcrumb` is set). */
  right?: React.ReactNode;
  /** Router link component for breadcrumb navigation. */
  linkComponent?: LinkComponent;
  sticky?: boolean;
  className?: string;
}

export function Header({
  breadcrumb,
  left,
  center,
  right,
  linkComponent: Link,
  sticky = true,
  className,
}: HeaderProps) {
  const hasCrumb = !!breadcrumb && breadcrumb.length > 0;

  return (
    <header
      className={cn(
        "flex h-[60px] shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur",
        sticky && "sticky top-0 z-30",
        className,
      )}
    >
      {/* Mobile (<desktop): back + centred current level. */}
      {hasCrumb ? (
        <MobileBreadcrumb levels={breadcrumb} linkComponent={Link} />
      ) : null}

      {/* Left / full breadcrumb — desktop only when a breadcrumb is provided. */}
      <div
        className={cn(
          "min-w-0 flex-1 items-center gap-2",
          hasCrumb ? "hidden desktop:flex" : "flex",
        )}
      >
        {hasCrumb ? (
          <BreadcrumbTrail levels={breadcrumb} linkComponent={Link} />
        ) : (
          left
        )}
      </div>

      {center ? (
        <div className="hidden flex-1 justify-center desktop:flex">{center}</div>
      ) : null}

      <div
        className={cn(
          "shrink-0 items-center gap-1.5",
          hasCrumb ? "hidden desktop:flex" : "flex",
        )}
      >
        {right}
      </div>
    </header>
  );
}

/** The full "A / B / C" trail shown on desktop. */
function BreadcrumbTrail({
  levels,
  linkComponent: Link,
}: {
  levels: BreadcrumbLevel[];
  linkComponent?: LinkComponent;
}) {
  return (
    <nav className="flex min-w-0 items-center gap-2 text-sm" aria-label="Breadcrumb">
      {levels.map((level, index) => {
        const isLast = index === levels.length - 1;
        const Icon = level.icon;
        const inner = (
          <span
            className={cn(
              "flex items-center gap-1.5 truncate",
              isLast ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            {level.label}
          </span>
        );
        const interactive = !isLast && (level.href || level.onClick);
        const linkCls = "min-w-0 transition-colors hover:text-foreground";
        return (
          <React.Fragment key={level.key}>
            {index > 0 ? (
              <span className="text-muted-foreground/40 select-none">/</span>
            ) : null}
            {interactive ? (
              level.href && Link ? (
                <Link href={level.href} className={linkCls}>
                  {inner}
                </Link>
              ) : level.href ? (
                <a href={level.href} className={linkCls}>
                  {inner}
                </a>
              ) : (
                <button type="button" onClick={level.onClick} className={linkCls}>
                  {inner}
                </button>
              )
            ) : (
              inner
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/** Back button (previous level) + centred current level, shown below `desktop`. */
function MobileBreadcrumb({
  levels,
  linkComponent: Link,
}: {
  levels: BreadcrumbLevel[];
  linkComponent?: LinkComponent;
}) {
  const current = levels[levels.length - 1];
  const previous = levels.length > 1 ? levels[levels.length - 2] : undefined;
  const CurrentIcon = current.icon;
  const PrevIcon = previous?.icon;

  const backCommon = "h-9 gap-1 px-2 text-foreground";
  const backInner = (
    <>
      <ChevronLeft className="size-4 shrink-0" />
      {PrevIcon ? <PrevIcon className="size-4 shrink-0" /> : null}
    </>
  );

  return (
    <div className="flex min-w-0 flex-1 items-center desktop:hidden">
      <div className="flex min-w-0 flex-1 justify-start">
        {previous ? (
          previous.href && Link ? (
            <Button asChild variant="ghost" size="sm" className={backCommon} aria-label={`Back to ${previous.label}`}>
              <Link href={previous.href}>{backInner}</Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={backCommon}
              aria-label={`Back to ${previous.label}`}
              onClick={previous.onClick}
            >
              {backInner}
            </Button>
          )
        ) : null}
      </div>

      <div className="flex min-w-0 items-center justify-center gap-2">
        {CurrentIcon ? <CurrentIcon className="size-4 shrink-0 text-muted-foreground" /> : null}
        <span className="truncate text-sm font-semibold">{current.label}</span>
      </div>

      <div className="flex-1" />
    </div>
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
