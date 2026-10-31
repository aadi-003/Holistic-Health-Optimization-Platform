/**
 * Extended metric catalog for the Android companion (Health Connect) sync.
 *
 * The core seven metrics are the platform catalogue in
 * `engine/reference-values.ts` (shared with manual entry and the combined
 * vikriti model — do not change them here). The companion adds Health-Connect
 * data types the platform previously had no keys for: active calories,
 * distance and sleep stages. These are display/context metrics only — they are
 * NOT added to COMBINED_WEARABLE_METRICS, so the combined model is unchanged.
 */

import { METRICS, type MetricKey, type MetricMeta } from "./engine/reference-values";

export type CompanionMetricKey =
  | MetricKey
  | "active_calories"
  | "distance"
  | "sleep_stage_light"
  | "sleep_stage_deep"
  | "sleep_stage_rem"
  | "sleep_stage_awake";

/** Metric metadata whose key may be any companion metric. */
type CompanionMetricMeta = Omit<MetricMeta, "key"> & { key: CompanionMetricKey };

const COMPANION_ONLY: Record<Exclude<CompanionMetricKey, MetricKey>, CompanionMetricMeta> = {
  active_calories: {
    key: "active_calories",
    label: "Active calories",
    unit: "kcal",
    referenceAverage: null,
    referenceSource: "Vendor estimate; no platform reference average is used.",
    normalRange: null,
    normalRangeSource: "Highly individual (body size, activity) — trend display only.",
    evidenceStatus: "Energy expenditure is the least accurate wearable estimate (Fuller et al. 2020, [19]); display only.",
    purpose: "Active energy burned — display only, not scored.",
  },
  distance: {
    key: "distance",
    label: "Distance",
    unit: "km",
    referenceAverage: null,
    referenceSource: "No platform reference average; activity-context metric.",
    normalRange: null,
    normalRangeSource: "Individual — trend display only.",
    evidenceStatus: "GPS/step-derived distance estimates vary by vendor; display only.",
    purpose: "Distance travelled — activity context, display only.",
  },
  sleep_stage_light: {
    key: "sleep_stage_light",
    label: "Sleep — light",
    unit: "min",
    referenceAverage: null,
    referenceSource: "No platform reference; stage split varies by tracker.",
    normalRange: null,
    normalRangeSource: "No validated consumer cut-offs.",
    evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
    purpose: "Minutes in light sleep — display only.",
  },
  sleep_stage_deep: {
    key: "sleep_stage_deep",
    label: "Sleep — deep",
    unit: "min",
    referenceAverage: null,
    referenceSource: "No platform reference; stage split varies by tracker.",
    normalRange: null,
    normalRangeSource: "No validated consumer cut-offs.",
    evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
    purpose: "Minutes in deep sleep — display only.",
  },
  sleep_stage_rem: {
    key: "sleep_stage_rem",
    label: "Sleep — REM",
    unit: "min",
    referenceAverage: null,
    referenceSource: "No platform reference; stage split varies by tracker.",
    normalRange: null,
    normalRangeSource: "No validated consumer cut-offs.",
    evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
    purpose: "Minutes in REM sleep — display only.",
  },
  sleep_stage_awake: {
    key: "sleep_stage_awake",
    label: "Sleep — awake",
    unit: "min",
    referenceAverage: null,
    referenceSource: "No platform reference; stage split varies by tracker.",
    normalRange: null,
    normalRangeSource: "No validated consumer cut-offs.",
    evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
    purpose: "Minutes awake during the sleep period — display only.",
  },
};

export const COMPANION_METRICS: Record<CompanionMetricKey, CompanionMetricMeta> = {
  ...METRICS,
  ...COMPANION_ONLY,
} as Record<CompanionMetricKey, CompanionMetricMeta>;

export const COMPANION_METRIC_KEYS = Object.keys(COMPANION_METRICS) as CompanionMetricKey[];

/** Per-metric sanity bounds applied to companion sync payloads. */
export const SYNC_LIMITS: Partial<Record<CompanionMetricKey, [number, number]>> = {
  heart_rate: [30, 230],
  resting_heart_rate: [30, 130],
  hrv_rmssd: [2, 300],
  sleep_duration: [0, 24],
  steps: [0, 200000],
  active_minutes: [0, 1440],
  spo2: [50, 100],
  active_calories: [0, 10000],
  distance: [0, 300],
  sleep_stage_light: [0, 1440],
  sleep_stage_deep: [0, 1440],
  sleep_stage_rem: [0, 1440],
  sleep_stage_awake: [0, 1440],
};

/**
 * Daily aggregation used by GET /api/health/history. Additive metrics are
 * summed per day (steps, minutes, calories, distance, stage minutes);
 * spot measurements are averaged per day (heart rate, SpO2, HRV, resting HR).
 */
export const METRIC_DAILY_AGG: Record<CompanionMetricKey, "sum" | "avg"> = {
  heart_rate: "avg",
  resting_heart_rate: "avg",
  hrv_rmssd: "avg",
  spo2: "avg",
  sleep_duration: "sum",
  steps: "sum",
  active_minutes: "sum",
  active_calories: "sum",
  distance: "sum",
  sleep_stage_light: "sum",
  sleep_stage_deep: "sum",
  sleep_stage_rem: "sum",
  sleep_stage_awake: "sum",
};

/**
 * Health Connect `dataOrigin` package names → friendly app names. Records are
 * written by the phone app that owns them (e.g. the Redmi Watch 5 Lite syncs
 * through Xiaomi Mi Fitness), so the package tells the user where readings
 * actually came from. Unknown packages fall back to the raw package name.
 */
export const ORIGIN_NAMES: Record<string, string> = {
  "com.xiaomi.wearable": "Mi Fitness (Xiaomi)",
  "com.xiaomi.hm.health": "Zepp Life (Xiaomi)",
  "com.google.android.apps.fitness": "Google Fit",
  "com.google.android.apps.healthdata": "Health Connect",
  "com.samsung.android.health": "Samsung Health",
  "com.huawei.health": "Huawei Health",
  "com.fitbit.FitbitMobile": "Fitbit",
  "com.heytap.health": "OHealth (OnePlus/Oppo)",
  "com.oplus.health": "OHealth (OnePlus/Oppo)",
  "com.amazfithealth": "Zepp (Amazfit)",
  "com.huami.watch.hmwatchmanager": "Zepp (Amazfit)",
};

export function originLabel(pkg: string): string {
  return ORIGIN_NAMES[pkg] ?? pkg;
}
