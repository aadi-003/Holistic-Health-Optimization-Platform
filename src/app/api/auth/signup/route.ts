import { db } from "@/lib/db";
import { createSession, hashPassword, issueSessionToken, validateEmail, validatePassword } from "@/lib/auth";
import { errorJson, json, safeJson } from "@/lib/api-helpers";

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = await safeJson<SignupBody>(request);
  if (!body) return errorJson("Invalid request body.");

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (name.length < 2) return errorJson("Please enter your name (at least 2 characters).");
  if (!validateEmail(email)) return errorJson("Please enter a valid email address.");
  const pwError = validatePassword(password);
  if (pwError) return errorJson(pwError);

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return errorJson("An account with this email already exists. Try logging in.", 409);

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true },
  });

  // Start the session right away. Signup previously returned without a
  // session, so the very first authenticated request (profile setup) failed
  // with 401 until the client performed a separate login round-trip.
  await createSession(user.id);
  const token = await issueSessionToken(user.id);

  return json({ user, token }, 201);
}
