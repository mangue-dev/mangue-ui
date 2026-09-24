"use client";

import { Slide } from "loading-dev";
import * as React from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Circle,
  Copy,
  CreditCard,
  FileSearch,
  Github,
  Info,
  Layers3,
  ListChecks,
  Mail,
  Palette,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Terminal,
  Trash2,
  TriangleAlert,
  User,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AgentInput,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CategoryPill,
  Checkbox,
  Combobox,
  ContextPill,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Kbd,
  KbdSequence,
  ModelCombobox,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  SegmentedControl,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SearchSelect,
  Separator,
  SidePanel,
  SidePanelBody,
  SidePanelClose,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelTitle,
  SidePanelTrigger,
  Skeleton,
  Slider,
  Spinner,
  SplitButton,
  StatusChip,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  ToolCallList,
  TypeBadge,
  type ModelOption,
  type StatusChipTone,
  type ToolCallItem,
  type ToolMeta,
} from "mangue-ui";

export const SHOWCASE_FAMILIES = [
  {
    id: "actions",
    label: "Actions",
    description: "Buttons, labels and compact status markers.",
  },
  {
    id: "forms",
    label: "Forms",
    description: "Inputs, selection and form-state controls.",
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Tabs and disclosure patterns for dense screens.",
  },
  {
    id: "overlays",
    label: "Overlays",
    description: "Dialogs, menus, popovers and contextual surfaces.",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Alerts, progress and loading states.",
  },
  {
    id: "display",
    label: "Data display",
    description: "Cards, avatars and structural primitives.",
  },
  {
    id: "ai",
    label: "AI surfaces",
    description: "Agent inputs, model pickers and execution traces.",
  },
] as const;

export type ShowcaseFamilyId = (typeof SHOWCASE_FAMILIES)[number]["id"];
export const DEFAULT_ACCENT = "#635BFF";

const ACCENT_PRESETS = [
  "#635BFF",
  "#2563EB",
  "#0891B2",
  "#059669",
  "#CA8A04",
  "#EA580C",
  "#DC2626",
  "#DB2777",
  "#7C3AED",
  "#374151",
] as const;

type ButtonProps = React.ComponentProps<typeof Button>;
type ButtonVariant = NonNullable<ButtonProps["variant"]>;
type ButtonSize = NonNullable<ButtonProps["size"]>;
type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>;
type TypeBadgeKind = NonNullable<React.ComponentProps<typeof TypeBadge>["kind"]>;
type SelectSize = NonNullable<React.ComponentProps<typeof SelectTrigger>["size"]>;
type InputGroupAlign = NonNullable<
  React.ComponentProps<typeof InputGroupAddon>["align"]
>;
type InputGroupButtonSize = NonNullable<
  React.ComponentProps<typeof InputGroupButton>["size"]
>;
type ContextRadius = NonNullable<
  React.ComponentProps<typeof ContextPill>["radius"]
>;
type PopoverAlign = NonNullable<
  React.ComponentProps<typeof PopoverContent>["align"]
>;
type TooltipSide = NonNullable<React.ComponentProps<typeof TooltipContent>["side"]>;
type SidePanelSide = NonNullable<
  React.ComponentProps<typeof SidePanelContent>["side"]
>;

const BUTTON_VARIANTS: ButtonVariant[] = [
  "default",
  "outline",
  "ghost",
  "destructive",
  "link",
];

const BUTTON_SIZES: ButtonSize[] = [
  "sm",
  "default",
  "lg",
  "icon-sm",
  "icon",
  "icon-lg",
];

const BADGE_VARIANTS: BadgeVariant[] = [
  "default",
  "secondary",
  "destructive",
  "outline",
];

const STATUS_TONES: StatusChipTone[] = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
];

const TYPE_BADGE_KINDS: TypeBadgeKind[] = [
  "video",
  "clip",
  "screenshot",
  "locked",
];

const MODELS: ModelOption[] = [
  { id: "anthropic/claude-opus-5", cost: "×3.0" },
  { id: "openai/gpt-5", cost: "×2.4" },
  { id: "google/gemini-3-pro", cost: "×1.6" },
  { id: "deepseek/deepseek-v4", cost: "×1.0" },
  { id: "openai/gpt-5-pro", cost: "×8.0", disabled: true },
];

const TOOL_REGISTRY: Record<string, ToolMeta> = {
  search_files: {
    icon: FileSearch,
    getLabel: (args, _result, success, status) => {
      const query = typeof args.query === "string" ? args.query : "component";
      return status === "running"
        ? `Searching for “${query}”`
        : success
          ? `Found 12 matches for “${query}”`
          : "Search failed";
    },
  },
  run_command: {
    icon: Terminal,
    getLabel: (args, _result, success, status) => {
      const command = typeof args.command === "string" ? args.command : "npm test";
      return status === "running"
        ? `Running ${command}`
        : success
          ? `Finished ${command}`
          : `${command} failed`;
    },
  },
  update_tasks: {
    icon: ListChecks,
    getLabel: (_args, result, success, status) => {
      if (status === "running") return "Updating the task list";
      if (!success) return "Could not update the task list";
      const count = typeof result?.updated === "number" ? result.updated : 0;
      return `${count} tasks updated`;
    },
  },
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugify(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readableForeground(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    },
  );
  const luminance =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return (luminance + 0.05) / 0.05 > 1.05 / (luminance + 0.05)
    ? "#0A0A0A"
    : "#FFFFFF";
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {}
  const field = document.createElement("textarea");
  field.value = value;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  try {
    document.execCommand("copy");
  } finally {
    field.remove();
  }
}

