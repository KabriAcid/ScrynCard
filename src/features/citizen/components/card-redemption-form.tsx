import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { RedemptionSchema, RedemptionFormValues } from "./redemption/schema";
import { GiftVerificationStep } from "./redemption/GiftVerificationStep";
import { ValidationResultStep } from "./redemption/ValidationResultStep";
import { PhoneVerificationStep } from "./redemption/PhoneVerificationStep";
import { ConfirmationStep } from "./redemption/ConfirmationStep";
import { SuccessConfirmation } from "./redemption/SuccessConfirmation";
import { useCitizenStore } from "@/stores/citizenStore";

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1); // Form step (1-4: CardVerification, ValidationResult, Phone, Confirmation)
  const [giftDetails, setGiftDetails] = useState<any>(null);
  const [validationError, setValidationError] = useState<any>(null);
  const [submittedValues, setSubmittedValues] =
    useState<RedemptionFormValues | null>(null);
  const redeemGift = useCitizenStore((state) => state.redeemGift);
  const validateGift = useCitizenStore((state) => state.validateGift);

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(RedemptionSchema),
    mode: "onChange",
    defaultValues: {
      serialNumber: "",
      cardCode: "",
      phoneNumber: "",
    },
  });

  const handleNextStep = async () => {
    // If we're on step 1 (Card Verification), validate the card first
    if (step === 1) {
      const cardCode = form.getValues("cardCode");
      setIsLoading(true);
      try {
        const result = await validateGift(cardCode);
        if (result.success) {
          const details = {
            giftType: result.giftType,
            amount: result.amount,
            dataSize: result.dataSize,
            expiryDate: (result as any).expiryDate,
          };
          setGiftDetails(details);
          setValidationError(null);
          setStep(2); // Move to validation result step
        } else {
          setValidationError({
            message: result.error || "Invalid card code",
            code: (result as any).errorCode || "VERIFICATION_FAILED",
            details: (result as any).details || null,
          });
          setGiftDetails(null);
          setStep(2); // Still show validation result step with error
        }
      } catch (error) {
        setValidationError({
          message: "Failed to verify card. Please try again.",
          code: "VERIFICATION_ERROR",
          details: error instanceof Error ? error.message : null,
        });
        setGiftDetails(null);
        setStep(2);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For other steps, just move forward
      setStep((prev) => (prev < 4 ? prev + 1 : prev));
    }
  };

  const handleRetryValidation = () => {
    // Go back to card verification step
    setStep(1);
    setGiftDetails(null);
    setValidationError(null);
  };

  const handlePrevStep = () => {
    if (step === 2) {
      // From validation result, go back to card verification
      setStep(1);
      setGiftDetails(null);
      setValidationError(null);
    } else {
      setStep((prev) => (prev > 1 ? prev - 1 : prev));
    }
  };

  const handleSuccessComplete = () => {
    form.reset();
    setShowSuccess(false);
    setStep(1);
    setGiftDetails(null);
    setValidationError(null);
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
        <AnimatePresence mode="wait">
          {/* Success Screen */}
          {showSuccess && submittedValues && (
            <SuccessConfirmation
              values={submittedValues}
              giftDetails={giftDetails}
              onComplete={handleSuccessComplete}
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
                onNext={handleNextStep}
                onPrev={handlePrevStep}
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
                onRetry={handleRetryValidation}
                onProceed={() => setStep(3)}
              />
            </motion.div>
          )}

          {/* Step 3: Phone Verification */}
          {!showSuccess && step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PhoneVerificationStep
                isLoading={isLoading}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {!showSuccess && step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ConfirmationStep
                isLoading={isLoading}
                giftDetails={giftDetails}
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
