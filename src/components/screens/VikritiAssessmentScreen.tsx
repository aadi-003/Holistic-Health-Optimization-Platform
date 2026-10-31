"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VIKRITI_ITEMS } from "@/lib/data/vikriti-questions";
import { useApp } from "@/lib/store";
import { post } from "@/lib/client-api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Answers = Record<string, "yes" | "no">;

export default function VikritiAssessmentScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("holistic_vikriti_draft");
        if (raw) return JSON.parse(raw) as Answers;
      } catch { /* ignore */ }
    }
    return {};
  });
  const [busy, setBusy] = useState(false);
  const setView = useApp((s) => s.setView);

  const item = VIKRITI_ITEMS[index];
  const answeredCount = useMemo(() => VIKRITI_ITEMS.filter((i) => answers[i.id]).length, [answers]);
  const allAnswered = answeredCount === VIKRITI_ITEMS.length;

  function setAnswer(value: "yes" | "no") {
    const next = { ...answers, [item.id]: value };
    setAnswers(next);
    try {
      window.localStorage.setItem("holistic_vikriti_draft", JSON.stringify(next));
    } catch { /* ignore */ }
    setTimeout(() => {
      if (index < VIKRITI_ITEMS.length - 1) setIndex(index + 1);
    }, 180);
  }

  async function submit() {
    if (!allAnswered) {
      toast({ title: "Some questions are unanswered", description: "Jump to any unanswered question from the map below.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      await post("/api/vikriti", { answers });
      try { window.localStorage.removeItem("holistic_vikriti_draft"); } catch { /* ignore */ }
      toast({ title: "Check-in complete", description: "Your Vikriti result and combined model are ready." });
      setView("vikriti-result");
    } catch (err) {
      toast({ title: "Could not submit", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  const progress = (answeredCount / VIKRITI_ITEMS.length) * 100;

  return (
    <div className="animate-fade-up mx-auto max-w-2xl space-y-5">
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Vikriti Check-in</h1>
          <span className="text-sm tabular-nums text-muted-foreground">{index + 1} / {VIKRITI_ITEMS.length}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">Answer for how you have felt over the past 2-4 weeks.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <span className="text-[11px] text-muted-foreground">Q{item.serial}</span>

        <p className="mt-2 text-sm font-semibold text-muted-foreground">{item.title}</p>
        <p className="mt-2 text-lg font-medium leading-snug">{item.text}</p>

        <RadioGroup value={answers[item.id] ?? ""} onValueChange={(v) => setAnswer(v as "yes" | "no")} className="mt-6 gap-3">
          <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent`}>
            <RadioGroupItem value="yes" id={`vyes-${item.id}`} />
            <span className="text-sm font-medium">Yes — present</span>
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent`}>
            <RadioGroupItem value="no" id={`vno-${item.id}`} />
            <span className="text-sm font-medium">No — not present</span>
          </label>
        </RadioGroup>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
          </Button>
          {index < VIKRITI_ITEMS.length - 1 ? (
            <Button onClick={() => setIndex(index + 1)}>
              Next <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={busy || !allAnswered}>
              {busy ? "Scoring…" : "Complete check-in"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Question map</h2>
          <span className="text-xs text-muted-foreground">{answeredCount} of {VIKRITI_ITEMS.length} answered</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {VIKRITI_ITEMS.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Jump to question ${i + 1}`}
              className={`h-7 w-7 rounded-md text-[11px] font-medium transition-colors ${
                i === index
                  ? "bg-primary text-primary-foreground"
                  : answers[it.id]
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {it.serial}
            </button>
          ))}
        </div>
        {!allAnswered && (
          <Button variant="outline" size="sm" className="mt-4" onClick={submit} disabled={busy}>
            Review &amp; submit
          </Button>
        )}
      </div>
    </div>
  );
}