function CopyNameButton({ name }: { name: string }) {
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current);
    },
    [],
  );

  const handleCopy = async () => {
    await copyText(name);
    setCopied(true);
    if (timeout.current !== null) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
      onClick={handleCopy}
      aria-label={`Copy ${name} component name`}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Specimen({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={`component-${slugify(name)}`}
      className="scroll-mt-36 overflow-hidden rounded-2xl border border-border bg-card/80 shadow-[0_1px_0_color-mix(in_oklab,var(--foreground)_4%,transparent)] backdrop-blur-sm"
    >
      <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers3 className="size-3.5" />
            </span>
            <h3 className="code-font truncate text-sm font-semibold text-foreground">
              {name}
            </h3>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <CopyNameButton name={name} />
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </article>
  );
}

function VariantControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <span className="text-2xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </span>
      <div className="flex flex-wrap gap-1 rounded-xl border border-border-subtle bg-surface-sunken/60 p-1">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Button
              key={String(option)}
              type="button"
              size="sm"
              variant={selected ? "outline" : "ghost"}
              className="code-font h-7 min-w-7 px-2 text-2xs"
              aria-pressed={selected}
              onClick={() => onChange(option)}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function BooleanControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-sunken/60 px-3 py-2">
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function DemoControls({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 grid gap-3 border-b border-border-subtle pb-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

function Preview({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`showcase-grid flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border bg-surface-sunken/35 p-4 ${className}`}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

export function AccentPicker({
  accent,
  onAccentChange,
}: {
  accent: string;
  onAccentChange: (accent: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label={`Choose showcase accent color, currently ${accent}`}
        >
          <span
            className="size-3.5 rounded-full ring-2 ring-background"
            style={{ backgroundColor: accent }}
          />
          <span className="code-font hidden text-2xs sm:inline">{accent}</span>
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-3">
        <PopoverHeader>
          <PopoverTitle>Accent color</PopoverTitle>
          <PopoverDescription>
            Updates every primary surface and is saved in this browser.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-5 gap-2 pt-3">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="code-font flex h-9 items-center justify-center rounded-lg border border-border bg-card text-2xs font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                backgroundColor: preset,
                color: readableForeground(preset),
              }}
              onClick={() => onAccentChange(preset)}
              aria-label={`Use accent ${preset}`}
              aria-pressed={accent.toUpperCase() === preset}
            >
              {accent.toUpperCase() === preset ? <Check /> : null}
            </button>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 hover:bg-control-hover focus-within:ring-2 focus-within:ring-primary">
          <span>
            <span className="block text-xs font-medium text-foreground">
              Custom color
            </span>
            <span className="code-font block text-2xs text-muted-foreground">
              {accent.toUpperCase()}
            </span>
          </span>
          <span className="relative size-8 overflow-hidden rounded-full ring-1 ring-border">
            <span
              className="absolute inset-0"
              style={{ backgroundColor: accent }}
            />
            <input
              type="color"
              value={accent}
              onChange={(event) =>
                onAccentChange(event.target.value.toUpperCase())
              }
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label="Custom accent color"
            />
          </span>
        </label>
      </PopoverContent>
    </Popover>
  );
}

function ButtonDemo() {
  const [variant, setVariant] = React.useState<ButtonVariant>("default");
  const [size, setSize] = React.useState<ButtonSize>("default");
  const [working, setWorking] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const iconOnly = size.startsWith("icon");

  return (
    <>
      <DemoControls>
        <VariantControl
          label="Variant"
          value={variant}
          options={BUTTON_VARIANTS}
          onChange={setVariant}
        />
        <VariantControl
          label="Size"
          value={size}
          options={BUTTON_SIZES}
          onChange={setSize}
        />
        <BooleanControl label="Loading" checked={working} onChange={setWorking} />
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
      </DemoControls>
      <Preview>
        <div className="flex flex-col items-center gap-5">
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={iconOnly ? "Notifications" : undefined}
            onClick={() => setWorking(false)}
          >
            {working ? (
              <>
                <Spinner />
                <span className={iconOnly ? "sr-only" : undefined}>Saving</span>
              </>
            ) : iconOnly ? (
              <Bell />
            ) : (
              <>
                <Plus />
                Publish component
              </>
            )}
          </Button>
          <div className="w-full space-y-3 border-t border-border-subtle pt-3">
            <span className="block text-center text-2xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              All variants
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {BUTTON_VARIANTS.map((item) => (
                <Button key={item} variant={item} size="sm">
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Preview>
    </>
  );
}

function SplitButtonDemo() {
  const [variant, setVariant] = React.useState<
    "default" | "outline" | "destructive"
  >("default");
  const [size, setSize] = React.useState<"sm" | "default" | "lg">("default");
  const [action, setAction] = React.useState("Ready");

  return (
    <>
      <DemoControls>
        <VariantControl
          label="Variant"
          value={variant}
          options={["default", "outline", "destructive"] as const}
          onChange={setVariant}
        />
        <VariantControl
          label="Size"
          value={size}
          options={["sm", "default", "lg"] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <div className="flex flex-col items-center gap-4">
          <SplitButton
            variant={variant}
            size={size}
            onClick={() => setAction("Primary action triggered")}
            menu={
              <>
                <DropdownMenuItem>
                  <Check /> Save and close
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy /> Save as copy
                </DropdownMenuItem>
              </>
            }
          >
            <Plus /> New project
          </SplitButton>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {action}
          </span>
        </div>
      </Preview>
    </>
  );
}

function BadgeDemo() {
  const [variant, setVariant] = React.useState<BadgeVariant>("default");
  const [withIcon, setWithIcon] = React.useState(true);

  return (
    <>
      <DemoControls>
        <VariantControl
          label="Variant"
          value={variant}
          options={BADGE_VARIANTS}
          onChange={setVariant}
        />
        <BooleanControl
          label="Leading icon"
          checked={withIcon}
          onChange={setWithIcon}
        />
      </DemoControls>
      <Preview>
        <Badge variant={variant} icon={withIcon ? <Star /> : undefined}>
          Featured
        </Badge>
      </Preview>
    </>
  );
}

function StatusChipDemo() {
  const [tone, setTone] = React.useState<StatusChipTone>("success");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Tone"
          value={tone}
          options={STATUS_TONES}
          onChange={setTone}
        />
      </DemoControls>
      <Preview>
        <StatusChip tone={tone} icon={<Circle />}>
          {tone}
        </StatusChip>
      </Preview>
    </>
  );
}

function TypeBadgeDemo() {
  const [kind, setKind] = React.useState<TypeBadgeKind>("video");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Kind"
          value={kind}
          options={TYPE_BADGE_KINDS}
          onChange={setKind}
        />
      </DemoControls>
      <Preview>
        <TypeBadge kind={kind} label={kind} />
      </Preview>
    </>
  );
}

function CategoryPillDemo() {
  const categories = ["All", "Actions", "Forms", "Overlays", "Data"];
  const [active, setActive] = React.useState("Actions");
  return (
    <>
      <DemoControls>
        <div className="space-y-2 sm:col-span-2">
          <span className="text-2xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
            Active category
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryPill
                key={category}
                active={active === category}
                onClick={() => setActive(category)}
              >
                {category}
              </CategoryPill>
            ))}
          </div>
        </div>
      </DemoControls>
      <Preview>
        <p className="text-center text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{active}</span>
        </p>
      </Preview>
    </>
  );
}

function KeyboardDemo() {
  const [size, setSize] = React.useState<"sm" | "default">("default");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Size"
          value={size}
          options={["sm", "default"] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <div className="flex items-center justify-center gap-3">
          <Kbd size={size}>⌘</Kbd>
          <Kbd size={size}>K</Kbd>
          <KbdSequence keys={[["⌘", "K"], ["P"]]} size={size} />
        </div>
      </Preview>
    </>
  );
}

function InputDemo() {
  const [value, setValue] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);

  return (
    <>
      <DemoControls>
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
        <BooleanControl label="Invalid" checked={invalid} onChange={setInvalid} />
      </DemoControls>
      <Preview>
        <div className="mx-auto max-w-sm space-y-2">
          <label htmlFor="component-input" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="component-input"
            type="email"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="dev@mangue.ui"
            disabled={disabled}
            aria-invalid={invalid}
          />
          {invalid ? (
            <p className="text-xs text-destructive">Enter a valid email.</p>
          ) : null}
        </div>
      </Preview>
    </>
  );
}

function InputGroupDemo() {
  const [align, setAlign] = React.useState<InputGroupAlign>("inline-start");
  const [size, setSize] = React.useState<InputGroupButtonSize>("xs");
  const [amount, setAmount] = React.useState("120.00");

  return (
    <>
      <DemoControls>
        <VariantControl
          label="Addon align"
          value={align}
          options={[
            "inline-start",
            "inline-end",
            "block-start",
            "block-end",
          ] as const}
          onChange={setAlign}
        />
        <VariantControl
          label="Button size"
          value={size}
          options={["xs", "sm", "icon-xs", "icon-sm"] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <div className="mx-auto max-w-sm space-y-2">
          <label htmlFor="component-amount" className="text-sm font-medium">
            Amount
          </label>
          <InputGroup>
            {align === "inline-start" ? <InputGroupAddon>$</InputGroupAddon> : null}
            {align === "block-start" ? (
              <InputGroupAddon align="block-start">Amount in USD</InputGroupAddon>
            ) : null}
            <InputGroupInput
              id="component-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            {align === "block-end" ? (
              <InputGroupAddon align="block-end">USD</InputGroupAddon>
            ) : null}
            {align === "inline-end" ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size={size}
                  onClick={() => setAmount("0.00")}
                  aria-label={size.startsWith("icon") ? "Reset amount" : undefined}
                >
                  {size.startsWith("icon") ? <X /> : "0.00"}
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </div>
      </Preview>
    </>
  );
}

function TextareaDemo() {
  const [rows, setRows] = React.useState(3);
  const [value, setValue] = React.useState("Build calm, fast interfaces.");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Rows"
          value={rows}
          options={[2, 3, 5] as const}
          onChange={setRows}
        />
      </DemoControls>
      <Preview>
        <div className="mx-auto max-w-lg space-y-2">
          <Textarea
            rows={rows}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="Component description"
          />
          <p className="text-right text-xs text-muted-foreground">
            {value.length} characters
          </p>
        </div>
      </Preview>
    </>
  );
}

