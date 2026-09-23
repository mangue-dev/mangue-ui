"use client";

import * as React from "react";
import {
  Bell,
  Bot,
  CreditCard,
  Github,
  Globe,
  Lock,
  Palette,
  Plug,
  Trash2,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Input,
  SegmentedControl,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SettingsEmpty,
  SettingsGroup,
  SettingsLayout,
  SettingsListRow,
  SettingsRow,
  Switch,
  Textarea,
  type SettingsSectionItem,
  type SettingsTabItem,
} from "mangue-ui";

/**
 * Every CARD of the screen, named. What people type is the name of the card —
 * "theme", "danger zone", "two-factor" — and none of those is a tab. This is
 * what the rail's filter searches: picking a row opens the right tab, scrolls to
 * the card and rings it. The ids match the `sectionId` of the groups below.
 */
const SECTIONS: SettingsSectionItem[] = [
  { id: "profile", title: "Profile", tab: "profile", icon: User },
  {
    id: "appearance",
    title: "Appearance",
    tab: "preferences",
    icon: Palette,
    keywords: ["theme", "dark", "light", "language"],
  },
  {
    id: "automation",
    title: "Automation",
    tab: "preferences",
    icon: Bot,
    keywords: ["auto-assign", "routing", "rule"],
  },
  { id: "inbox", title: "Inbox", tab: "notifications", icon: Bell },
  {
    id: "connected-accounts",
    title: "Connected accounts",
    tab: "connections",
    icon: Github,
    keywords: ["github", "gitlab", "oauth"],
  },
  { id: "api-keys", title: "API keys", tab: "connections", icon: Plug },
  { id: "plan", title: "Plan", tab: "billing", icon: CreditCard },
  {
    id: "two-factor",
    title: "Two-factor authentication",
    tab: "danger",
    icon: Lock,
    keywords: ["2fa", "mfa", "security"],
  },
  {
    id: "delete-account",
    title: "Delete my account",
    tab: "danger",
    icon: Trash2,
    keywords: ["danger zone", "remove", "close"],
  },
];

/**
 * A real settings screen, assembled only from `SettingsLayout` / `SettingsGroup`
 * / `SettingsRow` / `SettingsListRow`.
 *
 * It is the reference for what "settings built with mangue-ui" looks like: one
 * card per group, one key/value row per option, a hairline between two, and the
 * exceptions (a free-text rule, a danger zone) shown as exceptions rather than
 * left to each author to invent.
 *
 * Inside a `<SecondarySidebarProvider>` — which is what the shell around this
 * page sets up — the tab rail leaves the content column for the SECONDARY
 * SIDEBAR, full height, left of the header, with a filter over the cards. Drop
 * the same screen into an app with no second navigation level and it falls back
 * to the centred column with a rail beside it.
 */
