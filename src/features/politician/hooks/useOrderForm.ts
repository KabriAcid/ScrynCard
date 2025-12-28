import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  calculateOrderTotals,
  denominations,
  type OrderItem,
} from "../components/order";

const OrderItemSchema = z.object({
  denomination: z.string(),
  quantity: z.number().min(1, "Minimum quantity is 1"),
});

const OrderFormSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, "Please select at least one denomination")
    .refine(
      (items) => {
        const totalQuantity = items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return totalQuantity >= 100;
      },
      {
        message: "Total order must be at least 100 cards",
      }
    ),
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>;

export function useOrderForm() {
  const [selectedDenoms, setSelectedDenoms] = useState<Set<string>>(new Set());

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const toggleDenomination = (denomId: string) => {
    const newSelected = new Set(selectedDenoms);
    if (newSelected.has(denomId)) {
      newSelected.delete(denomId);
      const index = fields.findIndex((f) => f.denomination === denomId);
      if (index > -1) remove(index);
    } else {
      newSelected.add(denomId);
      const minQty = denomId === "2000" ? 100 : 1;
      append({ denomination: denomId, quantity: minQty });
    }
    setSelectedDenoms(newSelected);
  };

  const updateQuantity = (index: number, delta: number) => {
    const currentItem = fields[index];
    const denomId = currentItem.denomination;
    const minQty = denomId === "2000" ? 100 : 1;
    const newQuantity = Math.max(minQty, currentItem.quantity + delta);
    update(index, { ...currentItem, quantity: newQuantity });
  };

  const watchedItems = form.watch("items");
  const calculations = calculateOrderTotals(watchedItems);

  return {
    form,
    fields,
    selectedDenoms,
    calculations,
    toggleDenomination,
    updateQuantity,
  };
}
