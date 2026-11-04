import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";

/**
 * POST /api/health/device/disconnect — revoke the paired companion app.
 * The sync token stops working immediately (revokedAt) and, mirroring the
 * platform's revoke rule, the readings that arrived through Health Connect
 * synchronization are deleted. Manual and Google Fit readings are untouched.
 */
interface DisconnectBody {
  deviceId?: string;
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<DisconnectBody>(request);

  const device = await db.healthCompanionDevice.findFirst({
    where: {
      userId: guard.user.id,
      revokedAt: null,
      ...(body?.deviceId ? { id: body.deviceId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  if (!device) return errorJson("No companion app is paired.", 404);

  await db.healthCompanionDevice.update({
    where: { id: device.id },
    data: { revokedAt: new Date(), syncRequestedAt: null },
  });
  const removed = await db.healthReading.deleteMany({
    where: { userId: guard.user.id, source: { startsWith: "health_connect:" } },
  });

  return json({ ok: true, removedReadings: removed.count });
}
