"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel, Callout, Spinner } from "@/components/holistic/shared";
import { api, post } from "@/lib/client-api";
import { useApp, fmtDateTime } from "@/lib/store";
import { fetchFitReadings, getFitAccessToken, fitClientId } from "@/lib/google-fit";
import { toast } from "@/hooks/use-toast";
import {
  Smartphone, Watch, HeartPulse, RefreshCw, CheckCircle2, Activity, Moon,
  Footprints, Flame, Route, Timer, QrCode, Download, Unplug, Wind,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Health Data — connect your health records.
 *
 * Primary path: the Android companion app reads Health Connect (where the
 * Xiaomi Mi Fitness app writes Redmi Watch 5 Lite data) and syncs it to this
 * account. Google Fit stays as a secondary, browser-based path.
 * Only real synchronized records are displayed — nothing is simulated.
 */

interface CompanionStatus {
  device: {
    id: string;
    label: string;
    model: string | null;
    osVersion: string | null;
    appVersion: string | null;
    pairedAt: string;
    permissions: string[];
    origins: string[];
    lastSyncAt: string | null;
    lastSyncStatus: string | null;
    lastSyncMessage: string | null;
    lastSyncCreated: number | null;
    lastSyncTotal: number | null;
    syncRequested: boolean;
  } | null;
  pairing: { createdAt: string; expiresAt: string } | null;
  metricsAvailable: { metric: string; count: number; lastAt: string | null }[];
}

interface LatestMetric {
  metric: string;
  label: string;
  value: number;
  unit: string;
  recordedAt: string;
  origin: string;
  originLabel: string;
}

interface HistoryResponse {
  days: number;
  series: Record<string, { date: string; value: number }[]>;
  units: Record<string, string>;
  total: number;
}

interface ConsentState {
  active: Record<string, { scope: string | null; grantedAt: string }>;
}

/** Data types the companion app requests from Health Connect. */
const EXPECTED_TYPES = [
  { key: "steps", label: "Steps" },
  { key: "heart_rate", label: "Heart rate" },
  { key: "resting_heart_rate", label: "Resting heart rate" },
  { key: "sleep_duration", label: "Sleep" },
  { key: "active_calories", label: "Active calories" },
  { key: "distance", label: "Distance" },
  { key: "active_minutes", label: "Exercise / active minutes" },
  { key: "spo2", label: "SpO2" },
  { key: "hrv_rmssd", label: "HRV" },
];

const PERMISSION_LABEL: Record<string, string> = {
  steps: "Steps",
  heart_rate: "Heart rate",
  resting_heart_rate: "Resting heart rate",
  sleep: "Sleep (incl. stages)",
  active_calories: "Active calories",
  distance: "Distance",
  exercise: "Exercise sessions",
  spo2: "SpO2",
  hrv: "HRV (RMSSD)",
};

const METRIC_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  heart_rate: HeartPulse,
  resting_heart_rate: HeartPulse,
  hrv_rmssd: Activity,
  sleep_duration: Moon,
  steps: Footprints,
  active_minutes: Timer,
  spo2: Wind,
  active_calories: Flame,
  distance: Route,
  sleep_stage_light: Moon,
  sleep_stage_deep: Moon,
  sleep_stage_rem: Moon,
  sleep_stage_awake: Moon,
};

const CHART_PRIORITY = [
  "steps", "sleep_duration", "heart_rate", "active_calories",
  "resting_heart_rate", "active_minutes", "distance", "spo2", "hrv_rmssd",
  "sleep_stage_deep", "sleep_stage_light", "sleep_stage_rem", "sleep_stage_awake",
];

function fmtValue(metric: string, value: number): string {
  if (metric === "steps") return Math.round(value).toLocaleString("en-US");
  if (metric === "distance" || metric === "spo2") return (Math.round(value * 10) / 10).toString();
  if (metric === "sleep_duration") return (Math.round(value * 10) / 10).toString();
  return Math.round(value).toLocaleString("en-US");
}