function SelectDemo() {
  const [size, setSize] = React.useState<SelectSize>("default");
  const [value, setValue] = React.useState("mango");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Trigger size"
          value={size}
          options={["sm", "default"] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger size={size} className="w-full max-w-sm">
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tropical</SelectLabel>
              <SelectItem value="mango">Mango</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
              <SelectItem value="papaya">Papaya</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Orchard</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="pear">Pear</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Preview>
    </>
  );
}

function ComboboxDemo() {
  const [variant, setVariant] = React.useState<"field" | "compact">("field");
  const [value, setValue] = React.useState("main");
  const [disabled, setDisabled] = React.useState(false);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Variant"
          value={variant}
          options={["field", "compact"] as const}
          onChange={setVariant}
        />
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
      </DemoControls>
      <Preview>
        <div className={variant === "field" ? "mx-auto max-w-sm" : "flex justify-center"}>
          <Combobox
            variant={variant}
            value={value}
            onChange={setValue}
            disabled={disabled}
            options={[
              { value: "main", label: "main", description: "Stable branch" },
              { value: "next", label: "next", description: "Next release" },
              { value: "feat/workbench", label: "feat/workbench" },
            ]}
            placeholder="Choose a branch"
            searchPlaceholder="Search branches…"
            aria-label="Branch"
          />
        </div>
      </Preview>
    </>
  );
}

const SEARCH_SELECT_OPTIONS = [
  { value: "backlog", label: "Backlog", keywords: ["planned", "to do"] },
  { value: "in_progress", label: "In progress", keywords: ["doing", "active"] },
  { value: "in_review", label: "In review", keywords: ["review", "qa"] },
  { value: "done", label: "Done", keywords: ["complete", "shipped"] },
];

