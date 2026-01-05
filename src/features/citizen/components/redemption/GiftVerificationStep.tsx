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
import { AlertCircle, Gift, Loader2 } from "lucide-react";
import { RedemptionFormValues } from "./schema";
import { useCitizenStore } from "@/stores/citizenStore";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GiftVerificationStepProps {
  isLoading: boolean;
  onNext: () => Promise<void>;
  onPrev: () => void;
  isFirstStep?: boolean;
}

export function GiftVerificationStep({
  isLoading,
  onNext,
  onPrev,
  isFirstStep = false,
}: GiftVerificationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const [verificationLoading, setVerificationLoading] = React.useState(false);
  const [giftDetails, setGiftDetails] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const validateGift = useCitizenStore((state) => state.validateGift);

  const handleVerifyGift = async () => {
    const giftCode = form.getValues("giftCode");
    if (!giftCode) {
      form.setError("giftCode", {
        message: "Gift code is required",
      });
      return;
    }

    setVerificationLoading(true);
    setError(null);
    try {
      const result = await validateGift(giftCode);
      if (result.success && result.giftDetails) {
        setGiftDetails(result.giftDetails);
        setError(null);
      } else {
        setError(result.error || "Invalid gift code");
        setGiftDetails(null);
      }
    } catch (err) {
      setError("Failed to verify gift code");
      setGiftDetails(null);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleNext = async () => {
    if (!giftDetails) {
      setError("Please verify your gift code first");
      return;
    }
    await onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verify Your Gift</h2>
        <p className="text-muted-foreground mt-1">
          Enter the gift code from your scratch card
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="giftCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gift Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., MTN-5K-B001-A3F7B9C2-X7"
                  {...field}
                  disabled={verificationLoading}
                  className="font-mono"
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

        {giftDetails && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                <p className="font-semibold text-green-900">Gift Verified!</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold capitalize">
                    {giftDetails.giftType}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold">
                    {giftDetails.giftType === "data"
                      ? `${giftDetails.dataSize}MB`
                      : `₦${giftDetails.amount.toLocaleString()}`}
                  </p>
                </div>
                {giftDetails.expiryDate && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Expires</p>
                    <p className="font-semibold">
                      {new Date(giftDetails.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {!giftDetails && (
          <Button
            type="button"
            onClick={handleVerifyGift}
            disabled={verificationLoading || !form.getValues("giftCode")}
            className="w-full"
          >
            {verificationLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify Gift Code
          </Button>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading || verificationLoading}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleNext}
          disabled={!giftDetails || isLoading || verificationLoading}
          className={isFirstStep ? "w-full" : "flex-1"}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Next: Phone Number
        </Button>
      </div>
    </div>
  );
}
