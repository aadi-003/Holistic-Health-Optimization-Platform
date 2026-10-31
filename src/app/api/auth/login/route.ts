import { db } from "@/lib/db";
import { createSession, issueSessionToken, verifyPassword } from "@/lib/auth";
import { errorJson, json, safeJson } from "@/lib/api-helpers";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = await safeJson<LoginBody>(request);
  if (!body) return errorJson("Invalid request body.");

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) return errorJson("Email and password are required.");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return errorJson("Invalid email or password.", 401);

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return errorJson("Invalid email or password.", 401);

  await createSession(user.id);
  const token = await issueSessionToken(user.id);

  return json({ user: { id: user.id, email: user.email, name: user.name }, token });
}
