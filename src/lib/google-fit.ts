"use client";

/**
 * Google Fit REST integration (browser side).
 *
 * Flow: Google Identity Services (GIS) token client issues a short-lived
 * OAuth access token with read-only fitness scopes (popup — the user signs in
 * with Google). The token is used directly against the Google Fit REST API to
 * aggregate the last 7 days of steps, active minutes, heart rate and sleep,
 * which the caller then imports into the app via POST /api/readings.
 *
 * Setup (app owner, once):
 *   1. Google Cloud Console → create an OAuth 2.0 "Web application" client ID.
 *   2. Add your site origin (e.g. http://localhost:3000 or the deployed URL)
 *      under "Authorized JavaScript origins".
 *   3. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client id> in .env.
 * No client secret is ever used in the browser.
 */

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
].join(" ");

const GIS_SRC = "https://accounts.google.com/gsi/client";

export function fitClientId(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? null;
}

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

type TokenCallback = (res: TokenResponse) => void;

interface GisTokenClient {
  requestAccessToken(options?: { prompt?: string }): void;
}

interface GoogleGlobal {
  accounts?: {
    oauth2?: {
      initTokenClient(options: {
        client_id: string;
        scope: string;
        callback: TokenCallback;
        error_callback?: (err: { type?: string; message?: string }) => void;
      }): GisTokenClient;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleGlobal;
  }
}

function loadGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google sign-in.")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not reach Google sign-in. Check your connection."));
    document.head.appendChild(s);
  });
}

/** Opens the Google consent popup and resolves with an access token. */
export function getFitAccessToken(): Promise<string> {
  const clientId = fitClientId();
  if (!clientId) {
    throw new Error(
      "Google Fit needs an OAuth client ID. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env (see the steps below)."
    );
  }
  return loadGis().then(
    () =>
      new Promise<string>((resolve, reject) => {
        const client = window.google!.accounts!.oauth2!.initTokenClient({
          client_id: clientId,
          scope: SCOPES,
          callback: (res) => {
            if (res.access_token) resolve(res.access_token);
            else reject(new Error(res.error_description ?? "Google sign-in was cancelled."));
          },
          error_callback: (err) =>
            reject(new Error(err.message ?? "Google sign-in popup was blocked. Allow popups and try again.")),
        });
        client.requestAccessToken({ prompt: "" });
      })
  );
}

/* ------------------------------ REST fetching ----------------------------- */

const DAY_MS = 24 * 3600 * 1000;

export interface FitImport {
  metric: string;
  value: number;
  recordedAt: string; // ISO timestamp the reading belongs to
}

function dayStartUTC(ms: number): number {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

async function fitAggregate(
  token: string,
  dataSourceId: string,
  startTime: number,
  endTime: number
): Promise<{ bucket: { startTimeMillis: number; dataset: { point: { value: { int32Val?: number[]; fpVal?: number[] }[] }[] }[] }[] }> {
  const res = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      aggregateBy: [{ dataSourceId }],
      bucketByTime: { durationMillis: DAY_MS },
      startTimeMillis: startTime,
      endTimeMillis: endTime,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Google Fit request failed (${res.status}).`);
  return res.json();
}

async function fitSessions(token: string, startTime: number, endTime: number): Promise<{ session: { id: string; startTimeMillis: string; endTimeMillis: string; activityType: number }[] }> {
  const res = await fetch(
    `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(startTime).toISOString()}&endTime=${new Date(endTime).toISOString()}`,
    { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) }
  );
  if (!res.ok) throw new Error(`Google Fit sessions request failed (${res.status}).`);
  return res.json();
}

/** Sleep activity type in Google Fit. */
const ACTIVITY_SLEEP = 72;

/**
 * Aggregates the last `days` days of Fit data into per-day readings the app
 * can import: steps, active minutes, average heart rate and sleep duration.
 * Days with no data are simply absent from the result.
 */
export async function fetchFitReadings(token: string, days = 7): Promise<FitImport[]> {
  const end = Date.now();
  const start = dayStartUTC(end - (days - 1) * DAY_MS);
  const out: FitImport[] = [];

  // Steps + active minutes + heart rate via server-side aggregation.
  const [steps, active, hr] = await Promise.all([
    fitAggregate(token, "derived:com.google.step_count.delta:com.google.android.gms:aggregate_step_count_delta", start, end),
    fitAggregate(token, "derived:com.google.active_minutes:com.google.android.gms:from_activity_segments", start, end),
    fitAggregate(token, "derived:com.google.heart_rate.summary:com.google.android.gms:merge_heart_rate_summary", start, end),
  ]);

  for (const b of steps.bucket ?? []) {
    const points = b.dataset?.[0]?.point ?? [];
    const sum = points.reduce((s, p) => s + (p.value?.[0]?.int32Val?.[0] ?? 0), 0);
    if (sum > 0) out.push({ metric: "steps", value: sum, recordedAt: new Date(b.startTimeMillis).toISOString() });
  }
  for (const b of active.bucket ?? []) {
    const points = b.dataset?.[0]?.point ?? [];
    const sum = points.reduce((s, p) => s + (p.value?.[0]?.int32Val?.[0] ?? 0), 0);
    if (sum > 0) out.push({ metric: "active_minutes", value: sum, recordedAt: new Date(b.startTimeMillis).toISOString() });
  }
  for (const b of hr.bucket ?? []) {
    const points = b.dataset?.[0]?.point ?? [];
    const vals = points.map((p) => p.value?.[0]?.fpVal?.[0]).filter((v): v is number => v != null);
    if (vals.length > 0) {
      const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
      out.push({ metric: "heart_rate", value: Math.round(avg), recordedAt: new Date(b.startTimeMillis).toISOString() });
    }
  }

  // Sleep: sum sleep sessions per day.
  try {
    const s = await fitSessions(token, start, end);
    const perDay = new Map<number, number>();
    for (const sess of s.session ?? []) {
      if (sess.activityType !== ACTIVITY_SLEEP) continue;
      const st = Number(sess.startTimeMillis);
      const durH = (Number(sess.endTimeMillis) - st) / 3600000;
      if (durH <= 0) continue;
      const day = dayStartUTC(st);
      perDay.set(day, (perDay.get(day) ?? 0) + durH);
    }
    for (const [day, hours] of perDay) {
      out.push({ metric: "sleep_duration", value: Math.round(hours * 10) / 10, recordedAt: new Date(day).toISOString() });
    }
  } catch {
    // Sleep is optional — steps/HR already collected.
  }

  return out;
}
