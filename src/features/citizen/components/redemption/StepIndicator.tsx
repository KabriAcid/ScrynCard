import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { STEPS } from "./schema";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <motion.div
      className="mb-8 bg-secondary border border-border rounded-lg p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {STEPS.slice(0, totalSteps).map((step, index) => (
            <div key={step.id} className="flex items-center gap-4 flex-1">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/50"
                    : currentStep > step.id
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  step.id
                )}
              </motion.div>

              {index < totalSteps - 1 && (
                <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="ml-4 text-right">
          <p className="text-sm text-foreground font-medium">
            Step {currentStep} of {totalSteps}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {STEPS[currentStep - 1]?.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
