import { db } from "@/lib/db";
import { requireUser, json } from "@/lib/api-helpers";

/** Full historical record for the History screen (never overwritten data). */
export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const userId = guard.user.id;

  const [prakriti, vikriti, combined, envSnapshots, recommendationEvents] = await Promise.all([
    db.prakritiAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, instrumentId: true, scoringVersion: true, vataScore: true, pittaScore: true, kaphaScore: true, vataPct: true, pittaPct: true, kaphaPct: true, classification: true, label: true, createdAt: true },
    }),
    db.vikritiAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, instrumentId: true, scoringVersion: true, vataCount: true, pittaCount: true, kaphaCount: true, vataPct: true, pittaPct: true, kaphaPct: true, dominant: true, createdAt: true },
    }),
    db.combinedAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, modelVersion: true, combinedScore: true, dominantDosha: true, qContribution: true, wContribution: true, eContribution: true, confidence: true, createdAt: true },
    }),
    db.environmentSnapshot.findMany({
      where: { userId },
      orderBy: { recordedAt: "desc" },
      take: 50,
    }),
    db.recommendationEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return json({ prakriti, vikriti, combined, envSnapshots, recommendationEvents });
}
