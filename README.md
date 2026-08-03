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
   `MobileNav`, `AppShell`, plus a presentational `NumoChat` panel.
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

## Settings screens

Primitives alone don't make a settings screen. Given a `Switch` and a `Select`,
two authors lay them out differently — and a settings page whose tabs each look
different is unreadable no matter how good the controls are. That layer is now
part of the library, so **settings built with mangue-ui always come out looking
the same**.

Three levels, each of them marked:

```
Page title        text-2xl font-display          "Settings"
└─ Group (card)   text-sm font-medium + icon     "Appearance"
   └─ Row         label left · control right, hairline between two
```

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

`SettingsLayoutSkeleton` renders the same grid (rail + cards) for your route's
loading state, so the page doesn't jump when it resolves.

The showcase renders a full six-tab settings screen at `#settings`
(`apps/showcase/app/_components/settings-gallery.tsx`) — the reference for what
this is supposed to look like.

---

## Responsive model

The shell uses a single canonical breakpoint, `desktop` = **1200px**
(`--breakpoint-desktop`). This gives you `desktop:` (≥1200px) and `max-desktop:`
(<1200px) Tailwind variants.

- `AppShell` shows the `Sidebar` only ≥1200px and the `MobileNav` below it.
- `Dialog`, `AlertDialog` and `DropdownMenu` automatically become bottom drawers
  on small screens (via the `useMediaQuery` hook baked into those primitives).

---

## Turning this into a published npm package (later)

The library is already structured as a package (`packages/mangue-ui` with its own
`package.json`, `exports` map and barrel). To publish:

1. Add a build step (e.g. `tsup src/index.ts --format esm --dts` with an alias so
   relative imports resolve) and point `exports` at `dist/` instead of `src/`.
2. Move `react`/`react-dom` (already peers) and keep the rest as `dependencies`.
3. `npm publish` from `packages/mangue-ui`.

Until then, it works perfectly as a workspace dependency (no build needed —
Next transpiles it from source via `transpilePackages: ["mangue-ui"]`).

---

## Credits

Design system, tokens and primitives originate from
[AutoKap](https://github.com/) and are reused here with the business logic
stripped out.
