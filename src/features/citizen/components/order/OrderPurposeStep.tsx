import { useState } from "react";
import { Briefcase, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "./schema";
import { StepHeader } from "./shared";

interface OrderPurposeStepProps {
  form: UseFormReturn<OrderFormValues>;
  onNext: () => void;
}

export function OrderPurposeStep({ form, onNext }: OrderPurposeStepProps) {
  const [marriageSelected, setMarriageSelected] = useState(false);
  const selectedPurpose = form.watch("purpose");

  const chooseBusiness = () => {
    form.setValue("purpose", "business", { shouldValidate: true });
    setMarriageSelected(false);
    onNext();
  };

  return (
    <section className="order-step">
      <StepHeader
        icon={Briefcase}
        title="What are you ordering for?"
        description="Choose a card style to get started."
        step={1}
        totalSteps={6}
      />

      <div className="order-purpose-grid">
        <button
          type="button"
          onClick={chooseBusiness}
          aria-pressed={selectedPurpose === "business"}
          className="order-purpose-option"
        >
          <span className="order-purpose-icon"><Briefcase aria-hidden="true" /></span>
          <span className="order-purpose-copy">
            <strong>Business cards</strong>
            <span>Branded rewards for your customers and team.</span>
          </span>
          <ArrowRight className="order-purpose-arrow" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            form.setValue("purpose", "marriage");
            setMarriageSelected(true);
          }}
          aria-pressed={selectedPurpose === "marriage"}
          className="order-purpose-option"
        >
          <span className="order-purpose-icon order-purpose-icon--warm"><Heart aria-hidden="true" /></span>
          <span className="order-purpose-copy">
            <strong>Marriage cards</strong>
            <span>Thoughtful keepsakes for your celebration.</span>
          </span>
          <span className="order-purpose-tag">Coming soon</span>
        </button>
      </div>

      {marriageSelected && (
        <p className="order-inline-note" role="status">
          Marriage cards are coming soon. Business card ordering is available now.
        </p>
      )}

      <div className="order-step-actions order-step-actions--single">
        <Button type="button" onClick={chooseBusiness} className="order-primary-button">
          Continue with business <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
