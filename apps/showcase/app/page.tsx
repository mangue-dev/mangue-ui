"use client";

import * as React from "react";
import Link from "next/link";
import {
  Inbox,
  CircleDot,
  LayoutGrid,
  GitBranch,
  Palette,
  Box,
  Globe,
  Settings,
  Users,
  Bell,
  Moon,
  Sun,
  Sparkles,
  Plus,
  LogOut,
  UserRound,
  X,
  Trash2,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";

import {
  AppShell,
  Sidebar,
  SidebarFooterRow,
  Header,
  SearchCommand,
  MobileNav,
  CommandMenu,
  useCommandMenu,
  NumoChat,
  useTheme,
  Button,
  Avatar,
  AvatarFallback,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  toast,
  type NavSection,
  type NavItem,
  type ChatMessage,
} from "mangue-ui";

import { AiGallery } from "./_components/ai-gallery";
import { PrimitivesGallery } from "./_components/primitives-gallery";
import { SettingsGallery } from "./_components/settings-gallery";

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { key: "inbox", label: "Inbox", icon: Inbox, href: "#inbox", badge: <CountBadge value={8} /> },
      { key: "my-issues", label: "My Issues", icon: CircleDot, href: "#my-issues" },
      { key: "views", label: "Views", icon: LayoutGrid, href: "#views" },
      { key: "cycles", label: "Cycles", icon: GitBranch, href: "#cycles" },
    ],
  },
  {
    label: "Projects",
    items: [
      { key: "mobile", label: "Mobile App", icon: Box, href: "#mobile" },
      { key: "website", label: "Website", icon: Globe, href: "#website" },
      { key: "design", label: "Design System", icon: Palette, href: "#design", badge: <Dot /> },
    ],
  },
  {
    label: "Galleries",
    items: [
      { key: "primitives", label: "Primitives", icon: Palette, href: "#primitives" },
      {
        key: "ai",
        label: "AI",
        icon: Sparkles,
        href: "#ai",
        shortcut: "A",
        badge: <Badge variant="secondary">new</Badge>,
      },
    ],
  },
  {
    label: "General",
    items: [
      { key: "members", label: "Members", icon: Users, href: "#members" },
      { key: "settings", label: "Settings", icon: Settings, href: "#settings" },
    ],
  },
];

/** Nav keys that count as "inside a project" — drives the sidebar mode swap. */
const PROJECT_KEYS = new Set(["mobile", "website", "design"]);

