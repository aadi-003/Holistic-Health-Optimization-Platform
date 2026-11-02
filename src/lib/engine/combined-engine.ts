/**
 * Combined current-state vikriti model (50/30/20, fixed weights v3).
 *
 * User-specified design (replaces the v2 "exclude missing" rule):
 *
 *   Combined Current State Index (0-100, higher = more imbalance signals)
 *     = 0.5 x Questionnaire severity   (dominant vikriti dosha %)
 *     + 0.3 x Health-data strain       (100 - weighted balance, fixed weights)
 *     + 0.2 x Environmental load       (season/temp/humidity, fixed weights)
 *
 * Health-data block — FIXED weights (sum 100), see HEALTH_WEIGHTS:
 *   sleep 20 · heart rate 15 · SpO2 10 · active calories 15 · steps 15 ·
 *   stress 15 · sleep quality 10.
 *   A parameter with no reading is scored as a NORMAL HEALTHY HUMAN
 *   (balance 100 -> 0 strain) instead of being excluded.
 *
 * Environment block — FIXED weights (sum 100), see ENV_WEIGHTS:
 *   season 40 · temperature 30 · humidity 30.
 *   Without a recorded environment snapshot the whole block stays 0
 *   (assumed neutral), as a date-guessed season is not user data.
 *
 * Every weight, score and missing-value assumption is exposed in the
 * `calculation` payload so the UI can show the arithmetic verbatim.
 */

import type { Dosha } from "@/lib/data/prakriti-questions";
import { vikritiDominantDosha, type VikritiScore } from "./vikriti-engine";
import { round2 } from "./prakriti-engine";
import {
  COMBINED_WEARABLE_METRICS,
  HEALTH_WEIGHTS,
  ENV_WEIGHTS,
  METRICS,
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
    balanceScore: number; // 0-100 weighted balance, higher = closer to normal
    subScores: {
      metric: MetricKey;
      label: string;
      weight: number;
      value: number | null;
      assumedNormal: boolean;
      provenance: string;
      score: number;
      formula: string;
    }[];
    assumedCount: number; // how many parameters were assumed "normal human"
    dataCompleteness: number; // 0-1 share of real (non-assumed) inputs
  };
  environment: {
    contribution: number; // 0-100 (weighted at 0.2)
    assumedNormal: boolean; // true when no snapshot exists -> block contributes 0
    seasonTerm: number; // 0-100, weighted 40
    temperatureTerm: number; // 0-100, weighted 30
    humidityTerm: number; // 0-100, weighted 30
    temperatureC: number | null;
    humidity: number | null;
    season: Season;
    seasonLabel: string;
    rituSandhi: boolean;
    tendencyDoshas: Dosha[];
  };
  confidence: number; // 0-100 data completeness / confidence indicator
  calculation: string[]; // step-by-step arithmetic shown verbatim in the UI
  explanation: string[];
}

