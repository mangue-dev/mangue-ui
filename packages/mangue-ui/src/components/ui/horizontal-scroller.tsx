"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

interface HorizontalScrollerProps {
  children: React.ReactNode;
  /**
   * Re-measure scrollability whenever any of these change (row count, current
   * page, loading flag). The inner ResizeObserver already catches width
   * changes; this covers content swaps that keep the same width.
   */
  deps?: React.DependencyList;
  /** Classes for the outer relative wrapper. */
  className?: string;
  /** Classes for the inner scroll viewport (the element that overflows). */
  viewportClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
  /**
   * Keep the arrows transparent until the container is hovered or something
   * inside it takes focus. For a row of small chips, permanent arrows read as
   * chrome; on demand they read as an affordance.
   */
  revealOnHover?: boolean;
  /**
   * Soft gradient over each scrollable edge. On by default; turn it off for a
   * row of pills, where fading a chip in half looks like a rendering bug
   * rather than a hint.
   */
  edgeFade?: boolean;
  /** `sm` renders 20px round arrows sized for a chip row. */
  arrowSize?: "sm" | "default";
}

/**
 * Wraps wide content (a min-width table) in a horizontal scroll viewport and
 * overlays left/right navigation buttons that appear only when there is room to
 * scroll that way — so the table adapts to the available width and exposes
 * arrows when it overflows. Generalized from the `ScreenshotCarousel` pattern in
 * `preset-runtime-card.tsx`.
 */
export function HorizontalScroller({
  children,
  deps = [],
  className,
  viewportClassName,
  prevLabel = "Scroll left",
  nextLabel = "Scroll right",
  revealOnHover = false,
  edgeFade = true,
  arrowSize = "default",
}: HorizontalScrollerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const measure = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // `deps` lets callers force a re-measure on content swaps (same width).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const arrowClass = cn(
    "absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-control shadow-md backdrop-blur-sm",
    arrowSize === "sm" && "size-5 min-w-0 p-0 shadow-sm",
    // Revealed on hover — and on focus too, otherwise a keyboard user would
    // tab onto an invisible button.
    revealOnHover &&
      "opacity-0 transition-opacity group-hover/scroller:opacity-100 focus-visible:opacity-100",
  );
  const chevronClass = arrowSize === "sm" ? "size-3" : undefined;

  return (
    <div className={cn("group/scroller relative", className)}>
      <div
        ref={ref}
        className={cn("overflow-x-auto scrollbar-none", viewportClassName)}
      >
        {children}
      </div>

      {/* Edge fades hint at hidden content on each scrollable side. */}
      {edgeFade && canLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-card/0" />
      )}
      {edgeFade && canRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-card/0" />
      )}

      {canLeft && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={prevLabel}
          onClick={() => scroll("left")}
          className={cn(arrowClass, arrowSize === "sm" ? "left-0" : "left-1.5")}
        >
          <ChevronLeft className={chevronClass} />
        </Button>
      )}
      {canRight && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={nextLabel}
          onClick={() => scroll("right")}
          className={cn(
            arrowClass,
            arrowSize === "sm" ? "right-0" : "right-1.5",
          )}
        >
          <ChevronRight className={chevronClass} />
        </Button>
      )}
    </div>
  );
}
