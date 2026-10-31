import { db } from "@/lib/db";
import { requireUser, errorJson, json } from "@/lib/api-helpers";
import { generatePairingCode, sha256, PAIRING_TTL_MINUTES } from "@/lib/health-companion";

/**
 * POST /api/health/pairing/create — web user generates a single-use pairing
 * code shown in the Health Data section. The companion app exchanges it at
 * /api/health/pairing/complete within the TTL.
 */
export async function POST() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const code = generatePairingCode();
  const expiresAt = new Date(Date.now() + PAIRING_TTL_MINUTES * 60 * 1000);
  await db.healthPairingCode.create({
    data: { codeHash: sha256(code), userId: guard.user.id, expiresAt },
  });

  return json({ code, expiresAt: expiresAt.toISOString(), ttlMinutes: PAIRING_TTL_MINUTES }, 201);
}
