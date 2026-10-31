import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";

interface ProfileBody {
  name?: string;
  age?: number | null;
  gender?: string | null;
  city?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  dietPreference?: string | null;
  wakeTime?: string | null;
  bedTime?: string | null;
}

function clampNum(v: unknown, min: number, max: number): number | null {
  if (v == null) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

export async function GET() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const profile = await db.profile.findUnique({ where: { userId: guard.user.id } });
  return json({ profile, user: guard.user });
}

export async function PUT(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<ProfileBody>(request);
  if (!body) return errorJson("Invalid request body.");

  const age = clampNum(body.age, 10, 120);
  const heightCm = clampNum(body.heightCm, 80, 250);
  const weightKg = clampNum(body.weightKg, 20, 300);
  const name = (body.name ?? "").trim();
  if (name && name.length < 2) return errorJson("Name must be at least 2 characters.");

  const data = {
    age,
    gender: body.gender || null,
    city: body.city ? body.city.trim().slice(0, 100) : null,
    heightCm,
    weightKg,
    dietPreference: body.dietPreference || null,
    wakeTime: body.wakeTime || null,
    bedTime: body.bedTime || null,
    onboardedAt: new Date(),
  };

  const profile = await db.profile.upsert({
    where: { userId: guard.user.id },
    create: { userId: guard.user.id, ...data },
    update: data,
  });

  if (name) {
    await db.user.update({ where: { id: guard.user.id }, data: { name } });
  }

  return json({ profile });
}