function SearchSelectDemo() {
  const [value, setValue] = React.useState<string | null>("in_progress");
  const [open, setOpen] = React.useState(false);
  const [withNone, setWithNone] = React.useState(true);
  const selected = SEARCH_SELECT_OPTIONS.find((option) => option.value === value);

  return (
    <>
      <DemoControls>
        <BooleanControl label="Open" checked={open} onChange={setOpen} />
        <BooleanControl
          label="None option"
          checked={withNone}
          onChange={setWithNone}
        />
      </DemoControls>
      <Preview>
        <div className="flex justify-center">
          <SearchSelect
            value={value}
            onChange={setValue}
            open={open}
            onOpenChange={setOpen}
            options={SEARCH_SELECT_OPTIONS}
            searchPlaceholder="Search a status…"
            emptyText="No matching status"
            align="start"
            noneOption={withNone ? { label: "No status" } : undefined}
            trigger={
              <Button variant="outline" size="sm">
                {selected?.label ?? "No status"}
                <ChevronDown />
              </Button>
            }
          />
        </div>
      </Preview>
    </>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(
    true,
  );
  const [disabled, setDisabled] = React.useState(false);
  return (
    <>
      <DemoControls>
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
        <div className="flex min-h-10 items-center justify-between rounded-xl border border-border-subtle bg-surface-sunken/60 px-3 py-2">
          <span className="text-xs font-medium text-foreground">Current value</span>
          <span className="code-font text-2xs text-muted-foreground">
            {String(checked)}
          </span>
        </div>
      </DemoControls>
      <Preview>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {(["false", "indeterminate", "true"] as const).map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={value === "true" ? true : value === "false" ? false : value}
                disabled={disabled}
                onCheckedChange={(next) =>
                  setChecked(
                    next === true
                      ? true
                      : next === "indeterminate"
                        ? "indeterminate"
                        : false,
                  )
                }
              />
              {value}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked disabled />
            disabled
          </label>
        </div>
      </Preview>
    </>
  );
}

function SwitchDemo() {
  const [checked, setChecked] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  return (
    <>
      <DemoControls>
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
      </DemoControls>
      <Preview>
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm">Email notifications</span>
          <Switch
            checked={checked}
            onCheckedChange={setChecked}
            disabled={disabled}
            aria-label="Email notifications"
          />
          <span className="code-font w-12 text-2xs text-muted-foreground">
            {String(checked)}
          </span>
        </div>
      </Preview>
    </>
  );
}

function SliderDemo() {
  const [value, setValue] = React.useState<number[]>([60]);
  const [step, setStep] = React.useState(1);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Step"
          value={step}
          options={[1, 5, 10] as const}
          onChange={setStep}
        />
      </DemoControls>
      <Preview>
        <div className="mx-auto max-w-md space-y-5">
          <Slider
            label="Volume"
            valueLabel={`${value[0]}%`}
            value={value}
            onValueChange={setValue}
            min={0}
            max={100}
            step={step}
          />
          <Slider
            label="Disabled"
            valueLabel="40%"
            defaultValue={[40]}
            min={0}
            max={100}
            disabled
          />
        </div>
      </Preview>
    </>
  );
}

function SegmentedControlDemo() {
  const options = [
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
    { value: "board", label: "Board" },
  ] as const;
  const [value, setValue] = React.useState<(typeof options)[number]["value"]>(
    "grid",
  );
  return (
    <>
      <DemoControls>
        <div className="sm:col-span-2">
          <SegmentedControl
            label="View"
            options={options}
            value={value}
            onChange={setValue}
          />
        </div>
      </DemoControls>
      <Preview>
        <p className="text-center text-sm text-muted-foreground">
          Selected view: <span className="font-medium text-foreground">{value}</span>
        </p>
      </Preview>
    </>
  );
}

function TabsDemo() {
  const [variant, setVariant] = React.useState<"default" | "line">("default");
  const [orientation, setOrientation] = React.useState<
    "horizontal" | "vertical"
  >("vertical");
  const [value, setValue] = React.useState("overview");

  return (
    <>
      <DemoControls>
        <VariantControl
          label="List variant"
          value={variant}
          options={["default", "line"] as const}
          onChange={setVariant}
        />
        <VariantControl
          label="Orientation"
          value={orientation}
          options={["horizontal", "vertical"] as const}
          onChange={setOrientation}
        />
      </DemoControls>
      <Preview>
        <Tabs
          value={value}
          onValueChange={setValue}
          orientation={orientation}
          className="w-full"
        >
          <TabsList variant={variant}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-muted-foreground">
            A snapshot of the current component.
          </TabsContent>
          <TabsContent value="activity" className="text-sm text-muted-foreground">
            Recent changes and updates.
          </TabsContent>
          <TabsContent value="settings" className="text-sm text-muted-foreground">
            Configuration for this component.
          </TabsContent>
        </Tabs>
      </Preview>
    </>
  );
}

function AccordionDemo() {
  const [type, setType] = React.useState<"single" | "multiple">("single");
  const [animated, setAnimated] = React.useState(true);
  const items = (
    <>
      <AccordionItem value="one">
        <AccordionTrigger>What is a component variant?</AccordionTrigger>
        <AccordionContent animated={animated}>
          A controlled visual state exposed through typed props.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Can variants combine?</AccordionTrigger>
        <AccordionContent animated={animated}>
          Yes. Variant props are designed to compose predictably.
        </AccordionContent>
      </AccordionItem>
    </>
  );
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Type"
          value={type}
          options={["single", "multiple"] as const}
          onChange={setType}
        />
        <BooleanControl label="Animated" checked={animated} onChange={setAnimated} />
      </DemoControls>
      <Preview>
        {type === "single" ? (
          <Accordion
            type="single"
            collapsible
            defaultValue="one"
            className="w-full"
          >
            {items}
          </Accordion>
        ) : (
          <Accordion type="multiple" defaultValue={["one"]} className="w-full">
            {items}
          </Accordion>
        )}
      </Preview>
    </>
  );
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [showClose, setShowClose] = React.useState(true);
  return (
    <>
      <DemoControls>
        <BooleanControl
          label="Close button"
          checked={showClose}
          onChange={setShowClose}
        />
      </DemoControls>
      <Preview>
        <div className="flex justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail /> Open dialog
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={showClose}>
              <DialogHeader>
                <DialogTitle>Invite teammates</DialogTitle>
                <DialogDescription>
                  Send an invitation by email to collaborate on this component.
                </DialogDescription>
              </DialogHeader>
              <Input placeholder="teammate@example.com" aria-label="Email address" />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Send invite</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Preview>
    </>
  );
}

function AlertDialogDemo() {
  const [size, setSize] = React.useState<"default" | "sm">("default");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Content size"
          value={size}
          options={["default", "sm"] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 /> Delete project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All component data will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Preview>
    </>
  );
}

