import { motion } from "framer-motion";
import { User } from "lucide-react";
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
                title="Personal Info"
                description="Please provide your personal details"
                step={1}
                totalSteps={3}
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
                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your full name"
                                                {...field}
                                            />
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
                                            <Input
                                                maxLength={11}
                                                inputMode="numeric"
                                                placeholder="Enter your NIN"
                                                {...field}
                                            />
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
