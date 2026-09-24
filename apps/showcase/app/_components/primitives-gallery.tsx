"use client";

import * as React from "react";
import {
  ArrowRight,
  Bell,
  Bold,
  Check,
  ChevronDown,
  Circle,
  Copy,
  CreditCard,
  Ellipsis,
  Github,
  Info,
  Italic,
  Link2,
  LogOut,
  Mail,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  TriangleAlert,
  Underline,
  User,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  TypeBadge,
  type StatusChipTone,
} from "mangue-ui";

/* ------------------------------------------------------------------ */
/* Layout helpers                                                     */
/* ------------------------------------------------------------------ */

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
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

interface RowProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

/** A labelled cluster of live examples with sensible flex-wrap defaults. */
function Row({ label, children, className }: RowProps) {
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

/** A soft panel used to group related demos without over-nesting Cards. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Static data                                                        */
/* ------------------------------------------------------------------ */

const BUTTON_VARIANTS = [
  "default",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const BUTTON_SIZES = [
  "sm",
  "default",
  "lg",
] as const;

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
] as const;

const STATUS_TONES: { tone: StatusChipTone; label: string }[] = [
  { tone: "neutral", label: "Neutral" },
  { tone: "info", label: "Info" },
  { tone: "success", label: "Success" },
  { tone: "warning", label: "Warning" },
  { tone: "danger", label: "Danger" },
];

const CATEGORIES = ["All", "Buttons", "Forms", "Overlays", "Data"] as const;

type ViewMode = "grid" | "list" | "board";

const VIEW_OPTIONS = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
] as const;

/* ------------------------------------------------------------------ */
/* Gallery                                                            */
/* ------------------------------------------------------------------ */

