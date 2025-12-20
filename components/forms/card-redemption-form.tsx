import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { CardRedemptionInput } from "./card-redemption-input";

const RedemptionSchema = z.object({
  serialNumber: z.string().length(6, "Serial number must be 6 digits"),
  cardCode: z.string().min(19, "Card code must be valid format"),
  bankName: z.string().min(2, "Please enter bank name"),
  accountNumber: z.string().min(10, "Please enter valid account number"),
  accountName: z.string().min(3, "Please enter account name"),
});

type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [cardData, setCardData] = useState<
    | {
        serial: string;
        code: string;
      }
    | undefined
  >();

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(RedemptionSchema),
    mode: "onChange",
    defaultValues: {
      serialNumber: "",
      cardCode: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const onValidChange = (
    isValid: boolean,
    data?: { serial: string; code: string }
  ) => {
    setCardValid(isValid);
    if (isValid && data) {
      setCardData(data);
      form.setValue("serialNumber", data.serial);
      form.setValue("cardCode", data.code);
    }
  };

  const onSubmit = async (values: RedemptionFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: `Card ****${values.serialNumber.slice(
          -2
        )} redeemed successfully. Check your account.`,
      });

      // Reset form
      form.reset();
      setCardValid(false);
      setCardData(undefined);

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to redeem card. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Card Validation Section */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-4">Step 1: Card Information</h3>
          <CardRedemptionInput
            onValidChange={onValidChange}
            disabled={isLoading}
          />
        </Card>

        {/* Bank Details Section - Only show when card is valid */}
        {cardValid && (
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold mb-4">Step 2: Bank Account Details</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Zenith Bank"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10-digit account number"
                        {...field}
                        disabled={isLoading}
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full name on account"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!cardValid || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Processing Redemption...
            </>
          ) : (
            "Redeem Card"
          )}
        </Button>
      </form>
    </Form>
  );
}
