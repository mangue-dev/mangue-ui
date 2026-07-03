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
} from "lucide-react";

import {
  AppShell,
  Sidebar,
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

import { PrimitivesGallery } from "./_components/primitives-gallery";

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
    label: "General",
    items: [
      { key: "members", label: "Members", icon: Users, href: "#members" },
      { key: "settings", label: "Settings", icon: Settings, href: "#settings" },
    ],
  },
];

const MOBILE_ITEMS: NavItem[] = [
  { key: "inbox", label: "Inbox", icon: Inbox, href: "#inbox" },
  { key: "my-issues", label: "Issues", icon: CircleDot, href: "#my-issues" },
  { key: "views", label: "Views", icon: LayoutGrid, href: "#views" },
  { key: "settings", label: "Settings", icon: Settings, href: "#settings" },
];

export default function Home() {
  const { open, setOpen } = useCommandMenu();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeKey, setActiveKey] = React.useState("inbox");
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

  const activeLabel =
    NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.key === activeKey)?.label ?? "Inbox";

  return (
    <AppShell
      sidebar={
        <Sidebar
          sections={NAV_SECTIONS}
          activeKey={activeKey}
          linkComponent={Link}
          header={<Brand />}
          footer={<UserMenu />}
        />
      }
      header={
        <Header
          left={
            <nav className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Workspace</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground">{activeLabel}</span>
            </nav>
          }
          center={<SearchCommand groups={commandGroups} placeholder="Search or jump to..." />}
          right={
            <>
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
      mobileNav={<MobileNav items={MOBILE_ITEMS} activeKey={activeKey} linkComponent={Link} />}
    >
      <PrimitivesGallery />

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

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-sidebar-accent">
          <Avatar className="h-7 w-7">
            <AvatarFallback>CG</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Clément</div>
            <div className="truncate text-xs text-muted-foreground">clement@mangue.dev</div>
          </div>
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
