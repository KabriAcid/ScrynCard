import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, CreditCard, Sparkles } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { OrderSchema, OrderFormValues, StepConfig } from "./schema";
import { OrderStepIndicator } from "./OrderStepIndicator";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { ContactLocationStep } from "./ContactLocationStep";
import { CardDetailsStep } from "./CardDetailsStep";
import { cn } from "@/lib/utils";

// ============================================================================
// STEP CONFIGURATION
// ============================================================================
const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Your Information",
    description: "Your contact details",
    fields: [
      "fullName",
      "email",
      "phone",
    ] as const,
    icon: User,
  },
  {
    id: 2,
    title: "Delivery Location",
    description: "Where to deliver your order",
    fields: ["state", "lga"] as const,
    icon: MapPin,
  },
  {
    id: 3,
    title: "Product Selection",
    description: "Choose data and airtime products",
    fields: ["orderItems"] as const,
    icon: CreditCard,
  },
];

const FORM_STORAGE_KEY = "scryn-order-form-v2";

// ============================================================================
// MAIN ORDER FORM COMPONENT
// ============================================================================
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
      fullName: "",
      email: "",
      phone: "",
      state: "",
      lga: "",
      orderItems: [],
    },
  });

  const watchedValues = form.watch();

  // Load form state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedState) {
        const {
          values,
          step: savedStep,
        } = JSON.parse(savedState);
        // Remove old political fields if they exist
        const { title, politicianName, politicalParty, politicalRole, photo, ward, ...cleanedValues } = values;
        form.reset(cleanedValues);
        setStep(savedStep);
      }
    } catch (e) {
      console.error("Failed to load form state from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, [form]);

  // Save form state to localStorage (debounced)
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      try {
        const stateToSave = {
          values: watchedValues,
          step,
        };
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error("Failed to save form state to localStorage", e);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, step, isInitialized]);

  const nextStep = useCallback(async () => {
    const currentStepConfig = STEPS[step - 1];
    const output = await form.trigger(currentStepConfig.fields as any, {
      shouldFocus: true,
    });
    if (!output) return;

    setStep((prev) => Math.min(prev + 1, STEPS.length));
  }, [step, form]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleFormSubmit = async (data: OrderFormValues) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear storage on success
      localStorage.removeItem(FORM_STORAGE_KEY);

      // Create mock order ID
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;

      toast({
        title: "🎉 Order Placed Successfully!",
        description: `Your order #${orderId} has been received. We'll send you payment details shortly.`,
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/politician");
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until initialized (to prevent flash of default values)
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your order...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8 w-full max-w-2xl mx-auto"
        >
          {/* Step Indicator */}
          <OrderStepIndicator steps={STEPS} currentStep={step} />

          {/* Form Content */}
          <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <PersonalDetailsStep
                  key="step-1"
                  form={form}
                  onNext={nextStep}
                />
              )}

              {step === 2 && (
                <ContactLocationStep
                  key="step-2"
                  form={form}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}

              {step === 3 && (
                <CardDetailsStep
                  key="step-3"
                  form={form}
                  isLoading={isLoading}
                  onPrev={prevStep}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-4 border-t border-border/50"
          >
            <p className="text-xs text-muted-foreground">
              Your information is secure and will only be used for order
              processing.
            </p>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
