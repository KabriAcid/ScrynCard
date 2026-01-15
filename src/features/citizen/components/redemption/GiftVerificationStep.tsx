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
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { RedemptionFormValues } from "./schema";
import { useCitizenStore } from "@/stores/citizenStore";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CardVerificationStepProps {
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
}: CardVerificationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const [verificationLoading, setVerificationLoading] = React.useState(false);
  const [cardDetails, setCardDetails] = React.useState<any>(null);
  const [error, setError] = React.useState<{
    message: string;
    code: string;
    details: string | null;
  } | null>(null);
  const validateGift = useCitizenStore((state) => state.validateGift);

  const serialNumber = form.watch("serialNumber");
  const cardCode = form.watch("cardCode");

  const handleVerifyCard = async () => {
    if (!serialNumber || !cardCode) {
      if (!serialNumber) {
        form.setError("serialNumber", {
          message: "Serial number is required",
        });
      }
      if (!cardCode) {
        form.setError("cardCode", {
          message: "Card code is required",
        });
      }
      return;
    }

    setVerificationLoading(true);
    setError(null);
    try {
      // Validate card code only (serial number is just for tracking on the card)
      const result = await validateGift(cardCode);
      if (result.success) {
        const giftDetails = {
          giftType: result.giftType,
          amount: result.amount,
          dataSize: result.dataSize,
          expiryDate: (result as any).expiryDate,
        };
        setCardDetails(giftDetails);
        setError(null);
        // Auto-advance to next step after successful verification
        setTimeout(() => {
          onNext();
        }, 800);
      } else {
        setError({
          message: result.error || "Invalid card code",
          code: (result as any).errorCode || "VERIFICATION_FAILED",
          details: (result as any).details || null,
        });
        setCardDetails(null);
      }
    } catch (err) {
      setError({
        message: "Failed to verify card. Please try again.",
        code: "VERIFICATION_ERROR",
        details: err instanceof Error ? err.message : null,
      });
      setCardDetails(null);
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verify Your Card</h2>
        <p className="text-muted-foreground mt-1">
          Enter the serial number and card code from your scratch card
        </p>
      </div>

      <div className="space-y-4">
        {/* Serial Number & Card Code Fields - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Serial Number Field - Smaller on large screens */}
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SN-D93F93"
                    maxLength={9}
                    {...field}
                    disabled={verificationLoading}
                    className="font-mono uppercase"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.value.length}/9 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Card Code Field - Larger on large screens */}
          <FormField
            control={form.control}
            name="cardCode"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Card Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="WSO-D939-39DX-39DK"
                    maxLength={18}
                    {...field}
                    disabled={verificationLoading}
                    className="font-mono uppercase"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.value.length}/18 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {verificationLoading && (
          <Card className="p-8 bg-blue-50 border-blue-200">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Verifying Card</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Please wait while we verify your card details...
                </p>
              </div>
              <div className="text-xs text-blue-600 font-mono pt-2">
                <p>{serialNumber}</p>
                <p>{cardCode}</p>
              </div>
            </div>
          </Card>
        )}

        {cardDetails && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <p className="font-semibold text-green-900">Card Verified!</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold capitalize">
                    {cardDetails.giftType || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Value</p>
                  <p className="font-semibold">
                    {cardDetails.giftType === "data"
                      ? `${cardDetails.dataSize || "N/A"}MB`
                      : `₦${(cardDetails.amount || 0).toLocaleString()}`}
                  </p>
                </div>
                {cardDetails.expiryDate && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Expiry Date</p>
                    <p className="font-semibold">
                      {new Date(cardDetails.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {!cardDetails && (
          <Button
            type="button"
            onClick={handleVerifyCard}
            disabled={verificationLoading || !serialNumber || !cardCode}
            className="w-full"
          >
            {verificationLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify Card
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
      </div>
    </div>
  );
}
