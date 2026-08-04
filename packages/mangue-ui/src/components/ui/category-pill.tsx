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
        // The border sits on BOTH states (transparent when active) so toggling
        // never shifts the pill by 1px.
        "px-3.5 py-1.5 rounded-full border text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "border-transparent bg-foreground text-background hover:bg-foreground/90"
          : "border-border bg-control text-foreground hover:bg-control-hover"
      )}
    >
      {children}
    </button>
  );
}
