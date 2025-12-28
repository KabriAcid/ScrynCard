import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validateCardCode,
  formatCardCode,
  formatSerialNumber,
} from "@/lib/card-security";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardRedemptionInputProps {
  serialNumber: string;
  cardCode: string;
  onSerialChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  disabled?: boolean;
}

export function CardRedemptionInput({
  serialNumber,
  cardCode,
  onSerialChange,
  onCodeChange,
  disabled = false,
}: CardRedemptionInputProps) {
  const [touched, setTouched] = useState({
    serial: false,
    code: false,
  });

  // Validate serial number (format: XX-XXXXXX)
  const serialValid =
    serialNumber.length === 9 && /^[A-Z]{2}-[A-Z0-9]{6}$/.test(serialNumber);

  // Validate card code - must be exactly 15 characters (without hyphens)
  const cleanCode = cardCode.replace(/-/g, "");
  const codeValid =
    cleanCode.length === 15 && /^[A-Z]{3}[A-Za-z0-9]{12}$/.test(cleanCode);

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSerialNumber(e.target.value);
    onSerialChange(formatted);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardCode(e.target.value);
    onCodeChange(formatted);
  };

  // Determine error messages
  const serialError =
    touched.serial && serialNumber.length > 0 && !serialValid
      ? "Format: 2 letters, hyphen, 6 alphanumeric"
      : null;
  const codeError =
    touched.code && cardCode.length > 0 && !codeValid
      ? "Card code must be exactly 15 characters"
      : null;

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 },
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

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {/* Input Row - Stack on Mobile, Row on Desktop */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-start lg:items-end">
        {/* Serial Number Input */}
        <motion.div
          className="w-full lg:w-auto space-y-2"
          variants={itemVariants}
        >
          <Label htmlFor="serial-number" className="text-sm font-medium">
            Serial Number
          </Label>
          <div className="relative">
            <Input
              id="serial-number"
              type="text"
              name="serial_number"
              placeholder="ABC-123456"
              value={serialNumber}
              onChange={handleSerialChange}
              onBlur={() => setTouched({ ...touched, serial: true })}
              disabled={disabled}
              maxLength={9}
              className={cn(
                "font-mono text-base tracking-wider h-10 w-full lg:w-40",
                serialValid && serialNumber.length > 0
                  ? "border-green-500 bg-green-50"
                  : ""
              )}
            />
            {serialValid && serialNumber.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
            {touched.serial && serialNumber.length > 0 && !serialValid && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Card Code Input */}
        <motion.div
          className="w-full lg:flex-1 space-y-2"
          variants={itemVariants}
        >
          <Label htmlFor="card-code" className="text-sm font-medium">
            Card Code
          </Label>
          <div className="relative">
            <Input
              id="card-code"
              type="text"
              name="card_code"
              placeholder="ABC-1234-5678-9012"
              value={cardCode}
              onChange={handleCodeChange}
              onBlur={() => setTouched({ ...touched, code: true })}
              disabled={disabled}
              maxLength={18}
              className={cn(
                "font-mono text-base tracking-wider h-10",
                codeValid && cardCode.length > 0
                  ? "border-green-500 bg-green-50"
                  : ""
              )}
            />
            {codeValid && cardCode.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
            {codeError && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={checkmarkVariants}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Unified Status/Error Messages Section - Fixed Height */}
      <div className="h-6">
        {serialError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 text-red-600 text-xs"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{serialError}</span>
          </motion.div>
        )}
        {codeError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 text-red-600 text-xs"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{codeError}</span>
          </motion.div>
        )}
        {serialValid && codeValid && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 text-green-600 text-xs"
          >
            <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
            <span>Both fields valid - ready to continue</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
