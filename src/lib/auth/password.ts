import * as argon2 from "argon2";

/**
 * Hash password using Argon2id (most secure variant)
 * Argon2id is resistant to both side-channel and GPU attacks
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verify password against Argon2 hash
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    return false;
  }
}

/**
 * Check if password needs rehashing (algorithm parameters changed)
 */
export function needsRehash(hash: string): boolean {
  return argon2.needsRehash(hash, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}