const MODEL_VERSION = "combined_50_30_20_fixed_weights_v3";

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

  // ---------- Health data (30%, fixed weights) ----------
  // Latest reading per metric inside the 7-day window.
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
    const assumedNormal = !found;
    if (found) realCount += 1;
    // Missing parameter -> assumed normal healthy human -> balance 100.
    const score = assumedNormal ? 100 : normalizeWearableScore(key, found!.value, age);
    subScores.push({
      metric: key,
      label: METRICS[key].label,
      weight: HEALTH_WEIGHTS[key],
      value: found?.value ?? null,
      assumedNormal,
      provenance: found?.provenance ?? "assumed",
      score,
      formula: wearableScoreFormula(key),
    });
  }

  // Weighted balance over the full fixed weight (sum of weights = 100).
  const weightedSum = subScores.reduce((s, x) => s + x.weight * x.score, 0);
  const balanceScore = round2(weightedSum / 100);
  const wContribution = round2(100 - balanceScore);
  const dataCompleteness = round2(realCount / COMBINED_WEARABLE_METRICS.length);

  // ---------- Environment (20%, fixed weights) ----------
  const season = environment?.season ?? computeSeason(asOf, null);
  const tendency = seasonDoshaTendency(season);
  const sandhi = isRituSandhi(asOf, null);

  let seasonTerm = 0;
  let temperatureTerm = 0;
  let humidityTerm = 0;
  if (dominant && environment) {
    seasonTerm = Math.min(100, (tendency.includes(dominant) ? 70 : 0) + (sandhi ? 30 : 0));
    temperatureTerm = temperatureAggravation(dominant, environment.temperatureC);
    humidityTerm = humidityAggravation(dominant, environment.humidity);
  }
  const eContribution = environment
    ? Math.min(
        100,
        round2(
          (ENV_WEIGHTS.season * seasonTerm +
            ENV_WEIGHTS.temperature * temperatureTerm +
            ENV_WEIGHTS.humidity * humidityTerm) /
            100
        )
      )
    : 0;

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

  // ---------- Step-by-step arithmetic (rendered verbatim) ----------
  const assumedCount = subScores.filter((s) => s.assumedNormal).length;
  const healthTerms = subScores
    .map((s) => `${s.weight}×${s.assumedNormal ? 100 : s.score}`)
    .join(" + ");
  const calculation: string[] = [
    `Check-in (50%): ${dominantPct}/100 → 0.5 × ${qContribution} = ${round2(0.5 * qContribution)}`,
    `Health data (30%): balance = (${healthTerms}) ÷ 100 = ${balanceScore} → strain = 100 − ${balanceScore} = ${wContribution} → 0.3 × ${wContribution} = ${round2(0.3 * wContribution)}`,
    `Environment (20%): (${ENV_WEIGHTS.season}×${seasonTerm} + ${ENV_WEIGHTS.temperature}×${temperatureTerm} + ${ENV_WEIGHTS.humidity}×${humidityTerm}) ÷ 100 = ${round2((ENV_WEIGHTS.season * seasonTerm + ENV_WEIGHTS.temperature * temperatureTerm + ENV_WEIGHTS.humidity * humidityTerm) / 100)} → 0.2 × ${eContribution} = ${round2(0.2 * eContribution)}`,
    `Combined = ${round2(0.5 * qContribution)} + ${round2(0.3 * wContribution)} + ${round2(0.2 * eContribution)} = ${combinedScore} / 100`,
  ];

  // ---------- Explanation payload ----------
  const explanation: string[] = [
    `Check-in (50%): dominant imbalance ${qContribution}/100 (${dominant ?? "none"} ${dominantPct}%).`,
    assumedCount === 0
      ? `Health data (30%): all ${COMBINED_WEARABLE_METRICS.length} parameters measured — balance ${balanceScore}/100 → strain ${wContribution}/100.`
      : `Health data (30%): balance ${balanceScore}/100 with ${assumedCount} parameter${assumedCount > 1 ? "s" : ""} assumed at a normal healthy level (no reading in 7 days) → strain ${wContribution}/100.`,
    environment
      ? `Environment (20%): season ${seasonTerm}/100 (fixed weight 40), temperature ${temperatureTerm}/100 (weight 30), humidity ${humidityTerm}/100 (weight 30) → ${eContribution}/100 for your ${dominant ?? "dominant"} dosha.`
      : `Environment (20%): no environment snapshot — assumed neutral, contributes 0.`,
    `Combined = 0.5 × ${qContribution} + 0.3 × ${wContribution} + 0.2 × ${eContribution} = ${combinedScore}/100.`,
  ];

  return {
    modelVersion: MODEL_VERSION,
    combinedScore,
    dominantDosha: dominant,
    questionnaire: { contribution: qContribution, dominantDosha: dominant, dominantPct },
    wearable: {
      contribution: wContribution,
      balanceScore,
      subScores,
      assumedCount,
      dataCompleteness,
    },
    environment: {
      contribution: eContribution,
      assumedNormal: environment == null,
      seasonTerm,
      temperatureTerm,
      humidityTerm,
      temperatureC: environment?.temperatureC ?? null,
      humidity: environment?.humidity ?? null,
      season,
      seasonLabel: SEASON_LABEL[season],
      rituSandhi: sandhi,
      tendencyDoshas: tendency,
    },
    confidence,
    calculation,
    explanation,
  };
}

/**
 * One-line scoring formula per health metric, shown under each sub-score so
 * the 0-100 balance scale stays readable (educational transparency).
 */
export function wearableScoreFormula(key: MetricKey): string {
  switch (key) {
    case "sleep_duration":
      return "7-9 h → 100 · −30 per hour outside";
    case "heart_rate":
      return "55-85 bpm (daily avg) → 100 · −2.5 per bpm outside";
    case "spo2":
      return "≥95% → 100 · −10 per point below";
    case "active_calories":
      return "0 kcal → 0 · ≥300 kcal → 100, linear";
    case "steps":
      return "10k → 100 · 2k → 0, linear";
    case "stress_level":
      return "1 → 100 · 5 → 0, linear (manual 1-5)";
    case "sleep_quality":
      return "5 → 100 · 1 → 0, linear (manual 1-5)";
    default:
      return "display-only, not scored";
  }
}

