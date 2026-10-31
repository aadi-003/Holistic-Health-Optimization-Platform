import { db } from "@/lib/db";
import { requireUser, json } from "@/lib/api-helpers";
import { scorePrakriti, type PrakritiAnswers } from "@/lib/engine/prakriti-engine";
import { scoreVikriti, type VikritiAnswers } from "@/lib/engine/vikriti-engine";
import { computeCombined, type ReadingInput } from "@/lib/engine/combined-engine";
import { computeSeason } from "@/lib/engine/seasonal";

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const userId = guard.user.id;

  const [user, profile, latestPrakriti, latestVikriti, latestCombined, latestEnv, recentReadings, prakritiCount, vikritiCount] =
    await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, createdAt: true } }),
      db.profile.findUnique({ where: { userId } }),
      db.prakritiAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.vikritiAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.combinedAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.environmentSnapshot.findFirst({ where: { userId }, orderBy: { recordedAt: "desc" } }),
      db.healthReading.findMany({
        where: { userId, recordedAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } },
        orderBy: { recordedAt: "asc" },
      }),
      db.prakritiAssessment.count({ where: { userId } }),
      db.vikritiAssessment.count({ where: { userId } }),
    ]);

  const prakritiScore = latestPrakriti ? scorePrakriti(JSON.parse(latestPrakriti.answersJson) as PrakritiAnswers) : null;
  const vikritiScore = latestVikriti ? scoreVikriti(JSON.parse(latestVikriti.answersJson) as VikritiAnswers) : null;

  const readings: ReadingInput[] = recentReadings.map((r) => ({
    metric: r.metric,
    value: r.value,
    provenance: r.provenance,
    recordedAt: r.recordedAt.toISOString(),
  }));

  const lat = latestEnv?.latitude ?? null;
  const season = (latestEnv?.season as ReturnType<typeof computeSeason>) ?? computeSeason(new Date(), lat);

  const liveCombined =
    vikritiScore != null
      ? computeCombined(
          vikritiScore,
          readings,
          latestEnv
            ? {
                temperatureC: latestEnv.temperatureC,
                humidity: latestEnv.humidity,
                season,
                source: latestEnv.source,
                city: latestEnv.city,
              }
            : null,
          profile?.age ?? null
        )
      : null;

  // 7-day trend series per metric (chronological).
  const trends: Record<string, { date: string; value: number; provenance: string }[]> = {};
  for (const r of recentReadings) {
    const bucket = trends[r.metric] ?? (trends[r.metric] = []);
    bucket.push({ date: r.recordedAt.toISOString().slice(0, 10), value: r.value, provenance: r.provenance });
  }

  const latestReadings: Record<string, { value: number; unit: string; provenance: string; recordedAt: string }> = {};
  for (const r of [...recentReadings].reverse()) {
    latestReadings[r.metric] = { value: r.value, unit: r.unit, provenance: r.provenance, recordedAt: r.recordedAt.toISOString() };
  }

  return json({
    user,
    profile,
    hasPrakriti: prakritiCount > 0,
    hasVikriti: vikritiCount > 0,
    prakritiScore,
    prakritiAt: latestPrakriti?.createdAt ?? null,
    vikritiScore,
    vikritiAt: latestVikriti?.createdAt ?? null,
    combined: liveCombined,
    environment: latestEnv
      ? {
          source: latestEnv.source,
          city: latestEnv.city,
          temperatureC: latestEnv.temperatureC,
          humidity: latestEnv.humidity,
          condition: latestEnv.condition,
          season,
          recordedAt: latestEnv.recordedAt.toISOString(),
        }
      : null,
    trends,
    latestReadings,
  });
}
