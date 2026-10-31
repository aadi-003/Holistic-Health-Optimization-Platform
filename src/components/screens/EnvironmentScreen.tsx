"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel, Spinner } from "@/components/holistic/shared";
import { api, post } from "@/lib/client-api";
import { fmtDateTime } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { MapPin, Building2, PenLine, RefreshCw } from "lucide-react";

interface Snapshot {
  id: string;
  source: string;
  city: string | null;
  temperatureC: number | null;
  humidity: number | null;
  condition: string | null;
  season: string;
  recordedAt: string;
}

type Mode = "location" | "city" | "manual";

export default function EnvironmentScreen() {
  const [latest, setLatest] = useState<Snapshot | null>(null);
  const [mode, setMode] = useState<Mode>("city");
  const [city, setCity] = useState("");
  const [temperatureC, setTemperatureC] = useState("");
  const [humidity, setHumidity] = useState("");
  const [condition, setCondition] = useState("");
  const [hemisphere, setHemisphere] = useState("north");
  const [busy, setBusy] = useState(false);
  const [geoBusy, setGeoBusy] = useState(false);

  async function load() {
    const d = await api<{ snapshots: Snapshot[] }>("/api/history");
    setLatest(d.envSnapshots[0] ?? null);
  }

  useEffect(() => {
    load().catch(() => setLatest(null));
  }, []);

  async function fetchByLocation() {
    setGeoBusy(true);
    try {
      if (!("geolocation" in navigator)) throw new Error("Geolocation is not supported by this browser.");
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { snapshot } = await api<{ snapshot: Snapshot }>(
        `/api/environment?lat=${position.coords.latitude}&lon=${position.longitude}&label=My location`
      );
      setLatest(snapshot);
      toast({ title: "Weather updated", description: "Source: browser location." });
    } catch (err) {
      toast({
        title: "Location fetch failed",
        description: `${err instanceof Error ? err.message : ""} Manual entry remains available.`,
        variant: "destructive",
      });
    } finally {
      setGeoBusy(false);
    }
  }

  async function fetchByCity(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) {
      toast({ title: "Enter a city name", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const { snapshot } = await api<{ snapshot: Snapshot }>(`/api/environment?city=${encodeURIComponent(city.trim())}`);
      setLatest(snapshot);
      toast({ title: "Weather updated", description: `Source: ${snapshot.city}.` });
    } catch (err) {
      toast({ title: "City fetch failed", description: `${err instanceof Error ? err.message : ""} Manual entry remains available.`, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { snapshot } = await post<{ snapshot: Snapshot }>("/api/environment", {
        temperatureC: temperatureC === "" ? null : Number(temperatureC),
        humidity: humidity === "" ? null : Number(humidity),
        condition: condition || null,
        hemisphere,
        city: city.trim() || null,
      });
      setLatest(snapshot);
      toast({ title: "Manual conditions saved" });
    } catch (err) {
      toast({ title: "Could not save", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-fade-up mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Environment</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Weather context personalises seasonal suggestions.
        </p>
      </div>

      {latest && (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {latest.source === "location" ? <MapPin className="h-4 w-4" /> : latest.source === "city" ? <Building2 className="h-4 w-4" /> : <PenLine className="h-4 w-4" />}
                Current context · source: <strong className="text-foreground">{latest.source}</strong>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {latest.city ?? "Manual entry"}
                {latest.temperatureC != null && <span className="ml-3 text-lg font-normal text-muted-foreground">{Math.round(latest.temperatureC)}°C</span>}
                {latest.humidity != null && <span className="ml-3 text-lg font-normal text-muted-foreground">{Math.round(latest.humidity)}% RH</span>}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {latest.condition ?? "Conditions entered manually"} · season: <strong className="text-foreground">{latest.season}</strong> · updated {fmtDateTime(latest.recordedAt)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchByLocation} disabled={geoBusy}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${geoBusy ? "animate-spin" : ""}`} /> Refresh via location
            </Button>
          </div>
        </Panel>
      )}

      <div className="flex gap-1.5 rounded-lg border bg-muted/50 p-1">
        {(
          [
            { id: "location", label: "Location-based", icon: MapPin },
            { id: "city", label: "City-based", icon: Building2 },
            { id: "manual", label: "Manual", icon: PenLine },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === t.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {mode === "location" && (
        <Panel>
          <h2 className="font-semibold">Use my location</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The browser asks for permission, then fetches current weather for your coordinates.
          </p>
          <Button className="mt-4" onClick={fetchByLocation} disabled={geoBusy}>
            {geoBusy ? "Requesting…" : "Fetch weather for my location"}
          </Button>
        </Panel>
      )}

      {mode === "city" && (
        <Panel>
          <h2 className="font-semibold">Search a city</h2>
          <form onSubmit={fetchByCity} className="mt-4 flex gap-2.5">
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Varanasi, Pune, Berlin" aria-label="City name" />
            <Button type="submit" disabled={busy}>{busy ? "Searching…" : "Fetch"}</Button>
          </form>
        </Panel>
      )}

      {mode === "manual" && (
        <Panel>
          <h2 className="font-semibold">Enter conditions manually</h2>
          <form onSubmit={submitManual} className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="temp">Temperature °C (optional)</Label>
              <Input id="temp" type="number" step="any" value={temperatureC} onChange={(e) => setTemperatureC(e.target.value)} placeholder="e.g. 31" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hum">Humidity % (optional)</Label>
              <Input id="hum" type="number" min={0} max={100} value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="e.g. 72" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cond">Conditions (optional)</Label>
              <Input id="cond" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g. humid, overcast" />
            </div>
            <div className="space-y-2">
              <Label>Hemisphere (for season)</Label>
              <Select value={hemisphere} onValueChange={setHemisphere}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">Northern</SelectItem>
                  <SelectItem value="south">Southern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="mcity">City label (optional)</Label>
              <Input id="mcity" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. My city" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save conditions"}</Button>
            </div>
          </form>
        </Panel>
      )}

      {!latest && <Spinner label="Checking for saved environment context…" />}
    </div>
  );
}
