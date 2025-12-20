import { motion } from "framer-motion";
import { CreditCard, LoaderCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardRedemptionInput } from "../card-redemption-input";

interface CardVerificationStepProps {
  isLoading: boolean;
  cardValid: boolean;
  onCardValid: (
    valid: boolean,
    data?: { serial: string; code: string }
  ) => void;
  onNext: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

export function CardVerificationStep({
  isLoading,
  cardValid,
  onCardValid,
  onNext,
}: CardVerificationStepProps) {
  return (
    <motion.div
      key="step-1"
      className="space-y-6"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        variants={itemVariants}
      >
        <div className="p-2 bg-primary/20 rounded-lg">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">
            Verify Your Card
          </h3>
          <p className="text-muted-foreground text-sm">
            Enter your scratch card details to proceed
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CardRedemptionInput onValidChange={onCardValid} disabled={isLoading} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="button"
          onClick={onNext}
          disabled={!cardValid || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Validating Card...
            </>
          ) : (
            <>
              Continue
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
