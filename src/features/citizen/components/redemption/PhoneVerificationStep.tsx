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
import { Button } from "@/components/ui/button";
import { Check, Phone, Wifi } from "lucide-react";
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
        title="Choose where it goes"
        description="Enter the recipient phone number and mobile network"
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
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="08012345678"
                    maxLength={11}
                    {...field}
                    disabled={isLoading}
                    className="h-12 pl-11 text-base"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <p className="mt-1 text-[11px] text-[#92978d]">
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
              <FormLabel>Choose a network</FormLabel>
              <div role="radiogroup" aria-label="Mobile network" className="grid grid-cols-2 gap-2.5 pt-1">
                {NETWORK_OPTIONS.map((option) => {
                  const isSelected = field.value === option;
                  const logo = {
                    MTN: "/brands/mtn.svg",
                    Airtel: "/brands/airtel-logo.png",
                    Glo: "/brands/glo.png",
                    "9Mobile": "/brands/9mobile.png",
                  }[option];

                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isLoading}
                      onClick={() => {
                        field.onChange(option);
                        form.clearErrors("network");
                      }}
                      className={`relative flex min-h-[68px] items-center gap-3 border px-3 py-2.5 text-left transition active:scale-[0.985] disabled:opacity-50 ${
                        option === "Others" ? "col-span-2" : ""
                      } ${
                        isSelected
                          ? "border-[#173f2d] bg-[#f2f4ee] ring-1 ring-[#173f2d]/15"
                          : "border-[#e1dbcf] bg-[#fffdf8] hover:border-[#b9a77e]"
                      }`}
                    >
                      <span className="grid h-9 w-12 shrink-0 place-items-center bg-white px-1.5">
                        {logo ? (
                          <img src={logo} alt="" className="max-h-7 max-w-10 object-contain" />
                        ) : (
                          <Wifi className="h-4 w-4 text-[#8e6c39]" />
                        )}
                      </span>
                      <span className="text-[13px] font-medium text-[#35473b]">{option === "Others" ? "Other network" : option}</span>
                      {isSelected && <Check className="ml-auto h-4 w-4 shrink-0 text-[#31583b]" />}
                    </button>
                  );
                })}
              </div>
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
            className="h-12 flex-1 rounded-sm border-[#d8d0c2] bg-transparent text-[#46574b] hover:bg-[#f5f1e8]"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading || !phoneNumber || !network}
            className="h-12 flex-1 rounded-sm bg-[#173f2d] text-white hover:bg-[#24553d]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
