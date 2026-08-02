"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { buttonTap, transitions } from "../lib/motion";
import { cn } from "../lib/utils";
import { AgentBeam } from "./agent-beam";

export interface AgentFabProps {
  /** The face of the assistant — an icon, a mark, an avatar. */
  icon: React.ReactNode;
  /** Accessible name, also the tooltip's text. */
  label: string;
  onClick: () => void;
  /**
   * Whether the button is on screen. Mount/unmount animates. Route-based
   * hiding (a page where the assistant is already reachable) belongs to the
   * caller — this component knows nothing about routing.
   */
  visible?: boolean;
  /** A turn is running: the beam runs around the disc. */
  busy?: boolean;
  /** Shortcut hint next to the tooltip label — e.g. a `<KbdSequence>`. */
  shortcutHint?: React.ReactNode;
  /** Corner pip on the button (an armed chord's completion key). */
  badge?: React.ReactNode;
  className?: string;
}

/**
 * A minimal circular FAB that opens the assistant. Hovering reveals the label
 * in a tooltip — no permanent label.
 *
 * Closing the panel mid-turn need not stop the agent: the FAB then wears the
 * app's shared beam while work continues, and goes inert once it is done.
 * That is its ONLY signal — no context pip: what the assistant is looking at
 * reads inside the panel, above the composer, not on the button that opens it.
 */
export function AgentFab({
  icon,
  label,
  onClick,
  visible = true,
  busy = false,
  shortcutHint,
  badge,
  className,
}: AgentFabProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="agent-fab"
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.92 }}
          transition={{ ...transitions.gentle, delay: 0.35 }}
          className={cn(
            // Hidden below the mobile cutover — there the assistant belongs in
            // the mobile nav (a single entry point), and the FAB would sit on
            // top of it.
            "max-desktop:hidden",
            "fixed z-40",
            "right-4 bottom-4 md:right-6 md:bottom-6",
            "pb-[env(safe-area-inset-bottom)]",
            className,
          )}
        >
          {/* `keepMounted`: the button must not be remounted when the beam
              lights up or goes out — its entrance animation would replay on
              every toggle. */}
          <AgentBeam active={busy} size="sm" keepMounted className="rounded-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  onClick={onClick}
                  aria-label={label}
                  whileHover={{ y: -1, transition: transitions.snappy }}
                  whileTap={buttonTap.whileTap}
                  className={cn(
                    "relative inline-flex items-center justify-center rounded-full",
                    "h-10 w-10 md:h-11 md:w-11",
                    "bg-card/95 supports-backdrop-filter:backdrop-blur-md",
                    "ring-1 ring-foreground/10 hover:ring-foreground/20",
                    "text-foreground",
                    "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25),0_2px_6px_-2px_rgba(0,0,0,0.1)]",
                    "hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.3),0_3px_8px_-2px_rgba(0,0,0,0.12)]",
                    "transition-shadow",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "cursor-pointer",
                  )}
                >
                  {icon}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                sideOffset={10}
                className="flex max-w-none items-center gap-2"
              >
                <span>{label}</span>
                {shortcutHint}
              </TooltipContent>
            </Tooltip>
          </AgentBeam>
          {/* The corner pip sits OUTSIDE the beam (whose wrapper clips while
              lighting up) and hangs off the `fixed` container, which is exactly
              the button's size — otherwise it would be cropped while working. */}
          <AnimatePresence>
            {badge && (
              <motion.span
                key="agent-fab-badge"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={transitions.snappy}
                className="absolute -top-1.5 -right-1.5"
              >
                {badge}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