export function PrimitivesGallery() {
  // Form control state
  const [email, setEmail] = React.useState("");
  const [bio, setBio] = React.useState(
    "Design engineer building calm, fast interfaces.",
  );
  const [terms, setTerms] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [volume, setVolume] = React.useState<number[]>([60]);
  const [fruit, setFruit] = React.useState("mango");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [amount, setAmount] = React.useState("120.00");

  // Filters / toggles
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>(
    "All",
  );
  const [showArchived, setShowArchived] = React.useState(false);
  const [density, setDensity] = React.useState(true);

  // Progress (animated)
  const [progress, setProgress] = React.useState(24);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 12 : p + 8));
    }, 1100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10 space-y-12">
      {/* Intro ------------------------------------------------------- */}
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" icon={<Sparkles />}>
            mangue-ui
          </Badge>
          <StatusChip tone="success" icon={<Check />}>
            Live
          </StatusChip>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Primitives gallery
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          A live reference of every interactive primitive shipped by the design
          system. Buttons, form controls, overlays and data-display components,
          each with real state and keyboard-accessible behaviour.
        </p>
      </header>

      {/* Buttons ----------------------------------------------------- */}
      <Section
        title="Buttons"
        description="Five visual variants and the full size scale, including icon-only shapes."
      >
        <Panel>
          <div className="space-y-6">
            <Row label="Variants">
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </Row>

            <Separator />

            <Row label="Sizes">
              {BUTTON_SIZES.map((size) => (
                <Button key={size} size={size}>
                  Size {size}
                </Button>
              ))}
            </Row>

            <Separator />

            <Row label="Icon buttons">
              <Button size="icon-sm" aria-label="Add">
                <Plus />
              </Button>
              <Button size="icon-sm" variant="outline" aria-label="Settings">
                <Settings />
              </Button>
              <Button size="icon" variant="outline" aria-label="Search">
                <Search />
              </Button>
              <Button size="icon-lg" variant="ghost" aria-label="Notifications">
                <Bell />
              </Button>
            </Row>

            <Separator />

            <Row label="With leading icons">
              <Button>
                <Plus /> New project
              </Button>
              <Button variant="outline">
                <Github /> Continue with GitHub
              </Button>
              <Button variant="outline">
                <Copy /> Duplicate
              </Button>
              <Button variant="destructive">
                <Trash2 /> Delete
              </Button>
              <Button variant="link">
                Documentation <ArrowRight />
              </Button>
              <Button disabled>
                <Spinner /> Saving…
              </Button>
            </Row>

            <Separator />

            <Row label="Split buttons">
              <SplitButton
                onClick={() => {}}
                menu={
                  <>
                    <DropdownMenuItem>
                      <Sparkles /> From template
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy /> Duplicate existing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Github /> Import from GitHub
                    </DropdownMenuItem>
                  </>
                }
              >
                <Plus /> New project
              </SplitButton>
              <SplitButton
                variant="outline"
                size="sm"
                onClick={() => {}}
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
                <Check /> Save
              </SplitButton>
              <SplitButton
                variant="destructive"
                onClick={() => {}}
                menu={
                  <DropdownMenuItem>
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                }
              >
                <Trash2 /> Remove
              </SplitButton>
            </Row>
          </div>
        </Panel>
      </Section>

      {/* Badges & chips ---------------------------------------------- */}
      <Section
        title="Badges & chips"
        description="Compact status and taxonomy markers for lists, tables and cards."
      >
        <Panel>
          <div className="space-y-6">
            <Row label="Badge variants — no icon">
              {BADGE_VARIANTS.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </Row>

            <Row label="Badge variants — with icon">
              <Badge icon={<Star />}>Featured</Badge>
              <Badge variant="secondary" icon={<Check />}>Verified</Badge>
              <Badge variant="destructive" icon={<Trash2 />}>Deprecated</Badge>
              <Badge variant="outline" icon={<Circle />}>Draft</Badge>
            </Row>

            <Separator />

            <Row label="Status chips">
              {STATUS_TONES.map(({ tone, label }) => (
                <StatusChip key={tone} tone={tone} icon={<Circle />}>
                  {label}
                </StatusChip>
              ))}
            </Row>

            <Separator />

            <Row label="Type badges">
              <TypeBadge kind="video" label="Video" />
              <TypeBadge kind="clip" label="Clip" />
              <TypeBadge kind="screenshot" label="Screenshot" />
              <TypeBadge kind="locked" label="Locked" />
            </Row>

            <Separator />

            <Row label="Category pills">
              {CATEGORIES.map((c) => (
                <CategoryPill
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </CategoryPill>
              ))}
            </Row>
          </div>
        </Panel>
      </Section>

      {/* Form controls ----------------------------------------------- */}
      <Section
        title="Form controls"
        description="Fully controlled inputs — every value below is driven by React state."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Text & selection</CardTitle>
              <CardDescription>
                Inputs, textarea, select and grouped input.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="amount">
                  Amount
                </label>
                <InputGroup>
                  <InputGroupAddon>$</InputGroupAddon>
                  <InputGroupInput
                    id="amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => setAmount("0.00")}>
                      Clear
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="fruit">
                  Favourite fruit
                </label>
                <Select value={fruit} onValueChange={setFruit}>
                  <SelectTrigger id="fruit" className="w-full">
                    <SelectValue placeholder="Pick one" />
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
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="bio">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toggles & ranges</CardTitle>
              <CardDescription>
                Checkbox, switch, slider and segmented control.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={terms}
                  onCheckedChange={(v) => setTerms(v === true)}
                />
                <span>Accept terms and conditions</span>
              </label>

              <div className="flex items-center justify-between">
                <span className="text-sm">Email notifications</span>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Row label="Checkbox states">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => {}}
                    aria-label="Unchecked checkbox"
                  />
                  Unchecked
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked="indeterminate"
                    onCheckedChange={() => {}}
                    aria-label="Indeterminate checkbox"
                  />
                  Indeterminate
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked
                    disabled
                    aria-label="Disabled checked checkbox"
                  />
                  Disabled
                </label>
              </Row>

              <Row label="Switch states">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch
                    checked={false}
                    onCheckedChange={() => {}}
                    aria-label="Unchecked switch"
                  />
                  Off
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked disabled aria-label="Disabled switch" />
                  Disabled
                </label>
              </Row>

              <Slider
                label="Volume"
                valueLabel={`${volume[0]}%`}
                value={volume}
                onValueChange={setVolume}
                min={0}
                max={100}
                step={1}
              />

              <Slider
                label="Disabled"
                valueLabel="40%"
                defaultValue={[40]}
                min={0}
                max={100}
                disabled
              />

              <SegmentedControl
                label="Layout"
                options={VIEW_OPTIONS}
                value={view}
                onChange={setView}
              />
              <p className="text-xs text-muted-foreground">
                Selected view: <span className="font-medium">{view}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Tabs & accordion -------------------------------------------- */}
      <Section
        title="Tabs & accordion"
        description="Disclosure primitives for organising dense content."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Panel>
            <div className="space-y-5">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="text-muted-foreground">
                  A snapshot of the project — status, owners and recent changes.
                </TabsContent>
                <TabsContent value="activity" className="text-muted-foreground">
                  Every commit, comment and deploy in chronological order.
                </TabsContent>
                <TabsContent value="settings" className="text-muted-foreground">
                  Rename, transfer or archive this project.
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Line tabs
                </span>
                <Tabs defaultValue="line-overview">
                  <TabsList variant="line">
                    <TabsTrigger value="line-overview">Overview</TabsTrigger>
                    <TabsTrigger value="line-activity">Activity</TabsTrigger>
                    <TabsTrigger value="line-settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="line-overview" className="text-muted-foreground">
                    Inactive line tabs keep their hover on the trigger only.
                  </TabsContent>
                  <TabsContent value="line-activity" className="text-muted-foreground">
                    The active indicator follows the selected trigger.
                  </TabsContent>
                  <TabsContent value="line-settings" className="text-muted-foreground">
                    The same state treatment works for every line tab.
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Vertical tabs
                </span>
                <Tabs orientation="vertical" defaultValue="vertical-overview">
                  <TabsList variant="line">
                    <TabsTrigger value="vertical-overview">Overview</TabsTrigger>
                    <TabsTrigger value="vertical-activity">Activity</TabsTrigger>
                    <TabsTrigger value="vertical-settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="vertical-overview" className="text-muted-foreground">
                    Vertical and horizontal layouts share the same hover tokens.
                  </TabsContent>
                  <TabsContent value="vertical-activity" className="text-muted-foreground">
                    The trigger remains the only hoverable zone.
                  </TabsContent>
                  <TabsContent value="vertical-settings" className="text-muted-foreground">
                    Compound layouts do not paint their wrapper on hover.
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Panel>

          <Panel>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is mangue-ui?</AccordionTrigger>
                <AccordionContent animated>
                  A small, opinionated component library built on Radix and
                  Tailwind v4, tuned for product surfaces.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it themeable?</AccordionTrigger>
                <AccordionContent animated>
                  Yes — every colour flows from design tokens, so re-branding is
                  a single stylesheet away.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Does it ship dark mode?</AccordionTrigger>
                <AccordionContent animated>
                  Dark mode is first-class and driven by the theme provider.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>
        </div>
      </Section>

      {/* Overlays ---------------------------------------------------- */}
      <Section
        title="Overlays"
        description="Dialogs, menus and floating cards — each opens on interaction."
      >
        <Panel>
          <Row label="Triggers">
            {/* Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Mail /> Open dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite teammates</DialogTitle>
                  <DialogDescription>
                    Send an invitation by email. They will get access to this
                    workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="invite-email">
                    Email address
                  </label>
                  <Input id="invite-email" placeholder="teammate@example.com" />
                </div>
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

            {/* Alert dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 /> Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes your account and removes all data
                    from our servers. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Side panel — slides in from the right, becomes a bottom sheet on mobile */}
            <SidePanel>
              <SidePanelTrigger asChild>
                <Button variant="outline">
                  <Settings /> Open panel
                </Button>
              </SidePanelTrigger>
              <SidePanelContent>
                <SidePanelHeader>
                  <SidePanelTitle>Project settings</SidePanelTitle>
                  <SidePanelDescription>
                    Slides in from the edge on desktop, becomes a bottom sheet
                    below 480px.
                  </SidePanelDescription>
                </SidePanelHeader>
                <SidePanelBody className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor="panel-name">
                      Project name
                    </label>
                    <Input id="panel-name" defaultValue="mangue-ui" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor="panel-desc">
                      Description
                    </label>
                    <Textarea
                      id="panel-desc"
                      placeholder="What is this project about?"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The body scrolls on its own while the header and footer stay
                    pinned.
                  </p>
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

            {/* Dropdown menu */}
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
                <DropdownMenuItem variant="destructive">
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Settings /> Preferences
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="start">
                <PopoverHeader>
                  <PopoverTitle>Display</PopoverTitle>
                  <PopoverDescription>
                    Tune how content is rendered.
                  </PopoverDescription>
                </PopoverHeader>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm">Compact density</span>
                  <Switch checked={density} onCheckedChange={setDensity} />
                </div>
              </PopoverContent>
            </Popover>

            {/* Hover card */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">
                  <Github /> @mangue
                </Button>
              </HoverCardTrigger>
              <HoverCardContent align="start">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>MG</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">mangué</p>
                    <p className="text-xs text-muted-foreground">
                      Ships calm, fast interfaces. Building mangue-ui.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Info">
                  <Info />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Tooltips carry short, contextual hints.
              </TooltipContent>
            </Tooltip>
          </Row>
        </Panel>
      </Section>

      {/* Data display ------------------------------------------------ */}
      <Section
        title="Data display"
        description="Cards, avatars, progress, feedback and inline building blocks."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Card with footer */}
          <Card>
            <CardHeader>
              <CardTitle>Pro plan</CardTitle>
              <CardDescription>
                Everything you need to ship faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold">$24</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Unlimited projects
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Priority support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upgrade</Button>
            </CardFooter>
          </Card>

          {/* Avatars, progress, feedback */}
          <div className="space-y-4">
            <Panel>
              <div className="space-y-4">
                <Row label="Avatars">
                  <Avatar size="sm">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Avatar"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <Avatar size="lg">
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <AvatarGroup>
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+5</AvatarGroupCount>
                  </AvatarGroup>
                </Row>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading…</span>
                    <span className="tabular-nums text-muted-foreground">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              </div>
            </Panel>

            <Panel>
              <Row label="Loading">
                <Spinner />
                <Spinner className="h-6 w-6 text-primary" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </Row>
            </Panel>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid gap-3 md:grid-cols-2">
          <Alert>
            <Info />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              A new version of the library is available.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              We could not process your last invoice. Update your card to
              continue.
            </AlertDescription>
          </Alert>
        </div>

        {/* Inline building blocks */}
        <Panel>
          <div className="space-y-6">
            <Row label="Keyboard">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <Kbd size="sm">Esc</Kbd>
              <KbdSequence keys={[["⌘", "K"], ["P"]]} />
            </Row>

            <Separator />

            <Row label="Formatting toolbar">
              <div className="inline-flex items-center gap-1 rounded-lg border border-border p-1">
                <Button size="icon-sm" variant="ghost" aria-label="Bold">
                  <Bold />
                </Button>
                <Button size="icon-sm" variant="ghost" aria-label="Italic">
                  <Italic />
                </Button>
                <Button size="icon-sm" variant="ghost" aria-label="Underline">
                  <Underline />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-5" />
                <Button size="icon-sm" variant="ghost" aria-label="Link">
                  <Link2 />
                </Button>
                <Button size="icon-sm" variant="ghost" aria-label="More">
                  <Ellipsis />
                </Button>
              </div>
            </Row>
          </div>
        </Panel>
      </Section>
    </div>
  );
}
