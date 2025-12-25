import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepConfig } from "./schema";

interface OrderStepIndicatorProps {
  steps: StepConfig[];
  currentStep: number;
}

export function OrderStepIndicator({
  steps,
  currentStep,
}: OrderStepIndicatorProps) {
  return (
    <motion.div
      className="mb-8 bg-secondary border border-border rounded-lg p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-4">
        {steps.map((s, index) => {
          const StepIcon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-4 flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all border-2",
                    currentStep > s.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "",
                    currentStep === s.id
                      ? "border-primary text-primary ring-4 ring-primary/20"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: currentStep === s.id ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {currentStep > s.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <StepIcon className="h-6 w-6" />
                  )}
                </motion.div>
                <p
                  className={cn(
                    "text-sm text-center font-medium",
                    currentStep === s.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {s.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mt-[-28px] h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: currentStep > s.id ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-foreground font-medium">
          Step {currentStep} of {steps.length}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {steps[currentStep - 1]?.title}
        </p>
      </div>
    </motion.div>
  );
}
