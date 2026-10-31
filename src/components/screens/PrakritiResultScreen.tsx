"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DoshaDonut, DoshaLegend, Panel, Spinner } from "@/components/holistic/shared";
import { useApp, fmtDate } from "@/lib/store";
import { api } from "@/lib/client-api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PrakritiRecord {
  id: string;
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  vataPct: number;
  pittaPct: number;
  kaphaPct: number;
  classification: string;
  label: string;
  instrumentId: string;
  scoringVersion: string;
  createdAt: string;
}

const DOSHA_NOTES: Record<string, string> = {
  vata: "Dry, light, cold, mobile — linked with creativity, quick learning and variable routines.",
  pitta: "Hot, sharp, light, oily — linked with strong digestion, drive and focus.",
  kapha: "Heavy, cool, stable, smooth — linked with steadiness, strength and calm.",
};

export default function PrakritiResultScreen() {
  const [history, setHistory] = useState<PrakritiRecord[] | null>(null);
  const setView = useApp((s) => s.setView);

  useEffect(() => {
    api<{ history: PrakritiRecord[] }>("/api/prakriti").then((d) => setHistory(d.history)).catch(() => setHistory([]));
  }, []);

  if (!history) return <Spinner label="Loading your Prakriti results…" />;
  if (history.length === 0) {
    return (
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Prakriti results</h1>
        <div className="mt-6 rounded-xl border border-dashed bg-card/50 px-6 py-14 text-center">
          <p className="font-medium">No Prakriti assessment yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Take the 62-question assessment to establish your baseline constitution.
          </p>
          <Button className="mt-5" onClick={() => setView("prakriti-assessment")}>Begin assessment</Button>
        </div>
      </div>
    );
  }
  const latest = history[0];
  const chart = [...history].reverse().map((h) => ({
    date: new Date(h.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    vata: h.vataPct,
    pitta: h.pittaPct,
    kapha: h.kaphaPct,
  }));

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Prakriti result</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            From your questionnaire answers · {fmtDate(latest.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView("vikriti-assessment")}>Now check your current state</Button>
          <Button variant="ghost" onClick={() => setView("prakriti-assessment")}>Retake</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="font-semibold tracking-tight">Constitution profile</h2>
          <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
            <DoshaDonut
              vata={latest.vataPct}
              pitta={latest.pittaPct}
              kapha={latest.kaphaPct}
              size={190}
              centerLabel={latest.classification === "sama" ? "Balanced" : latest.label.replace("-dominant", "").replace("-leaning", "")}
              centerSub="constitution"
            />
            <div className="w-full min-w-[150px] flex-1 sm:max-w-[210px]">
              <DoshaLegend vata={latest.vataPct} pitta={latest.pittaPct} kapha={latest.kaphaPct} />
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold tracking-tight">Absolute scores (guna-proportional)</h2>
          <div className="mt-4 space-y-4">
            {[
              { name: "Vata", score: latest.vataScore, max: 960, pct: latest.vataPct, color: "var(--vata)" },
              { name: "Pitta", score: latest.pittaScore, max: 600, pct: latest.pittaPct, color: "var(--pitta)" },
              { name: "Kapha", score: latest.kaphaScore, max: 1440, pct: latest.kaphaPct, color: "var(--kapha)" },
            ].map((d) => (
              <div key={d.name}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {d.score} / {d.max} · <strong className="text-foreground">{d.pct}%</strong>
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Formula: % = score ÷ max × 100&nbsp;&nbsp;·&nbsp;&nbsp;Vata 960 · Pitta 600 · Kapha 1440
          </p>
        </Panel>
      </div>

      <Panel>
        <h2 className="font-semibold tracking-tight">What this means</h2>
        <p className="mt-3 text-sm leading-relaxed">
          <strong>{latest.label}.</strong>{" "}
          {latest.classification === "sama"
            ? "All three doshas contribute substantially — a balanced constitution (sama)."
            : latest.classification.includes("_")
              ? "Two doshas dominate (dual constitution, dvandvaja)."
              : "One dosha clearly dominates (single-dominant constitution)."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(["vata", "pitta", "kapha"] as const).map((d) => (
            <div key={d} className="rounded-lg border p-4">
              <div className="text-sm font-semibold capitalize" style={{ color: `var(--${d})` }}>{d}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{DOSHA_NOTES[d]}</p>
            </div>
          ))}
        </div>
      </Panel>

      {history.length > 1 && (
        <Panel>
          <h2 className="font-semibold tracking-tight">Trend over repeated assessments</h2>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} unit="%" width={38} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                <Line type="monotone" dataKey="vata" stroke="var(--vata)" strokeWidth={2} dot />
                <Line type="monotone" dataKey="pitta" stroke="var(--pitta)" strokeWidth={2} dot />
                <Line type="monotone" dataKey="kapha" stroke="var(--kapha)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}
    </div>
  );
}
