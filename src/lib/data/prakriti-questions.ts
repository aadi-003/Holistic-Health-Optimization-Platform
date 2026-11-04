/**
 * Holistic — Prakriti instrument pack (62 items).
 *
 * SOURCE OF TRUTH: the supplied questionnaire document "62_questions.pdf"
 * ("The self-assessment questionnaire to assess Prakriti", originally prepared
 * by Kishor Patwardhan and Rashmi Sharma; modified by Piyush Kumar Tripathi,
 * Kishor Patwardhan and Girish Singh, Institute of Medical Sciences, Banaras
 * Hindu University, Varanasi).
 *
 * VERIFICATION NOTES (documented discrepancies — nothing silently changed):
 * - Every item below carries the original wording, guna, scoring answer
 *   ("yes"/"no" as printed in the "Is your answer the following?" column) and
 *   the printed weight.
 * - The document prints per-dosha totals: Kapha 1440, Pitta 600, Vata 960.
 * - The itemised Pitta weights sum to 599 (7 x 17 = 119, 5 x 24 = 120,
 *   2 x 60 = 120, 2 x 120 = 240) while the printed total is 600. This is a
 *   rounding artefact of 120 points per guna split over 7 Ushna features
 *   (120/7 = 17.14 -> 17). Following the project accuracy rules, the
 *   DOCUMENTED maximum (600) is used for the percentage formula, exactly as
 *   printed in both the questionnaire and the research report
 *   ("maximum scores: Vata 960, Pitta 600, Kapha 1440"). The 599 sum is
 *   disclosed on the About & References screen.
 * - Duplicate items that appear in more than one dosha section in the source
 *   (e.g. "Do you think you have intense sexual desire?" in Kapha-4 and
 *   Pitta-5 with opposite scoring answers) are intentionally kept as separate
 *   items, exactly as printed.
 */

export type Dosha = "vata" | "pitta" | "kapha";

export interface PrakritiItem {
  /** Stable item id, e.g. "K1", "P1A", "V5C". */
  id: string;
  /** Printed serial inside its dosha section, e.g. "1", "3.A". */
  serial: string;
  dosha: Dosha;
  /** Guna (attribute) as printed in the source document. */
  guna: string;
  text: string;
  /** The answer that earns the weight, exactly as printed. */
  scoringAnswer: "yes" | "no";
  weight: number;
}

export const PRAKRITI_INSTRUMENT = {
  id: "prakriti_62_charaka_v1",
  language: "en",
  anchoredClassicalSource: "Caraka-samhita, Vimana-sthana 8.95 (guna-based item construction)",
  scoringModel: {
    type: "guna_proportional_absolute" as const,
    perGunaPoints: 120,
    doshaMax: { vata: 960, pitta: 600, kapha: 1440 } as Record<Dosha, number>,
  },
  classificationThresholds: {
    dualIfSecondaryGePctOfPrimary: 50,
    dualIfTertiaryLePctOfSecondary: 75,
  },
  /** Answer framing required by Gupta et al. (2025): lifelong traits, not current state. */
  framingInstruction:
    "Answer every question for your long-standing characteristics over your adult life, not for how you feel these days. Prakriti describes your baseline constitution, not your current state.",
} as const;

