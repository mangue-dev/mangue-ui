# mangue-ui

A reusable component library extracted from **AutoKap**'s design system, so you
can spin up a new product (a Linear-style ticketing app, a dashboard, anything)
that looks and feels like AutoKap in minutes.

It ships three layers:

1. **Design tokens** — the full OKLch color system (light + dark), radius, fonts,
   spacing and breakpoints, as Tailwind v4 `@theme` variables.
2. **Primitives** — the 46 radix-nova / shadcn components (button, dialog,
   dropdown, select, command palette, sheet, tooltip, …), copied verbatim from
   AutoKap and **fully decoupled** from any AutoKap business logic.
3. **App shell** — decoupled, props-driven `Sidebar`, `Header`, `CommandMenu`,
   `MobileNav`, `AppShell`, plus a presentational `NumoChat` panel.

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
