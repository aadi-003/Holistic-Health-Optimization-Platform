import { db } from "@/lib/db";
import { errorJson, json, safeJson } from "@/lib/api-helpers";
import { sha256, generateDeviceToken, PAIRING_MAX_ATTEMPTS } from "@/lib/health-companion";

/**
 * POST /api/health/pairing/complete — the companion app exchanges a pairing
 * code for its device sync token. No web session: the code IS the credential.
 * Codes are single-use, expire after 10 minutes and tolerate at most 5 failed
 * attempts against a known code before becoming invalid. The sync token is
 * returned exactly once; only its sha256 hash is stored.
 */
interface CompleteBody {
  code?: string;
  deviceLabel?: string;
  model?: string;
  osVersion?: string;
  appVersion?: string;
}

export async function POST(request: Request) {
  const body = await safeJson<CompleteBody>(request);
  const code = (body?.code ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9]{6,10}$/.test(code)) return errorJson("Invalid pairing code format.", 422);

  const record = await db.healthPairingCode.findUnique({ where: { codeHash: sha256(code) } });
  if (!record) return errorJson("Unknown pairing code.", 404);
  if (record.usedAt) return errorJson("This pairing code was already used.", 409);
  if (record.expiresAt.getTime() < Date.now()) {
    return errorJson("This pairing code has expired. Generate a new one on the website.", 410);
  }
  if (record.attempts >= PAIRING_MAX_ATTEMPTS) {
    return errorJson("Too many attempts with this code. Generate a new one on the website.", 429);
  }

  const deviceLabel = (body?.deviceLabel ?? "Android phone").trim().slice(0, 60) || "Android phone";
  const model = body?.model?.trim().slice(0, 80) || null;
  const osVersion = body?.osVersion?.trim().slice(0, 40) || null;
  const appVersion = body?.appVersion?.trim().slice(0, 40) || null;

  // Single-use claim, atomic against double-submission races.
  const claimed = await db.healthPairingCode.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date(), deviceLabel },
  });
  if (claimed.count === 0) return errorJson("This pairing code was already used.", 409);

  const rawToken = generateDeviceToken();
  const device = await db.healthCompanionDevice.create({
    data: {
      userId: record.userId,
      tokenHash: sha256(rawToken),
      label: deviceLabel,
      model,
      osVersion,
      appVersion,
    },
  });

  const user = await db.user.findUnique({ where: { id: record.userId }, select: { name: true } });
  return json({ token: rawToken, deviceId: device.id, user: { name: user?.name ?? null } }, 201);
}
