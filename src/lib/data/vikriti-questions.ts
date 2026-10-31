/**
 * Holistic — Vikriti instrument pack (34 items).
 *
 * SOURCE OF TRUTH: the supplied document "Self-Assessment Vikriti
 * Questionnaire" ("Clinical Questionnaire for Vikriti Assessment,
 * Serial Nos. 1-34").
 *
 * The source documents:
 * - Framing: "Active disturbance over past 2-4 weeks" for every item.
 * - Three dosha sections: Kapha Vikriti (Q1-11), Pitta Vikriti (Q12-21),
 *   Vata Vikriti (Q22-34, printed in Part A Q22-25 and Part B Q26-34).
 * - Response indicator: "Yes Present" — i.e. each item is answered
 *   Yes (present) / No (not present).
 * - The source provides NO numerical scoring formula.
 *
 * SCORING STATUS: experimental (see src/lib/engine/vikriti-engine.ts).
 * The binary scoring implemented here is a platform design proposal,
 * clearly labelled in the UI; it is NOT the 60-item Mills et al. (2019)
 * 5/3/1 instrument and carries no clinical validation.
 */

export type Dosha = "vata" | "pitta" | "kapha";

export interface VikritiItem {
  id: string; // "VK1".."VK34"
  /** Printed serial number in the source (1-34). */
  serial: number;
  dosha: Dosha;
  /** Short label printed before the question text in the source. */
  title: string;
  text: string;
  section: string;
}

export const VIKRITI_INSTRUMENT = {
  id: "vikriti_34_v1",
  language: "en",
  framingInstruction:
    "These questions ask about disturbances active over the past 2-4 weeks. Answer Yes only if the sign has actually been present in this window.",
  sectionHeaders: {
    kapha: "Kapha Vikriti — Congestion, Heaviness & Hypoactivity",
    pitta: "Pitta Vikriti — Heat, Acidity & Tissue Irritation",
    vata: "Vata Vikriti — Dryness, Irregularity & Nervous Instability",
  } as Record<Dosha, string>,
  /** Maxima used by the platform's experimental scoring: one point per "Yes". */
  experimentalMax: { vata: 13, pitta: 10, kapha: 11 } as Record<Dosha, number>,
} as const;

