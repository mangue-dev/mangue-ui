"use client";

import * as React from "react";
import { Square } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "../components/ui/prompt-input";
import { SendButtonWithCost } from "../components/ui/send-button-with-cost";
import { cn } from "../lib/utils";
import { AgentBeam } from "./agent-beam";

export interface AgentInputLabels {
  send: string;
  stop: string;
}

const DEFAULT_LABELS: AgentInputLabels = { send: "Send", stop: "Stop" };

export interface AgentInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  /** A turn is running: the beam lights up and Send becomes Stop. */
  isBusy?: boolean;
  /** Aborts the running turn. Without it, no stop button is offered. */
  onAbort?: () => void;
  disabled?: boolean;
  /** Blocks sending without disabling the field (an empty draft is enough). */
  sendDisabled?: boolean;
  /** Credit cost shown on the send button. `null` hides it (icon only). */
  cost?: number | null;
  /**
   * The context row, rendered flush at the top INSIDE the surface. Concentric
   * radii: the surface is `rounded-2xl` (24px), so a `rounded-md` pill (14px)
   * plus the 10px that separate it from the edge lands exactly on 24px.
   */
  contextSlot?: React.ReactNode;
  /** Left of the toolbar — model / branch / reasoning pickers. */
  toolbarStart?: React.ReactNode;
  /** Right of the toolbar, before the send cluster — attach, dictate… */
  toolbarEnd?: React.ReactNode;
  /** Replaces the default send button entirely. */
  sendSlot?: React.ReactNode;
  /** Rendered above the surface, outside it — a mention list, a slash menu. */
  overlay?: React.ReactNode;
  labels?: Partial<AgentInputLabels>;
  maxHeight?: number | string;
  className?: string;
}

/**
 * The AI composer: a prompt field wrapped in the agent beam, with a context row
 * on top and a toolbar underneath.
 *
 * `keepMounted` on the beam is NOT optional. Without it, every toggle of the
 * beam remounts the subtree, which loses the focus AND the text being typed —
 * and the text being typed while the agent answers is precisely what a composer
 * exists for.
 */
export function AgentInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Ask anything…",
  isBusy = false,
  onAbort,
  disabled = false,
  sendDisabled = false,
  cost = null,
  contextSlot,
  toolbarStart,
  toolbarEnd,
  sendSlot,
  overlay,
  labels,
  maxHeight = 180,
  className,
}: AgentInputProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const isEmpty = value.trim().length === 0;
  const showStop = isBusy && !!onAbort;

  return (
    <div className="relative">
      {/* The overlay lives OUTSIDE the surface: that one is `overflow-hidden`
          (the beam, the context row), and would clip it. */}
      {overlay}
      <AgentBeam active={isBusy} keepMounted className="rounded-2xl">
        <PromptInput
          value={value}
          onValueChange={onValueChange}
          onSubmit={onSubmit}
          isLoading={isBusy}
          disabled={disabled}
          maxHeight={maxHeight}
          className={cn(
            "flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm transition-all",
            "focus-within:outline-none",
            className,
          )}
        >
          {contextSlot ? <div className="px-2.5 pt-2.5">{contextSlot}</div> : null}

          <PromptInputTextarea
            placeholder={placeholder}
            // `text-foreground` overrides PromptInputTextarea's `text-primary`:
            // what you type is body copy, not a brand-colored accent.
            className="min-h-[52px] px-4 pt-3 pb-1 font-sans text-base leading-relaxed text-foreground md:text-sm"
          />

          <PromptInputActions className="justify-between gap-2 px-2 pt-1 pb-2">
            {/* Left cluster. Empty → the bar still looks the same (the send
                cluster stays flush right). */}
            <div className="flex min-w-0 items-center gap-1.5">
              {toolbarStart}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {showStop ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={onAbort}
                  aria-label={t.stop}
                  title={t.stop}
                  className="h-8 w-8 shrink-0 rounded-full"
                >
                  <Square className="h-3 w-3" />
                </Button>
              ) : (
                <>
                  {toolbarEnd}
                  {sendSlot ?? (
                    <SendButtonWithCost
                      cost={cost}
                      isLoading={isBusy}
                      disabled={disabled || sendDisabled || isEmpty}
                      onClick={onSubmit}
                      ariaLabel={t.send}
                      tooltipLabel={t.send}
                    />
                  )}
                </>
              )}
            </div>
          </PromptInputActions>
        </PromptInput>
      </AgentBeam>
    </div>
  );
}
