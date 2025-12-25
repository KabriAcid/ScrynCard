/**
 * Card Code Security Utilities (Simplified)
 *
 * Simplified for development:
 * - 6-digit serial number
 * - 16-digit hex hash for card code
 * - 3-character random token (no party prefix)
 */

/**
 * Generate a serial number in format: XX-XXXXXX
 * Example: "AB-123456"
 * - 2 uppercase letters
 * - 6 alphanumeric characters
 */
export function generateSerialNumber(): string {
  const prefix = generate3CharToken().substring(0, 2); // 2 letters
  const suffix = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0"); // 6 digits
  return `${prefix}-${suffix}`;
}

/**
 * Generate 3-character random token (strategic alphabets A-Z)
 * Example: "KPN", "XYZ", "RQT"
 */
export function generate3CharToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 3; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Generate 16-digit hex hash for card code
 * Example: "A3F7B9C2D4E5F6A7"
 */
export function generate16DigitHash(): string {
  // Generate 8 random bytes and convert to 16 hex characters
  const buffer = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}

/**
 * Generate complete card code in format: XXX-HHHH-HHHH-HHHH
 * Example: "KPN-A3F7-B9C2-D4E5"
 *
 * Where:
 * - XXX: 3-character random token
 * - HHHH-HHHH-HHHH: 12-digit hex hash with delimiters every 4 digits
 */
export function generateCardCode(): string {
  const token = generate3CharToken();
  // Generate 6 random bytes (12 hex characters)
  const buffer = new Uint8Array(6);
  for (let i = 0; i < 6; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  const hash = Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
  // Format hash with delimiters: HHHH-HHHH-HHHH
  const formattedHash = [
    hash.substring(0, 4),
    hash.substring(4, 8),
    hash.substring(8, 12),
  ].join("-");
  return `${token}-${formattedHash}`;
}

/**
 * Validate card code format
 * Expected: First 3 characters must be uppercase letters, followed by any letters/digits
 * Minimum valid: "ABC" (3 letters)
 * Examples: "ABC123", "MVK-3JER-3EKJ-RERI", "XYZ-ABCD-EFGH-IJKL"
 */
export function validateCardCode(code: string): boolean {
  // Remove hyphens for clean validation
  const cleanCode = code.replace(/-/g, "");

  // Must have at least 3 characters
  if (cleanCode.length < 3) {
    return false;
  }

  // First 3 characters must be uppercase letters
  const token = cleanCode.substring(0, 3);
  if (!token.match(/^[A-Z]{3}$/)) {
    return false;
  }

  // Remaining characters (if any) must be alphanumeric (letters or digits)
  if (cleanCode.length > 3) {
    const remaining = cleanCode.substring(3);
    if (!remaining.match(/^[A-Za-z0-9]*$/)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate serial number format
 * Expected: XX-XXXXXX (2 letters - 6 alphanumeric)
 */
export function validateSerialNumber(serial: string): boolean {
  // Format: XX-XXXXXX (2 letters, hyphen, 6 digits/letters)
  return /^[A-Z]{2}-[A-Z0-9]{6}$/.test(serial);
}

/**
 * Format card code with automatic hyphen insertion
 * Input: "CDDFD939DLD0393" (15 chars) -> Output: "CDD-FD93-9DLD-0393"
 * Format: XXX-XXXX-XXXX-XXXX (3+4+4+4 = 15 characters)
 */
export function formatCardCode(input: string): string {
  // Remove all non-alphanumeric characters
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Format: XXX-XXXX-XXXX-XXXX (3+4+4+4 = 15 characters total)
  if (cleaned.length <= 3) {
    return cleaned;
  }
  if (cleaned.length <= 7) {
    return cleaned.substring(0, 3) + "-" + cleaned.substring(3);
  }
  if (cleaned.length <= 11) {
    return (
      cleaned.substring(0, 3) +
      "-" +
      cleaned.substring(3, 7) +
      "-" +
      cleaned.substring(7)
    );
  }
  return (
    cleaned.substring(0, 3) +
    "-" +
    cleaned.substring(3, 7) +
    "-" +
    cleaned.substring(7, 11) +
    "-" +
    cleaned.substring(11, 15)
  );
}

/**
 * Format serial number with automatic hyphen insertion
 * Input: "AB123456" -> Output: "AB-123456"
 */
export function formatSerialNumber(input: string): string {
  // Keep only alphanumeric and convert to uppercase
  const cleaned = input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, 8);

  // Format: XX-XXXXXX
  if (cleaned.length <= 2) {
    return cleaned;
  }

  return cleaned.substring(0, 2) + "-" + cleaned.substring(2, 8);
}

/**
 * Mask card code for display/logging
 * Shows only last 4 characters
 * Example: "KPN-A3F7B9C2D4E5F6A7" -> "****F6A7"
 */
export function maskCardCode(code: string): string {
  if (code.length < 4) return "****";
  return `****${code.slice(-4)}`;
}

/**
 * Mask serial number for display
 * Shows only last 3 characters
 * Example: "AB-123456" -> "***456"
 */
export function maskSerialNumber(serial: string): string {
  if (serial.length < 3) return "****";
  return `***${serial.slice(-3)}`;
}
