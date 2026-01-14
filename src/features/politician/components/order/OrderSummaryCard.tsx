import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Loader2, Sparkles, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { OrderCalculations } from "./order-utils";

interface OrderSummaryCardProps {
  calculations: OrderCalculations;
  isSubmitting: boolean;
  hasItems: boolean;
  onSubmit?: () => void;
  submitLabel?: string;
  showPaymentInfo?: boolean;
}

export function OrderSummaryCard({
  calculations,
  isSubmitting,
  hasItems,
  onSubmit,
  submitLabel = "Place Order",
  showPaymentInfo = true,
}: OrderSummaryCardProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Units:</span>
            <span className="font-semibold">
              {calculations.totalCards.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Product Value:</span>
            <span className="font-semibold">
              {formatCurrency(calculations.cardValue)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee (15%):</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(calculations.serviceFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Processing Cost:</span>
            <span className="font-semibold">
              {formatCurrency(calculations.printingCost)}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="font-semibold">Total to Pay:</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculations.totalToPay)}
            </span>
          </div>
        </div>

        {onSubmit && (
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!hasItems || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {submitLabel}
              </>
            )}
          </Button>
        )}

        {showPaymentInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              After placing your order, you'll receive bank details to complete
              the payment. Your cards will be processed upon payment
              confirmation.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
