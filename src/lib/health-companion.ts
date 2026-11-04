import crypto from "crypto";
import { db } from "@/lib/db";

/**
 * Server-side helpers for the Android companion (Health Connect) integration.
 *
 * Pairing model:
 *   1. Web (authenticated) creates a single-use 8-char code — 10 min TTL,
 *      max 5 failed attempts, stored as a sha256 hash.
 *   2. Companion app exchanges the code at POST /api/health/pairing/complete
 *      for a device sync token. Only the sha256 hash of the token is stored;
 *      the raw token is returned once and kept in the app's encrypted prefs.
 *   3. Every companion call authenticates with `Authorization: Bearer <token>`
 *      and is scoped to exactly one user + one device row. Disconnect revokes
 *      the token and deletes the readings that arrived through it.
 */

export const PAIRING_TTL_MINUTES = 10;
export const PAIRING_MAX_ATTEMPTS = 5;
export const SYNC_MAX_RECORDS = 2000;
/** Companion reads the last 30 days; the server accepts a slightly wider window. */
export const SYNC_MAX_AGE_DAYS = 45;

/** Unambiguous alphabet (no 0/O/1/I) — codes are read aloud or typed by hand. */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generatePairingCode(): string {
  const bytes = crypto.randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateDeviceToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export interface DeviceAuth {
  device: {
    id: string;
    userId: string;
    label: string;
    model: string | null;
    osVersion: string | null;
    appVersion: string | null;
    permissionsJson: string | null;
    originsJson: string | null;
    lastSyncAt: Date | null;
    lastSyncStatus: string | null;
    lastSyncMessage: string | null;
    lastSyncCreated: number | null;
    lastSyncTotal: number | null;
    syncRequestedAt: Date | null;
  };
}

/** Guard for companion routes: resolves the device from its bearer token or null. */
export async function requireDevice(request: Request): Promise<DeviceAuth | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;
  const device = await db.healthCompanionDevice.findUnique({
    where: { tokenHash: sha256(token) },
  });
  if (!device || device.revokedAt) return null;
  return { device };
}
