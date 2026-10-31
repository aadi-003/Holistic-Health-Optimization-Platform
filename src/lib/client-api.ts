"use client";

/**
 * Client API helpers — all requests use relative paths (same-origin API routes).
 *
 * Sessions travel two ways so authentication survives embedded preview panels
 * and strict third-party-cookie browsers:
 *  - the httpOnly session cookie (credentials: "include"), and
 *  - a signed bearer token returned by /api/auth/login and /api/auth/signup,
 *    persisted in localStorage and echoed as an Authorization header.
 * The server accepts either; when cookies are stripped by the browser the
 * header keeps the session alive.
 */

const TOKEN_KEY = "holistic_session_token";

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode) — the cookie still carries the session.
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clean up.
  }
}

/** Login/signup responses carry a fresh token — keep the newest one. */
function persistTokenFromResponse(data: unknown): void {
  if (data && typeof data === "object" && "token" in data) {
    const token = (data as { token?: unknown }).token;
    if (typeof token === "string" && token.length > 0) setToken(token);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // A 401 with a stored token means that token is expired/invalid — drop it
    // so the next boot starts from a clean slate instead of looping on 401s.
    if (res.status === 401) clearToken();
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  persistTokenFromResponse(data);
  return data as T;
}

export const post = <T,>(path: string, body?: unknown) =>
  api<T>(path, { method: "POST", body: body != null ? JSON.stringify(body) : undefined });
export const put = <T,>(path: string, body?: unknown) =>
  api<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const del = <T,>(path: string) => api<T>(path, { method: "DELETE" });
