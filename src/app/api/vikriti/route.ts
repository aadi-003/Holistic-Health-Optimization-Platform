import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";
import { VIKRITI_ITEMS, VIKRITI_INSTRUMENT } from "@/lib/data/vikriti-questions";
import { scoreVikriti, type VikritiAnswers } from "@/lib/engine/vikriti-engine";

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const history = await db.vikritiAssessment.findMany({
    where: { userId: guard.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return json({
    instrument: VIKRITI_INSTRUMENT,
    history: history.map((h) => ({ ...h, answersJson: undefined, answers: JSON.parse(h.answersJson) })),
  });
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<{ answers?: VikritiAnswers }>(request);
  if (!body?.answers) return errorJson("Missing answers.");

  const answers = body.answers;
  const unanswered = VIKRITI_ITEMS.filter((i) => answers[i.id] !== "yes" && answers[i.id] !== "no");
  if (unanswered.length > 0) {
    return errorJson(`${unanswered.length} question(s) unanswered. Answer every question before submitting.`, 422);
  }

  const score = scoreVikriti(answers);

  const record = await db.vikritiAssessment.create({
    data: {
      userId: guard.user.id,
      instrumentId: VIKRITI_INSTRUMENT.id,
      scoringVersion: "experimental_binary_v1",
      answersJson: JSON.stringify(answers),
      vataCount: score.vataCount,
      pittaCount: score.pittaCount,
      kaphaCount: score.kaphaCount,
      vataPct: score.vataPct,
      pittaPct: score.pittaPct,
      kaphaPct: score.kaphaPct,
      dominant: score.dominant,
    },
  });

  return json(
    {
      assessment: { ...record, answersJson: undefined },
      score,
      scoringNote:
        "Experimental platform scoring (1 point per 'Yes', normalised per dosha bucket: Vata 13, Pitta 10, Kapha 11). The source questionnaire documents no numeric formula; this method is a labelled design proposal with no clinical validation and no diagnostic cutoffs.",
    },
    201
  );
}
