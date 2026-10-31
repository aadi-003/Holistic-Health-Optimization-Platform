"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { put } from "@/lib/client-api";
import { useApp, type Profile } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

/**
 * Profile setup — collects only necessary information (project brief §6):
 * name/email are already stored; age, optional gender, city, height, weight,
 * dietary preference and routine times. All fields except age are optional.
 */
export default function OnboardingScreen() {
  const user = useApp((s) => s.user);
  const setSession = useApp((s) => s.setSession);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<string>("");
  const [city, setCity] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [dietPreference, setDietPreference] = useState<string>("");
  const [wakeTime, setWakeTime] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { profile } = await put<{ profile: Profile }>("/api/profile", {
        name: user?.name,
        age: age ? Number(age) : null,
        gender: gender || null,
        city: city || null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        dietPreference: dietPreference || null,
        wakeTime: wakeTime || null,
        bedTime: bedTime || null,
      });
      setSession(user, profile);
      toast({ title: "Profile saved", description: "Welcome to Holistic." });
    } catch (err) {
      toast({ title: "Could not save profile", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Profile setup · 1 of 1</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Tell us a little about you</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Age is used for HRV reference averages and seasonal logic; the rest is optional and can be
            edited later. Your data stays in your account — every record is user-isolated.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input id="age" type="number" min={10} max={120} required value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 24" />
            </div>
            <div className="space-y-2">
              <Label>Gender (optional)</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Prefer not to say" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="na">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City (optional)</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Varanasi" />
            </div>
            <div className="space-y-2">
              <Label>Diet preference (optional)</Label>
              <Select value={dietPreference} onValueChange={setDietPreference}>
                <SelectTrigger><SelectValue placeholder="No preference" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-vegetarian</SelectItem>
                  <SelectItem value="no-preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height, cm (optional)</Label>
              <Input id="height" type="number" min={80} max={250} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 170" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight, kg (optional)</Label>
              <Input id="weight" type="number" min={20} max={300} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 62" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wake">Usual wake time (optional)</Label>
              <Input id="wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bed">Usual bedtime (optional)</Label>
              <Input id="bed" type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save and continue"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
