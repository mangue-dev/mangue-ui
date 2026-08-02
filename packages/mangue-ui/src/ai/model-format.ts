/**
 * Readable display of an AI model id (`provider/model`, OpenRouter-style):
 * a formatted full name ("deepseek/deepseek-v4-flash" → "DeepSeek V4 Flash")
 * and a normalized provider slug for the `@lobehub/icons` logos. Pure — works
 * on the client and on the server.
 */

/** OpenRouter provider slug → `@lobehub/icons` provider key (where they differ). */
export const PROVIDER_ALIASES: Record<string, string> = {
  "meta-llama": "meta",
  mistralai: "mistral",
  "x-ai": "xai",
  moonshotai: "moonshot",
  "z-ai": "zhipu",
  amazon: "bedrock",
};

/** Brand / acronym casing, applied after a naive title-case. */
export const TOKEN_FIXUPS: Record<string, string> = {
  Gpt: "GPT",
  Deepseek: "DeepSeek",
  Glm: "GLM",
  Xai: "xAI",
  Ai: "AI",
  Oss: "OSS",
  Vl: "VL",
  Qwq: "QwQ",
  Llm: "LLM",
};

/** Curated labels, keyed by model id — they win over automatic formatting. */
export type KnownLabels =
  | Map<string, string>
  | Record<string, string>
  | null
  | undefined;

function lookup(labels: KnownLabels, id: string): string | undefined {
  if (!labels) return undefined;
  return labels instanceof Map ? labels.get(id) : labels[id];
}

/** Strips OpenRouter variant suffixes (`:free`, `:nitro`, `@…` routing). */
export function baseId(modelId: string): string {
  return modelId.split(":")[0].split("@")[0];
}

/** Provider slug (a `@lobehub/icons` key) from a `provider/model` id. */
export function providerFromModel(modelId: string | null | undefined): string {
  if (!modelId) return "";
  const provider = baseId(modelId).split("/")[0]?.toLowerCase() ?? "";
  return PROVIDER_ALIASES[provider] ?? provider;
}

function formatToken(tok: string): string {
  if (!tok) return tok;
  // Version tokens: kept as-is, but the "v" prefix is capitalized (v4 → V4).
  if (/\d/.test(tok)) return tok.replace(/^v(?=\d)/i, "V");
  const cap = tok.charAt(0).toUpperCase() + tok.slice(1);
  return TOKEN_FIXUPS[cap] ?? cap;
}

/**
 * Readable full name of a model. Uses the curated label when the id is known,
 * otherwise formats the slug ("gemini-2.5-flash" → "Gemini 2.5 Flash").
 *
 * `knownLabels` is where an app plugs its own allowlist / catalogue in — the
 * library ships no model list of its own.
 */
export function formatModelName(
  modelId: string | null | undefined,
  knownLabels?: KnownLabels,
): string {
  if (!modelId) return "";
  const known =
    lookup(knownLabels, modelId) ?? lookup(knownLabels, baseId(modelId));
  if (known) return known;
  const base = baseId(modelId);
  const slug = base.includes("/") ? base.slice(base.indexOf("/") + 1) : base;
  const name = slug.split(/[-_]/).map(formatToken).join(" ").trim();
  return name || modelId;
}
