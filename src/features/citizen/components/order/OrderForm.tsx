import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, CreditCard, MapPin, User } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { OrderSchema, OrderFormValues, StepConfig } from "./schema";
import { OrderPurposeStep } from "./OrderPurposeStep";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { ContactLocationStep } from "./ContactLocationStep";
import { CardDetailsStep } from "./CardDetailsStep";
import { OrderReviewStep } from "./OrderReviewStep";

const STEPS: StepConfig[] = [
  { id: 1, title: "Purpose", description: "Choose a card type", fields: ["purpose"], icon: Briefcase },
  { id: 2, title: "Business details", description: "Tell us about your business", fields: ["businessName", "businessType", "fullName", "nin"], icon: User },
  { id: 3, title: "Delivery", description: "Where to deliver your order", fields: ["state", "lga"], icon: MapPin },
  { id: 4, title: "Rewards", description: "Choose card values and quantities", fields: ["orderItems"], icon: CreditCard },
];

const FORM_STORAGE_KEY = "scryn-order-form-v3";

export function OrderForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    mode: "onChange",
    defaultValues: {
      purpose: "business",
      businessName: "",
      businessType: "",
      fullName: "",
      nin: "",
      state: "",
      lga: "",
      orderItems: [],
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedState) {
        const { values, step: savedStep } = JSON.parse(savedState);
        form.reset({ ...form.getValues(), ...values });
        setStep(Math.min(Math.max(Number(savedStep) || 1, 1), 5));
      }
    } catch (error) {
      console.error("Failed to load saved order", error);
    } finally {
      setIsInitialized(true);
    }
  }, [form]);

  useEffect(() => {
    if (!isInitialized) return;
    const timeoutId = window.setTimeout(() => {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ values: watchedValues, step }));
      } catch (error) {
        console.error("Failed to save order", error);
      }
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [watchedValues, step, isInitialized]);

  const nextStep = useCallback(async () => {
    const current = STEPS[step - 1];
    if (!current) return;
    const valid = await form.trigger(current.fields as any, { shouldFocus: true });
    if (valid) setStep((currentStep) => Math.min(currentStep + 1, 5));
  }, [step, form]);

  const previousStep = useCallback(() => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }, []);

  const handleFormSubmit = async (data: OrderFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      localStorage.removeItem(FORM_STORAGE_KEY);
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been received. We’ll send you payment details shortly.`,
      });
      window.setTimeout(() => navigate("/redeem"), 1500);
    } catch {
      toast({ variant: "destructive", title: "Order failed", description: "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return <div className="order-loading" role="status">Preparing your order…</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="order-flow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="order-form">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && <OrderPurposeStep key="step-1" form={form} onNext={nextStep} />}
            {step === 2 && <PersonalDetailsStep key="step-2" form={form} onNext={nextStep} />}
            {step === 3 && <ContactLocationStep key="step-3" form={form} onNext={nextStep} onPrev={previousStep} />}
            {step === 4 && <CardDetailsStep key="step-4" form={form} onNext={nextStep} onPrev={previousStep} />}
            {step === 5 && <OrderReviewStep key="step-5" form={form} isLoading={isLoading} onPrev={previousStep} />}
          </AnimatePresence>
          <p className="order-privacy-note">Your details are used only to prepare and deliver this order.</p>
        </form>
      </Form>
    </motion.div>
  );
}
