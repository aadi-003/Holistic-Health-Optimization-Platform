/**
 * Experimental combined current-state model (50/30/20).
 *
 * STATUS: this combined model is a PLATFORM DESIGN PROPOSAL requested by the
 * project brief. No reviewed research justifies these weights; the research
 * report itself states that no reviewed study supports merging questionnaire,
 * wearable and environmental inputs into one score, and that no wearable
 * variable measures a dosha. The implementation therefore:
 *
 *   - keeps the three contributions separately visible with their weights;
 *   - never maps wearable variables onto doshas (the wearable contribution is
 *     a dosha-agnostic "physiological strain" component built from deviations
 *     of documented reference ranges);
 *   - maps only the ENVIRONMENT onto doshas, using classical/traditional guna
 *     logic (cold+dry aggravates Vata, heat aggravates Pitta, cold+damp
 *     aggravates Kapha) — labelled classical/traditional;
 *   - emits a data-completeness/confidence indicator;
 *   - is labelled "experimental" everywhere it appears.
 *
 * Combined Current State Index (0-100, higher = more imbalance signals):
 *   = 0.5 x Questionnaire severity      (dominant vikriti dosha %)
 *   + 0.3 x (100 - Wearable balance)    (reference-range deviation index)
 *   + 0.2 x Environmental aggravation   (of the dominant vikriti dosha)
 *
 * Environmental aggravation (v2) is the sum of three interpretable terms:
 *   weather  — guna response of the dominant dosha to the recorded
 *              temperature/humidity (slopes below);
 *   season   — +25 when the current ritu classically aggravates the dominant
 *              dosha (the primary traditional driver);
 *   junction — +10 during ritu-sandhi (seasonal junction) windows.
 * Without a user-recorded environment snapshot the component stays 0 — a
 * season guessed from the date alone is not user data.
 */

import type { Dosha } from "@/lib/data/prakriti-questions";
import { vikritiDominantDosha, type VikritiScore } from "./vikriti-engine";
import { round2 } from "./prakriti-engine";
import {
  COMBINED_WEARABLE_METRICS,
  METRICS,
  hrvReferenceAverage,
  type MetricKey,
} from "./reference-values";
import { computeSeason, seasonDoshaTendency, SEASON_LABEL, isRituSandhi, type Season } from "./seasonal";

export interface ReadingInput {
  metric: string;
  value: number;
  provenance: string; // measured | manual | estimated | simulated
  recordedAt: string;
}

export interface EnvironmentInput {
  temperatureC: number | null;
  humidity: number | null;
  season: Season;
  source: string; // location | city | manual | derived
  city?: string | null;
}

export interface CombinedResult {
  modelVersion: string;
  combinedScore: number;
  dominantDosha: Dosha | null;
  questionnaire: {
    contribution: number; // 0-100, the QC value (weighted at 0.5)
    dominantDosha: Dosha | null;
    dominantPct: number;
  };
  wearable: {
    contribution: number; // strain 0-100 (weighted at 0.3)
    balanceScore: number; // 0-100, higher = closer to reference ranges
    subScores: { metric: MetricKey; label: string; value: number; provenance: string; score: number; formula: string }[];
    dataCompleteness: number; // 0-1 share of real (non-estimated) inputs
  };
  environment: {
    contribution: number; // aggravation 0-100 (weighted at 0.2)
    weatherTerm: number;
    seasonTerm: number;
    junctionTerm: number;
    temperatureC: number | null;
    humidity: number | null;
    season: Season;
    seasonLabel: string;
    rituSandhi: boolean;
    tendencyDoshas: Dosha[];
    aggravationOfDominant: number;
  };
  confidence: number; // 0-100 data completeness / confidence indicator
  explanation: string[];
}

const MODEL_VERSION = "combined_50_30_20_experimental_v2";

