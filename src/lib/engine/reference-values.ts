/**
 * Reference values for imputation and normalisation.
 *
 * Every value documents: raw input, unit, source, normalisation, score range,
 * interpretation, contribution, missing-data handling and evidence status —
 * as required by the project brief (section 11). Reference averages are
 * configurable here in one place and are always flagged "estimated" when
 * used, never presented as smartwatch measurements.
 */

export type MetricKey =
  | "heart_rate"
  | "resting_heart_rate"
  | "hrv_rmssd"
  | "sleep_duration"
  | "sleep_quality"
  | "steps"
  | "active_minutes"
  | "active_calories"
  | "spo2"
  | "stress_level"
  | "mood";

export interface MetricMeta {
  key: MetricKey;
  label: string;
  unit: string;
  /** Reference average used ONLY when no real reading exists (imputation). */
  referenceAverage: number | null;
  referenceSource: string;
  /** Normal population range used for the educational gauge. */
  normalRange: [number, number] | null;
  normalRangeSource: string;
  evidenceStatus: string;
  /** One-line helper shown under manual-entry inputs: what it is + role. */
  purpose: string;
}

export const METRICS: Record<MetricKey, MetricMeta> = {
  heart_rate: {
    key: "heart_rate",
    label: "Heart rate",
    unit: "bpm",
    referenceAverage: 70,
    referenceSource: "General adult resting population average; clinical normal range 60-100 bpm (AHA).",
    normalRange: [60, 100],
    normalRangeSource: "American Heart Association, adult resting heart rate normal range.",
    evidenceStatus: "Wearable step-count and heart-rate averages show acceptable accuracy (Fuller et al. 2020 meta-analysis, [19]); context only, never a dosha measure.",
    purpose: "Beats per minute — general fitness context.",
  },
  resting_heart_rate: {
    key: "resting_heart_rate",
    label: "Resting heart rate",
    unit: "bpm",
    referenceAverage: 70,
    referenceSource: "General adult resting population average (clinical normal 60-100 bpm; AHA).",
    normalRange: [60, 80],
    normalRangeSource: "Common adult resting range used in wearable wellness research (report Ch. 8).",
    evidenceStatus: "Research-supported context indicator (report Ch. 8.1); not a dosha measure.",
    purpose: "Beats per minute at rest — lower usually means better recovery.",
  },
  hrv_rmssd: {
    key: "hrv_rmssd",
    label: "HRV (RMSSD)",
    unit: "ms",
    referenceAverage: null, // age-dependent; see ageBandReference()
    referenceSource: "Age-band population averages (Shaffer & Ginsberg 2017 HRV primer [12]; Umetani et al. 1998 age norms).",
    normalRange: null,
    normalRangeSource: "Age-dependent; see ageBandReference().",
    evidenceStatus: "Presented as a stress-recovery index, not a dosha measure (Shaffer & Ginsberg 2017, [12]).",
    purpose: "Heart-rate variability — higher suggests better recovery; drops with stress.",
  },
  sleep_duration: {
    key: "sleep_duration",
    label: "Sleep duration",
    unit: "h",
    referenceAverage: 7.5,
    referenceSource: "Midpoint of the 7-9 h recommendation for adults (AASM / Sleep Foundation consensus).",
    normalRange: [7, 9],
    normalRangeSource: "AASM & Sleep Foundation recommended sleep range for adults 18-64.",
    evidenceStatus: "Consumer trackers estimate sleep duration well (sleep sensitivity 0.93-0.96, report Ch. 8.1 [14]); stages are far less reliable.",
    purpose: "Hours slept — recovery indicator.",
  },
  sleep_quality: {
    key: "sleep_quality",
    label: "Sleep quality",
    unit: "1-5",
    referenceAverage: null,
    referenceSource: "Self-reported scale (1 = poor, 5 = excellent). Not available from Health Connect.",
    normalRange: [1, 5],
    normalRangeSource: "Platform design proposal — subjective scale.",
    evidenceStatus: "Subjective self-report; manual entry only (optional).",
    purpose: "How restful your sleep felt — manual, optional.",
  },
  stress_level: {
    key: "stress_level",
    label: "Stress level",
    unit: "1-5",
    referenceAverage: null,
    referenceSource: "Self-reported scale (1 = calm, 5 = very stressed). Health Connect has no stress record type.",
    normalRange: [1, 5],
    normalRangeSource: "Platform design proposal — subjective scale.",
    evidenceStatus: "Subjective self-report; manual entry only (optional). No wearable stress metric exists.",
    purpose: "How stressed you feel — manual, optional.",
  },
  mood: {
    key: "mood",
    label: "Mood",
    unit: "1-5",
    referenceAverage: null,
    referenceSource: "Self-reported scale (1 = low, 5 = excellent).",
    normalRange: [1, 5],
    normalRangeSource: "Platform design proposal — subjective scale.",
    evidenceStatus: "Subjective self-report; manual entry only (optional); display only — not scored.",
    purpose: "How you feel overall — manual, optional.",
  },
  active_calories: {
    key: "active_calories",
    label: "Active calories",
    unit: "kcal",
    referenceAverage: 300,
    referenceSource: "Common smartwatch active-energy goal band (250-500 kcal/day); platform design proposal.",
    normalRange: [250, 500],
    normalRangeSource: "Typical activity-goal framing; highly individual.",
    evidenceStatus: "Energy expenditure is the least accurate wearable estimate (Fuller et al. 2020, [19]); used as a rough activity dose.",
    purpose: "Active energy burned — activity dose.",
  },
  steps: {
    key: "steps",
    label: "Steps",
    unit: "steps",
    referenceAverage: 5000,
    referenceSource: "Approximate free-living adult population average (~4,800-5,000 steps/day, published accelerometer studies).",
    normalRange: [7000, 10000],
    normalRangeSource: "Common public-health daily target of 7,000-10,000 steps (platform design proposal).",
    evidenceStatus: "Steps show acceptable average wearable accuracy (Fuller et al. 2020 [19]).",
    purpose: "Daily step count — activity level.",
  },
  active_minutes: {
    key: "active_minutes",
    label: "Active minutes",
    unit: "min",
    referenceAverage: 30,
    referenceSource: "General adult physical-activity guidance of ~30 min/day moderate activity (WHO framing).",
    normalRange: [30, 60],
    normalRangeSource: "WHO adult guidance of 150+ moderate minutes/week (daily-equivalent framing).",
    evidenceStatus: "Activity summary from steps/heart rate; vendor estimates vary.",
    purpose: "Minutes of moderate activity — exercise load.",
  },
  spo2: {
    key: "spo2",
    label: "SpO2",
    unit: "%",
    referenceAverage: 97,
    referenceSource: "General adult peripheral oxygen saturation average (95-100% normal band).",
    normalRange: [95, 100],
    normalRangeSource: "Standard pulse-oximetry normal band.",
    evidenceStatus: "Consumer SpO2 overestimates reference values (report Ch. 8, [17]); trend display only, excluded from scoring.",
    purpose: "Blood oxygen — display only, not scored.",
  },
};

