import { cookies } from "next/headers";

const REFRESH_TOKEN_COOKIE = "scryn_refresh_token";
const ACCESS_TOKEN_COOKIE = "scryn_access_token";

// Cookie options
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // HTTPS only in production
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Set refresh token in HTTP-only cookie (14 days)
 */
export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    ...cookieOptions,
    maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
  });
}

/**
 * Set access token in HTTP-only cookie (3 minutes)
 * Note: For maximum security, access tokens can be stored in memory
 * but we use cookies for simplicity in SSR/middleware
 */
export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...cookieOptions,
    maxAge: 3 * 60, // 3 minutes in seconds
  });
}

/**
 * Get refresh token from cookie
 */
export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * Get access token from cookie
 */
export async function getAccessTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

/**
 * Clear all auth cookies (on logout)
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

/**
 * Set both tokens at once (on login/refresh)
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  await Promise.all([
    setAccessTokenCookie(accessToken),
    setRefreshTokenCookie(refreshToken),
  ]);
}
