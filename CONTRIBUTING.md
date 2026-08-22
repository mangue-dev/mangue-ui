# Contributing to mangue-ui

Thanks for your interest in contributing! This document explains how to set up
the project and submit changes.

## Development setup

Requirements: Node.js ≥ 20 and npm.

```bash
git clone https://github.com/mangue-dev/mangue-ui.git
cd mangue-ui
npm install        # installs all workspaces
npm run dev        # starts apps/showcase on http://localhost:3001
```

The showcase app (`apps/showcase`) renders every component with live,
interactive examples — use it to develop and verify your changes.

## Project structure

- `packages/mangue-ui` — the library itself (the npm package)
  - `src/styles/tokens.css` — OKLch design tokens (`@theme` + `:root` / `.dark`)
  - `src/lib/` — `cn()`, motion presets, media-query hooks
  - `src/components/ui/` — primitives
  - `src/components/shell/` — Sidebar, Header, CommandMenu, AppShell…
  - `src/chat/`, `src/ai/` — AI surfaces (presentational)
  - `src/index.ts` — public barrel export
- `apps/showcase` — Next.js gallery app

## Ground rules

The library stays decoupled from any application:

- **No router, no data fetching.** `usePathname`, `useRouter`, query hooks and
  database calls stay in the host app. What they produce becomes a prop.
- **No i18n.** Every string is a prop with an English default.
- **No app vocabulary.** The library ships *mechanics*; domain-specific tables
  arrive as props (`registry`, `visual`, `knownLabels`, …).
- Data/props in, UI out.

## Before you open a PR

```bash
npm run typecheck   # packages/mangue-ui
npm run lint        # apps/showcase
```

Please also:

- Keep PRs focused — one feature or fix per PR.
- Update `packages/mangue-ui/README.md` if you add or change public API.
- If your change is breaking while pre-1.0, bump the *minor* version of
  `packages/mangue-ui`; additive work bumps the patch.
- Add a showcase example when introducing a new component.

## Reporting bugs

Open a [GitHub issue](https://github.com/mangue-dev/mangue-ui/issues) using the
bug report template. Include a minimal reproduction (a snippet or a fork of the
showcase) and the versions of `mangue-ui`, React and Tailwind you use.

## Proposing features

Open a feature request issue first so we can discuss the API before code lands.
Features that leak application logic into the library will be declined per the
ground rules above.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE) that covers this repository.
