import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";
import { METRICS, type MetricKey } from "@/lib/engine/reference-values";

const VALID_METRICS = Object.keys(METRICS) as MetricKey[];

export async function GET(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? 30)));
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);

  const readings = await db.healthReading.findMany({
    where: { userId: guard.user.id, recordedAt: { gte: since } },
    orderBy: { recordedAt: "desc" },
    take: 2000,
  });

  // Latest reading per metric + provenance coverage.
  const latest: Record<string, { value: number; unit: string; provenance: string; recordedAt: string; source: string }> = {};
  const provenanceCounts: Record<string, number> = {};
  for (const r of readings) {
    if (!latest[r.metric]) {
      latest[r.metric] = { value: r.value, unit: r.unit, provenance: r.provenance, recordedAt: r.recordedAt.toISOString(), source: r.source };
    }
    provenanceCounts[r.provenance] = (provenanceCounts[r.provenance] ?? 0) + 1;
  }

  return json({
    readings: readings.map((r) => ({
      id: r.id,
      metric: r.metric,
      value: r.value,
      unit: r.unit,
      provenance: r.provenance,
      source: r.source,
      recordedAt: r.recordedAt.toISOString(),
    })),
    latest,
    provenanceCounts,
  });
}

interface ReadingBody {
  metric?: string;
  value?: number;
  recordedAt?: string;
  /** Only real device pipelines may set "measured"; manual stays the default. */
  provenance?: string;
  source?: string;
}

const MEASURED_SOURCE_PREFIXES = ["bluetooth:", "google_fit", "health_connect"];

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<ReadingBody>(request);
  if (!body) return errorJson("Invalid request body.");

  const metric = body.metric as MetricKey;
  if (!VALID_METRICS.includes(metric)) return errorJson("Unknown metric.");
  const value = Number(body.value);
  if (!Number.isFinite(value)) return errorJson("Value must be a number.");

  // Per-metric sanity validation.
  const limits: Partial<Record<MetricKey, [number, number]>> = {
    heart_rate: [30, 230],
    resting_heart_rate: [30, 130],
    hrv_rmssd: [2, 300],
    sleep_duration: [0, 24],
    steps: [0, 200000],
    active_minutes: [0, 1440],
    spo2: [50, 100],
  };
  const [min, max] = limits[metric] ?? [0, 1000000];
  if (value < min || value > max) {
    return errorJson(`Value for ${metric} must be between ${min} and ${max} ${METRICS[metric].unit}.`, 422);
  }

  const recordedAt = body.recordedAt ? new Date(body.recordedAt) : new Date();
  if (Number.isNaN(recordedAt.getTime())) return errorJson("Invalid recordedAt timestamp.");

  // Provenance guard: a client may claim "measured" ONLY for a real device
  // pipeline (Bluetooth GATT, Google Fit, or the Android Health Connect
  // companion). Anything else stays "manual" —
  // simulated values are not accepted from anywhere.
  const source = (body.source ?? "manual_entry").slice(0, 80);
  const provenance = body.provenance === "measured" && MEASURED_SOURCE_PREFIXES.some((p) => source.startsWith(p))
    ? "measured"
    : "manual";

  const reading = await db.healthReading.create({
    data: {
      userId: guard.user.id,
      metric,
      value,
      unit: METRICS[metric].unit,
      provenance,
      source,
      recordedAt,
    },
  });

  return json({ reading }, 201);
}

export async function DELETE(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return errorJson("Missing id parameter.");

  // User isolation: delete only the user's own record.
  const deleted = await db.healthReading.deleteMany({ where: { id, userId: guard.user.id } });
  if (deleted.count === 0) return errorJson("Reading not found.", 404);
  return json({ ok: true });
}
