import { Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "./schema";
import { FormGrid, GlassCard, StepHeader } from "./shared";

interface ContactDetailsStepProps {
  form: UseFormReturn<OrderFormValues>;
  onNext: () => void;
  onPrev: () => void;
}

export function ContactDetailsStep({ form, onNext, onPrev }: ContactDetailsStepProps) {
  return (
    <section className="order-step">
      <StepHeader icon={UserRound} title="Contact details" description="We will email your payment instructions here." step={3} totalSteps={6} />
      <GlassCard className="order-business-panel">
        <FormGrid>
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl><div className="order-icon-field"><UserRound aria-hidden="true" /><Input autoComplete="name" placeholder="Your full name" {...field} /></div></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl><div className="order-icon-field"><Mail aria-hidden="true" /><Input type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" {...field} /></div></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormGrid>
      </GlassCard>
      <div className="order-step-actions">
        <Button type="button" variant="outline" onClick={onPrev} className="order-secondary-button">Back</Button>
        <Button type="button" onClick={onNext} className="order-primary-button">Continue</Button>
      </div>
    </section>
  );
}
