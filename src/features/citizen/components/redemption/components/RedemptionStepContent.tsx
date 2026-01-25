import { motion, AnimatePresence } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";
import { GiftVerificationStep } from "../GiftVerificationStep";
import { ValidationResultStep } from "../ValidationResultStep";
import { BioDataStep } from "../BioDataStep";
import { PhoneVerificationStep } from "../PhoneVerificationStep";
import { ConfirmationStep } from "../ConfirmationStep";
import { SuccessConfirmation } from "../SuccessConfirmation";
import { RedemptionFormValues } from "../schema";

interface RedemptionStepContentProps {
  step: number;
  direction: number;
  showSuccess: boolean;
  isLoading: boolean;
  giftDetails: any;
  validationError: any;
  submittedValues: RedemptionFormValues | null;
  form: UseFormReturn<RedemptionFormValues>;
  onNext: () => Promise<void>;
  onPrev: () => void;
  onRetry: () => void;
  onProceed: () => void;
  onSuccessComplete: () => void;
  onSubmit: (values: RedemptionFormValues) => Promise<void>;
}

export function RedemptionStepContent({
  step,
  direction,
  showSuccess,
  isLoading,
  giftDetails,
  validationError,
  submittedValues,
  form,
  onNext,
  onPrev,
  onRetry,
  onProceed,
  onSuccessComplete,
  onSubmit,
}: RedemptionStepContentProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      {/* Success Screen */}
      {showSuccess && submittedValues && (
        <SuccessConfirmation
          values={submittedValues}
          giftDetails={giftDetails}
          onComplete={onSuccessComplete}
        />
      )}

      {/* Step 1: Card Verification */}
      {!showSuccess && step === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <GiftVerificationStep
            isLoading={isLoading}
            onNext={onNext}
            onPrev={onPrev}
            isFirstStep={true}
          />
        </motion.div>
      )}

      {/* Step 2: Validation Result */}
      {!showSuccess && step === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ValidationResultStep
            serialNumber={form.getValues("serialNumber")}
            cardCode={form.getValues("cardCode")}
            giftDetails={giftDetails}
            error={validationError}
            isLoading={isLoading}
            onRetry={onRetry}
            onProceed={onProceed}
          />
        </motion.div>
      )}

      {/* Step 3: Bio Data */}
      {!showSuccess && step === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <BioDataStep isLoading={isLoading} onNext={onNext} onPrev={onPrev} />
        </motion.div>
      )}

      {/* Step 4: Phone Verification */}
      {!showSuccess && step === 4 && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PhoneVerificationStep
            isLoading={isLoading}
            onNext={onNext}
            onPrev={onPrev}
          />
        </motion.div>
      )}

      {/* Step 5: Confirmation */}
      {!showSuccess && step === 5 && (
        <motion.div
          key="step-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ConfirmationStep
            isLoading={isLoading}
            giftDetails={giftDetails}
            onPrev={onPrev}
            onSubmit={onSubmit}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