export function SettingsGallery() {
  // Controlled on purpose: this is the seam where an app plugs `?tab=` in.
  const [tab, setTab] = React.useState("profile");

  const [theme, setTheme] = React.useState("system");
  const [autoAssign, setAutoAssign] = React.useState(true);
  const [digest, setDigest] = React.useState(false);
  const [mentions, setMentions] = React.useState(true);
  const [beta, setBeta] = React.useState(false);

  const tabs: SettingsTabItem[] = [
    {
      value: "profile",
      label: "Profile",
      icon: User,
      content: (
        <SettingsGroup
          sectionId="profile"
          icon={User}
          title="Profile"
          description="Your name and photo, visible to other members."
          footer={<Button>Save</Button>}
        >
          <SettingsRow
            label="Avatar"
            hint="Generated from your account. Reroll it as often as you like."
            control={
              <>
                <Avatar className="size-9">
                  <AvatarFallback>MU</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  New avatar
                </Button>
              </>
            }
          />
          <SettingsRow
            htmlFor="showcase-name"
            label="Username"
            control={<Input id="showcase-name" defaultValue="mangué" className="w-64" />}
          />
          <SettingsRow
            label="Email"
            hint="Your address can't be changed."
            control={
              <span className="text-sm text-muted-foreground">hello@mangue.dev</span>
            }
          />
        </SettingsGroup>
      ),
    },
    {
      value: "preferences",
      label: "Preferences",
      icon: Palette,
      content: (
        <>
          <SettingsGroup
            sectionId="appearance"
            icon={Palette}
            title="Appearance"
            description="The language you read the app in, and how it looks."
          >
            <SettingsRow
              htmlFor="showcase-language"
              label="Language"
              control={
                <Select defaultValue="en">
                  <SelectTrigger id="showcase-language" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
            <SettingsRow
              label="Theme"
              control={
                <SegmentedControl
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" },
                  ]}
                  value={theme}
                  onChange={setTheme}
                  ariaLabel="Theme"
                  className="w-60"
                />
              }
            />
          </SettingsGroup>

          <SettingsGroup
            sectionId="automation"
            icon={Bot}
            title="Automation"
            description="What happens on its own, without you asking."
            help="Everything here is reversible, and nothing runs on an item you already touched by hand."
          >
            <SettingsRow
              htmlFor="showcase-auto-assign"
              label="Assign items I create to me"
              control={
                <Switch
                  id="showcase-auto-assign"
                  checked={autoAssign}
                  onCheckedChange={setAutoAssign}
                />
              }
            />
            <SettingsRow
              htmlFor="showcase-beta"
              label="Try features early"
              hint="Preview builds land here before everyone else."
              control={
                <Switch id="showcase-beta" checked={beta} onCheckedChange={setBeta} />
              }
            />
            {/* The assumed exception to key/value: 500 characters do not fit at
                the end of a line. */}
            <SettingsRow
              orientation="vertical"
              htmlFor="showcase-rule"
              label="Routing rule"
              hint="Free text. The model matches new items against it."
              control={
                <Textarea
                  id="showcase-rule"
                  rows={3}
                  placeholder="Anything about billing, invoices or refunds…"
                />
              }
            />
          </SettingsGroup>
        </>
      ),
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      indicator: "Two categories are off",
      content: (
        <SettingsGroup
          sectionId="inbox"
          icon={Bell}
          title="Inbox"
          description="What lands in your inbox. Turning one off never removes what you already received."
        >
          <SettingsRow
            htmlFor="showcase-mentions"
            label="Mentions"
            hint="Someone @mentions you in a comment."
            control={
              <Switch
                id="showcase-mentions"
                checked={mentions}
                onCheckedChange={setMentions}
              />
            }
          />
          <SettingsRow
            htmlFor="showcase-digest"
            label="Weekly digest"
            hint="One email every Monday with what moved."
            control={
              <Switch
                id="showcase-digest"
                checked={digest}
                onCheckedChange={setDigest}
              />
            }
          />
        </SettingsGroup>
      ),
    },
    {
      value: "connections",
      label: "Connections",
      icon: Plug,
      content: (
        <>
          <SettingsGroup
            sectionId="connected-accounts"
            icon={Github}
            title="Connected accounts"
            description="Reusable across all your projects."
          >
            <SettingsListRow
              avatar={
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Github className="size-4" />
                </span>
              }
              title="GitHub · mangue-dev"
              subtitle="Connected 12 Mar 2026 · 3 projects"
              action={
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              }
            />
            <SettingsListRow
              icon={Globe}
              title="GitLab"
              subtitle="Not connected yet."
              action={
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              }
            />
          </SettingsGroup>

          <SettingsGroup
            sectionId="api-keys"
            icon={Plug}
            title="API keys"
            description="Server-to-server access, one key per integration."
          >
            <SettingsEmpty>No key yet.</SettingsEmpty>
          </SettingsGroup>
        </>
      ),
    },
    {
      value: "billing",
      label: "Billing",
      icon: CreditCard,
      content: (
        <SettingsGroup
          sectionId="plan"
          icon={CreditCard}
          title="Plan"
          description="What you're on, and what it includes."
          action={<Badge variant="secondary">Pro</Badge>}
        >
          <SettingsRow
            label="Seats"
            hint="Billed monthly, prorated when you add one."
            control={<span className="text-sm tabular-nums">4</span>}
          />
          <SettingsRow
            label="Payment method"
            control={
              <Button variant="outline" size="sm">
                Update
              </Button>
            }
          />
        </SettingsGroup>
      ),
    },
    {
      value: "danger",
      label: "Account",
      icon: Lock,
      content: (
        <>
          <SettingsGroup
            sectionId="two-factor"
            icon={Lock}
            title="Two-factor authentication"
            description="A six-digit code on top of your password, every time you sign in."
            variant="block"
          >
            {/* `variant="block"`: an enrolment wizard is a stack, not a row. */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">A password alone opens this account</p>
                <Badge variant="secondary" className="bg-brand/10 text-brand">
                  Recommended
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                It carries write access to everything you connected. A second
                factor closes that door.
              </p>
              <Button size="sm">Turn on</Button>
            </div>
          </SettingsGroup>

          <SettingsGroup
            sectionId="delete-account"
            icon={Trash2}
            tone="destructive"
            title="Delete my account"
            description="Deletion is immediate and permanent. Nothing is kept."
          >
            <SettingsRow
              label="What will be deleted"
              control={
                <Button variant="destructive" size="sm">
                  Delete my account
                </Button>
              }
            >
              <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                <li>Your account, preferences and conversations.</li>
                <li>The 3 projects you own, and everything in them.</li>
              </ul>
            </SettingsRow>
          </SettingsGroup>
        </>
      ),
    },
  ];

  return (
    <SettingsLayout
      title="Settings"
      description="Everything about your account, in one column."
      tabs={tabs}
      sections={SECTIONS}
      value={tab}
      onValueChange={setTab}
    />
  );
}
