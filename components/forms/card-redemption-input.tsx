import React, { useState, useEffect } from "react";
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

  return (
    <div className="space-y-6">
      {/* Serial Number Input */}
      <div className="space-y-2">
        <Label htmlFor="serial-number">Serial Number</Label>
        <div className="relative">
          <Input
            id="serial-number"
            type="text"
            placeholder="6-digit number (e.g., 123456)"
            value={serialNumber}
            onChange={handleSerialChange}
            disabled={disabled}
            maxLength={6}
            className={cn(
              "font-mono text-lg tracking-widest",
              serialValid ? "border-green-500 bg-green-50" : "border-gray-300"
            )}
          />
          {serialValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
          {serialNumber.length > 0 && !serialValid && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
          )}
        </div>
        <p className="text-xs text-gray-500">
          {serialNumber.length}/6 digits • Found on your scratch card
        </p>
      </div>

      {/* Card Code Input with Auto-formatting */}
      <div className="space-y-2">
        <Label htmlFor="card-code">Card Code</Label>
        <div className="relative">
          <Input
            id="card-code"
            type="text"
            placeholder="Type the 16-digit code (auto-formatted)"
            value={cardCode}
            onChange={handleCodeChange}
            disabled={disabled}
            maxLength={23} // 3 + 1 + 4 + 1 + 4 + 1 + 4 + 1 + 4 = 23
            className={cn(
              "font-mono text-lg tracking-widest",
              codeValid ? "border-green-500 bg-green-50" : "border-gray-300"
            )}
          />
          {codeValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
          {cardCode.length > 0 && !codeValid && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
          )}
        </div>
        <p className="text-xs text-gray-500">
          Format: XXX-HHHH-HHHH-HHHH-HHHH
          {cardCode.length > 0 &&
            ` (${cardCode.replace(/-/g, "").length}/19 characters)`}
        </p>
      </div>

      {/* Validation Summary */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Validation Status</span>
          {isValid ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Ready to Redeem</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {serialNumber.length === 0 && cardCode.length === 0
                ? "Enter both fields"
                : !serialValid
                ? "Serial number incomplete"
                : !codeValid
                ? "Card code invalid"
                : "Checking..."}
            </div>
          )}
        </div>
      </div>

      {/* Debug Info (dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="rounded-lg bg-gray-100 p-3 text-xs font-mono">
          <div>
            Serial: {serialNumber || "(empty)"} [Valid: {String(serialValid)}]
          </div>
          <div>
            Code: {cardCode || "(empty)"} [Valid: {String(codeValid)}]
          </div>
        </div>
      )}
    </div>
  );
}
