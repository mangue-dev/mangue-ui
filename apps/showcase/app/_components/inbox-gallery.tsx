"use client";

import * as React from "react";
import { ChevronLeft, GitPullRequest, MessageSquare, Star } from "lucide-react";

import {
  Badge,
  Button,
  SecondarySidebar,
  matchesFilter,
  cn,
} from "mangue-ui";

/**
 * A list-and-detail screen — the shape `SecondarySidebar` is made for.
 *
 * The list is WRITTEN here, next to the selection state that drives the detail;
 * it is DISPLAYED in the chrome, full height, flush against the primary sidebar,
 * which rails itself on its own the moment this mounts.
 */

type Thread = {
  id: string;
  title: string;
  author: string;
  preview: string;
  kind: "comment" | "review";
  unread?: boolean;
};

const THREADS: Thread[] = [
  {
    id: "1",
    title: "Rail mode folds under a still pointer",
    author: "Clément",
    preview:
      "Landing on a two-sidebar page folds the bar under a pointer that never moved — the click on the row is what navigated.",
    kind: "comment",
    unread: true,
  },
  {
    id: "2",
    title: "Add a shell curve to transitions",
    author: "Numo",
    preview:
      "A spring overshoots, and a layout width that overshoots makes the right half of the screen judder.",
    kind: "review",
    unread: true,
  },
  {
    id: "3",
    title: "The gutter shows through while it closes",
    author: "Clément",
    preview:
      "Paint it in the sidebar's colours: the column then closes like a shutter, with no hole.",
    kind: "comment",
  },
  {
    id: "4",
    title: "Filter placeholder names the list",
    author: "Margo",
    preview:
      "It takes over the role of the title we removed from the row — the breadcrumb already writes it.",
    kind: "comment",
  },
  {
    id: "5",
    title: "Keep the icon column still",
    author: "Numo",
    preview:
      "An icon must not move by a pixel between the open and the folded bar: it is the only landmark that survives.",
    kind: "review",
  },
];

export function InboxGallery() {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>("1");

  const matches = React.useMemo(
    () =>
      THREADS.filter((t) =>
        matchesFilter(query, [t.title, t.author, t.preview]),
      ),
    [query],
  );
  const selected = THREADS.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-0">
      <SecondarySidebar
        title="Inbox"
        // Below `md`, list and detail take turns full screen.
        hiddenOnMobile={!!selected}
        filter={{
          value: query,
          onChange: setQuery,
          placeholder: `Filter ${THREADS.length} threads…`,
        }}
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="Starred only">
            <Star />
          </Button>
        }
      >
        {matches.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No match.
          </p>
        ) : (
          <ul className="flex flex-col gap-1 px-2 pt-2 pb-4">
            {matches.map((thread) => {
              const Icon = thread.kind === "review" ? GitPullRequest : MessageSquare;
              const active = thread.id === selectedId;
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(thread.id)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left outline-none transition-colors focus-visible:bg-muted/60",
                      active ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {thread.title}
                        </span>
                        {thread.unread && (
                          <span
                            className="size-2 shrink-0 rounded-full bg-blue-500"
                            aria-label="Unread"
                          />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {thread.preview}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </SecondarySidebar>

      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col md:flex",
          selected ? "flex" : "hidden",
        )}
      >
        {selected ? (
          <>
            <div className="flex shrink-0 items-center gap-2 px-4 py-3 md:hidden">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Inbox"
                onClick={() => setSelectedId(null)}
              >
                <ChevronLeft />
              </Button>
              <span className="truncate text-sm font-medium">{selected.title}</span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-8 md:px-6 md:pt-6">
              <div className="mx-auto flex max-w-3xl flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selected.kind === "review" ? "Review" : "Comment"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selected.author}
                  </span>
                </div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  {selected.title}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selected.preview}
                </p>
                <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  The detail pane is an ordinary page. Only the column on its left
                  travelled: it is written here, rendered in the chrome.
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden flex-1 items-center justify-center text-sm text-muted-foreground md:flex">
            Pick a thread.
          </div>
        )}
      </div>
    </div>
  );
}
