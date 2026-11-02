import { describe, it, expect } from "vitest";
import { VIKRITI_ITEMS, VIKRITI_INSTRUMENT } from "@/lib/data/vikriti-questions";
import { scoreVikriti, vikritiDominantDosha, type VikritiAnswers } from "@/lib/engine/vikriti-engine";
import {
  normalizeWearableScore,
  environmentalAggravation,
  temperatureAggravation,
  humidityAggravation,
  computeCombined,
  type ReadingInput,
} from "@/lib/engine/combined-engine";
import { computeSeason, seasonDoshaTendency, isRituSandhi } from "@/lib/engine/seasonal";
import { METRICS, COMBINED_WEARABLE_METRICS, HEALTH_WEIGHTS } from "@/lib/engine/reference-values";

function allYes(): VikritiAnswers {
  const a: VikritiAnswers = {};
  for (const item of VIKRITI_ITEMS) a[item.id] = "yes";
  return a;
}

function allNo(): VikritiAnswers {
  const a: VikritiAnswers = {};
  for (const item of VIKRITI_ITEMS) a[item.id] = "no";
  return a;
}

describe("Vikriti instrument pack", () => {
  it("has exactly 34 items in the documented grouping", () => {
    expect(VIKRITI_ITEMS).toHaveLength(34);
    expect(VIKRITI_ITEMS.filter((i) => i.dosha === "kapha")).toHaveLength(11); // Q1-11
    expect(VIKRITI_ITEMS.filter((i) => i.dosha === "pitta")).toHaveLength(10); // Q12-21
    expect(VIKRITI_ITEMS.filter((i) => i.dosha === "vata")).toHaveLength(13); // Q22-34
    expect(VIKRITI_ITEMS.map((i) => i.serial)).toEqual(Array.from({ length: 34 }, (_, k) => k + 1));
  });

  it("declares matching experimental maxima", () => {
    expect(VIKRITI_INSTRUMENT.experimentalMax).toEqual({ vata: 13, pitta: 10, kapha: 11 });
  });
});

describe("Vikriti experimental scoring", () => {
  it("counts one point per Yes and normalises per bucket", () => {
    const a = allNo();
    for (let s = 22; s <= 34; s++) a[`VK${s}`] = "yes"; // all vata signs present
    const score = scoreVikriti(a);
    expect(score.vataCount).toBe(13);
    expect(score.vataPct).toBe(100);
    expect(score.pittaPct).toBe(0);
    expect(score.kaphaPct).toBe(0);
    expect(score.dominant).toBe("vata");
    expect(vikritiDominantDosha(score.dominant)).toBe("vata");
  });

  it("reports a tie when the top two buckets reach equal percentages", () => {
    const a = allNo();
    for (let s = 1; s <= 11; s++) a[`VK${s}`] = "yes"; // kapha 11/11 = 100%
    for (let s = 22; s <= 34; s++) a[`VK${s}`] = "yes"; // vata 13/13 = 100%
    const score = scoreVikriti(a);
    expect(score.tie).toBe(true);
    expect(score.dominant).toBe("vata_kapha"); // order-collapsed, fixed dosha order
  });

  it("all-yes gives 100% in every bucket", () => {
    const score = scoreVikriti(allYes());
    expect(score.vataPct).toBe(100);
    expect(score.pittaPct).toBe(100);
    expect(score.kaphaPct).toBe(100);
  });
});

describe("Health normalisation (documented design-proposal mappings)", () => {
  it("sleep duration: 100 inside 7-9h, decays 30/h outside", () => {
    expect(normalizeWearableScore("sleep_duration", 8, null)).toBe(100);
    expect(normalizeWearableScore("sleep_duration", 6, null)).toBe(70);
    expect(normalizeWearableScore("sleep_duration", 5, null)).toBe(40);
    expect(normalizeWearableScore("sleep_duration", 4, null)).toBe(10);
    expect(normalizeWearableScore("sleep_duration", 12, null)).toBeLessThanOrEqual(10);
  });

  it("heart rate: 100 inside 55-85 band, -2.5/bpm outside", () => {
    expect(normalizeWearableScore("heart_rate", 70, null)).toBe(100);
    expect(normalizeWearableScore("heart_rate", 90, null)).toBe(87.5);
    expect(normalizeWearableScore("heart_rate", 125, null)).toBe(0);
    expect(normalizeWearableScore("heart_rate", 55, null)).toBe(100);
  });

  it("SpO2: 100 at >=95%, -10 per point below, floor 0", () => {
    expect(normalizeWearableScore("spo2", 97, null)).toBe(100);
    expect(normalizeWearableScore("spo2", 92, null)).toBe(70);
    expect(normalizeWearableScore("spo2", 85, null)).toBe(0);
  });

  it("active calories: linear 0 kcal -> 0, >=300 kcal -> 100", () => {
    expect(normalizeWearableScore("active_calories", 0, null)).toBe(0);
    expect(normalizeWearableScore("active_calories", 150, null)).toBe(50);
    expect(normalizeWearableScore("active_calories", 400, null)).toBe(100);
  });

  it("manual 1-5 scales: stress inverted, sleep quality direct", () => {
    expect(normalizeWearableScore("stress_level", 1, null)).toBe(100);
    expect(normalizeWearableScore("stress_level", 5, null)).toBe(0);
    expect(normalizeWearableScore("stress_level", 3, null)).toBe(50);
    expect(normalizeWearableScore("sleep_quality", 5, null)).toBe(100);
    expect(normalizeWearableScore("sleep_quality", 1, null)).toBe(0);
  });

  it("legacy mappings still work (resting HR, HRV) though no longer scored", () => {
    expect(normalizeWearableScore("resting_heart_rate", 90, null)).toBe(50);
    expect(normalizeWearableScore("hrv_rmssd", 55, 25)).toBe(100);
  });

  it("steps: linear 0 at 2k -> 100 at 10k", () => {
    expect(normalizeWearableScore("steps", 2000, null)).toBe(0);
    expect(normalizeWearableScore("steps", 6000, null)).toBe(50);
    expect(normalizeWearableScore("steps", 10000, null)).toBe(100);
  });
});

