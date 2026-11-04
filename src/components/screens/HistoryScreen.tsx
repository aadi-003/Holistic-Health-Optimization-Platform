"use client";

import { useEffect, useState } from "react";
import { Panel, Spinner, ProvenanceBadge } from "@/components/holistic/shared";
import { api } from "@/lib/client-api";
import { fmtDate, fmtDateTime } from "@/lib/store";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface HistoryData {
  prakriti: { id: string; vataPct: number; pittaPct: number; kaphaPct: number; label: string; scoringVersion: string; createdAt: string }[];
  vikriti: { id: string; vataPct: number; pittaPct: number; kaphaPct: number; dominant: string; scoringVersion: string; createdAt: string }[];
  combined: { id: string; combinedScore: number; confidence: number; modelVersion: string; createdAt: string }[];
  envSnapshots: { id: string; source: string; city: string | null; temperatureC: number | null; humidity: number | null; season: string; recordedAt: string }[];
}

export default function HistoryScreen() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [readings, setReadings] = useState<{ metric: string; value: number; recordedAt: string; provenance: string }[]>([]);

  useEffect(() => {
    api<HistoryData>("/api/history").then(setData).catch(() => setData({ prakriti: [], vikriti: [], combined: [], envSnapshots: [] }));
    api<{ readings: { metric: string; value: number; recordedAt: string; provenance: string }[] }>("/api/readings?days=30")
      .then((d) => setReadings(d.readings))
      .catch(() => setReadings([]));
  }, []);

  if (!data) return <Spinner label="Loading history…" />;

  const series = (metric: string) =>
    readings
      .filter((r) => r.metric === metric)
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
      .map((r) => ({ date: new Date(r.recordedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), value: r.value }));

  const hasAny = data.prakriti.length + data.vikriti.length + data.combined.length + readings.length + data.envSnapshots.length > 0;

  if (!hasAny) {
    return (
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-2 text-sm text-muted-foreground">Completed assessments, readings and generated recommendations appear here. Records are never overwritten.</p>
        <div className="mt-6 rounded-xl border border-dashed bg-card/50 px-6 py-14 text-center">
          <p className="font-medium">No history yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">Complete an assessment or add health data to start your record.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every assessment, reading and environment snapshot is stored with timestamps.
        </p>
      </div>

      {/* Health metric trends */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { key: "sleep_duration", label: "Sleep duration (h)", color: "#0e9bb5" },
          { key: "resting_heart_rate", label: "Resting heart rate (bpm)", color: "#d16a7c" },
          { key: "hrv_rmssd", label: "HRV RMSSD (ms)", color: "#7a6ff0" },
          { key: "steps", label: "Steps", color: "#4f9d5f" },
        ].map((m) => {
          const d = series(m.key);
          return (
            <Panel key={m.key}>
              <h2 className="font-semibold tracking-tight">{m.label}</h2>
              {d.length > 1 ? (
                <div className="mt-3 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={d}>
                      <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} width={34} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                      <Line type="monotone" dataKey="value" stroke={m.color} strokeWidth={2} dot={{ r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Not enough data points yet (need 2+ days).</p>
              )}
            </Panel>
          );
        })}
      </div>

      {/* Assessment history tables */}
      {data.prakriti.length > 0 && (
        <Panel className="p-0">
          <div className="border-b px-6 py-4"><h2 className="font-semibold">Prakriti assessments ({data.prakriti.length})</h2></div>
          <div className="holistic-scroll max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card"><tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-6 py-2.5 font-medium">Date</th><th className="px-6 py-2.5 font-medium">Result</th>
                <th className="px-6 py-2.5 font-medium">V/P/K %</th>
              </tr></thead>
              <tbody>{data.prakriti.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-6 py-2.5 whitespace-nowrap">{fmtDate(p.createdAt)}</td>
                  <td className="px-6 py-2.5 font-medium">{p.label}</td>
                  <td className="px-6 py-2.5 tabular-nums">{p.vataPct}/{p.pittaPct}/{p.kaphaPct}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      )}

      {data.vikriti.length > 0 && (
        <Panel className="p-0">
          <div className="border-b px-6 py-4"><h2 className="font-semibold">Vikriti check-ins ({data.vikriti.length})</h2></div>
          <div className="holistic-scroll max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card"><tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-6 py-2.5 font-medium">Date</th><th className="px-6 py-2.5 font-medium">Dominant</th>
                <th className="px-6 py-2.5 font-medium">V/P/K %</th>
              </tr></thead>
              <tbody>{data.vikriti.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="px-6 py-2.5 whitespace-nowrap">{fmtDate(v.createdAt)}</td>
                  <td className="px-6 py-2.5 font-medium capitalize">{v.dominant.replace("_", " = ")}</td>
                  <td className="px-6 py-2.5 tabular-nums">{v.vataPct}/{v.pittaPct}/{v.kaphaPct}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      )}

      {data.combined.length > 0 && (
        <Panel>
          <h2 className="font-semibold tracking-tight">Experimental combined scores</h2>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...data.combined].reverse().map((c) => ({ date: fmtDate(c.createdAt), score: c.combinedScore }))}>
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                <Bar dataKey="score" fill="#2e6b46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}

      {data.envSnapshots.length > 0 && (
        <Panel className="p-0">
          <div className="border-b px-6 py-4"><h2 className="font-semibold">Environment snapshots</h2></div>
          <div className="holistic-scroll max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card"><tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-6 py-2.5 font-medium">When</th><th className="px-6 py-2.5 font-medium">Source</th>
                <th className="px-6 py-2.5 font-medium">Place</th><th className="px-6 py-2.5 font-medium">Temp</th>
                <th className="px-6 py-2.5 font-medium">RH</th><th className="px-6 py-2.5 font-medium">Season</th>
              </tr></thead>
              <tbody>{data.envSnapshots.map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="px-6 py-2.5 whitespace-nowrap">{fmtDateTime(e.recordedAt)}</td>
                  <td className="px-6 py-2.5 capitalize">{e.source}</td>
                  <td className="px-6 py-2.5">{e.city ?? "—"}</td>
                  <td className="px-6 py-2.5 tabular-nums">{e.temperatureC != null ? `${Math.round(e.temperatureC)}°C` : "—"}</td>
                  <td className="px-6 py-2.5 tabular-nums">{e.humidity != null ? `${Math.round(e.humidity)}%` : "—"}</td>
                  <td className="px-6 py-2.5">{e.season}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      )}

      <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        Source key: <ProvenanceBadge provenance="measured" /> <ProvenanceBadge provenance="manual" />
      </p>
    </div>
  );
}