export default function Home() {
  const { open, setOpen } = useCommandMenu();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeKey, setActiveKey] = React.useState("inbox");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Holding ⌘ arms the chord: every nav row with a `shortcut` shows its key.
  const [chordArmed, setChordArmed] = React.useState(false);
  React.useEffect(() => {
    const arm = (e: KeyboardEvent) => setChordArmed(e.metaKey);
    window.addEventListener("keydown", arm);
    window.addEventListener("keyup", arm);
    window.addEventListener("blur", () => setChordArmed(false));
    return () => {
      window.removeEventListener("keydown", arm);
      window.removeEventListener("keyup", arm);
    };
  }, []);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "seed",
      role: "assistant",
      content: "Hi! I'm Numo. Ask me anything about this component library.",
    },
  ]);
  const [streaming, setStreaming] = React.useState(false);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { id: `u-${prev.length}`, role: "user", content: text }]);
    setStreaming(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${prev.length}`,
          role: "assistant",
          content: "This panel is fully presentational — wire onSend to your model and it comes alive.",
        },
      ]);
      setStreaming(false);
    }, 900);
  };

  const commandGroups = [
    {
      heading: "Navigation",
      items: NAV_SECTIONS.flatMap((section) =>
        section.items.map((item) => ({
          key: item.key,
          label: item.label,
          icon: item.icon,
          onSelect: () => setActiveKey(item.key),
        })),
      ),
    },
    {
      heading: "Actions",
      items: [
        { key: "new-issue", label: "New issue", icon: Plus, shortcut: "C", onSelect: () => toast("New issue") },
        { key: "invite", label: "Invite member", icon: Users, onSelect: () => toast("Invite sent") },
        {
          key: "theme",
          label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`,
          icon: resolvedTheme === "dark" ? Sun : Moon,
          onSelect: toggleTheme,
        },
      ],
    },
  ];

  const activeItem = NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.key === activeKey);
  const activeLabel = activeItem?.label ?? "Inbox";

  return (
    <AppShell
      sidebar={
        <Sidebar
          sections={NAV_SECTIONS}
          activeKey={activeKey}
          linkComponent={Link}
          header={<Brand />}
          // Collapsed, the mark takes the reopen button's place and cross-fades
          // to it on hover — the whole square is the expand button.
          collapsedBrand={<BrandMark />}
          // Changing this replays the nav's animated swap. Here it flips when
          // you enter the "Projects" area, so the demo shows the effect.
          modeKey={PROJECT_KEYS.has(activeKey) ? "project" : "root"}
          modeDirection={PROJECT_KEYS.has(activeKey) ? "forward" : "backward"}
          // Hold ⌘ to arm the chord: rows with a `shortcut` surface their key.
          chordArmed={chordArmed}
          chordPrefix="⌘"
          onItemHover={(item) => {
            // The warm-up hook: where an app prefetches the page's caches.
            if (process.env.NODE_ENV === "development") {
              console.debug("prefetch", item.key);
            }
          }}
          footer={
            <div className="flex flex-col gap-0.5">
              <SidebarFooterRow
                icon={Trash2}
                label="Trash"
                collapsed={sidebarCollapsed}
                onClick={() => toast("Trash")}
              />
              <SidebarFooterRow
                icon={Megaphone}
                label="Share feedback"
                collapsed={sidebarCollapsed}
                trailingIcon={ArrowUpRight}
                onClick={() => toast("Feedback")}
              />
              <UserMenu collapsed={sidebarCollapsed} />
            </div>
          }
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      }
      header={
        <Header
          linkComponent={Link}
          breadcrumb={[
            { key: "workspace", label: "Workspace", onClick: () => setActiveKey("inbox") },
            { key: activeKey, label: activeLabel, icon: activeItem?.icon },
          ]}
          right={
            <>
              <SearchCommand groups={commandGroups} placeholder="Search or jump to..." />
              <Button variant="ghost" size="icon-sm" aria-label="Toggle theme" onClick={toggleTheme}>
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Notifications">
                <Bell />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setChatOpen((v) => !v)}>
                <Sparkles /> Numo
              </Button>
            </>
          }
        />
      }
      mobileNav={
        <MobileNav
          sections={NAV_SECTIONS}
          commandGroups={commandGroups}
          activeKey={activeKey}
          linkComponent={Link}
          menuHeader={<Brand />}
          menuFooter={<UserMenu />}
          searchPlaceholder="Search or jump to..."
        />
      }
    >
      <div id="primitives">
        <PrimitivesGallery />
      </div>
      <div id="ai">
        <AiGallery />
      </div>
      <div id="settings">
        <SettingsGallery />
      </div>

      <CommandMenu open={open} onOpenChange={setOpen} groups={commandGroups} />

      {/* Floating assistant panel (Numo) */}
      {chatOpen ? (
        <div className="fixed right-4 bottom-4 z-40 hidden h-[70vh] max-h-[640px] w-[380px] desktop:block">
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute -top-2 -right-2 z-10 rounded-full bg-card shadow"
              aria-label="Close assistant"
              onClick={() => setChatOpen(false)}
            >
              <X />
            </Button>
            <NumoChat
              messages={messages}
              onSend={handleSend}
              isStreaming={streaming}
              suggestions={[
                { key: "s1", label: "What primitives are included?", onSelect: () => handleSend("What primitives are included?") },
                { key: "s2", label: "How do I rebrand?", onSelect: () => handleSend("How do I rebrand?") },
              ]}
            />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-sm font-bold">m</span>
      </div>
      <span className="text-[15px] font-semibold tracking-tight">mangue-ui</span>
    </div>
  );
}

/** The bare mark, for the collapsed sidebar's cross-fading square. */
function BrandMark() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <span className="text-sm font-bold">m</span>
    </div>
  );
}

function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            "flex items-center rounded-lg text-left transition-colors hover:bg-sidebar-accent " +
            (collapsed ? "w-9 justify-center p-1" : "w-full gap-2 p-1.5")
          }
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback>CG</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">Clément</div>
              <div className="truncate text-xs text-muted-foreground">clement@mangue.dev</div>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserRound /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CountBadge({ value }: { value: number }) {
  return (
    <Badge variant="secondary" className="min-w-7 justify-center px-1.5">
      {value}
    </Badge>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-primary" />;
}
