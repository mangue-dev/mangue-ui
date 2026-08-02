"use client";

// Searchable dropdowns for field pickers (status, priority, effort, assignee,
// owner, categories…). The trigger is yours — the opened menu is the shared
// SearchMenu shell (a cmdk <Command> with an integrated search input that
// filters the options, Linear-style). Single- and multi-select variants both
// render it in trigger-anchored mode.

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { CommandGroup, CommandItem, CommandSeparator } from "./command";
import { SearchMenu } from "./search-menu";
import { Spinner } from "./spinner";

export type PickerOption = {
  value: string;
  /** Shown text — also the primary search term. */
  label: string;
  /** Extra search terms (e.g. an email alongside a display name). */
  keywords?: string[];
  /** Leading visual (indicator, avatar, color dot…). */
  icon?: React.ReactNode;
};

/**
 * A last row of the menu that CREATES what you could not find — the quick
 * "add a category / an owner" from any board. It only exists once something is
 * typed: that text IS the name of what gets created, so without it the row
 * would have nothing to name. It stays visible when the search matches
 * nothing, though — that is where it earns its keep.
 */
export type PickerCreateOption = {
  /** Label, built on the typed text ("Create “design”"). */
  labelFor: (name: string) => string;
  /** Creates the entity from the typed text (never empty). */
  onCreate: (name: string) => void | Promise<void>;
  /**
   * Close the menu instead of keeping it open — for a picker that hands over
   * to a dialog, which needs the keyboard.
   */
  closeOnCreate?: boolean;
};

/**
 * The create row, pinned at the bottom of the menu.
 *
 * `forceMount` on the item AND on its group: without it, cmdk hides one (null
 * filter score) and the other (no registered item in the group) as soon as the
 * search matches nothing — i.e. exactly when you want to create. The separator
 * only renders on an empty search by default, hence `alwaysRender`.
 */
