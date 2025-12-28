import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { RedemptionFormValues } from "./schema";

interface SuccessConfirmationProps {
  values: RedemptionFormValues;
  onComplete: () => void;
}

const checkmarkVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
    },
  },
};

const containerVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const countdownVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

export const SuccessConfirmation = ({
  values,
  onComplete,
}: SuccessConfirmationProps) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const cardLastFour = values.serialNumber.slice(-4);

  return (
    <motion.div
      key="success-screen"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center gap-6 py-12"
    >
      {/* Checkmark Animation */}
      <motion.div
        variants={checkmarkVariants}
        initial="initial"
        animate="animate"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600"
      >
        <Check className="h-10 w-10 text-white" strokeWidth={3} />
      </motion.div>

      {/* Success Message */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Card Redeemed Successfully!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your card has been processed and credited to your account
        </p>
      </motion.div>

      {/* Card Details */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-4"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Card Serial
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              ****{cardLastFour}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-muted-foreground">
              Account
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              **** {values.accountNumber.slice(-4)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-muted-foreground">
              Name
            </span>
            <span className="text-sm font-semibold text-foreground">
              {values.accountName}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.div
        variants={itemVariants}
        className="text-center text-sm text-muted-foreground"
      >
        <p>Redirecting in</p>
        <motion.div
          key={countdown}
          variants={countdownVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mt-2 text-3xl font-bold text-primary"
        >
          {countdown}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
