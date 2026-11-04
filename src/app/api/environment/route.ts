import { db } from "@/lib/db";
import { requireUser, errorJson, json, safeJson } from "@/lib/api-helpers";
import { computeSeason } from "@/lib/engine/seasonal";
import { climateNormal, genericClimate, lookupCity, nearestCity } from "@/lib/data/city-climate";

/**
 * Environment endpoint.
 *
 * Weather comes from Open-Meteo (free, keyless); when its quota or network
 * fails we fall back to wttr.in (also free and keyless). If both providers
 * are unreachable we record the city's TYPICAL climate (built-in monthly
 * normals, condition = "typical climate") so the app keeps working and the
 * user can always see which numbers were used. Manual entry always works too.
 */
const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

interface GeocodeResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

async function geocodeCity(city: string): Promise<GeocodeResult | null> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { results?: GeocodeResult[] };
  return data.results?.[0] ?? null;
}

async function fetchWeather(lat: number, lon: number) {
  // Primary: Open-Meteo.
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        current?: { temperature_2m?: number; relative_humidity_2m?: number; weather_code?: number };
      };
      if (data.current) {
        return {
          temperatureC: data.current.temperature_2m ?? null,
          humidity: data.current.relative_humidity_2m ?? null,
          condition: data.current.weather_code != null ? (WEATHER_CODES[data.current.weather_code] ?? "Unknown") : null,
        };
      }
    }
  } catch {
    // Fall through to the backup provider.
  }
  // Backup: wttr.in (JSON format).
  try {
    const res = await fetch(`https://wttr.in/${lat},${lon}?format=j1`, {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "holistic-prototype" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current_condition?: { temp_C?: string; humidity?: string; weatherDesc?: { value?: string }[] }[];
    };
    const cur = data.current_condition?.[0];
    if (!cur) return null;
    return {
      temperatureC: cur.temp_C != null ? Number(cur.temp_C) : null,
      humidity: cur.humidity != null ? Number(cur.humidity) : null,
      condition: cur.weatherDesc?.[0]?.value ?? null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;

  const url = new URL(request.url);
  const city = url.searchParams.get("city");
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");

  try {
    let latitude: number | null = null;
    let longitude: number | null = null;
    let resolvedCity: string | null = null;
    let source: "location" | "city" = "city";

    if (latParam != null && lonParam != null) {
      latitude = Number(latParam);
      longitude = Number(lonParam);
      source = "location";
    } else if (city) {
      let geo = await geocodeCity(city);
      if (!geo) {
        // Geocoding outage: fall back to the built-in city list.
        const known = lookupCity(city);
        if (!known) return errorJson(`Could not find the city "${city}". Try manual entry instead.`, 404);
        geo = { name: known.name, latitude: known.lat, longitude: known.lon, country: known.country };
      }
      latitude = geo.latitude;
      longitude = geo.longitude;
      resolvedCity = [geo.name, geo.country].filter(Boolean).join(", ");
      source = "city";
    } else {
      return errorJson("Provide either lat/lon or a city.");
    }

    let weather = await fetchWeather(latitude as number, longitude as number);

    // Offline fallback: record the typical climate instead of failing. For a
    // location fix we use the nearest known city; for a city query we try the
    // built-in city list first (also covers geocoding outages).
    if (!weather) {
      const known = source === "city" && city ? lookupCity(city) : nearestCity(latitude as number, longitude as number);
      const normal = known
        ? climateNormal(known, new Date())
        : genericClimate(latitude as number, new Date());
      weather = { temperatureC: normal.temperatureC, humidity: normal.humidity, condition: "typical climate" };
      if (!resolvedCity) resolvedCity = known ? `${known.name}, ${known.country}` : null;
    }

    const season = computeSeason(new Date(), latitude);
    const snapshot = await db.environmentSnapshot.create({
      data: {
        userId: guard.user.id,
        source,
        city: resolvedCity ?? url.searchParams.get("label") ?? null,
        latitude,
        longitude,
        temperatureC: weather.temperatureC,
        humidity: weather.humidity,
        condition: weather.condition,
        season,
      },
    });

    return json({ snapshot, fetchedAt: new Date().toISOString() });
  } catch {
    return errorJson("Weather service unreachable. Manual entry remains available.", 503);
  }
}

interface ManualBody {
  temperatureC?: number;
  humidity?: number;
  condition?: string;
  hemisphere?: "north" | "south";
  city?: string;
}

export async function POST(request: Request) {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  const body = await safeJson<ManualBody>(request);
  if (!body) return errorJson("Invalid request body.");

  const temperatureC = body.temperatureC != null ? Number(body.temperatureC) : null;
  const humidity = body.humidity != null ? Number(body.humidity) : null;
  if (temperatureC != null && (!Number.isFinite(temperatureC) || temperatureC < -90 || temperatureC > 60)) {
    return errorJson("Temperature must be between -90 and 60 °C.");
  }
  if (humidity != null && (!Number.isFinite(humidity) || humidity < 0 || humidity > 100)) {
    return errorJson("Humidity must be between 0 and 100 %.");
  }

  const latitude = body.hemisphere === "south" ? -20 : 20; // nominal latitude for season computation
  const season = computeSeason(new Date(), latitude);

  const snapshot = await db.environmentSnapshot.create({
    data: {
      userId: guard.user.id,
      source: "manual",
      city: body.city?.trim() || null,
      latitude,
      longitude: null,
      temperatureC,
      humidity,
      condition: body.condition || null,
      season,
    },
  });

  return json({ snapshot }, 201);
}

export async function DELETE() {
  const guard = await requireUser();
  if (!guard.user) return guard.response;
  await db.environmentSnapshot.deleteMany({ where: { userId: guard.user.id } });
  return json({ ok: true });
}
