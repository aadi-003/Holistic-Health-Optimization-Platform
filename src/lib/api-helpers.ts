import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "./auth";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorJson(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Guard for protected routes: resolves the user or returns a 401 response. */
export async function requireUser(): Promise<
  { user: SessionUser; response: null } | { user: null; response: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, response: errorJson("Authentication required.", 401) };
  }
  return { user, response: null };
}

export async function safeJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
