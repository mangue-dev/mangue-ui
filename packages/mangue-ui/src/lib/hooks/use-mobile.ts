"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

/**
 * SSR-safe media query hook. Returns `false` on server and during hydration
 * to prevent mismatches, then updates to the real value after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const matches = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );

  // During SSR and first client render, return false to match server output
  if (!mounted) return false;
  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * AutoKap's app UI is wide and starts breaking below 1200px. This is the
 * canonical breakpoint for all mobile-layout adaptations (AUT-257), matching
 * the Tailwind `max-desktop:` variant (`--breakpoint-desktop: 1200px`).
 */
export function useIsMobileLayout(): boolean {
  return useMediaQuery("(max-width: 1199px)");
}

export function usePrefersReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const matches = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  if (!mounted) return false;
  return matches;
}

export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
