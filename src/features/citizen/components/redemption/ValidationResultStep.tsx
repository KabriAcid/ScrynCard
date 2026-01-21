import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, CreditCard } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ValidationResultStepProps {
  serialNumber: string;
  cardCode: string;
  giftDetails: {
    giftType: string;
    amount?: number;
    dataSize?: number;
  };
  error?: {
    message: string;
    code: string;
    details: string | null;
  } | null;
  isLoading?: boolean;
  onRetry: () => void;
  onProceed: () => void;
}

export function ValidationResultStep({
  serialNumber,
  cardCode,
  giftDetails,
  error,
  isLoading = false,
  onRetry,
  onProceed,
}: ValidationResultStepProps) {
  const [showResult, setShowResult] = React.useState(false);
  const [displayError, setDisplayError] = React.useState(error);

  React.useEffect(() => {
    // Show spinner for 2 seconds, then display result
    const timer = setTimeout(() => {
      setShowResult(true);
      if (error) {
        setDisplayError(error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!showResult) {
    // Spinner state
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Processing Card</h2>
          <p className="text-muted-foreground mt-1">
            Validating your card details...
          </p>
        </div>

        <Card className="p-12">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Spinner size="lg" className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary text-lg">
                Verifying Card
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Please wait while we validate your card...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Success state
  if (!displayError && giftDetails) {
    return (
      <div className="space-y-6">
        {/* Success Message Card */}
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 text-lg">
                  Validation Successful!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Your card details have been verified and confirmed.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card Details Display */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Card Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Serial Number</p>
                <p className="font-mono font-semibold">{serialNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Card Code</p>
                <p className="font-mono font-semibold text-sm">{cardCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gift Type</p>
                <p className="font-semibold capitalize">
                  {giftDetails.giftType}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="font-semibold">
                  {giftDetails.giftType === "data"
                    ? `${giftDetails.dataSize || "N/A"} MB`
                    : `₦${(giftDetails.amount || 0).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            disabled={isLoading}
            className="flex-1"
          >
            Use Different Card
          </Button>
          <Button
            type="button"
            onClick={onProceed}
            disabled={isLoading}
            className="flex-1"
          >
            Proceed
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Validation Failed</h2>
        <p className="text-muted-foreground mt-1">
          We couldn't verify your card. Please try again.
        </p>
      </div>

      {/* Error Message Card */}
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">
                {displayError?.message || "Card verification failed"}
              </p>
              {displayError?.details && (
                <p className="text-sm text-red-700 mt-2">
                  {displayError.details}
                </p>
              )}
              <p className="text-xs text-red-600 mt-2 font-mono">
                Error code: {displayError?.code || "UNKNOWN"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Card Details for Reference */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Card Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-mono font-semibold">{serialNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Card Code</p>
              <p className="font-mono font-semibold text-sm">{cardCode}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="flex-1"
        >
          Try Again
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onProceed}
          disabled={isLoading}
          className="flex-1"
        >
          Use Different Card
        </Button>
      </div>
    </div>
  );
}
