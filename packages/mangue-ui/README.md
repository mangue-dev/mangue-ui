# mangue-ui

A reusable component library extracted from **project**'s design system: OKLch
design tokens, radix-nova / shadcn primitives, a decoupled app shell (sidebar /
header / command menu / mobile nav), a responsive `SidePanel`, and an AI chat
panel — all decoupled from any business logic. Data/props in, UI out.

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
- **Chat** — `NumoChat`, a presentational assistant panel (`messages` + `onSend`).
- **Theme** — `ThemeProvider` + `useTheme` (light / dark / system, no deps).

## Rebranding

The whole library recolors from one variable. Override `--primary` (in `:root`
and `.dark`) from your own `globals.css` — buttons, rings, links, the sidebar
active state and `--brand` all derive from it.

## License

MIT