export function computeCombined(
  vikriti: VikritiScore,
  readings: ReadingInput[],
  environment: EnvironmentInput | null,
  age: number | null | undefined,
  asOf: Date = new Date()
): CombinedResult {
  // ---------- Questionnaire (50%) ----------
  const dominant = vikritiDominantDosha(vikriti.dominant);
  const dominantPct = dominant
    ? vikriti[`${dominant}Pct` as "vataPct" | "pittaPct" | "kaphaPct"]
    : 0;
  const qContribution = round2(dominantPct);

  // ---------- Wearable (30%) ----------
  // 7-day window ending asOf (design-proposal window, documented).
  const windowStart = new Date(asOf.getTime() - 7 * 24 * 3600 * 1000);
  const latestByMetric = new Map<MetricKey, { value: number; provenance: string }>();
  for (const key of COMBINED_WEARABLE_METRICS) {
    const rows = readings
      .filter((r) => r.metric === key && new Date(r.recordedAt) >= windowStart)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    if (rows.length > 0) {
      latestByMetric.set(key, { value: rows[0].value, provenance: rows[0].provenance });
    }
  }

  const subScores: CombinedResult["wearable"]["subScores"] = [];
  let realCount = 0;

  for (const key of COMBINED_WEARABLE_METRICS) {
    const found = latestByMetric.get(key);
    // Missing indicators are EXCLUDED, never imputed: the model only uses
    // numbers the user actually provided (device or manual entry).
    if (!found) continue;
    if (found.provenance === "measured" || found.provenance === "manual") realCount += 1;
    subScores.push({
      metric: key,
      label: METRICS[key].label,
      value: found.value,
      provenance: found.provenance,
      score: normalizeWearableScore(key, found.value, age),
      formula: wearableScoreFormula(key),
    });
  }

  const balanceScore = subScores.length > 0
    ? round2(subScores.reduce((s, x) => s + x.score, 0) / subScores.length)
    : 0;
  const strain = subScores.length > 0 ? round2(100 - balanceScore) : 0;
  const wContribution = strain;
  const dataCompleteness = round2(realCount / COMBINED_WEARABLE_METRICS.length);

  // ---------- Environment (20%) ----------
  const season = environment?.season ?? computeSeason(asOf, null);
  const tendency = seasonDoshaTendency(season);
  const sandhi = isRituSandhi(asOf, null);
  // Three interpretable terms (see header doc). Without a real environment
  // snapshot all terms stay 0 — a season guessed from the date alone is not
  // user data.
  let weatherAgg = 0;
  let seasonAgg = 0;
  let junctionAgg = 0;
  if (dominant && environment) {
    weatherAgg = environmentalAggravation(dominant, environment.temperatureC, environment.humidity);
    if (tendency.includes(dominant)) seasonAgg = 25;
    if (sandhi) junctionAgg = 10;
  }
  const eContribution = Math.min(100, round2(weatherAgg + seasonAgg + junctionAgg));

  // ---------- Combined ----------
  const combinedScore = round2(0.5 * qContribution + 0.3 * wContribution + 0.2 * eContribution);

  // ---------- Confidence ----------
  const qPresent = dominant != null ? 1 : 0;
  const eQuality =
    environment == null
      ? 0
      : environment.source === "location"
        ? 1
        : environment.source === "city"
          ? 0.8
          : 0.7;
  const confidence = round2(
    100 * (0.5 * qPresent + 0.3 * dataCompleteness + 0.2 * eQuality)
  );

  // ---------- Explanation payload ----------
  const explanation: string[] = [
    `Questionnaire (50%): dominant imbalance ${qContribution}/100.`,
    subScores.length > 0
      ? `Wearable (30%): balance ${balanceScore}/100 across ${subScores.length} indicator${subScores.length > 1 ? "s" : ""} → strain ${wContribution}/100.`
      : "Wearable (30%): no device or manual readings in the last 7 days — contributes 0.",
    environment
      ? `Environment (20%): ${environment.temperatureC != null ? `${environment.temperatureC}°C, ` : ""}${environment.humidity != null ? `${environment.humidity}% RH, ` : ""}${SEASON_LABEL[season]} → weather ${weatherAgg} + season ${seasonAgg} + junction ${junctionAgg} = ${eContribution}/100 for your ${dominant ?? "dominant"} dosha.`
      : "Environment (20%): no environment snapshot — contributes 0.",
    `Combined = 0.5 × ${qContribution} + 0.3 × ${wContribution} + 0.2 × ${eContribution} = ${combinedScore}/100.`,
  ];

  return {
    modelVersion: MODEL_VERSION,
    combinedScore,
    dominantDosha: dominant,
    questionnaire: { contribution: qContribution, dominantDosha: dominant, dominantPct },
    wearable: { contribution: wContribution, balanceScore, subScores, dataCompleteness },
    environment: {
      contribution: eContribution,
      weatherTerm: weatherAgg,
      seasonTerm: seasonAgg,
      junctionTerm: junctionAgg,
      temperatureC: environment?.temperatureC ?? null,
      humidity: environment?.humidity ?? null,
      season,
      seasonLabel: SEASON_LABEL[season],
      rituSandhi: sandhi,
      tendencyDoshas: tendency,
      aggravationOfDominant: eContribution,
    },
    confidence,
    explanation,
  };
}

