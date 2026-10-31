"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, post } from "@/lib/client-api";
import { useApp, type SessionUser, type Profile } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const setSession = useApp((s) => s.setSession);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        // Signup now starts the session server-side and returns a bearer
        // token (persisted automatically by the api helper) — no follow-up
        // login round-trip needed.
        const { user } = await post<{ user: SessionUser }>("/api/auth/signup", { name, email, password });
        setSession(user, null);
      } else {
        const { user } = await post<{ user: SessionUser }>("/api/auth/login", { email, password });
        const me = await api<{ profile?: Profile | null }>("/api/auth/me");
        setSession(user, me.profile ?? null);
      }
      toast({ title: mode === "signup" ? "Welcome to Holistic" : "Welcome back" });
    } catch (err) {
      toast({ title: "Could not continue", description: err instanceof Error ? err.message : "Unexpected error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden lg:flex lg:w-[46%] flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-black/10" aria-hidden />
        <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <LeafMark className="h-7 w-7" />
          Holistic
        </div>
        <div className="relative max-w-md space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Know your nature.
            <br />
            Support your balance.
          </h1>
          <ul className="space-y-2.5 text-sm text-primary-foreground/90">
            {[
              "Prakriti — your baseline constitution",
              "Vikriti — your current state",
              "Google Fit, smartwatch and environment context",
              "Daily Ayurvedic routine and diet suggestions",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground/70" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <LeafMark className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Holistic</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Log in to your account" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "login"
              ? "Continue your assessments and history."
              : "Email and password only."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "signup" && (
                  <span className="text-xs text-muted-foreground">8+ chars, a letter and a number</span>
                )}
              </div>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New to Holistic?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M27 5C27 5 25.5 15.5 18.5 20.5C13.2 24.2 7 24 7 24C7 24 7.5 16 13 11.5C18.5 7 27 5 27 5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M5 27C7 21 11 15 19 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
