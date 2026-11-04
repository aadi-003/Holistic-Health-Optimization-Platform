import { describe, it, expect } from "vitest";
import { evaluateRules, type RuleContext } from "@/lib/engine/recommendation-engine";
import { scorePrakriti, type PrakritiAnswers } from "@/lib/engine/prakriti-engine";
import { scoreVikriti, type VikritiAnswers } from "@/lib/engine/vikriti-engine";
import { PRAKRITI_ITEMS } from "@/lib/data/prakriti-questions";
import { KNOWLEDGE_BASE } from "@/lib/data/knowledge-base";
import type { ReadingInput } from "@/lib/engine/combined-engine";

function prakritiAnswersFor(dosha: "vata" | "pitta" | "kapha"): PrakritiAnswers {
  const a: PrakritiAnswers = {};
  for (const item of PRAKRITI_ITEMS) {
    a[item.id] = item.dosha === dosha ? item.scoringAnswer : item.scoringAnswer === "yes" ? "no" : "yes";
  }
  return a;
}

function vikritiAnswersFor(dosha: "vata" | "pitta" | "kapha"): VikritiAnswers {
  const a: VikritiAnswers = {};
  for (const item of (VIKRITI_ITEMS as unknown as { id: string; dosha: string }[])) {
    a[item.id] = item.dosha === dosha ? "yes" : "no";
  }
  return a;
}

import { VIKRITI_ITEMS } from "@/lib/data/vikriti-questions";

function ctx(overrides: Partial<RuleContext> = {}): RuleContext {
  return {
    prakriti: null,
    vikriti: null,
    combined: null,
    season: "sharad",
    rituSandhi: false,
    readings: [],
    age: 28,
    ...overrides,
  };
}

describe("Knowledge base integrity", () => {
  it("every rule carries sources, evidence level and precautions", () => {
    for (const rule of KNOWLEDGE_BASE) {
      expect(rule.ruleId.length).toBeGreaterThan(0);
      expect(rule.sanskritDeva.length).toBeGreaterThan(0);
      expect(rule.sanskritIast.length).toBeGreaterThan(0);
      expect(["DR", "AI", "CT", "DP"]).toContain(rule.evidenceLevel);
      expect(rule.precautions.length).toBeGreaterThan(0);
      // Every rule must have at least one resolvable source.
      expect(rule.classicalSource !== null || rule.researchReference !== null).toBe(true);
    }
  });

  it("ships NO raga rules (no verified raga-to-dosha mapping exists in the reviewed sources)", () => {
    expect(KNOWLEDGE_BASE.filter((r) => r.category.toLowerCase().includes("raga"))).toHaveLength(0);
    expect(KNOWLEDGE_BASE.map((r) => r.category)).not.toContain("raga");
  });

  it("covers the eight required categories", () => {
    const categories = new Set(KNOWLEDGE_BASE.map((r) => r.category));
    for (const c of ["dinacharya", "ahara", "pathya", "apathya", "vyayama", "nidra", "ritucharya", "sadvritta"]) {
      expect(categories.has(c as never)).toBe(true);
    }
  });
});

describe("Rule evaluation — three-valued logic and missing inputs", () => {
  it("withholds prakriti-conditional rules when no assessment exists", () => {
    const { shown, withheld } = evaluateRules(ctx());
    expect(shown.find((s) => s.rule.ruleId === "DIN-002")).toBeUndefined();
    const din2 = withheld.find((w) => w.rule.ruleId === "DIN-002");
    expect(din2 && din2.status === "withheld" ? din2.reason : "").toMatch(/waiting for/i);
  });

  it("shows general education rules without any data", () => {
    const { shown } = evaluateRules(ctx());
    expect(shown.find((s) => s.rule.ruleId === "DIN-001")).toBeDefined();
    expect(shown.find((s) => s.rule.ruleId === "SAD-001")).toBeDefined();
  });

  it("activates constitution-conditional rules for the matching prakriti", () => {
    const prakriti = scorePrakriti(prakritiAnswersFor("pitta"));
    const { shown, withheld } = evaluateRules(ctx({ prakriti }));
    expect(shown.find((s) => s.rule.ruleId === "DIN-003")).toBeDefined();
    expect(withheld.find((w) => w.rule.ruleId === "DIN-002")).toBeDefined();
    expect(withheld.find((w) => w.rule.ruleId === "DIN-004")).toBeDefined();
  });

  it("activates vikriti-conditional pathya rules", () => {
    const vikriti = scoreVikriti(vikritiAnswersFor("kapha"));
    const { shown } = evaluateRules(ctx({ vikriti }));
    expect(shown.find((s) => s.rule.ruleId === "PAT-003")).toBeDefined();
  });

  it("fires the safety sleep-debt rule and orders it before education rules", () => {
    const now = new Date();
    const readings: ReadingInput[] = Array.from({ length: 5 }, (_, i) => ({
      metric: "sleep_duration",
      value: 5.5,
      provenance: "manual",
      recordedAt: new Date(now.getTime() - i * 86400000).toISOString(),
    }));
    const { shown } = evaluateRules(ctx({ readings }));
    const vya3 = shown.find((s) => s.rule.ruleId === "VYA-003");
    expect(vya3).toBeDefined();
    expect(vya3!.rule.precedence).toBe(1);
    expect(shown[0].rule.precedence).toBeLessThanOrEqual(shown[shown.length - 1].rule.precedence);
  });

  it("withholds the recovery rule when RHR data is missing", () => {
    const { withheld } = evaluateRules(ctx());
    const vya4 = withheld.find((w) => w.rule.ruleId === "VYA-004");
    expect(vya4 && vya4.status === "withheld" ? vya4.reason : "").toMatch(/waiting for/i);
  });

  it("activates the ritu-sandhi rule only inside the junction window", () => {
    const off = evaluateRules(ctx({ rituSandhi: false }));
    expect(off.shown.find((s) => s.rule.ruleId === "RTU-001")).toBeUndefined();
    const on = evaluateRules(ctx({ rituSandhi: true }));
    expect(on.shown.find((s) => s.rule.ruleId === "RTU-001")).toBeDefined();
  });

  it("records conflict resolution when a safety rule fires", () => {
    const now = new Date();
    const readings: ReadingInput[] = Array.from({ length: 5 }, (_, i) => ({
      metric: "sleep_duration",
      value: 5.0,
      provenance: "manual",
      recordedAt: new Date(now.getTime() - i * 86400000).toISOString(),
    }));
    const { shown } = evaluateRules(ctx({ readings }));
    const education = shown.find((s) => s.rule.ruleId === "DIN-001");
    expect(
      education && education.status === "shown"
        ? education.because.some((b) => b.includes("precedence"))
        : false
    ).toBe(true);
  });
});
