import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ClipboardCheck, CreditCard, MapPin, UserRound } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderSchema, OrderFormValues, StepConfig } from "./schema";
import { OrderPurposeStep } from "./OrderPurposeStep";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { ContactDetailsStep } from "./ContactDetailsStep";
import { ContactLocationStep } from "./ContactLocationStep";
import { CardDetailsStep } from "./CardDetailsStep";
import { OrderReviewStep } from "./OrderReviewStep";
import { FlowStepProgress } from "../FlowStepProgress";

const STEPS: StepConfig[] = [
  { id: 1, title: "Purpose", description: "Choose a card type", fields: ["purpose"], icon: Briefcase },
  { id: 2, title: "Business", description: "Business information", fields: ["businessName", "businessType"], icon: Briefcase },
  { id: 3, title: "Contact", description: "Your contact details", fields: ["fullName", "email"], icon: UserRound },
  { id: 4, title: "Delivery", description: "Delivery location", fields: ["state", "lga"], icon: MapPin },
  { id: 5, title: "Rewards", description: "Card quantities", fields: ["orderItems"], icon: CreditCard },
];

const ORDER_PROGRESS_STEPS = [
  { label: "Type", icon: Briefcase },
  { label: "Brand", icon: Briefcase },
  { label: "Contact", icon: UserRound },
  { label: "Delivery", icon: MapPin },
  { label: "Cards", icon: CreditCard },
  { label: "Review", icon: ClipboardCheck },
];

export function OrderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [orderReference, setOrderReference] = useState("");

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    mode: "onChange",
    defaultValues: {
      purpose: "business",
      businessName: "",
      businessType: "",
      fullName: "",
      email: "",
      state: "",
      lga: "",
      orderItems: [],
    },
  });

  const nextStep = useCallback(async () => {
    const current = STEPS[step - 1];
    if (!current) return;
    const valid = await form.trigger(current.fields as any, { shouldFocus: true });
    if (valid) setStep((currentStep) => Math.min(currentStep + 1, 6));
  }, [step, form]);

  const previousStep = useCallback(() => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }, []);

  const handleFormSubmit = async (data: OrderFormValues) => {
    if (hasSubmitted) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setSubmittedEmail(data.email);
      setOrderReference(`ORD-${Date.now().toString().slice(-8)}`);
      setHasSubmitted(true);
      setShowInfo(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="order-flow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="order-form">
          <FlowStepProgress steps={ORDER_PROGRESS_STEPS} currentStep={step} label="Order progress" />
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && <OrderPurposeStep key="step-1" form={form} onNext={nextStep} />}
            {step === 2 && <PersonalDetailsStep key="step-2" form={form} onNext={nextStep} />}
            {step === 3 && <ContactDetailsStep key="step-3" form={form} onNext={nextStep} onPrev={previousStep} />}
            {step === 4 && <ContactLocationStep key="step-4" form={form} onNext={nextStep} onPrev={previousStep} />}
            {step === 5 && <CardDetailsStep key="step-5" form={form} onNext={nextStep} onPrev={previousStep} />}
            {step === 6 && <OrderReviewStep key="step-6" form={form} isLoading={isLoading} hasSubmitted={hasSubmitted} onPrev={previousStep} />}
          </AnimatePresence>
          <p className="order-privacy-note">Your details are used only to prepare and deliver this order.</p>
        </form>
      </Form>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="order-info-dialog">
          <DialogHeader>
            <DialogTitle>Check your email inbox</DialogTitle>
            <DialogDescription>
              Order {orderReference} has been received. Payment details and instructions will be sent to <strong>{submittedEmail}</strong>.
            </DialogDescription>
          </DialogHeader>
          <p className="order-info-followup">Once your payment is successful, we will email your login details so you can access your account.</p>
          <DialogFooter>
            <Button type="button" onClick={() => setShowInfo(false)} className="order-primary-button">Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
