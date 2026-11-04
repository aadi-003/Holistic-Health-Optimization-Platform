import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";

/**
 * Consent ledger for wearable sync / location / data processing.
 * Consent is recorded per scope so partial consent is supported
 * (e.g. grant heart rate but deny sleep), per report Ch. 8.5.
 */
interface ConsentBody {
  kind?: string;
  scope?: string;
  granted?: boolean;
}

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const records = await db.consentRecord.findMany({
    where: { userId: guard.user.id },
    orderBy: { grantedAt: "desc" },
  });
  const active: Record<string, { scope: string | null; grantedAt: string }> = {};
  for (const r of records) {
    if (r.granted && !r.revokedAt && !active[r.kind]) {
      active[r.kind] = { scope: r.scope, grantedAt: r.grantedAt.toISOString() };
    }
  }
  return json({ active, records });
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<ConsentBody>(request);
  if (!body?.kind || typeof body.granted !== "boolean") return errorJson("Missing kind or granted.");
  const kind = body.kind.slice(0, 40);

  if (body.granted) {
    const record = await db.consentRecord.create({
      data: { userId: guard.user.id, kind, scope: body.scope?.slice(0, 200) ?? null, granted: true },
    });
    return json({ record }, 201);
  }

  // Revoke: mark all active records of this kind as revoked.
  const active = await db.consentRecord.findMany({
    where: { userId: guard.user.id, kind, granted: true, revokedAt: null },
  });
  await db.consentRecord.updateMany({
    where: { id: { in: active.map((a) => a.id) } },
    data: { revokedAt: new Date() },
  });
  // Minimum-necessary retention: revoking a connection removes the data that
  // came through it (readings from that source only).
  if (kind === "wearable_sync") {
    await db.healthReading.deleteMany({
      where: { userId: guard.user.id, source: { startsWith: "bluetooth:" } },
    });
  }
  if (kind === "google_fit") {
    await db.healthReading.deleteMany({
      where: { userId: guard.user.id, source: { startsWith: "google_fit" } },
    });
  }
  // Legacy simulated rows, if any remain from earlier versions.
  await db.healthReading.deleteMany({ where: { userId: guard.user.id, provenance: "simulated" } });
  return json({ revoked: true });
}
