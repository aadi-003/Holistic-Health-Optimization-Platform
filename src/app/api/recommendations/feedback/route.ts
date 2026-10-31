import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";

interface FeedbackBody {
  ruleId?: string;
  category?: string;
  evidence?: string;
  payload?: unknown;
  feedback?: "helpful" | "not_helpful";
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<FeedbackBody>(request);
  if (!body?.ruleId || !body.feedback) return errorJson("Missing ruleId or feedback.");
  if (!["helpful", "not_helpful"].includes(body.feedback)) return errorJson("Invalid feedback value.");

  const event = await db.recommendationEvent.create({
    data: {
      userId: guard.user.id,
      ruleId: body.ruleId.slice(0, 40),
      category: body.category?.slice(0, 40) ?? "unknown",
      evidence: body.evidence?.slice(0, 10) ?? "unknown",
      payloadJson: JSON.stringify(body.payload ?? {}),
      feedback: body.feedback,
    },
  });

  return json({ event: { id: event.id } }, 201);
}
