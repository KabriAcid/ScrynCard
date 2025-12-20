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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  LoaderCircle,
  CreditCard,
  Building2,
  User,
  Phone,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { CardRedemptionInput } from "./card-redemption-input";
import { motion, AnimatePresence } from "framer-motion";

const RedemptionSchema = z.object({
  serialNumber: z.string().length(6, "Serial number must be 6 digits"),
  cardCode: z.string().min(19, "Card code must be valid format"),
  bankName: z.string().min(2, "Please enter bank name"),
  accountNumber: z.string().min(10, "Please enter valid account number"),
  accountName: z.string().min(3, "Please enter account name"),
  phone: z.string().min(10, "Please enter valid phone number"),
});

type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export function CardRedemptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(RedemptionSchema),
    mode: "onChange",
    defaultValues: {
      serialNumber: "",
      cardCode: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      phone: "",
    },
  });

  const onValidChange = (
    isValid: boolean,
    data?: { serial: string; code: string }
  ) => {
    setCardValid(isValid);
    if (isValid && data) {
      form.setValue("serialNumber", data.serial);
      form.setValue("cardCode", data.code);
    }
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep(2);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to validate card. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: RedemptionFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: `Card ****${values.serialNumber.slice(
          -2
        )} redeemed successfully. Check your account.`,
      });

      form.reset();
      setCardValid(false);
      setStep(1);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

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
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {/* Premium Step Indicator */}
        <motion.div
          className="mb-8 bg-secondary border border-border rounded-lg p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Step 1 Circle */}
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all ${
                  step === 1
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/50"
                    : step > 1
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                animate={{
                  scale: step === 1 ? 1 : 1,
                }}
              >
                {step > 1 ? <CheckCircle2 className="h-6 w-6" /> : "1"}
              </motion.div>

              {/* Progress Bar */}
              <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: step > 1 ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>

              {/* Step 2 Circle */}
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all ${
                  step === 2
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/50"
                    : step > 2
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                animate={{
                  scale: step === 2 ? 1 : 1,
                }}
              >
                {step > 2 ? <CheckCircle2 className="h-6 w-6" /> : "2"}
              </motion.div>
            </div>

            {/* Step Label */}
            <div className="ml-4 text-right">
              <p className="text-sm text-foreground font-medium">
                Step {step} of 2
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {step === 1 ? "Card Information" : "Bank Details"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Steps Container */}
        <AnimatePresence mode="wait">
          {/* Step 1: Card Information */}
          {step === 1 && (
            <motion.div
              key="step-1"
              className="space-y-6"
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
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-lg">
                    Verify Your Card
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Enter your scratch card details
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <CardRedemptionInput
                  onValidChange={onValidChange}
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!cardValid || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Validating Card...
                    </>
                  ) : (
                    <>
                      Continue to Bank Details
                      <span className="ml-2">→</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Bank Details */}
          {step === 2 && (
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
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-lg">
                    Bank Account Details
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Where should we send your funds?
                  </p>
                </div>
              </motion.div>

              {/* Bank Name */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="Bank Name (e.g., Zenith Bank)"
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

              {/* Account Number */}
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
                            placeholder="Account Number (10 digits)"
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

              {/* Account Name */}
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
                            placeholder="Full Name on Account"
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

              {/* Phone Number */}
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
                            placeholder="Phone Number"
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

              {/* Action Buttons */}
              <motion.div className="flex gap-3 pt-4" variants={itemVariants}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 h-11"
                  size="lg"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Redemption"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
}
