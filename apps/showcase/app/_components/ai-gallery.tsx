"use client";

import * as React from "react";
import {
  Bot,
  FileSearch,
  FileText,
  GitBranch,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  Terminal,
} from "lucide-react";

import {
  AgentFab,
  AgentInput,
  Badge,
  Button,
  Combobox,
  ContextPill,
  ContextPillRow,
  Kbd,
  KbdSequence,
  ModelBadge,
  ModelCombobox,
  SearchSelect,
  StatusChip,
  ToolCallList,
  WorkAccordion,
  useScrollFade,
  type ModelOption,
  type ToolCallItem,
  type ToolMeta,
} from "mangue-ui";

/* ------------------------------------------------------------------ */
/* Layout helpers (mirrors primitives-gallery.tsx)                     */
/* ------------------------------------------------------------------ */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 scroll-mt-8">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="space-y-2">
      {label ? (
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div
        className={
          "flex flex-wrap items-center gap-3" + (className ? ` ${className}` : "")
        }
      >
        {children}
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Static demo data                                                    */
/* ------------------------------------------------------------------ */

const MODELS: ModelOption[] = [
  { id: "anthropic/claude-opus-5", cost: "×3.0" },
  { id: "openai/gpt-5", cost: "×2.4" },
  { id: "google/gemini-3-pro", cost: "×1.6" },
  { id: "deepseek/deepseek-v4", cost: "×1.0" },
  // Beyond the plan's ceiling: greyed but still listed and still readable —
  // knowing it exists and what it costs is the reason to upgrade.
  { id: "openai/gpt-5-pro", cost: "×8.0", disabled: true },
];

const BRANCHES = [
  { value: "main", label: "main" },
  { value: "next", label: "next" },
  { value: "feat/ai-gallery", label: "feat/ai-gallery" },
];

const REASONING = [
  { value: "off", label: "Off", description: "Answer straight away." },
  { value: "low", label: "Low", description: "A short pass before answering." },
  { value: "medium", label: "Medium", description: "Thinks through the steps." },
  { value: "high", label: "High", description: "Long deliberation, slower." },
];

/** A three-tool registry — the vocabulary the library never ships itself. */
const TOOL_REGISTRY: Record<string, ToolMeta> = {
  search_files: {
    icon: FileSearch,
    getLabel: (args, _result, success, status) => {
      const q = typeof args.query === "string" ? args.query : "…";
      if (status === "running") return `Searching for “${q}”`;
      return success ? `Found 12 matches for “${q}”` : `Search failed`;
    },
  },
  run_command: {
    icon: Terminal,
    getLabel: (args, _result, success, status) => {
      const cmd = typeof args.command === "string" ? args.command : "…";
      if (status === "running") return `Running \`${cmd}\``;
      return success ? `Ran \`${cmd}\`` : `\`${cmd}\` exited with an error`;
    },
  },
  update_tasks: {
    icon: ListChecks,
    getLabel: (_args, result, success, status) => {
      if (status === "running") return "Updating the task list";
      if (!success) return "Could not update the task list";
      const n = typeof result?.updated === "number" ? result.updated : 0;
      return `${n} tasks updated`;
    },
  },
};

const TOOL_STEPS: ToolCallItem[][] = [
  [
    {
      id: "1",
      name: "search_files",
      arguments: '{"query":"useScrollFade"}',
      status: "running",
    },
  ],
  [
    {
      id: "1",
      name: "search_files",
      arguments: '{"query":"useScrollFade"}',
      status: "complete",
      success: true,
    },
    {
      id: "2",
      name: "run_command",
      arguments: '{"command":"npm run typecheck"}',
      status: "running",
    },
  ],
  [
    {
      id: "1",
      name: "search_files",
      arguments: '{"query":"useScrollFade"}',
      status: "complete",
      success: true,
    },
    {
      id: "2",
      name: "run_command",
      arguments: '{"command":"npm run typecheck"}',
      status: "complete",
      success: false,
    },
    {
      id: "3",
      name: "update_tasks",
      arguments: "{}",
      result: { updated: 4 },
      status: "complete",
      success: true,
    },
  ],
];

const PICKER_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "in_review", label: "In review" },
  { value: "done", label: "Done" },
];

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export function AiGallery() {
  // Composer
  const [prompt, setPrompt] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [model, setModel] = React.useState("");
  const [branch, setBranch] = React.useState("");
  const [reasoning, setReasoning] = React.useState("medium");

  // Context pills
  const [ignored, setIgnored] = React.useState<Set<string>>(new Set());
  const [pinned, setPinned] = React.useState(["MANG-1"]);
  const toggleIgnored = (key: string) =>
    setIgnored((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // A run that counts up for 8s, then freezes — the "working since / worked
  // for" swap and the auto-close of the accordion both play on the way out.
  const [run, setRun] = React.useState<{ startedAt: number; endedAt: number | null }>(
    () => ({ startedAt: 0, endedAt: null }),
  );
  const [step, setStep] = React.useState(0);
  // The pending timers live in a ref so a replay CANCELS the previous run
  // rather than stacking a second set of timers on top of it.
  const timers = React.useRef<number[]>([]);
  const startRun = React.useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    const startedAt = Date.now();
    setRun({ startedAt, endedAt: null });
    setStep(0);
    timers.current = [
      window.setTimeout(() => setStep(1), 2600),
      window.setTimeout(() => setStep(2), 5600),
      window.setTimeout(() => setRun({ startedAt, endedAt: Date.now() }), 8000),
    ];
  }, []);
  React.useEffect(() => {
    startRun();
    return () => timers.current.forEach(window.clearTimeout);
  }, [startRun]);
  const runActive = run.startedAt !== 0 && run.endedAt === null;

  // Fade hooks — one per axis.
  const vertical = useScrollFade<HTMLDivElement>();
  const horizontal = useScrollFade<HTMLDivElement>("x");

  // Field picker
  const [status, setStatus] = React.useState<string | null>("in_progress");

  const modelPickerProps = {
    models: MODELS,
    value: model,
    onChange: setModel,
    defaultLabel: "My default model",
    defaultModelId: "anthropic/claude-opus-5",
    searchPlaceholder: "Search a model…",
    footer: "Models above ×4 need the Pro plan.",
  } as const;

  return (
    <div className="mx-auto max-w-5xl space-y-12 p-6 md:p-10">
      {/* Intro ------------------------------------------------------- */}
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" icon={<Sparkles />}>
            mangue-ui / ai
          </Badge>
          <StatusChip tone="info">Agent surfaces</StatusChip>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          AI gallery
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          The agent-facing half of the library: a composer that lights up while a
          turn runs, model pickers that know their providers, the trace of what
          an agent did, and the context it had in front of it. Every label is a
          prop — the library ships no i18n.
        </p>
      </header>

      {/* Composer ---------------------------------------------------- */}
      <Section
        title="Agent input"
        description="The AI composer, wrapped in the agent beam. Toggle “busy” — the beam lights up and Send becomes Stop, without the field losing its focus or its text."
      >
        <Panel>
          <div className="space-y-4">
            <AgentInput
              value={prompt}
              onValueChange={setPrompt}
              onSubmit={() => setBusy(true)}
              isBusy={busy}
              onAbort={() => setBusy(false)}
              placeholder="Ask the agent anything…"
              contextSlot={
                <ContextPillRow
                  deps={[ignored.size, pinned.length]}
                  action={
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="size-7 shrink-0 rounded-full text-muted-foreground"
                      aria-label="Add context"
                    >
                      @
                    </Button>
                  }
                >
                  <ContextPill
                    label="Design System"
                    tooltip="Project — Design System"
                    radius="md"
                    className="shadow-none"
                    visual={{
                      icon: Layers,
                      tint: "bg-violet-500/12 text-violet-600 dark:text-violet-400",
                    }}
                    disabled={ignored.has("project")}
                    onToggle={() => toggleIgnored("project")}
                  />
                  <ContextPill
                    label="Q3 objectives"
                    tooltip="Objective — Q3 objectives"
                    radius="md"
                    className="shadow-none"
                    visual={{
                      icon: Target,
                      tint: "bg-teal-500/12 text-teal-600 dark:text-teal-400",
                    }}
                    disabled={ignored.has("objective")}
                    onToggle={() => toggleIgnored("objective")}
                  />
                  {pinned.map((key) => (
                    <ContextPill
                      key={key}
                      label={key}
                      tooltip={`Issue ${key} — pinned by hand`}
                      radius="md"
                      className="shadow-none"
                      visual={{
                        icon: FileText,
                        tint: "bg-blue-500/12 text-blue-600 dark:text-blue-400",
                      }}
                      onRemove={() =>
                        setPinned((p) => p.filter((k) => k !== key))
                      }
                    />
                  ))}
                </ContextPillRow>
              }
              toolbarStart={
                <>
                  <ModelCombobox {...modelPickerProps} variant="compact" />
                  <Combobox
                    variant="compact"
                    value={branch}
                    onChange={setBranch}
                    options={BRANCHES}
                    triggerIcon={
                      <GitBranch className="size-3.5 shrink-0 text-muted-foreground" />
                    }
                    placeholder="main"
                    searchPlaceholder="Search a branch…"
                    aria-label="Base branch"
                  />
                </>
              }
            />
            <Row label="Demo controls">
              <Button
                variant={busy ? "default" : "outline"}
                size="sm"
                onClick={() => setBusy((b) => !b)}
              >
                {busy ? "Stop the beam" : "Start a turn"}
              </Button>
              <span className="text-xs text-muted-foreground">
                Type something first, then toggle — the text survives.
              </span>
            </Row>
          </div>
        </Panel>
      </Section>

      {/* Model pickers ----------------------------------------------- */}
      <Section
        title="Model pickers"
        description="Provider logos come from @lobehub/icons, names are reformatted from the raw id. Out-of-plan rows stay listed and readable, with the reason pinned under the list."
      >
        <Panel>
          <div className="space-y-6">
            <Row label="Field variant">
              <div className="w-full max-w-sm">
                <ModelCombobox {...modelPickerProps} />
              </div>
            </Row>

            <Row label="Compact variant">
              <ModelCombobox {...modelPickerProps} variant="compact" />
              <ModelCombobox
                {...modelPickerProps}
                variant="compact"
                disabled
                disabledTooltip="Frozen for this session — start a new run to change it."
              />
              <span className="text-xs text-muted-foreground">
                The second one is locked — hover it.
              </span>
            </Row>

            <Row label="Badges">
              <ModelBadge model="anthropic/claude-opus-5" />
              <ModelBadge model="openai/gpt-5" />
              <ModelBadge model="google/gemini-3-pro" />
              <ModelBadge model="deepseek/deepseek-v4-flash" />
              <ModelBadge model="mistralai/mistral-large" />
            </Row>

            <Row label="Reasoning level (a plain Combobox)">
              <Combobox
                variant="compact"
                value={reasoning}
                onChange={setReasoning}
                options={REASONING}
                triggerIcon={
                  <Bot className="size-3.5 shrink-0 text-muted-foreground" />
                }
                aria-label="Reasoning level"
              />
            </Row>
          </div>
        </Panel>
      </Section>

      {/* Work trace -------------------------------------------------- */}
      <Section
        title="Work accordion & tool calls"
        description="What the agent is doing right now, folded to as few lines as the situation allows. The header counts live, then freezes and closes itself; a running action shimmers; a failed one goes red on its own row only."
      >
        <Panel>
          <div className="space-y-4">
            <WorkAccordion
              key={run.startedAt}
              startedAt={run.startedAt}
              endedAt={run.endedAt}
              active={runActive}
            >
              <ToolCallList
                items={TOOL_STEPS[step]}
                registry={TOOL_REGISTRY}
              />
            </WorkAccordion>
            <Row label="Demo controls">
              <Button variant="outline" size="sm" onClick={startRun}>
                Replay the run
              </Button>
              <span className="text-xs text-muted-foreground">
                Eight seconds: three tool calls, one of them failing.
              </span>
            </Row>
          </div>
        </Panel>
      </Section>

      {/* Scroll fades ------------------------------------------------ */}
      <Section
        title="Scroll fades"
        description="useScrollFade masks only the edges that actually have more to reveal — the top fade appears once you have scrolled past the start, the bottom one disappears at the end."
      >
        <Panel>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                Vertical
              </span>
              <div
                ref={vertical.ref}
                {...vertical.scrollProps}
                className="h-40 overflow-y-auto rounded-lg border border-border p-3"
              >
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {Array.from({ length: 14 }, (_, i) => (
                    <li key={i}>Event {i + 1} — the agent read a file.</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                Horizontal
              </span>
              <div
                ref={horizontal.ref}
                {...horizontal.scrollProps}
                className="overflow-x-auto rounded-lg border border-border p-3"
              >
                <div className="flex w-max items-center gap-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Badge key={i} variant="outline">
                      file-{i + 1}.tsx
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </Section>

      {/* Dropdowns --------------------------------------------------- */}
      <Section
        title="Searchable dropdowns"
        description="The cmdk shell behind every field picker: a search row welded to the top, scored filtering, and a trailing check driven by data-checked."
      >
        <Panel>
          <Row label="SearchSelect">
            <SearchSelect
              value={status}
              onChange={setStatus}
              options={PICKER_OPTIONS}
              searchPlaceholder="Search a status…"
              trigger={
                <Button variant="outline" size="sm">
                  {PICKER_OPTIONS.find((o) => o.value === status)?.label ??
                    "No status"}
                </Button>
              }
              noneOption={{ label: "No status" }}
            />
          </Row>
        </Panel>
      </Section>

      {/* FAB --------------------------------------------------------- */}
      <Section
        title="Agent FAB"
        description="The floating button that opens the assistant — beam while a turn runs, tooltip on the left, corner pip for an armed chord. It is `fixed`, so the real one lives in the bottom-right of this page."
      >
        <Panel>
          <Row label="Live (bottom-right of the viewport)">
            <Button
              variant={busy ? "default" : "outline"}
              size="sm"
              onClick={() => setBusy((b) => !b)}
            >
              Toggle its beam
            </Button>
            <KbdSequence keys={[["G"], ["A"]]} size="sm" />
          </Row>
        </Panel>
        <AgentFab
          icon={<Sparkles className="size-5" />}
          label="Ask the assistant"
          onClick={() => setBusy((b) => !b)}
          busy={busy}
          shortcutHint={<KbdSequence keys={[["G"], ["A"]]} size="sm" />}
          badge={
            busy ? (
              <Kbd size="sm" className="shadow-sm ring-1 ring-border">
                A
              </Kbd>
            ) : null
          }
        />
      </Section>
    </div>
  );
}
