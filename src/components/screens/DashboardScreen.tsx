"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { DoshaStackBar, Panel, ProvenanceBadge, Spinner, Callout } from "@/components/holistic/shared";
import { useApp, greeting, fmtDateTime } from "@/lib/store";
import { api } from "@/lib/client-api";
import { Heart, Moon, Footprints, Flame, ArrowRight, MapPin, Thermometer, Droplets } from "lucide-react";

interface CombinedResult {
  combinedScore: number;
  questionnaire: { contribution: number };
  wearable: { contribution: number; balanceScore: number; dataCompleteness: number };
  environment: { contribution: number; seasonLabel: string; rituSandhi: boolean };
  confidence: number;
  explanation: string[];
  dominantDosha: string | null;
}

interface DashData {
  user: { name: string | null; email: string };
  profile: { age: number | null; city: string | null } | null;
  hasPrakriti: boolean;
  hasVikriti: boolean;
  prakritiScore: { vataPct: number; pittaPct: number; kaphaPct: number; label: string } | null;
  vikritiScore: { vataPct: number; pittaPct: number; kaphaPct: number; dominantLabel: string } | null;
  combined: CombinedResult | null;
  environment: { source: string; city: string | null; temperatureC: number | null; humidity: number | null; condition: string | null; season: string; recordedAt: string } | null;
  trends: Record<string, { date: string; value: number; provenance: string }[]>;
  latestReadings: Record<string, { value: number; unit: string; provenance: string; recordedAt: string }>;
}

const METRIC_CARDS = [
  { key: "heart_rate", label: "Heart rate", unit: "bpm", icon: Heart, color: "#d16a7c", band: [60, 100] },
  { key: "sleep_duration", label: "Sleep", unit: "h", icon: Moon, color: "#0e9bb5", band: [7, 9] },
  { key: "steps", label: "Steps", unit: "", icon: Footprints, color: "#4f9d5f", band: [7000, 10000] },
  { key: "active_minutes", label: "Active minutes", unit: "min", icon: Flame, color: "#e0912f", band: [30, 60] },
] as const;

function fmtMetric(key: string, value: number, unit: string): string {
  if (key === "sleep_duration") return `${Math.floor(value)}h ${Math.round((value % 1) * 60)}m`;
  if (key === "steps") return value.toLocaleString("en-US");
  return `${Math.round(value)}${unit ? ` ${unit}` : ""}`;
}

