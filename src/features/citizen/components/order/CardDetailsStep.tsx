import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ArrowLeft, ArrowRight, CreditCard, Minus, Plus, Smartphone, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OrderFormValues, denominations, dataProducts, airtimeProducts } from "./schema";
import { formatCurrency } from "@/lib/utils";
import { StepHeader } from "./shared";

interface CardDetailsStepProps {
  form: UseFormReturn<OrderFormValues>;
  onPrev: () => void;
  onNext: () => void;
}

export function CardDetailsStep({ form, onPrev, onNext }: CardDetailsStepProps) {
  const [activeTab, setActiveTab] = useState<"data" | "airtime">("data");
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "orderItems",
    keyName: "customId",
  });
  const selectedDenoms = new Set(fields.map((item) => item.denomination));
  const products = activeTab === "data" ? dataProducts : airtimeProducts;
  const watchedItems = form.watch("orderItems") || [];
  const error = form.formState.errors.orderItems?.message || form.formState.errors.orderItems?.root?.message;

  const toggleProduct = (id: string) => {
    const index = fields.findIndex((item) => item.denomination === id);
    if (index >= 0) {
      remove(index);
      return;
    }
    append({ denomination: id as OrderFormValues["orderItems"][number]["denomination"], quantity: 10 });
  };

  const changeQuantity = (index: number, amount: number) => {
    const item = fields[index];
    const quantity = item.quantity + amount;
    if (quantity < 10) remove(index);
    else update(index, { denomination: item.denomination, quantity });
  };

  return (
    <section className="order-step">
      <StepHeader icon={CreditCard} title="Choose your rewards" description="Select the airtime and data cards you want to order." step={4} totalSteps={5} />

      <div className="order-tabs" role="tablist" aria-label="Reward type">
        <button type="button" role="tab" aria-selected={activeTab === "data"} onClick={() => setActiveTab("data")} className={`order-tab${activeTab === "data" ? " is-active" : ""}`}>
          <Wifi aria-hidden="true" /> Data
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "airtime"} onClick={() => setActiveTab("airtime")} className={`order-tab${activeTab === "airtime" ? " is-active" : ""}`}>
          <Smartphone aria-hidden="true" /> Airtime
        </button>
      </div>

      <div className="order-product-grid">
        {products.map((product) => {
          const selected = selectedDenoms.has(product.id);
          return (
            <button key={product.id} type="button" aria-pressed={selected} onClick={() => toggleProduct(product.id)} className={`order-product-option${selected ? " is-selected" : ""}`}>
              <span>{product.label}</span>
              <small>{formatCurrency(product.value)} value</small>
            </button>
          );
        })}
      </div>

      {fields.length > 0 && (
        <section className="order-quantity-section" aria-label="Card quantities">
          <div className="order-section-heading">
            <h3>Your cards</h3>
            <p>Use the controls to add cards in groups of 10.</p>
          </div>
          <div className="order-quantity-list">
            {fields.map((field, index) => {
              const product = denominations.find((item) => item.id === field.denomination);
              const item = watchedItems[index];
              const quantity = Number(item?.quantity) || 0;
              return (
                <div className="order-quantity-row" key={field.customId}>
                  <div className="order-quantity-product">
                    <strong>{product?.label}</strong>
                    <span>{quantity} cards - {formatCurrency((product?.value || 0) * quantity)}</span>
                  </div>
                  <div className="order-quantity-controls" aria-label={`${product?.label} quantity`}>
                    <button type="button" aria-label={`Remove 10 ${product?.label} cards`} onClick={() => changeQuantity(index, -10)} className="order-quantity-button"><Minus aria-hidden="true" /></button>
                    <span aria-live="polite" className="order-quantity-value">{quantity}</span>
                    <button type="button" aria-label={`Add 10 ${product?.label} cards`} onClick={() => changeQuantity(index, 10)} className="order-quantity-button"><Plus aria-hidden="true" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {error && <Alert variant="destructive" className="order-alert"><AlertDescription>{error}</AlertDescription></Alert>}
      <p className="order-inline-note">Minimum order value: {formatCurrency(800000)}.</p>

      <div className="order-step-actions">
        <Button type="button" variant="outline" onClick={onPrev} className="order-secondary-button"><ArrowLeft aria-hidden="true" /> Back</Button>
        <Button type="button" onClick={onNext} disabled={fields.length === 0} className="order-primary-button">Review order <ArrowRight aria-hidden="true" /></Button>
      </div>
    </section>
  );
}