export function PickerCreateRow({
  create,
  query,
  takenLabels,
  onDone,
}: {
  create: PickerCreateOption;
  /** Current search text — it becomes the name of what gets created. */
  query: string;
  /** Names already taken in this menu (case-insensitive comparison). */
  takenLabels: string[];
  onDone: () => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const name = query.trim();
  // Nothing typed: no row (it would have no name to give).
  if (!name) return null;
  // A name already taken is not offered a second time: the existing row is
  // right above, and ticking it is the right gesture.
  if (
    takenLabels.some(
      (label) => label.trim().toLowerCase() === name.toLowerCase(),
    )
  )
    return null;

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await create.onCreate(name);
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <CommandSeparator alwaysRender className="my-1" />
      <CommandGroup forceMount>
        <CommandItem
          forceMount
          value="__create__"
          disabled={busy}
          onSelect={() => void run()}
        >
          {busy ? (
            <Spinner className="size-4 shrink-0" />
          ) : (
            <Plus className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">{create.labelFor(name)}</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

/**
 * cmdk forwards `data-checked` to the DOM; CommandItem renders its trailing
 * check from it. Spread (not a static prop) to stay type-safe.
 */
const checkedProps = (checked: boolean) =>
  checked ? ({ "data-checked": "true" } as const) : {};

type ShellProps = {
  trigger: React.ReactNode;
  /** Optional tooltip on the trigger (used by compact card pickers). */
  tooltip?: string;
  /** Key badge (e.g. "S") shown next to the tooltip — surfaces the shortcut. */
  shortcutHint?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  align?: "start" | "center" | "end";
  contentClassName?: string;
  /** Stop pointer/click from bubbling to a draggable/clickable ancestor. */
  stopPropagation?: boolean;
  /** Portal target — pass a node inside a modal Sheet/Dialog. */
  container?: HTMLElement | null;
};

/**
 * Open state + search text, shared by the two variants. The search is only
 * controlled when a create row needs to read it (cmdk owns it otherwise).
 */
export function usePickerShell(
  controlledOpen: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
  createOption: PickerCreateOption | undefined,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!next) setQuery("");
    onOpenChange?.(next);
    if (controlledOpen === undefined) setUncontrolledOpen(next);
  };
  const searchProps = createOption
    ? {
        searchValue: query,
        onSearchValueChange: setQuery,
        // "No results" only steps aside when the create row takes its place.
        // On an empty search that row does not exist, so a list with no
        // options at all keeps its hint.
        hideEmpty: query.trim() !== "",
      }
    : {};
  return { open, setOpen, query, setQuery, searchProps };
}

/**
 * Single-select searchable dropdown. Pass `noneOption` to add a top item that
 * clears the value (nullable fields like effort / assignee / owner).
 */
export function SearchSelect({
  value,
  onChange,
  options,
  noneOption,
  createOption,
  open: controlledOpen,
  onOpenChange,
  ...shell
}: ShellProps & {
  value: string | null;
  onChange: (v: string | null) => void;
  options: PickerOption[];
  noneOption?: { label: string; icon?: React.ReactNode };
  /** Trailing "Add…" row (see {@link PickerCreateOption}). */
  createOption?: PickerCreateOption;
  /** Controlled open state (e.g. driven by a keyboard shortcut). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen, query, setQuery, searchProps } = usePickerShell(
    controlledOpen,
    onOpenChange,
    createOption,
  );
  const select = (v: string | null) => {
    onChange(v);
    setOpen(false);
  };
  return (
    <SearchMenu open={open} onOpenChange={setOpen} {...shell} {...searchProps}>
      <CommandGroup>
        {noneOption && (
          <CommandItem
            value="__none__"
            keywords={[noneOption.label]}
            onSelect={() => select(null)}
            {...checkedProps(value === null)}
          >
            {noneOption.icon}
            <span className="truncate">{noneOption.label}</span>
          </CommandItem>
        )}
        {options.map((opt) => (
          <CommandItem
            key={opt.value}
            value={opt.value}
            keywords={[opt.label, ...(opt.keywords ?? [])]}
            onSelect={() => select(opt.value)}
            {...checkedProps(value === opt.value)}
          >
            {opt.icon}
            <span className="truncate">{opt.label}</span>
          </CommandItem>
        ))}
      </CommandGroup>
      {createOption && (
        <PickerCreateRow
          create={createOption}
          query={query}
          takenLabels={options.map((o) => o.label)}
          onDone={() => {
            setQuery("");
            if (createOption.closeOnCreate) setOpen(false);
          }}
        />
      )}
    </SearchMenu>
  );
}

/** Multi-select searchable dropdown. Toggling keeps the menu open. */
export function SearchMultiSelect({
  values,
  onChange,
  options,
  createOption,
  open: controlledOpen,
  onOpenChange,
  ...shell
}: ShellProps & {
  values: string[];
  onChange: (values: string[]) => void;
  options: PickerOption[];
  /** Trailing "Add…" row (see {@link PickerCreateOption}). */
  createOption?: PickerCreateOption;
  /** Controlled open state (e.g. driven by a keyboard shortcut). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen, query, setQuery, searchProps } = usePickerShell(
    controlledOpen,
    onOpenChange,
    createOption,
  );
  const toggle = (v: string) =>
    onChange(
      values.includes(v) ? values.filter((x) => x !== v) : [...values, v],
    );
  return (
    <SearchMenu open={open} onOpenChange={setOpen} {...shell} {...searchProps}>
      <CommandGroup>
        {options.map((opt) => (
          <CommandItem
            key={opt.value}
            value={opt.value}
            keywords={[opt.label, ...(opt.keywords ?? [])]}
            onSelect={() => toggle(opt.value)}
            {...checkedProps(values.includes(opt.value))}
          >
            {opt.icon}
            <span className="truncate">{opt.label}</span>
          </CommandItem>
        ))}
      </CommandGroup>
      {createOption && (
        <PickerCreateRow
          create={createOption}
          query={query}
          takenLabels={options.map((o) => o.label)}
          onDone={() => {
            // Multi-select stays open: you just added one tag, you may want a
            // second. The field restarts empty so the previous search does not
            // hide the list.
            setQuery("");
            if (createOption.closeOnCreate) setOpen(false);
          }}
        />
      )}
    </SearchMenu>
  );
}
