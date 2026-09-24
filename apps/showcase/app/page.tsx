"use client";

import * as React from "react";
import {
  Activity,
  Bot,
  FormInput,
  LayoutPanelTop,
  Layers3,
  Moon,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  Sparkles,
  Sun,
} from "lucide-react";

import {
  AppShell,
  Button,
  CommandMenu,
  Header,
  MobileNav,
  SearchCommand,
  Sidebar,
  SidebarFooterRow,
  useCommandMenu,
  useTheme,
  type NavSection,
} from "mangue-ui";

import {
  AccentPicker,
  DEFAULT_ACCENT,
  PrimitivesGallery,
  SHOWCASE_FAMILIES,
  type ShowcaseFamilyId,
} from "./_components/primitives-gallery";

const ACCENT_STORAGE_KEY = "mangue-ui-showcase-accent";

const FAMILY_ICONS = {
  actions: MousePointerClick,
  forms: FormInput,
  navigation: PanelsTopLeft,
  overlays: Layers3,
  feedback: Activity,
  display: LayoutPanelTop,
  ai: Bot,
} satisfies Record<ShowcaseFamilyId, React.ComponentType<{ className?: string }>>;

function normalizeHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : null;
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
  const contrastAgainstWhite = 1.05 / (luminance + 0.05);
  const contrastAgainstBlack = (luminance + 0.05) / 0.05;
  return contrastAgainstBlack > contrastAgainstWhite ? "#0A0A0A" : "#FFFFFF";
}

export default function Home() {
  const { open, setOpen } = useCommandMenu();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeKey, setActiveKey] = React.useState("overview");
  const [focusRequest, setFocusRequest] = React.useState(0);
  const [accent, setAccent] = React.useState(DEFAULT_ACCENT);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
      const normalized = stored ? normalizeHex(stored) : null;
      if (normalized) setAccent(normalized);
    } catch {
      setAccent(DEFAULT_ACCENT);
    }
  }, []);

  React.useEffect(() => {
    const normalized = normalizeHex(accent) ?? DEFAULT_ACCENT;
    const foreground = readableForeground(normalized);
    const root = document.documentElement.style;
    root.setProperty("--primary", normalized);
    root.setProperty("--primary-foreground", foreground);
    root.setProperty("--sidebar-primary", normalized);
    root.setProperty("--sidebar-primary-foreground", foreground);
    root.setProperty("--brand", normalized);
    root.setProperty("--brand-foreground", foreground);
    root.setProperty("--accent-glow", normalized);
    root.setProperty("--accent-glow-foreground", foreground);
    root.setProperty(
      "--accent-glow-muted",
      `color-mix(in oklab, ${normalized} 14%, transparent)`,
    );
    root.setProperty("--ring", normalized);
    root.setProperty("--sidebar-ring", normalized);
    root.setProperty("--chart-4", normalized);
  }, [accent]);

  const updateAccent = React.useCallback((value: string) => {
    const normalized = normalizeHex(value);
    if (!normalized) return;
    setAccent(normalized);
    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, normalized);
    } catch {}
  }, []);

  const resetAccent = React.useCallback(() => {
    setAccent(DEFAULT_ACCENT);
    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, DEFAULT_ACCENT);
    } catch {}
  }, []);

  const scrollToId = React.useCallback((id: string) => {
    setActiveKey(id);
    setFocusRequest((request) => request + 1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        const main = element?.closest("main");
        if (!element || !main) return;
        const toolbar = document.querySelector<HTMLElement>(
          "[data-showcase-toolbar]",
        );
        const top =
          main.scrollTop +
          element.getBoundingClientRect().top -
          main.getBoundingClientRect().top -
          (toolbar?.getBoundingClientRect().height ?? 0) -
          16;
        main.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    });
  }, []);

  const navSections = React.useMemo<NavSection[]>(
    () => [
      {
        label: "Workbench",
        items: [
          {
            key: "overview",
            label: "Overview",
            icon: Sparkles,
            onClick: () => scrollToId("overview"),
          },
        ],
      },
      {
        label: "Component families",
        items: SHOWCASE_FAMILIES.map((family) => ({
          key: family.id,
          label: family.label,
          icon: FAMILY_ICONS[family.id],
          onClick: () => scrollToId(family.id),
        })),
      },
    ],
    [scrollToId],
  );

  const commandGroups = React.useMemo(
    () => [
      {
        heading: "Component workbench",
        items: navSections.flatMap((section) =>
          section.items.map((item) => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
            onSelect: item.onClick,
          })),
        ),
      },
    ],
    [navSections],
  );

  return (
    <AppShell
      secondarySidebar={false}
      sidebar={
        <Sidebar
          sections={navSections}
          activeKey={activeKey}
          header={<Brand />}
          modeKey="component-workbench"
          footer={
            <div className="flex flex-col gap-0.5">
              <SidebarFooterRow
                icon={resolvedTheme === "dark" ? Sun : Moon}
                label={resolvedTheme === "dark" ? "Light theme" : "Dark theme"}
                onClick={toggleTheme}
              />
              <SidebarFooterRow
                icon={Palette}
                label="Reset accent"
                onClick={resetAccent}
              />
            </div>
          }
        />
      }
      header={
        <Header
          breadcrumb={[
            {
              key: "mangue-ui",
              label: "mangue-ui",
              icon: Sparkles,
              onClick: () => scrollToId("overview"),
            },
            {
              key: "workbench",
              label: "Component workbench",
              icon: LayoutPanelTop,
            },
          ]}
          right={
            <>
              <SearchCommand
                groups={commandGroups}
                placeholder="Jump to a family…"
              />
              <AccentPicker
                accent={accent}
                onAccentChange={updateAccent}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              </Button>
            </>
          }
        />
      }
      mobileNav={
        <MobileNav
          sections={navSections}
          commandGroups={commandGroups}
          activeKey={activeKey}
          menuHeader={<Brand />}
          searchPlaceholder="Jump to a family…"
          actions={
            <>
              <AccentPicker
                accent={accent}
                onAccentChange={updateAccent}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              </Button>
            </>
          }
        />
      }
    >
      <PrimitivesGallery
        accent={accent}
        activeKey={activeKey}
        focusRequest={focusRequest}
        onActiveChange={setActiveKey}
        onAccentChange={updateAccent}
      />
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        groups={commandGroups}
        placeholder="Jump to a component family…"
      />
    </AppShell>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tracking-tight text-foreground">
          mangue-ui
        </div>
        <div className="code-font text-2xs uppercase tracking-[0.12em] text-muted-foreground">
          Workbench
        </div>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/15">
      <span className="font-display text-sm font-bold">m</span>
    </div>
  );
}
