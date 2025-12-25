import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  OrderFormValues,
  stateNames,
  statesAndLgas,
  wardsByLga,
} from "./schema";
import { ArrowLeft } from "lucide-react";

interface ContactLocationStepProps {
  form: UseFormReturn<OrderFormValues>;
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

export function ContactLocationStep({
  form,
  onNext,
  onPrev,
}: ContactLocationStepProps) {
  const selectedState = form.watch("state");
  const selectedLga = form.watch("lga");

  return (
    <motion.div
      key="step-2"
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
            Contact & Location
          </h3>
          <p className="text-muted-foreground text-sm">
            Provide your contact details and order location
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className="pl-10 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="tel"
                    placeholder="08012345678"
                    {...field}
                    className="pl-10 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.resetField("lga");
                  form.resetField("ward");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-background border-input transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stateNames.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LGA (Local Government)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.resetField("ward");
                }}
                value={field.value ?? ""}
                disabled={!selectedState}
              >
                <FormControl>
                  <SelectTrigger className="bg-background border-input transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select your LGA" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(statesAndLgas[selectedState] || []).map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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
              <FormLabel>Ward</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={!selectedLga}
              >
                <FormControl>
                  <SelectTrigger className="bg-background border-input transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select your ward" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(wardsByLga[selectedLga] || []).map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Next Step
        </Button>
      </motion.div>
    </motion.div>
  );
}
