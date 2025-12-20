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
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

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
      setStep((prev) => (prev < 5 ? ((prev + 1) as 1 | 2 | 3 | 4 | 5) : prev));
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
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4 | 5) : prev));
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
        {/* Step Indicator */}
        <StepIndicator currentStep={step} totalSteps={5} />

        {/* Steps Container */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <CardVerificationStep
              key="step-1"
              isLoading={isLoading}
              cardValid={cardValid}
              onCardValid={onValidChange}
              onNext={handleNextStep}
            />
          )}

          {step === 2 && (
            <PersonalDetailsStep
              key="step-2"
              form={form}
              isLoading={isLoading}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {step === 3 && (
            <LocationStep
              key="step-3"
              form={form}
              isLoading={isLoading}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {step === 4 && (
            <PartySelectionStep
              key="step-4"
              form={form}
              isLoading={isLoading}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {step === 5 && (
            <BankDetailsStep
              key="step-5"
              form={form}
              isLoading={isLoading}
              onSubmit={form.handleSubmit(onSubmit)}
              onPrev={handlePrevStep}
            />
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
}
