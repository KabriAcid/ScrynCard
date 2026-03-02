import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Phone, Wifi } from "lucide-react";
import { StepHeader } from "../order/shared";
import { RedemptionFormValues, NETWORK_OPTIONS } from "./schema";

interface PhoneVerificationStepProps {
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function PhoneVerificationStep({
  isLoading,
  onNext,
  onPrev,
}: PhoneVerificationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const phoneNumber = form.watch("phoneNumber");
  const network = form.watch("network");

  const handleNext = async () => {
    const isValid = await form.trigger(["phoneNumber", "network"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={Phone}
        title="Recipient Phone Number"
        description="Enter the phone number where you want to receive your gift"
        step={2}
        totalSteps={3}
      />

      <div className="space-y-4">
        {/* Phone Number Field */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="08012345678"
                    maxLength={11}
                    {...field}
                    disabled={isLoading}
                    className="pl-10"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                {field.value?.length || 0}/11 digits
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Network Provider Field */}
        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Provider</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <div className="relative">
                    <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your network provider" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  {NETWORK_OPTIONS.map((network) => (
                    <SelectItem key={network} value={network}>
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading || !phoneNumber || !network}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
