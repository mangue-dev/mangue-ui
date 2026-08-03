# project → mangue-ui inventory

What project (`<internal-project>`) kept local
that actually belongs to the library, and what became of each piece in 0.3.0.

At the time of the audit project already consumed mangue-ui heavily (221
`from "mangue-ui"` imports) but held ~16 local components that are library
material. This table is the de-duplication roadmap for the follow-up issue on
the project side: for every ported line, the `mangue-ui` import path to replace
the local one with.

## The contract

Three rules govern every port. They are why some things moved and others did not:

- **No i18n in the library.** Every string is a prop with an English default.
  Where there were more than two, they are grouped in a `labels` object.
  `useTranslations` / `useNow` from `next-intl` never cross the boundary.
- **No router, no data fetching.** `usePathname`, `useRouter`, react-query hooks
  and Supabase calls stay in the app. What they produced becomes a prop
  (a model list, a branch list, a `visible` flag).
- **No app vocabulary.** project's 67-tool table, its context-kind colors, its
  model allowlist are project's. The library ships the *mechanics* and takes the
  vocabulary as a registry / a `visual` / a `knownLabels` map.

## Ported

| project | mangue-ui equivalent | verdict | import from `mangue-ui` |
| --- | --- | --- | --- |
| `components/agent-beam.tsx` | *(new)* `src/ai/agent-beam.tsx` | **port**, verbatim minus the `mangue-ui` import indirection | `AgentBeam`, `AgentBeamOverlay`, `BorderBeamSize` |
| `lib/model-display.ts` | *(new)* `src/ai/model-format.ts` | **adapt** — the `AGENT_ALLOWED_MODELS` import became an optional `knownLabels` param | `formatModelName`, `providerFromModel`, `baseId`, `PROVIDER_ALIASES`, `TOKEN_FIXUPS` |
| `components/model-logo.tsx` | *(new)* `src/ai/model-logo.tsx` | **adapt** — added a `logos` prop merged over the built-in table | `ModelLogo`, `ProviderLogo`, `PROVIDER_LOGOS` |
| `components/model-badge.tsx` | *(new)* `src/ai/model-badge.tsx` | **port** (+ `knownLabels` / `logos` pass-through) | `ModelBadge` |
| `components/agent/model-combobox.tsx` | *(new)* `src/ai/model-combobox.tsx` | **adapt** — no query: `useAgentModelsQuery`'s output arrives as `models` / `provider` / `loading`; the plan-cap note becomes `footer`, out-of-plan rows become `option.disabled` | `ModelCombobox`, `ModelOption` |
| `components/agent/{model,branch,reasoning}-combobox.tsx` (shared shape) | *(new)* `src/components/ui/combobox.tsx` | **extract** — one generic picker; branch and reasoning are now call sites, not components | `Combobox`, `ComboboxOption` |
| `components/assistant/work-accordion.tsx` | *(new)* `src/ai/work-accordion.tsx` | **adapt** — `useNow` → `useElapsed`, the four `Agent.working*/worked*` keys → a `formatDuration` prop | `WorkAccordion` |
| `components/assistant/tool-call-display.tsx` | *(new)* `src/ai/tool-call-list.tsx` | **adapt** — the display mechanics ported, the 67-entry `TOOL_META` table stays in project and arrives as `registry`; `ask_user` hooks back in through `renderExtra` | `ToolCallList`, `ToolCallItem`, `ToolMeta`, `toolRunningLabel` |
| `components/assistant/context-pill.tsx` | *(new)* `src/ai/context-pill.tsx` | **adapt** — the `STYLES` table (issue / objective / cycle…) stays in project and arrives as `visual` | `ContextPill` |
| `components/assistant/assistant-context-bar.tsx` (the row, l. 338-382) | *(new)* `src/ai/context-pill-row.tsx` | **extract** — `AddContextButton` (projects / members / issues data) stays in project and drops into the `action` slot | `ContextPillRow` |
| `components/assistant/assistant-context-bar.tsx` (local `HScroller`, l. 39-103) | `src/components/ui/horizontal-scroller.tsx` | **extend** the existing component (`revealOnHover`, `edgeFade`, `arrowSize`) rather than duplicate it | `HorizontalScroller` |
| `components/assistant/chat-input.tsx` (the composer shell) | *(new)* `src/ai/agent-input.tsx` | **extract** the shell only — the `@` mentions, the `/` menu and the attachments are data-coupled and stay in project | `AgentInput` |
| `components/assistant-fab.tsx` | *(new)* `src/ai/agent-fab.tsx` | **adapt** — route hiding (`HIDDEN_ROUTES`, `usePathname`), zen mode and the chord state become `visible` / `badge` | `AgentFab` |
| `lib/use-scroll-fade.ts` | *(new)* `src/lib/hooks/use-scroll-fade.ts` | **port**, verbatim. This is the fade of the agents and pull-requests pages (`agent-event-feed.tsx:836`, `pr-detail.tsx:556`) | `useScrollFade` |
| `components/search-menu.tsx` | *(new)* `src/components/ui/search-menu.tsx` | **adapt** — the two `Picker` keys become `searchPlaceholder` / `emptyText` | `SearchMenu`, `DropdownSearchRow`, `searchInputClass` |
| `components/search-select.tsx` | *(new)* `src/components/ui/search-select.tsx` | **port** — `forceMount` on the create item *and* its group kept, `data-checked` kept | `SearchSelect`, `SearchMultiSelect`, `PickerCreateRow`, `usePickerShell`, `PickerOption`, `PickerCreateOption` |
| `components/app-sidebar.tsx` | `src/components/shell/sidebar.tsx` | **merge, additive** — the existing `sections` / `activeKey` / `header` / `footer` / `collapsed` API still holds; see below | `Sidebar`, `SidebarFooterRow` |
| `components/category-pill.tsx` | *(new)* `src/components/ui/category-chip.tsx` | **port as a NEW component** — see the note below | `CategoryChip` |
| `app/globals.css:465-504` (`.text-shimmer`) | `src/styles/tokens.css` | **port** as a `@utility`, reduced-motion variant included | `class="text-shimmer"` |

