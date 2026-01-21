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
import { Briefcase, CreditCard } from "lucide-react";
import { RedemptionFormValues, OCCUPATION_OPTIONS } from "./schema";

interface BioDataStepProps {
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function BioDataStep({ isLoading, onNext, onPrev }: BioDataStepProps) {
  const form = useFormContext<RedemptionFormValues>();

  const handleNext = async () => {
    const isValid = await form.trigger(["nin", "occupation"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Beneficiary Information</h2>
        <p className="text-muted-foreground mt-1">
          Enter your NIN and occupation details
        </p>
      </div>

      <div className="space-y-4">
        {/* NIN Field */}
        <FormField
          control={form.control}
          name="nin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>National Identification Number (NIN)</FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="12345678901"
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

        {/* Occupation Field */}
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="pl-10">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {OCCUPATION_OPTIONS.map((occupation) => (
                    <SelectItem key={occupation} value={occupation}>
                      {occupation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
          disabled={isLoading}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