/**
 * Approximate population RMSSD averages by age band. Values are rounded,
 * conservative mid-points drawn from published normative studies
 * (Umetani et al. 1998; Shaffer & Ginsberg 2017). They are imputation
 * defaults and comparison anchors, NOT clinical thresholds.
 */
export function ageBandReference(age: number | null | undefined): number {
  if (age == null) return 42;
  if (age <= 25) return 55;
  if (age <= 35) return 45;
  if (age <= 45) return 38;
  if (age <= 55) return 32;
  if (age <= 65) return 27;
  return 22;
}

export function hrvReferenceAverage(age: number | null | undefined): number {
  return ageBandReference(age);
}

/**
 * Metrics scored by the health-data (30%) component of the combined vikriti
 * model, with their FIXED weights (sum = 100). Weights are a documented
 * design proposal — they never change per user or per run.
 */
export const COMBINED_WEARABLE_METRICS: MetricKey[] = [
  "sleep_duration",
  "heart_rate",
  "spo2",
  "active_calories",
  "steps",
  "stress_level",
  "sleep_quality",
];

/** The seven parameters scored inside the health-data (30%) block. */
export type HealthScoreKey =
  | "sleep_duration"
  | "heart_rate"
  | "spo2"
  | "active_calories"
  | "steps"
  | "stress_level"
  | "sleep_quality";

/** Fixed weight of each health-data parameter inside the 30% block (sum 100). */
export const HEALTH_WEIGHTS: Record<HealthScoreKey, number> = {
  sleep_duration: 20,
  heart_rate: 15,
  spo2: 10,
  active_calories: 15,
  steps: 15,
  stress_level: 15,
  sleep_quality: 10,
};

/** Fixed weights of the environment (20%) block (sum 100). */
export const ENV_WEIGHTS = { season: 40, temperature: 30, humidity: 30 } as const;
