/**
 * Prakriti scoring engine.
 *
 * Implements EXACTLY the documented scoring model of the supplied
 * questionnaire / Tripathi et al. (2011) as catalogued by Gupta et al. (2025):
 *
 *   - 120 points per guna, divided equally among that guna's observable
 *     features (weights are pre-computed and printed on each item).
 *   - Maximum scores: Vata 960, Pitta 600, Kapha 1440.
 *   - Dosha percentage = (score obtained / maximum for that dosha) x 100
 *     ("absolute basis" scoring, per Bhalerao & Patwardhan 2016 terminology).
 *
 * Classification reuses the dual-type (dvandvaja) thresholds published in
 * Tripathi et al. (2011), Section 3.3.3 — these are study-design thresholds,
 * not clinically validated cutoffs, and are labelled as such in the UI:
 *   - Dual type when: secondary >= 50% of primary
 *                    AND tertiary <= 75% of secondary (i.e. >= 25% lower).
 *   - When secondary >= 50% of primary but tertiary > 75% of secondary, all
 *     three doshas are relatively close -> reported as "sama" (balanced /
 *     tridoshaj presentation). This branch mirrors the study's observation
 *     that near-equal thirds exist and treats it explicitly instead of
 *     forcing a dual label.
 *   - Otherwise: single-dominant (eka-doshaj).
 */

import { PRAKRITI_INSTRUMENT, PRAKRITI_ITEMS, type Dosha } from "@/lib/data/prakriti-questions";

export type PrakritiAnswers = Record<string, "yes" | "no">;

export interface PrakritiScore {
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  vataPct: number;
  pittaPct: number;
  kaphaPct: number;
  classification: string; // "vata" | "pitta" | "kapha" | "vata_pitta" | "vata_kapha" | "pitta_kapha" | "sama" | "undetermined"
  label: string; // human-readable, order-collapsed
  classificationNote: string;
}

const DOSHA_LABEL: Record<Dosha, string> = {
  vata: "Vata",
  pitta: "Pitta",
  kapha: "Kapha",
};

export function scorePrakriti(answers: PrakritiAnswers): PrakritiScore {
  const totals: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 };

  for (const item of PRAKRITI_ITEMS) {
    const answer = answers[item.id];
    if (answer === "yes" || answer === "no") {
      if (answer === item.scoringAnswer) {
        totals[item.dosha] += item.weight;
      }
    }
    // Missing answers simply earn no points (documented missing-answer policy:
    // "obtained score" counts only the items the respondent actually answered
    // affirmatively in the scoring direction; unanswered items are reported in
    // the audit payload by the API layer).
  }

  const max = PRAKRITI_INSTRUMENT.scoringModel.doshaMax;
  const pct = {
    vata: round2((totals.vata / max.vata) * 100),
    pitta: round2((totals.pitta / max.pitta) * 100),
    kapha: round2((totals.kapha / max.kapha) * 100),
  };

  const order: Dosha[] = (["vata", "pitta", "kapha"] as Dosha[]).sort((a, b) => pct[b] - pct[a]);
  const [primary, secondary, tertiary] = order;

  const { dualIfSecondaryGePctOfPrimary, dualIfTertiaryLePctOfSecondary } =
    PRAKRITI_INSTRUMENT.classificationThresholds;

  let classification: string;
  let note: string;

  if (pct[primary] === 0) {
    classification = "undetermined";
    note =
      "No affirmative answers were given, so no constitution could be determined. Please review your answers.";
  } else if (
    pct[secondary] >= dualIfSecondaryGePctOfPrimary / 100 * pct[primary] &&
    pct[tertiary] <= (dualIfTertiaryLePctOfSecondary / 100) * pct[secondary]
  ) {
    const pair = [primary, secondary].sort(fixedDoshaOrder).join("_");
    classification = pair;
    note = `Dual constitution (dvandvaja): ${DOSHA_LABEL[secondary]} scored at least 50% of ${DOSHA_LABEL[primary]} and ${DOSHA_LABEL[tertiary]} was at least 25% lower than ${DOSHA_LABEL[secondary]} (thresholds published in Tripathi et al. 2011; study-design values, not validated clinical cutoffs).`;
  } else if (pct[secondary] >= (dualIfSecondaryGePctOfPrimary / 100) * pct[primary]) {
    classification = "sama";
    note =
      "Balanced presentation (sama / tridoshaj-leaning): all three doshas score relatively close together, so no single or dual constitution meets the published separation thresholds. Treat the percentages as an educational spread, not a fixed type.";
  } else {
    classification = primary;
    note = `Single-dominant constitution (eka-doshaj): ${DOSHA_LABEL[secondary]} scored below 50% of ${DOSHA_LABEL[primary]} (threshold from Tripathi et al. 2011; a study-design value, not a validated clinical cutoff).`;
  }

  const label = buildLabel(classification);

  return {
    vataScore: totals.vata,
    pittaScore: totals.pitta,
    kaphaScore: totals.kapha,
    vataPct: pct.vata,
    pittaPct: pct.pitta,
    kaphaPct: pct.kapha,
    classification,
    label,
    classificationNote: note,
  };
}

function buildLabel(classification: string): string {
  switch (classification) {
    case "sama":
      return "Balanced (Tridoshaj-leaning)";
    case "undetermined":
      return "Undetermined";
    case "vata_pitta":
      return "Vata-Pitta";
    case "vata_kapha":
      return "Vata-Kapha";
    case "pitta_kapha":
      return "Pitta-Kapha";
    case "vata":
      return "Vata-dominant";
    case "pitta":
      return "Pitta-dominant";
    case "kapha":
      return "Kapha-dominant";
    default:
      return classification;
  }
}

function fixedDoshaOrder(a: Dosha, b: Dosha): number {
  const order: Dosha[] = ["vata", "pitta", "kapha"];
  return order.indexOf(a) - order.indexOf(b);
}

/** Doshas that make up the user's constitution (dominant, or both for dual). */
export function constitutionDoshas(classification: string): Dosha[] {
  if (["vata", "pitta", "kapha"].includes(classification)) {
    return [classification as Dosha];
  }
  if (["vata_pitta", "vata_kapha", "pitta_kapha"].includes(classification)) {
    return classification.split("_") as Dosha[];
  }
  if (classification === "sama") return ["vata", "pitta", "kapha"];
  return [];
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
