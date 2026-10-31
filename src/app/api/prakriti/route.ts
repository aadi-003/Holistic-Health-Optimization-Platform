import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";
import { PRAKRITI_ITEMS, PRAKRITI_INSTRUMENT } from "@/lib/data/prakriti-questions";
import { scorePrakriti, type PrakritiAnswers } from "@/lib/engine/prakriti-engine";

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const history = await db.prakritiAssessment.findMany({
    where: { userId: guard.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return json({
    instrument: PRAKRITI_INSTRUMENT,
    history: history.map((h) => ({ ...h, answersJson: undefined, answers: JSON.parse(h.answersJson) })),
  });
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<{ answers?: PrakritiAnswers }>(request);
  if (!body?.answers) return errorJson("Missing answers.");

  const answers = body.answers;
  // Validation: all 62 items must be answered with yes/no.
  const unanswered = PRAKRITI_ITEMS.filter((i) => answers[i.id] !== "yes" && answers[i.id] !== "no");
  if (unanswered.length > 0) {
    return errorJson(`${unanswered.length} question(s) unanswered. Answer every question before submitting.`, 422);
  }

  const score = scorePrakriti(answers);

  const record = await db.prakritiAssessment.create({
    data: {
      userId: guard.user.id,
      instrumentId: PRAKRITI_INSTRUMENT.id,
      scoringVersion: "guna_proportional_absolute_v1",
      answersJson: JSON.stringify(answers),
      vataScore: score.vataScore,
      pittaScore: score.pittaScore,
      kaphaScore: score.kaphaScore,
      vataPct: score.vataPct,
      pittaPct: score.pittaPct,
      kaphaPct: score.kaphaPct,
      classification: score.classification,
      label: score.label,
    },
  });

  return json(
    {
      assessment: { ...record, answersJson: undefined },
      score,
      validationNote:
        "Criterion-level validation only (Tripathi et al. 2011: Vata r=0.305 p=0.015; Kapha r=0.341 p=0.031; Pitta r=0.237 p=0.097 ns; n=50, vs an unvalidated comparator). Educational use; not a clinical assessment.",
    },
    201
  );
}
