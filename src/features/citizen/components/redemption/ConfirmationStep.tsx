import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  CreditCard,
  Phone,
} from "lucide-react";
import { StepHeader } from "../order/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RedemptionFormValues } from "./schema";
import { useCitizenStore } from "@/stores/citizenStore";
import { NetworkDetector } from "@/lib/operators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ConfirmationStepProps {
  isLoading: boolean;
  giftDetails: any;
  onPrev: () => void;
  onSubmit: (values: RedemptionFormValues) => Promise<void>;
}

export function ConfirmationStep({
  isLoading,
  giftDetails,
  onPrev,
  onSubmit,
}: ConfirmationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const serialNumber = form.getValues("serialNumber");
  const cardCode = form.getValues("cardCode");
  const phoneNumber = form.getValues("phoneNumber");
  const detectionResult = NetworkDetector.detect(phoneNumber);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const values = form.getValues();
      await onSubmit(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to process redemption"
      );
    }
  };

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
      <StepHeader
        icon={FileCheck}
        title="Confirm Redemption"
        description="Review your details carefully before confirming your gift redemption"
        step={4}
        totalSteps={4}
      />

      <div className="space-y-4">
        {/* Card Details */}
        <Card className="p-4 border-2 border-border bg-accent/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Card Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase font-semibold">
                  Serial Number
                </p>
                <p className="font-mono font-bold">{serialNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-semibold">
                  Card Code
                </p>
                <p className="font-mono font-bold">{cardCode}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Type
                  </p>
                  <Badge className="w-fit capitalize mt-1">
                    {giftDetails?.giftType || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Value
                  </p>
                  <p className="font-semibold mt-1">
                    {giftDetails?.giftType === "data"
                      ? `${giftDetails?.dataSize || "N/A"}MB`
                      : `₦${(giftDetails?.amount || 0).toLocaleString()}`}
                  </p>
                </div>
              </div>
              {giftDetails?.expiryDate && (
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Expiry Date
                  </p>
                  <p className="font-semibold">
                    {new Date(giftDetails.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Phone Details */}
        <Card className="p-4 border-2 border-border bg-accent/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Recipient Phone
                </h3>
              </div>
              <Badge
                className={`text-xs font-semibold border ${getOperatorColor(
                  detectionResult.operator
                )}`}
              >
                {detectionResult.operator}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground font-semibold">
                  Number:
                </span>{" "}
                <span className="font-mono font-bold">
                  {detectionResult.phoneNumber}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Your {giftDetails?.giftType} will be sent to this number
              </p>
            </div>
          </div>
        </Card>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
          <p className="font-semibold flex items-center gap-2">
            <span>⚠️</span> Important
          </p>
          <p>
            By confirming, you're redeeming this {giftDetails?.giftType} gift to
            the phone number above. Make sure the number is correct.
          </p>
        </div>
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
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Processing..." : "Confirm & Redeem"}
        </Button>
      </div>
    </div>
  );
}
