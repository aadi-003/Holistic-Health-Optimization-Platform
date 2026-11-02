/**
 * Deterministic, explainable recommendation engine.
 *
 * Design per the research report (Ch. 14):
 *  - transparent rules, no black-box scoring;
 *  - three-valued condition evaluation: true / false / unknown. A rule whose
 *    required input is missing is WITHHELD with reason "waiting for data";
 *  - fixed precedence: safety (1) > contraindication (2) > vikriti-correction
 *    (3) > prakriti-maintenance (4) > general education (5). Conflicts are
 *    resolved by precedence and the resolution is recorded;
 *  - each emitted card carries the full explanation payload (inputs that
 *    influenced it, sources, evidence level, precautions, applicability).
 */

import {
  KNOWLEDGE_BASE,
  type RecommendationRule,
  type Dosha,
} from "@/lib/data/knowledge-base";
import { constitutionDoshas, type PrakritiScore } from "./prakriti-engine";
import type { VikritiScore } from "./vikriti-engine";
import type { CombinedResult, ReadingInput } from "./combined-engine";
import type { Season } from "./seasonal";

export interface RuleContext {
  prakriti: PrakritiScore | null;
  vikriti: VikritiScore | null;
  combined: CombinedResult | null;
  season: Season;
  rituSandhi: boolean;
  readings: ReadingInput[]; // last 7 days
  age: number | null;
}

export type RuleOutcome =
  | { status: "shown"; rule: RecommendationRule; because: string[] }
  | { status: "withheld"; rule: RecommendationRule; reason: string };

export type ShownOutcome = Extract<RuleOutcome, { status: "shown" }>;
export type WithheldOutcome = Extract<RuleOutcome, { status: "withheld" }>;

