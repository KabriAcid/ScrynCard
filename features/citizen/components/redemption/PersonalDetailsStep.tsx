import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  IdCard,
  Calendar,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RedemptionFormValues } from "./schema";

interface PersonalDetailsStepProps {
  form: UseFormReturn<RedemptionFormValues>;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep?: boolean;
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

export function PersonalDetailsStep({
  form,
  isLoading,
  onNext,
  onPrev,
  isFirstStep = false,
}: PersonalDetailsStepProps) {
  return (
    <motion.div
      key="step-1"
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
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">
            Personal Information
          </h3>
          <p className="text-muted-foreground text-sm">
            Step 1 of 4: Enter your details for verification
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Full Name (as on bank account)"
                    {...field}
                    disabled={isLoading}
                    className="pl-10 h-11"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="Email (optional)"
                      {...field}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="tel"
                      placeholder="Phone (08012345678)"
                      {...field}
                      disabled={isLoading}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="nin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="NIN (11111111111)"
                      {...field}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="date"
                      {...field}
                      disabled={isLoading}
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

      <motion.div className="flex gap-3 pt-4" variants={itemVariants}>
        {!isFirstStep && (
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
        )}
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className={isFirstStep ? "w-full h-11" : "flex-1 h-11"}
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
