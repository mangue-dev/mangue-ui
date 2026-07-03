# mangue-ui

Design system + component library extracted from AutoKap: radix-nova shadcn
primitives, a decoupled app shell, an AI chat panel, and OKLch design tokens.

```tsx
import { Button, Sidebar, Header, CommandMenu, NumoChat, ThemeProvider } from "mangue-ui";
```

```css
@import "tailwindcss";
@import "mangue-ui/tokens.css";
@source "../node_modules/mangue-ui/src";
```

## What's inside

- **`tokens.css`** — `@theme` design tokens, `:root` / `.dark` OKLch palettes,
  base layer, keyframes. Rebrand by changing `--primary`.
- **Primitives** (`components/ui/*`) — 46 components: `Button`, `Input`,
  `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `Dialog`, `AlertDialog`,
  `DropdownMenu`, `Popover`, `HoverCard`, `Tooltip`, `Command`, `Sheet`, `Tabs`,
  `Accordion`, `Card`, `Avatar`, `Badge`, `StatusChip`, `Progress`, `Skeleton`,
  `Spinner`, `SegmentedControl`, `Kbd`, and more.
- **Shell** (`components/shell/*`) — `AppShell`, `Sidebar`, `Header` +
  `HeaderSearch`, `CommandMenu` + `useCommandMenu`, `MobileNav`. All props-driven
  and router-agnostic (pass your `<Link>` via `linkComponent`).
- **Chat** — `NumoChat`, a presentational assistant panel (`messages` + `onSend`).
- **Theme** — `ThemeProvider` + `useTheme` (light / dark / system, no deps).

## Peer requirements

React 18+ / 19, a Tailwind v4 pipeline, and (for `next/link`-based nav in
`BackLinkButton`) Next.js as an optional peer. Fonts are supplied by the host app.

See the repository root README for rebranding, the responsive model, and how to
publish this as a standalone npm package.
