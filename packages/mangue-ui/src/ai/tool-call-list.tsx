"use client";

import * as React from "react";
import { ChevronRight, LayoutGrid, X } from "lucide-react";

import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export interface ToolCallItem {
  id: string;
  /** Tool name — the key looked up in `registry`. */
  name: string;
  /** Raw JSON arguments as the model emitted them. */
  arguments?: string;
  status: "running" | "complete";
  result?: unknown;
  success?: boolean;
}

export interface ToolMeta {
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Wording of one row. Gets the parsed arguments and the result, so a label
   * can say what actually happened ("3 issues updated") rather than restate
   * the tool's name.
   */
  getLabel: (
    args: Record<string, unknown>,
    result: Record<string, unknown> | undefined,
    success: boolean,
    status: ToolCallItem["status"],
  ) => string;
}

/** The wording the list falls back on for tools with no registry entry. */
export interface ToolCallLabels {
  /** A running action of unknown name. */
  processing: string;
  /** A finished action of unknown name. */
  done: string;
  /** The collapsed group's summary row ("5 actions"). */
  summary: (count: number) => string;
}

const DEFAULT_LABELS: ToolCallLabels = {
  processing: "Working…",
  done: "Done",
  summary: (count) => `${count} actions`,
};

const DEFAULT_ICON = LayoutGrid;

function safeParseArgs(args?: string): Record<string, unknown> {
  if (!args) return {};
  try {
    return JSON.parse(args);
  } catch {
    return {};
  }
}

function getToolView(
  item: ToolCallItem,
  registry: Record<string, ToolMeta>,
  labels: ToolCallLabels,
) {
  const meta = registry[item.name];
  const Icon = meta?.icon ?? DEFAULT_ICON;
  const label = meta
    ? meta.getLabel(
        safeParseArgs(item.arguments),
        item.result as Record<string, unknown> | undefined,
        item.success ?? true,
        item.status,
      )
    : item.status === "running"
      ? labels.processing
      : labels.done;
  return { Icon, label };
}

/** The running label of a tool, for surfaces that show only the current step. */
export function toolRunningLabel(
  name: string,
  registry: Record<string, ToolMeta>,
  labels: Partial<ToolCallLabels> = {},
): string {
  const merged = { ...DEFAULT_LABELS, ...labels };
  const meta = registry[name];
  if (!meta) return merged.processing;
  return meta.getLabel({}, undefined, true, "running");
}

function ToolCallRow({
  item,
  registry,
  labels,
}: {
  item: ToolCallItem;
  registry: Record<string, ToolMeta>;
  labels: ToolCallLabels;
}) {
  const { Icon, label } = getToolView(item, registry, labels);
  const isError = item.status === "complete" && item.success === false;

  return (
    <div
      className={cn(
        "flex items-center gap-2 py-0.5 text-xs",
        isError ? "text-destructive" : "text-muted-foreground",
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {/* Action RUNNING → the label itself shimmers (no spinner: text that
          breathes already says "this is going", without adding a spinning
          object). */}
      <span
        className={cn(
          "flex-1 truncate",
          item.status === "running" && "text-shimmer",
        )}
      >
        {label}
      </span>
      {isError ? <X className="h-3 w-3 shrink-0" /> : null}
    </div>
  );
}

export interface ToolCallListProps {
  items: ToolCallItem[];
  /**
   * Tool name → icon and wording. The library ships no tool vocabulary: this
   * is where an app declares its own. Unknown names fall back to `labels`.
   */
  registry?: Record<string, ToolMeta>;
  /** Fallback wording (see {@link ToolCallLabels}). English by default. */
  labels?: Partial<ToolCallLabels>;
  /**
   * Renders something of its own for an item — an interactive callout for a
   * "ask the user a question" tool, say. Returning a node REMOVES the item from
   * the rows above and renders that node under the list instead.
   */
  renderExtra?: (item: ToolCallItem) => React.ReactNode;
  className?: string;
}

/**
 * What an agent DID during a turn, folded down to as few lines as the situation
 * allows:
 *  • one action → one row, shimmering while it runs;
 *  • several, collapsed → only the LAST action, red only if that one failed
 *    (not if another in the group did), shimmering while any of them runs;
 *  • several, expanded → a neutral summary row plus the indented list, where
 *    the failing rows — and only those — are red.
 */
export function ToolCallList({
  items,
  registry = {},
  labels,
  renderExtra,
  className,
}: ToolCallListProps) {
  const [expanded, setExpanded] = React.useState(false);
  const merged = React.useMemo(
    () => ({ ...DEFAULT_LABELS, ...labels }),
    [labels],
  );

  if (items.length === 0) return null;

  // Items the host renders itself leave the rows and go under the list.
  const extras = renderExtra
    ? items
        .map((item) => ({ item, node: renderExtra(item) }))
        .filter((e) => e.node != null)
    : [];
  const extraIds = new Set(extras.map((e) => e.item.id));
  const rowItems = items.filter((i) => !extraIds.has(i.id));

  const renderRows = () => {
    if (rowItems.length === 0) return null;

    // Single action: the row shimmers on its own while it runs.
    if (rowItems.length === 1)
      return (
        <ToolCallRow item={rowItems[0]} registry={registry} labels={merged} />
      );

    const anyRunning = rowItems.some((i) => i.status === "running");

    if (expanded) {
      // NEUTRAL summary row: no global red when one action failed — only the
      // offending rows below turn red.
      return (
        <div className="flex flex-col">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(false)}
            className="group h-auto w-full justify-start gap-2 bg-transparent px-0 py-0.5 text-left text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <ChevronRight className="h-3 w-3 shrink-0 rotate-90 transition-transform" />
            <span className={cn("flex-1 truncate", anyRunning && "text-shimmer")}>
              {merged.summary(rowItems.length)}
            </span>
          </Button>
          <div className="ml-5 flex flex-col">
            {rowItems.map((item) => (
              <ToolCallRow
                key={item.id}
                item={item}
                registry={registry}
                labels={merged}
              />
            ))}
          </div>
        </div>
      );
    }

    // COLLAPSED: only the LATEST action shows. Red ONLY if THAT action failed
    // (not if another one in the group did). Shimmers while any action of the
    // group runs — the collapsed row summarizes the whole group, not just the
    // action it happens to name.
    const lastItem = rowItems[rowItems.length - 1];
    const lastLabel = getToolView(lastItem, registry, merged).label;
    const lastError =
      lastItem.status === "complete" && lastItem.success === false;
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(true)}
        className={cn(
          "group h-auto w-full justify-start gap-2 bg-transparent px-0 py-0.5 text-left text-xs font-normal hover:bg-transparent",
          lastError
            ? "text-destructive"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ChevronRight className="h-3 w-3 shrink-0 transition-transform" />
        <span className={cn("flex-1 truncate", anyRunning && "text-shimmer")}>
          {lastLabel}
        </span>
        {!anyRunning && lastError ? <X className="h-3 w-3 shrink-0" /> : null}
      </Button>
    );
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {renderRows()}
      {extras.map(({ item, node }) => (
        <React.Fragment key={item.id}>{node}</React.Fragment>
      ))}
    </div>
  );
}
