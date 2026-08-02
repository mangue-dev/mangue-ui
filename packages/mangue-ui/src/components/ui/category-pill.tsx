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
        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "bg-foreground text-background hover:bg-foreground/90"
          : "bg-accent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
