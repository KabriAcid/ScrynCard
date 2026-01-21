import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrderForm } from "../hooks/useOrderForm";
import {
  DenominationSelector,
  QuantityConfigurer,
  OrderSummaryCard,
  OrderTipsCard,
} from "../components/order";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    form,
    fields,
    selectedDenoms,
    calculations,
    toggleDenomination,
    updateQuantity,
  } = useOrderForm();

  // Reset form when page mounts to ensure clean state
  useEffect(() => {
    form.reset({ items: [] });
  }, [form]);

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create mock order ID
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;

      toast({
        title: "Order Placed Successfully!",
        description: `Order ${orderId} has been created. Redirecting to payment details...`,
      });

      // Navigate to order details page after 1 second
      setTimeout(() => {
        navigate(`/politician/orders/${orderId}`);
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-0">
        <Button variant="ghost" onClick={() => navigate("/politician/orders")} className="h-8 sm:h-9 px-1.5 sm:px-3 text-xs sm:text-sm">
          <ArrowLeft className="mr-0.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Back to Orders</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      <div className="px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Order Data & Airtime</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          Select data bundles and airtime vouchers for distribution
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {/* Left Column - Denomination Selection */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <DenominationSelector
                selected={selectedDenoms}
                onToggle={toggleDenomination}
                errorMessage={
                  form.formState.errors.items?.message ||
                  form.formState.errors.items?.root?.message
                }
              />

              <QuantityConfigurer
                fields={fields}
                control={form.control}
                onUpdateQuantity={updateQuantity}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-4 lg:h-fit">
              <OrderSummaryCard
                calculations={calculations}
                isSubmitting={isSubmitting}
                hasItems={fields.length > 0}
                onSubmit={onSubmit}
              />

              <OrderTipsCard />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
