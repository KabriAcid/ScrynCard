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

  // Validate card code - must be exactly 16 characters (without hyphens)
  const cleanCode = cardCode.replace(/-/g, "");
  const codeValid =
    cleanCode.length === 16 && /^[A-Z]{3}[A-Za-z0-9]{13}$/.test(cleanCode);

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSerialNumber(e.target.value);
    onSerialChange(formatted);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardCode(e.target.value);
    onCodeChange(formatted);
  };

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
          {touched.serial && serialNumber.length > 0 && !serialValid && (
            <p className="text-xs text-red-500 mt-1">
              Format: 2 letters, hyphen, 6 alphanumeric
            </p>
          )}
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
              placeholder="ABC-1234-5678-9000"
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
            {touched.code && cardCode.length > 0 && !codeValid && (
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
          {touched.code && cardCode.length > 0 && !codeValid && (
            <p className="text-xs text-red-500 mt-1">
              Card code must be exactly 16 characters (e.g., ABC1234567890123)
            </p>
          )}
        </motion.div>
      </div>

      {/* Status Message */}
      {serialValid && codeValid && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center gap-2 text-green-600 text-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-medium">
            Both fields valid - ready to continue
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
