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
      serialNumber.length === 6 && /^\d{6}$/.test(serialNumber);
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

  const serialValid = serialNumber.length === 6;
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
          <Input
            id="serial-number"
            type="text"
            placeholder="123456"
            value={serialNumber}
            onChange={handleSerialChange}
            disabled={disabled}
            maxLength={6}
            className={cn(
              "font-mono text-base tracking-wider h-10 w-full lg:w-32",
              serialValid ? "border-primary/50 bg-primary/5" : ""
            )}
          />
        </motion.div>

        {/* Card Code Input */}
        <motion.div
          className="w-full lg:flex-1 space-y-2"
          variants={itemVariants}
        >
          <Label htmlFor="card-code" className="text-sm">
            Card Code
          </Label>
          <Input
            id="card-code"
            type="text"
            placeholder="XXX-HHHH-HHHH-HHHH-HHHH"
            value={cardCode}
            onChange={handleCodeChange}
            disabled={disabled}
            maxLength={23}
            className={cn(
              "font-mono text-base tracking-wider h-10",
              codeValid ? "border-primary/50 bg-primary/5" : ""
            )}
          />
        </motion.div>
      </div>

      {/* Status Message */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center gap-2 text-primary text-sm"
        >
          <span className="font-medium">✓ Card validated successfully</span>
        </motion.div>
      )}
    </motion.div>
  );
}
