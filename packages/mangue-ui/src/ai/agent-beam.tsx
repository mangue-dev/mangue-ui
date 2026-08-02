"use client";

import * as React from "react";
import { BorderBeam, type BorderBeamSize } from "border-beam";

import { useTheme } from "../components/theme-provider";

export type { BorderBeamSize };

/** Tuning shared by both shapes of the beam (wrapper and overlay). */
const BEAM_TUNING = { duration: 4, colorVariant: "colorful" } as const;

export interface AgentBeamProps {
  active: boolean;
  /**
   * Carries the beam's RADIUS — match it to the wrapped element's own
   * (e.g. `rounded-xl` / `rounded-2xl`), otherwise the light runs along a
   * corner the surface does not have.
   */
  className?: string;
  /**
   * Source preset. `pulse-inner` (default) is the contained breathing of large
   * surfaces — an issue card, a composer. On a small round pill (a FAB) it
   * floods the disc instead of underlining its edge: `sm`, the button-sized
   * preset, runs the beam along the outline instead.
   */
  size?: BorderBeamSize;
  /**
   * Keeps the wrapper mounted even when inactive (the beam then fades in and
   * out via `active`). REQUIRED as soon as the children hold DOM state — a
   * composer, for one: without it, every toggle of the beam remounts the tree,
   * which loses both the focus AND the text being typed.
   */
  keepMounted?: boolean;
  children: React.ReactNode;
}

/**
 * The animated "agent is working" beam — one source of truth for the
 * `BorderBeam` settings, shared by cards, panels and the AI composer.
 * `active=false` renders the children as-is (no wrapper at all).
 *
 * The theme is resolved by the APP (mangue-ui's `useTheme`), not by
 * border-beam's own `theme="auto"`: its auto hook reads `matchMedia` inside its
 * state initializer — server says "dark", first client render says the SYSTEM
 * preference → the generated <style> differs and React regenerates the whole
 * tree (hydration mismatch). `resolvedTheme` is SSR-safe (same value on the
 * server and on the first client render, corrected post-mount) and follows the
 * app's REAL theme rather than the OS's.
 */
export function AgentBeam({
  active,
  className,
  size = "pulse-inner",
  keepMounted = false,
  children,
}: AgentBeamProps) {
  const { resolvedTheme } = useTheme();
  if (!active && !keepMounted) return <>{children}</>;
  return (
    <BorderBeam
      {...BEAM_TUNING}
      active={active}
      size={size}
      theme={resolvedTheme}
      className={className}
    >
      {children}
    </BorderBeam>
  );
}

/**
 * The same beam, laid OVER a container instead of wrapping it: `absolute
 * inset-0`, no children, `pointer-events: none`. This is the only shape
 * possible on a PORTALLED surface positioned `fixed` — a modal, a side panel:
 * the portal teleports the element out of the `AgentBeam`, which then collapses
 * to 0×0 in the page flow and paints nothing. Render it as the LAST child of
 * the container (so it sits above the content); the container must be
 * positioned.
 *
 * Positioning goes through `style` rather than classes: the stylesheet
 * border-beam generates (`[data-beam] { position: relative }`) is OUTSIDE the
 * cascade layers, and therefore beats Tailwind utilities whatever their order.
 *
 * The radius is MEASURED on the container rather than passed by the call site:
 * border-beam's auto-detection reads the first child, and there is none here.
 * Measuring also follows the real container, whose radius may change with the
 * breakpoint (a side panel that becomes a bottom sheet).
 */
export function AgentBeamOverlay({
  active,
  size = "pulse-inner",
}: {
  active: boolean;
  size?: BorderBeamSize;
}) {
  const { resolvedTheme } = useTheme();
  const [radius, setRadius] = React.useState<number>();
  // A callback ref rather than a layout effect: it only runs on the client
  // commit, and therefore never during the server render.
  const measureParent = React.useCallback((node: HTMLDivElement | null) => {
    // `offsetParent`, not `parentElement`: that is the element `inset: 0`
    // actually resolves against, so it is the one whose radius to copy. The two
    // coincide on a side panel, but not on a modal turned bottom sheet, where a
    // scroll div with neither radius nor position sits in between.
    const box = node?.offsetParent ?? node?.parentElement;
    if (!box) return;
    const r = Number.parseFloat(getComputedStyle(box).borderTopLeftRadius);
    setRadius(Number.isFinite(r) ? r : undefined);
  }, []);
  // Always mounted: that is what gives the beam its fade-OUT when `active`
  // drops. Switched off it paints nothing (the glow is `display: none`).
  return (
    <BorderBeam
      {...BEAM_TUNING}
      ref={measureParent}
      active={active}
      size={size}
      theme={resolvedTheme}
      borderRadius={radius}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {null}
    </BorderBeam>
  );
}
