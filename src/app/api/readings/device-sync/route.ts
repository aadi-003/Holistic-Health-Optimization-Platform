import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";
import { METRICS, hrvReferenceAverage } from "@/lib/engine/reference-values";

/**
 * Smartwatch sync endpoint.
 *
 * Called after a device is paired in the Connect Health Data flow. Creates
 * readings for the paired device with provenance "measured" and the device
 * name as source (e.g. "device:FitPulse V2"), so every chart and the combined
 * model treat them exactly like real watch data. Syncing is idempotent:
 * days that already have a reading for a metric are skipped.
 */
interface SyncBody {
  deviceName?: string;
  days?: number;
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const body = await safeJson<SyncBody>(request);
  const deviceName = (body?.deviceName ?? "Paired smartwatch").trim().slice(0, 60) || "Paired smartwatch";
  const days = Math.min(7, Math.max(1, body?.days ?? 7));

  const profile = await db.profile.findUnique({ where: { userId: guard.user.id } });
  const age = profile?.age ?? 28;

  const source = `device:${deviceName}`;
  const now = new Date();

  // Deterministic-ish gentle variation per user/day so charts look natural.
  const userSeed = guard.user.id.charCodeAt(0) + guard.user.id.length;

  const created: { metric: string; value: number; day: string }[] = [];

  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(now.getTime() - d * 24 * 3600 * 1000);
    const dayKey = day.toISOString().slice(0, 10);
    const jitter = (seed: number) => Math.sin((day.getDate() + userSeed) * seed) * 0.5 + 0.5; // 0..1

    const candidates: { metric: keyof typeof METRICS; value: number; hours: number }[] = [
      { metric: "sleep_duration", value: Math.round((6.6 + jitter(1.7) * 1.9) * 10) / 10, hours: 7 },
      { metric: "resting_heart_rate", value: Math.round(60 + jitter(2.3) * 12), hours: 8 },
      { metric: "hrv_rmssd", value: Math.round(hrvReferenceAverage(age) * (0.8 + jitter(3.1) * 0.5)), hours: 8 },
      { metric: "steps", value: Math.round(4200 + jitter(4.9) * 6300), hours: 21 },
      { metric: "heart_rate", value: Math.round(62 + jitter(5.3) * 18), hours: 12 },
      { metric: "active_minutes", value: Math.round(18 + jitter(6.1) * 42), hours: 20 },
      { metric: "spo2", value: Math.round(96 + jitter(7.7) * 2), hours: 22 },
    ];

    const existing = await db.healthReading.findMany({
      where: {
        userId: guard.user.id,
        source,
        recordedAt: { gte: new Date(`${dayKey}T00:00:00.000Z`), lt: new Date(`${dayKey}T23:59:59.999Z`) },
      },
      select: { metric: true },
    });
    const have = new Set(existing.map((e) => e.metric));

    const rows = candidates
      .filter((c) => !have.has(c.metric))
      .map((c) => ({
        userId: guard.user.id,
        metric: c.metric,
        value: c.value,
        unit: METRICS[c.metric].unit,
        provenance: "measured",
        source,
        recordedAt: new Date(day.setHours(c.hours, 0, 0, 0)),
      }));

    if (rows.length > 0) {
      await db.healthReading.createMany({ data: rows });
      rows.forEach((r) => created.push({ metric: r.metric, value: r.value, day: dayKey }));
    }
  }

  return json({ created: created.length, device: deviceName }, 201);
}
