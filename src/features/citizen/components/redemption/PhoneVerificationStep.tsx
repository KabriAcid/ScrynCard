import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { StepHeader } from "../order/shared";
import { RedemptionFormValues } from "./schema";
import { NetworkDetector } from "@/lib/operators";
import { Badge } from "@/components/ui/badge";
import { PhoneFormatter } from "@/lib/formatters";

interface PhoneVerificationStepProps {
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function PhoneVerificationStep({
  isLoading,
  onNext,
  onPrev,
}: PhoneVerificationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const phoneNumber = form.watch("phoneNumber");
  const [detectionResult, setDetectionResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleNext = async () => {
    const isValid = await form.trigger(["phoneNumber"]);
    if (isValid) {
      onNext();
    }
  };

  // Detect operator in real-time
  React.useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 10) {
      // Clean the phone number by removing hyphens before detection
      const cleanedPhone = phoneNumber.replace(/-/g, "");
      const result = NetworkDetector.detect(cleanedPhone);
      if (result.isValid) {
        setDetectionResult(result);
        setError(null);
      } else {
        setDetectionResult(null);
        setError(result.errorMessage || "Invalid phone number format");
      }
    } else {
      setDetectionResult(null);
      setError(null);
    }
  }, [phoneNumber]);

  return (
    <div className="space-y-6">
      <StepHeader
        icon={Phone}
        title="Recipient Phone Number"
        description="Enter the phone number where you want to receive your gift"
        step={3}
        totalSteps={4}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="0703 123 4567"
                    maxLength={11}
                    {...field}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading || !phoneNumber}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
