"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PRAKRITI_ITEMS } from "@/lib/data/prakriti-questions";
import { useApp } from "@/lib/store";
import { post } from "@/lib/client-api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Answers = Record<string, "yes" | "no">;

export default function PrakritiAssessmentScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("holistic_prakriti_draft");
        if (raw) return JSON.parse(raw) as Answers;
      } catch { /* ignore */ }
    }
    return {};
  });
  const [busy, setBusy] = useState(false);
  const setView = useApp((s) => s.setView);

  const item = PRAKRITI_ITEMS[index];
  const answeredCount = useMemo(() => PRAKRITI_ITEMS.filter((i) => answers[i.id]).length, [answers]);
  const allAnswered = answeredCount === PRAKRITI_ITEMS.length;

  function setAnswer(value: "yes" | "no") {
    const next = { ...answers, [item.id]: value };
    setAnswers(next);
    try {
      window.localStorage.setItem("holistic_prakriti_draft", JSON.stringify(next));
    } catch { /* ignore */ }
    // Auto-advance after a short beat, like the reference flow.
    setTimeout(() => {
      if (index < PRAKRITI_ITEMS.length - 1) setIndex(index + 1);
    }, 180);
  }

  async function submit() {
    if (!allAnswered) {
      toast({ title: "Some questions are unanswered", description: "Use the dots to jump to any unanswered question.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await post<{ assessment: { id: string } }>("/api/prakriti", { answers });
      try { window.localStorage.removeItem("holistic_prakriti_draft"); } catch { /* ignore */ }
      toast({ title: "Assessment complete", description: "Your Prakriti result is ready." });
      setView("prakriti-result");
      void res;
    } catch (err) {
      toast({ title: "Could not submit", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  const progress = (answeredCount / PRAKRITI_ITEMS.length) * 100;

  return (
    <div className="animate-fade-up mx-auto max-w-2xl space-y-5">
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Prakriti Assessment</h1>
          <span className="text-sm tabular-nums text-muted-foreground">{index + 1} / {PRAKRITI_ITEMS.length}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <span className="text-[11px] text-muted-foreground">Q{item.serial}</span>

        <p className="mt-4 text-lg font-medium leading-snug">{item.text}</p>

        <RadioGroup value={answers[item.id] ?? ""} onValueChange={(v) => setAnswer(v as "yes" | "no")} className="mt-6 gap-3">
          <label
            htmlFor={`opt-yes`}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent`}
          >
            <RadioGroupItem id="opt-yes" value="yes" />
            <span className="text-sm font-medium">Yes</span>
          </label>
          <label
            htmlFor={`opt-no`}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent`}
          >
            <RadioGroupItem id="opt-no" value="no" />
            <span className="text-sm font-medium">No</span>
          </label>
        </RadioGroup>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
          </Button>
          {index < PRAKRITI_ITEMS.length - 1 ? (
            <Button onClick={() => setIndex(index + 1)}>
              Next <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={busy || !allAnswered}>
              {busy ? "Scoring…" : "Complete assessment"}
            </Button>
          )}
        </div>
      </div>

      {/* Jump grid */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Question map</h2>
          <span className="text-xs text-muted-foreground">{answeredCount} of {PRAKRITI_ITEMS.length} answered</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRAKRITI_ITEMS.map((it, i) => (
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
              {i + 1}
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
