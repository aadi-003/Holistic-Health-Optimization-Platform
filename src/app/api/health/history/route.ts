import { db } from "@/lib/db";
import { requireUser, json } from "@/lib/api-helpers";
import { COMPANION_METRICS, METRIC_DAILY_AGG, type CompanionMetricKey } from "@/lib/health-metrics";

/**
 * GET /api/health/history?days=7&metric=steps — daily series of synchronized
 * Health Connect readings for the dashboard charts. Additive metrics (steps,
 * minutes, kcal, km, stage minutes) are summed per day; spot measurements
 * (heart rate, resting HR, HRV, SpO2) are averaged per day. Only actual
 * synchronized records are returned.
 */
export async function GET(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? 7)));
  const metricFilter = url.searchParams.get("metric");

  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const readings = await db.healthReading.findMany({
    where: {
      userId: guard.user.id,
      source: { startsWith: "health_connect:" },
      recordedAt: { gte: since },
      ...(metricFilter ? { metric: metricFilter } : {}),
    },
    orderBy: { recordedAt: "asc" },
    take: 5000,
  });

  // Bucket by (metric, calendar day of recordedAt).
  const buckets = new Map<string, { sum: number; count: number }>();
  for (const r of readings) {
    const key = `${r.metric}|${r.recordedAt.toISOString().slice(0, 10)}`;
    const bucket = buckets.get(key) ?? { sum: 0, count: 0 };
    bucket.sum += r.value;
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  const series: Record<string, { date: string; value: number }[]> = {};
  for (const [key, bucket] of buckets) {
    const [metric, date] = key.split("|");
    const agg = METRIC_DAILY_AGG[metric as CompanionMetricKey] ?? "avg";
    const value = agg === "sum" ? Math.round(bucket.sum) : Math.round((bucket.sum / bucket.count) * 10) / 10;
    (series[metric] ??= []).push({ date, value });
  }
  for (const metric of Object.keys(series)) {
    series[metric].sort((a, b) => a.date.localeCompare(b.date));
  }

  return json({
    days,
    series,
    units: Object.fromEntries(Object.keys(series).map((m) => [m, COMPANION_METRICS[m as CompanionMetricKey]?.unit ?? ""])),
    total: readings.length,
  });
}
