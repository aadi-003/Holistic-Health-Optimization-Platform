"use client";

import { useEffect, useState } from "react";
import { Panel, Spinner, DOSHA_SYMBOLS } from "@/components/holistic/shared";
import { api } from "@/lib/client-api";
import { ChevronDown } from "lucide-react";

interface Rec {
  ruleId: string;
  category: string;
  precedence: number;
  sanskritDeva: string;
  sanskritIast: string;
  english: string;
  recommendation: string;
  steps: string[];
  doshaFocus: string | null;
  why: string;
  evidenceLevel: string;
  applicability: string;
}

interface RecData {
  generatedAt: string;
  season: string;
  shown: Rec[];
  withheld: { ruleId: string; english: string; reason: string }[];
  note: string;
}

const CATEGORIES = [
  { id: "all", label: "Today" },
  { id: "dinacharya", label: "Daily routine" },
  { id: "ahara", label: "Diet" },
  { id: "pathya", label: "Pathya" },
  { id: "apathya", label: "Apathya" },
  { id: "vyayama", label: "Exercise" },
  { id: "nidra", label: "Sleep" },
  { id: "ritucharya", label: "Seasonal" },
  { id: "sadvritta", label: "Conduct" },
];

const CATEGORY_LABEL: Record<string, string> = {
  dinacharya: "दिनचर्या — Dinacharya",
  ahara: "आहार — Ahara",
  pathya: "पथ्य — Pathya",
  apathya: "अपथ्य — Apathya",
  vyayama: "व्यायाम — Vyayama",
  nidra: "निद्रा — Nidra",
  ritucharya: "ऋतुचर्या — Ritucharya",
  sadvritta: "सद्वृत्त — Sadvritta",
};

export default function RecommendationsScreen() {
  const [data, setData] = useState<RecData | null>(null);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    api<RecData>("/api/recommendations").then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <Spinner label="Loading recommendations…" />;

  const visible = tab === "all" ? data.shown : data.shown.filter((r) => r.category === tab);

  return (
    <div className="animate-fade-up mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your recommendations</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          From your Prakriti, latest check-in, health data and season. Season:{" "}
          <strong className="text-foreground">{data.season}</strong>.
        </p>
      </div>

      <div className="holistic-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setTab(c.id)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              tab === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
          <p className="font-medium">No rules fire for this category right now</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Rules appear when their conditions are met. Complete your assessments to unlock more.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((rec) => {
            const expanded = open === rec.ruleId;
            const symbol = rec.doshaFocus ? DOSHA_SYMBOLS[rec.doshaFocus as keyof typeof DOSHA_SYMBOLS] : null;
            return (
              <Panel key={rec.ruleId} className="p-0">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {symbol && (
                          <span
                            className="rounded-full bg-muted px-2 py-0.5 text-sm leading-none"
                            title={`Targets your ${rec.doshaFocus} state`}
                          >
                            {symbol}
                          </span>
                        )}
                        <span className="text-xl leading-none">{rec.sanskritDeva}</span>
                        <span className="text-sm font-medium text-muted-foreground italic">{rec.sanskritIast}</span>
                      </div>
                      <h2 className="mt-1 font-semibold tracking-tight">{rec.english}</h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">{CATEGORY_LABEL[rec.category] ?? rec.category}</p>
                    </div>
                  </div>

                  {/* What to do — short actionable steps only. */}
                  <ul className="mt-4 space-y-1.5">
                    {rec.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : rec.ruleId)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    aria-expanded={expanded}
                  >
                    Why this?
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>

                  {expanded && (
                    <div className="mt-2 space-y-2 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                      <p>{rec.recommendation}</p>
                      <p>{rec.why}</p>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
