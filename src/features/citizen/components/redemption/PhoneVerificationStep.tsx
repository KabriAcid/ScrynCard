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
import { Card } from "@/components/ui/card";
import { AlertCircle, Phone, Loader2 } from "lucide-react";
import { RedemptionFormValues } from "./schema";
import { NetworkDetector } from "@/lib/operators";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhoneVerificationStepProps {
  isLoading: boolean;
  onNext: () => Promise<void>;
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

  // Detect operator in real-time
  React.useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 10) {
      const result = NetworkDetector.detect(phoneNumber);
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

  const getOperatorColor = (operator: string) => {
    const colors: Record<string, string> = {
      MTN: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Airtel: "bg-red-100 text-red-800 border-red-300",
      Glo: "bg-green-100 text-green-800 border-green-300",
      "9Mobile": "bg-blue-100 text-blue-800 border-blue-300",
    };
    return colors[operator] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Phone Number</h2>
        <p className="text-muted-foreground mt-1">
          Enter the phone number to receive your airtime/data
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="0703 123 4567"
                  {...field}
                  disabled={isLoading}
                  className="text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {detectionResult && detectionResult.isValid && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold text-blue-900">Phone Verified</p>
                </div>
                <Badge
                  className={`text-xs font-semibold border ${getOperatorColor(
                    detectionResult.operator
                  )}`}
                >
                  {detectionResult.operator}
                </Badge>
              </div>
              <div className="text-sm space-y-2 text-blue-900">
                <p>
                  <span className="font-semibold">Formatted:</span>{" "}
                  {detectionResult.phoneNumber}
                </p>
                <p className="text-xs text-blue-700">
                  Your gift will be sent to this {detectionResult.operator}{" "}
                  number
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

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
          onClick={onNext}
          disabled={!detectionResult?.isValid || isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Review & Confirm
        </Button>
      </div>
    </div>
  );
}
