import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Trash2,
  ArrowLeft,
  LoaderCircle,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { OrderFormValues, denominations } from "./schema";
import { DenominationPicker } from "@/components/ui/form-elements/denomination-picker";
import { QuantityInput } from "@/components/ui/form-elements/quantity-input";
import { Card } from "@/components/ui/card";

interface CardDetailsStepProps {
  form: UseFormReturn<OrderFormValues>;
  isLoading: boolean;
  onPrev: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

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
      const defaultQuantity = id === "2000" ? 100 : 1;
      append({ denomination: id as any, quantity: defaultQuantity });
    }
  };

  const selectedDenominations = fields.map((f) => f.denomination);

  const watchedOrderItems = form.watch("orderItems");
  const totalQuantity = (watchedOrderItems || []).reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0
  );
  const totalValue = (watchedOrderItems || []).reduce(
    (acc, item) =>
      acc + parseInt(item.denomination) * (Number(item.quantity) || 0),
    0
  );

  return (
    <motion.div
      key="step-3"
      className="space-y-5"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        variants={itemVariants}
      >
        <div className="p-2 bg-primary/20 rounded-lg">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">
            Card Details
          </h3>
          <p className="text-muted-foreground text-sm">
            Select card denominations and quantities for your order
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DenominationPicker
          denominations={denominations}
          selected={selectedDenominations}
          onToggle={handleDenominationToggle}
        />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {fields.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-4"
          >
            <h3 className="font-medium text-lg">Selected Cards</h3>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const denomination = denominations.find(
                  (d) => d.id === field.denomination
                );
                const is2kCard = field.denomination === "2000";
                const minQuantity = is2kCard ? 100 : 1;
                return (
                  <motion.div
                    key={field.customId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-3 flex items-center justify-between bg-background border-input">
                      <div className="font-semibold text-foreground">
                        {denomination?.label} cards
                      </div>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`orderItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <QuantityInput {...field} min={minQuantity} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {form.formState.errors.orderItems && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FormMessage>
              {form.formState.errors.orderItems.message ||
                form.formState.errors.orderItems.root?.message}
            </FormMessage>
          </motion.div>
        )}
      </AnimatePresence>

      {fields.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">
                Total Quantity:
              </span>
              <span className="font-bold text-lg text-foreground">
                {totalQuantity.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-foreground">
                Total Value:
              </span>
              <span className="font-bold text-lg text-primary">
                ₦{totalValue.toLocaleString()}
              </span>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isLoading}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
              Placing Order...
            </>
          ) : (
            <>
              <PartyPopper className="mr-2 h-4 w-4" />
              Place Order
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
