import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, CreditCard, Phone, User, FileText } from "lucide-react";
import { RedemptionFormValues } from "./schema";
import { Badge } from "@/components/ui/badge";

interface SummaryStepProps {
  isLoading: boolean;
  giftDetails?: {
    giftType: string;
    amount?: number;
    dataSize?: number;
  } | null;
  detectedNetwork?: string;
  onPrev: () => void;
  onSubmit: (values: RedemptionFormValues) => Promise<void>;
}

export function SummaryStep({
  isLoading,
  giftDetails,
  detectedNetwork,
  onPrev,
  onSubmit,
}: SummaryStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const values = form.getValues();

  const handleSubmit = async () => {
    await onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review & Confirm</h2>
        <p className="text-muted-foreground mt-1">
          Please review your information before confirming
        </p>
      </div>

      {/* Personal Information Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Personal Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">NIN</p>
              <p className="font-semibold font-mono">{values.nin}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Occupation</p>
              <Badge variant="secondary">{values.occupation}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Card Information Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Card Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-mono font-semibold">{values.serialNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Card Code</p>
              <p className="font-mono font-semibold text-sm">
                {values.cardCode}
              </p>
            </div>
          </div>

          {/* Gift Details */}
          {giftDetails && (
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gift Type</p>
                  <Badge>{giftDetails.giftType}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-semibold">
                    {giftDetails.giftType === "data"
                      ? `${giftDetails.dataSize} MB`
                      : `₦${(giftDetails.amount || 0).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Phone Information Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Contact Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-mono font-semibold">{values.phoneNumber}</p>
            </div>
            {detectedNetwork && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Network Operator
                </p>
                <Badge variant="outline">{detectedNetwork}</Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Confirmation Message */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Ready to redeem</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Confirm Redemption" to complete your gift redemption
            </p>
          </div>
        </div>
      </Card>

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
          onClick={handleSubmit}
          disabled={isLoading}
          isLoading={isLoading}
          className="flex-1"
        >
          Confirm Redemption
        </Button>
      </div>
    </div>
  );
}