function mean(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function computeWearableFlags(readings: ReadingInput[], age: number | null) {
  const weekAgo = (asOf: Date) => new Date(asOf.getTime() - 7 * 24 * 3600 * 1000);
  const asOf = new Date();
  const start = weekAgo(asOf);
  const within = (m: string) =>
    readings.filter((r) => r.metric === m && new Date(r.recordedAt) >= start);

  const sleep = within("sleep_duration").map((r) => r.value);
  const rhr = within("resting_heart_rate").map((r) => r.value);
  const hrv = within("hrv_rmssd").map((r) => r.value);
  const steps = within("steps").map((r) => r.value);

  const sleepAvg = sleep.length ? mean(sleep) : null;
  const rhrAvg = rhr.length ? mean(rhr) : null;
  const hrvAvg = hrv.length ? mean(hrv) : null;
  const stepsAvg = steps.length ? mean(steps) : null;

  const sleepDebt = sleepAvg != null ? sleepAvg < 6.5 : null;
  // RHR elevated: above 85 bpm or > 5 bpm above the user's overall baseline
  // (all-time average of manual/measured readings) — design proposals.
  const allRhr = readings.filter((r) => r.metric === "resting_heart_rate").map((r) => r.value);
  const baseline = allRhr.length ? mean(allRhr) : null;
  const rhrElevated =
    rhrAvg != null && baseline != null ? rhrAvg > baseline + 5 || rhrAvg > 85 : null;
  const hrvRefTable: Record<number, number> = { 0: 55, 26: 45, 36: 38, 46: 32, 56: 27, 66: 22 };
  const band =
    age == null ? 42 : age <= 25 ? 55 : age <= 35 ? 45 : age <= 45 ? 38 : age <= 55 ? 32 : age <= 65 ? 27 : 22;
  void hrvRefTable;
  const lowHrv = hrvAvg != null ? hrvAvg < band * 0.8 : null;
  const lowActivity = stepsAvg != null ? stepsAvg < 4000 : null;

  return { sleepDebt, rhrElevated, lowHrv, lowActivity, sleepAvg, rhrAvg, hrvAvg, stepsAvg };
}

function vikritiDominantDoshas(vikriti: VikritiScore): Dosha[] {
  return vikriti.dominant.split("_").filter((d) => d === "vata" || d === "pitta" || d === "kapha") as Dosha[];
}

/**
 * Evaluate every rule against the context.
 * Returns shown rules (sorted by precedence, then rule id) and the withheld
 * log with reasons (transparency feature, shown in a "not shown now" panel).
 */
export function evaluateRules(ctx: RuleContext): { shown: ShownOutcome[]; withheld: WithheldOutcome[] } {
  const flags = computeWearableFlags(ctx.readings, ctx.age);
  const prakritiDoshas: Dosha[] | null = ctx.prakriti ? constitutionDoshas(ctx.prakriti.classification) : null;
  const vikritiDoshas: Dosha[] | null = ctx.vikriti ? vikritiDominantDoshas(ctx.vikriti) : null;
  const dominantPct = ctx.vikriti
    ? Math.max(ctx.vikriti.vataPct, ctx.vikriti.pittaPct, ctx.vikriti.kaphaPct)
    : null;

  const shown: ShownOutcome[] = [];
  const withheld: WithheldOutcome[] = [];

  for (const rule of KNOWLEDGE_BASE) {
    const c = rule.conditions;
    const because: string[] = [];
    let unknown = false;
    let unknownReason = "";

    // Prakriti condition
    if (c.prakritiIncludes) {
      if (!prakritiDoshas) {
        unknown = true;
        unknownReason = "waiting for a completed Prakriti assessment";
      } else {
        const match = c.prakritiIncludes.some((d) => prakritiDoshas.includes(d));
        if (!match) {
          withheld.push({ status: "withheld", rule, reason: "constitution condition not met" });
          continue;
        }
        because.push(
          `your constitution (${ctx.prakriti!.label}) includes ${c.prakritiIncludes.filter((d) => prakritiDoshas!.includes(d)).join(" & ")}`
        );
      }
    }

    // Vikriti condition
    if (c.vikritiDominant) {
      if (!vikritiDoshas) {
        unknown = true;
        unknownReason = "waiting for a completed Vikriti self-assessment";
      } else if (!vikritiDoshas.includes(c.vikritiDominant)) {
        withheld.push({ status: "withheld", rule, reason: "current-state condition not met" });
        continue;
      } else {
        because.push(
          `your current self-assessment shows ${c.vikritiDominant}-predominant signs${dominantPct != null ? ` (${dominantPct}%)` : ""}`
        );
      }
    }
    if (c.vikritiAtLeast != null) {
      if (dominantPct == null) {
        unknown = true;
        unknownReason = "waiting for a completed Vikriti self-assessment";
      } else if (dominantPct < c.vikritiAtLeast) {
        withheld.push({ status: "withheld", rule, reason: "imbalance below rule threshold" });
        continue;
      }
    }

    // Season condition
    if (c.seasons) {
      if (!c.seasons.includes(ctx.season)) {
        withheld.push({ status: "withheld", rule, reason: "not the current season" });
        continue;
      }
      because.push(`the current season is ${ctx.season}`);
    }
    if (c.rituSandhi === true) {
      if (!ctx.rituSandhi) {
        withheld.push({ status: "withheld", rule, reason: "outside the seasonal junction window" });
        continue;
      }
      because.push("the date falls in a seasonal junction (ṛtu-sandhi) window");
    }

    // Wearable conditions
    if (c.wearable) {
      // Map snake_case condition flags to the camelCase keys of the flags object.
      const flagKeys: Record<string, keyof typeof flags> = {
        sleep_debt: "sleepDebt",
        rhr_elevated: "rhrElevated",
        low_hrv: "lowHrv",
        low_activity: "lowActivity",
      };
      for (const flag of c.wearable) {
        const value = flags[flagKeys[flag] ?? flag];
        if (value == null) {
          unknown = true;
          unknownReason =
            flag === "sleep_debt"
              ? "waiting for sleep data (7-day window)"
              : flag === "rhr_elevated"
                ? "waiting for resting-heart-rate data (7-day window)"
                : flag === "low_hrv"
                  ? "waiting for HRV data (7-day window)"
                  : "waiting for activity data (7-day window)";
          break;
        }
        if (!value) {
          withheld.push({ status: "withheld", rule, reason: `wearable flag "${flag}" not triggered` });
          break;
        }
        because.push(
          flag === "sleep_debt"
            ? `your 7-day sleep average is ${flags.sleepAvg?.toFixed(1)} h (below the 6.5 h design-proposal threshold)`
            : flag === "rhr_elevated"
              ? `your 7-day resting heart rate average is elevated`
              : flag === "low_hrv"
                ? `your HRV nights are repeatedly low`
                : `your 7-day step average is low`
        );
      }
      if (because.length === 0 && !unknown) continue;
    }

    if (unknown) {
      withheld.push({ status: "withheld", rule, reason: unknownReason });
      continue;
    }

    if (because.length === 0) because.push("it applies to everyone as general education");
    shown.push({ status: "shown", rule, because });
  }

  // Precedence ordering; conflicts recorded in the payload of vikriti-correction rules.
  shown.sort((a, b) => a.rule.precedence - b.rule.precedence || a.rule.ruleId.localeCompare(b.rule.ruleId));

  // Conflict recording: if a safety rule fired, note the resolution on lower-precedence rules.
  const safetyFired = shown.some((s) => s.rule.precedence === 1);
  if (safetyFired) {
    for (const s of shown) {
      if (s.status === "shown" && s.rule.precedence > 1) {
        s.because.push(
          `shown after a higher-precedence recovery rule outweighed routine advice under fixed precedence (safety > contraindication > vikriti-correction > prakriti-maintenance > education)`
        );
      }
    }
  }

  return { shown, withheld };
}
