import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Flag,
  Briefcase,
  Upload,
  Camera,
  ArrowRight,
  Sparkles,
  CheckCircle2,
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
import {
  OrderFormValues,
  titles,
  politicalParties,
  politicalRoles,
} from "./schema";
import {
  containerVariants,
  itemVariants,
  stepTransition,
  StepHeader,
  FormSection,
  FormGrid,
  GlassCard,
} from "./shared";
import { cn } from "@/lib/utils";

interface CardCustomizationStepProps {
  form: UseFormReturn<OrderFormValues>;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export function CardCustomizationStep({
  form,
  photoPreview,
  onPhotoChange,
  onNext,
}: CardCustomizationStepProps) {
  const watchedValues = form.watch();
  const isPhotoUploaded = !!photoPreview;

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
        title="Personal Details"
        description="Customize your card with personal and political information"
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
        {/* Photo Upload Section - Prominent at top */}
        <GlassCard className="overflow-hidden">
          <FormSection>
            <FormField
              control={form.control}
              name="photo"
              render={() => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Photo Preview Circle */}
                    <motion.label
                      className={cn(
                        "relative flex-shrink-0 cursor-pointer group",
                        "w-32 h-32 rounded-full overflow-hidden",
                        "border-2 border-dashed transition-all duration-300",
                        isPhotoUploaded
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary hover:bg-primary/5"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatePresence mode="wait">
                        {photoPreview ? (
                          <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative w-full h-full"
                          >
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                            {/* Success indicator */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"
                          >
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-xs font-medium">
                              Upload Photo
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Input
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={onPhotoChange}
                      />
                    </motion.label>

                    {/* Photo Guidelines */}
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-semibold text-foreground mb-2">
                        Card Photo
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          Clear, professional headshot
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          High resolution (min 500x500px)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          PNG, JPG, or WebP format
                        </li>
                      </ul>
                    </div>
                  </div>
                  <FormMessage className="text-center mt-4" />
                </FormItem>
              )}
            />
          </FormSection>
        </GlassCard>

        {/* Name & Title Section */}
        <GlassCard>
          <FormSection
            title="Basic Information"
            description="Your name as it will appear on the card"
          >
            <FormGrid>
              {/* Title Select */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Title
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {titles.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Full Name Input */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="politicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            placeholder="e.g. Dikko Umar Radda"
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

        {/* Political Information Section */}
        <GlassCard>
          <FormSection
            title="Political Information"
            description="Your political affiliation and role"
          >
            <FormGrid>
              {/* Political Party */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="politicalParty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Political Party
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <SelectTrigger className="h-11 pl-10 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                              <SelectValue placeholder="Select party" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {politicalParties.map((party) => (
                            <SelectItem key={party} value={party}>
                              {party}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Political Role */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="politicalRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Political Role / Aspiration
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <SelectTrigger className="h-11 pl-10 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {politicalRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
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
          </FormSection>
        </GlassCard>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="pt-4">
          <Button
            type="button"
            onClick={onNext}
            size="lg"
            className="w-full h-12 text-base font-semibold group"
          >
            <span>Continue to Contact Details</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
