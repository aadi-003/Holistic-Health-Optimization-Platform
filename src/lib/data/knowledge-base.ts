/**
 * Holistic — Ayurveda knowledge base and rule pack.
 *
 * Every record carries its Sanskrit term (Devanagari + IAST), English
 * meaning, explanation, classical source, research reference, conditions,
 * evidence level and precautions, per the record schema of the research
 * report (Ch. 10.1) and the twelve worked example rules (Ch. 14.3).
 *
 * Evidence levels (kept strictly separate everywhere in the UI):
 *   DR = demonstrated research finding (peer-reviewed quantitative result)
 *   AI = author interpretation (authors' conclusion from their data)
 *   CT = classical/traditional guidance (classical text via a reviewed modern
 *        source)
 *   DP = experimental software rule / design proposal of this platform
 *
 * CLASSICAL SOURCES are cited at chapter/verse level exactly as given by the
 * accessed modern sources (Anagha & Deole 2021 [5]; Dhiman et al. 2026 [6]).
 * Bracketed numbers refer to the platform bibliography (About screen).
 *
 * RAGA / MUSIC: the reviewed research contains NO verified Raga-to-dosha
 * mapping, so this knowledge base deliberately ships NO raga rules. This is
 * disclosed on the About screen rather than inventing relationships.
 */

export type Dosha = "vata" | "pitta" | "kapha";
export type EvidenceLevel = "DR" | "AI" | "CT" | "DP";
export type Category =
  | "dinacharya"
  | "ahara"
  | "pathya"
  | "apathya"
  | "vyayama"
  | "nidra"
  | "ritucharya"
  | "sadvritta";

export interface RuleCondition {
  /** Applies when the user's constitution includes any of these doshas as dominant or dual member ("sama" matches all). */
  prakritiIncludes?: Dosha[];
  /** Applies when the vikriti self-assessment's dominant (or tied) imbalance is this dosha. */
  vikritiDominant?: Dosha;
  /** Minimum vikriti imbalance percentage of the dominant dosha. */
  vikritiAtLeast?: number;
  seasons?: Season[];
  rituSandhi?: boolean;
  /** Wearable flags computed from the 7-day readings (all must hold). */
  wearable?: ("sleep_debt" | "rhr_elevated" | "low_hrv" | "low_activity")[];
  requiresEnvironment?: boolean;
}

export interface RecommendationRule {
  ruleId: string;
  category: Category;
  /** Rule precedence: 1 safety > 2 contraindication > 3 vikriti-correction > 4 prakriti-maintenance > 5 education. */
  precedence: 1 | 2 | 3 | 4 | 5;
  sanskritDeva: string;
  sanskritIast: string;
  english: string;
  recommendation: string;
  /** Short imperative actions — what to actually DO (card body, kept brief). */
  steps: string[];
  why: string;
  conditions: RuleCondition;
  classicalSource: string | null;
  researchReference: string | null;
  evidenceLevel: EvidenceLevel;
  precautions: string[];
  applicability: string;
}

type Season = "vasanta" | "greeshma" | "varsha" | "sharad" | "hemanta" | "shishira";

const ALL_DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];