export default function WearablesScreen() {
  const setView = useApp((s) => s.setView);
  const [status, setStatus] = useState<CompanionStatus | null>(null);
  const [latest, setLatest] = useState<LatestMetric[] | null>(null);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [busy, setBusy] = useState(false);
  const [pairingCode, setPairingCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const apkUrl = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_COMPANION_APK_URL;
    if (!raw || typeof window === "undefined") return null;
    try {
      return new URL(raw, window.location.origin).toString();
    } catch {
      return null;
    }
  }, []);

  const load = useCallback(async () => {
    const [s, l, h, c] = await Promise.all([
      api<CompanionStatus>("/api/health/status").catch(() => null),
      api<{ metrics: LatestMetric[] }>("/api/health/latest").then((r) => r.metrics).catch(() => []),
      api<HistoryResponse>("/api/health/history?days=7").catch(() => null),
      api<ConsentState>("/api/consent").catch(() => ({ active: {} }) as ConsentState),
    ]);
    setStatus(s ?? { device: null, pairing: null, metricsAvailable: [] });
    setLatest(l);
    setHistory(h);
    setConsent(c);
  }, []);

  useEffect(() => {
    load().catch(() => setStatus({ device: null, pairing: null, metricsAvailable: [] }));
  }, [load]);

  // QR code for the APK download URL (rendered only once the owner sets a real URL).
  useEffect(() => {
    if (!apkUrl) {
      setQr(null);
      return;
    }
    import("qrcode")
      .then((QR) => QR.toDataURL(apkUrl, { margin: 1, width: 240, color: { dark: "#14532d", light: "#ffffff" } }))
      .then(setQr)
      .catch(() => setQr(null));
  }, [apkUrl]);

  // While a pairing code is live and no device is paired, poll for completion.
  useEffect(() => {
    const waiting = pairingCode != null && status?.device == null;
    if (waiting && pollRef.current == null) {
      pollRef.current = setInterval(async () => {
        const s = await api<CompanionStatus>("/api/health/status").catch(() => null);
        if (s) {
          setStatus(s);
          if (s.device) {
            setPairingCode(null);
            toast({ title: "Companion app paired", description: `${s.device.label} is now linked to your account.` });
          }
        }
      }, 4000);
    }
    if (!waiting && pollRef.current != null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current != null) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [pairingCode, status?.device]);

  /* ---------------------------- companion actions --------------------------- */

  async function generateCode() {
    setBusy(true);
    try {
      const res = await post<{ code: string; expiresAt: string }>("/api/health/pairing/create", {});
      setPairingCode(res);
    } catch (err) {
      toast({ title: "Could not create a pairing code", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function syncNow() {
    setBusy(true);
    try {
      await post("/api/health/sync/request", {});
      toast({
        title: "Sync requested",
        description: "Your phone picks this up at its next background check (within 15 min). Open the companion app and tap Sync Now for an instant sync.",
      });
      await load();
    } catch (err) {
      toast({ title: "Could not request a sync", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function disconnectCompanion() {
    setBusy(true);
    try {
      await post("/api/health/device/disconnect", {});
      toast({ title: "Companion disconnected", description: "Its sync token was revoked and synchronized readings were removed." });
      setConfirmDisconnect(false);
      await load();
    } catch (err) {
      toast({ title: "Disconnect failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------ Google Fit -------------------------------- */

  async function connectGoogleFit() {
    setBusy(true);
    try {
      const token = await getFitAccessToken();
      const rows = await fetchFitReadings(token, 7);
      if (rows.length === 0) {
        toast({ title: "No Google Fit data found", description: "Nothing recorded in the last 7 days." });
        setBusy(false);
        return;
      }
      let created = 0;
      for (const r of rows) {
        try {
          await post("/api/readings", { metric: r.metric, value: r.value, recordedAt: r.recordedAt, provenance: "measured", source: "google_fit" });
          created += 1;
        } catch {
          // Skip rows outside the app's valid ranges (e.g. extreme HR values).
        }
      }
      await post("/api/consent", { kind: "google_fit", scope: "fitness.read", granted: true });
      await load();
      toast({ title: "Google Fit connected", description: `${created} readings imported from the last 7 days.` });
    } catch (err) {
      toast({ title: "Google Fit connection failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  /* --------------------------------- view ---------------------------------- */

  if (!status || !consent || latest == null) return <Spinner label="Checking connections…" />;

  const device = status.device;
  const fitActive = !!consent.active["google_fit"];
  const fitAt = consent.active["google_fit"]?.grantedAt;
  const availableKeys = new Set(latest.map((m) => m.metric));
  const waitingFor = EXPECTED_TYPES.filter((t) => !availableKeys.has(t.key));
  const chartMetrics = CHART_PRIORITY.filter((m) => history?.series?.[m]?.length).slice(0, 4);
  const originNames = device?.origins ?? [];

  return (
    <div className="animate-fade-up mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Connect Your Health Data</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Connect your Android phone&apos;s health records to your Holistic Health Optimization Platform.
        </p>
      </div>

      {/* A. Android companion app — download & install */}
      <Panel>
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
            <Smartphone className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-semibold">Android companion app</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A small app on your Android phone reads Health Connect and syncs your records to this account.
              Your watch (e.g. Redmi Watch 5 Lite) syncs to the phone through <strong className="text-foreground">Mi Fitness</strong> —
              the browser never pairs with the watch directly.
            </p>

            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4">
                <div className="flex h-[248px] w-[248px] items-center justify-center rounded-lg border border-dashed p-1">
                  {qr ? (
                    <img src={qr} alt="QR code — download the Holistic companion app" className="h-full w-full rounded-md" />
                  ) : apkUrl ? (
                    <QrCode className="h-10 w-10 text-muted-foreground/50" />
                  ) : (
                    <div className="px-4 text-center text-xs text-muted-foreground">
                      QR code appears here once the APK download URL is configured.
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-muted-foreground">Scan with your phone camera</p>
              </div>

              <div className="flex-1">
                <ol className="list-inside list-decimal space-y-1.5 text-sm text-muted-foreground">
                  <li>Scan the QR code or tap <strong className="text-foreground">Download Companion App</strong>.</li>
                  <li>Install the APK (allow &ldquo;install from this source&rdquo; when asked).</li>
                  <li>Open the app, grant Health Connect permissions, then enter the pairing code from below.</li>
                </ol>
                <div className="mt-4">
                  {apkUrl ? (
                    <a href={apkUrl}>
                      <Button>
                        <Download className="mr-1.5 h-4 w-4" /> Download Companion App
                      </Button>
                    </a>
                  ) : (
                    <Button disabled>
                      <Download className="mr-1.5 h-4 w-4" /> Download Companion App
                    </Button>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Requires Android 9+ with Health Connect (already built into Android 14+). Install Health Connect
                  from the Play Store on Android 9-13. Data types supported: steps, heart rate, resting heart rate,
                  sleep and stages, active calories, distance, exercise sessions, SpO2 and HRV where Mi Fitness
                  shares them.
                </p>
                {!apkUrl && (
                  <Callout tone="info" title="One-time setup (app owner)">
                    <ol className="mt-1 list-inside list-decimal space-y-0.5 text-xs">
                      <li>Build the signed APK: <code>android-companion/</code> — see <code>docs/COMPANION_APP.md</code> or run the GitHub Actions workflow.</li>
                      <li>Host the APK over HTTPS (e.g. GitHub Releases, or drop it in <code>public/downloads/</code>).</li>
                      <li>Put the URL in <code>.env</code> as <code>NEXT_PUBLIC_COMPANION_APK_URL</code> and restart.</li>
                    </ol>
                  </Callout>
                )}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* B. Connection status */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${device ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
              <Watch className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Connection status</h2>
                {device ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Connected</span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">Not connected</span>
                )}
              </div>
              {device ? (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {device.label}
                  {device.model ? ` · ${device.model}` : ""}
                  {device.appVersion ? ` · companion v${device.appVersion}` : ""}
                  {" "}· paired {fmtDateTime(device.pairedAt)}
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-muted-foreground">No companion app is paired with your account yet.</p>
              )}
            </div>
          </div>
          {device && (
            <div className="flex gap-2">
              <Button size="sm" onClick={syncNow} disabled={busy}>
                <RefreshCw className={`mr-1.5 h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Sync Now
              </Button>
              {confirmDisconnect ? (
                <>
                  <Button size="sm" variant="destructive" onClick={disconnectCompanion} disabled={busy}>Confirm disconnect</Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDisconnect(false)} disabled={busy}>Cancel</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setConfirmDisconnect(true)} disabled={busy}>
                  <Unplug className="mr-1.5 h-4 w-4" /> Disconnect
                </Button>
              )}
            </div>
          )}
        </div>

        {!device ? (
          /* Pairing flow */
          <div className="mt-4 rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Pair the companion app</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              1. Install the app (above) · 2. Generate a code here · 3. Enter it in the app within 10 minutes.
            </p>
            {pairingCode ? (
              <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Your pairing code</p>
                <p className="font-mono text-4xl font-semibold tracking-[0.35em] text-primary">{pairingCode.code}</p>
                <p className="text-xs text-muted-foreground">
                  Single-use · expires {fmtDateTime(pairingCode.expiresAt)} · waiting for the app…
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" /> checking automatically
                  </span>
                  <Button size="sm" variant="ghost" onClick={generateCode} disabled={busy}>Use a new code</Button>
                </div>
              </div>
            ) : (
              <Button className="mt-4" onClick={generateCode} disabled={busy}>
                Generate pairing code
              </Button>
            )}
          </div>
        ) : (
          /* Status details */
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">Health Connect permissions</h3>
              {device.permissions.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {device.permissions.map((p) => (
                    <span key={p} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                      {PERMISSION_LABEL[p] ?? p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Not reported yet — run a sync from the app.</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">Granted inside the companion app; revoke there or in Android Settings → Health Connect.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">Last synchronization</h3>
              {device.lastSyncAt ? (
                <>
                  <p className="mt-2 text-sm">
                    {fmtDateTime(device.lastSyncAt)}
                    {device.lastSyncStatus && (
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        device.lastSyncStatus === "success"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : device.lastSyncStatus === "partial"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}>
                        {device.lastSyncStatus}
                      </span>
                    )}
                  </p>
                  {device.lastSyncMessage && <p className="mt-1 text-xs text-muted-foreground">{device.lastSyncMessage}</p>}
                  {device.syncRequested && <p className="mt-2 text-xs text-primary">Sync requested from this website — the app will pick it up shortly.</p>}
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No sync yet — open the app and tap Sync Now.</p>
              )}
              {device.lastSyncStatus === "error" && device.lastSyncMessage && (
                <p className="mt-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-800 dark:bg-red-950 dark:text-red-300">{device.lastSyncMessage}</p>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">Available health data</h3>
              {status.metricsAvailable.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {status.metricsAvailable.map((m) => (
                    <span key={m.metric} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {PERMISSION_LABEL[m.metric] ?? COMPANION_METRIC_LABEL[m.metric] ?? m.metric} · {m.count}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No records found yet.</p>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">Data sources</h3>
              {originNames.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  {originNames.map((o) => (
                    <p key={o} className="text-sm text-muted-foreground">
                      <strong className="font-medium text-foreground">{COMPANION_ORIGIN_LABEL[o] ?? o}</strong>
                      <span className="ml-1.5 font-mono text-[10px] text-muted-foreground/70">{o}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Reported after the first successful sync.</p>
              )}
            </div>
          </div>
        )}

        {/* Connected device card — only once the writing app is actually known */}
        {originNames.length > 0 && (
          <div className="mt-4 flex items-center gap-4 rounded-xl border bg-accent/40 p-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-background shadow-sm">
              <Watch className="h-7 w-7 text-primary" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{originNames.map((o) => COMPANION_ORIGIN_LABEL[o] ?? o).join(", ")}</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Syncing</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Readings are written to Health Connect by this phone app — for a Redmi Watch 5 Lite that is
                Mi Fitness (watch → Mi Fitness → Health Connect → companion → this platform).
              </p>
            </div>
          </div>
        )}
      </Panel>

      {/* C+D. Health dashboard — synchronized records only */}
      <Panel>
        <h2 className="font-semibold">Synchronized health data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only records actually synchronized by the companion app appear here — nothing is estimated or simulated.
        </p>

        {latest.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No records found. Pair the companion app above and run a sync — measurements that are not shared by
            Mi Fitness simply stay absent.
          </p>
        ) : (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((m) => {
                const Icon = METRIC_ICON[m.metric] ?? Activity;
                return (
                  <div key={m.metric} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Icon className="h-4 w-4 text-primary" /> {m.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70">{m.originLabel}</span>
                    </div>
                    <div className="mt-2 text-2xl font-semibold tabular-nums">
                      {fmtValue(m.metric, m.value)} <span className="text-sm font-normal text-muted-foreground">{m.unit}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{fmtDateTime(m.recordedAt)}</p>
                  </div>
                );
              })}
            </div>

            {chartMetrics.length > 0 && (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {chartMetrics.map((metric) => {
                  const data = (history?.series?.[metric] ?? []).map((d) => ({
                    date: new Date(d.date + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                    value: d.value,
                  }));
                  const unit = history?.units?.[metric] ?? "";
                  return (
                    <div key={metric} className="rounded-lg border p-4">
                      <p className="text-sm font-medium">
                        {COMPANION_METRIC_LABEL[metric] ?? metric} <span className="text-xs text-muted-foreground">· last 7 days ({unit})</span>
                      </p>
                      <div className="mt-2 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                            <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis fontSize={10} tickLine={false} axisLine={false} width={38} />
                            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                            <Line type="monotone" dataKey="value" stroke="#2e6b46" strokeWidth={2} dot />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {waitingFor.length > 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                Not received yet: {waitingFor.map((t) => t.label).join(", ")}. A type stays absent until the
                writing app actually shares it with Health Connect.
              </p>
            )}
          </>
        )}
      </Panel>

      {/* E. Google Fit (secondary path) */}
      <Panel>
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
            <HeartPulse className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-semibold">Google Fit</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Alternative browser-based path: sign in with Google and the last 7 days of steps, active minutes,
              heart rate and sleep import automatically. Works in a phone browser too.
            </p>
            {!fitActive && (
              <Button className="mt-4" onClick={connectGoogleFit} disabled={busy}>
                {busy ? "Connecting…" : "Connect Google Fit"}
              </Button>
            )}
            {fitActive && fitAt && (
              <p className="mt-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-emerald-600" /> Linked {fmtDateTime(fitAt)} — reconnect to pull new readings.
              </p>
            )}
            {!fitClientId() && (
              <Callout tone="info" title="One-time setup (app owner)">
                <ol className="mt-1 list-inside list-decimal space-y-0.5 text-xs">
                  <li>Google Cloud Console → APIs &amp; Services → Credentials → create an OAuth client ID (Web application).</li>
                  <li>Add this site&apos;s address under Authorized JavaScript origins.</li>
                  <li>Put the client ID in <code>.env</code> as <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> and restart.</li>
                </ol>
              </Callout>
            )}
          </div>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-semibold">How the companion flow works</h2>
        <ol className="mt-3 list-inside list-decimal space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <li>Your Redmi Watch 5 Lite syncs to the <strong className="text-foreground">Mi Fitness</strong> app on your Android phone (Bluetooth, automatic).</li>
          <li>Mi Fitness writes supported records into <strong className="text-foreground">Health Connect</strong> — check Mi Fitness → Settings → Health Connect.</li>
          <li>The Holistic companion app (installed above) reads the authorized records and syncs them to your account over HTTPS.</li>
          <li>Open the app and tap <strong className="text-foreground">Sync Now</strong> for an instant sync, or use the button on this page for a background sync within 15 minutes.</li>
        </ol>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setView("manual-entry")}>
          Prefer to enter readings manually?
        </Button>
      </Panel>
    </div>
  );
}

/** Client-side label maps (mirrors src/lib/health-metrics.ts). */
const COMPANION_METRIC_LABEL: Record<string, string> = {
  heart_rate: "Heart rate",
  resting_heart_rate: "Resting heart rate",
  hrv_rmssd: "HRV (RMSSD)",
  sleep_duration: "Sleep",
  steps: "Steps",
  active_minutes: "Active minutes",
  spo2: "SpO2",
  active_calories: "Active calories",
  distance: "Distance",
  sleep_stage_light: "Sleep — light",
  sleep_stage_deep: "Sleep — deep",
  sleep_stage_rem: "Sleep — REM",
  sleep_stage_awake: "Sleep — awake",
};

const COMPANION_ORIGIN_LABEL: Record<string, string> = {
  "com.xiaomi.wearable": "Mi Fitness (Xiaomi)",
  "com.xiaomi.hm.health": "Zepp Life (Xiaomi)",
  "com.google.android.apps.fitness": "Google Fit",
  "com.samsung.android.health": "Samsung Health",
  "com.huawei.health": "Huawei Health",
  "com.fitbit.FitbitMobile": "Fitbit",
  "com.heytap.health": "OHealth (OnePlus/Oppo)",
  "com.oplus.health": "OHealth (OnePlus/Oppo)",
  "com.amazfithealth": "Zepp (Amazfit)",
};
