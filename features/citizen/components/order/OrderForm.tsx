import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { User, Home, Wallet } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  OrderSchema,
  OrderFormValues,
  StepConfig,
} from "@/features/citizen/components/order/schema";
import { OrderStepIndicator } from "@/features/citizen/components/order/OrderStepIndicator";
import { CardCustomizationStep } from "@/features/citizen/components/order/CardCustomizationStep";
import { ContactLocationStep } from "@/features/citizen/components/order/ContactLocationStep";
import { CardDetailsStep } from "@/features/citizen/components/order/CardDetailsStep";

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Card Customization",
    fields: [
      "title",
      "politicianName",
      "politicalParty",
      "politicalRole",
      "photo",
    ] as const,
    icon: User,
  },
  {
    id: 2,
    title: "Contact & Location",
    fields: ["email", "phone", "state", "lga", "ward"] as const,
    icon: Home,
  },
  {
    id: 3,
    title: "Card Details",
    fields: ["orderItems"] as const,
    icon: Wallet,
  },
];

const FORM_STORAGE_KEY = "scryn-order-form";

export function OrderForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      politicianName: "",
      politicalParty: "",
      politicalRole: "",
      email: "",
      phone: "",
      state: "",
      lga: "",
      ward: "",
      photo: undefined,
      orderItems: [],
    },
  });

  const watchedValues = form.watch();

  // Load form state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedState) {
        const { values, step: savedStep } = JSON.parse(savedState);
        form.reset(values);
        setStep(savedStep);
        if (values.photo && typeof values.photo === "string") {
          setPhotoPreview(values.photo);
        }
      }
    } catch (e) {
      console.error("Failed to load form state from localStorage", e);
    }
  }, [form]);

  // Save form state to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        values: { ...watchedValues, photo: photoPreview },
        step,
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save form state to localStorage", e);
    }
  }, [watchedValues, step, photoPreview]);

  const nextStep = async () => {
    const fields = STEPS[step - 1].fields;
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;

    setStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  };

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        form.setValue("photo", reader.result as string, {
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: OrderFormValues) => {
    // Clear storage before submitting
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear form state from localStorage", e);
    }

    // Mock form submission
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Success",
        description: "Order created successfully!",
      });
      navigate("/politician");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-lg mx-auto"
      >
        <OrderStepIndicator steps={STEPS} currentStep={step} />

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <CardCustomizationStep
                key="step-1"
                form={form}
                photoPreview={photoPreview}
                onPhotoChange={handlePhotoChange}
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
      </form>
    </Form>
  );
}
