import { cn } from "../../lib/utils";

interface Props {
  currentStep: number;
  totalSteps: number;
  className?: string;
  /**
   * When provided, completed steps (before the current one) become clickable so
   * the user can jump straight back to an exact step. Forward steps stay locked
   * because they may not be validated yet.
   */
  onStepClick?: (step: number) => void;
  /** Accessible label / native tooltip for a step (e.g. its title). */
  getStepLabel?: (step: number) => string;
}

export function WizardStepper({
  currentStep,
  totalSteps,
  className,
  onStepClick,
  getStepLabel,
}: Props) {
  return (
    <ol
      className={cn("flex items-center justify-center gap-1.5", className)}
      role="list"
    >
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNumber = idx + 1;
        const active = stepNumber === currentStep;
        const completed = stepNumber < currentStep;
        const clickable = Boolean(onStepClick) && completed;

        const bar = (
          <span
            className={cn(
              "block h-1.5 rounded-full transition-all",
              active && "w-6 bg-foreground",
              completed && "w-1.5 bg-foreground/40",
              !active && !completed && "w-1.5 bg-muted",
              clickable && "group-hover:bg-foreground group-hover:w-3",
            )}
          />
        );

        const label = getStepLabel?.(stepNumber);

        return (
          <li
            key={stepNumber}
            className="flex items-center"
            aria-current={active ? "step" : undefined}
          >
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(stepNumber)}
                aria-label={label}
                title={label}
                className="group flex cursor-pointer items-center px-0.5 py-2 -my-2"
              >
                {bar}
              </button>
            ) : (
              <span className="flex items-center px-0.5 py-2 -my-2">{bar}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
