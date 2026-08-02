"use client";

import type { ComponentType } from "react";
import {
  Claude,
  Cohere,
  DeepSeek,
  Gemini,
  Grok,
  Meta,
  Mistral,
  Moonshot,
  OpenAI,
  OpenRouter,
  Perplexity,
  Qwen,
  Zhipu,
} from "@lobehub/icons";
import { Cpu } from "lucide-react";

import { cn } from "../lib/utils";
import { providerFromModel } from "./model-format";

/**
 * The provider's real color logo, derived from a model id (`provider/model`)
 * through `@lobehub/icons`. Shared by `ModelBadge` (displaying a run) and
 * `ModelCombobox` (the searchable picker). Brands are imported one by one (the
 * barrel is `sideEffects:false`) so `ProviderIcon` / `@lobehub/ui` never get
 * pulled in. An unknown provider slug falls back to `Cpu`.
 */

export type LogoComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

/** provider slug (normalized by providerFromModel) → color logo component. */
export const PROVIDER_LOGOS: Record<string, LogoComponent> = {
  deepseek: DeepSeek.Color,
  anthropic: Claude.Color,
  openai: OpenAI,
  google: Gemini.Color,
  gemini: Gemini.Color,
  meta: Meta.Color,
  mistral: Mistral.Color,
  qwen: Qwen.Color,
  xai: Grok,
  moonshot: Moonshot,
  zhipu: Zhipu.Color,
  cohere: Cohere.Color,
  perplexity: Perplexity.Color,
  openrouter: OpenRouter,
};

/** Extra or overriding logos, merged on top of the built-in table. */
export type LogoOverrides = Record<string, LogoComponent>;

function LogoBySlug({
  slug,
  size,
  className,
  logos,
}: {
  slug: string;
  size: number;
  className?: string;
  logos?: LogoOverrides;
}) {
  const Logo = slug
    ? (logos?.[slug] ?? PROVIDER_LOGOS[slug])
    : undefined;
  if (Logo) return <Logo size={size} className={cn("shrink-0", className)} />;
  return (
    <Cpu
      className={cn("shrink-0 text-muted-foreground", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Logo derived from a `provider/model` id (e.g. "openai/gpt-5"). */
export function ModelLogo({
  model,
  size = 14,
  className,
  logos,
}: {
  model: string | null | undefined;
  size?: number;
  className?: string;
  logos?: LogoOverrides;
}) {
  return (
    <LogoBySlug
      slug={providerFromModel(model)}
      size={size}
      className={className}
      logos={logos}
    />
  );
}

/** Logo derived from a provider slug directly ("openai", "anthropic", "google"). */
export function ProviderLogo({
  provider,
  size = 14,
  className,
  logos,
}: {
  provider: string | null | undefined;
  size?: number;
  className?: string;
  logos?: LogoOverrides;
}) {
  return (
    <LogoBySlug
      slug={(provider ?? "").toLowerCase()}
      size={size}
      className={className}
      logos={logos}
    />
  );
}