function DropdownMenuDemo() {
  const [showArchived, setShowArchived] = React.useState(false);
  const [destructive, setDestructive] = React.useState(false);
  return (
    <>
      <DemoControls>
        <BooleanControl
          label="Destructive action"
          checked={destructive}
          onChange={setDestructive}
        />
      </DemoControls>
      <Preview>
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User /> Profile
                <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard /> Billing
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={showArchived}
                onCheckedChange={setShowArchived}
              >
                Show archived
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant={destructive ? "destructive" : "default"}>
                <Trash2 /> Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Preview>
    </>
  );
}

function PopoverDemo() {
  const [align, setAlign] = React.useState<PopoverAlign>("center");
  const [compact, setCompact] = React.useState(false);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Alignment"
          value={align}
          options={["start", "center", "end"] as const}
          onChange={setAlign}
        />
        <BooleanControl label="Compact" checked={compact} onChange={setCompact} />
      </DemoControls>
      <Preview>
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings /> Preferences
              </Button>
            </PopoverTrigger>
            <PopoverContent align={align} className="w-72">
              <PopoverHeader>
                <PopoverTitle>Display</PopoverTitle>
                <PopoverDescription>Adjust the preview density.</PopoverDescription>
              </PopoverHeader>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Compact density</span>
                <Switch
                  checked={compact}
                  onCheckedChange={setCompact}
                  aria-label="Compact density"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Preview>
    </>
  );
}

function HoverCardDemo() {
  const [align, setAlign] = React.useState<PopoverAlign>("start");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Alignment"
          value={align}
          options={["start", "center", "end"] as const}
          onChange={setAlign}
        />
      </DemoControls>
      <Preview>
        <div className="flex justify-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">
                <Github /> @mangue
              </Button>
            </HoverCardTrigger>
            <HoverCardContent align={align}>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">mangué</p>
                  <p className="text-xs text-muted-foreground">
                    Building calm, fast interfaces.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Preview>
    </>
  );
}

function TooltipDemo() {
  const [side, setSide] = React.useState<TooltipSide>("top");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Side"
          value={side}
          options={["top", "right", "bottom", "left"] as const}
          onChange={setSide}
        />
      </DemoControls>
      <Preview>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More information">
              <Info />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            Tooltips carry short, contextual hints.
          </TooltipContent>
        </Tooltip>
      </Preview>
    </>
  );
}

function SidePanelDemo() {
  const [side, setSide] = React.useState<SidePanelSide>("right");
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Side"
          value={side}
          options={["left", "right"] as const}
          onChange={setSide}
        />
      </DemoControls>
      <Preview>
        <div className="flex justify-center">
          <SidePanel open={open} onOpenChange={setOpen}>
            <SidePanelTrigger asChild>
              <Button variant="outline">Open side panel</Button>
            </SidePanelTrigger>
            <SidePanelContent side={side}>
              <SidePanelHeader>
                <SidePanelTitle>Component settings</SidePanelTitle>
                <SidePanelDescription>
                  The body scrolls independently on larger screens.
                </SidePanelDescription>
              </SidePanelHeader>
              <SidePanelBody className="space-y-4">
                <Input defaultValue="mangue-ui" aria-label="Project name" />
                <Textarea placeholder="Describe this component…" />
              </SidePanelBody>
              <SidePanelFooter>
                <SidePanelClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </SidePanelClose>
                <SidePanelClose asChild>
                  <Button>Save changes</Button>
                </SidePanelClose>
              </SidePanelFooter>
            </SidePanelContent>
          </SidePanel>
        </div>
      </Preview>
    </>
  );
}

function AlertDemo() {
  const [variant, setVariant] = React.useState<"default" | "destructive">(
    "default",
  );
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Variant"
          value={variant}
          options={["default", "destructive"] as const}
          onChange={setVariant}
        />
      </DemoControls>
      <Preview>
        <Alert variant={variant}>
          {variant === "destructive" ? <TriangleAlert /> : <Info />}
          <AlertTitle>
            {variant === "destructive" ? "Payment failed" : "New version available"}
          </AlertTitle>
          <AlertDescription>
            {variant === "destructive"
              ? "Update your payment method to continue."
              : "mangue-ui 0.7.0 is ready to install."}
          </AlertDescription>
        </Alert>
      </Preview>
    </>
  );
}

function ProgressDemo() {
  const [value, setValue] = React.useState(24);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setValue((current) => (current >= 100 ? 12 : Math.min(100, current + 8)));
    }, 900);
    return () => window.clearInterval(interval);
  }, [running]);

  return (
    <>
      <DemoControls>
        <BooleanControl label="Running" checked={running} onChange={setRunning} />
      </DemoControls>
      <Preview>
        <div className="mx-auto max-w-md space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading assets</span>
            <span className="tabular-nums text-muted-foreground">{value}%</span>
          </div>
          <Progress value={value} aria-label="Upload progress" />
        </div>
      </Preview>
    </>
  );
}

function SpinnerDemo() {
  const [size, setSize] = React.useState<16 | 24 | 32>(24);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Size"
          value={size}
          options={[16, 24, 32] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <div className="flex items-center justify-center gap-4 text-primary">
          <Slide duration={1600} size={size} />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      </Preview>
    </>
  );
}

function SkeletonDemo() {
  const [round, setRound] = React.useState(false);
  return (
    <>
      <DemoControls>
        <BooleanControl label="Circular" checked={round} onChange={setRound} />
      </DemoControls>
      <Preview>
        <div className="flex items-center justify-center gap-5">
          <Slide duration={1600} size={48} />
          <div className="flex items-center gap-3">
            <Skeleton className={round ? "size-9 rounded-full" : "size-9"} />
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </Preview>
    </>
  );
}

function CardDemo() {
  const [size, setSize] = React.useState<"default" | "sm">("default");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Size"
          value={size}
          options={["default", "sm"] as const}
          onChange={setSize}
        />
      </DemoControls>
      <Preview>
        <Card size={size} className="mx-auto max-w-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Developer plan</CardTitle>
            <CardDescription>Everything needed to ship a product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Unlimited components</p>
            <p>Priority updates</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose plan</Button>
          </CardFooter>
        </Card>
      </Preview>
    </>
  );
}

