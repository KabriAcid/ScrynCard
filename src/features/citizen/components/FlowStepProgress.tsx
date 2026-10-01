import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FlowProgressStep {
  label: string;
  icon: LucideIcon;
}

interface FlowStepProgressProps {
  steps: FlowProgressStep[];
  currentStep: number;
  label: string;
}

export function FlowStepProgress({ steps, currentStep, label }: FlowStepProgressProps) {
  const current = steps[currentStep - 1];

  return (
    <nav className="flow-progress" aria-label={label}>
      <ol className="flow-progress-list">
        {steps.map(({ icon: Icon, label: stepLabel }, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={stepLabel}
              className={`flow-progress-item${isComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {index < steps.length - 1 && <span className="flow-progress-connector" aria-hidden="true" />}
              <span className="flow-progress-marker" aria-hidden="true">
                {isComplete ? <Check /> : <Icon />}
              </span>
              <span className="flow-progress-label">{stepLabel}</span>
            </li>
          );
        })}
      </ol>
      <span className="sr-only" aria-live="polite">
        Step {currentStep} of {steps.length}: {current?.label}
      </span>
    </nav>
  );
}