### 0.4.0 — the settings layer (project MIN-167)

| project | mangue-ui equivalent | verdict | import from `mangue-ui` |
| --- | --- | --- | --- |
| `components/ui/field.tsx` | *(new)* `src/components/ui/field.tsx` | **port** — project's copy replaced its `cva` by a class table (no `cva` in that repo); the library keeps `cva`, which it already depends on, so `orientation` is typed by `VariantProps` | `Field`, `FieldGroup`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldSeparator`, `FieldSet`, `FieldLegend`, `FieldOrientation` |
| `components/settings/help-hint.tsx` | *(new)* `src/components/ui/help-hint.tsx` | **adapt** — the `Settings.feedbackLearnMore` key becomes a `label` prop defaulting to `"Learn more"` | `HelpHint` |
| `components/settings/settings-ui.tsx` | *(new)* `src/components/settings/settings-group.tsx` | **port** — pure layout, every string already a prop; only the ⓘ label had to be lifted (`helpLabel`) | `SettingsGroup`, `SettingsRow`, `SettingsListRow`, `SettingsEmpty` |
| `components/settings-shell.tsx` | *(new)* `src/components/settings/settings-layout.tsx` | **adapt** — the `?tab=` reading (`useSearchParams` / `useRouter`) and the `trackEvent` call stay in project and become `value` / `onValueChange`; the animated pill, the rail and the column width port as-is | `SettingsLayout`, `SettingsTabItem`, `SETTINGS_LAYOUT_MAX_WIDTH` |
| `components/route-skeletons.tsx` (`SettingsPageSkeleton`) | `src/components/settings/settings-layout.tsx` | **port** — it only exists to match the layout, so it belongs next to it or it drifts | `SettingsLayoutSkeleton` |

**Why this layer is in the library at all.** MIN-167 diagnosed a settings screen
whose 19 tabs each looked different, and named `mangue-ui` as the root cause. The
diagnosis was half right: the primitives were fine, but the library exported *no
form layout at all* — no `Field`, no `FormRow` — so every screen wrote its own
`flex` and six authors wrote six of them. Shipping `Field` fixes the missing
primitive; shipping `SettingsGroup` / `SettingsRow` fixes the missing *grammar*,
which is what actually made the tabs diverge.

### What the sidebar gained

All additive — project's `AppSidebar` becomes a configuration of `Sidebar`:

- `modeKey` + `modeDirection` → the animated home ↔ project swap
  (`AnimatePresence mode="wait"`, `transitions.fade`, logo and footer immobile),
  short-circuited under `useReducedMotion`.
- `collapsedBrand` → collapsed, the mark sits where the reopen button would be
  and cross-fades to `PanelLeftOpen` on hover; the whole square is the button.