/**
 * One-line scoring formula per wearable metric, shown under each sub-score so
 * the 0-100 balance scale stays readable (educational transparency).
 */
export function wearableScoreFormula(key: MetricKey): string {
  switch (key) {
    case "sleep_duration":
      return "7-9 h → 100 · −30 per hour outside";
    case "resting_heart_rate":
      return "≤70 bpm → 100 · −2.5 per bpm above";
    case "hrv_rmssd":
      return "age average → 100 · 0 at half of it";
    case "steps":
      return "10k → 100 · 2k → 0, linear";
    default:
      return "display-only, not scored";
  }
}

/**
 * Piecewise normalisation of one wearable metric to a 0-100 "balance" score
 * (100 = comfortably within the documented reference band). Every mapping is
 * a documented design proposal anchored to the reference ranges in
 * reference-values.ts. SpO2 is deliberately EXCLUDED from scoring (report
 * Ch. 8.5, overestimation bias) — it is display-only.
 */
export function normalizeWearableScore(key: MetricKey, value: number, age: number | null | undefined): number {
  let score: number;
  switch (key) {
    case "sleep_duration": {
      // 7-9 h -> 100; falls off by 30 points per hour outside the band, floor 5.
      const dev = value < 7 ? 7 - value : value > 9 ? value - 9 : 0;
      score = Math.max(5, 100 - dev * 30);
      break;
    }
    case "resting_heart_rate": {
      // <=70 -> 100; -2.5 points per bpm above 70, floor 0 (110 bpm -> 0).
      score = Math.max(0, Math.min(100, 100 - Math.max(0, value - 70) * 2.5));
      break;
    }
    case "hrv_rmssd": {
      // Relative to age-band reference average: 100 at/above reference,
      // linearly to 0 at half the reference.
      const ref = hrvReferenceAverage(age);
      score = Math.max(0, Math.min(100, ((value / ref - 0.5) / 0.5) * 100));
      break;
    }
    case "steps": {
      // Linear 0 at 2,000 steps to 100 at 10,000 steps.
      score = Math.max(0, Math.min(100, ((value - 2000) / 8000) * 100));
      break;
    }
    default:
      score = 100;
  }
  return round2(score);
}

/**
 * Environmental aggravation of one dosha using classical guna logic
 * (CT label). v2 design-proposal slopes recalibrated so that typical weather
 * registers (v1 thresholds — cold <18 °C, dry <35 % RH — scored 0 for most
 * real conditions); capped at 100.
 *   Vata: cool air (below 24 °C) + dry air (below 50 % RH) aggravate.
 *   Pitta: heat (above 26 °C) + humid heat aggravate.
 *   Kapha: cold (below 18 °C) + damp air (above 72 % RH) aggravate.
 */
export function environmentalAggravation(
  dosha: Dosha,
  temperatureC: number | null,
  humidity: number | null
): number {
  let agg = 0;
  const temp = temperatureC ?? 22;
  const hum = humidity ?? 50;
  switch (dosha) {
    case "vata":
      agg = Math.max(0, 24 - temp) * 2.5 + Math.max(0, 50 - hum) * 0.8;
      break;
    case "pitta":
      agg = Math.max(0, temp - 26) * 4 + Math.max(0, hum - 70) * 0.5;
      break;
    case "kapha":
      agg = Math.max(0, 18 - temp) * 2 + Math.max(0, hum - 72) * 1.2;
      break;
  }
  return Math.min(100, round2(agg));
}