describe("Environmental aggravation (classical guna logic, v3 normalised split)", () => {
  it("temperature term: vata cool, pitta hot, kapha cold", () => {
    expect(temperatureAggravation("vata", 8)).toBe(66.67); // 16 x 100/24
    expect(temperatureAggravation("vata", 30)).toBe(0);
    expect(temperatureAggravation("pitta", 32)).toBe(25); // 6 x 100/24
    expect(temperatureAggravation("kapha", 10)).toBe(44.44); // 8 x 100/18
  });

  it("humidity term: vata dry, pitta humid-heat, kapha damp", () => {
    expect(humidityAggravation("vata", 20)).toBe(60); // 30 x 2
    expect(humidityAggravation("pitta", 100)).toBe(100); // 30 x 100/30
    expect(humidityAggravation("kapha", 95)).toBe(82.14); // 23 x 100/28
    expect(humidityAggravation("kapha", 50)).toBe(0);
  });

  it("combined aggravation is the equal-weight average of both terms", () => {
    expect(environmentalAggravation("vata", 30, 70)).toBe(0);
    expect(environmentalAggravation("vata", 19, 89)).toBe(10.42); // (20.83 + 0) / 2
    expect(environmentalAggravation("pitta", 10, 20)).toBe(0);
  });
});

describe("Seasonal module", () => {
  it("computes northern seasons by month (approximate documented mapping)", () => {
    expect(computeSeason(new Date("2026-04-15"), 20)).toBe("vasanta");
    expect(computeSeason(new Date("2026-08-15"), 20)).toBe("varsha");
    expect(computeSeason(new Date("2026-10-15"), 20)).toBe("sharad");
    expect(computeSeason(new Date("2026-12-15"), 20)).toBe("hemanta");
  });

  it("inverts seasons for the southern hemisphere", () => {
    expect(computeSeason(new Date("2026-04-15"), -20)).toBe("sharad");
  });

  it("maps classical dosha tendencies", () => {
    expect(seasonDoshaTendency("vasanta")).toEqual(["kapha"]);
    expect(seasonDoshaTendency("sharad")).toEqual(["pitta"]);
    expect(seasonDoshaTendency("varsha")).toEqual(["vata", "pitta"]);
  });

  it("flags ritu-sandhi junction windows", () => {
    expect(isRituSandhi(new Date("2026-04-03"), 20)).toBe(true);
    expect(isRituSandhi(new Date("2026-04-15"), 20)).toBe(false);
  });
});

