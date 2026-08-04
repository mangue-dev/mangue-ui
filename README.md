# mangue-ui

A reusable component library extracted from **AutoKap**'s design system, so you
can spin up a new product (a Linear-style ticketing app, a dashboard, anything)
that looks and feels like AutoKap in minutes.

It ships four layers:

1. **Design tokens** — the full OKLch color system (light + dark), radius, fonts,
   spacing and breakpoints, as Tailwind v4 `@theme` variables.
2. **Primitives** — the radix-nova / shadcn components (button, dialog,
   dropdown, select, command palette, sheet, tooltip, `Field`, …), copied
   verbatim from AutoKap and **fully decoupled** from any AutoKap business logic.
3. **App shell** — decoupled, props-driven `Sidebar`, `Header`, `CommandMenu`,
   `MobileNav`, `AppShell`, plus a presentational `NumoChat` panel. Two levels of
   navigation are built in: the primary sidebar, and a **secondary sidebar** a
   page mounts for itself (see below).
4. **Settings screens** — `SettingsLayout`, `SettingsGroup`, `SettingsRow`,
   `SettingsListRow`: the grammar that turns the primitives into a settings page
   that reads the same on every tab (see below).

There is **zero AutoKap logic** in here (no Supabase, no project context, no
capture engine). Everything is data/props in, UI out.

---

## Repository layout

```
mangue-ui/
├── packages/
│   └── mangue-ui/            ← the library (this is the future npm package)
│       ├── src/
│       │   ├── styles/tokens.css     ← design tokens (@theme + :root/.dark)
│       │   ├── lib/                  ← cn(), motion presets, media-query hooks
│       │   ├── components/ui/         ← 46 primitives (verbatim from AutoKap)
│       │   ├── components/shell/      ← Sidebar, Header, CommandMenu, AppShell…
│       │   ├── components/theme-provider.tsx
│       │   ├── chat/numo-chat.tsx     ← AI chat panel (presentational)
│       │   └── index.ts               ← public barrel export
│       └── package.json               ← name: "mangue-ui"
└── apps/
    └── showcase/            ← Next.js app: a live gallery of everything
```

## Run the showcase

```bash
npm install          # from the repo root (installs all workspaces)
npm run dev          # starts apps/showcase on http://localhost:3000
```

The showcase renders an assembled dashboard (sidebar + header + command palette +
Numo chat) and a gallery of every primitive with live, interactive examples.

---

## Using mangue-ui in another project

### Option A — Copy-paste (shadcn style, you own the code)

1. Copy `packages/mangue-ui/src/components/ui/`, `src/lib/`,
   `src/components/shell/`, `src/components/theme-provider.tsx`, and
   `src/chat/` into your app (e.g. under `src/`).
2. Set a `@/` path alias so the primitives' relative imports resolve (they use
   relative paths already, so this mostly just works).
3. In your global CSS, after `@import "tailwindcss";`, add
   `@import ".../styles/tokens.css";`.

### Option B — Workspace / package import (what the showcase does)

Import straight from the package:

```tsx
import { Button, Sidebar, Header, CommandMenu, NumoChat } from "mangue-ui";
```

And in your CSS entry (after Tailwind):

```css
@import "tailwindcss";
@import "mangue-ui/tokens.css";
@source "../node_modules/mangue-ui/src";   /* let Tailwind scan the lib */
```

Fonts (`--font-inter`, `--font-space-grotesk`, `--font-instrument-serif`) are
provided by the host app via `next/font` — see `apps/showcase/app/layout.tsx`.

---

## Rebranding

The whole library recolors from **one variable**. In
`packages/mangue-ui/src/styles/tokens.css`, change the two `--primary` lines
(one in `:root`, one in `.dark`):

```css
:root { --primary: oklch(0.62 0.22 265); }   /* AutoKap blue */
.dark { --primary: oklch(0.64 0.22 265); }
```

Buttons, focus rings, links, the sidebar active state, charts and `--brand` all
derive from it. Optionally tune `--brand` / `--accent-glow` to match.

---

## Double sidebar

Some screens are a *list and a detail*: pull requests, an inbox, agent sessions,
settings. Their list is a **second level of navigation**, not a piece of the
content — so it belongs beside the primary sidebar, full height, left of the
header, and the breadcrumb starts after it just as it starts after the primary
one.

That column is written **inside the page** (next to the selection state that
drives the detail) and displayed **in the chrome**. A portal is what lets it
change place in the DOM without leaving its component: selection, filters and
queries stay where you read them.

```tsx
// 1. One provider above the shell.
<SecondarySidebarProvider reserve={routeHasSecondaryNav(pathname)}>
  <AppShell sidebar={<Sidebar sections={sections} />} header={<Header … />}>
    {children}
  </AppShell>
</SecondarySidebarProvider>
```

