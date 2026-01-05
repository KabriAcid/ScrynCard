import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { RedemptionSchema, RedemptionFormValues } from "./redemption/schema";
import { GiftVerificationStep } from "./redemption/GiftVerificationStep";
import { PhoneVerificationStep } from "./redemption/PhoneVerificationStep";
import { ConfirmationStep } from "./redemption/ConfirmationStep";
import { SuccessConfirmation } from "./redemption/SuccessConfirmation";
import { useCitizenStore } from "@/stores/citizenStore";

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1); // Form step (1-3)
  const [giftDetails, setGiftDetails] = useState<any>(null);
  const [submittedValues, setSubmittedValues] =
    useState<RedemptionFormValues | null>(null);
  const redeemGift = useCitizenStore((state) => state.redeemGift);

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(RedemptionSchema),
    mode: "onChange",
    defaultValues: {
      giftCode: "",
      phoneNumber: "",
    },
  });

  // Store gift details when verified
  const handleGiftVerified = (details: any) => {
    setGiftDetails(details);
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStep((prev) => (prev < 3 ? prev + 1 : prev));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to proceed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const onSubmit = async (values: RedemptionFormValues) => {
    setIsLoading(true);
    try {
      const result = await redeemGift(values.giftCode, values.phoneNumber);
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

  const handleSuccessComplete = () => {
    form.reset();
    setShowSuccess(false);
    setStep(1);
    setGiftDetails(null);
    navigate("/");
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

          {/* Step 1: Verify Gift */}
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

          {/* Step 2: Phone Verification */}
          {!showSuccess && step === 2 && (
            <motion.div
              key="step-2"
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

          {/* Step 3: Confirmation */}
          {!showSuccess && step === 3 && (
            <motion.div
              key="step-3"
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
