"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import type { LinkComponent, NavItem } from "./types";

export interface MobileNavProps {
  items: NavItem[];
  activeKey?: string;
  linkComponent?: LinkComponent;
  className?: string;
}

/**
 * A floating bottom pill navigation, shown only below the `desktop` breakpoint
 * (<1200px). Mirrors project's mobile nav. Use alongside a hidden <Sidebar>.
 */
export function MobileNav({ items, activeKey, linkComponent: Link, className }: MobileNavProps) {
  return (
    <nav
      className={cn(
        // The wrapper spans the full width but must NOT capture pointer events —
        // otherwise its transparent sides block clicks on the content behind it.
        // Only the pill itself stays interactive (pointer-events-auto).
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom)] desktop:hidden",
        className,
      )}
    >
      {/* Fade the content scrolling beneath the floating pill into the
          background instead of cutting it off sharply. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background via-background/80 to-background/0"
      />
      <div className="pointer-events-auto mb-3 flex items-center gap-1 rounded-full border border-border bg-surface-glass px-1.5 py-1.5 shadow-lg backdrop-blur-md">
        {items.map((item) => {
          const active = item.active ?? item.key === activeKey;
          const Icon = item.icon;
          const inner = (
            <>
              {Icon ? <Icon className="h-5 w-5" /> : null}
              <span className="text-[11px] font-medium">{item.label}</span>
            </>
          );
          const cls = cn(
            "flex min-w-[64px] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          );

          if (item.href && Link) {
            return (
              <Link key={item.key} href={item.href} className={cls}>
                {inner}
              </Link>
            );
          }
          if (item.href) {
            return (
              <a key={item.key} href={item.href} className={cls}>
                {inner}
              </a>
            );
          }
          return (
            <button key={item.key} type="button" onClick={item.onClick} className={cls}>
              {inner}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