```tsx
// 2. Any page mounts its column. Nothing else to wire.
export function PullRequestsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PullRequest | null>(null);

  return (
    <div className="flex h-full min-h-0">
      <SecondarySidebar
        title="Pull requests"
        hiddenOnMobile={!!selected}
        filter={{
          value: query,
          onChange: setQuery,
          placeholder: `Filter ${rows.length} pull requests…`,
        }}
      >
        {rows.filter((r) => matchesFilter(query, [r.title, r.branch])).map(…)}
      </SecondarySidebar>
      <Detail pr={selected} />
    </div>
  );
}
```

**What mounting it does, for free**

- The **primary sidebar rails itself**: it keeps only its 56px of icons in the
  flow and unfolds *over* the second column on hover (or when keyboard focus
  enters), without shifting anything. The layout of a two-sidebar page is the
  same whether the primary is open or not.
- The chrome **opens a 320px gutter** on the same curve as the sidebar's width
  (`transitions.shell`), so the header, breadcrumb and content glide as one block
  instead of jumping.
- The title row is the height of the header and carries the same bottom border:
  **one horizontal line crosses the app**, edge to edge.
- Below `desktop` (1200px) none of it applies: the column stays where it is
  written — a page column from `md` up, the whole page below, with
  `hiddenOnMobile` yielding it to the detail.

**The rail is the only fold.** There is no button to fold the sidebar by hand and
no ⌘B: it exists where a second column needs the room, and everywhere else the
bar is simply open. A manual fold on top of it meant two folded bars for two
different reasons, one of which you had to know a shortcut to undo — so `Sidebar`
takes no `collapsible` / `collapsed` / `defaultCollapsed` / `onCollapsedChange`
at all. `collapsedBrand` stays: it is what the rail shows in the brand's place,
the two cross-fading as the bar unfolds.

**`reserve`** is the only thing your router has to answer: "does this route mount
one?", before hydration. Without it the server HTML ships with the primary
expanded and the content full width, and re-lays everything out at hydration. It
does not have to be exact — a forgotten route costs one re-layout on first paint,
not a bug.

**The title row commands the column, it does not name it.** The name is already
in the breadcrumb, 340px to the right; what belongs here is the filter, what
narrows the list, and what can be created in it. `filter` is passed as *data*
rather than as a node so every such screen offers the same gesture, in the same
place, with the same look — and the item count goes in the placeholder, not in a
counter beside it. `/` focuses it from anywhere on the page.

**Footer pieces read the bar's state.** `SidebarFooterRow` folds on its own; a
custom row calls `useSidebarState()` for `collapsed`, and any dropdown in the
footer must report itself through `setMenuOpen` — a menu opens in a portal,
*outside* the bar, so moving into it would otherwise count as leaving and fold
the rail under the menu it just opened.

```tsx
const { collapsed, setMenuOpen } = useSidebarState();
<DropdownMenu onOpenChange={setMenuOpen}>…</DropdownMenu>
```

**Route skeletons must mount a real `<SecondarySidebar>`** (with no `title`),
not a column that looks like one: mounting it is what rails the primary. Without
it, navigating to such a screen unfolds the primary and closes the gutter for the
length of the load, only to reopen everything on arrival — a 376px round trip
across the whole right half of the screen.

---

## Settings screens

Primitives alone don't make a settings screen. Given a `Switch` and a `Select`,
two authors lay them out differently — and a settings page whose tabs each look
different is unreadable no matter how good the controls are. That layer is now
part of the library, so **settings built with mangue-ui always come out looking
the same**.

Three levels, each of them marked:

```
Screen title      the secondary sidebar's title row   "Settings"
└─ Group (card)   text-sm font-medium + icon          "Appearance"
   └─ Row         label left · control right, hairline between two
```

