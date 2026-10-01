import { ClipboardCheck, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues, calculateOrderTotals, denominations, PRINTING_COST_PER_CARD } from "./schema";
import { formatCurrency } from "@/lib/utils";
import { StepHeader } from "./shared";

interface OrderReviewStepProps {
  form: UseFormReturn<OrderFormValues>;
  isLoading: boolean;
  onPrev: () => void;
}

function InvoiceRow({ label, value, strong = false }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <div className={`order-invoice-row${strong ? " is-strong" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function OrderReviewStep({ form, isLoading, onPrev }: OrderReviewStepProps) {
  const values = form.watch();
  const totals = calculateOrderTotals(values.orderItems || []);

  return (
    <section className="order-step">
      <StepHeader
        icon={ClipboardCheck}
        title="Review your order"
        description="Check the details and total before placing your order."
        step={6}
        totalSteps={6}
      />

      <section className="order-invoice" aria-label="Order invoice">
        <div className="order-invoice-heading">
          <div>
            <p>ORDER INVOICE</p>
            <h3>{values.businessName || "Business order"}</h3>
          </div>
          <span>{totals.totalCards.toLocaleString()} cards</span>
        </div>

        <dl className="order-invoice-details">
          <InvoiceRow label="Business type" value={values.businessType || "-"} />
          <InvoiceRow label="Contact person" value={values.fullName || "-"} />
          <InvoiceRow label="NIN" value={values.nin || "-"} />
          <InvoiceRow label="Delivery location" value={[values.lga, values.state].filter(Boolean).join(", ") || "-"} />
        </dl>

        <dl className="order-invoice-lines">
          {values.orderItems?.map((item) => {
            const product = denominations.find((denom) => denom.id === item.denomination);
            const quantity = Number(item.quantity) || 0;
            return (
              <InvoiceRow
                key={item.denomination}
                label={`${product?.label || "Card"} x ${quantity}`}
                value={formatCurrency((product?.value || 0) * quantity)}
              />
            );
          })}
        </dl>

        <dl className="order-invoice-totals">
          <InvoiceRow label="Card value" value={formatCurrency(totals.cardValue)} />
          <InvoiceRow label={`Printing (${totals.totalCards} x ${formatCurrency(PRINTING_COST_PER_CARD)})`} value={formatCurrency(totals.printingCost)} />
          <InvoiceRow label="Total due" value={formatCurrency(totals.totalToPay)} strong />
        </dl>
      </section>

      <p className="order-inline-note">After placing your order, we will send payment details to complete checkout.</p>

      <div className="order-step-actions">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isLoading} className="order-secondary-button">
          Back
        </Button>
        <Button type="submit" disabled={isLoading} className="order-primary-button">
          {isLoading ? <><LoaderCircle className="animate-spin" aria-hidden="true" /> Placing order...</> : "Place order"}
        </Button>
      </div>
    </section>
  );
}
