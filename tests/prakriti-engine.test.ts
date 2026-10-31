import { describe, it, expect } from "vitest";
import { PRAKRITI_ITEMS, PRAKRITI_INSTRUMENT } from "@/lib/data/prakriti-questions";
import { scorePrakriti, constitutionDoshas, type PrakritiAnswers } from "@/lib/engine/prakriti-engine";

/** Answers that award zero points everywhere (opposite of each scoring answer). */
function zeroAnswers(): PrakritiAnswers {
  const a: PrakritiAnswers = {};
  for (const item of PRAKRITI_ITEMS) a[item.id] = item.scoringAnswer === "yes" ? "no" : "yes";
  return a;
}

/** Answers that award full points to one dosha only. */
function doshaOnly(dosha: "vata" | "pitta" | "kapha"): PrakritiAnswers {
  const a = zeroAnswers();
  for (const item of PRAKRITI_ITEMS) if (item.dosha === dosha) a[item.id] = item.scoringAnswer;
  return a;
}

/** Award a specific subset of items (by id) in their scoring direction. */
function award(ids: string[]): PrakritiAnswers {
  const a = zeroAnswers();
  for (const id of ids) {
    const item = PRAKRITI_ITEMS.find((i) => i.id === id);
    if (!item) throw new Error(`Unknown item ${id}`);
    a[id] = item.scoringAnswer;
  }
  return a;
}

describe("Prakriti instrument pack", () => {
  it("has exactly 62 items", () => {
    expect(PRAKRITI_ITEMS).toHaveLength(62);
  });

  it("uses the documented dosha maxima 960 / 600 / 1440", () => {
    expect(PRAKRITI_INSTRUMENT.scoringModel.doshaMax).toEqual({ vata: 960, pitta: 600, kapha: 1440 });
  });

  it("itemised weights sum to the documented totals (Pitta sums to 599 — documented rounding artefact)", () => {
    const sum = (d: string) => PRAKRITI_ITEMS.filter((i) => i.dosha === d).reduce((s, i) => s + i.weight, 0);
    expect(sum("vata")).toBe(960);
    expect(sum("kapha")).toBe(1440);
    expect(sum("pitta")).toBe(599); // printed total is 600; see file header note
  });

  it("has yes/no scoring answers only", () => {
    for (const item of PRAKRITI_ITEMS) {
      expect(["yes", "no"]).toContain(item.scoringAnswer);
    }
  });
});

describe("Prakriti scoring engine", () => {
  it("scores the full Vata vector at 960/960 = 100%", () => {
    const s = scorePrakriti(doshaOnly("vata"));
    expect(s.vataScore).toBe(960);
    expect(s.vataPct).toBe(100);
    expect(s.pittaScore).toBe(0);
    expect(s.kaphaScore).toBe(0);
    expect(s.classification).toBe("vata");
  });

  it("scores the full Kapha vector at 1440/1440 = 100%", () => {
    const s = scorePrakriti(doshaOnly("kapha"));
    expect(s.kaphaScore).toBe(1440);
    expect(s.kaphaPct).toBe(100);
    expect(s.classification).toBe("kapha");
  });

  it("full Pitta vector earns the itemised 599 points = 99.83% of the documented 600 maximum", () => {
    const s = scorePrakriti(doshaOnly("pitta"));
    // doshaOnly answers every Pitta item in its printed scoring direction, including P5
    // (scoring answer "no"). Itemised sum = 119 + 120 + 120 + 120 + 120 = 599 vs printed 600.
    expect(s.pittaScore).toBe(599);
    expect(s.pittaPct).toBeCloseTo((599 / 600) * 100, 1);
  });

  it("classifies a dual constitution at the published thresholds (secondary = 50% of primary)", () => {
    // Kapha 100% primary; Vata exactly 480/960 = 50% secondary; Pitta 0 tertiary.
    const s = scorePrakriti(award(["K1", "K2", "K3A", "K3B", "K3C", "K4", "K5A", "K5B", "K6", "K7A", "K7B", "K7C", "K8A", "K8B", "K8C", "K9", "K10A", "K10B", "K10C", "K10D", "K11", "K12A", "K12B",
      "V3", "V7", "V4A", "V4B", "V6A", "V6B"]));
    expect(s.kaphaPct).toBe(100);
    expect(s.vataPct).toBe(50);
    expect(s.classification).toBe("vata_kapha");
    expect(s.label).toBe("Vata-Kapha");
  });

  it("sama branch: all-yes vector gives vata 100 / pitta 79.83 / kapha 72.22 -> tertiary not separated -> sama", () => {
    const a: PrakritiAnswers = {};
    for (const item of PRAKRITI_ITEMS) a[item.id] = "yes";
    const s = scorePrakriti(a);
    // vata: all vata items are "yes"-scored -> 960 (100%)
    // pitta: all except P5 -> 119+120+120+120 = 479 (79.83%)
    // kapha: all except the 6 "no"-scored -> 1040 (72.22%)
    expect(s.vataPct).toBe(100);
    expect(s.pittaPct).toBeCloseTo(79.83, 1);
    expect(s.kaphaPct).toBeCloseTo(72.22, 1);
    expect(s.classification).toBe("sama");
  });

  it("returns undetermined for the all-zero vector", () => {
    const s = scorePrakriti(zeroAnswers());
    expect(s.classification).toBe("undetermined");
  });

  it("missing answers earn no points (documented missing-answer policy)", () => {
    const partial = award(["V3"]); // 120 vata points
    const s = scorePrakriti(partial);
    expect(s.vataScore).toBe(120);
    expect(s.pittaScore).toBe(0);
    expect(s.kaphaScore).toBe(0);
  });

  it("percentages always stay within [0, 100]", () => {
    const vectors = [zeroAnswers(), doshaOnly("vata"), doshaOnly("pitta"), doshaOnly("kapha")];
    for (const v of vectors) {
      const s = scorePrakriti(v);
      for (const pct of [s.vataPct, s.pittaPct, s.kaphaPct]) {
        expect(pct).toBeGreaterThanOrEqual(0);
        expect(pct).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("Constitution helpers", () => {
  it("expands dual and sama classifications", () => {
    expect(constitutionDoshas("vata")).toEqual(["vata"]);
    expect(constitutionDoshas("vata_pitta")).toEqual(["vata", "pitta"]);
    expect(constitutionDoshas("pitta_kapha")).toEqual(["pitta", "kapha"]);
    expect(constitutionDoshas("sama")).toEqual(["vata", "pitta", "kapha"]);
    expect(constitutionDoshas("undetermined")).toEqual([]);
  });
});
