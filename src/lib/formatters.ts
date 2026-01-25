/**
 * Phone number formatting utilities for Nigerian phone numbers
 */

export class PhoneFormatter {
  /**
   * Format Nigerian phone number for display
   * Examples:
   * 07031234567 -> 0703 123 4567
   * 2348031234567 -> +234 803 123 4567
   * 08031234567 -> 0803 123 4567
   */
  static format(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Convert 234 prefix to 0
    let normalized = cleaned;
    if (cleaned.startsWith("234")) {
      normalized = "0" + cleaned.substring(3);
    }

    // Format as XXXX XXX XXXX
    if (normalized.length === 11) {
      return `${normalized.slice(0, 4)} ${normalized.slice(
        4,
        7
      )} ${normalized.slice(7)}`;
    }

    return phoneNumber;
  }

  /**
   * Normalize phone number to standard format (0XXXXXXXXXX)
   */
  static normalize(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Convert +234 or 234 prefix to 0
    if (cleaned.startsWith("234")) {
      return "0" + cleaned.substring(3);
    }

    return cleaned.startsWith("0") ? cleaned : "0" + cleaned;
  }

  /**
   * Format phone number for international use (+234XXXXXXXXXX)
   */
  static formatInternational(phoneNumber: string): string {
    const normalized = this.normalize(phoneNumber);
    return "+234" + normalized.substring(1);
  }

  /**
   * Mask phone number for display (show only last 4 digits)
   * 07031234567 -> 0703 *** 4567
   */
  static mask(phoneNumber: string): string {
    const formatted = this.format(phoneNumber);
    const parts = formatted.split(" ");
    if (parts.length === 3) {
      return `${parts[0]} *** ${parts[2]}`;
    }
    return formatted;
  }

  /**
   * Check if phone number is valid Nigerian format
   */
  static isValid(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Must start with 234 (country code) or 0
    if (!cleaned.startsWith("234") && !cleaned.startsWith("0")) {
      return false;
    }

    // Convert to 11-digit format for validation
    let normalized = cleaned;
    if (cleaned.startsWith("234")) {
      normalized = "0" + cleaned.substring(3);
    }

    // Must be exactly 11 digits
    return (
      normalized.length === 11 && normalized.match(/^0[0-9]{10}$/) !== null
    );
  }

  /**
   * Extract mobile operator prefix (first 4 digits)
   * 07031234567 -> 0703
   */
  static getOperatorPrefix(phoneNumber: string): string {
    const normalized = this.normalize(phoneNumber);
    return normalized.substring(0, 4);
  }

  /**
   * Format phone number with hyphens as user types
   * Automatically inserts hyphens at standard spacing: 0xxx-xxx-xxxx
   * 07031234567 -> 0703-123-4567
   */
  static formatWithHyphens(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length === 0) return "";
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }

    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
}

/**
 * Mask credit card number for display
 * 1234567890123456 -> **** **** **** 3456
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 4) return cleaned;
  return "**** **** **** " + cleaned.slice(-4);
}

/**
 * Format currency as Nigerian Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format data size (MB, GB)
 */
export function formatDataSize(sizeInMB: number): string {
  if (sizeInMB >= 1024) {
    return `${(sizeInMB / 1024).toFixed(1)}GB`;
  }
  return `${sizeInMB}MB`;
}
