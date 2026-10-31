import { db } from "@/lib/db";
import { json } from "@/lib/api-helpers";
import { requireDevice } from "@/lib/health-companion";

/**
 * GET /api/health/poll — lightweight endpoint the companion app's background
 * worker calls every 15 minutes. Returns whether the web "Sync Now" requested
 * a sync (flag lives for 30 minutes) plus the last sync bookkeeping so the app
 * screen can mirror the website's status.
 */
export async function GET(request: Request) {
  const auth = await requireDevice(request);
  if (!auth) {
    return json({ error: "Companion authentication required." }, 401);
  }
  const device = auth.device;
  const pending =
    device.syncRequestedAt != null && device.syncRequestedAt.getTime() > Date.now() - 30 * 60 * 1000;

  return json({
    requestPending: pending,
    lastSyncAt: device.lastSyncAt?.toISOString() ?? null,
    lastSyncStatus: device.lastSyncStatus,
    lastSyncMessage: device.lastSyncMessage,
    lastSyncCreated: device.lastSyncCreated,
    lastSyncTotal: device.lastSyncTotal,
    serverTime: new Date().toISOString(),
  });
}
