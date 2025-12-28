import prisma from "@/lib/prisma";
import { generateTokenPair } from "./jwt";
import { randomUUID } from "crypto";

interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
}

/**
 * Create a new session for a user (on login)
 */
export async function createSession(
  userId: string,
  role: "POLITICIAN" | "ADMIN",
  email: string,
  name: string,
  metadata: SessionMetadata
) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

  // Generate tokens
  const { accessToken, refreshToken, refreshJti } = await generateTokenPair(
    userId,
    sessionId,
    role,
    email,
    name
  );

  // Store session in database
  await prisma.session.create({
    data: {
      sessionId,
      politicianId: userId,
      currentRefreshJti: refreshJti,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      deviceInfo: metadata.deviceInfo,
      status: "ACTIVE",
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    sessionId,
  };
}

/**
 * Rotate refresh token (called every 3 minutes or on access token expiry)
 * This implements the refresh token rotation pattern with replay attack detection
 */
export async function rotateRefreshToken(
  incomingRefreshToken: string,
  payload: { sub: string; sessionId: string; jti: string }
) {
  const { sub: userId, sessionId, jti: incomingJti } = payload;

  // Get session from database
  const session = await prisma.session.findUnique({
    where: { sessionId },
    include: { politician: true },
  });

  if (!session || session.status !== "ACTIVE") {
    throw new Error("INVALID_SESSION");
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await prisma.session.update({
      where: { id: session.id },
      data: { status: "EXPIRED" },
    });
    throw new Error("SESSION_EXPIRED");
  }

  // CRITICAL: Check if incoming JTI matches current JTI
  // If not, it means another device/request already rotated the token
  // This indicates concurrent session or replay attack
  if (session.currentRefreshJti !== incomingJti) {
    // Revoke session immediately
    await prisma.session.update({
      where: { id: session.id },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
        revokedReason: "CONCURRENT_SESSION_DETECTED",
      },
    });
    throw new Error("CONCURRENT_SESSION_DETECTED");
  }

  // Generate new token pair
  const { accessToken, refreshToken, refreshJti } = await generateTokenPair(
    userId,
    sessionId,
    session.politician.role,
    session.politician.email,
    session.politician.name
  );

  // Atomically update session with new refresh JTI
  // Store old JTI in used_refresh_tokens for replay detection
  await prisma.$transaction([
    // Update current refresh JTI
    prisma.session.update({
      where: { id: session.id },
      data: {
        currentRefreshJti: refreshJti,
        lastSeenAt: new Date(),
      },
    }),
    // Mark old JTI as used
    prisma.usedRefreshToken.create({
      data: {
        jti: incomingJti,
        sessionId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Keep for 5 minutes
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Revoke a specific session
 */
export async function revokeSession(sessionId: string, reason?: string) {
  await prisma.session.update({
    where: { sessionId },
    data: {
      status: "REVOKED",
      revokedAt: new Date(),
      revokedReason: reason || "USER_LOGOUT",
    },
  });
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllUserSessions(userId: string, reason?: string) {
  await prisma.session.updateMany({
    where: {
      politicianId: userId,
      status: "ACTIVE",
    },
    data: {
      status: "REVOKED",
      revokedAt: new Date(),
      revokedReason: reason || "USER_LOGOUT_ALL",
    },
  });
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string) {
  return await prisma.session.findMany({
    where: {
      politicianId: userId,
      status: "ACTIVE",
      expiresAt: { gte: new Date() },
    },
    orderBy: { lastSeenAt: "desc" },
    select: {
      sessionId: true,
      ipAddress: true,
      userAgent: true,
      deviceInfo: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
}

/**
 * Clean up expired used refresh tokens (run as cron job)
 */
export async function cleanupExpiredTokens() {
  await prisma.usedRefreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  await prisma.session.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: new Date() },
    },
    data: {
      status: "EXPIRED",
    },
  });
}
