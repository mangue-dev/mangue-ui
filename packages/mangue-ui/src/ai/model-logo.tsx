"use client";

import type { ComponentType } from "react";
import ClaudeColor from "@lobehub/icons/es/Claude/components/Color";
import CohereColor from "@lobehub/icons/es/Cohere/components/Color";
import DeepSeekColor from "@lobehub/icons/es/DeepSeek/components/Color";
import GeminiColor from "@lobehub/icons/es/Gemini/components/Color";
import Grok from "@lobehub/icons/es/Grok/components/Mono";
import MetaColor from "@lobehub/icons/es/Meta/components/Color";
import MistralColor from "@lobehub/icons/es/Mistral/components/Color";
import Moonshot from "@lobehub/icons/es/Moonshot/components/Mono";
import OpenAI from "@lobehub/icons/es/OpenAI/components/Mono";
import OpenRouter from "@lobehub/icons/es/OpenRouter/components/Mono";
import PerplexityColor from "@lobehub/icons/es/Perplexity/components/Color";
import QwenColor from "@lobehub/icons/es/Qwen/components/Color";
import ZhipuColor from "@lobehub/icons/es/Zhipu/components/Color";
import { Cpu } from "lucide-react";

import { cn } from "../lib/utils";
import { providerFromModel } from "./model-format";

/**
 * The provider's real color logo, derived from a model id (`provider/model`)
 * through `@lobehub/icons`. Shared by `ModelBadge` (displaying a run) and
 * `ModelCombobox` (the searchable picker). Each logo is imported from its own
 * component file: those only need React, whereas the package barrel also
 * re-exports `ProviderIcon` and friends, which depend on `@lobehub/ui` and
 * antd. An unknown provider slug falls back to `Cpu`.
 */

export type LogoComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

/** provider slug (normalized by providerFromModel) → color logo component. */
export const PROVIDER_LOGOS: Record<string, LogoComponent> = {
  deepseek: DeepSeekColor,
  anthropic: ClaudeColor,
  openai: OpenAI,
  google: GeminiColor,
  gemini: GeminiColor,
  meta: MetaColor,
  mistral: MistralColor,
  qwen: QwenColor,
  xai: Grok,
  moonshot: Moonshot,
  zhipu: ZhipuColor,
  cohere: CohereColor,
  perplexity: PerplexityColor,
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