/**
 * Piecewise normalisation of one health metric to a 0-100 "balance" score
 * (100 = a normal healthy human). Every mapping is a documented design
 * proposal anchored to the reference values in reference-values.ts.
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
    case "heart_rate": {
      // Daily-average band 55-85 bpm -> 100; -2.5 per bpm outside, floor 0.
      const dev = value < 55 ? 55 - value : value > 85 ? value - 85 : 0;
      score = Math.max(0, 100 - dev * 2.5);
      break;
    }
    case "spo2": {
      // >=95% -> 100; -10 per point below, floor 0.
      score = Math.max(0, Math.min(100, 100 - Math.max(0, 95 - value) * 10));
      break;
    }
    case "active_calories": {
      // Linear 0 kcal -> 0 to >=300 kcal -> 100 (design-proposal goal band).
      score = Math.max(0, Math.min(100, (value / 300) * 100));
      break;
    }
    case "steps": {
      // Linear 0 at 2,000 steps to 100 at 10,000 steps.
      score = Math.max(0, Math.min(100, ((value - 2000) / 8000) * 100));
      break;
    }
    case "stress_level": {
      // Manual 1-5 (5 = most stressed): 1 -> 100, 5 -> 0.
      score = Math.max(0, Math.min(100, ((5 - value) / 4) * 100));
      break;
    }
    case "sleep_quality": {
      // Manual 1-5 (5 = best): 5 -> 100, 1 -> 0.
      score = Math.max(0, Math.min(100, ((value - 1) / 4) * 100));
      break;
    }
    case "resting_heart_rate": {
      // Legacy mapping (metric no longer in the combined set).
      score = Math.max(0, Math.min(100, 100 - Math.max(0, value - 70) * 2.5));
      break;
    }
    case "hrv_rmssd": {
      // Legacy mapping (metric no longer in the combined set).
      const ref = hrvReferenceAverage(age);
      score = Math.max(0, Math.min(100, ((value / ref - 0.5) / 0.5) * 100));
      break;
    }
    default:
      score = 100;
  }
  return round2(score);
}

function hrvReferenceAverage(age: number | null | undefined): number {
  if (age == null) return 42;
  if (age <= 25) return 55;
  if (age <= 35) return 45;
  if (age <= 45) return 38;
  if (age <= 55) return 32;
  if (age <= 65) return 27;
  return 22;
}

/**
 * Temperature-only aggravation of one dosha (classical guna logic, normalised
 * to 0-100). Missing temperature is assumed at a neutral 22 °C room value.
 *   Vata: cool air (below 24 °C) aggravates, 0 °C -> 100.
 *   Pitta: heat (above 26 °C) aggravates, 50 °C -> 100.
 *   Kapha: cold (below 18 °C) aggravates, 0 °C -> 100.
 */
export function temperatureAggravation(dosha: Dosha, temperatureC: number | null): number {
  const temp = temperatureC ?? 22;
  let agg = 0;
  switch (dosha) {
    case "vata":
      agg = Math.max(0, 24 - temp) * (100 / 24);
      break;
    case "pitta":
      agg = Math.max(0, temp - 26) * (100 / 24);
      break;
    case "kapha":
      agg = Math.max(0, 18 - temp) * (100 / 18);
      break;
  }
  return Math.min(100, round2(agg));
}

/**
 * Humidity-only aggravation of one dosha (classical guna logic, normalised to
 * 0-100). Missing humidity is assumed at a neutral 50 % room value.
 *   Vata: dry air (below 50 %) aggravates, 0 % -> 100.
 *   Pitta: humid heat (above 70 %) aggravates, 100 % -> 100.
 *   Kapha: damp air (above 72 %) aggravates, 100 % -> 100.
 */
export function humidityAggravation(dosha: Dosha, humidity: number | null): number {
  const hum = humidity ?? 50;
  let agg = 0;
  switch (dosha) {
    case "vata":
      agg = Math.max(0, 50 - hum) * 2;
      break;
    case "pitta":
      agg = Math.max(0, hum - 70) * (100 / 30);
      break;
    case "kapha":
      agg = Math.max(0, hum - 72) * (100 / 28);
      break;
  }
  return Math.min(100, round2(agg));
}

/**
 * Combined weather aggravation (temperature + humidity, equally split) — kept
 * for the dashboard/educational display of raw climate load per dosha.
 */
export function environmentalAggravation(
  dosha: Dosha,
  temperatureC: number | null,
  humidity: number | null
): number {
  return round2(
    temperatureAggravation(dosha, temperatureC) * 0.5 + humidityAggravation(dosha, humidity) * 0.5
  );
}
