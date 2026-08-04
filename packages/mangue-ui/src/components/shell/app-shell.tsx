"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import {
  SecondarySidebarSlot,
  useSecondarySidebarContext,
} from "./secondary-sidebar";

export interface AppShellProps {
  /** A <Sidebar/>. Automatically hidden below the `desktop` breakpoint. */
  sidebar?: React.ReactNode;
  /** A <Header/>. */
  header?: React.ReactNode;
  /** A <MobileNav/>, shown only below the `desktop` breakpoint. */
  mobileNav?: React.ReactNode;
  /**
   * Where a page's `<SecondarySidebar>` lands, between the primary sidebar and
   * the header + content column. Rendered on its own as soon as a
   * `<SecondarySidebarProvider>` sits above the shell; pass `false` to place the
   * `<SecondarySidebarSlot>` yourself.
   */
  secondarySidebar?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * The assembled application layout: fixed-height row of [nav | (header +
 * scrollable main)], with an optional mobile bottom nav. Responsive behaviour
 * matches project: the sidebars are desktop-only (>=1200px), the mobile nav
 * takes over below it.
 *
 * The nav column holds the primary sidebar AND the secondary sidebar's landing
 * point: both live in the same box, left of the header — which is what shifts
 * the breadcrumb and the content along, instead of letting them run above a
 * column.
 */
export function AppShell({
  sidebar,
  header,
  mobileNav,
  secondarySidebar = true,
  children,
  className,
}: AppShellProps) {
  // `null` outside a provider — a single-sidebar app pays nothing for this.
  const secondary = useSecondarySidebarContext();
  const withSlot = secondarySidebar && secondary !== null;
  // Lock document scroll while the shell owns the viewport (all scrolling is
  // handled by the inner <main>) and, on ultrawide (≥3xl), center the shell as a
  // card with an aurora canvas behind it — the body becomes the centering
  // context since the `mx-auto` alone can't center vertically. Everything is
  // restored on unmount / when leaving the ultrawide range.
  React.useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const mq = window.matchMedia("(min-width: 2200px)");
    const apply = (ultrawide: boolean) => {
      if (ultrawide) {
        root.style.height = "100dvh";
        body.style.height = "100dvh";
        body.style.display = "flex";
        body.style.alignItems = "center";
        body.style.justifyContent = "center";
        body.classList.add("ultrawide-canvas");
      } else {
        root.style.height = "";
        body.style.height = "";
        body.style.display = "";
        body.style.alignItems = "";
        body.style.justifyContent = "";
        body.classList.remove("ultrawide-canvas");
      }
    };
    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", onChange);

    return () => {
      body.style.overflow = prevOverflow;
      root.style.height = "";
      body.style.height = "";
      body.style.display = "";
      body.style.alignItems = "";
      body.style.justifyContent = "";
      body.classList.remove("ultrawide-canvas");
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex h-dvh w-full overflow-hidden bg-background text-foreground",
        // Ultrawide: become a centered card with a max width/height, rounded
        // corners, border and elevation — the canvas shows through around it.
        "3xl:mx-auto 3xl:max-h-[var(--spacing-app-max-h)] 3xl:max-w-[var(--spacing-app-max-w)] 3xl:rounded-[30px] 3xl:border 3xl:border-border 3xl:shadow-2xl",
        className,
      )}
    >
      {sidebar || withSlot ? (
        <div className="hidden h-full shrink-0 desktop:flex">
          {sidebar}
          {withSlot ? <SecondarySidebarSlot /> : null}
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {header}
        <main
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            // Reserve space at the bottom on mobile so page content clears the
            // floating <MobileNav> pill instead of scrolling under it. Only when
            // a mobileNav is actually provided, and only below the desktop
            // breakpoint where the pill is shown.
            mobileNav &&
              "max-desktop:pb-[calc(6rem+env(safe-area-inset-bottom))]",
          )}
        >
          {children}
        </main>
      </div>
      {mobileNav}
    </div>
  );
}
