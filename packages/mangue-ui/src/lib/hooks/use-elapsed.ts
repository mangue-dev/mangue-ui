"use client";

import * as React from "react";

export interface UseElapsedOptions {
  /** ISO timestamp (or ms epoch) when the run started. */
  startedAt: string | number;
  /** ISO timestamp (or ms epoch) when it ended; `null` while still running. */
  endedAt?: string | number | null;
  /** Tick every second while true; freeze the duration once false. */
  active: boolean;
}

export interface Elapsed {
  /** Raw elapsed milliseconds. */
  ms: number;
  /** Whole minutes of the elapsed duration. */
  minutes: number;
  /** Remaining seconds (0–59) of the elapsed duration. */
  seconds: number;
}

function toMs(value: string | number | null | undefined): number {
  if (value == null) return Number.NaN;
  return typeof value === "number" ? value : Date.parse(value);
}

/**
 * "Working since / worked for" clock of an AI run: counts up live every second
 * while `active`, then freezes on the final duration once the run ends.
 *
 * The interval only exists while `active` — a finished run costs nothing. The
 * clock starts at the mount time rather than at `Date.now()` during render, so
 * a server render and its hydration agree.
 */
export function useElapsed({
  startedAt,
  endedAt,
  active,
}: UseElapsedOptions): Elapsed {
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const startMs = toMs(startedAt);
  const endMs = toMs(endedAt ?? startedAt);

  let ms: number;
  if (active) {
    // Before the first tick lands (server render / first client render) the
    // clock reads zero rather than a machine-dependent value — that is what
    // keeps hydration stable.
    ms = now == null || Number.isNaN(startMs) ? 0 : Math.max(0, now - startMs);
  } else {
    ms =
      Number.isNaN(startMs) || Number.isNaN(endMs)
        ? 0
        : Math.max(0, endMs - startMs);
  }

  // A run always reads as at least one second: "0 s" looks like a failure to
  // start, not like something that happened fast.
  const totalSec = Math.max(1, Math.round(ms / 1000));
  return {
    ms,
    minutes: Math.floor(totalSec / 60),
    seconds: totalSec % 60,
  };
}
