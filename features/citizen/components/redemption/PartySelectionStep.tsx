import React from "react";
import { motion } from "framer-motion";
import { Heart, LoaderCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { RedemptionFormValues, POLITICAL_PARTIES } from "./schema";

interface PartySelectionStepProps {
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

export function PartySelectionStep({
  form,
  isLoading,
  onNext,
  onPrev,
}: PartySelectionStepProps) {
  const selectedParty = form.watch("favoriteParty");
  const [logoErrors, setLogoErrors] = React.useState<Set<string>>(new Set());

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
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">
            Political Preference
          </h3>
          <p className="text-muted-foreground text-sm">
            Step 3 of 4: Select your favorite political party
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="favoriteParty"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {POLITICAL_PARTIES.map((party) => (
                    <button
                      key={party.name}
                      type="button"
                      onClick={() => field.onChange(party.name)}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        selectedParty === party.name
                          ? "border-primary bg-primary/5"
                          : "border-muted bg-secondary hover:border-primary/50"
                      }`}
                      disabled={isLoading}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {!logoErrors.has(party.name) ? (
                          <img
                            src={party.logo}
                            alt={party.name}
                            className="h-12 w-12 object-contain"
                            onError={() => {
                              setLogoErrors(
                                (prev) => new Set([...prev, party.name])
                              );
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-muted-foreground">
                              {party.name}
                            </span>
                          </div>
                        )}
                        <span className="text-xs font-semibold text-foreground text-center">
                          {party.name}
                        </span>
                      </div>
                      {selectedParty === party.name && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
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
          name="hasVotersCard"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-muted bg-secondary p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="flex-1">
                <label className="text-foreground font-medium cursor-pointer">
                  I have a voter's card
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Check this if you have a valid voter's registration card
                </p>
              </div>
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
