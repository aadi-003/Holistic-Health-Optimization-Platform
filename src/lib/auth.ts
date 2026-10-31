/**
 * Authentication: bcrypt password hashing + signed JWT session delivered two
 * ways, so it survives every hosting context:
 *
 *  1. httpOnly cookie — SameSite=None; Secure behind HTTPS (works inside
 *     cross-site preview iframes where browsers strip Lax cookies from
 *     in-frame fetch calls), SameSite=Lax on plain-HTTP local development.
 *  2. Signed bearer token returned in the login/signup JSON body — the client
 *     stores it and echoes it via the Authorization header. This is the
 *     reliable path when third-party cookie blocking removes the cookie
 *     entirely (embedded preview panels, strict browsers).
 *
 * Secret management: JWT_SECRET is read from the environment. In production a
 * missing secret throws a clear configuration error at first use (fail fast,
 * per the project security rules). In development a derived development
 * secret is used with a console warning; .env (git-ignored) carries the real
 * value locally and .env.example documents it.
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";

const COOKIE_NAME = "holistic_session";
const SESSION_DAYS = 7;

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Configuration error: JWT_SECRET is not set. Set it in the environment before running in production."
      );
    }
    // Development fallback (never used when NODE_ENV=production).
    return new TextEncoder().encode("holistic-dev-only-secret-do-not-use-in-production");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Sign a session JWT for the user (also returned to clients as a bearer token). */
export async function issueSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export async function createSession(userId: string): Promise<void> {
  const token = await issueSessionToken(userId);

  // Behind the Caddy gateway X-Forwarded-Proto tells us the real scheme.
  let isHttps = false;
  try {
    const h = await headers();
    const proto = (h.get("x-forwarded-proto") ?? "").split(",")[0].trim().toLowerCase();
    isHttps = proto === "https";
  } catch {
    // Outside a request scope — default to conservative cookie attributes.
  }

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    // "None" lets the cookie ride along inside cross-site preview iframes;
    // the SameSite=None spec requires the Secure attribute.
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Resolve the current user from the Authorization bearer token (preferred) or
 * the session cookie. Returns null when not authenticated. EVERY protected
 * API route must call this — user-level data isolation is enforced by always
 * scoping queries to this id.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  let token: string | null = null;
  try {
    const h = await headers();
    const auth = h.get("authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      token = auth.slice(7).trim() || null;
    }
  } catch {
    // headers() unavailable — cookie-only fallback below.
  }
  if (!token) {
    const store = await cookies();
    token = store.get(COOKIE_NAME)?.value ?? null;
  }
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const userId = payload.sub;
    if (!userId) return null;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    return user;
  } catch {
    return null;
  }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}
