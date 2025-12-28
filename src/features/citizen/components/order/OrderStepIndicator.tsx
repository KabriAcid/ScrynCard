import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative hidden sm:block"
    >
      {/* Background glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl blur-xl" />

      <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg">
        {/* Progress bar container */}
        <div className="relative mb-8">
          {/* Background track */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full mx-16" />

          {/* Animated progress fill */}
          <motion.div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full mx-16"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Step circles */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isUpcoming = currentStep < step.id;

              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step circle */}
                  <motion.div
                    className={cn(
                      "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                      isCompleted &&
                        "bg-primary border-primary text-primary-foreground",
                      isCurrent &&
                        "bg-background border-primary text-primary ring-4 ring-primary/20",
                      isUpcoming &&
                        "bg-muted border-border text-muted-foreground"
                    )}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}

                    {/* Pulse animation for current step */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Step title */}
                  <motion.div
                    className="mt-3 text-center max-w-[100px]"
                    animate={{
                      opacity: isCurrent ? 1 : 0.7,
                    }}
                  >
                    <p
                      className={cn(
                        "text-xs font-medium leading-tight",
                        isCurrent && "text-primary",
                        isCompleted && "text-foreground",
                        isUpcoming && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Current step info */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-2 border-t border-border/50"
        >
          <p className="text-sm font-semibold text-foreground">
            Step {currentStep} of {steps.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {steps[currentStep - 1]?.description ||
              steps[currentStep - 1]?.title}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
