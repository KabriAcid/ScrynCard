import { motion } from "framer-motion";
import {
  CreditCard,
  ArrowLeft,
  LoaderCircle,
  Sparkles,
  Minus,
  Plus,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
  OrderFormValues,
  denominations,
  calculateOrderTotals,
} from "./schema";
import { formatCurrency } from "@/lib/utils";
import { stepTransition, StepHeader } from "./shared";

interface CardDetailsStepProps {
  form: UseFormReturn<OrderFormValues>;
  isLoading: boolean;
  onPrev: () => void;
}

export function CardDetailsStep({
  form,
  isLoading,
  onPrev,
}: CardDetailsStepProps) {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "orderItems",
    keyName: "customId",
  });

  const selectedDenoms = new Set(fields.map((f) => f.denomination));

  const handleDenominationToggle = (denomId: string) => {
    if (selectedDenoms.has(denomId)) {
      const index = fields.findIndex((f) => f.denomination === denomId);
      if (index > -1) remove(index);
    } else {
      const denom = denominations.find((d) => d.id === denomId);
      append({
        denomination: denomId as any,
        quantity: denom?.minQty || 1,
      });
    }
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const currentItem = fields[index];
    const denom = denominations.find((d) => d.id === currentItem.denomination);
    const minQty = denom?.minQty || 1;
    const newQuantity = Math.max(minQty, currentItem.quantity + delta);
    update(index, { ...currentItem, quantity: newQuantity });
  };

  const watchedOrderItems = form.watch("orderItems") || [];
  const calculations = calculateOrderTotals(watchedOrderItems);

  const errorMessage =
    form.formState.errors.orderItems?.message ||
    form.formState.errors.orderItems?.root?.message;

  return (
    <motion.div
      key="step-3"
      variants={stepTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Step Header */}
      <StepHeader
        icon={CreditCard}
        title="Card Selection"
        description="Choose card denominations and quantities for your order"
        step={3}
        totalSteps={3}
      />

      {/* Denomination Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Select Card Denominations
          </CardTitle>
          <CardDescription>
            Choose the denominations you want to order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {denominations.map((denom) => {
              const isSelected = selectedDenoms.has(denom.id);
              const hasMinQty = denom.minQty > 1;

              return (
                <button
                  key={denom.id}
                  type="button"
                  onClick={() => handleDenominationToggle(denom.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-lg font-bold">{denom.label}</div>
                  {hasMinQty && (
                    <Badge
                      variant="secondary"
                      className="absolute top-1 right-1 text-xs"
                    >
                      Min {denom.minQty}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quantity Configurer */}
      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Quantities</CardTitle>
            <CardDescription>
              Set the quantity for each selected denomination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fields.map((field, index) => {
                const denom = denominations.find(
                  (d) => d.id === field.denomination
                );
                const minQty = denom?.minQty || 1;

                return (
                  <div
                    key={field.customId}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{denom?.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency((denom?.value || 0) * field.quantity)}{" "}
                        total
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(index, -10)}
                        disabled={field.quantity <= minQty}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-20 text-center">
                        <FormField
                          control={form.control}
                          name={`orderItems.${index}.quantity`}
                          render={({ field: qtyField }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  type="number"
                                  {...qtyField}
                                  onChange={(e) =>
                                    qtyField.onChange(
                                      Math.max(
                                        minQty,
                                        parseInt(e.target.value) || minQty
                                      )
                                    )
                                  }
                                  min={minQty}
                                  className="w-full text-center font-bold text-lg border-0 bg-transparent focus:outline-none focus:ring-0"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(index, 10)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      {fields.length > 0 && (
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cards:</span>
                <span className="font-semibold">
                  {calculations.totalCards.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Card Value:</span>
                <span className="font-semibold">
                  {formatCurrency(calculations.cardValue)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee (15%):</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(calculations.serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Printing Cost:</span>
                <span className="font-semibold">
                  {formatCurrency(calculations.printingCost)}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="font-semibold">Total to Pay:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(calculations.totalToPay)}
                </span>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                After placing your order, you'll receive bank details to
                complete the payment. Your cards will be processed upon payment
                confirmation.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isLoading}
          size="lg"
          className="flex-1 h-12 text-base font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>
        <Button
          type="submit"
          disabled={isLoading || fields.length === 0}
          size="lg"
          className="flex-1 h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Place Order
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