export default function DashboardScreen() {
  const [data, setData] = useState<DashData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setView = useApp((s) => s.setView);
  const user = useApp((s) => s.user);

  useEffect(() => {
    api<DashData>("/api/dashboard")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, []);

  if (error) return <Callout tone="warn" title="Could not load dashboard">{error}</Callout>;
  if (!data) return <Spinner label="Loading your overview…" />;

  const name = data.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="animate-fade-up space-y-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greeting()}, {name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your health overview for today.
          </p>
        </div>
        <Button variant="outline" onClick={() => setView("recommendations")}>
          Today&apos;s recommendations <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRIC_CARDS.map((m) => {
          const latest = data.latestReadings[m.key];
          const trend = data.trends[m.key] ?? [];
          const Icon = m.icon;
          return (
            <Panel key={m.key} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${m.color}1a`, color: m.color }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{m.label}</span>
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">
                {latest ? fmtMetric(m.key, latest.value, latest.unit) : <span className="text-muted-foreground">No data</span>}
              </div>
              <div className="mt-1">
                {latest ? <ProvenanceBadge provenance={latest.provenance} /> : <span className="text-xs text-muted-foreground">Connect Google Fit or enter data manually</span>}
              </div>
              {trend.length > 1 && (
                <div className="mt-3 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend}>
                      <Bar dataKey="value" fill={m.color} radius={[2, 2, 0, 0]} opacity={0.75} />
                      <Tooltip
                        formatter={(v) => [fmtMetric(m.key, Number(v), m.unit), m.label]}
                        labelFormatter={(l) => String(l)}
                        contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>
          );
        })}
      </div>

      {/* Ayurvedic snapshot + status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Your Ayurvedic snapshot</h2>
            <div className="flex gap-2 text-xs">
              <button className="text-primary hover:underline" onClick={() => setView("prakriti-result")}>View Prakriti</button>
              <span className="text-muted-foreground">·</span>
              <button className="text-primary hover:underline" onClick={() => setView("vikriti-result")}>View Vikriti</button>
            </div>
          </div>

          {!data.hasPrakriti && !data.hasVikriti ? (
            <div className="mt-5 rounded-lg border border-dashed px-5 py-8 text-center">
              <p className="text-sm font-medium">Start with your baseline constitution</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                The 62-question Prakriti assessment anchors all personalisation. It takes about 10 minutes.
              </p>
              <Button className="mt-4" onClick={() => setView("prakriti-assessment")}>Begin Prakriti assessment</Button>
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Prakriti — baseline constitution</span>
                  <span className="text-muted-foreground">{data.prakritiScore?.label ?? "Not taken"}</span>
                </div>
                {data.prakritiScore ? (
                  <DoshaStackBar vata={data.prakritiScore.vataPct} pitta={data.prakritiScore.pittaPct} kapha={data.prakritiScore.kaphaPct} />
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setView("prakriti-assessment")}>Take the 62-question assessment</Button>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Vikriti — current state (self-reported signs)</span>
                  <span className="text-muted-foreground">{data.vikritiScore?.dominantLabel ?? "Not taken"}</span>
                </div>
                {data.vikritiScore ? (
                  <DoshaStackBar vata={data.vikritiScore.vataPct} pitta={data.vikritiScore.pittaPct} kapha={data.vikritiScore.kaphaPct} />
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setView("vikriti-assessment")}>Take the 34-question check-in</Button>
                )}
              </div>
            </div>
          )}
        </Panel>

        <Panel>
          <h2 className="font-semibold tracking-tight">Environment context</h2>
          {data.environment ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{data.environment.city ?? "Manual entry"}</span>
                <span className="text-xs text-muted-foreground">({data.environment.source})</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Thermometer className="h-3.5 w-3.5" /> Temperature</div>
                  <div className="mt-1 text-lg font-semibold tabular-nums">{data.environment.temperatureC != null ? `${Math.round(data.environment.temperatureC)}°C` : "—"}</div>
                </div>
                <div className="rounded-lg bg-muted/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Droplets className="h-3.5 w-3.5" /> Humidity</div>
                  <div className="mt-1 text-lg font-semibold tabular-nums">{data.environment.humidity != null ? `${Math.round(data.environment.humidity)}%` : "—"}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.environment.condition ?? "Conditions entered manually"} · {data.environment.season}
              </p>
              <p className="text-xs text-muted-foreground">Updated {fmtDateTime(data.environment.recordedAt)}</p>
              <Button size="sm" variant="outline" onClick={() => setView("environment")}>Update environment</Button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Add weather context so seasonal (ritucharya) logic can personalise your suggestions.
              </p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => setView("environment")}>Set environment</Button>
            </div>
          )}
        </Panel>
      </div>

      {/* Combined model */}
      {data.hasVikriti && (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold tracking-tight">Combined current-state score</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                50% check-in + 30% health data + 20% environment. Components without data count as 0.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold tabular-nums tracking-tight">{data.combined?.combinedScore ?? "—"}</div>
              <div className="text-xs text-muted-foreground">out of 100 · higher = more imbalance signals</div>
            </div>
          </div>
          {data.combined && (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Check-in (50%)", value: data.combined.questionnaire.contribution, color: "#2e6b46" },
                  { label: "Health data (30%)", value: data.combined.wearable.contribution, color: "#0e9bb5" },
                  { label: "Environment (20%)", value: data.combined.environment.contribution, color: "#e0912f" },
                ].map((b) => (
                  <div key={b.label} className="rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">{b.label}</div>
                    <div className="mt-1 text-xl font-semibold tabular-nums" style={{ color: b.color }}>{b.value}</div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, b.value)}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Data confidence: <strong className="text-foreground">{data.combined.confidence}/100</strong></span>
                <span>·</span>
                <span>
                  Wearable completeness: {Math.round(data.combined.wearable.dataCompleteness * 100)}%
                  {data.combined.wearable.dataCompleteness === 0 && " — connect Google Fit or enter readings"}
                </span>
                <span>·</span>
                <span>Season: {data.combined.environment.seasonLabel}{data.combined.environment.rituSandhi ? " (junction)" : ""}</span>
              </div>
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
