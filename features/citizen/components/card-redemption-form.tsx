import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { RedemptionSchema, RedemptionFormValues } from "./redemption/schema";
import { CardVerificationStep } from "./redemption/CardVerificationStep";
import { PersonalDetailsStep } from "./redemption/PersonalDetailsStep";
import { LocationStep } from "./redemption/LocationStep";
import { PartySelectionStep } from "./redemption/PartySelectionStep";
import { BankDetailsStep } from "./redemption/BankDetailsStep";
import { StepIndicator } from "./redemption/StepIndicator";

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0); // 0 = card verification, 1-4 = form steps

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(RedemptionSchema),
    mode: "onChange",
    defaultValues: {
      serialNumber: "",
      cardCode: "",
      accountName: "",
      email: "",
      phone: "",
      nin: "",
      dob: "",
      state: "",
      lga: "",
      ward: "",
      favoriteParty: "",
      hasVotersCard: false,
      bankName: "",
      accountNumber: "",
      bvn: "",
    },
  });

  const onValidChange = (
    isValid: boolean,
    data?: { serial: string; code: string }
  ) => {
    setCardValid(isValid);
    if (isValid && data) {
      form.setValue("serialNumber", data.serial);
      form.setValue("cardCode", data.code);
    }
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep((prev) => (prev < 4 ? ((prev + 1) as 0 | 1 | 2 | 3 | 4) : prev));
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
    setStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1 | 2 | 3 | 4) : prev));
  };

  const onSubmit = async (values: RedemptionFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: `Card ****${values.serialNumber.slice(
          -2
        )} redeemed successfully. Check your account.`,
      });

      form.reset();
      setCardValid(false);
      setStep(1);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to redeem card. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* Card Verification - Standalone Step (Step 0) */}
        {!cardValid && (
          <CardVerificationStep
            isLoading={isLoading}
            cardValid={cardValid}
            onCardValid={onValidChange}
            onNext={() => {
              setCardValid(true);
              setStep(1);
            }}
          />
        )}

        {/* Main Form Steps - Only show if card is valid */}
        {cardValid && (
          <>
            {/* Step Indicator for form steps (1-4) */}
            <StepIndicator currentStep={step} totalSteps={4} />

            {/* Steps Container */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <PersonalDetailsStep
                  key="step-1"
                  form={form}
                  isLoading={isLoading}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                />
              )}

              {step === 2 && (
                <LocationStep
                  key="step-2"
                  form={form}
                  isLoading={isLoading}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                />
              )}

              {step === 3 && (
                <PartySelectionStep
                  key="step-3"
                  form={form}
                  isLoading={isLoading}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                />
              )}

              {step === 4 && (
                <BankDetailsStep
                  key="step-4"
                  form={form}
                  isLoading={isLoading}
                  onSubmit={form.handleSubmit(onSubmit)}
                  onPrev={handlePrevStep}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </form>
    </Form>
  );
}
