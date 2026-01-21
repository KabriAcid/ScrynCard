import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { denominations } from "./order-utils";
import { Control } from "react-hook-form";

interface QuantityConfigurerProps {
  fields: Array<{ id: string; denomination: string; quantity: number }>;
  control: Control<any>;
  onUpdateQuantity: (index: number, delta: number) => void;
}

export function QuantityConfigurer({
  fields,
  control,
  onUpdateQuantity,
}: QuantityConfigurerProps) {
  if (fields.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Configure Quantities</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Set the quantity for each selected denomination
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-2 sm:space-y-3">
          {fields.map((field, index) => {
            const denom = denominations.find(
              (d) => d.id === field.denomination
            );
            const minQty = 1;

            return (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-semibold">{denom?.label}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {formatCurrency(Math.max(1, field.quantity) * (denom?.value || 0))} total ({Math.max(1, field.quantity)} {denom?.unit})
                  </div>
                </div>
                <div className="flex items-center gap-0 sm:gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    onClick={() => onUpdateQuantity(index, -10)}
                    disabled={field.quantity <= minQty}
                  >
                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <div className="w-16 sm:w-20 text-center px-1 sm:px-2">
                    <FormField
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field: qtyField }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              type="number"
                              {...qtyField}
                              onChange={(e) =>
                                qtyField.onChange(
                                  parseInt(e.target.value) || minQty
                                )
                              }
                              min={minQty}
                              className="w-full text-center font-bold text-sm sm:text-base border-0 bg-transparent focus:outline-none focus:ring-0"
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
                    size="sm"
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    onClick={() => onUpdateQuantity(index, 10)}
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
