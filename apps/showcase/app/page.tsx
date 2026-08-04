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
  SecondarySidebarProvider,
  useSidebarState,
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
import { InboxGallery } from "./_components/inbox-gallery";
import { PrimitivesGallery } from "./_components/primitives-gallery";
import { SettingsGallery } from "./_components/settings-gallery";

/** Nav keys that count as "inside a project" — drives the sidebar mode swap. */
const PROJECT_KEYS = new Set(["mobile", "website", "design"]);

/**
 * The two keys whose screen mounts a SECONDARY SIDEBAR. Nothing here wires that
 * up: the screen mounts a `<SecondarySidebar>`, the provider counts it, the
 * primary sidebar rails itself and the chrome opens the gutter.
 */
const SECONDARY_KEYS = new Set(["inbox", "settings"]);

export default function Home() {
  // Everything about the double sidebar hangs off this provider: it is the
  // thread between a page's column and the place the chrome keeps for it.
  return (
    <SecondarySidebarProvider>
      <Showcase />
    </SecondarySidebarProvider>
  );
}

function Showcase() {
  const { open, setOpen } = useCommandMenu();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeKey, setActiveKey] = React.useState("primitives");

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

  // A gallery anchor: come back to the stacked galleries, then scroll to it.
  // The shell owns every scroll (its <main> is the scroller), so we move that
  // one by hand — `scrollIntoView` would walk up past it and scroll the header
  // out of the window too.
  const goToGallery = React.useCallback((key: string) => {
    setActiveKey(key);
    requestAnimationFrame(() => {
      const el = document.getElementById(key);
      const main = el?.closest("main");
      if (!el || !main) return;
      const top =
        main.scrollTop +
        el.getBoundingClientRect().top -
        main.getBoundingClientRect().top;
      main.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  const navSections = React.useMemo<NavSection[]>(
    () => [
      {
        label: "Workspace",
        items: [
          {
            key: "inbox",
            label: "Inbox",
            icon: Inbox,
            onClick: () => setActiveKey("inbox"),
            badge: <CountBadge value={8} />,
          },
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
          {
            key: "primitives",
            label: "Primitives",
            icon: Palette,
            onClick: () => goToGallery("primitives"),
          },
          {
            key: "ai",
            label: "AI",
            icon: Sparkles,
            onClick: () => goToGallery("ai"),
            shortcut: "A",
            badge: <Badge variant="secondary">new</Badge>,
          },
        ],
      },
      {
        label: "General",
        items: [
          { key: "members", label: "Members", icon: Users, href: "#members" },
          {
            key: "settings",
            label: "Settings",
            icon: Settings,
            onClick: () => setActiveKey("settings"),
          },
        ],
      },
    ],
    [goToGallery],
  );

  const commandGroups = [
    {
      heading: "Navigation",
      items: navSections.flatMap((section) =>
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

  const activeItem = navSections.flatMap((s) => s.items).find((i) => i.key === activeKey);
  const activeLabel = activeItem?.label ?? "Inbox";
  const secondaryScreen = SECONDARY_KEYS.has(activeKey);

  return (
    <AppShell
      sidebar={
        <Sidebar
          sections={navSections}
          activeKey={activeKey}
          linkComponent={Link}
          header={<Brand />}
          // What the rail shows in the brand's place; the two cross-fade as the
          // bar unfolds.
          collapsedBrand={<BrandMark />}
          // No `overlay` prop: the bar follows the provider above it. Open Inbox
          // or Settings and it rails itself, unfolding over the second column on
          // hover without shifting anything.
          //
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
              {/* No `collapsed` prop: footer rows read the bar's state from
                  context, so they follow the rail on their own. */}
              <SidebarFooterRow icon={Trash2} label="Trash" onClick={() => toast("Trash")} />
              <SidebarFooterRow
                icon={Megaphone}
                label="Share feedback"
                trailingIcon={ArrowUpRight}
                onClick={() => toast("Feedback")}
              />
              <UserMenu />
            </div>
          }
        />
      }
      header={
        <Header
          linkComponent={Link}
          breadcrumb={[
            { key: "workspace", label: "Workspace", onClick: () => setActiveKey("primitives") },
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
          sections={navSections}
          commandGroups={commandGroups}
          activeKey={activeKey}
          linkComponent={Link}
          menuHeader={<Brand />}
          menuFooter={<UserMenu />}
          searchPlaceholder="Search or jump to..."
        />
      }
    >
      {/* The two screens with a second navigation level take the whole shell:
          their column is teleported next to the primary sidebar, and what is
          left here is the detail. */}
      {activeKey === "inbox" ? (
        <InboxGallery />
      ) : activeKey === "settings" ? (
        <SettingsGallery />
      ) : (
        <>
          <div id="primitives">
            <PrimitivesGallery />
          </div>
          <div id="ai">
            <AiGallery />
          </div>
        </>
      )}

      <CommandMenu open={open} onOpenChange={setOpen} groups={commandGroups} />

      {/* Floating assistant panel (Numo) — stays out of the way of a screen that
          already has two navigation columns. */}
      {chatOpen && !secondaryScreen ? (
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

function UserMenu() {
  // Reads the bar it sits in: folded or not, and — in rail mode — whether one of
  // its own menus is open. A dropdown opens in a portal, OUTSIDE the bar, so
  // moving into it would count as leaving and fold the rail under the menu.
  const { collapsed, setMenuOpen } = useSidebarState();
  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
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
