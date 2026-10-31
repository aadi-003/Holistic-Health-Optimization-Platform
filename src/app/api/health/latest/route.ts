import { db } from "@/lib/db";
import { requireUser, json } from "@/lib/api-helpers";
import { COMPANION_METRICS, originLabel, type CompanionMetricKey } from "@/lib/health-metrics";

/**
 * GET /api/health/latest — most recent synchronized Health Connect reading per
 * metric (companion sources only — provenance-safe: never mixes in manual or
 * estimated values). Powers the Health Data dashboard tiles.
 */
export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const readings = await db.healthReading.findMany({
    where: { userId: guard.user.id, source: { startsWith: "health_connect:" } },
    orderBy: { recordedAt: "desc" },
    take: 400,
  });

  const latest = new Map<string, { metric: string; value: number; unit: string; recordedAt: string; origin: string; originLabel: string }>();
  for (const r of readings) {
    if (latest.has(r.metric)) continue;
    const origin = r.source.startsWith("health_connect:") ? r.source.slice("health_connect:".length) : r.source;
    latest.set(r.metric, {
      metric: r.metric,
      value: r.value,
      unit: r.unit,
      recordedAt: r.recordedAt.toISOString(),
      origin,
      originLabel: originLabel(origin),
    });
  }

  return json({
    metrics: [...latest.values()].map((m) => ({
      ...m,
      label: COMPANION_METRICS[m.metric as CompanionMetricKey]?.label ?? m.metric,
    })),
  });
}