function AvatarDemo() {
  const [size, setSize] = React.useState<"sm" | "default" | "lg">("default");
  const [withImage, setWithImage] = React.useState(true);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Size"
          value={size}
          options={["sm", "default", "lg"] as const}
          onChange={setSize}
        />
        <BooleanControl label="Image" checked={withImage} onChange={setWithImage} />
      </DemoControls>
      <Preview>
        <div className="flex items-center justify-center gap-5">
          <Avatar size={size}>
            {withImage ? (
              <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
            ) : null}
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            <Avatar size={size}>
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
            <Avatar size={size}>
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </Preview>
    </>
  );
}

function SeparatorDemo() {
  const [orientation, setOrientation] = React.useState<
    "horizontal" | "vertical"
  >("horizontal");
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Orientation"
          value={orientation}
          options={["horizontal", "vertical"] as const}
          onChange={setOrientation}
        />
      </DemoControls>
      <Preview>
        <div
          className={
            orientation === "vertical"
              ? "flex h-16 items-center gap-4"
              : "space-y-4"
          }
        >
          <span className="text-sm text-muted-foreground">Overview</span>
          <Separator orientation={orientation} className={orientation === "vertical" ? "h-8" : "w-full"} />
          <span className="text-sm text-muted-foreground">Activity</span>
          {orientation === "horizontal" ? <Separator className="w-full" /> : null}
          <span className="text-sm text-muted-foreground">Settings</span>
        </div>
      </Preview>
    </>
  );
}

function AgentInputDemo() {
  const [value, setValue] = React.useState("Review the Button variants.");
  const [busy, setBusy] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [model, setModel] = React.useState("");

  return (
    <>
      <DemoControls>
        <BooleanControl label="Busy" checked={busy} onChange={setBusy} />
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
      </DemoControls>
      <Preview>
        <AgentInput
          value={value}
          onValueChange={setValue}
          onSubmit={() => setBusy(true)}
          onAbort={() => setBusy(false)}
          isBusy={busy}
          disabled={disabled}
          placeholder="Ask the agent anything…"
          toolbarStart={
            <ModelCombobox
              models={MODELS}
              value={model}
              onChange={setModel}
              variant="compact"
              defaultLabel="Default model"
              defaultModelId="anthropic/claude-opus-5"
            />
          }
        />
      </Preview>
    </>
  );
}

function ModelComboboxDemo() {
  const [variant, setVariant] = React.useState<"field" | "compact">("field");
  const [value, setValue] = React.useState("openai/gpt-5");
  const [disabled, setDisabled] = React.useState(false);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Variant"
          value={variant}
          options={["field", "compact"] as const}
          onChange={setVariant}
        />
        <BooleanControl label="Disabled" checked={disabled} onChange={setDisabled} />
      </DemoControls>
      <Preview>
        <div className={variant === "field" ? "mx-auto max-w-sm" : "flex justify-center"}>
          <ModelCombobox
            models={MODELS}
            value={value}
            onChange={setValue}
            variant={variant}
            disabled={disabled}
            defaultLabel="My default model"
            defaultModelId="anthropic/claude-opus-5"
            searchPlaceholder="Search a model…"
            footer="Models above ×4 require the Pro plan."
          />
        </div>
      </Preview>
    </>
  );
}

function ContextPillDemo() {
  const [radius, setRadius] = React.useState<ContextRadius>("full");
  const [ignored, setIgnored] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  return (
    <>
      <DemoControls>
        <VariantControl
          label="Radius"
          value={radius}
          options={["full", "md"] as const}
          onChange={setRadius}
        />
        <BooleanControl label="Ambient" checked={!ignored} onChange={(value) => setIgnored(!value)} />
      </DemoControls>
      <Preview>
        <div className="flex flex-wrap justify-center gap-2">
          <ContextPill
            label="Design System"
            tooltip="Project — Design System"
            radius={radius}
            disabled={ignored}
            onToggle={() => setIgnored((value) => !value)}
            visual={{
              icon: Layers3,
              tint: "bg-primary/10 text-primary",
            }}
          />
          {visible ? (
            <ContextPill
              label="Q3 objectives"
              tooltip="Objective — Q3 objectives"
              radius={radius}
              onRemove={() => setVisible(false)}
              visual={{
                icon: Sparkles,
                tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
              }}
            />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setVisible(true)}>
              Restore pinned context
            </Button>
          )}
        </div>
      </Preview>
    </>
  );
}

function ToolCallListDemo() {
  const [status, setStatus] = React.useState<"running" | "complete">("running");
  const [success, setSuccess] = React.useState(true);
  const items: ToolCallItem[] = [
    {
      id: "1",
      name: "search_files",
      arguments: '{"query":"Button variants"}',
      status: "running",
    },
    {
      id: "2",
      name: "run_command",
      arguments: '{"command":"npm run typecheck"}',
      status: "complete",
      success,
      result: { exitCode: success ? 0 : 1 },
    },
    {
      id: "3",
      name: "update_tasks",
      arguments: "{}",
      status: "complete",
      success: true,
      result: { updated: 3 },
    },
  ];
  const resolved = items.map((item) =>
    item.id === "1" ? { ...item, status } : item,
  ) as ToolCallItem[];

  return (
    <>
      <DemoControls>
        <VariantControl
          label="First call"
          value={status}
          options={["running", "complete"] as const}
          onChange={setStatus}
        />
        <BooleanControl label="Command succeeds" checked={success} onChange={setSuccess} />
      </DemoControls>
      <Preview>
        <ToolCallList items={resolved} registry={TOOL_REGISTRY} />
      </Preview>
    </>
  );
}

type CatalogItem = {
  name: string;
  family: ShowcaseFamilyId;
  description: string;
  keywords: string;
  Demo: React.ComponentType;
};

