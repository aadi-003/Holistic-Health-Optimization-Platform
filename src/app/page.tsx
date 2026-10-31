"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { api } from "@/lib/client-api";
import AuthScreen from "@/components/screens/AuthScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import AppShell from "@/components/AppShell";
import { Spinner } from "@/components/holistic/shared";

/**
 * Holistic — single-page application root.
 *
 * Screen routing is client-side state (the preview environment exposes this
 * page at "/"); all data flows through the /api route handlers with
 * httpOnly-cookie sessions and per-user data isolation.
 */
export default function Page() {
  const { booted, user, profile, setSession, setBooted } = useApp();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ user: { id: string; email: string; name: string | null } | null; profile: unknown }>("/api/auth/me")
      .then((d) => {
        setSession(
          d.user,
          d.profile ? (d.profile as { age: number | null; gender: string | null; city: string | null; heightCm: number | null; weightKg: number | null; dietPreference: string | null; wakeTime: string | null; bedTime: string | null; onboardedAt: string | null }) : null
        );
        setBooted(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Could not reach the server");
        setBooted(true);
      });
  }, [setSession, setBooted]);

  if (!booted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Starting Holistic…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-xl border bg-card p-6 text-center">
          <h1 className="font-semibold">Connection problem</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  if (!profile?.onboardedAt) return <OnboardingScreen />;
  return <AppShell />;
}
