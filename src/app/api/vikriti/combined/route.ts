import { db } from "@/lib/db";
import { requireUser, errorJson, json } from "@/lib/api-helpers";
import { scoreVikriti, type VikritiAnswers } from "@/lib/engine/vikriti-engine";
import { computeCombined, type ReadingInput } from "@/lib/engine/combined-engine";
import { computeSeason } from "@/lib/engine/seasonal";

async function buildContext(userId: string) {
  const [latestVikriti, profile, recentReadings, latestEnv] = await Promise.all([
    db.vikritiAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    db.profile.findUnique({ where: { userId } }),
    db.healthReading.findMany({
      where: { userId, recordedAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } },
      orderBy: { recordedAt: "desc" },
    }),
    db.environmentSnapshot.findFirst({ where: { userId }, orderBy: { recordedAt: "desc" } }),
  ]);

  if (!latestVikriti) return { error: "You need a completed Vikriti self-assessment before computing the combined result." as const };

  const vikritiScore = scoreVikriti(JSON.parse(latestVikriti.answersJson) as VikritiAnswers);

  const readings: ReadingInput[] = recentReadings.map((r) => ({
    metric: r.metric,
    value: r.value,
    provenance: r.provenance,
    recordedAt: r.recordedAt.toISOString(),
  }));

  const lat = latestEnv?.latitude ?? null;
  const season = latestEnv?.season as ReturnType<typeof computeSeason> | undefined ?? computeSeason(new Date(), lat);

  const environment = latestEnv
    ? {
        temperatureC: latestEnv.temperatureC,
        humidity: latestEnv.humidity,
        season,
        source: latestEnv.source,
        city: latestEnv.city,
      }
    : null;

  return {
    vikritiScore,
    readings,
    environment,
    age: profile?.age ?? null,
    vikritiAssessment: latestVikriti,
  };
}

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  // Live view: always computed from the user's CURRENT check-in, readings and
  // environment, so new environment/health data is reflected immediately.
  const ctx = await buildContext(guard.user.id);
  if ("error" in ctx) return json({ latest: null });

  const result = computeCombined(
    ctx.vikritiScore,
    ctx.readings,
    ctx.environment,
    ctx.age,
    new Date()
  );
  return json({ latest: { breakdown: result } });
}

export async function POST() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const ctx = await buildContext(guard.user.id);
  if ("error" in ctx) {
    return errorJson(ctx.error ?? "You need a completed Vikriti self-assessment first.", 409);
  }

  const result = computeCombined(
    ctx.vikritiScore,
    ctx.readings,
    ctx.environment,
    ctx.age,
    new Date()
  );

  const record = await db.combinedAssessment.create({
    data: {
      userId: guard.user.id,
      modelVersion: result.modelVersion,
      combinedScore: result.combinedScore,
      dominantDosha: result.dominantDosha ?? "none",
      qContribution: result.questionnaire.contribution,
      wContribution: result.wearable.contribution,
      eContribution: result.environment.contribution,
      confidence: result.confidence,
      breakdownJson: JSON.stringify(result),
    },
  });

  return json({ assessment: { ...record, breakdownJson: undefined, breakdown: result } }, 201);
}
