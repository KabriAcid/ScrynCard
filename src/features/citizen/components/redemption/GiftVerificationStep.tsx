import React from "react";
import { useFormContext } from "react-hook-form";
import { CreditCard } from "lucide-react";
import { StepHeader } from "../order/shared";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RedemptionFormValues } from "./schema";
import { Spinner } from "@/components/ui/spinner";

interface CardVerificationStepProps {
  isLoading: boolean;
  onNext: () => Promise<void>;
  onPrev: () => void;
  isFirstStep?: boolean;
}

export function GiftVerificationStep({
  isLoading,
  onNext,
  onPrev,
  isFirstStep = false,
}: CardVerificationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const [verificationLoading, setVerificationLoading] = React.useState(false);

  const serialNumber = form.watch("serialNumber");
  const cardCode = form.watch("cardCode");

  const handleVerifyCard = async () => {
    if (!serialNumber || !cardCode) {
      if (!serialNumber) {
        form.setError("serialNumber", {
          message: "Serial number is required",
        });
      }
      if (!cardCode) {
        form.setError("cardCode", {
          message: "Card code is required",
        });
      }
      return;
    }

    setVerificationLoading(true);
    // Proceed to the result step (which shows the spinner and result)
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verify Your Card</h2>
        <p className="text-muted-foreground mt-1">
          Enter the serial number and card code from your scratch card
        </p>
      </div>

      <div className="space-y-4">
        {/* Serial Number & Card Code Fields - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Serial Number Field - Smaller on large screens */}
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SN-D93F93"
                    maxLength={9}
                    {...field}
                    disabled={verificationLoading}
                    className="font-mono uppercase"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.value.length}/9 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Card Code Field - Larger on large screens */}
          <FormField
            control={form.control}
            name="cardCode"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Card Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="WSO-D939-39DX-39DK"
                    maxLength={18}
                    {...field}
                    disabled={verificationLoading}
                    className="font-mono uppercase"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.value.length}/18 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          onClick={handleVerifyCard}
          disabled={verificationLoading || !serialNumber || !cardCode}
          isLoading={verificationLoading}
          className="w-full"
        >
          Verify Card
        </Button>
      </div>

      <div className="flex gap-3 pt-4">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading || verificationLoading}
            className="flex-1"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