export const KNOWLEDGE_BASE: RecommendationRule[] = [
  // ================= DINACHARYA =================
  {
    ruleId: "DIN-001",
    category: "dinacharya",
    precedence: 5,
    sanskritDeva: "ब्रह्ममुहूर्त",
    sanskritIast: "brahma-muhūrta",
    english: "Pre-dawn wake window",
    recommendation:
      "Aim for a consistent wake time in the pre-dawn window (roughly 45-60 minutes before sunrise), and keep it the same across the week.",
    steps: ["Fix one wake time for the whole week", "Aim for the pre-dawn window when your schedule allows", "Do not shorten sleep to wake earlier"],
    why: "The classical daily regimen places waking during brahma-muhūrta at the start of the day's routine. As an educational app we translate this into a regularity rule adapted to your own schedule rather than a fixed clock time.",
    conditions: {},
    classicalSource: "A.Hr.Sū. 2/1 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: [
      "Adapt to your schedule and sleep need; do not shorten sleep to wake earlier.",
      "Regularity framing is a platform adaptation (design proposal).",
    ],
    applicability: "All users.",
  },
  {
    ruleId: "DIN-002",
    category: "dinacharya",
    precedence: 4,
    sanskritDeva: "दन्तधावन",
    sanskritIast: "dantadhavana",
    english: "Tooth cleaning — taste by constitution",
    recommendation:
      "Classical oral-care education: for a Vata constitution the tooth-stick tradition uses sweet and astringent tastes (e.g. madhuka, khadira). If you use chew-sticks or herbal formulations, this is the classical taste logic behind them.",
    steps: ["Pick sweet/astringent herbal tooth care if you use chew-sticks", "Keep your regular modern dental routine"],
    why: "The dinacharya chapter maps Prakriti to taste category for oral care: Vata - sweet/astringent, with citations. This is presented as taste education, not a dental treatment.",
    conditions: { prakritiIncludes: ["vata"] },
    classicalSource: "A.Hr.Sū. 2/2-3; Cha.Sa.Sū. 5/71-73 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Not a dental treatment.", "Chew-sticks can injure gums; follow modern dental care."],
    applicability: "Users whose constitution includes Vata as dominant or dual member.",
  },
  {
    ruleId: "DIN-003",
    category: "dinacharya",
    precedence: 4,
    sanskritDeva: "दन्तधावन",
    sanskritIast: "dantadhavana",
    english: "Tooth cleaning — bitter taste education",
    recommendation:
      "Classical oral-care education: for a Pitta constitution the tooth-stick tradition favours bitter tastes (e.g. nimba / neem). Presented as the classical taste logic behind herbal oral-care choices.",
    steps: ["Pick bitter (neem) herbal tooth care if you use chew-sticks", "Keep your regular modern dental routine"],
    why: "Same classical Prakriti-to-taste table; Pitta maps to the bitter taste category.",
    conditions: { prakritiIncludes: ["pitta"] },
    classicalSource: "A.Hr.Sū. 2/2-3; Cha.Sa.Sū. 5/71-73 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Not a dental treatment.", "Follow modern dental care."],
    applicability: "Users whose constitution includes Pitta as dominant or dual member.",
  },
  {
    ruleId: "DIN-004",
    category: "dinacharya",
    precedence: 4,
    sanskritDeva: "दन्तधावन / उद्वर्तन",
    sanskritIast: "dantadhavana / udvartana",
    english: "Tooth cleaning — pungent taste; dry powder massage",
    recommendation:
      "Classical education: for a Kapha constitution the tooth-stick tradition favours pungent tastes (e.g. karanja, arka); the classical routine also describes udvartana (dry powder friction massage) as a Kapha-reducing practice.",
    steps: ["Pick pungent-herb tooth care if you use chew-sticks", "Optional: dry powder friction massage before bathing"],
    why: "The tooth-stick table maps Kapha to the pungent taste; udvartana appears in the same dinacharya sequence for Kapha constitutions.",
    conditions: { prakritiIncludes: ["kapha"] },
    classicalSource: "Tooth table via Anagha & Deole 2021, [5]; udvartana A.Hr.Sū. 2/16 via [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Skin sensitivity caution with dry powders.", "Not a dental or weight-loss treatment."],
    applicability: "Users whose constitution includes Kapha as dominant or dual member.",
  },
  {
    ruleId: "DIN-005",
    category: "dinacharya",
    precedence: 5,
    sanskritDeva: "जिह्वानिर्लेखन",
    sanskritIast: "jihvā-nirlekhana",
    english: "Tongue scraping",
    recommendation:
      "Include gentle tongue scraping in your morning oral care, as part of the classical morning sequence.",
    steps: ["Scrape your tongue each morning before brushing"],
    why: "Listed in the dinacharya component catalogue extracted from the peer-reviewed CSNE chapter as part of the oral-hygiene stack (brushing, tongue scraping, oil pulling).",
    conditions: {},
    classicalSource: "Dinacharya catalogue via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Use a smooth, dedicated scraper; avoid scraping irritated tissue."],
    applicability: "All users.",
  },
  {
    ruleId: "DIN-006",
    category: "dinacharya",
    precedence: 3,
    sanskritDeva: "अभ्यङ्ग",
    sanskritIast: "abhyaṅga",
    english: "Oil massage before bathing",
    recommendation:
      "Consider a comfortable oil massage (abhyaṅga) before bathing, especially when your current state shows Vata-dominant signs.",
    steps: ["Warm the oil and massage before your bath", "Wipe floors to avoid slipping", "Patch-test new oils on sensitive skin"],
    why: "Abhyaṅga before bathing is part of the classical dinacharya sequence, and it is described as sleep-promoting and grounding (A.Hr.Sū. 2/8). The Vata-state emphasis follows the imbalance-correction precedence.",
    conditions: {},
    classicalSource: "A.Hr.Sū. 2/8, 2/11-14 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: [
      "Warm the oil comfortably; avoid slips on oily floors.",
      "Patch-test oils if you have sensitive skin.",
    ],
    applicability: "All users; emphasised for Vata imbalance states.",
  },
  {
    ruleId: "DIN-007",
    category: "dinacharya",
    precedence: 5,
    sanskritDeva: "स्नान",
    sanskritIast: "snāna",
    english: "Bathing — season-appropriate water temperature",
    recommendation:
      "Keep bathing in your routine; the classical texts condition water temperature on season and body region (warm in cold seasons, cooler preference in peak heat).",
    steps: ["Cold seasons: warm bath", "Peak heat: prefer a cooler bath"],
    why: "Snāna with region- and season-conditional water temperature is extracted in the dinacharya catalogue.",
    conditions: { seasons: ["hemanta", "shishira", "greeshma"] },
    classicalSource: "Su.Sa.Ci. 24/61 via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Avoid overheating or chilling; comfort first."],
    applicability: "All users; strongest framing in cold or peak-heat seasons.",
  },

  // ================= AHARA =================
  {
    ruleId: "AHA-001",
    category: "ahara",
    precedence: 5,
    sanskritDeva: "आहार-काल",
    sanskritIast: "āhāra-kāla",
    english: "Eat on true hunger, previous meal digested",
    recommendation:
      "Before eating, do a quick hunger check: the classical rule is to eat when the previous meal is digested and genuine hunger is present.",
    steps: ["Pause and check real hunger before eating", "Wait until the previous meal is digested"],
    why: "Classical eating-behaviour anchor: eat when the previous meal is digested and on genuine hunger (Su.Sa.Ut. 34/75). The app presents this as an educational prompt, never as food restriction.",
    conditions: {},
    classicalSource: "Su.Sa.Ut. 34/75 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: [
      "Educational only — never skip meals you need or restrict food groups.",
      "Opt out anytime; not suitable as written during pregnancy, illness or disordered-eating recovery.",
    ],
    applicability: "All users.",
  },
  {
    ruleId: "AHA-002",
    category: "ahara",
    precedence: 5,
    sanskritDeva: "आहारविधि",
    sanskritIast: "āhāra-vidhi",
    english: "Rules of eating (how to eat)",
    recommendation:
      "Classical eating-rule education: eat warm and unctuous preparations in due quantity, at a comfortable pace, with attention — the classical 'how to eat' set.",
    steps: ["Eat warm, unctuous meals in due quantity", "Eat at a comfortable pace with attention on the meal"],
    why: "The āhāra-vidhi rules of Caraka-saṃhitā Vimāna-sthāna 1.21-25 (eat warm/unctuous in due quantity, etc.) are carried by the reviewed CSNE chapter.",
    conditions: {},
    classicalSource: "Cha.Sa.Vī. 1/21-25 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["General education; individual dietary needs (allergies, medical diets) always take precedence."],
    applicability: "All users.",
  },
  {
    ruleId: "AHA-003",
    category: "ahara",
    precedence: 5,
    sanskritDeva: "द्वि-काल भोजन",
    sanskritIast: "dvi-kāla bhojana",
    english: "Two-meal regularity",
    recommendation:
      "Aim for a regular two-meal pattern with a stable timing rhythm rather than continuous grazing through the day.",
    steps: ["Keep two fixed meal times", "Avoid grazing between meals"],
    why: "The classical anchors describe twice-daily meal frequency without grazing (report Ch. 9.3); the app frames this as meal-regularity education.",
    conditions: {},
    classicalSource: "Meal regularity anchors via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: [
      "Never restrict food groups or amounts your body needs.",
      "Opt out anytime; no weight-loss framing.",
    ],
    applicability: "All users.",
  },
  {
    ruleId: "AHA-004",
    category: "ahara",
    precedence: 4,
    sanskritDeva: "रस शिक्षा",
    sanskritIast: "rasa-śikṣā",
    english: "Taste education by constitution",
    recommendation:
      "Taste-pattern education: the classical logic maps constitutions to balancing tastes — Vata: sweet, sour, salty tendencies; Pitta: sweet, bitter, astringent tendencies; Kapha: pungent, bitter, astringent tendencies. Use this as background when you plan meals.",
    steps: ["Plan meals around your balancing tastes (Vata: sweet/sour/salty · Pitta: sweet/bitter/astringent · Kapha: pungent/bitter/astringent)"],
    why: "Generalisation of the constitution-to-taste pattern demonstrated by the tooth-stick table (report Ch. 9.7). Educational content, not a diet prescription.",
    conditions: { prakritiIncludes: ALL_DOSHAS },
    classicalSource: "Taste-by-constitution pattern via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: [
      "Not a diet prescription; never restrict food groups.",
      "Individual medical diets always take precedence.",
    ],
    applicability: "Content adapts to the user's dominant constitution doshas.",
  },
  {
    ruleId: "AHA-005",
    category: "ahara",
    precedence: 5,
    sanskritDeva: "ऋतु-आहार",
    sanskritIast: "ṛtu-āhāra",
    english: "Season-conditional eating emphasis",
    recommendation:
      "In peak heat, favour lighter meals and steady hydration timing; in cold seasons, favour warm, nourishing meal regularity — a classical seasonal eating emphasis.",
    steps: ["Peak heat: lighter meals, steady hydration timing", "Cold seasons: warm, regular, nourishing meals"],
    why: "Digestive strength (agni) varies seasonally in the classical scheme (report Ch. 9.2); meal-regularity advice is adjusted seasonally as education.",
    conditions: { seasons: ["greeshma", "hemanta", "shishira"] },
    classicalSource: "Seasonal scheme per Dhiman et al. 2026 [6, Abstract]; dinacharya anchors [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["No clinical claims; general education only."],
    applicability: "Users in hot or cold seasons.",
  },

  // ================= PATHYA / APATHYA =================
  {
    ruleId: "PAT-001",
    category: "pathya",
    precedence: 3,
    sanskritDeva: "पथ्य",
    sanskritIast: "pathya",
    english: "Suitable — Vata-state support",
    recommendation:
      "When your current state is Vata-dominant, classical routine logic favours regularity: regular meal and sleep times, warm unctuous meals framing, and sensory-rest breaks.",
    steps: ["Fix regular meal and sleep times", "Prefer warm, unctuous meals", "Take short sensory-rest breaks from screens"],
    why: "Grounding-routine education assembled from dinacharya regularity principles; Vata-state psychological associations from Mills et al. (2019) are used as educational context only.",
    conditions: { vikritiDominant: "vata" },
    classicalSource: "Dinacharya regularity principles via Anagha & Deole 2021, [5]",
    researchReference: "Mills et al. 2019 [4]: Vata imbalance associated with anxiety (p ≤ 0.05) and rumination (p ≤ 0.01) — association, not causation.",
    evidenceLevel: "CT",
    precautions: [
      "No anxiety or treatment claims.",
      "No medicated oil therapies or enemas (out of scope).",
    ],
    applicability: "Users whose vikriti self-assessment is currently Vata-dominant.",
  },
  {
    ruleId: "PAT-002",
    category: "pathya",
    precedence: 3,
    sanskritDeva: "पथ्य",
    sanskritIast: "pathya",
    english: "Suitable — Pitta-state support",
    recommendation:
      "When your current state is Pitta-dominant, classical taste logic favours cooling preparations (sweet, bitter, astringent tendencies), avoiding peak-sun exertion and favouring calmer meal pacing.",
    steps: ["Favour cooling preparations (sweet/bitter/astringent)", "Avoid exertion at peak sun", "Slow your meal pacing"],
    why: "Pitta-heat framing consistent with classical attributes (tīkṣṇa/heat) used educationally; the seasonal scheme assigns Sharad to Pitta aggravation.",
    conditions: { vikritiDominant: "pitta" },
    classicalSource: "Classical Pitta attributes via Tripathi et al. 2011 [2] and Anagha & Deole 2021 [5]",
    researchReference: "Mills et al. 2019 [4]: Pitta imbalance associated with poorer mood (p ≤ 0.01) and stress — association, not causation.",
    evidenceLevel: "CT",
    precautions: ["No dehydration or acidity diagnosis language.", "General education only."],
    applicability: "Users whose vikriti self-assessment is currently Pitta-dominant.",
  },
  {
    ruleId: "PAT-003",
    category: "pathya",
    precedence: 3,
    sanskritDeva: "पथ्य",
    sanskritIast: "pathya",
    english: "Suitable — Kapha-state support",
    recommendation:
      "When your current state is Kapha-dominant, classical routine logic favours wake-time regularity, lighter warm preparations with pungent-bitter-astringent taste education, and consistent daily activity.",
    steps: ["Wake at the same fixed time daily", "Choose warm, light meals (pungent-bitter-astringent)", "Keep daily activity steady"],
    why: "Kapha-state features (heaviness, hypoactivity) map to the classical opposite-quality logic (light, warm, mobile); assembled from the dinacharya catalogue.",
    conditions: { vikritiDominant: "kapha" },
    classicalSource: "Dinacharya catalogue via Anagha & Deole 2021, [5]",
    researchReference: "Mills et al. 2019 [4]: Kapha imbalance associated with stress (p ≤ 0.01) — association, not causation.",
    evidenceLevel: "CT",
    precautions: ["General education; never skip needed nutrition.", "No weight-loss framing."],
    applicability: "Users whose vikriti self-assessment is currently Kapha-dominant.",
  },
  {
    ruleId: "APT-001",
    category: "apathya",
    precedence: 2,
    sanskritDeva: "अपथ्य",
    sanskritIast: "apathya",
    english: "To limit — excess exercise contraindication",
    recommendation:
      "Avoid pushing exercise to exhaustion. The classical texts list excess vyāyāma as causing thirst, emaciation, breathlessness, fatigue, cough and fever — and contraindicate vigorous exercise in Vata/Pitta disturbance, childhood and old age.",
    steps: ["Stop before exhaustion", "Keep sessions light until balance returns"],
    why: "Contraindication list A.Hr.Sū. 2/14; the rule fires as a caution whenever vikriti shows Vata or Pitta imbalance, so the contraindication precedes maintenance advice.",
    conditions: { vikritiDominant: "vata" },
    classicalSource: "A.Hr.Sū. 2/14 (via Anagha & Deole 2021, [5])",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Safety framing; consult a professional for exercise decisions if you have any health condition."],
    applicability: "Fires on Vata-dominant vikriti; a mirror caution exists for Pitta (VYA-003).",
  },
  {
    ruleId: "APT-002",
    category: "apathya",
    precedence: 5,
    sanskritDeva: "अपथ्य",
    sanskritIast: "apathya",
    english: "To limit — heavy/oily patterns in Kapha state",
    recommendation:
      "When your current state is Kapha-dominant, classical quality-logic suggests moderating heavy, oily, fried and very sweet preparations and daytime napping — framed as education, not prohibition.",
    steps: ["Moderate heavy, oily, fried and very sweet foods", "Avoid daytime napping"],
    why: "Opposite-quality (guṇa) logic applied to Kapha heaviness/oiliness; educational framing from the dinacharya catalogue.",
    conditions: { vikritiDominant: "kapha" },
    classicalSource: "Guṇa logic via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Never restrict food groups; opt out anytime."],
    applicability: "Users whose vikriti self-assessment is currently Kapha-dominant.",
  },

  // ================= VYAYAMA =================
  {
    ruleId: "VYA-001",
    category: "vyayama",
    precedence: 4,
    sanskritDeva: "व्यायाम",
    sanskritIast: "vyāyāma",
    english: "Exercise at half your strength",
    recommendation:
      "Exercise regularly but within the classical dose: up to about half your capacity — the traditional check is stopping when effort feels like half of your maximum, e.g. sweat on the forehead/nose without exhaustion. Use steps and active minutes as your objective dose.",
    steps: ["Exercise to about half your capacity", "Stop at light sweat, before exhaustion", "Track steps/active minutes as your dose"],
    why: "Classical dose rule: exercise lightens the body, strengthens digestion and reduces obesity, capped at half of one's strength (A.Hr.Sū. 2/11-14). Wearable steps/active minutes are the objective measures with acceptable accuracy.",
    conditions: {},
    classicalSource: "A.Hr.Sū. 2/11-14 (via Anagha & Deole 2021, [5])",
    researchReference: "Fuller et al. 2020 [19]: steps/HR acceptable average accuracy.",
    evidenceLevel: "CT",
    precautions: [
      "'Half strength' is a classical (traditional) dose, NOT a physiologically validated threshold.",
      "No max-HR prescriptions; consult a professional if you have cardiac or other conditions.",
    ],
    applicability: "All users.",
  },
  {
    ruleId: "VYA-002",
    category: "vyayama",
    precedence: 5,
    sanskritDeva: "ऋतु-व्यायाम",
    sanskritIast: "ṛtu-vyāyāma",
    english: "Season-conditional exercise intensity",
    recommendation:
      "Classically, exercise capacity is described as higher in cool seasons (especially for those on nourishing diets) and lower in peak heat — adjust outdoor activity timing and intensity with the season.",
    steps: ["Cool seasons: intensity can go up a notch", "Peak heat: move activity to cooler hours"],
    why: "Season-and-diet conditioning of exercise from the classical exercise chapter (report Ch. 9.4); aligned with practical heat-avoidance.",
    conditions: { seasons: ["hemanta", "shishira", "vasanta", "greeshma"] },
    classicalSource: "A.Hr.Sū. 2/11-14 via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Avoid overheating in summer; hydrate; no clinical claims."],
    applicability: "Users in cool or peak-heat seasons.",
  },
  {
    ruleId: "VYA-003",
    category: "vyayama",
    precedence: 1,
    sanskritDeva: "व्यायाम-सावधानता",
    sanskritIast: "vyāyāma-sāavadhānatā",
    english: "Recovery first — do not increase intensity now",
    recommendation:
      "Hold off increasing exercise intensity right now. Your recent data shows recovery strain (short sleep, elevated resting heart rate, low HRV, or a Vata/Pitta imbalance state). Prioritise sleep regularity and lighter movement; a comfortable post-exercise massage is the classical recovery framing.",
    steps: ["Hold intensity increases this week", "Protect your sleep regularity", "Keep movement light; optional gentle massage"],
    why: "The classical contraindication of excess exercise in Vata/Pitta states (A.Hr.Sū. 2/14) is combined with wearable context (sleep duration, RHR trend, HRV as stress-recovery index). Wearable thresholds are platform design proposals requiring calibration.",
    conditions: { wearable: ["sleep_debt"] },
    classicalSource: "A.Hr.Sū. 2/14 (via Anagha & Deole 2021, [5])",
    researchReference: "HRV as stress-recovery index: Shaffer & Ginsberg 2017 [12]; wearable accuracy limits: [10, 19].",
    evidenceLevel: "DP",
    precautions: [
      "Wearable input is context, never a dosha readout or medical alert.",
      "Persistent anomalies deserve professional attention; this is not a medical warning.",
    ],
    applicability: "Fires when 7-day sleep average < 6.5 h (design-proposal threshold).",
  },
  {
    ruleId: "VYA-004",
    category: "vyayama",
    precedence: 2,
    sanskritDeva: "व्यायाम-सावधानता",
    sanskritIast: "vyāyāma-sāavadhānatā",
    english: "Recovery first — strain indicators present",
    recommendation:
      "Your 7-day resting heart rate trend is above your usual level or HRV nights are repeatedly low — treat this as a 'body under load' context card: reduce optional intensity, protect sleep regularity, and recover first.",
    steps: ["Reduce optional intensity", "Protect sleep regularity", "Recover first, then resume"],
    why: "Recovery-first framing from the worked example rules (report Ch. 14.3 R11): RHR trend above baseline or repeated low-HRV nights suppress intensity-increase advice.",
    conditions: { wearable: ["rhr_elevated"] },
    classicalSource: null,
    researchReference: "HRV as stress-recovery index [12]; wearable accuracy limits [10, 19].",
    evidenceLevel: "DP",
    precautions: [
      "Never a medical alert; persistent anomalies -> general practitioner suggestion.",
      "Thresholds are design proposals pending calibration.",
    ],
    applicability: "Fires when 7-day RHR average exceeds the user's overall baseline by > 5 bpm or > 85 bpm.",
  },

  // ================= NIDRA =================
  {
    ruleId: "NID-001",
    category: "nidra",
    precedence: 4,
    sanskritDeva: "निद्रा",
    sanskritIast: "nidrā",
    english: "Regular sleep timing",
    recommendation:
      "Keep a regular bed and wake time. Classical texts prescribe sleep in proper quantity and at proper time, with needs varying by person; modern sleep research also treats regularity as a measurable, useful property.",
    steps: ["Fix your bed and wake times", "Keep them daily, weekends included"],
    why: "Nidrā anchor: proper sleep supports happiness, nourishment, strength and knowledge (Cha.Sa.Sū. 21/30 via [5]); regularity is measurable from wearable sleep sessions.",
    conditions: {},
    classicalSource: "Cha.Sa.Sū. 21/30 (via Anagha & Deole 2021, [5])",
    researchReference: "Sleep-wake summary accuracy: report Ch. 8.1 [14].",
    evidenceLevel: "CT",
    precautions: [
      "Never diagnose sleep apnoea or insomnia; persistent complaints -> professional care.",
      "Sleep stages shown (if any) are estimates with wide error margins.",
    ],
    applicability: "All users.",
  },
  {
    ruleId: "NID-002",
    category: "nidra",
    precedence: 5,
    sanskritDeva: "रात्रि-चर्या",
    sanskritIast: "rātri-caryā",
    english: "Evening wind-down stack",
    recommendation:
      "Build a simple evening routine: a comfortable (not too late) bath, optional light oil massage, dim screens and a consistent wind-down before your regular bedtime.",
    steps: ["Take a warm evening bath", "Dim screens before bed", "Keep the same wind-down order nightly"],
    why: "Bath before sleep and regular timing appear in the dinacharya sequence; abhyaṅga is described as sleep-promoting (A.Hr.Sū. 2/8).",
    conditions: {},
    classicalSource: "A.Hr.Sū. 2/8; dinacharya sequence via Anagha & Deole 2021, [5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["General education; adapt to your schedule."],
    applicability: "All users.",
  },
  {
    ruleId: "NID-003",
    category: "nidra",
    precedence: 3,
    sanskritDeva: "निद्रा-नियमन",
    sanskritIast: "nidrā-niyamana",
    english: "Vata-state bedtime regularity",
    recommendation:
      "With a Vata-dominant current state, protect an earlier, highly regular bedtime and a warm, calm wind-down — classical grounding logic paired with the sleep-regularity principle.",
    steps: ["Move bedtime earlier, same time nightly", "Keep the wind-down warm and calm"],
    why: "Worked example R5: Vikriti Vata imbalance or short sleep -> suppress intensity advice, offer abhyaṅga-before-bath education and earlier-bedtime regularity prompt.",
    conditions: { vikritiDominant: "vata" },
    classicalSource: "A.Hr.Sū. 2/8 via Anagha & Deole 2021, [5]",
    researchReference: "Mills et al. 2019 [4] Vata-state associations as educational context; sleep-accuracy limits [14].",
    evidenceLevel: "CT",
    precautions: ["No anxiety claims; education only."],
    applicability: "Users whose vikriti self-assessment is currently Vata-dominant.",
  },

  // ================= RITUCHARYA =================
  {
    ruleId: "RTU-001",
    category: "ritucharya",
    precedence: 5,
    sanskritDeva: "ऋतुसन्धि",
    sanskritIast: "ṛtu-sandhi",
    english: "Seasonal junction — transition gently",
    recommendation:
      "You are in a seasonal junction window (ṛtu-sandhi). Classical seasonal logic tapers the previous regimen and introduces the next gradually; keep meal and sleep times especially regular through the change.",
    steps: ["Taper the old season's regimen", "Add new-season habits gradually", "Keep meal/sleep times extra regular"],
    why: "Ṛtu-sandhi transition vulnerability from the ritucharya scheme (Dhiman et al. 2026 [6, Abstract]); junction window length is a design proposal.",
    conditions: { rituSandhi: true },
    classicalSource: "Ṛtu-sandhi concept per Dhiman et al. 2026 [6, Abstract]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: [
      "Seasonal claims are labelled 'biologically plausible; not yet tested as an intervention' per [6].",
      "Window length is a design proposal.",
    ],
    applicability: "Users within the first or last 7 days of a season (design proposal).",
  },
  {
    ruleId: "RTU-002",
    category: "ritucharya",
    precedence: 5,
    sanskritDeva: "हेमन्त-शिशिर चर्या",
    sanskritIast: "hemanta-śiśira caryā",
    english: "Cold-season routine",
    recommendation:
      "In the cold half of the year, the classical scheme emphasises nourishing regular meals, warm bathing below the neck, and season-appropriate exercise; digestive strength is described as strong.",
    steps: ["Keep regular nourishing warm meals", "Warm bath over the whole body", "Keep season-appropriate exercise"],
    why: "Seasonal routine emphasis from the worked example R7; bath temperature rules Su.Sa.Ci. 24/61 via [5].",
    conditions: { seasons: ["hemanta", "shishira"] },
    classicalSource: "Su.Sa.Ci. 24/61 via Anagha & Deole 2021, [5]; seasonal scheme [6]",
    researchReference: "Pro-inflammatory winter transcriptomic profile [21] — plausibility anchor, not intervention evidence.",
    evidenceLevel: "CT",
    precautions: ["Avoid overheating claims; not for heat-sensitive conditions.", "Plausible-untested label per [6]."],
    applicability: "Users in Hemanta or Shishira.",
  },
  {
    ruleId: "RTU-003",
    category: "ritucharya",
    precedence: 5,
    sanskritDeva: "ग्रीष्म चर्या",
    sanskritIast: "grīṣma caryā",
    english: "Peak-heat routine",
    recommendation:
      "In peak heat: avoid exertion at peak sun, favour cooler bathing emphasis and lighter evening meals — classical seasonal practice, with extra relevance if your constitution is Pitta-dominant.",
    steps: ["Avoid exertion at peak sun", "Prefer cooler baths", "Keep evening meals light"],
    why: "Worked example R8: season = peak heat AND Prakriti Pitta-dominant -> cooling-routine education.",
    conditions: { seasons: ["greeshma"] },
    classicalSource: "Seasonal scheme [6]; Pitta-heat attributes [2, 5]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["No dehydration-diagnosis language.", "Hydrate sensibly in heat."],
    applicability: "Users in Greeshma; emphasised for Pitta constitutions.",
  },
  {
    ruleId: "RTU-004",
    category: "ritucharya",
    precedence: 5,
    sanskritDeva: "वसन्त चर्या",
    sanskritIast: "vasanta caryā",
    english: "Spring routine",
    recommendation:
      "In spring, the classical scheme describes liquefied Kapha: favour lighter preparations, steady activity and earlier wake times as the seasonal emphasis.",
    steps: ["Choose lighter preparations", "Keep activity steady daily", "Wake a little earlier"],
    why: "Vasanta is classically the Kapha-aggravation season (report Ch. 9.2); routine emphasis follows opposite-quality logic.",
    conditions: { seasons: ["vasanta"] },
    classicalSource: "Seasonal scheme per Dhiman et al. 2026 [6, Abstract]",
    researchReference: null,
    evidenceLevel: "CT",
    precautions: ["Plausible-untested label per [6]; general education only."],
    applicability: "Users in Vasanta.",
  },

  // ================= SADVRITTA =================
  {
    ruleId: "SAD-001",
    category: "sadvritta",
    precedence: 5,
    sanskritDeva: "सद्वृत्त",
    sanskritIast: "sadvṛtta",
    english: "Code of right conduct — measured speech and sensory rest",
    recommendation:
      "Practice small conduct anchors from the classical code of right conduct: measured speech, periodic sensory-rest breaks from screens, and respectful social interaction through the workday.",
    steps: ["Pause before reacting — measured speech", "Take short screen-free breaks through the day"],
    why: "The code of right conduct (sadvṛtta) is prescribed for social and professional life and described as preventing exogenous disease (Cha.Sa.Sū. 8/25 via [5]); linked educationally to modern stress constructs.",
    conditions: {},
    classicalSource: "Cha.Sa.Sū. 8/25 (via Anagha & Deole 2021, [5])",
    researchReference: "Mills et al. 2019 [4] psychological measures (MAAS, PSS) as referenced wellbeing constructs.",
    evidenceLevel: "CT",
    precautions: ["No mental-health diagnosis; keep framing non-sectarian."],
    applicability: "All users.",
  },
  {
    ruleId: "SAD-002",
    category: "sadvritta",
    precedence: 5,
    sanskritDeva: "स्वाध्याय / चिन्तन",
    sanskritIast: "svādhyāya / cintana",
    english: "Weekly reflective check-in",
    recommendation:
      "Once a week, review your routine adherence (wake/sleep/meal regularity) and jot a short reflective note about the week — a modern reflective-practice habit the platform pairs with classical regularity.",
    steps: ["Once a week, review wake/sleep/meal regularity", "Jot a two-line reflection note"],
    why: "Weekly check-ins on routine adherence and reflective journaling are the report's app-rule proposal for the conduct domain (framed via the reflection construct of modern instruments, not as classical prescriptions).",
    conditions: {},
    classicalSource: null,
    researchReference: "Reflection construct of the Reflection-Rumination Questionnaire (report Ch. 9.6); clearly labelled as a modern instrument.",
    evidenceLevel: "DP",
    precautions: ["Modern practice, not a classical prescription.", "No mental-health diagnosis."],
    applicability: "All users.",
  },
  {
    ruleId: "SAD-003",
    category: "sadvritta",
    precedence: 3,
    sanskritDeva: "मनः-शान्ति शिक्षा",
    sanskritIast: "manaḥ-śānti śikṣā",
    english: "State-aware stress education",
    recommendation:
      "Educational note: research on the vikriti questionnaire reports associations between dosha imbalance states and psychological states (Vata with anxiety and rumination; Pitta with poorer mood and stress; Kapha with stress). These are associations, not diagnoses — if stress feels heavy, ordinary routine stabilisers (regular meals, sleep, movement, social contact) are a sensible first step.",
    steps: ["Log your stress level in Manual health data", "Lean on routine: regular meals, sleep, movement", "Seek professional care if distress escalates"],
    why: "The Vikriti study's psychological correlations are used strictly as educational context per the report's copy rules (Ch. 13): associations phrased as research findings, no diagnosis language.",
    conditions: { vikritiDominant: ALL_DOSHAS[0] },
    classicalSource: null,
    researchReference: "Mills et al. 2019 [4], Results: Vata-anxiety (p ≤ 0.05), rumination (p ≤ 0.01); Pitta-mood (p ≤ 0.01), stress; Kapha-stress (p ≤ 0.01).",
    evidenceLevel: "DR",
    precautions: [
      "Association ≠ causation; no diagnosis or treatment claims.",
      "Distress escalation path: suggest professional care.",
    ],
    applicability: "Content adapts to the dominant vikriti dosha.",
  },
];

