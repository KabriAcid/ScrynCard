import { API_CONFIG } from "@/config/api";
import type { MobileOperator, NetworkDetectionResult } from "./types";

export class NetworkDetector {
  /**
   * Detect mobile operator from phone number prefix
   * Supports: 0XXXXXXXXXX (Nigerian format)
   */
  static detect(phoneNumber: string): NetworkDetectionResult {
    // Clean phone number
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Validate Nigerian format
    if (!this.isValidNigerianNumber(cleaned)) {
      return {
        operator: "MTN",
        isValid: false,
        phoneNumber,
        errorMessage:
          "Invalid Nigerian phone number format. Use 0XXXXXXXXXX or +2340XXXXXXXXX",
      };
    }

    // Extract 4-digit prefix (e.g., "0703" from "07031234567")
    const prefix = cleaned.substring(0, 4);

    // Detect operator from prefix
    for (const [operator, prefixes] of Object.entries(
      API_CONFIG.OPERATOR_PREFIXES
    )) {
      if (prefixes.includes(prefix)) {
        return {
          operator: operator as MobileOperator,
          isValid: true,
          phoneNumber: this.formatPhoneNumber(cleaned),
        };
      }
    }

    return {
      operator: "MTN",
      isValid: false,
      phoneNumber,
      errorMessage: "Phone number does not match any known operator",
    };
  }

  /**
   * Validate Nigerian phone number format
   */
  private static isValidNigerianNumber(phoneNumber: string): boolean {
    // Must be exactly 11 digits starting with 0, or 13 digits starting with 234
    const regex = /^(0[789][0-1]\d{8}|234[789][0-1]\d{8})$/;
    return regex.test(phoneNumber);
  }

  /**
   * Format phone to standard 0XXXXXXXXXX format
   */
  private static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.startsWith("234")) {
      return "0" + cleaned.substring(3);
    }

    return cleaned.startsWith("0") ? cleaned : "0" + cleaned;
  }

  /**
   * Get all operators (for UI dropdowns)
   */
  static getAllOperators(): MobileOperator[] {
    return Object.keys(API_CONFIG.OPERATOR_PREFIXES) as MobileOperator[];
  }
}
