import { db } from "@/lib/db";
import { requireUser, errorJson, json } from "@/lib/api-helpers";

/**
 * POST /api/health/sync/request — the web "Sync Now" button. The website
 * cannot wake the phone directly, so it sets a request flag that the
 * companion app's 15-minute background poll picks up. For an instant sync the
 * user opens the app and taps Sync Now there.
 */
export async function POST() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const device = await db.healthCompanionDevice.findFirst({
    where: { userId: guard.user.id, revokedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!device) return errorJson("No companion app is paired.", 404);

  await db.healthCompanionDevice.update({
    where: { id: device.id },
    data: { syncRequestedAt: new Date() },
  });
  return json({ ok: true });
}
