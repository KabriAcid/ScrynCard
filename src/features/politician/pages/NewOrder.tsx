import { useState } from "react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/politician/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Place New Order</h1>
        <p className="text-muted-foreground mt-1">
          Select card denominations and quantities for your new order
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Denomination Selection */}
            <div className="lg:col-span-2 space-y-6">
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
            <div className="space-y-6">
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
