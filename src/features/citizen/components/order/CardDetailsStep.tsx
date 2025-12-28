import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Trash2,
  ArrowLeft,
  LoaderCircle,
  Sparkles,
  Plus,
  Minus,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Denomination,
} from "./schema";
import { Card } from "@/components/ui/card";
import {
  containerVariants,
  itemVariants,
  stepTransition,
  StepHeader,
  FormSection,
  GlassCard,
  AnimatedBadge,
} from "./shared";
import { cn, formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CardDetailsStepProps {
  form: UseFormReturn<OrderFormValues>;
  isLoading: boolean;
  onPrev: () => void;
}

// Premium Denomination Card Component
function DenominationCard({
  denom,
  isSelected,
  onToggle,
}: {
  denom: Denomination;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const is2k = denom.id === "2000";

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-200",
        "flex flex-col items-center justify-center gap-1",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20",
        isSelected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border/50 bg-background/50 hover:border-primary/30 hover:bg-primary/5"
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1"
          >
            <CheckCircle2 className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Value Badge for 2k */}
      {is2k && (
        <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
          Min 100
        </span>
      )}

      <span
        className={cn(
          "text-lg font-bold transition-colors",
          isSelected ? "text-primary" : "text-foreground"
        )}
      >
        {denom.label}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatCurrency(denom.value)}
      </span>
    </motion.button>
  );
}

// Premium Quantity Control Component
function QuantityControl({
  value,
  onChange,
  min = 1,
  denomination,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  denomination: string;
}) {
  const denom = denominations.find((d) => d.id === denomination);
  const itemTotal = (denom?.value || 0) * value;

  return (
    <div className="flex items-center gap-3">
      {/* Decrement */}
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(min, value - 10))}
        disabled={value <= min}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
          "hover:bg-primary/10 hover:border-primary/50",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Minus className="h-4 w-4" />
      </motion.button>

      {/* Value display */}
      <div className="flex flex-col items-center min-w-[80px]">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || min;
            onChange(Math.max(min, newValue));
          }}
          min={min}
          className="w-full text-center font-bold text-xl border-0 bg-transparent focus:outline-none focus:ring-0"
        />
        <span className="text-xs text-muted-foreground">
          {formatCurrency(itemTotal)}
        </span>
      </div>

      {/* Increment */}
      <motion.button
        type="button"
        onClick={() => onChange(value + 10)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
          "hover:bg-primary/10 hover:border-primary/50"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

export function CardDetailsStep({
  form,
  isLoading,
  onPrev,
}: CardDetailsStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
    keyName: "customId",
  });

  const handleDenominationToggle = (id: string) => {
    const itemIndex = fields.findIndex((field) => field.denomination === id);
    if (itemIndex > -1) {
      remove(itemIndex);
    } else {
      const defaultQuantity = id === "2000" ? 100 : 10;
      append({ denomination: id as any, quantity: defaultQuantity });
    }
  };

  const selectedDenominations = fields.map((f) => f.denomination);
  const watchedOrderItems = form.watch("orderItems") || [];
  const calculations = calculateOrderTotals(watchedOrderItems);

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

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Denomination Picker Section */}
        <GlassCard>
          <FormSection
            title="Select Denominations"
            description="Click to add or remove card denominations from your order"
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {denominations.map((denom, index) => (
                <motion.div
                  key={denom.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <DenominationCard
                    denom={denom}
                    isSelected={selectedDenominations.includes(denom.id)}
                    onToggle={() => handleDenominationToggle(denom.id)}
                  />
                </motion.div>
              ))}
            </div>
          </FormSection>
        </GlassCard>

        {/* Selected Cards & Quantities */}
        <AnimatePresence mode="popLayout">
          {fields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <GlassCard>
                <FormSection
                  title="Configure Quantities"
                  description="Set the number of cards for each denomination"
                >
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {fields.map((field, index) => {
                        const denom = denominations.find(
                          (d) => d.id === field.denomination
                        );
                        const is2kCard = field.denomination === "2000";
                        const minQuantity = is2kCard ? 100 : 1;

                        return (
                          <motion.div
                            key={field.customId}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: "auto" }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            layout
                          >
                            <Card className="p-4 bg-background/50 border-border/50">
                              <div className="flex items-center justify-between flex-wrap gap-4">
                                {/* Denomination Label */}
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="font-bold text-primary">
                                      {denom?.label}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">
                                      {denom?.label} Cards
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatCurrency(denom?.value || 0)} each
                                    </p>
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <FormField
                                    control={form.control}
                                    name={`orderItems.${index}.quantity`}
                                    render={({ field: qtyField }) => (
                                      <FormItem>
                                        <FormControl>
                                          <QuantityControl
                                            value={
                                              Number(qtyField.value) ||
                                              minQuantity
                                            }
                                            onChange={(val) =>
                                              qtyField.onChange(val)
                                            }
                                            min={minQuantity}
                                            denomination={field.denomination}
                                          />
                                        </FormControl>
                                        <FormMessage className="text-xs text-center" />
                                      </FormItem>
                                    )}
                                  />

                                  {/* Remove Button */}
                                  <motion.button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </motion.button>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </FormSection>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Messages */}
        <AnimatePresence>
          {form.formState.errors.orderItems && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.orderItems.message ||
                    form.formState.errors.orderItems.root?.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Summary */}
        {fields.length > 0 && (
          <motion.div variants={itemVariants}>
            <GlassCard className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Order Summary
                </h3>

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
                    <span className="text-muted-foreground">
                      Service Fee (15%):
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {formatCurrency(calculations.serviceFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Printing Cost:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(calculations.printingCost)}
                    </span>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Total to Pay:</span>
                    <motion.span
                      key={calculations.totalToPay}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-primary"
                    >
                      {formatCurrency(calculations.totalToPay)}
                    </motion.span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      After placing your order, you'll receive bank details to
                      complete the payment. Cards will be processed upon payment
                      confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading}
            size="lg"
            className="flex-1 h-12 text-base font-semibold group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Previous</span>
          </Button>
          <Button
            type="submit"
            disabled={isLoading || fields.length === 0}
            size="lg"
            className="flex-1 h-12 text-base font-semibold group"
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