export const PRAKRITI_ITEMS: PrakritiItem[] = [
  // ---------------- KAPHA (printed total 1440) ----------------
  { id: "K1", serial: "1", dosha: "kapha", guna: "Snigdha", text: "Whether your skin remains oily throughout the year in comparison to others?", scoringAnswer: "yes", weight: 120 },
  { id: "K2", serial: "2", dosha: "kapha", guna: "Shlakshna", text: "Are your body-hairs & skin shiny, even when no oil or moisturizer is used?", scoringAnswer: "yes", weight: 120 },
  { id: "K3A", serial: "3.A", dosha: "kapha", guna: "Mridu", text: "Are you considered attractive among your friends?", scoringAnswer: "yes", weight: 40 },
  { id: "K3B", serial: "3.B", dosha: "kapha", guna: "Mridu", text: "Do even mild or trivial injuries on your body make you upset?", scoringAnswer: "yes", weight: 40 },
  { id: "K3C", serial: "3.C", dosha: "kapha", guna: "Mridu", text: "Among your family members, is your complexion considered fairer?", scoringAnswer: "yes", weight: 40 },
  { id: "K4", serial: "4", dosha: "kapha", guna: "Madhura", text: "Do you think you have intense sexual desire?", scoringAnswer: "yes", weight: 120 },
  { id: "K5A", serial: "5.A", dosha: "kapha", guna: "Saara", text: "Have you got well built muscles?", scoringAnswer: "yes", weight: 60 },
  { id: "K5B", serial: "5.B", dosha: "kapha", guna: "Saara", text: "Do you change your body posture frequently? (You cannot manage yourself in a stable posture for a long duration.)", scoringAnswer: "no", weight: 60 },
  { id: "K6", serial: "6", dosha: "kapha", guna: "Sandra", text: "Do you have a well-nourished & normally developed body? (You are neither malnourished nor obese.)", scoringAnswer: "yes", weight: 120 },
  { id: "K7A", serial: "7.A", dosha: "kapha", guna: "Manda", text: "Are you lazy and disinterested in activities like morning walk/ jogging, swimming or any type of outdoor games?", scoringAnswer: "yes", weight: 40 },
  { id: "K7B", serial: "7.B", dosha: "kapha", guna: "Manda", text: "Are you slow in consuming the food? (Even after all have left the dining hall, you are still consuming the same amount of food).", scoringAnswer: "yes", weight: 40 },
  { id: "K7C", serial: "7.C", dosha: "kapha", guna: "Manda", text: "When you go to morning walk or college or office, do you walk slowly in comparison to others?", scoringAnswer: "yes", weight: 40 },
  { id: "K8A", serial: "8.A", dosha: "kapha", guna: "Stimita", text: "If you are assigned any work, do you take some extra time to start it?", scoringAnswer: "yes", weight: 40 },
  { id: "K8B", serial: "8.B", dosha: "kapha", guna: "Stimita", text: "Do you get irritated easily? (For example, when you don't get breakfast on time in your hostel or when the power goes off while watching a cricket match or your favourite movie on television).", scoringAnswer: "no", weight: 40 },
  { id: "K8C", serial: "8.C", dosha: "kapha", guna: "Stimita", text: "Are you late to develop/suffer from symptoms after exposure to common causative factors? (For example, during seasonal changes, when your friends are easily caught up with flu etc., you are still healthy among them).", scoringAnswer: "yes", weight: 40 },
  { id: "K9", serial: "9", dosha: "kapha", guna: "Guru", text: "Does your gait (style of walking) change with respect to speed or manner frequently?", scoringAnswer: "no", weight: 120 },
  { id: "K10A", serial: "10.A", dosha: "kapha", guna: "Shita", text: "Do you feel hungry more frequently and do you consume more food in comparison to others?", scoringAnswer: "no", weight: 30 },
  { id: "K10B", serial: "10.B", dosha: "kapha", guna: "Shita", text: "Do you tolerate heat easily?", scoringAnswer: "yes", weight: 30 },
  { id: "K10C", serial: "10.C", dosha: "kapha", guna: "Shita", text: "Do you consume liquids in more quantity and frequency in comparison to others?", scoringAnswer: "no", weight: 30 },
  { id: "K10D", serial: "10.D", dosha: "kapha", guna: "Shita", text: "Do you perspire less in comparison to others?", scoringAnswer: "yes", weight: 30 },
  { id: "K11", serial: "11", dosha: "kapha", guna: "Picchila", text: "Are sounds produced frequently in your joints on movement?", scoringAnswer: "no", weight: 120 },
  { id: "K12A", serial: "12.A", dosha: "kapha", guna: "Achcha", text: "Have you got a good/ attractive complexion?", scoringAnswer: "yes", weight: 60 },
  { id: "K12B", serial: "12.B", dosha: "kapha", guna: "Achcha", text: "Have you got sweet & pleasant voice?", scoringAnswer: "yes", weight: 60 },

  // ---------------- PITTA (printed total 600; itemised sum 599 — see header note) ----------------
  { id: "P1A", serial: "1.A", dosha: "pitta", guna: "Ushna", text: "Are you more comfortable in winter than summer?", scoringAnswer: "yes", weight: 17 },
  { id: "P1B", serial: "1.B", dosha: "pitta", guna: "Ushna", text: "Among your family members, is your complexion considered fairer?", scoringAnswer: "yes", weight: 17 },
  { id: "P1C", serial: "1.C", dosha: "pitta", guna: "Ushna", text: "Does your temperature of oral cavity remain towards upper limit of normal range?", scoringAnswer: "yes", weight: 17 },
  { id: "P1D", serial: "1.D", dosha: "pitta", guna: "Ushna", text: "Do you have excessive black moles, Freckles etc on your skin? Or Have you noticed new appearance of black moles often on your skin?", scoringAnswer: "yes", weight: 17 },
  { id: "P1E", serial: "1.E", dosha: "pitta", guna: "Ushna", text: "Do you feel excessive hunger & thirst in comparison to others?", scoringAnswer: "yes", weight: 17 },
  { id: "P1F", serial: "1.F", dosha: "pitta", guna: "Ushna", text: "Have you experienced premature graying, wrinkling of skin & early baldness?", scoringAnswer: "yes", weight: 17 },
  { id: "P1G", serial: "1.G", dosha: "pitta", guna: "Ushna", text: "Do you have soft, scanty, brown hair on your face, body & head?", scoringAnswer: "yes", weight: 17 },
  { id: "P2A", serial: "2.A", dosha: "pitta", guna: "Tikshna", text: "Do you involve yourself in risky & heroic activities requiring physical strength often?", scoringAnswer: "yes", weight: 24 },
  { id: "P2B", serial: "2.B", dosha: "pitta", guna: "Tikshna", text: "Do you have ability to digest large quantities of food easily?", scoringAnswer: "yes", weight: 24 },
  { id: "P2C", serial: "2.C", dosha: "pitta", guna: "Tikshna", text: "Do you take large quantities of food & drink in comparison to others?", scoringAnswer: "yes", weight: 24 },
  { id: "P2D", serial: "2.D", dosha: "pitta", guna: "Tikshna", text: "Do you get easily irritated for small/negligible problem in day-to-day life?", scoringAnswer: "yes", weight: 24 },
  { id: "P2E", serial: "2.E", dosha: "pitta", guna: "Tikshna", text: "Do you consume food more frequently than others? (5-6 times/day)", scoringAnswer: "yes", weight: 24 },
  { id: "P3A", serial: "3.A", dosha: "pitta", guna: "Drava", text: "Do you have soft & loose muscle bulk especially around the joints?", scoringAnswer: "yes", weight: 60 },
  { id: "P3B", serial: "3.B", dosha: "pitta", guna: "Drava", text: "In comparison to others do you pass urine & stool in large quantities and do you perspire more?", scoringAnswer: "yes", weight: 60 },
  { id: "P4", serial: "4", dosha: "pitta", guna: "Visra", text: "Do your friends complain of bad smell being emitted from your body & mouth?", scoringAnswer: "yes", weight: 120 },
  { id: "P5", serial: "5", dosha: "pitta", guna: "Amla+Katu", text: "Do you think you have intense sexual desire?", scoringAnswer: "no", weight: 120 },

  // ---------------- VATA (printed total 960) ----------------
  { id: "V1A", serial: "1.A", dosha: "vata", guna: "Ruksha", text: "Whether your skin remains dry throughout the year in comparison to others?", scoringAnswer: "yes", weight: 30 },
  { id: "V1B", serial: "1.B", dosha: "vata", guna: "Ruksha", text: "Is your body undernourished/ emaciated?", scoringAnswer: "yes", weight: 30 },
  { id: "V1C", serial: "1.C", dosha: "vata", guna: "Ruksha", text: "Have you got rough, low, broken or obstructed voice?", scoringAnswer: "yes", weight: 30 },
  { id: "V1D", serial: "1.D", dosha: "vata", guna: "Ruksha", text: "Does Your sleep last less than 6 hours per day? Or Can your sleep be disturbed easily?", scoringAnswer: "yes", weight: 30 },
  { id: "V2A", serial: "2.A", dosha: "vata", guna: "Laghu", text: "Do you change walking speed & style from time to time?", scoringAnswer: "yes", weight: 40 },
  { id: "V2B", serial: "2.B", dosha: "vata", guna: "Laghu", text: "Do you keep changing your food habits from time to time?", scoringAnswer: "yes", weight: 40 },
  { id: "V2C", serial: "2.C", dosha: "vata", guna: "Laghu", text: "Do you keep changing your walking / jogging habit from time to time?", scoringAnswer: "yes", weight: 40 },
  { id: "V3", serial: "3", dosha: "vata", guna: "Chala", text: "Do you keep your joints, eyes, eyebrows, jaw, lips, tongue, head, Shoulder, hands & feet frequently moving?", scoringAnswer: "yes", weight: 120 },
  { id: "V4A", serial: "4.A", dosha: "vata", guna: "Bahu", text: "Are you considered a talkative among your friends?", scoringAnswer: "yes", weight: 60 },
  { id: "V4B", serial: "4.B", dosha: "vata", guna: "Bahu", text: "Do you have prominent veins & tendons all over the body?", scoringAnswer: "yes", weight: 60 },
  { id: "V5A", serial: "5.A", dosha: "vata", guna: "Shighra", text: "Do you generally start the work assigned to you immediately?", scoringAnswer: "yes", weight: 15 },
  { id: "V5B", serial: "5.B", dosha: "vata", guna: "Shighra", text: "Do you get irritated easily? (E.g., when you do not get breakfast on time in your hostel or when the power goes off while watching a cricket match or your favourite movie over television)", scoringAnswer: "yes", weight: 15 },
  { id: "V5C", serial: "5.C", dosha: "vata", guna: "Shighra", text: "Do you get frightened easily?", scoringAnswer: "yes", weight: 15 },
  { id: "V5D", serial: "5.D", dosha: "vata", guna: "Shighra", text: "Do you make friends easily & also lose them easily?", scoringAnswer: "yes", weight: 15 },
  { id: "V5E", serial: "5.E", dosha: "vata", guna: "Shighra", text: "Do you generally learn things quickly? Or Do you have a good grasping power?", scoringAnswer: "yes", weight: 15 },
  { id: "V5F", serial: "5.F", dosha: "vata", guna: "Shighra", text: "Is your long term memory weak? (E.g., you can remember only few names of your friends at your primary school).", scoringAnswer: "yes", weight: 15 },
  { id: "V5G", serial: "5.G", dosha: "vata", guna: "Shighra", text: "Are you more comfortable in summer? Or Do you prefer hot/warm drinks over cold drinks?", scoringAnswer: "yes", weight: 15 },
  { id: "V5H", serial: "5.H", dosha: "vata", guna: "Shighra", text: "Do you generally develop symptoms immediately after exposure to common causative factors? (You are easily caught by diseases like flu, allergy during seasonal changes).", scoringAnswer: "yes", weight: 15 },
  { id: "V6A", serial: "6.A", dosha: "vata", guna: "Shita", text: "Do you shiver in winter season more than your friends?", scoringAnswer: "yes", weight: 60 },
  { id: "V6B", serial: "6.B", dosha: "vata", guna: "Shita", text: "Do you often feel stiffness in your body after exercise, travelling?", scoringAnswer: "yes", weight: 60 },
  { id: "V7", serial: "7", dosha: "vata", guna: "Parusha", text: "Are your nails, teeth, hands, feet and hairs on your body and face rough?", scoringAnswer: "yes", weight: 120 },
  { id: "V8A", serial: "8.A", dosha: "vata", guna: "Vishada", text: "Do you have cracks on the body especially on the heels?", scoringAnswer: "yes", weight: 60 },
  { id: "V8B", serial: "8.B", dosha: "vata", guna: "Vishada", text: "Are some crackling sounds produced in your joints during movements?", scoringAnswer: "yes", weight: 60 },
];
