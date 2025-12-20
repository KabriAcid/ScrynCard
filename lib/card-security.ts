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
 * Expected: "XXX-HHHH-HHHH-HHHH" (3 chars - 12 hex digits with delimiters)
 * Length check: 3 + 1 + 4 + 1 + 4 + 1 + 4 = 18 characters total
 * Clean length: 3 + 12 = 15 characters
 */
export function validateCardCode(code: string): boolean {
  // Remove hyphens for length check
  const cleanCode = code.replace(/-/g, "");

  // Must be 15 characters total (3 + 12)
  if (cleanCode.length !== 15) {
    return false;
  }

  const parts = code.split("-");

  // Must have exactly 4 parts: XXX-HHHH-HHHH-HHHH
  if (parts.length !== 4) {
    return false;
  }

  const [token, h1, h2, h3] = parts;

  // Validate token: 3 uppercase letters
  if (!token.match(/^[A-Z]{3}$/)) {
    return false;
  }

  // Validate each hash segment: 4 hex characters each (case-insensitive)
  if (
    !h1.match(/^[A-Fa-f0-9]{4}$/i) ||
    !h2.match(/^[A-Fa-f0-9]{4}$/i) ||
    !h3.match(/^[A-Fa-f0-9]{4}$/i)
  ) {
    return false;
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
 * Format card code with automatic hyphen insertion every 4 digits
 * Input: "KPNA3F7B9C2D4E5" -> Output: "KPN-A3F7-B9C2-D4E5"
 * Removes spaces and non-hex characters automatically
 */
export function formatCardCode(input: string): string {
  // Remove all non-alphanumeric characters
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Format: XXX-HHHH-HHHH-HHHH
  // Position: 0-2 (token), 3-6 (first hash), 7-10 (second hash), 11-14 (third hash)
  let result = "";

  for (let i = 0; i < cleaned.length && i < 15; i++) {
    // Add hyphens after positions 2, 6, 10
    if ((i === 3 || i === 7 || i === 11) && i < cleaned.length) {
      result += "-";
    }
    result += cleaned[i];
  }

  return result;
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
