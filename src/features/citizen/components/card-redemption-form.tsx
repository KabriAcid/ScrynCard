import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { CheckCircle, CreditCard, User, Phone, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RedemptionSchema,
  RedemptionFormValues,
  STEPS,
} from "./redemption/schema";
import { GiftVerificationStep } from "./redemption/GiftVerificationStep";
import { ValidationResultStep } from "./redemption/ValidationResultStep";
import { BioDataStep } from "./redemption/BioDataStep";
import { PhoneVerificationStep } from "./redemption/PhoneVerificationStep";
import { ConfirmationStep } from "./redemption/ConfirmationStep";
import { SuccessConfirmation } from "./redemption/SuccessConfirmation";
import { useCitizenStore } from "@/stores/citizenStore";

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1); // Form step (1-5: CardVerification, ValidationResult, BioData, Phone, Confirmation)
  const [direction, setDirection] = useState(1);
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
      nin: "",
      occupation: "",
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
          };
          setGiftDetails(details);
          setValidationError(null);
          setDirection(1);
          setStep(2); // Move to validation result step
        } else {
          setValidationError({
            message: result.error || "Invalid card code",
            code: (result as any).errorCode || "VERIFICATION_FAILED",
            details: (result as any).details || null,
          });
          setGiftDetails(null);
          setDirection(1);
          setStep(2); // Still show validation result step with error
        }
      } catch (error) {
        setValidationError({
          message: "Failed to verify card. Please try again.",
          code: "VERIFICATION_ERROR",
          details: error instanceof Error ? error.message : null,
        });
        setGiftDetails(null);
        setDirection(1);
        setStep(2);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For other steps, just move forward
      setDirection(1);
      setStep((prev) => (prev < 5 ? prev + 1 : prev));
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
      setDirection(-1);
      setStep(1);
      setGiftDetails(null);
      setValidationError(null);
    } else {
      setDirection(-1);
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
        {/* Step Indicators - Only show when not on success screen or validation result step */}
        {!showSuccess && step !== 2 && (
          <div className="flex items-center justify-center space-x-4">
            {[
              { id: 1, title: "Card", icon: CreditCard, stepNumber: 1 },
              { id: 2, title: "Biodata", icon: User, stepNumber: 3 },
              { id: 3, title: "Phone", icon: Phone, stepNumber: 4 },
              { id: 4, title: "Confirm", icon: FileCheck, stepNumber: 5 },
            ].map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-colors border-2",
                      step > s.stepNumber
                        ? "bg-primary border-primary text-primary-foreground"
                        : "",
                      step === s.stepNumber
                        ? "border-primary text-primary"
                        : "border-border bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s.stepNumber ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <s.icon className="h-6 w-6" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm text-center",
                      step === s.stepNumber
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {s.title}
                  </p>
                </div>
                {index < 3 && (
                  <div className="flex-1 mt-[-20px] border-t-2 border-dashed border-border" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
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
                onProceed={() => {
                  setDirection(1);
                  setStep(3);
                }}
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
              <BioDataStep
                isLoading={isLoading}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
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
                onNext={handleNextStep}
                onPrev={handlePrevStep}
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
