import { motion } from "framer-motion";
import { CreditCard, LoaderCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardRedemptionInput } from "../card-redemption-input";
import { useState } from "react";

interface CardVerificationStepProps {
  isLoading: boolean;
  serialNumber: string;
  cardCode: string;
  onSerialChange: (value: string) => void;
  onCodeChange: (value: string) => void;
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
  serialNumber,
  cardCode,
  onSerialChange,
  onCodeChange,
  onNext,
}: CardVerificationStepProps) {
  const [error, setError] = useState<string | null>(null);

  // Validate serial number (format: XX-XXXXXX)
  const serialValid =
    serialNumber.length === 9 && /^[A-Z]{2}-[A-Z0-9]{6}$/.test(serialNumber);

  // Validate card code - must be 15 characters total (without hyphens)
  // Remove hyphens to count actual characters
  const cleanCode = cardCode.replace(/-/g, "");
  const codeValid =
    cleanCode.length === 15 && /^[A-Z]{3}[A-Za-z0-9]{12}$/.test(cleanCode);

  const isValid = serialValid && codeValid;

  const handleVerify = async () => {
    setError(null);

    // Simulate card verification
    // In a real scenario, this would call a backend API
    try {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, assume verification succeeds and proceed
      onNext();
    } catch (err) {
      setError("Card verification failed. Please check your details.");
    }
  };

  return (
    <motion.div
      key="card-verification"
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
        <CardRedemptionInput
          serialNumber={serialNumber}
          cardCode={cardCode}
          onSerialChange={onSerialChange}
          onCodeChange={onCodeChange}
          disabled={isLoading}
        />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Button
          type="button"
          onClick={handleVerify}
          disabled={!isValid || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Verifying Card...
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
