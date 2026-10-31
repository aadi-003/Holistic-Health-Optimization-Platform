import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { json } from "@/lib/api-helpers";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return json({ user: null });

  const profile = await db.profile.findUnique({ where: { userId: user.id } });
  return json({ user, profile });
}
