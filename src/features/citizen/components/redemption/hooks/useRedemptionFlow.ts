import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCitizenStore } from "@/stores/citizenStore";
import { RedemptionSchema, RedemptionFormValues } from "../schema";

export function useRedemptionFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);
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
          setStep(2);
        } else {
          setValidationError({
            message: result.error || "Invalid card code",
            code: (result as any).errorCode || "VERIFICATION_FAILED",
            details: (result as any).details || null,
          });
          setGiftDetails(null);
          setDirection(1);
          setStep(2);
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

  return {
    form,
    step,
    direction,
    isLoading,
    showSuccess,
    giftDetails,
    validationError,
    submittedValues,
    handleNextStep,
    handleRetryValidation,
    handlePrevStep,
    handleSuccessComplete,
    onSubmit,
  };
}