**Two shapes, one screen.** Inside a `<SecondarySidebarProvider>`, the tab rail
leaves the content column for the [secondary sidebar](#double-sidebar) — full
height, left of the header, with a filter over the cards, exactly like every
other list-and-detail screen; the title becomes that pane's title row, so it no
longer doubles the breadcrumb above the cards. With no such provider it falls
back to the centred column with a sticky rail beside it. `variant` forces either
(`"sidebar"` / `"inline"`); the default `"auto"` reads the chrome.

```tsx
import {
  SettingsLayout, SettingsGroup, SettingsRow, SettingsListRow, SettingsEmpty,
  type SettingsTabItem,
} from "mangue-ui";

const tabs: SettingsTabItem[] = [
  {
    value: "appearance",
    label: "Appearance",
    icon: Palette,
    content: (
      <SettingsGroup
        icon={Palette}
        title="Appearance"
        description="The language you read the app in, and how it looks."
      >
        <SettingsRow
          htmlFor="language"
          label="Language"
          control={<Select /* … */ />}
        />
        <SettingsRow
          htmlFor="dark"
          label="Dark mode"
          hint="Follows your system unless you pick one."
          control={<Switch id="dark" /* … */ />}
        />
      </SettingsGroup>
    ),
  },
];

<SettingsLayout title="Settings" tabs={tabs} value={tab} onValueChange={setTab} />;
```

**The rules the layer encodes**

- **Key/value by default, not always.** `SettingsRow` is `orientation="responsive"`:
  label left, control right, stacked below `@md` — a *container* query, so a row
  in a narrow panel stacks on a wide screen too. A 500-character textarea, an
  enrolment QR code or a dropzone take `orientation="vertical"`. Drop the control
  below the label only when it plainly doesn't fit at the end of the line.
- **Give every group a `description`.** Without one the title floats alone beside
  its icon chip and the reader must open the group to learn what it holds. The
  header re-centers itself when there is none, but that is a fallback, not a
  style.
- **Long prose goes behind `help`** (an ⓘ popover), never between two switches.
- **`variant="block"`** for a group whose body is a wizard rather than rows.
  **`tone="destructive"`** for a danger zone — the card carries the tone, so
  don't nest a red box inside it.
- **The active tab pill slides** (a shared `layoutId`), and holds still under
  `prefers-reduced-motion`.

**Deep-linkable tabs.** The library owns no router. Read your `?tab=` in the app
and drive the layout with `value` / `onValueChange`; that is also where analytics
belongs. Omit `value` and the layout keeps its own state from `defaultValue`.

```tsx
const params = useSearchParams();          // wrap in <Suspense> if prerendered
<SettingsLayout
  tabs={tabs}
  value={params.get("tab") ?? "profile"}
  onValueChange={(next) => { track(next); router.replace(`?tab=${next}`); }}
/>
```

`SettingsLayoutSkeleton` renders the same shape (rail + cards) for your route's
loading state, so the page doesn't jump when it resolves — and in the `sidebar`
shape it mounts a real `<SecondarySidebar>`, which is what holds the primary at
the rail while the screen loads.

**Reaching one card by name.** A tab answers "where is it?", but what people type
is the name of the *card* — "cadence", "danger zone", "act on your behalf" — and
none of those is a tab. Give the layout a `sections` catalogue and the rail's
filter searches cards instead of tabs: picking one opens the right tab, scrolls
to the card and rings it for the length of a glance. The ids match the
`sectionId` of your groups, and `focusSection` lets your command palette do the
same from anywhere (wire your `?section=` to it, and drop the param in
`onSectionFocused` — it is consumed on read).

```tsx
const sections: SettingsSectionItem[] = [
  { id: "appearance", title: "Appearance", tab: "preferences", icon: Palette,
    keywords: ["theme", "dark", "language"] },
];

<SettingsGroup sectionId="appearance" icon={Palette} title="Appearance" …>

<SettingsLayout
  tabs={tabs}
  sections={sections}
  focusSection={params.get("section")}
  onSectionFocused={() => router.replace(pathname, { scroll: false })}
/>
```

Without a catalogue the filter still works — it falls back to the tabs
themselves.

The showcase renders a full six-tab settings screen behind the sidebar's
"Settings" entry (`apps/showcase/app/_components/settings-gallery.tsx`) — the
reference for what this is supposed to look like.

---

## Responsive model

The shell uses a single canonical breakpoint, `desktop` = **1200px**
(`--breakpoint-desktop`). This gives you `desktop:` (≥1200px) and `max-desktop:`
(<1200px) Tailwind variants.

- `AppShell` shows the `Sidebar` only ≥1200px and the `MobileNav` below it.
- A `SecondarySidebar` is only hoisted into the chrome ≥1200px; below it, it
  renders in place — a 320px page column from `md` up, the whole page below.
- `Dialog`, `AlertDialog` and `DropdownMenu` automatically become bottom drawers
  on small screens (via the `useMediaQuery` hook baked into those primitives).

---

## Publishing

The library is on npm as [`mangue-ui`](https://www.npmjs.com/package/mangue-ui).
It ships **TypeScript/TSX source, with no build step**: `files` is `["src"]` and
`exports` points straight at it. The host app's bundler compiles it (Next needs
`transpilePackages: ["mangue-ui"]`) and Tailwind scans it, which is what keeps
the tokens overridable. Nothing to build, nothing to keep in sync with a `dist/`.

```bash
npm login                       # once — the stored token expires
npm run typecheck               # what prepublishOnly will run anyway
npm publish -w mangue-ui        # from the REPO ROOT
```

The root `package.json` is `private`, so a `npm publish` fired there by mistake
fails instead of publishing the monorepo; `-w mangue-ui` selects the workspace.
`prepublishOnly` runs the typecheck as a gate. Check what you are about to ship
with `npm pack --dry-run -w mangue-ui` — only `src/`, `package.json`, `README.md`
and `LICENSE` should be in the list.

**Bump `packages/mangue-ui/package.json` first.** While the API is pre-1.0, a
breaking change bumps the *minor* (0.5.0 removed the sidebar's manual collapse);
additive work bumps the patch. `packages/mangue-ui/docs/minddy-inventory.md`
records what landed in each minor and where it came from.

---

## Credits

Design system, tokens and primitives originate from
[AutoKap](https://github.com/) and are reused here with the business logic
stripped out.
