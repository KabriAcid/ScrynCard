import { motion } from "framer-motion";
import { Building2, DollarSign, IdCard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
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
import { UseFormReturn } from "react-hook-form";
import { RedemptionFormValues, NIGERIAN_BANKS } from "./schema";

interface BankDetailsStepProps {
  form: UseFormReturn<RedemptionFormValues>;
  isLoading: boolean;
  onSubmit: () => void;
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

export function BankDetailsStep({
  form,
  isLoading,
  onSubmit,
  onPrev,
}: BankDetailsStepProps) {
  return (
    <motion.div
      key="step-5"
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
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">
            Bank Details
          </h3>
          <p className="text-muted-foreground text-sm">
            Enter your bank account information
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_BANKS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
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
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Account Number"
                      {...field}
                      disabled={isLoading}
                      maxLength={10}
                      className="pl-10 h-11"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="bvn"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="BVN (11111111111)"
                    {...field}
                    disabled={isLoading}
                    maxLength={11}
                    className="pl-10 h-11"
                  />
                </div>
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
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 h-11 bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Redeem Card
              <span className="ml-2">✓</span>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