describe("Combined 50/30/20 model", () => {
  const vikritiVata = scoreVikriti(
    (() => {
      const a: VikritiAnswers = {};
      for (const item of VIKRITI_ITEMS) a[item.id] = "no";
      for (let s = 22; s <= 34; s++) a[`VK${s}`] = "yes";
      return a;
    })()
  );

  it("weight identity: combined = 0.5*Q + 0.3*W + 0.2*E", () => {
    const result = computeCombined(vikritiVata, [], null, 28);
    const expected =
      0.5 * result.questionnaire.contribution + 0.3 * result.wearable.contribution + 0.2 * result.environment.contribution;
    expect(result.combinedScore).toBeCloseTo(Math.round(expected * 100) / 100, 2);
  });

  it("missing parameters are assumed at a normal healthy level (score 100, no strain)", () => {
    const result = computeCombined(vikritiVata, [], null, 28);
    expect(result.wearable.subScores).toHaveLength(7);
    expect(result.wearable.subScores.every((s) => s.assumedNormal && s.score === 100)).toBe(true);
    expect(result.wearable.balanceScore).toBe(100);
    expect(result.wearable.contribution).toBe(0);
    expect(result.wearable.assumedCount).toBe(7);
    expect(result.wearable.dataCompleteness).toBe(0);
    expect(result.confidence).toBe(50); // 0.5*1 + 0.3*0 + 0.2*0
  });

  it("health weights are fixed and sum to 100", () => {
    const total = Object.values(HEALTH_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(total).toBe(100);
    expect(COMBINED_WEARABLE_METRICS).toHaveLength(7);
    expect(COMBINED_WEARABLE_METRICS).toContain("spo2");
  });

  it("scores every fixed-weight parameter when readings exist", () => {
    const now = new Date();
    const readings: ReadingInput[] = [
      { metric: "sleep_duration", value: 8, provenance: "manual", recordedAt: now.toISOString() },
      { metric: "heart_rate", value: 70, provenance: "measured", recordedAt: now.toISOString() },
      { metric: "spo2", value: 97, provenance: "measured", recordedAt: now.toISOString() },
      { metric: "active_calories", value: 300, provenance: "measured", recordedAt: now.toISOString() },
      { metric: "steps", value: 10000, provenance: "measured", recordedAt: now.toISOString() },
      { metric: "stress_level", value: 1, provenance: "manual", recordedAt: now.toISOString() },
      { metric: "sleep_quality", value: 5, provenance: "manual", recordedAt: now.toISOString() },
    ];
    const result = computeCombined(vikritiVata, readings, null, 28);
    expect(result.wearable.assumedCount).toBe(0);
    expect(result.wearable.dataCompleteness).toBe(1);
    expect(result.wearable.balanceScore).toBe(100);
    expect(result.wearable.contribution).toBe(0);
    expect(result.confidence).toBe(80); // 0.5 + 0.3 + 0.2*0 (no environment snapshot)
  });

  it("environment: fixed weights 40/30/30 over season/temperature/humidity", () => {
    const monsoon = new Date("2026-08-15"); // varsha -> vata tendency, not a junction
    const withEnv = computeCombined(vikritiVata, [], { temperatureC: 30, humidity: 60, season: "varsha", source: "manual" }, 28, monsoon);
    expect(withEnv.environment.seasonTerm).toBe(70);
    expect(withEnv.environment.temperatureTerm).toBe(0);
    expect(withEnv.environment.humidityTerm).toBe(0);
    expect(withEnv.environment.contribution).toBe(28); // 0.4 x 70
    const withoutMatch = computeCombined(vikritiVata, [], { temperatureC: 30, humidity: 60, season: "sharad", source: "manual" }, 28, monsoon);
    expect(withoutMatch.environment.contribution).toBe(0); // sharad -> pitta tendency, dominant vata
  });

  it("recorded environment always contributes: season + temperature terms (real regression case)", () => {
    // 2026-10-30: sharad (pitta tendency, no season match for vata), ritu-sandhi junction.
    const oct30 = new Date("2026-10-30");
    const result = computeCombined(
      vikritiVata,
      [],
      { temperatureC: 19, humidity: 89, season: "sharad", source: "location" },
      28,
      oct30
    );
    expect(result.environment.seasonTerm).toBe(30); // junction bonus only
    expect(result.environment.temperatureTerm).toBe(20.83); // 5 x 100/24
    expect(result.environment.humidityTerm).toBe(0); // vata aggravated by DRY air, 89% is damp
    expect(result.environment.contribution).toBe(18.25); // (40x30 + 30x20.83 + 30x0)/100
  });

  it("stays 0 without an environment snapshot even if the date suggests a season", () => {
    const result = computeCombined(vikritiVata, [], null, 28, new Date("2026-08-15"));
    expect(result.environment.contribution).toBe(0);
    expect(result.environment.assumedNormal).toBe(true);
  });

  it("records the model version, explanation and step-by-step calculation", () => {
    const result = computeCombined(vikritiVata, [], null, 28);
    expect(result.modelVersion).toBe("combined_50_30_20_fixed_weights_v3");
    expect(result.explanation).toHaveLength(4);
    expect(result.calculation).toHaveLength(4);
    expect(result.calculation[3]).toContain("= ");
  });

  it("attaches a one-line formula and fixed weight to every sub-score", () => {
    const now = new Date();
    const readings: ReadingInput[] = [
      { metric: "steps", value: 6000, provenance: "manual", recordedAt: now.toISOString() },
    ];
    const result = computeCombined(vikritiVata, readings, null, 28);
    const steps = result.wearable.subScores.find((s) => s.metric === "steps");
    expect(steps).toBeDefined();
    expect(steps!.assumedNormal).toBe(false);
    expect(steps!.weight).toBe(15);
    expect(steps!.formula.length).toBeGreaterThan(0);
  });
});

describe("Reference values carry required documentation", () => {
  it("every metric documents unit, reference source and evidence status", () => {
    for (const meta of Object.values(METRICS)) {
      expect(meta.unit.length).toBeGreaterThan(0);
      expect(meta.referenceSource.length).toBeGreaterThan(0);
      expect(meta.evidenceStatus.length).toBeGreaterThan(0);
    }
  });

  it("SpO2 is part of the combined health component (user-specified fixed weight 10)", () => {
    expect(COMBINED_WEARABLE_METRICS).toContain("spo2");
    expect(HEALTH_WEIGHTS.spo2).toBe(10);
  });
});
