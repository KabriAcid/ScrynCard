import { DollarSign, TrendingUp, Printer, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PaymentDetails {
  cardValue: number;
  serviceFee: number;
  printingCost: number;
  totalPaid: number;
  serviceFeeRate: number;
}

interface PaymentDetailsSectionProps {
  paymentDetails: PaymentDetails;
}

export function PaymentDetailsSection({
  paymentDetails,
}: PaymentDetailsSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        Payment Details
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Value
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(paymentDetails.cardValue)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Service Fee ({(paymentDetails.serviceFeeRate * 100).toFixed(0)}%)
            </p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(paymentDetails.serviceFee)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Printing Cost
            </p>
            <p className="text-xl font-semibold text-muted-foreground">
              {formatCurrency(paymentDetails.printingCost)}
            </p>
          </div>
          <div className="space-y-1 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <p className="text-sm text-muted-foreground font-medium">
              Total Amount to Pay
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(paymentDetails.totalPaid)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Payment Breakdown:</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Card Value:</span>
              <span className="font-medium text-foreground">
                {formatCurrency(paymentDetails.cardValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee (15%):</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                + {formatCurrency(paymentDetails.serviceFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Printing Cost:</span>
              <span className="font-medium text-foreground">
                + {formatCurrency(paymentDetails.printingCost)}
              </span>
            </div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex justify-between text-base font-bold">
              <span>Total to Wire:</span>
              <span className="text-primary">
                {formatCurrency(paymentDetails.totalPaid)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
