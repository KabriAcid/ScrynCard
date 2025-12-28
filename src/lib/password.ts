import * as argon2 from 'argon2';

/**
 * Argon2 configuration for optimal security
 * Using Argon2id (hybrid mode) which is recommended for password hashing
 */
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id, // Hybrid mode (best of Argon2i and Argon2d)
  memoryCost: 65536, // 64 MB
  timeCost: 3, // Number of iterations
  parallelism: 4, // Number of threads
};

/**
 * Hash a password using Argon2id
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await argon2.hash(password, ARGON2_OPTIONS);
    return hash;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against its hash
 * @param hash - The stored hash
 * @param password - Plain text password to verify
 * @returns true if password matches, false otherwise
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    const isValid = await argon2.verify(hash, password);
    
    // If password is valid, check if hash needs rehashing
    // (e.g., if Argon2 parameters have been upgraded)
    if (isValid && argon2.needsRehash(hash, ARGON2_OPTIONS)) {
      console.log('Password hash needs rehashing with new parameters');
      // You can trigger a rehash here if needed
      // This would involve updating the stored hash in the database
    }
    
    return isValid;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * Check if a password meets minimum security requirements
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character',
    };
  }

  return { isValid: true };
}

/**
 * Generate a secure random password
 * @param length - Length of password to generate (default: 16)
 * @returns Randomly generated password
 */
export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = lowercase + uppercase + numbers + special;

  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
