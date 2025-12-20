import { motion } from "framer-motion";
import { MapPin, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RedemptionFormValues, STATES_AND_LGAS, WARDS_BY_LGA } from "./schema";

interface LocationStepProps {
  form: UseFormReturn<RedemptionFormValues>;
  isLoading: boolean;
  onNext: () => void;
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

export function LocationStep({
  form,
  isLoading,
  onNext,
  onPrev,
}: LocationStepProps) {
  const selectedState = form.watch("state");
  const selectedLga = form.watch("lga");

  const lgasForState = selectedState
    ? STATES_AND_LGAS[selectedState as keyof typeof STATES_AND_LGAS] || []
    : [];

  const wardsForLga = selectedLga
    ? WARDS_BY_LGA[selectedLga as keyof typeof WARDS_BY_LGA] || []
    : [];

  // Reset dependent fields when parent changes
  const handleStateChange = (value: string) => {
    form.setValue("state", value);
    form.setValue("lga", "");
    form.setValue("ward", "");
  };

  const handleLgaChange = (value: string) => {
    form.setValue("lga", value);
    form.setValue("ward", "");
  };

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
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">
            Location Details
          </h3>
          <p className="text-muted-foreground text-sm">
            Select your state, LGA, and ward
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select value={field.value} onValueChange={handleStateChange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATES_AND_LGAS).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="lga"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={handleLgaChange}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    {lgasForState.map((lga) => (
                      <SelectItem key={lga} value={lga}>
                        {lga}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="ward"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedLga}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wardsForLga.map((ward) => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div className="flex gap-3 pt-4" variants={itemVariants}>
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isLoading}
          className="flex-1 h-11"
          size="lg"
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="flex-1 h-11"
          size="lg"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Continue
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
