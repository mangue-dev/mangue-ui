"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

export interface AppShellProps {
  /** A <Sidebar/>. Automatically hidden below the `desktop` breakpoint. */
  sidebar?: React.ReactNode;
  /** A <Header/>. */
  header?: React.ReactNode;
  /** A <MobileNav/>, shown only below the `desktop` breakpoint. */
  mobileNav?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * The assembled application layout: fixed-height row of [sidebar | (header +
 * scrollable main)], with an optional mobile bottom nav. Responsive behaviour
 * matches AutoKap: the sidebar is desktop-only (>=1200px), the mobile nav
 * takes over below it.
 */
export function AppShell({ sidebar, header, mobileNav, children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "flex h-dvh w-full overflow-hidden bg-background text-foreground",
        className,
      )}
    >
      {sidebar ? <div className="hidden shrink-0 desktop:block">{sidebar}</div> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      {mobileNav}
    </div>
  );
}
