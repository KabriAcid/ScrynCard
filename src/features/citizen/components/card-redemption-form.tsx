import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import {
  RedemptionSchema,
  RedemptionFormValues,
  STEPS,
} from "./redemption/schema";
import { StepIndicator } from "./redemption/StepIndicator";
import { BioDataStep } from "./redemption/BioDataStep";
import { GiftVerificationStep } from "./redemption/GiftVerificationStep";
import { ValidationResultStep } from "./redemption/ValidationResultStep";
import { PhoneVerificationStep } from "./redemption/PhoneVerificationStep";
import { SummaryStep } from "./redemption/SummaryStep";
import { SuccessConfirmation } from "./redemption/SuccessConfirmation";
import { useCitizenStore } from "@/stores/citizenStore";
import { NetworkDetector } from "@/lib/operators";

const stepVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "50%" : "-50%",
  }),
  visible: {
    opacity: 1,
    x: "0%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? "50%" : "-50%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  }),
};

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1); // Form step (1-4: BioData, CardVerification, Phone, Summary)
  const [direction, setDirection] = useState(1);
  const [giftDetails, setGiftDetails] = useState<any>(null);
  const [validationError, setValidationError] = useState<any>(null);
  const [detectedNetwork, setDetectedNetwork] = useState<string | null>(null);
  const [submittedValues, setSubmittedValues] =
    useState<RedemptionFormValues | null>(null);
  const redeemGift = useCitizenStore((state) => state.redeemGift);
  const validateGift = useCitizenStore((state) => state.validateGift);

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(RedemptionSchema),
    mode: "onChange",
    defaultValues: {
      nin: "",
      occupation: "",
      serialNumber: "",
      cardCode: "",
      phoneNumber: "",
    },
  });

  const handleNextStep = async () => {
    // Step 1: BioData - no validation needed, just move forward
    if (step === 1) {
      setDirection(1);
      setStep(2);
      return;
    }

    // Step 2: Card Verification - validate the card
    if (step === 2) {
      const cardCode = form.getValues("cardCode");
      setIsLoading(true);
      try {
        const result = await validateGift(cardCode);
        if (result.success) {
          const details = {
            giftType: result.giftType,
            amount: result.amount,
            dataSize: result.dataSize,
          };
          setGiftDetails(details);
          setValidationError(null);
          setDirection(1);
          setStep(3); // Move to phone verification
        } else {
          setValidationError({
            message: result.error || "Invalid card code",
            code: (result as any).errorCode || "VERIFICATION_FAILED",
            details: (result as any).details || null,
          });
          setGiftDetails(null);
          // Stay on step 2 but show validation result
        }
      } catch (error) {
        setValidationError({
          message: "Failed to verify card. Please try again.",
          code: "VERIFICATION_ERROR",
          details: error instanceof Error ? error.message : null,
        });
        setGiftDetails(null);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Step 3: Phone Verification - detect network and move forward
    if (step === 3) {
      const phoneNumber = form.getValues("phoneNumber");
      const networkDetection = NetworkDetector.detect(phoneNumber);
      setDetectedNetwork(networkDetection.operatorName || null);
      setDirection(1);
      setStep(4);
      return;
    }

    // Step 4: Summary - final step
    if (step === 4) {
      setDirection(1);
      setStep(5);
    }
  };

  const handleRetryValidation = () => {
    // Go back to card verification step
    setDirection(-1);
    setStep(2);
    setGiftDetails(null);
    setValidationError(null);
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
    if (step === 3) {
      setDetectedNetwork(null);
    }
  };

  const handleSuccessComplete = () => {
    form.reset();
    setShowSuccess(false);
    setStep(1);
    setGiftDetails(null);
    setValidationError(null);
    setDetectedNetwork(null);
    setDirection(1);
    navigate("/");
  };

  const onSubmit = async (values: RedemptionFormValues) => {
    setIsLoading(true);
    try {
      // Combine serial number and card code for redemption
      const combinedCode = `${values.serialNumber}-${values.cardCode}`;
      const result = await redeemGift(combinedCode, values.phoneNumber);
      if (result.success) {
        setSubmittedValues(values);
        setShowSuccess(true);
        toast({
          title: "Success!",
          description: `Your ${giftDetails?.giftType} has been sent to ${values.phoneNumber}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Redemption Failed",
          description: result.error || "Failed to redeem gift",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* Step Indicator */}
        {!showSuccess && <StepIndicator currentStep={step} totalSteps={4} />}

        <AnimatePresence mode="wait">
          {/* Success Screen */}
          {showSuccess && submittedValues && (
            <SuccessConfirmation
              values={submittedValues}
              giftDetails={giftDetails}
              onComplete={handleSuccessComplete}
            />
          )}

          {/* Step 1: Personal Information (BioData) */}
          {!showSuccess && step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <BioDataStep
                isLoading={isLoading}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                isFirstStep={true}
              />
            </motion.div>
          )}

          {/* Step 2: Card Verification */}
          {!showSuccess && step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {!validationError && !giftDetails ? (
                <GiftVerificationStep
                  isLoading={isLoading}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  isFirstStep={false}
                />
              ) : (
                <ValidationResultStep
                  serialNumber={form.getValues("serialNumber")}
                  cardCode={form.getValues("cardCode")}
                  giftDetails={giftDetails}
                  error={validationError}
                  isLoading={isLoading}
                  onRetry={handleRetryValidation}
                  onProceed={() => {
                    setDirection(1);
                    setStep(3);
                  }}
                />
              )}
            </motion.div>
          )}

          {/* Step 3: Phone Verification */}
          {!showSuccess && step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PhoneVerificationStep
                isLoading={isLoading}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            </motion.div>
          )}

          {/* Step 4: Summary & Confirmation */}
          {!showSuccess && step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SummaryStep
                isLoading={isLoading}
                giftDetails={giftDetails}
                detectedNetwork={detectedNetwork}
                onPrev={handlePrevStep}
                onSubmit={onSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
}
