"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, ProvenanceBadge, Spinner } from "@/components/holistic/shared";
import { api, post, del } from "@/lib/client-api";
import { METRICS } from "@/lib/engine/reference-values";
import { fmtDateTime } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Reading {
  id: string;
  metric: string;
  value: number;
  unit: string;
  provenance: string;
  recordedAt: string;
}

const METRIC_KEYS = Object.keys(METRICS);

/** Range notes for metrics without a fixed normal range. */
const RANGE_NOTE: Record<string, string> = {
  hrv_rmssd: "Typical adult ≈ 42 ms (drops with age)",
};

/** Natural average values used to prefill the inputs (editable). */
const DEFAULTS: Record<string, string> = {
  heart_rate: "70",
  resting_heart_rate: "70",
  hrv_rmssd: "42",
  sleep_duration: "7.5",
  steps: "5000",
  active_minutes: "30",
  spo2: "97",
};

export default function ManualEntryScreen() {
  const [readings, setReadings] = useState<Reading[] | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() => ({ ...DEFAULTS }));
  const [busy, setBusy] = useState(false);

  async function load() {
    const d = await api<{ readings: Reading[] }>("/api/readings?days=30");
    setReadings(d.readings);
  }

  useEffect(() => {
    load().catch(() => setReadings([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const entries = Object.entries(values).filter(([, v]) => v !== "" && v != null);
    if (entries.length === 0) {
      toast({ title: "Nothing to save", description: "Enter at least one value." });
      return;
    }
    setBusy(true);
    try {
      for (const [metric, value] of entries) {
        await post("/api/readings", { metric, value: Number(value) });
      }
      setValues({ ...DEFAULTS });
      toast({ title: `Saved ${entries.length} reading${entries.length > 1 ? "s" : ""}` });
      await load();
    } catch (err) {
      toast({ title: "Could not save", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await del(`/api/readings?id=${id}`);
    await load();
  }

  return (
    <div className="animate-fade-up mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manual health data</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Today&apos;s values, prefilled with typical adult averages — edit anything, blank fields are skipped.
        </p>
      </div>

      <form onSubmit={submit}>
        <Panel className="p-0">
          <div className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
            {METRIC_KEYS.map((key) => {
              const meta = METRICS[key as keyof typeof METRICS];
              return (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`m-${key}`}>
                    {meta.label} <span className="text-muted-foreground">({meta.unit})</span>
                  </Label>
                  <Input
                    id={`m-${key}`}
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={values[key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  />
                  {meta.normalRange ? (
                    <p className="text-xs text-muted-foreground">
                      Normal {meta.normalRange[0]}–{meta.normalRange[1]} {meta.unit}
                    </p>
                  ) : (
                    RANGE_NOTE[key] && <p className="text-xs text-muted-foreground">{RANGE_NOTE[key]}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end border-t px-6 py-4">
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save today's readings"}</Button>
          </div>
        </Panel>
      </form>

      <Panel className="p-0">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Recent readings (30 days)</h2>
        </div>
        {!readings ? (
          <Spinner label="Loading readings…" />
        ) : readings.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">No readings yet — save your first values above.</p>
        ) : (
          <div className="holistic-scroll max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-6 py-2.5 font-medium">Metric</th>
                  <th className="px-6 py-2.5 font-medium">Value</th>
                  <th className="px-6 py-2.5 font-medium">Source</th>
                  <th className="px-6 py-2.5 font-medium">Recorded</th>
                  <th className="px-6 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-6 py-2.5 font-medium">{METRICS[r.metric as keyof typeof METRICS]?.label ?? r.metric}</td>
                    <td className="px-6 py-2.5 tabular-nums">{r.value.toLocaleString("en-US")} {r.unit}</td>
                    <td className="px-6 py-2.5"><ProvenanceBadge provenance={r.provenance} /></td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-muted-foreground">{fmtDateTime(r.recordedAt)}</td>
                    <td className="px-6 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        aria-label={`Delete ${r.metric} reading`}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
