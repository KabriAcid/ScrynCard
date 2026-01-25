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
      <CardHeader className="pb-2.5 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ShoppingCart className="h-4 w-4" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 sm:space-y-3 px-2.5 sm:px-4">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Total Units:</span>
            <span className="font-semibold">
              {calculations.totalCards.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Product Value:</span>
            <span className="font-semibold">
              {formatCurrency(calculations.cardValue)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Service Fee (15%):</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(calculations.serviceFee)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Processing Cost:</span>
            <span className="font-semibold">
              {formatCurrency(calculations.printingCost)}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="text-xs sm:text-sm font-semibold">Total to Pay:</span>
            <span className="text-lg sm:text-xl font-bold text-primary">
              {formatCurrency(calculations.totalToPay)}
            </span>
          </div>
        </div>

        {onSubmit && (
          <Button
            type="submit"
            className="w-full text-xs sm:text-sm h-9 sm:h-10"
            disabled={!hasItems || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {submitLabel}
              </>
            )}
          </Button>
        )}

        {showPaymentInfo && (
          <Alert>
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <AlertDescription className="text-xs sm:text-xs">
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
