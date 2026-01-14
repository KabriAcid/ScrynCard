import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  ArrowRight,
  ArrowLeft,
  Globe,
} from "lucide-react";
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
import { OrderFormValues, stateNames, statesAndLgas } from "./schema";
import {
  containerVariants,
  itemVariants,
  stepTransition,
  StepHeader,
  FormSection,
  FormGrid,
  GlassCard,
} from "./shared";

interface ContactLocationStepProps {
  form: UseFormReturn<OrderFormValues>;
  onNext: () => void;
  onPrev: () => void;
}

export function ContactLocationStep({
  form,
  onNext,
  onPrev,
}: ContactLocationStepProps) {
  const selectedState = form.watch("state");

  // Get LGAs for selected state
  const availableLgas = selectedState ? statesAndLgas[selectedState] || [] : [];

  return (
    <motion.div
      key="step-2"
      variants={stepTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Step Header */}
      <StepHeader
        icon={MapPin}
        title="Contact & Location"
        description="How can we reach you and where should we deliver?"
        step={2}
        totalSteps={3}
      />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Contact Information Section */}
        <GlassCard>
          <FormSection
            title="Contact Information"
            description="We'll use this to send order updates and delivery notifications"
          >
            <FormGrid>
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            className="h-11 pl-10 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Phone Input */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            type="tel"
                            placeholder="08012345678"
                            {...field}
                            className="h-11 pl-10 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </FormGrid>
          </FormSection>
        </GlassCard>

        {/* Location Section */}
        <GlassCard>
          <FormSection
            title="Delivery Location"
            description="Select your state and local government area for delivery"
          >
            <FormGrid>
              {/* State Select */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        State
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset LGA when state changes
                          form.setValue("lga", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <SelectTrigger className="h-11 pl-10 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </div>
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
              </motion.div>

              {/* LGA Select */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="lga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Local Government Area
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={!selectedState}
                      >
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <SelectTrigger className="h-11 pl-10 bg-background/50 border-border/50 hover:border-primary/50 transition-colors disabled:opacity-50">
                              <SelectValue
                                placeholder={
                                  selectedState
                                    ? "Select your LGA"
                                    : "First select a state"
                                }
                              />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {availableLgas.map((lga) => (
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
            </FormGrid>

            {/* Location Preview */}
            {selectedState && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Delivery to:</span>
                  <span className="font-medium text-foreground">
                    {form.watch("lga")
                      ? `${form.watch("lga")}, ${selectedState}`
                      : selectedState}
                  </span>
                </div>
              </motion.div>
            )}
          </FormSection>
        </GlassCard>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            size="lg"
            className="h-12 text-base font-semibold group"
          >
            <span>Back</span>
          </Button>
          <Button
            type="button"
            onClick={onNext}
            size="lg"
            className="flex-1 h-12 text-base font-semibold group"
          >
            <span>Continue</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
