"use client";

import { create } from "zustand";

export type View =
  | "dashboard"
  | "prakriti-assessment"
  | "prakriti-result"
  | "vikriti-assessment"
  | "vikriti-result"
  | "wearables"
  | "manual-entry"
  | "environment"
  | "recommendations"
  | "history"
  | "profile"
  | "settings"
  | "about";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Profile {
  age: number | null;
  gender: string | null;
  city: string | null;
  heightCm: number | null;
  weightKg: number | null;
  dietPreference: string | null;
  wakeTime: string | null;
  bedTime: string | null;
  onboardedAt: string | null;
}

interface AppState {
  booted: boolean;
  user: SessionUser | null;
  profile: Profile | null;
  view: View;
  setView: (v: View) => void;
  setBooted: (b: boolean) => void;
  setSession: (user: SessionUser | null, profile: Profile | null) => void;
}

export const useApp = create<AppState>((set) => ({
  booted: false,
  user: null,
  profile: null,
  view: "dashboard",
  setView: (view) => set({ view }),
  setBooted: (booted) => set({ booted }),
  setSession: (user, profile) => set({ user, profile }),
}));

/** Greeting by local time, like the reference design. */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const DOSHA_COLORS = {
  vata: "#0e9bb5",
  pitta: "#e0912f",
  kapha: "#4f9d5f",
} as const;

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
