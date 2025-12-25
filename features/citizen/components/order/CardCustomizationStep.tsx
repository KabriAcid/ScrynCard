import { motion } from "framer-motion";
import { User, PartyPopper, Briefcase, Upload } from "lucide-react";
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

interface CardCustomizationStepProps {
  form: UseFormReturn<OrderFormValues>;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
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

export function CardCustomizationStep({
  form,
  photoPreview,
  onPhotoChange,
  onNext,
}: CardCustomizationStepProps) {
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
            Card Customization
          </h3>
          <p className="text-muted-foreground text-sm">
            Customize your card with personal and political details
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-[1fr_2fr] gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background border-input transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Title" />
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
        <FormField
          control={form.control}
          name="politicianName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (on card)</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="John Doe"
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

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="politicalParty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Political Party</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <div className="relative">
                    <PartyPopper className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                    <SelectTrigger className="pl-10 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a political party" />
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

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="politicalRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Political Role / Aspiration</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                    <SelectTrigger className="pl-10 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a role" />
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

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="photo"
          render={() => (
            <FormItem>
              <FormLabel>Photo for Card</FormLabel>
              <FormControl>
                <label className="flex flex-col items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-input rounded-full cursor-pointer hover:bg-muted transition-all hover:border-primary group">
                  {photoPreview ? (
                    <motion.img
                      src={photoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground text-center group-hover:text-primary transition-colors">
                      <Upload className="w-8 h-8 mb-2" />
                      <p className="mb-2 text-sm">Upload photo</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={onPhotoChange}
                  />
                </label>
              </FormControl>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <Button type="button" onClick={onNext} className="w-full">
          Next Step
        </Button>
      </motion.div>
    </motion.div>
  );
}
