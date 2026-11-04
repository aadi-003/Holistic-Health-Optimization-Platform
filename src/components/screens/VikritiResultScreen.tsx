"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DoshaDonut, DoshaLegend, Panel, Spinner, ProvenanceBadge } from "@/components/holistic/shared";
import { useApp, fmtDate } from "@/lib/store";
import { api, post } from "@/lib/client-api";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw } from "lucide-react";

interface VikritiRecord {
  id: string;
  vataCount: number;
  pittaCount: number;
  kaphaCount: number;
  vataPct: number;
  pittaPct: number;
  kaphaPct: number;
  dominant: string;
  instrumentId: string;
  scoringVersion: string;
  createdAt: string;
}

interface Combined {
  combinedScore: number;
  questionnaire: { contribution: number };
  wearable: {
    contribution: number;
    balanceScore: number;
    assumedCount: number;
    subScores: { metric: string; label: string; weight: number; value: number | null; assumedNormal: boolean; provenance: string; score: number; formula: string }[];
  };
  environment: {
    contribution: number;
    assumedNormal: boolean;
    seasonTerm: number;
    temperatureTerm: number;
    humidityTerm: number;
    temperatureC: number | null;
    humidity: number | null;
    seasonLabel: string;
    rituSandhi: boolean;
    tendencyDoshas: string[];
  };
  confidence: number;
  calculation: string[];
  explanation: string[];
}

interface CombinedRecord {
  combinedScore: number;
  qContribution: number;
  wContribution: number;
  eContribution: number;
  confidence: number;
  createdAt: string;
}

