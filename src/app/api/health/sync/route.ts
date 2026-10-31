import { db } from "@/lib/db";
import { errorJson, json, safeJson } from "@/lib/api-helpers";
import { requireDevice, SYNC_MAX_RECORDS, SYNC_MAX_AGE_DAYS } from "@/lib/health-companion";
import { COMPANION_METRICS, SYNC_LIMITS, type CompanionMetricKey } from "@/lib/health-metrics";

/**
 * POST /api/health/sync — companion app pushes Health Connect records.
 *
 * Auth: device sync token (Bearer). Each record: { metric, value, recordedAt,
 * origin } where origin is the Health Connect dataOrigin package (the phone
 * app that wrote the record, e.g. com.xiaomi.wearable = Mi Fitness). Records
 * are keyed by (user, metric, source, recordedAt): already-known rows with the
 * same value are skipped, changed values are updated — re-syncing is safe.
 */
interface SyncRecord {
  metric?: string;
  value?: number;
  recordedAt?: string;
  origin?: string;
}

interface SyncBody {
  permissions?: string[];
  records?: SyncRecord[];
  error?: string; // reported sync failure (e.g. permission revoked) without records
}

export async function POST(request: Request) {
  const auth = await requireDevice(request);
  if (!auth) return errorJson("Companion authentication required.", 401);
  const userId = auth.device.userId;
  const body = await safeJson<SyncBody>(request);
  if (!body) return errorJson("Invalid request body.");

  // Failure report without records (e.g. Health Connect permission revoked).
  if (!body.records?.length) {
    await db.healthCompanionDevice.update({
      where: { id: auth.device.id },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: body.error ? "error" : "success",
        lastSyncMessage: (body.error ?? "No new records.").slice(0, 200),
        lastSyncCreated: 0,
        lastSyncTotal: 0,
        syncRequestedAt: null,
        ...(body.permissions ? { permissionsJson: JSON.stringify(body.permissions.slice(0, 40)) } : {}),
      },
    });
    return json({ created: 0, updated: 0, skipped: 0, rejected: [], total: 0 });
  }

  if (body.records.length > SYNC_MAX_RECORDS) {
    return errorJson(`At most ${SYNC_MAX_RECORDS} records per request — split into batches.`, 413);
  }

  // ---- validate & normalise -------------------------------------------------
  const now = Date.now();
  const minDate = new Date(now - SYNC_MAX_AGE_DAYS * 24 * 3600 * 1000);
  const maxDate = new Date(now + 10 * 60 * 1000);
  const rejected: { index: number; reason: string }[] = [];
  const clean: { metric: CompanionMetricKey; value: number; recordedAt: Date; source: string }[] = [];
  const origins = new Set<string>();

  body.records.forEach((r, index) => {
    const metric = r.metric as CompanionMetricKey;
    const meta = COMPANION_METRICS[metric as keyof typeof COMPANION_METRICS];
    if (!meta) {
      rejected.push({ index, reason: `Unknown metric ${String(r.metric).slice(0, 40)}` });
      return;
    }
    const value = Number(r.value);
    if (!Number.isFinite(value)) {
      rejected.push({ index, reason: "Value must be a number" });
      return;
    }
    const limits = SYNC_LIMITS[metric];
    if (limits && (value < limits[0] || value > limits[1])) {
      rejected.push({ index, reason: `Value outside ${limits[0]}-${limits[1]} ${meta.unit}` });
      return;
    }
    const recordedAt = new Date(r.recordedAt ?? "");
    if (Number.isNaN(recordedAt.getTime())) {
      rejected.push({ index, reason: "Invalid recordedAt timestamp" });
      return;
    }
    if (recordedAt < minDate || recordedAt > maxDate) {
      rejected.push({ index, reason: "recordedAt outside the accepted window" });
      return;
    }
    const origin = (r.origin ?? "").trim().slice(0, 100);
    if (!origin || !/^[A-Za-z0-9._]+$/.test(origin)) {
      rejected.push({ index, reason: "Missing or invalid origin (Health Connect dataOrigin package)" });
      return;
    }
    origins.add(origin);
    clean.push({ metric, value: Math.round(value * 1000) / 1000, recordedAt, source: `health_connect:${origin}`.slice(0, 80) });
  });

  // ---- dedupe & upsert ------------------------------------------------------
  let created = 0;
  let updated = 0;
  let skipped = 0;
  if (clean.length > 0) {
    const windowStart = new Date(Math.min(...clean.map((c) => c.recordedAt.getTime())));
    const windowEnd = new Date(Math.max(...clean.map((c) => c.recordedAt.getTime())));
    const metrics = [...new Set(clean.map((c) => c.metric))];
    const existing = await db.healthReading.findMany({
      where: {
        userId,
        metric: { in: metrics },
        source: { startsWith: "health_connect:" },
        recordedAt: { gte: windowStart, lte: windowEnd },
      },
      select: { id: true, metric: true, source: true, recordedAt: true, value: true },
    });
    const byKey = new Map(existing.map((e) => [`${e.metric}|${e.source}|${e.recordedAt.toISOString()}`, e]));

    for (const c of clean) {
      const key = `${c.metric}|${c.source}|${c.recordedAt.toISOString()}`;
      const match = byKey.get(key);
      if (match) {
        if (Math.abs(match.value - c.value) > 1e-9) {
          await db.healthReading.update({ where: { id: match.id }, data: { value: c.value } });
          updated += 1;
        } else {
          skipped += 1;
        }
      } else {
        await db.healthReading.create({
          data: { userId, metric: c.metric, value: c.value, unit: COMPANION_METRICS[c.metric].unit, provenance: "measured", source: c.source, recordedAt: c.recordedAt },
        });
        byKey.set(key, { id: "", metric: c.metric, source: c.source, recordedAt: c.recordedAt, value: c.value });
        created += 1;
      }
    }
  }

  const total = clean.length;
  const status = rejected.length === 0 ? "success" : created + updated + skipped > 0 ? "partial" : "error";
  const message = rejected.length > 0 ? `${rejected.length} of ${body.records.length} records rejected (e.g. ${rejected[0].reason}).` : `${created} new, ${updated} updated, ${skipped} unchanged.`;

  // Merge previously-seen origins so the website keeps showing the source apps.
  const previousOrigins: string[] = auth.device.originsJson ? (JSON.parse(auth.device.originsJson) as string[]) : [];
  const mergedOrigins = [...new Set([...previousOrigins, ...origins])];

  await db.healthCompanionDevice.update({
    where: { id: auth.device.id },
    data: {
      lastSyncAt: new Date(),
      lastSyncStatus: status,
      lastSyncMessage: message.slice(0, 200),
      lastSyncCreated: created,
      lastSyncTotal: total,
      syncRequestedAt: null,
      originsJson: JSON.stringify(mergedOrigins.slice(0, 20)),
      ...(body.permissions ? { permissionsJson: JSON.stringify(body.permissions.slice(0, 40)) } : {}),
    },
  });

  return json({ created, updated, skipped, rejected: rejected.slice(0, 20), total, status });
}
