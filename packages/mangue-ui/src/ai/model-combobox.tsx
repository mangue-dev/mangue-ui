"use client";

import * as React from "react";

import {
  Combobox,
  type ComboboxOption,
  type ComboboxProps,
} from "../components/ui/combobox";
import { formatModelName, type KnownLabels } from "./model-format";
import { ModelLogo, ProviderLogo, type LogoOverrides } from "./model-logo";

export interface ModelOption {
  /** Model id, `provider/model` (OpenRouter-style) or a bare slug. */
  id: string;
  /** Overrides the auto-formatted name for this row. */
  label?: string;
  /**
   * Relative cost aside ("×2.4"), rendered as-is. Formatting and locale are the
   * app's business — the library never guesses a number format.
   */
  cost?: React.ReactNode;
  /**
   * Out of the current plan: the row stays listed and readable but is not
   * selectable. Hiding it would say nothing; `footer` says why.
   */
  disabled?: boolean;
}

export interface ModelComboboxProps
  extends Pick<
    ComboboxProps,
    | "variant"
    | "placeholder"
    | "searchPlaceholder"
    | "emptyLabel"
    | "loading"
    | "loadingLabel"
    | "footer"
    | "disabled"
    | "disabledTooltip"
    | "className"
  > {
  /** `""` follows `defaultModelId`; otherwise a model id. */
  value: string;
  onChange: (value: string) => void;
  /** The catalogue. Fetching it is the app's job — this component never queries. */
  models: ModelOption[];
  /**
   * Active provider slug. When set (and not "openrouter"), every row wears that
   * provider's logo rather than one derived per id — a single-vendor catalogue
   * exposes bare slugs like "gpt-5", from which no provider can be read.
   */
  provider?: string | null;
  /** Label of the pinned "use my default" row. Omit to drop that row. */
  defaultLabel?: string;
  /** Which model "the default" resolves to — shown as an aside on that row. */
  defaultModelId?: string | null;
  /** Free-text row label. Omit to forbid typing an id that is not listed. */
  freeTextLabel?: (query: string) => string;
  /** Curated id → label map, see `formatModelName`. */
  knownLabels?: KnownLabels;
  /** Extra provider logos, merged over the built-in table. */
  logos?: LogoOverrides;
}

/**
 * The searchable model picker: every entry with its provider logo and its
 * reformatted name. A thin specialization of `Combobox` — it owns the model
 * vocabulary (ids, logos, name formatting) and nothing else.
 *
 * Rows beyond the plan's ceiling arrive as `disabled`: greyed, NOT hidden.
 * Knowing a model exists and what it costs is exactly what gives a reason to
 * upgrade. Pass `footer` to explain the grey — a disabled row emits no pointer
 * event, so a per-row tooltip is not an option.
 */
export function ModelCombobox({
  value,
  onChange,
  models,
  provider,
  defaultLabel,
  defaultModelId,
  freeTextLabel,
  knownLabels,
  logos,
  variant = "field",
  ...rest
}: ModelComboboxProps) {
  // OpenRouter → per-id logo (`vendor/model`); otherwise the active provider's.
  const logoFor = React.useCallback(
    (modelId: string) =>
      !provider || provider === "openrouter" ? (
        <ModelLogo model={modelId} logos={logos} />
      ) : (
        <ProviderLogo provider={provider} logos={logos} />
      ),
    [provider, logos],
  );

  const options: ComboboxOption[] = React.useMemo(
    () =>
      models.map((m) => ({
        value: m.id,
        label: m.label ?? formatModelName(m.id, knownLabels),
        icon: logoFor(m.id),
        trailing: m.cost ? (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground/70">
            {m.cost}
          </span>
        ) : undefined,
        disabled: m.disabled,
        // The raw id stays searchable even when a curated label renamed the row.
        keywords: [m.id],
      })),
    [models, knownLabels, logoFor],
  );

  const defaultEntry = defaultModelId
    ? models.find((m) => m.id === defaultModelId)
    : undefined;

  const defaultOption = defaultLabel
    ? {
        label: defaultLabel,
        icon: defaultModelId ? logoFor(defaultModelId) : undefined,
        trailing: (
          <>
            {defaultModelId ? (
              <span className="truncate text-xs text-muted-foreground/70">
                {formatModelName(defaultModelId, knownLabels)}
              </span>
            ) : null}
            {/* The default's own cost shows like any other row's, but the row is
                NEVER greyed: it is the app's own default, and an app does not
                refuse itself. */}
            {defaultEntry?.cost ? (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground/70">
                {defaultEntry.cost}
              </span>
            ) : null}
          </>
        ),
      }
    : undefined;

  // In the composer's toolbar the chip always names the REAL model: even while
  // following "the default", it is the RESOLVED model that gets shown — a pill
  // reading "My default" tells you nothing about what is about to answer. The
  // field variant keeps the full default row instead (label + resolved name +
  // cost), which has the room to say both.
  const shown = value || defaultModelId || "";
  const compactLabel = shown
    ? formatModelName(shown, knownLabels)
    : defaultLabel;

  return (
    <Combobox
      value={value}
      onChange={onChange}
      options={options}
      defaultOption={defaultOption}
      freeTextLabel={freeTextLabel}
      variant={variant}
      triggerIcon={shown ? logoFor(shown) : undefined}
      triggerLabel={variant === "compact" ? compactLabel : undefined}
      {...rest}
    />
  );
}
