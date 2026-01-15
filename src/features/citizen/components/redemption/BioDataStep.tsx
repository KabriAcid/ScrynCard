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
import { RedemptionFormValues } from "./schema";

const occupations = [
  "Student",
  "Healthcare Worker",
  "Teacher",
  "Business Owner",
  "Farmer",
  "Unemployed",
  "Other",
];

interface BioDataStepProps {
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep?: boolean;
}

export function BioDataStep({
  isLoading,
  onNext,
  onPrev,
  isFirstStep = false,
}: BioDataStepProps) {
  const form = useFormContext<RedemptionFormValues>();

  const nin = form.watch("nin");
  const occupation = form.watch("occupation");

  const handleNext = async () => {
    const isValid = await form.trigger(["nin", "occupation"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-muted-foreground mt-1">
          Please provide your NIN and occupation
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
                <Input
                  placeholder="12345678901"
                  maxLength={11}
                  {...field}
                  disabled={isLoading}
                  className="font-mono"
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ""))
                  }
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                {field.value.length}/11 digits
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Occupation Select */}
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((occ) => (
                      <SelectItem key={occ} value={occ}>
                        {occ}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleNext}
          disabled={isLoading || !nin || !occupation}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
