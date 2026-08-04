# mangue-ui

A reusable component library extracted from **AutoKap**'s design system: OKLch
design tokens, radix-nova / shadcn primitives, a decoupled app shell (sidebar /
header / command menu / mobile nav), a responsive `SidePanel`, and a full set of
**AI surfaces** (agent composer, animated beam, tool-call trace, model pickers,
context pills) — all decoupled from any business logic. Data/props in, UI out.

The package **ships TypeScript/TSX source** (no build step): your bundler compiles
it and Tailwind scans it, so you keep full control over the design tokens.

## Install

```bash
npm install mangue-ui
```

Requires **React 18/19** and **Tailwind CSS v4** in the host app. `next` is an
optional peer.

## Setup (Next.js)

**1. `next.config.mjs`** — transpile the source it ships:

```js
export default { transpilePackages: ["mangue-ui"] };
```

**2. `app/globals.css`** — import the tokens and let Tailwind scan the library.
This file is *yours*: override any token and reuse them in your own styles.

```css
@import "tailwindcss";
@import "mangue-ui/tokens.css";
@source "../node_modules/mangue-ui/src";

/* Override any token — your values win by cascade (declared after the import). */
:root { --primary: oklch(0.55 0.22 25); }
.dark { --primary: oklch(0.60 0.22 25); }

/* Reuse the tokens anywhere in your app. */
.my-thing { background: var(--primary); color: var(--foreground); }
```

**3. `app/layout.tsx`** — provide the three font variables and wrap in the theme
provider:

```tsx
import { Inter, Space_Grotesk, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "mangue-ui";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: "italic" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} antialiased`}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Use

```tsx
import { Button, AppShell, Sidebar, Header, CommandMenu, SidePanel } from "mangue-ui";

export default function Page() {
  return <Button>Ship it</Button>;
}
```

### Deep imports, for pages that need two things

The root barrel `export *`s ~60 modules — the command palette (cmdk), the
carousel (embla), the color picker (react-colorful), the drawer (vaul), the app
shell (framer-motion). On a page that renders none of them, a single
`import { cn } from "mangue-ui"` still drags all of it into the initial bundle.
Every module is therefore also reachable by its own path:

```tsx
import { cn } from "mangue-ui/lib/utils";
import { Button } from "mangue-ui/components/ui/button";
import { AgentBeam } from "mangue-ui/ai/agent-beam";
```

Use the barrel by default; reach for a subpath on a public/marketing page where
the initial bundle is the point.

## What's inside

- **`tokens.css`** — `@theme` design tokens, `:root` / `.dark` OKLch palettes,
  state variants, keyframes. Rebrand by overriding `--primary`.
- **Primitives** (`components/ui/*`) — `Button`, `Input`, `Textarea`, `Select`,
  `Checkbox`, `Switch`, `Slider`, `Dialog`, `AlertDialog`, `DropdownMenu`,
  `Popover`, `Tooltip`, `Command`, `Sheet`, `SidePanel`, `SplitButton`, `Tabs`,
  `Accordion`, `Card`, `Avatar`, `Badge`, `StatusChip`, `TypeBadge`, and more.
  Dialogs/alerts become bottom sheets on mobile automatically.
- **Shell** (`components/shell/*`) — `AppShell`, `Sidebar`, `Header` (with a
  responsive breadcrumb), `SearchCommand`, `CommandMenu` + `useCommandMenu`,
  `MobileNav`. Props-driven and router-agnostic (pass your `<Link>` via
  `linkComponent`). Ultrawide-centered app canvas on ≥3xl screens.
- **Double sidebar** — `SecondarySidebarProvider` + `SecondarySidebar`: a page
  mounts its own navigation column (a list of pull requests, an inbox, settings
  sections) and the shell displays it full height, left of the header. Mounting
  one rails the primary sidebar — it keeps its 56px of icons in the flow and
  unfolds *over* the second column on hover, shifting nothing. That rail is the
  only fold: there is no manual collapse. `SidebarFilterField` + `matchesFilter`
  give the column its filter; `useSidebarState` is how a footer piece learns the
  bar is folded.
- **Settings** (`components/settings/*`) — `SettingsLayout`, `SettingsGroup`,
  `SettingsRow`, `SettingsListRow`: one card per group, one key/value row per
  option, so two authors write the same screen. Inside a secondary-sidebar
  provider the tab rail moves out into that column, with a filter over the
  cards (`sections`) that opens the right tab, scrolls to the card and rings it.
- **AI** (`ai/*`) — the agent-facing half, ready to mount:
  - `AgentInput` — the composer, wrapped in `AgentBeam`, with a context row, a
    toolbar and a send/stop cluster.
  - `AgentBeam` / `AgentBeamOverlay` — the animated "working" outline. The
    overlay form is the one to use on a portalled `fixed` surface (a modal, a
    side panel), where the wrapper collapses to nothing.
  - `AgentFab` — the floating assistant button (beam while busy, corner pip).
  - `WorkAccordion` + `useElapsed` — the "working for / worked for" clock:
    counts live, freezes and closes itself when the turn ends.
  - `ToolCallList` — what the agent did, folded to as few lines as possible.
    Bring your own tool vocabulary through `registry`.
  - `ContextPill` / `ContextPillRow` — what the assistant has in front of it;
    ambient context is *ignored* (an eye), pinned context is *removed* (a cross).
  - `ModelCombobox`, `ModelBadge`, `ModelLogo`, `formatModelName` — model
    pickers and badges with real provider logos and reformatted names.
- **Chat** — `NumoChat`, a presentational assistant panel (`messages` + `onSend`).
- **Pickers** — `SearchMenu` / `SearchSelect` / `SearchMultiSelect` (the cmdk
  dropdown behind every field picker) and `Combobox` (searchable single choice,
  `field` or `compact`).
- **Theme** — `ThemeProvider` + `useTheme` (light / dark / system, no deps).

### Labels are props, never i18n

The library ships **no i18n and no locale awareness**. Every user-visible string
is a prop with an English default; where a component needs more than two, they
are grouped in one `labels` object. Anything an app knows and the library does
not — a router, a data source, a tool vocabulary, a model catalogue — arrives as
a prop too.

```tsx
<WorkAccordion
  startedAt={run.startedAt}
  endedAt={run.endedAt}
  active={run.active}
  formatDuration={({ minutes, seconds, active }) =>
    t(active ? "workingSince" : "workedFor", { minutes, seconds })
  }
>
  <ToolCallList items={calls} registry={MY_TOOLS} labels={{ summary: (n) => t("actions", { n }) }} />
</WorkAccordion>
```

### AI dependencies

The `ai/*` components pull two runtime dependencies: `border-beam` (the agent
beam) and `@lobehub/icons` (provider logos, imported brand by brand so the rest
tree-shakes away). Import nothing from `ai/*` and neither reaches your bundle.

## Rebranding

The whole library recolors from one variable. Override `--primary` (in `:root`
and `.dark`) from your own `globals.css` — buttons, rings, links, the sidebar
active state and `--brand` all derive from it.

## License

MIT
