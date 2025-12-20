import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validateCardCode,
  validateSerialNumber,
  formatCardCode,
  formatSerialNumber,
} from "@/lib/card-security";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardRedemptionInputProps {
  onValidChange?: (
    isValid: boolean,
    data?: { serial: string; code: string }
  ) => void;
  disabled?: boolean;
}

export function CardRedemptionInput({
  onValidChange,
  disabled = false,
}: CardRedemptionInputProps) {
  const [serialNumber, setSerialNumber] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Validate when either field changes
  useEffect(() => {
    const serialValid =
      serialNumber.length === 9 && /^[A-Z]{2}-[A-Z0-9]{6}$/.test(serialNumber);
    const codeValid = validateCardCode(cardCode);
    const valid = serialValid && codeValid;

    setIsValid(valid);
    onValidChange?.(
      valid,
      valid ? { serial: serialNumber, code: cardCode } : undefined
    );
  }, [serialNumber, cardCode, onValidChange]);

  // Handle serial number input with real-time validation
  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSerialNumber(e.target.value);
    setSerialNumber(formatted);
  };

  // Handle card code input with auto-formatting and delimiters
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardCode(e.target.value);
    setCardCode(formatted);
  };

  const serialValid = serialNumber.length === 9;
  const codeValid = validateCardCode(cardCode);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  };

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Input Row - Stack on Mobile, Row on Desktop */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-start lg:items-end">
        {/* Serial Number Input */}
        <motion.div
          className="w-full lg:w-auto space-y-2"
          variants={itemVariants}
        >
          <Label htmlFor="serial-number" className="text-sm">
            Serial
          </Label>
          <div className="relative">
            <Input
              id="serial-number"
              type="text"
              placeholder="AB-123456"
              value={serialNumber}
              onChange={handleSerialChange}
              disabled={disabled}
              maxLength={9}
              className={cn(
                "font-mono text-base tracking-wider h-10 w-full lg:w-40",
                serialValid ? "border-green-500 bg-green-50" : "border-gray-300"
              )}
            />
            {serialValid && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
            {serialNumber.length > 0 && !serialValid && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Card Code Input */}
        <motion.div
          className="w-full lg:flex-1 space-y-2"
          variants={itemVariants}
        >
          <Label htmlFor="card-code" className="text-sm">
            Card Code
          </Label>
          <div className="relative">
            <Input
              id="card-code"
              type="text"
              placeholder="XXX-HHHH-HHHH-HHHH"
              value={cardCode}
              onChange={handleCodeChange}
              disabled={disabled}
              maxLength={18}
              className={cn(
                "font-mono text-base tracking-wider h-10",
                codeValid ? "border-green-500 bg-green-50" : "border-gray-300"
              )}
            />
            {codeValid && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
            {cardCode.length > 0 && !codeValid && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Status Message */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center gap-2 text-green-600 text-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-medium">Ready to redeem</span>
        </motion.div>
      )}
    </motion.div>
  );
}
