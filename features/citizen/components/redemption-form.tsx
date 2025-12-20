import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader } from "lucide-react";
import { useCitizenStore } from "@/stores/citizenStore";
import { citizenService } from "@/services/mockService";

export function RedemptionForm() {
  const { validateCard, redeemCard, isLoading, error, currentRedemption } =
    useCitizenStore();

  const [step, setStep] = useState<"validation" | "redemption" | "success">(
    "validation"
  );
  const [formData, setFormData] = useState({
    cardCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    bvn: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.cardCode.trim()) {
      setValidationError("Please enter a card code");
      return;
    }

    try {
      const response = await citizenService.validateCard(formData.cardCode);
      if (response.success) {
        setStep("redemption");
      } else {
        setValidationError(response.error || "Invalid card code");
      }
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.accountName
    ) {
      setValidationError("Please fill in all bank details");
      return;
    }

    try {
      await redeemCard(formData.cardCode, {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      });
      setStep("success");
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Card Validation
  if (step === "validation") {
    return (
      <form onSubmit={handleValidateCard} className="space-y-6">
        {validationError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="cardCode">Scratch Card Code</Label>
          <Input
            id="cardCode"
            name="cardCode"
            placeholder="e.g., APC-5K-B001-A3F7B9C2-X7"
            value={formData.cardCode}
            onChange={handleInputChange}
            disabled={isLoading}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Enter the full code from your scratch card
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            "Validate Card"
          )}
        </Button>
      </form>
    );
  }

  // Step 2: Redemption Details
  if (step === "redemption") {
    return (
      <form onSubmit={handleRedeem} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-secondary/50 border-0">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Card Code</p>
                <p className="font-mono font-semibold">{formData.cardCode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  You will receive
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₦5,000 (estimated)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="accountName">Account Holder Name</Label>
          <Input
            id="accountName"
            name="accountName"
            placeholder="e.g., John Doe"
            value={formData.accountName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            placeholder="e.g., Zenith Bank, GTBank"
            value={formData.bankName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            placeholder="e.g., 1234567890"
            value={formData.accountNumber}
            onChange={handleInputChange}
            disabled={isLoading}
            type="tel"
          />
        </div>

        <div className="grid gap-3 grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("validation")}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Redeem Card"
            )}
          </Button>
        </div>
      </form>
    );
  }

  // Step 3: Success
  if (step === "success" && currentRedemption) {
    const isApproved = currentRedemption.status === "processing";

    return (
      <div className="space-y-6">
        <Alert className={isApproved ? "bg-green-50 border-green-200" : ""}>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription
            className={isApproved ? "text-green-800" : "text-red-800"}
          >
            {isApproved
              ? "Card redeemed successfully! Your transfer is being processed."
              : "Your redemption is under review for security purposes."}
          </AlertDescription>
        </Alert>

        <Card className="bg-secondary/50 border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Redemption ID</p>
                <p className="font-mono font-semibold text-sm">
                  {currentRedemption.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">
                  ₦{currentRedemption.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="capitalize font-semibold">
                  {currentRedemption.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account</p>
                <p className="font-mono text-sm">
                  {currentRedemption.accountName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-blue-900">
            📱 Check your phone
          </p>
          <p className="text-xs text-blue-800">
            {isApproved
              ? "You'll receive an SMS when the money arrives in your account (usually within 30 minutes)."
              : "Our security team is reviewing your redemption. This usually takes 2-4 hours."}
          </p>
        </div>

        <Button className="w-full" asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }

  return null;
}
