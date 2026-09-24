"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { cn } from "../lib/utils";
import { formatModelName, type KnownLabels } from "./model-format";
import { ModelLogo, type LogoOverrides } from "./model-logo";

/**
 * A model's badge: the provider's real logo plus its readable full name
 * ("DeepSeek V4 Flash"). The raw id stays reachable on hover — that is what
 * gets copied into a config or searched in a log, but it is not what one reads.
 */
export function ModelBadge({
  model,
  className,
  size = 14,
  knownLabels,
  logos,
}: {
  model: string | null | undefined;
  className?: string;
  size?: number;
  /** Curated id → label map (an app's catalogue), see `formatModelName`. */
  knownLabels?: KnownLabels;
  /** Extra provider logos, merged over the built-in table. */
  logos?: LogoOverrides;
}) {
  if (!model) return null;
  const name = formatModelName(model, knownLabels);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1 rounded-md bg-control px-1 py-0.5 text-xs font-medium leading-none text-foreground",
            className,
          )}
        >
          <ModelLogo model={model} size={size} logos={logos} />
          <span className="truncate">{name}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="font-mono">{model}</TooltipContent>
    </Tooltip>
  );
}
