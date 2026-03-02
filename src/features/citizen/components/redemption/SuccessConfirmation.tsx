import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Gift, Phone, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RedemptionFormValues } from "./schema";

interface SuccessConfirmationProps {
  values: RedemptionFormValues;
  giftDetails: any;
  onComplete: () => void;
}

// Confetti particle component
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = [
    "bg-green-400",
    "bg-blue-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-purple-400",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 200 - 100;
  const randomRotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: 300,
        x: randomX,
        opacity: 0,
        rotate: randomRotation,
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut",
      }}
      className={`absolute w-2 h-2 rounded-full ${randomColor}`}
    />
  );
};

const checkmarkVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1],
      type: "spring",
      stiffness: 120,
      damping: 10,
    },
  },
};

const pulseVariants = {
  initial: { scale: 1, opacity: 0.6 },
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.6, 0, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 20, rotateX: 45 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const countdownVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    }
  },
  exit: {
    scale: 1.5,
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  },
};

export const SuccessConfirmation = ({
  values,
  giftDetails,
  onComplete,
}: SuccessConfirmationProps) => {
  const [countdown, setCountdown] = useState(5);
  const [showConfetti, setShowConfetti] = useState(true);

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

    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(confettiTimer);
    };
  }, [onComplete]);

  const getNetworkGradient = (network: string) => {
    const gradients: Record<string, string> = {
      MTN: "from-yellow-400 via-yellow-500 to-yellow-600",
      Airtel: "from-red-400 via-red-500 to-red-600",
      Glo: "from-green-400 via-green-500 to-green-600",
      "9Mobile": "from-blue-400 via-blue-500 to-blue-600",
    };
    return gradients[network] || "from-gray-400 via-gray-500 to-gray-600";
  };

  return (
    <motion.div
      key="success-screen"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex flex-col items-center justify-center gap-6 py-8 sm:py-12 px-4 overflow-hidden"
    >
      {/* Background Gradient Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-50 -z-10" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-300/30 to-emerald-400/30 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Confetti Particles */}
      {showConfetti && (
        <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.05} />
          ))}
        </div>
      )}

      {/* Success Icon with Pulsing Effect */}
      <div className="relative">
        {/* Pulse rings */}
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 rounded-full bg-green-400"
        />
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="absolute inset-0 rounded-full bg-green-400"
        />

        {/* Main checkmark circle */}
        <motion.div
          variants={checkmarkVariants}
          initial="initial"
          animate="animate"
          className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 shadow-2xl shadow-green-500/50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Check className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={3.5} />
          </motion.div>

          {/* Sparkle effects */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-2"
            animate={{
              rotate: [360, 180, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
          </motion.div>
        </motion.div>
      </div>

      {/* Success Message */}
      <motion.div variants={itemVariants} className="text-center px-4">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🎉 Redemption Successful!
        </motion.h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">
          Your {giftDetails?.giftType} gift has been sent successfully
        </p>
      </motion.div>

      {/* Gift Details Cards */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-md space-y-4"
      >
        {/* Gift Card with Glassmorphism */}
        <motion.div
          variants={cardVariants}
          className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl p-5 shadow-xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Gradient overlay */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl -z-10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <h3 className="font-bold text-foreground text-base sm:text-lg">
                Gift Details
              </h3>
            </div>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                <span className="text-muted-foreground font-medium">Type</span>
                <Badge className="capitalize bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
                  {giftDetails?.giftType}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                <span className="text-muted-foreground font-medium">Value</span>
                <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {giftDetails?.giftType === "data"
                    ? `${giftDetails?.dataSize}MB`
                    : `₦${giftDetails?.amount?.toLocaleString()}`}
                </span>
              </div>
              {giftDetails?.expiryDate && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground font-medium">Expires</span>
                  <span className="font-semibold text-foreground">
                    {new Date(giftDetails.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Phone Card with Network Gradient */}
        <motion.div
          variants={cardVariants}
          className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl p-5 shadow-xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Gradient overlay based on network */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getNetworkGradient(values.network)}/20 rounded-full blur-2xl -z-10`} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className={`p-2.5 bg-gradient-to-br ${getNetworkGradient(values.network)} rounded-xl shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <h3 className="font-bold text-foreground text-base sm:text-lg">
                Recipient Details
              </h3>
            </div>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                <span className="text-muted-foreground font-medium">Phone Number</span>
                <span className="font-mono font-bold text-foreground">
                  {values.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground font-medium">Network</span>
                <Badge className={`bg-gradient-to-r ${getNetworkGradient(values.network)} text-white border-0 shadow-md font-semibold`}>
                  {values.network}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Countdown and Action */}
      <motion.div
        variants={itemVariants}
        className="text-center space-y-4"
      >
        <div className="text-xs sm:text-sm text-muted-foreground font-medium">
          <p>Redirecting to homepage in</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={countdown}
              variants={countdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-3 inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-2xl shadow-primary/50"
            >
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {countdown}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          variant="outline"
          onClick={onComplete}
          className="mt-4 border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
        >
          Return to Home Now
        </Button>
      </motion.div>
    </motion.div>
  );
};