const CATALOG: CatalogItem[] = [
  {
    name: "Button",
    family: "actions",
    description: "Five visual variants, six sizes and icon-only controls.",
    keywords: "action cta submit icon loading",
    Demo: ButtonDemo,
  },
  {
    name: "SplitButton",
    family: "actions",
    description: "Pairs one primary action with a dropdown trigger.",
    keywords: "action menu dropdown",
    Demo: SplitButtonDemo,
  },
  {
    name: "Badge",
    family: "actions",
    description: "Compact metadata with four visual variants.",
    keywords: "label tag pill metadata",
    Demo: BadgeDemo,
  },
  {
    name: "StatusChip",
    family: "actions",
    description: "Communicates neutral, informational and semantic states.",
    keywords: "status tone chip",
    Demo: StatusChipDemo,
  },
  {
    name: "TypeBadge",
    family: "actions",
    description: "Marks media and protected content types.",
    keywords: "media type video clip screenshot locked",
    Demo: TypeBadgeDemo,
  },
  {
    name: "CategoryPill",
    family: "actions",
    description: "A compact selectable filter with explicit active state.",
    keywords: "filter category segmented",
    Demo: CategoryPillDemo,
  },
  {
    name: "KbdSequence",
    family: "actions",
    description: "Displays single keys and complete keyboard sequences.",
    keywords: "keyboard shortcut command",
    Demo: KeyboardDemo,
  },
  {
    name: "Input",
    family: "forms",
    description: "Native input behavior with invalid and disabled states.",
    keywords: "text field email form",
    Demo: InputDemo,
  },
  {
    name: "InputGroup",
    family: "forms",
    description: "Composes inputs with start, end, top and bottom addons.",
    keywords: "input addon prefix suffix amount",
    Demo: InputGroupDemo,
  },
  {
    name: "Textarea",
    family: "forms",
    description: "Multi-line text input for longer authored content.",
    keywords: "form multiline description",
    Demo: TextareaDemo,
  },
  {
    name: "Select",
    family: "forms",
    description: "Grouped native menu selection with trigger sizing.",
    keywords: "dropdown picker option form",
    Demo: SelectDemo,
  },
  {
    name: "Combobox",
    family: "forms",
    description: "Searchable single selection in field or compact form.",
    keywords: "autocomplete searchable picker",
    Demo: ComboboxDemo,
  },
  {
    name: "SearchSelect",
    family: "forms",
    description: "Searchable dropdown shell with optional empty-state row.",
    keywords: "search dropdown picker status",
    Demo: SearchSelectDemo,
  },
  {
    name: "Checkbox",
    family: "forms",
    description: "Supports checked, unchecked and indeterminate states.",
    keywords: "boolean check tri-state form",
    Demo: CheckboxDemo,
  },
  {
    name: "Switch",
    family: "forms",
    description: "Immediate binary setting with controlled state.",
    keywords: "toggle boolean setting",
    Demo: SwitchDemo,
  },
  {
    name: "Slider",
    family: "forms",
    description: "Numeric range control with labels and configurable steps.",
    keywords: "range volume value",
    Demo: SliderDemo,
  },
  {
    name: "SegmentedControl",
    family: "forms",
    description: "A typed multi-option control for compact view switching.",
    keywords: "segmented tabs view options",
    Demo: SegmentedControlDemo,
  },
  {
    name: "Tabs",
    family: "navigation",
    description: "Horizontal or vertical tabs with two list treatments.",
    keywords: "tab navigation orientation",
    Demo: TabsDemo,
  },
  {
    name: "Accordion",
    family: "navigation",
    description: "Single or multiple disclosure with optional animation.",
    keywords: "collapse disclosure details",
    Demo: AccordionDemo,
  },
  {
    name: "Dialog",
    family: "overlays",
    description: "A focused modal that becomes a bottom sheet on mobile.",
    keywords: "modal window overlay",
    Demo: DialogDemo,
  },
  {
    name: "AlertDialog",
    family: "overlays",
    description: "Confirmation dialog for consequential actions.",
    keywords: "confirm destructive modal warning",
    Demo: AlertDialogDemo,
  },
  {
    name: "DropdownMenu",
    family: "overlays",
    description: "Action menu with labels, shortcuts and checkable rows.",
    keywords: "menu actions popover",
    Demo: DropdownMenuDemo,
  },
  {
    name: "Popover",
    family: "overlays",
    description: "Non-modal contextual content anchored to a trigger.",
    keywords: "popover preferences contextual",
    Demo: PopoverDemo,
  },
  {
    name: "HoverCard",
    family: "overlays",
    description: "Rich content revealed on hover or keyboard focus.",
    keywords: "hover preview profile tooltip",
    Demo: HoverCardDemo,
  },
  {
    name: "Tooltip",
    family: "overlays",
    description: "Short contextual hint with four placement options.",
    keywords: "tooltip hint overlay",
    Demo: TooltipDemo,
  },
  {
    name: "SidePanel",
    family: "overlays",
    description: "Persistent side surface that becomes a mobile sheet.",
    keywords: "drawer panel sheet aside",
    Demo: SidePanelDemo,
  },
  {
    name: "Alert",
    family: "feedback",
    description: "Inline informational or destructive message.",
    keywords: "message warning error notice",
    Demo: AlertDemo,
  },
  {
    name: "Progress",
    family: "feedback",
    description: "Compact determinate progress indicator.",
    keywords: "loading progress upload bar",
    Demo: ProgressDemo,
  },
  {
    name: "Spinner",
    family: "feedback",
    description: "Loading indicator powered by loading.dev with configurable sizing.",
    keywords: "loading activity busy loader",
    Demo: SpinnerDemo,
  },
  {
    name: "Skeleton",
    family: "feedback",
    description: "Placeholder surface for content that is still loading.",
    keywords: "placeholder loading shimmer",
    Demo: SkeletonDemo,
  },
  {
    name: "Card",
    family: "display",
    description: "Structured content surface with compact and default density.",
    keywords: "surface panel content",
    Demo: CardDemo,
  },
  {
    name: "Avatar",
    family: "display",
    description: "User identity in three sizes with image fallback.",
    keywords: "user profile image group",
    Demo: AvatarDemo,
  },
  {
    name: "Separator",
    family: "display",
    description: "Horizontal or vertical structural divider.",
    keywords: "divider rule line",
    Demo: SeparatorDemo,
  },
  {
    name: "AgentInput",
    family: "ai",
    description: "Agent composer with busy, stop and model-selection states.",
    keywords: "prompt chat composer llm",
    Demo: AgentInputDemo,
  },
  {
    name: "ModelCombobox",
    family: "ai",
    description: "Provider-aware model picker with cost and plan metadata.",
    keywords: "llm provider model picker",
    Demo: ModelComboboxDemo,
  },
  {
    name: "ContextPill",
    family: "ai",
    description: "Ambient or pinned context attached to an agent run.",
    keywords: "context attachment token llm",
    Demo: ContextPillDemo,
  },
  {
    name: "ToolCallList",
    family: "ai",
    description: "Compact execution trace with running, success and error states.",
    keywords: "tools trace execution agent",
    Demo: ToolCallListDemo,
  },
];

