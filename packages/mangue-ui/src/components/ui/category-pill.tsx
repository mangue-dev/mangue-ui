import { cn } from "../../lib/utils";

interface CategoryPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function CategoryPill({ active, onClick, children }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-medium leading-none transition-colors outline-none focus-visible:outline-none focus-visible:ring-0",
        active
          ? "bg-foreground text-background hover:bg-foreground-hover"
          : "bg-control text-foreground hover:bg-control-hover"
      )}
    >
      {children}
    </button>
  );
}
