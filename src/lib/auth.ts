import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";

// Environment variables for JWT secrets
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "your-access-token-secret-change-in-production";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "your-refresh-token-secret-change-in-production";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

export type UserRole = "POLITICIAN" | "ADMIN";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: "scryn-app",
    audience: "scryn-users",
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: "scryn-app",
    audience: "scryn-users",
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateAuthTokens(payload: TokenPayload): AuthTokens {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      issuer: "scryn-app",
      audience: "scryn-users",
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Access token verification failed:", error);
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: "scryn-app",
      audience: "scryn-users",
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return null;
  }
}

/**
 * Set auth cookies (httpOnly, secure, sameSite)
 */
export async function setAuthCookies(tokens: AuthTokens): Promise<void> {
  const cookieStore = await cookies();

  // Access token cookie (short-lived)
  cookieStore.set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });

  // Refresh token cookie (long-lived)
  cookieStore.set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("accessToken");
  return cookie?.value || null;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("refreshToken");
  return cookie?.value || null;
}

/**
 * Clear auth cookies (logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

/**
 * Get current authenticated user from access token
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const payload = verifyAccessToken(token);
  return payload;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    // Invalid refresh token, clear cookies
    await clearAuthCookies();
    return null;
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(payload);

  // Update access token cookie
  const cookieStore = await cookies();
  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });

  return newAccessToken;
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/**
 * Check if user has politician role
 */
export async function isPolitician(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "POLITICIAN";
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<TokenPayload> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(): Promise<TokenPayload> {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return user;
}

/**
 * Require politician role - throws if not politician
 */
export async function requirePolitician(): Promise<TokenPayload> {
  const user = await requireAuth();

  if (user.role !== "POLITICIAN") {
    throw new Error("Politician access required");
  }

  return user;
}
