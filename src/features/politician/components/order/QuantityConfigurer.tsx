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
            const minQty = 1;

            return (
              <div
                key={field.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="font-semibold">{denom?.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency((denom?.value || 0) * field.quantity)} total ({field.quantity} {denom?.unit})
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(index, -10)}
                    disabled={field.quantity <= minQty}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-20 text-center">
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
                    onClick={() => onUpdateQuantity(index, 10)}
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
  );
}
