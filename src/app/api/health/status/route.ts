import { db } from "@/lib/db";
import { requireUser, json } from "@/lib/api-helpers";

/**
 * GET /api/health/status — connection status for the Health Data section:
 * paired companion device (with its last sync bookkeeping and the Health
 * Connect data origins it reported), any pending pairing code, and the
 * metrics that actually have synchronized records.
 */
export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const userId = guard.user.id;

  const [devices, codes, metricsAvailable] = await Promise.all([
    db.healthCompanionDevice.findMany({
      where: { userId, revokedAt: null },
      orderBy: { createdAt: "desc" },
      take: 1,
    }),
    db.healthPairingCode.findFirst({
      where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, expiresAt: true },
    }),
    db.healthReading.groupBy({
      by: ["metric"],
      where: { userId, source: { startsWith: "health_connect:" } },
      _count: { metric: true },
      _max: { recordedAt: true },
    }),
  ]);

  const device = devices[0] ?? null;
  return json({
    device: device
      ? {
          id: device.id,
          label: device.label,
          model: device.model,
          osVersion: device.osVersion,
          appVersion: device.appVersion,
          pairedAt: device.createdAt.toISOString(),
          permissions: device.permissionsJson ? (JSON.parse(device.permissionsJson) as string[]) : [],
          origins: device.originsJson ? (JSON.parse(device.originsJson) as string[]) : [],
          lastSyncAt: device.lastSyncAt?.toISOString() ?? null,
          lastSyncStatus: device.lastSyncStatus,
          lastSyncMessage: device.lastSyncMessage,
          lastSyncCreated: device.lastSyncCreated,
          lastSyncTotal: device.lastSyncTotal,
          syncRequested: device.syncRequestedAt != null && device.syncRequestedAt.getTime() > Date.now() - 30 * 60 * 1000,
        }
      : null,
    pairing: codes ? { createdAt: codes.createdAt.toISOString(), expiresAt: codes.expiresAt.toISOString() } : null,
    metricsAvailable: metricsAvailable
      .map((m) => ({ metric: m.metric, count: m._count.metric, lastAt: m._max.recordedAt?.toISOString() ?? null }))
      .sort((a, b) => a.metric.localeCompare(b.metric)),
  });
}
