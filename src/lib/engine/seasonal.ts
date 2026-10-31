/**
 * Seasonal module (ritucharya support).
 *
 * Computes the classical six-ritu season from a date. Mapping is a monthly
 * approximation of the classical scheme (report Ch. 9.2 per Dhiman et al.
 * 2026 [6] abstract) — a documented design proposal, not a research-derived
 * calendar. Southern-hemisphere users are shifted by six months (the report
 * notes hemisphere-inverted seasonality in modern transcriptomic evidence).
 *
 * Dosha tendency per season (classical scheme, educational display only —
 * the report explicitly warns not to compute "dosha load" from data):
 *   Vasanta  -> Kapha aggravation
 *   Greeshma -> Vata accumulation, Kapha pacifies
 *   Varsha   -> Vata aggravation, Pitta accumulation
 *   Sharad   -> Pitta aggravation, Vata pacifies
 *   Hemanta  -> Pitta pacifies, Kapha accumulation (strong agni)
 *   Shishira -> Kapha accumulation, Vata accumulation tendency
 */

export type Season = "vasanta" | "greeshma" | "varsha" | "sharad" | "hemanta" | "shishira";
export type Dosha = "vata" | "pitta" | "kapha";

export const SEASON_LABEL: Record<Season, string> = {
  vasanta: "Vasanta (spring)",
  greeshma: "Greeshma (summer)",
  varsha: "Varsha (monsoon)",
  sharad: "Sharad (autumn)",
  hemanta: "Hemanta (early winter)",
  shishira: "Shishira (late winter)",
};

const NORTHERN: Season[] = [
  // index = month-1 (approximate monthly assignment)
  "hemanta", // Jan
  "shishira", // Feb
  "shishira", // Mar
  "vasanta", // Apr
  "vasanta", // May
  "greeshma", // Jun
  "greeshma", // Jul
  "varsha", // Aug
  "varsha", // Sep
  "sharad", // Oct
  "sharad", // Nov
  "hemanta", // Dec
];

export function computeSeason(date: Date, latitude: number | null | undefined): Season {
  const month = date.getUTCMonth();
  const northern = NORTHERN[month];
  if (latitude != null && latitude < 0) {
    // Southern hemisphere: seasons inverted by six months.
    return NORTHERN[(month + 6) % 12];
  }
  return northern;
}

/** Doshas classically described as aggravated/accumulating in this season. */
export function seasonDoshaTendency(season: Season): Dosha[] {
  switch (season) {
    case "vasanta":
      return ["kapha"];
    case "greeshma":
      return ["vata"];
    case "varsha":
      return ["vata", "pitta"];
    case "sharad":
      return ["pitta"];
    case "hemanta":
      return ["kapha"];
    case "shishira":
      return ["kapha", "vata"];
  }
}

/**
 * Ritu-sandhi (seasonal junction) detection — the report requires the engine
 * to flag transition windows (window length is a design proposal; we use the
 * final 7 days of a season by month boundaries, i.e. the last 7 days of the
 * closing month and, for robustness across the approximation, the first 7
 * days of the opening month).
 */
export function isRituSandhi(date: Date, latitude: number | null | undefined): boolean {
  const day = date.getUTCDate();
  const lastDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  return day <= 7 || day >= lastDayOfMonth - 6;
}
