import { Check } from "lucide-react";

const steps = ["Card", "Verify", "Details", "Phone", "Confirm"];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const visibleSteps = steps.slice(0, totalSteps);

  return (
    <nav aria-label="Redemption progress" className="mb-8">
      <ol className="flex items-start">
        {visibleSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={step} className="relative flex min-w-0 flex-1 flex-col items-center text-center">
              {index < visibleSteps.length - 1 && (
                <span className={`absolute left-1/2 top-3.5 h-px w-full ${isComplete ? "bg-[#9e865d]" : "bg-[#e3ddd1]"}`} aria-hidden="true" />
              )}
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border text-[10px] font-semibold transition-colors ${
                  isComplete
                    ? "border-[#173f2d] bg-[#173f2d] text-white"
                    : isCurrent
                    ? "border-[#173f2d] bg-[#faf8f3] text-[#173f2d] ring-4 ring-[#173f2d]/10"
                    : "border-[#d9d3c7] bg-[#fffdf8] text-[#9a9d92]"
                }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : `0${stepNumber}`}
              </span>
              <span className={`mt-2 text-[9px] sm:text-[10px] ${isCurrent ? "font-semibold text-[#294c35]" : "text-[#8a9087]"}`}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