- `NavItem.shortcut` + `chordArmed` / `chordPrefix` / `chordSeparator` → the
  trailing `Kbd` while a chord is armed, and the "prefix *then* key" tooltip.
- `NavItem.showBadgeCollapsed` / `badgeCollapsed` → the corner pip on the icon
  in rail mode.
- `onItemHover` → wired on `onMouseEnter` **and** `onFocus`; this is the cache
  warm-up hook (`usePrefetchProject`).
- `whileTap: { scale: 0.97 }` on links too (the `motion.create(Link)` is
  memoised per link component — rebuilding it each render would remount every
  row), the fixed-width left-anchored icon box when collapsed, and the
  `px-2.5` / `px-3.5` gutters.
- `SidebarFooterRow` is exported so a footer composes without copying the
  classes.

### Subpath exports (a request project left in a comment)

`project/tsconfig.json` carries a `"mangue-ui/*": ["./node_modules/mangue-ui/src/*"]`
alias with a long comment: importing anything from the barrel pulled ~120 KB of
never-rendered components into the public pages' initial bundle (388 KB gzipped
measured on `/legal`), `optimizePackageImports` could not help because the
package exposed no subpaths, and the comment names the proper fix — `"./*":
"./src/*"` in mangue-ui's `exports`. Done in 0.3.0, so the alias can go.

The shipped form is not the obvious one:

```json
"./*": { "types": ["./src/*.tsx", "./src/*.ts"], "default": "./src/*" }
```

Both conditions are load-bearing, and each single-target form was measured to
fail one side: `"./src/*"` alone bundles but does not typecheck (3 × TS2307);
`"./src/*.tsx"` alone breaks on every `.ts` module. TypeScript needs the
extension and accepts a fallback array; Turbopack refuses the array but resolves
extensions itself from an extensionless target. Note the trap: the `types`-only
form typechecks green and then fails at build.

(A comment key inside `exports` is not an option either — Node rejects the whole
package with `ERR_INVALID_PACKAGE_CONFIG` if any key does not start with `.`.)

### Two findings worth recording

- **`components/wizard-stepper.tsx` is a near-exact duplicate** of
  `src/components/ui/wizard-stepper.tsx` — same props, same classes. The
  library's version is in fact slightly better (it has a focus ring the project
  copy lost). Nothing to port: delete the local file and import `WizardStepper`.
- **`components/category-pill.tsx` is NOT the same component** as
  `src/components/ui/category-pill.tsx`. The library's `CategoryPill` is a
  *filter toggle* (`active` / `onClick` / `aria-pressed`); project's is a
  *removable colored label*. Two different jobs sharing a name — hence a new
  `CategoryChip` rather than a change to `CategoryPill`.
- **`components/assistant/work-accordion.tsx:81-85` documented a library bug**:
  `CollapsibleContent`'s open-state class was glued to a `${…}` template hole,
  so Tailwind's scanner never emitted it and the opening animation never played
  for any consumer. project worked around it by re-declaring the class locally.
  Fixed at the source (`cn()` with a plain literal); the workaround can go.

## Deliberately left in project

| project | why |
| --- | --- |
| `lib/command-palette/` (~30 files) + `command-palette.css` | Coupled to project's entities and its own theme file. A generic palette is a separate piece of work. |
| `components/assistant/chat-message.tsx`, markdown / Streamdown rendering | Pulls `streamdown`, `remark-*`, `rehype-*` — a rendering stack, not a UI primitive. |
| `@` mentions and the `/` menu of the composer | Both are data-coupled (mentionable sources, command registry). `AgentInput` exposes an `overlay` slot for them. |
| `components/ai-elements/conversation.tsx` | Depends on `use-stick-to-bottom`; would add a runtime dep for one behaviour. |
| `TOOL_META` (67 tools), `STYLES` (context kinds), `AGENT_ALLOWED_MODELS` | App vocabulary. They arrive as `registry`, `visual` and `knownLabels`. |
| `lib/ask-user.ts` + `AskUserSummaryRow` | Coupled to project's ask-user protocol. Hooks back in through `ToolCallList`'s `renderExtra`. |

## New runtime dependencies

Two, both required for "ready to use" to mean anything:

- `border-beam@^1.3.0` — `AgentBeam`.
- `@lobehub/icons@^5.13.0` — the provider logos. Imported brand by brand (the
  barrel is `sideEffects:false`, so it tree-shakes); the table is overridable
  through the `logos` prop.