export const VIKRITI_ITEMS: VikritiItem[] = [
  // ---------------- KAPHA VIKRITI (Q1-11) ----------------
  { id: "VK1", serial: 1, dosha: "kapha", title: "Excess Saliva & Sweet Taste", text: "Do you notice extra saliva building up, a thick mucus coating in your throat, or a sweet taste in your mouth?", section: "kapha" },
  { id: "VK2", serial: 2, dosha: "kapha", title: "Excessive Oily Skin & Scalp", text: "Has your face or scalp suddenly become greasy, or have you noticed excess oil and earwax?", section: "kapha" },
  { id: "VK3", serial: 3, dosha: "kapha", title: "Heaviness in Body & Head", text: "Does your head, chest, arms, or legs feel heavily weighed down, as if wrapped in a wet blanket?", section: "kapha" },
  { id: "VK4", serial: 4, dosha: "kapha", title: "Puffiness & Water Retention", text: "Do you wake up with puffy eyelids, swollen ankles/feet, or notice sudden fluid retention?", section: "kapha" },
  { id: "VK5", serial: 5, dosha: "kapha", title: "Lethargy & Low Drive", text: "Do you feel a strong lack of motivation or drive to do physical tasks, feeling sluggish even when well-rested?", section: "kapha" },
  { id: "VK6", serial: 6, dosha: "kapha", title: "Sluggish Digestion", text: "Does your food take 6 to 8+ hours to digest, leaving a heavy feeling and lingering burps hours after meals?", section: "kapha" },
  { id: "VK7", serial: 7, dosha: "kapha", title: "Loss of Appetite", text: "Have you lost your natural hunger, or do you feel mild aversion/nausea when seeing or smelling food?", section: "kapha" },
  { id: "VK8", serial: 8, dosha: "kapha", title: "Oversleeping & Fatigue", text: "Are you sleeping 9 to 11+ hours continuously but still waking up unrefreshed, heavy, and exhausted?", section: "kapha" },
  { id: "VK9", serial: 9, dosha: "kapha", title: "Daytime Drowsiness", text: "Do you find yourself nodding off, feeling cloudy, or drifting into an involuntary daze during daytime hours?", section: "kapha" },
  { id: "VK10", serial: 10, dosha: "kapha", title: "Chest & Sinus Phlegm", text: "Do you experience thick clear/white mucus cough, post-nasal drip, or bronchial congestion?", section: "kapha" },
  { id: "VK11", serial: 11, dosha: "kapha", title: "Cold, Swollen Joints", text: "Do your joints feel cold, puffy, and stiff to bend without any sensation of heat or burning?", section: "kapha" },

  // ---------------- PITTA VIKRITI (Q12-21) ----------------
  { id: "VK12", serial: 12, dosha: "pitta", title: "Internal & Body Burning", text: "Do you experience heartburn, stomach burning, or a hot feeling in your palms, soles, or eyes?", section: "pitta" },
  { id: "VK13", serial: 13, dosha: "pitta", title: "Red Rashes & Skin Flare-ups", text: "Have you had sudden red rashes, hives, inflamed acne, or burning sensitive skin patches?", section: "pitta" },
  { id: "VK14", serial: 14, dosha: "pitta", title: "Hot / Dark Yellow Urine", text: "Is your urine deep yellow or concentrated, accompanied by a stinging or burning sensation?", section: "pitta" },
  { id: "VK15", serial: 15, dosha: "pitta", title: "Sharp, Urgent Hunger", text: "Do you feel burning hunger within 2 hours of eating, feeling shaky or dizzy if not fed immediately?", section: "pitta" },
  { id: "VK16", serial: 16, dosha: "pitta", title: "Acid Reflux & Sour Burps", text: "Do you get acid regurgitation rising into your throat with a sour, burning fluid in your mouth?", section: "pitta" },
  { id: "VK17", serial: 17, dosha: "pitta", title: "Irritability & Outbursts", text: "Have you been unusually impatient, frustrated, angry, or prone to sudden verbal flare-ups?", section: "pitta" },
  { id: "VK18", serial: 18, dosha: "pitta", title: "Hair Shedding & Scalp Heat", text: "Have you noticed sudden accelerated hair loss, a burning tender scalp, or rapid graying?", section: "pitta" },
  { id: "VK19", serial: 19, dosha: "pitta", title: "Profuse Sweating with Odor", text: "Do you sweat heavily with minimal exertion, with a strong, sour odor that stains clothing?", section: "pitta" },
  { id: "VK20", serial: 20, dosha: "pitta", title: "Loose, Burning Bowels", text: "Are your bowel movements frequent, loose or yellowish, accompanied by urgency or rectal burning?", section: "pitta" },
  { id: "VK21", serial: 21, dosha: "pitta", title: "Mouth Ulcers & Spongy Gums", text: "Have you experienced painful canker sores, bleeding gums, or occasional nose spotting?", section: "pitta" },

  // ---------------- VATA VIKRITI (Q22-34; source Parts A + B) ----------------
  { id: "VK22", serial: 22, dosha: "vata", title: "Severe Skin Dryness & Cracks", text: "Is your skin excessively rough or flaking, with deep cracked heels and lips that lotions do not heal?", section: "vata" },
  { id: "VK23", serial: 23, dosha: "vata", title: "Muscle & Weight Depletion", text: "Have you noticed a rapid loss of muscle fullness, hollowed cheeks, or unintended weight loss?", section: "vata" },
  { id: "VK24", serial: 24, dosha: "vata", title: "Hoarse or Weak Voice", text: "Does your voice sound dry, obstructed, or raspy when you speak?", section: "vata" },
  { id: "VK25", serial: 25, dosha: "vata", title: "2-4 AM Waking with Racing Mind", text: "Do you wake up startled between 2:00 AM and 4:00 AM unable to fall back asleep due to racing thoughts?", section: "vata" },
  { id: "VK26", serial: 26, dosha: "vata", title: "Twitches & Fine Tremors", text: "Do you experience twitching eyelids or lips, fine finger tremors, or sudden limb jerks?", section: "vata" },
  { id: "VK27", serial: 27, dosha: "vata", title: "Abdominal Gas & Bloating", text: "Does your belly swell tight with audible gurgling and colic that is relieved by passing gas?", section: "vata" },
  { id: "VK28", serial: 28, dosha: "vata", title: "Erratic Appetite", text: "Does your hunger fluctuate unpredictably - craving food one day, but having zero appetite the next?", section: "vata" },
  { id: "VK29", serial: 29, dosha: "vata", title: "Restlessness & Rapid Speech", text: "Do you feel unable to sit still, talking very fast, pacing, or hopping erratically between tasks?", section: "vata" },
  { id: "VK30", serial: 30, dosha: "vata", title: "Anxiety & Sudden Spikes of Panic", text: "Do you experience sudden unprompted nervousness, a racing pulse, or free-floating dread?", section: "vata" },
  { id: "VK31", serial: 31, dosha: "vata", title: "Wandering, Sharp Nerve/Joint Pains", text: "Do you get pricking, shifting aches that travel from one joint or nerve area to another?", section: "vata" },
  { id: "VK32", serial: 32, dosha: "vata", title: "Cold Sensitivity & Morning Stiffness", text: "Do you shiver easily at slight temperature drops and wake with a locked, stiff back or limbs?", section: "vata" },
  { id: "VK33", serial: 33, dosha: "vata", title: "Dry, Pellet-like Constipation", text: "Are your stools hard, dry, and evacuated every 2-3 days with severe straining?", section: "vata" },
  { id: "VK34", serial: 34, dosha: "vata", title: "Popping & Cracking Joints", text: "Do your knees, neck, or other joints make loud cracking, clicking, or grating sounds when moving?", section: "vata" },
];
