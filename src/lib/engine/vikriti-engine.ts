/**
 * Vikriti scoring engine — EXPERIMENTAL.
 *
 * The supplied 34-item questionnaire documents no numerical scoring formula
 * (its only documented response indicator is "Yes Present"). Per the project
 * brief, when the source lacks a formula the platform must implement a
 * separately labelled experimental scoring method. The method:
 *
 *   1. Each "Yes" (present) answer adds 1 point to that item's dosha bucket:
 *      Vata = items 22-34 (max 13), Pitta = items 12-21 (max 10),
 *      Kapha = items 1-11 (max 11).
 *   2. Percentage = (points / dosha maximum) x 100.
 *   3. Dominant current imbalance = the highest percentage. Ties are reported
 *      as a tie between the tied doshas (no arbitrary tie-breaking).
 *
 * Documented assumptions:
 *   - Every "Yes" contributes equally within a dosha (equal severity weighting;
 *     the source does not rank item severity).
 *   - Normalisation is per-dosha against each bucket's item count, so the three
 *     sections are comparable despite unequal lengths.
 *   - Range: 0-100% per dosha.
 *   - Missing answers: the API requires all 34 items answered before scoring;
 *     unanswered submissions are rejected rather than imputed.
 *   - The source maps each numbered item to its dosha section explicitly
 *     (Kapha 1-11, Pitta 12-21, Vata 22-34); no additional mapping was invented.
 *
 * This score is an experimental self-assessment aid with NO clinical
 * validation and NO scientific cutoffs. It is not a diagnostic.
 */

import { VIKRITI_INSTRUMENT, VIKRITI_ITEMS, type Dosha } from "@/lib/data/vikriti-questions";
import { round2 } from "./prakriti-engine";

export type VikritiAnswers = Record<string, "yes" | "no">;

export interface VikritiScore {
  vataCount: number;
  pittaCount: number;
  kaphaCount: number;
  vataPct: number;
  pittaPct: number;
  kaphaPct: number;
  dominant: string; // "vata" | "pitta" | "kapha" | "vata_pitta" (tie) etc.
  dominantLabel: string;
  tie: boolean;
}

export function scoreVikriti(answers: VikritiAnswers): VikritiScore {
  const counts: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 };
  for (const item of VIKRITI_ITEMS) {
    if (answers[item.id] === "yes") counts[item.dosha] += 1;
  }

  const max = VIKRITI_INSTRUMENT.experimentalMax;
  const pct = {
    vata: round2((counts.vata / max.vata) * 100),
    pitta: round2((counts.pitta / max.pitta) * 100),
    kapha: round2((counts.kapha / max.kapha) * 100),
  };

  const order = (["vata", "pitta", "kapha"] as Dosha[]).sort((a, b) => pct[b] - pct[a]);
  const [primary, secondary] = order;
  const tie = pct[primary] === pct[secondary] && pct[primary] > 0;

  let dominant: string;
  let dominantLabel: string;
  if (tie) {
    const pair = [primary, secondary].sort(fixedOrder).join("_");
    dominant = pair;
    dominantLabel = `Tied: ${cap(primary)} & ${cap(secondary)}`;
  } else {
    dominant = primary;
    dominantLabel = `${cap(primary)}-predominant imbalance`;
  }

  return {
    vataCount: counts.vata,
    pittaCount: counts.pitta,
    kaphaCount: counts.kapha,
    vataPct: pct.vata,
    pittaPct: pct.pitta,
    kaphaPct: pct.kapha,
    dominant,
    dominantLabel,
    tie,
  };
}

function fixedOrder(a: Dosha, b: Dosha): number {
  const order: Dosha[] = ["vata", "pitta", "kapha"];
  return order.indexOf(a) - order.indexOf(b);
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function vikritiDominantDosha(dominant: string): Dosha | null {
  const first = dominant.split("_")[0];
  if (first === "vata" || first === "pitta" || first === "kapha") return first;
  return null;
}
