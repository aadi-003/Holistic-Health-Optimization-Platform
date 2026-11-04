import { db } from "@/lib/db";
import { requireUser, json } from "@/lib/api-helpers";
import { scorePrakriti, type PrakritiAnswers } from "@/lib/engine/prakriti-engine";
import { scoreVikriti, type VikritiAnswers } from "@/lib/engine/vikriti-engine";
import { computeSeason, isRituSandhi } from "@/lib/engine/seasonal";
import { evaluateRules } from "@/lib/engine/recommendation-engine";
import { type ReadingInput } from "@/lib/engine/combined-engine";

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const [latestPrakriti, latestVikriti, profile, recentReadings, latestEnv] = await Promise.all([
    db.prakritiAssessment.findFirst({ where: { userId: guard.user.id }, orderBy: { createdAt: "desc" } }),
    db.vikritiAssessment.findFirst({ where: { userId: guard.user.id }, orderBy: { createdAt: "desc" } }),
    db.profile.findUnique({ where: { userId: guard.user.id } }),
    db.healthReading.findMany({
      where: { userId: guard.user.id, recordedAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } },
      orderBy: { recordedAt: "desc" },
    }),
    db.environmentSnapshot.findFirst({ where: { userId: guard.user.id }, orderBy: { recordedAt: "desc" } }),
  ]);

  const prakriti = latestPrakriti ? scorePrakriti(JSON.parse(latestPrakriti.answersJson) as PrakritiAnswers) : null;
  const vikriti = latestVikriti ? scoreVikriti(JSON.parse(latestVikriti.answersJson) as VikritiAnswers) : null;

  const readings: ReadingInput[] = recentReadings.map((r) => ({
    metric: r.metric,
    value: r.value,
    provenance: r.provenance,
    recordedAt: r.recordedAt.toISOString(),
  }));

  const lat = latestEnv?.latitude ?? null;
  const season = (latestEnv?.season as ReturnType<typeof computeSeason>) ?? computeSeason(new Date(), lat);

  const { shown, withheld } = evaluateRules({
    prakriti,
    vikriti,
    combined: null,
    season,
    rituSandhi: latestEnv ? true : isRituSandhi(new Date(), lat),
    readings,
    age: profile?.age ?? null,
  });

  return json({
    generatedAt: new Date().toISOString(),
    season,
    shown: shown.map((s) => ({
      ruleId: s.rule.ruleId,
      category: s.rule.category,
      precedence: s.rule.precedence,
      sanskritDeva: s.rule.sanskritDeva,
      sanskritIast: s.rule.sanskritIast,
      english: s.rule.english,
      recommendation: s.rule.recommendation,
      steps: s.rule.steps,
      doshaFocus: (s.rule.conditions.vikritiDominant ?? null) as string | null,
      why: s.rule.why,
      because: s.because,
      classicalSource: s.rule.classicalSource,
      researchReference: s.rule.researchReference,
      evidenceLevel: s.rule.evidenceLevel,
      precautions: s.rule.precautions,
      applicability: s.rule.applicability,
    })),
    withheld: withheld.map((w) => ({ ruleId: w.rule.ruleId, english: w.rule.english, reason: w.reason })),
    note: "Deterministic rule-based suggestions for educational wellness support. They do not cure, treat or eliminate dosha imbalance, and they are not medical advice.",
  });
}
