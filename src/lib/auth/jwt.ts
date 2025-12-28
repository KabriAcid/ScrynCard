import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "fallback-access-secret-change-in-production"
);

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ||
    "fallback-refresh-secret-change-in-production"
);

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = "3m"; // 3 minutes
export const REFRESH_TOKEN_EXPIRY = "14d"; // 14 days (but rotated frequently)

export interface AccessTokenPayload {
  sub: string; // userId (politicianId)
  sessionId: string;
  role: "POLITICIAN" | "ADMIN";
  email: string;
  name: string;
  jti: string; // JWT ID for access token
}

export interface RefreshTokenPayload {
  sub: string; // userId (politicianId)
  sessionId: string;
  jti: string; // JWT ID for refresh token (critical for rotation)
}

/**
 * Generate access token (short-lived, 3 minutes)
 */
export async function generateAccessToken(
  userId: string,
  sessionId: string,
  role: "POLITICIAN" | "ADMIN",
  email: string,
  name: string
): Promise<string> {
  const jti = randomUUID();

  return await new SignJWT({
    sub: userId,
    sessionId,
    role,
    email,
    name,
    jti,
  } as AccessTokenPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET);
}

/**
 * Generate refresh token (long-lived but rotated on each refresh)
 */
export async function generateRefreshToken(
  userId: string,
  sessionId: string
): Promise<{ token: string; jti: string }> {
  const jti = randomUUID();

  const token = await new SignJWT({
    sub: userId,
    sessionId,
    jti,
  } as RefreshTokenPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_TOKEN_SECRET);

  return { token, jti };
}

/**
 * Verify and decode access token
 */
export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload as AccessTokenPayload;
  } catch (error) {
    // Token expired, invalid, or tampered
    return null;
  }
}

/**
 * Verify and decode refresh token
 */
export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return payload as RefreshTokenPayload;
  } catch (error) {
    // Token expired, invalid, or tampered
    return null;
  }
}

/**
 * Generate both tokens at once (for login)
 */
export async function generateTokenPair(
  userId: string,
  sessionId: string,
  role: "POLITICIAN" | "ADMIN",
  email: string,
  name: string
) {
  const [accessToken, refreshTokenData] = await Promise.all([
    generateAccessToken(userId, sessionId, role, email, name),
    generateRefreshToken(userId, sessionId),
  ]);

  return {
    accessToken,
    refreshToken: refreshTokenData.token,
    refreshJti: refreshTokenData.jti,
  };
}
