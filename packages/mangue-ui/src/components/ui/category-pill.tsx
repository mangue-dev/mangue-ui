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
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-accent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