/**
 * Historical / ecosystem records kept for the references screen.
 * These are the sources the platform actually relies on.
 */
export const PLATFORM_REFERENCES: { id: string; citation: string; url: string; usedFor: string }[] = [
  { id: "1", usedFor: "Used for: how Prakriti assessment tools are standardised — basis for our questionnaire design.", citation: "Gupta A, Singh V, Chandra S, Garg R. Towards standardization of Prakriti Evaluation: A scoping review of modern assessment tools and their psychometric properties in Ayurvedic medicine. J Ayurveda Integr Med. 2025;16(4):101157.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12269270/" },
  { id: "2", usedFor: "Used for: constitution-linked cardiovascular responses — context for Pitta/Vata traits in results.", citation: "Tripathi PK, Patwardhan K, Singh G. The Basic Cardiovascular Responses to Postural Changes, Exercise, and Cold Pressor Test: Do They Vary in Accordance with the Dual Constitutional Types of Ayurveda? Evid Based Complement Alternat Med. 2011;2011:251850.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2952295/" },
  { id: "3", usedFor: "Used for: transparent-reporting standards the knowledge base and result screens follow.", citation: "Bhalerao S, Patwardhan K. Good reporting practices for Ayurveda-based research studies. (Read via PubMed Central PMC4910291.)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4910291/" },
  { id: "4", usedFor: "Used for: vikriti↔mood/stress associations quoted in recommendations.", citation: "Mills PJ, et al. The Self-Assessment Vikriti questionnaire and psychological states. (Read via PubMed Central PMC6822152.)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6822152/" },
  { id: "5", usedFor: "Used for: daily-routine (dinacharya) rules — wake time, oral care, oil massage, exercise, conduct.", citation: "Anagha S, Deole YS. Dinacharya: the daily regimen. Charak Samhita New Edition book chapter, Charak Samhita Research, Training and Skill Development Centre, 2021.", url: "https://www.carakasamhitaonline.com/" },
  { id: "6", usedFor: "Used for: seasonal (ritucharya) rules and the season term of the environment score.", citation: "Dhiman K, et al. Ritucharya critical narrative review, 2026. (Publisher-verified abstract only; full text inaccessible.)", url: "https://journalajmah.com/" },
  { id: "12", usedFor: "Used for: HRV reference values by age band (legacy display metric).", citation: "Shaffer F, Ginsberg JP. An Overview of Heart Rate Variability Metrics and Norms. Front Public Health. 2017;5:258.", url: "https://www.frontiersin.org/articles/10.3389/fpubh.2017.00258/full" },
  { id: "14", usedFor: "Used for: why sleep duration from wearables is trusted (validation evidence).", citation: "Sleep-wake detection validation of consumer wearables (report Ch. 8.1, [14]).", url: "https://pubmed.ncbi.nlm.nih.gov/" },
  { id: "19", usedFor: "Used for: steps/heart-rate/calorie accuracy context behind the health-data score.", citation: "Fuller D, et al. Reliability and validity of commercially available wearable devices for measuring steps, energy expenditure, and heart rate: systematic review. JMIR Mhealth Uhealth. 2020;8(9):e18694.", url: "https://www.jmir.org/2020/9/e18694/" },
  { id: "21", usedFor: "Used for: seasonal-biology background supporting the ritucharya emphasis.", citation: "Seasonally expressed human transcripts with hemisphere-inverted patterns (report Ch. 9.2, [21]).", url: "https://pubmed.ncbi.nlm.nih.gov/" },
];
