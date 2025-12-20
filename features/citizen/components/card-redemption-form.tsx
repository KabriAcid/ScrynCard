import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { RedemptionSchema, RedemptionFormValues } from "./redemption/schema";
import { CardVerificationStep } from "./redemption/CardVerificationStep";
import { PersonalDetailsStep } from "./redemption/PersonalDetailsStep";
import { LocationStep } from "./redemption/LocationStep";
import { PartySelectionStep } from "./redemption/PartySelectionStep";
import { BankDetailsStep } from "./redemption/BankDetailsStep";
import { StepIndicator } from "./redemption/StepIndicator";
import { SuccessConfirmation } from "./redemption/SuccessConfirmation";

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false); // Show spinner after button click
  const [showForm, setShowForm] = useState(false); // Control form visibility after spinner
  const [showSuccess, setShowSuccess] = useState(false); // Show success screen after submission
  const [step, setStep] = useState(1); // Start at 1, only shown when cardValid is true
  const [submittedValues, setSubmittedValues] =
    useState<RedemptionFormValues | null>(null);

  // Handle transition delay after button click (only show spinner when explicitly triggered)
  useEffect(() => {
    if (showSpinner && !showForm) {
      const timer = setTimeout(() => {
        setShowForm(true);
        setShowSpinner(false);
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSpinner, showForm]);

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
      setStep((prev) => (prev < 4 ? prev + 1 : prev));
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store values for success screen
      setSubmittedValues(values);
      setShowSuccess(true);
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

  const handleSuccessComplete = () => {
    form.reset();
    setCardValid(false);
    setShowForm(false);
    setShowSuccess(false);
    setStep(1);
    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <AnimatePresence mode="wait">
          {/* Success Screen - Show after form submission */}
          {showSuccess && submittedValues && (
            <SuccessConfirmation
              values={submittedValues}
              onComplete={handleSuccessComplete}
            />
          )}

          {/* Card Verification - Standalone Step */}
          {!cardValid && !showSuccess && (
            <motion.div
              key="card-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardVerificationStep
                isLoading={isLoading}
                cardValid={cardValid}
                onCardValid={onValidChange}
                onNext={() => {
                  setIsLoading(true);
                  setCardValid(true);
                  setShowSpinner(true); // Trigger spinner after button click
                }}
              />
            </motion.div>
          )}

          {/* Loading Spinner - Show during transition */}
          {showSpinner && !showForm && !showSuccess && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Processing your card...</p>
              </div>
            </motion.div>
          )}

          {/* Main Form Steps - Only show if card is valid and transition is complete */}
          {showForm && !showSuccess && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
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
                    isFirstStep={true}
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
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
}