export default function VikritiResultScreen() {
  const [history, setHistory] = useState<VikritiRecord[] | null>(null);
  const [combined, setCombined] = useState<Combined | null>(null);
  const [combinedHistory, setCombinedHistory] = useState<CombinedRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const setView = useApp((s) => s.setView);

  const loadCombined = useCallback(async () => {
    try {
      const c = await api<{ latest: { breakdown: Combined } | null }>("/api/vikriti/combined");
      if (c.latest) setCombined(c.latest.breakdown);
      const h = await api<{ combined: CombinedRecord[] }>("/api/history");
      setCombinedHistory(h.combined);
    } catch (err) {
      // No vikriti assessment yet — the empty state handles it.
      void err;
    }
  }, []);

  useEffect(() => {
    api<{ history: VikritiRecord[] }>("/api/vikriti")
      .then((d) => {
        setHistory(d.history);
        if (d.history.length > 0) loadCombined();
      })
      .catch(() => setHistory([]));
  }, [loadCombined]);

  if (!history) return <Spinner label="Loading your Vikriti results…" />;
  if (history.length === 0) {
    return (
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Vikriti results</h1>
        <div className="mt-6 rounded-xl border border-dashed bg-card/50 px-6 py-14 text-center">
          <p className="font-medium">No Vikriti check-in yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            The 34-question check-in captures your current state over the past 2-4 weeks. Repeat it weekly.
          </p>
          <Button className="mt-5" onClick={() => setView("vikriti-assessment")}>Begin check-in</Button>
        </div>
      </div>
    );
  }

  const latest = history[0];

  // Tiny per-component explainers: fixed weights + scale meaning.
  const COMPONENT_NOTES: Record<string, string> = {
    q: "% of signs ticked for your top dosha (9 of 13 Vata signs → 69). Scale: 0-100, higher = more imbalance signs.",
    w: "Fixed weights: sleep 20 · heart rate 15 · SpO2 10 · calories 15 · steps 15 · stress 15 · sleep quality 10. No reading for a parameter = assumed normal healthy level (no strain). Scale: 0-100, higher = further from normal.",
    e: "Fixed weights: season 40 · temperature 30 · humidity 30, each scored against your top dosha (cold/dry→Vata, hot/humid→Pitta, cold/damp→Kapha). Scale: 0-100, higher = climate aggravates your top dosha. 0 with data present = your climate is neutral for it.",
  };

  const DOSHA_FORMULA: Record<string, string> = {
    vata: "Vata % = Vata signs ÷ 13 × 100",
    pitta: "Pitta % = Pitta signs ÷ 10 × 100",
    kapha: "Kapha % = Kapha signs ÷ 11 × 100",
  };

  function envNote(e: Combined["environment"]): string {
    const bits = [e.seasonLabel];
    if (e.temperatureC != null) bits.push(`${Math.round(e.temperatureC)}°C`);
    if (e.humidity != null) bits.push(`${Math.round(e.humidity)}% RH`);
    if (e.rituSandhi) bits.push("junction");
    return bits.join(" · ");
  }

  async function recompute() {
    setBusy(true);
    try {
      await post("/api/vikriti/combined");
      await loadCombined();
      toast({ title: "Saved", description: "A combined snapshot was added to your history." });
    } catch {
      toast({ title: "Could not save", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Vikriti result</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            From your check-in answers · {fmtDate(latest.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView("vikriti-assessment")}>New check-in</Button>
        </div>
      </div>

      {/* Output A — result */}
      <Panel>
        <h2 className="font-semibold tracking-tight">Self-reported imbalance profile</h2>
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <DoshaDonut
            vata={latest.vataPct}
            pitta={latest.pittaPct}
            kapha={latest.kaphaPct}
            size={190}
            centerLabel={latest.dominant.split("_").map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(" = ")}
            centerSub="predominant signs"
          />
          <div className="w-full min-w-[150px] flex-1 sm:max-w-[220px]">
            <DoshaLegend vata={latest.vataPct} pitta={latest.pittaPct} kapha={latest.kaphaPct} />
            <div className="mt-4 space-y-2 border-t pt-3 text-xs text-muted-foreground">
              <p>Vata: {latest.vataCount}/13 · Pitta: {latest.pittaCount}/10 · Kapha: {latest.kaphaCount}/11 signs</p>
              {(["vata", "pitta", "kapha"] as const).map((d) => (
                <p key={d} className="rounded-md bg-muted/50 px-2 py-1.5 font-mono text-[10.5px]">{DOSHA_FORMULA[d]}</p>
              ))}
              <p>Scale 0-100: share of that dosha's signs currently present.</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Output B — experimental combined model */}
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold tracking-tight">Combined result (50/30/20)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check-in 50% · health data 30% (fixed weights per parameter) · environment 20% (fixed weights).
              Parameters without data count as a normal healthy level. Live values — new environment or health data applies on the next view.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={recompute} disabled={busy}>
            <RefreshCw className={`mr-1.5 h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Save snapshot
          </Button>
        </div>

        {!combined ? (
          <p className="mt-4 rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            Needs a Vikriti check-in first.
          </p>
        ) : (
          <>
            <div className="mt-5 grid gap-4 lg:grid-cols-5">
              <div className="flex flex-col items-center justify-center rounded-xl border bg-accent/40 p-6 lg:col-span-1">
                <div className="text-4xl font-semibold tabular-nums tracking-tight">{combined.combinedScore}</div>
                <div className="mt-1 text-center text-xs text-muted-foreground">Current State Index<br />0-100 · higher = more imbalance signals</div>
                <div className="mt-2 rounded-md bg-muted/60 px-2.5 py-1.5 text-center font-mono text-[11px] text-muted-foreground">0.5×Q + 0.3×W + 0.2×E</div>
                <div className="mt-3 rounded-full bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground border">
                  Confidence {combined.confidence}/100
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4">
                {[
                  { key: "q", label: "Check-in (50%)", value: combined.questionnaire.contribution, note: "from your check-in answers", color: "#2e6b46" },
                  { key: "w", label: "Health data (30%)", value: combined.wearable.contribution, note: combined.wearable.assumedCount > 0 ? `balance ${combined.wearable.balanceScore}/100 · ${combined.wearable.assumedCount} assumed normal` : `balance ${combined.wearable.balanceScore}/100`, color: "#0e9bb5" },
                  { key: "e", label: "Environment (20%)", value: combined.environment.contribution, note: combined.environment.assumedNormal ? "no snapshot — assumed neutral" : envNote(combined.environment), color: "#e0912f" },
                ].map((b) => (
                  <div key={b.key} className="flex flex-col rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">{b.label}</div>
                    <div className="mt-1 text-2xl font-semibold tabular-nums" style={{ color: b.color }}>{b.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{b.note}</div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, b.value)}%`, background: b.color }} />
                    </div>
                    <div className="mt-2.5 rounded-md bg-muted/50 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">{COMPONENT_NOTES[b.key]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Health data sub-scores (fixed weights)</h3>
                <div className="mt-3 space-y-3">
                  {combined.wearable.subScores.map((s) => (
                    <div key={s.metric}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="w-9 shrink-0 rounded bg-muted px-1 py-0.5 text-center font-mono text-[10px] text-muted-foreground" title="Fixed weight within the 30% block">{s.weight}%</span>
                          <span className="truncate text-sm font-medium">{s.label}</span>
                          {s.assumedNormal ? (
                            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground" title="No reading in the last 7 days — assumed at a normal healthy level">assumed normal</span>
                          ) : (
                            <ProvenanceBadge provenance={s.provenance} />
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm tabular-nums text-muted-foreground">
                            {s.assumedNormal ? "—" : s.value} → {s.score}/100
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                          </div>
                        </div>
                      </div>
                      <p className="mt-1 pl-11 text-[11px] leading-relaxed text-muted-foreground">{s.formula}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Balance = Σ(weight × score) ÷ 100. Parameters without a reading in the last 7 days are
                  assumed at a normal healthy level (score 100) — they add no strain.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Calculation explanation</h3>
                <ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
                  {combined.explanation.map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground/70">{i + 1}.</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* How this was calculated — the arithmetic, verbatim. */}
            <div className="mt-5 rounded-lg border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold">How this was calculated</h3>
              <div className="mt-3 space-y-2">
                {combined.calculation.map((line, i) => (
                  <p key={i} className="rounded-md bg-background px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                Weights are fixed design proposals: check-in 50% · health data 30% (sleep 20, heart rate 15,
                SpO2 10, calories 15, steps 15, stress 15, sleep quality 10) · environment 20% (season 40,
                temperature 30, humidity 30).
              </p>
            </div>

            {combinedHistory.length > 1 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold">Combined score history</h3>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...combinedHistory].reverse().map((c) => ({ date: new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), score: c.combinedScore, confidence: c.confidence }))}>
                      <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} width={30} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                      <Line type="monotone" dataKey="score" name="Combined score" stroke="#2e6b46" strokeWidth={2} dot />
                      <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}
