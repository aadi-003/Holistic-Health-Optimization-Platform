"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel } from "@/components/holistic/shared";
import { useApp, type Profile } from "@/lib/store";
import { put } from "@/lib/client-api";
import { toast } from "@/hooks/use-toast";

export default function ProfileScreen() {
  const user = useApp((s) => s.user);
  const profile = useApp((s) => s.profile);
  const setSession = useApp((s) => s.setSession);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    age: profile?.age?.toString() ?? "",
    gender: profile?.gender ?? "",
    city: profile?.city ?? "",
    heightCm: profile?.heightCm?.toString() ?? "",
    weightKg: profile?.weightKg?.toString() ?? "",
    dietPreference: profile?.dietPreference ?? "",
    wakeTime: profile?.wakeTime ?? "",
    bedTime: profile?.bedTime ?? "",
  });
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { profile: p } = await put<{ profile: Profile }>("/api/profile", {
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        city: form.city || null,
        heightCm: form.heightCm ? Number(form.heightCm) : null,
        weightKg: form.weightKg ? Number(form.weightKg) : null,
        dietPreference: form.dietPreference || null,
        wakeTime: form.wakeTime || null,
        bedTime: form.bedTime || null,
      });
      setSession(user, p);
      toast({ title: "Profile updated" });
    } catch (err) {
      toast({ title: "Could not update profile", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  const initial = (user?.name ?? "U").charAt(0).toUpperCase();

  return (
    <div className="animate-fade-up mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>

      <Panel>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            {initial}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name ?? "Unnamed user"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </Panel>

      <form onSubmit={save}>
        <Panel className="p-0">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Basic information</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Only what the platform actually uses. Everything is optional except age.</p>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pname">Name</Label>
              <Input id="pname" value={form.name} onChange={set("name")} required minLength={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page">Age</Label>
              <Input id="page" type="number" min={10} max={120} value={form.age} onChange={set("age")} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
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
              <Label htmlFor="pcity">City</Label>
              <Input id="pcity" value={form.city} onChange={set("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pheight">Height (cm)</Label>
              <Input id="pheight" type="number" min={80} max={250} value={form.heightCm} onChange={set("heightCm")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pweight">Weight (kg)</Label>
              <Input id="pweight" type="number" min={20} max={300} value={form.weightKg} onChange={set("weightKg")} />
            </div>
            <div className="space-y-2">
              <Label>Diet preference</Label>
              <Select value={form.dietPreference} onValueChange={(v) => setForm((f) => ({ ...f, dietPreference: v }))}>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pwake">Wake time</Label>
                <Input id="pwake" type="time" value={form.wakeTime} onChange={set("wakeTime")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pbed">Bedtime</Label>
                <Input id="pbed" type="time" value={form.bedTime} onChange={set("bedTime")} />
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t px-6 py-4">
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
          </div>
        </Panel>
      </form>
    </div>
  );
}
