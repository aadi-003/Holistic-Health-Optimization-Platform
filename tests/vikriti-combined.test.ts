import { describe, it, expect } from "vitest";
import { VIKRITI_ITEMS, VIKRITI_INSTRUMENT } from "@/lib/data/vikriti-questions";
import { scoreVikriti, vikritiDominantDosha, type VikritiAnswers } from "@/lib/engine/vikriti-engine";
import {
  normalizeWearableScore,
  environmentalAggravation,
  computeCombined,
  type ReadingInput,
} from "@/lib/engine/combined-engine";
import { computeSeason, seasonDoshaTendency, isRituSandhi } from "@/lib/engine/seasonal";
import { METRICS, COMBINED_WEARABLE_METRICS } from "@/lib/engine/reference-values";

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

describe("Wearable normalisation (documented design-proposal mappings)", () => {
  it("sleep duration: 100 inside 7-9h, decays 30/h outside", () => {
    expect(normalizeWearableScore("sleep_duration", 8, null)).toBe(100);
    expect(normalizeWearableScore("sleep_duration", 6, null)).toBe(70);
    expect(normalizeWearableScore("sleep_duration", 5, null)).toBe(40);
    expect(normalizeWearableScore("sleep_duration", 4, null)).toBe(10);
    expect(normalizeWearableScore("sleep_duration", 12, null)).toBeLessThanOrEqual(10);
  });

  it("resting HR: 100 at <=70, -2.5/bpm above, floor 0 at 110", () => {
    expect(normalizeWearableScore("resting_heart_rate", 70, null)).toBe(100);
    expect(normalizeWearableScore("resting_heart_rate", 90, null)).toBe(50);
    expect(normalizeWearableScore("resting_heart_rate", 110, null)).toBe(0);
    expect(normalizeWearableScore("resting_heart_rate", 55, null)).toBe(100);
  });

  it("HRV: 100 at age-band reference, 0 at half of it", () => {
    expect(normalizeWearableScore("hrv_rmssd", 55, 25)).toBe(100); // age <= 25 -> ref 55
    expect(normalizeWearableScore("hrv_rmssd", 27.5, 25)).toBe(0);
    expect(normalizeWearableScore("hrv_rmssd", 41.25, 25)).toBe(50);
  });

  it("steps: linear 0 at 2k -> 100 at 10k", () => {
    expect(normalizeWearableScore("steps", 2000, null)).toBe(0);
    expect(normalizeWearableScore("steps", 6000, null)).toBe(50);
    expect(normalizeWearableScore("steps", 10000, null)).toBe(100);
  });
});

describe("Environmental aggravation (classical guna logic, v2 slopes)", () => {
  it("vata: cool + dry aggravate", () => {
    expect(environmentalAggravation("vata", 8, 20)).toBe(64); // 16*2.5 + 30*0.8
    expect(environmentalAggravation("vata", 30, 70)).toBe(0);
  });
  it("vata: typical cool humid weather now registers (real regression case)", () => {
    expect(environmentalAggravation("vata", 19, 89)).toBe(12.5); // 5*2.5 + 0
  });
  it("pitta: heat aggravates", () => {
    expect(environmentalAggravation("pitta", 32, 60)).toBe(24); // 6*4
    expect(environmentalAggravation("pitta", 10, 20)).toBe(0);
  });
  it("kapha: cold + damp aggravate", () => {
    expect(environmentalAggravation("kapha", 10, 95)).toBe(43.6); // 8*2 + 23*1.2
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

  it("imputes nothing: missing wearable indicators are excluded, never estimated", () => {
    const result = computeCombined(vikritiVata, [], null, 28);
    expect(result.wearable.subScores).toHaveLength(0);
    expect(result.wearable.dataCompleteness).toBe(0);
    expect(result.wearable.contribution).toBe(0);
    expect(result.confidence).toBe(50); // 0.5*1 + 0.3*0 + 0.2*0
  });

  it("uses real readings when present and raises data completeness", () => {
    const now = new Date();
    const readings: ReadingInput[] = [
      { metric: "sleep_duration", value: 8, provenance: "manual", recordedAt: now.toISOString() },
      { metric: "resting_heart_rate", value: 66, provenance: "measured", recordedAt: now.toISOString() },
      { metric: "hrv_rmssd", value: 60, provenance: "measured", recordedAt: now.toISOString() },
      { metric: "steps", value: 10000, provenance: "measured", recordedAt: now.toISOString() },
    ];
    const result = computeCombined(vikritiVata, readings, null, 28);
    expect(result.wearable.dataCompleteness).toBe(1);
    expect(result.wearable.balanceScore).toBe(100);
    expect(result.wearable.contribution).toBe(0);
    expect(result.confidence).toBe(80); // 0.5 + 0.3 + 0.2*0 (no environment snapshot)
  });

  it("adds the classical seasonal tendency (+25) when the season matches the dominant dosha", () => {
    const monsoon = new Date("2026-08-15"); // varsha -> vata tendency, not a junction
    const withEnv = computeCombined(vikritiVata, [], { temperatureC: 30, humidity: 60, season: "varsha", source: "manual" }, 28, monsoon);
    expect(withEnv.environment.contribution).toBe(25); // weather 0 + season 25
    const withoutMatch = computeCombined(vikritiVata, [], { temperatureC: 30, humidity: 60, season: "sharad", source: "manual" }, 28, monsoon);
    expect(withoutMatch.environment.contribution).toBe(0); // sharad -> pitta tendency, dominant vata
  });

  it("recorded environment always contributes: weather + junction terms (real regression case)", () => {
    // 2026-10-30: sharad (pitta tendency, no season term), ritu-sandhi junction.
    const oct30 = new Date("2026-10-30");
    const result = computeCombined(
      vikritiVata,
      [],
      { temperatureC: 19, humidity: 89, season: "sharad", source: "location" },
      28,
      oct30
    );
    expect(result.environment.weatherTerm).toBe(12.5);
    expect(result.environment.seasonTerm).toBe(0);
    expect(result.environment.junctionTerm).toBe(10);
    expect(result.environment.contribution).toBe(22.5);
  });

  it("stays 0 without an environment snapshot even if the date suggests a season", () => {
    const result = computeCombined(vikritiVata, [], null, 28, new Date("2026-08-15"));
    expect(result.environment.contribution).toBe(0);
  });

  it("records the model version and explanation payload", () => {
    const result = computeCombined(vikritiVata, [], null, 28);
    expect(result.modelVersion).toBe("combined_50_30_20_experimental_v2");
    expect(result.explanation).toHaveLength(4);
  });

  it("attaches a one-line formula to every wearable sub-score", () => {
    const now = new Date();
    const readings: ReadingInput[] = [
      { metric: "steps", value: 6000, provenance: "manual", recordedAt: now.toISOString() },
    ];
    const result = computeCombined(vikritiVata, readings, null, 28);
    expect(result.wearable.subScores).toHaveLength(1);
    expect(result.wearable.subScores[0].formula.length).toBeGreaterThan(0);
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

  it("SpO2 is excluded from the combined wearable component (overestimation bias)", () => {
    expect(COMBINED_WEARABLE_METRICS).not.toContain("spo2");
  });
});
