import { db } from "@/lib/db";
import { requireUser, errorJson, json } from "@/lib/api-helpers";
import { METRICS } from "@/lib/engine/reference-values";

/**
 * Simulation mode — CLEARLY LABELLED DEMO DATA.
 *
 * Per the project brief: when no real Android/Health Connect device is
 * available during development, the app ships a clearly labelled simulation
 * mode so the full pipeline (combined model, recommendations, history) can be
 * exercised end-to-end. Every simulated reading is stored with provenance
 * "simulated" and is visually labelled in the UI. See
 * docs/ANDROID_INTEGRATION.md for the real Health Connect integration path.
 */
export async function POST() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const profile = await db.profile.findUnique({ where: { userId: guard.user.id } });
  const age = profile?.age ?? 28;

  // Gentle per-user randomness so simulations differ but stay realistic.
  const rhrBase = 62 + ((age * 7) % 9);
  const hrvBase = age <= 25 ? 55 : age <= 35 ? 45 : age <= 45 ? 38 : 32;

  const now = new Date();
  const rows: {
    userId: string;
    metric: string;
    value: number;
    unit: string;
    provenance: string;
    source: string;
    recordedAt: Date;
  }[] = [];

  for (let d = 6; d >= 0; d--) {
    const day = new Date(now.getTime() - d * 24 * 3600 * 1000);
    const jitter = (seed: number) => Math.sin((now.getDate() + d) * seed) * 0.5 + 0.5; // 0..1

    rows.push(
      {
        userId: guard.user.id,
        metric: "sleep_duration",
        value: Math.round((6.4 + jitter(1.7) * 2.1) * 10) / 10,
        unit: METRICS.sleep_duration.unit,
        provenance: "simulated",
        source: "simulation_mode",
        recordedAt: new Date(day.setHours(7, 0, 0, 0)),
      },
      {
        userId: guard.user.id,
        metric: "resting_heart_rate",
        value: Math.round(rhrBase + jitter(2.3) * 6),
        unit: METRICS.resting_heart_rate.unit,
        provenance: "simulated",
        source: "simulation_mode",
        recordedAt: new Date(day.setHours(8, 0, 0, 0)),
      },
      {
        userId: guard.user.id,
        metric: "hrv_rmssd",
        value: Math.round(hrvBase + jitter(3.1) * 14),
        unit: METRICS.hrv_rmssd.unit,
        provenance: "simulated",
        source: "simulation_mode",
        recordedAt: new Date(day.setHours(8, 5, 0, 0)),
      },
      {
        userId: guard.user.id,
        metric: "steps",
        value: Math.round(4200 + jitter(4.9) * 6500),
        unit: METRICS.steps.unit,
        provenance: "simulated",
        source: "simulation_mode",
        recordedAt: new Date(day.setHours(21, 0, 0, 0)),
      }
    );
  }

  await db.healthReading.createMany({ data: rows });

  return json({ created: rows.length, note: "Simulated demo readings stored with provenance 'simulated'. They are labelled everywhere in the UI and can be deleted from Health Data." }, 201);
}

export async function DELETE() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const deleted = await db.healthReading.deleteMany({ where: { userId: guard.user.id, provenance: "simulated" } });
  return json({ deleted: deleted.count });
}
