import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "./schema";
import { FormGrid, GlassCard, StepHeader } from "./shared";

interface PersonalDetailsStepProps {
  form: UseFormReturn<OrderFormValues>;
  onNext: () => void;
}

export function PersonalDetailsStep({ form, onNext }: PersonalDetailsStepProps) {
  return (
    <section className="order-step">
      <StepHeader icon={Building2} title="Business details" description="Tell us about your business." step={2} totalSteps={6} />
      <GlassCard className="order-business-panel">
        <FormGrid>
          <FormField control={form.control} name="businessName" render={({ field }) => (
            <FormItem>
              <FormLabel>Business name</FormLabel>
              <FormControl><Input placeholder="Your business name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="businessType" render={({ field }) => (
            <FormItem>
              <FormLabel>Business type</FormLabel>
              <FormControl><Input placeholder="For example, retail or hospitality" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormGrid>
      </GlassCard>
      <div className="order-step-actions order-step-actions--single">
        <Button type="button" onClick={onNext} className="order-primary-button">Continue</Button>
      </div>
    </section>
  );
}
