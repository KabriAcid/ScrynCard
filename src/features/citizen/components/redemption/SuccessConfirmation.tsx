import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Gift, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RedemptionFormValues } from "./schema";

interface SuccessConfirmationProps {
  values: RedemptionFormValues;
  giftDetails: any;
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
  giftDetails,
  onComplete,
}: SuccessConfirmationProps) => {
  const [countdown, setCountdown] = useState(5);

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

  const getOperatorColor = (operator: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      MTN: { bg: "bg-yellow-100", text: "text-yellow-800" },
      Airtel: { bg: "bg-red-100", text: "text-red-800" },
      Glo: { bg: "bg-green-100", text: "text-green-800" },
      "9Mobile": { bg: "bg-blue-100", text: "text-blue-800" },
    };
    return colors[operator] || { bg: "bg-gray-100", text: "text-gray-800" };
  };

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
          Gift Redeemed Successfully!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {giftDetails?.giftType} has been sent to your phone
        </p>
      </motion.div>

      {/* Gift Details */}
      <motion.div variants={itemVariants} className="w-full max-w-sm space-y-3">
        {/* Gift Card */}
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Gift Details</h3>
          </div>
          <div className="space-y-2 text-sm text-blue-900">
            <div className="flex justify-between">
              <span className="text-blue-700">Type</span>
              <Badge className="capitalize">{giftDetails?.giftType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Amount</span>
              <span className="font-semibold">
                {giftDetails?.giftType === "data"
                  ? `${giftDetails?.dataSize}MB`
                  : `₦${giftDetails?.amount.toLocaleString()}`}
              </span>
            </div>
            {giftDetails?.expiryDate && (
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="text-blue-700">Expires</span>
                <span className="font-semibold">
                  {new Date(giftDetails?.expiryDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Phone Card */}
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Recipient</h3>
          </div>
          <div className="space-y-2 text-sm text-green-900">
            <div className="flex justify-between items-center">
              <span className="text-green-700">Phone</span>
              <span className="font-mono font-semibold">
                {values.phoneNumber}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-green-200 pt-2">
              <span className="text-green-700">Operator</span>
              <Badge className={getOperatorColor(giftDetails?.operator).bg}>
                {giftDetails?.operator}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.div
        variants={itemVariants}
        className="text-center text-sm text-muted-foreground"
      >
        <p>Redirecting to home in</p>
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