const FAMILY_BY_ID = Object.fromEntries(
  SHOWCASE_FAMILIES.map((family) => [family.id, family]),
) as Record<ShowcaseFamilyId, (typeof SHOWCASE_FAMILIES)[number]>;

type FamilyFilter = "all" | ShowcaseFamilyId;

function itemMatches(
  item: CatalogItem,
  family: FamilyFilter,
  normalizedQuery: string,
) {
  if (family !== "all" && item.family !== family) return false;
  if (!normalizedQuery) return true;
  const familyLabel = FAMILY_BY_ID[item.family].label;
  return normalize(
    `${item.name} ${item.description} ${item.keywords} ${familyLabel}`,
  ).includes(normalizedQuery);
}

export function PrimitivesGallery({
  accent,
  activeKey,
  focusRequest,
  onActiveChange,
  onAccentChange,
}: {
  accent: string;
  activeKey: string;
  focusRequest: number;
  onActiveChange: (key: string) => void;
  onAccentChange: (accent: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [family, setFamily] = React.useState<FamilyFilter>("all");

  React.useEffect(() => {
    if (activeKey === "overview") {
      setFamily("all");
      return;
    }
    if (SHOWCASE_FAMILIES.some((item) => item.id === activeKey)) {
      setFamily(activeKey as FamilyFilter);
    }
  }, [activeKey]);

  React.useEffect(() => {
    if (activeKey === "overview") {
      setFamily("all");
    } else if (SHOWCASE_FAMILIES.some((item) => item.id === activeKey)) {
      setFamily(activeKey as FamilyFilter);
    }
    setQuery("");
  }, [focusRequest]);

  React.useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;
    const sections = SHOWCASE_FAMILIES.map((item) =>
      document.getElementById(item.id),
    ).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) onActiveChange(visible.target.id);
      },
      { root, rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onActiveChange]);

  const normalizedQuery = normalize(query.trim());
  const visibleItems = CATALOG.filter((item) =>
    itemMatches(item, family, normalizedQuery),
  );
  const visibleCount = visibleItems.length;

  return (
    <div className="min-h-full bg-background">
      <section
        id="overview"
        className="showcase-grid relative overflow-hidden border-b border-border px-5 py-10 sm:px-8 sm:py-14 lg:px-12"
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" icon={<Sparkles />}>
              Component workbench
            </Badge>
            <StatusChip tone="success" icon={<Circle />}>
              v0.7.0
            </StatusChip>
          </div>
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
                Build against the real thing.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                A focused catalog for iterating on mangue-ui. Inspect every live
                component, switch its props, copy its name and test the system
                against a custom accent.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:gap-3">
              {[
                [SHOWCASE_FAMILIES.length, "families"],
                [CATALOG.length, "components"],
                ["Live", "props"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="font-display text-xl font-semibold text-foreground">
                    {value}
                  </div>
                  <div className="mt-0.5 text-2xs uppercase tracking-[0.12em] text-text-tertiary">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="code-font mt-7 flex w-fit max-w-full items-center gap-3 rounded-xl border border-border bg-card/85 px-4 py-3 text-xs shadow-sm backdrop-blur-sm">
            <span className="text-primary">$</span>
            <span className="truncate">npm install mangue-ui</span>
            <ArrowRight className="ml-2 size-3.5 text-muted-foreground" />
          </div>
        </div>
      </section>

      <div
        data-showcase-toolbar
        className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1 xl:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components…"
              aria-label="Search components"
              className="pr-9 pl-9"
            />
            {query ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                onClick={() => setQuery("")}
                aria-label="Clear component search"
              >
                <X />
              </Button>
            ) : null}
          </div>
          <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5 xl:justify-center">
            <CategoryPill
              active={family === "all"}
              onClick={() => {
                setFamily("all");
                setQuery("");
                onActiveChange("overview");
              }}
            >
              All <span className="code-font ml-1 opacity-60">{CATALOG.length}</span>
            </CategoryPill>
            {SHOWCASE_FAMILIES.map((item) => {
              const count = CATALOG.filter((entry) => entry.family === item.id).length;
              return (
                <CategoryPill
                  key={item.id}
                  active={family === item.id}
                  onClick={() => {
                    setFamily(item.id);
                    setQuery("");
                    onActiveChange(item.id);
                  }}
                >
                  {item.label}{" "}
                  <span className="code-font ml-1 opacity-60">{count}</span>
                </CategoryPill>
              );
            })}
          </div>
          <AccentPicker accent={accent} onAccentChange={onAccentChange} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-primary">
              Live catalog
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
              {family === "all" ? "All components" : FAMILY_BY_ID[family].label}
            </h2>
          </div>
          <span className="code-font text-xs text-muted-foreground">
            {visibleCount} {visibleCount === 1 ? "result" : "results"}
          </span>
        </div>

        {visibleCount === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">No component found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another name or reset the family filter.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                setQuery("");
                setFamily("all");
                onActiveChange("overview");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {SHOWCASE_FAMILIES.map((section) => {
              const items = visibleItems.filter((item) => item.family === section.id);
              if (items.length === 0) return null;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-36"
                  aria-labelledby={`${section.id}-title`}
                >
                  <div className="mb-4 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2
                        id={`${section.id}-title`}
                        className="font-display text-xl font-semibold tracking-tight text-foreground"
                      >
                        {section.label}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                    <span className="code-font text-2xs uppercase tracking-[0.12em] text-text-tertiary">
                      {items.length} components
                    </span>
                  </div>
                  <div className="grid items-start gap-4 lg:grid-cols-2">
                    {items.map((item) => (
                      <Specimen
                        key={item.name}
                        name={item.name}
                        description={item.description}
                      >
                        <item.Demo />
                      </Specimen>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
