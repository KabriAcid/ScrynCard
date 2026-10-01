import { motion } from "framer-motion";
import { User, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "./schema";
import {
    containerVariants,
    itemVariants,
    stepTransition,
    StepHeader,
    FormSection,
    FormGrid,
    GlassCard,
} from "./shared";

interface PersonalDetailsStepProps {
    form: UseFormReturn<OrderFormValues>;
    onNext: () => void;
}

export function PersonalDetailsStep({
    form,
    onNext,
}: PersonalDetailsStepProps) {
    const handleContinue = async () => {
        const isValid = await form.trigger(["fullName", "nin"]);
        if (isValid) {
            onNext();
        }
    };

    return (
        <motion.div
            key="step-1"
            variants={stepTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            {/* Step Header */}
            <StepHeader
                icon={User}
                title="Business details"
                description="Tell us about your business and the person managing this order."
                step={2}
                totalSteps={5}
            />

            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <GlassCard>
                    <FormSection>
                        <FormGrid>
                            <FormField
                                control={form.control}
                                name="businessName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Your business name" className="pl-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="businessType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Retail, hospitality" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* NIN */}
                            <FormField
                                control={form.control}
                                name="nin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>National ID Number (NIN)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    maxLength={11}
                                                    inputMode="numeric"
                                                    placeholder="Enter your NIN"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGrid>
                    </FormSection>
                </GlassCard>
            </motion.div>

            {/* Navigation */}
            <motion.div
                variants={itemVariants}
                className="flex justify-end pt-4"
            >
                <Button
                    type="button"
                    onClick={onNext}
                    size="lg"
                >
                    Proceed
                </Button>
            </motion.div>
        </motion.div>
    );
}
