/**
 * Built-in city climate normals — the offline fallback for the Environment
 * screen. When the live weather providers are unreachable (quota, network,
 * sandbox), we still record a snapshot using the typical monthly temperature
 * and humidity for the city (or the nearest known city for a location fix).
 *
 * Snapshots built this way store condition = "typical climate" so the UI can
 * show exactly what the numbers are — never presented as live weather.
 *
 * Values are rough monthly normals (°C, % RH) compiled for educational use —
 * approximate by design, not an hourly forecast.
 */

export interface CityClimate {
  name: string;
  country: string;
  lat: number;
  lon: number;
  /** Monthly mean temperature °C, Jan..Dec. */
  t: number[];
  /** Monthly mean relative humidity %, Jan..Dec. */
  h: number[];
}

export const CITIES: CityClimate[] = [
  { name: "Delhi", country: "IN", lat: 28.61, lon: 77.21, t: [14, 17, 23, 29, 33, 34, 31, 30, 29, 25, 19, 15], h: [63, 54, 41, 29, 27, 38, 62, 68, 63, 54, 57, 64] },
  { name: "Mumbai", country: "IN", lat: 19.08, lon: 72.88, t: [24, 25, 27, 29, 30, 29, 28, 28, 28, 29, 28, 26], h: [71, 71, 70, 71, 71, 79, 86, 86, 84, 78, 71, 71] },
  { name: "Bengaluru", country: "IN", lat: 12.97, lon: 77.59, t: [22, 24, 27, 28, 27, 25, 24, 24, 24, 24, 23, 22], h: [56, 47, 42, 48, 58, 71, 76, 76, 74, 71, 66, 61] },
  { name: "Chennai", country: "IN", lat: 13.08, lon: 80.27, t: [25, 26, 28, 31, 33, 33, 32, 31, 30, 29, 27, 26], h: [72, 71, 70, 68, 63, 60, 64, 68, 74, 78, 76, 74] },
  { name: "Kolkata", country: "IN", lat: 22.57, lon: 88.36, t: [20, 23, 28, 31, 32, 31, 30, 30, 30, 29, 25, 21], h: [66, 58, 54, 60, 66, 76, 82, 82, 81, 76, 70, 68] },
  { name: "Hyderabad", country: "IN", lat: 17.39, lon: 78.49, t: [22, 25, 29, 32, 33, 30, 28, 28, 28, 27, 24, 22], h: [52, 42, 34, 31, 34, 52, 68, 70, 68, 61, 54, 53] },
  { name: "Pune", country: "IN", lat: 18.52, lon: 73.86, t: [21, 23, 27, 30, 30, 28, 26, 26, 26, 26, 23, 21], h: [55, 46, 40, 42, 51, 67, 79, 80, 77, 68, 58, 56] },
  { name: "Ahmedabad", country: "IN", lat: 23.02, lon: 72.57, t: [20, 23, 28, 32, 34, 33, 31, 30, 30, 29, 25, 21], h: [55, 47, 38, 32, 36, 50, 70, 75, 72, 56, 49, 53] },
  { name: "Jaipur", country: "IN", lat: 26.91, lon: 75.79, t: [16, 19, 25, 30, 34, 34, 31, 30, 29, 26, 21, 17], h: [55, 45, 34, 26, 25, 36, 60, 69, 63, 46, 46, 54] },
  { name: "Varanasi", country: "IN", lat: 25.32, lon: 82.97, t: [16, 19, 25, 31, 33, 33, 31, 30, 30, 27, 22, 17], h: [68, 57, 44, 36, 42, 60, 78, 81, 78, 69, 63, 68] },
  { name: "Lucknow", country: "IN", lat: 26.85, lon: 80.95, t: [16, 19, 25, 31, 33, 33, 31, 30, 30, 27, 22, 17], h: [70, 59, 46, 38, 43, 61, 80, 83, 79, 70, 65, 70] },
  { name: "Kochi", country: "IN", lat: 9.93, lon: 76.27, t: [27, 28, 29, 30, 29, 28, 27, 27, 27, 28, 28, 27], h: [75, 74, 73, 75, 78, 82, 84, 84, 82, 80, 78, 76] },
  { name: "Goa", country: "IN", lat: 15.3, lon: 74.08, t: [25, 26, 28, 30, 30, 29, 28, 28, 28, 28, 27, 26], h: [68, 64, 60, 62, 68, 79, 86, 87, 84, 77, 70, 68] },
  { name: "Nagpur", country: "IN", lat: 21.15, lon: 79.09, t: [21, 24, 29, 33, 35, 32, 29, 29, 29, 27, 23, 21], h: [55, 45, 35, 31, 35, 53, 74, 79, 74, 60, 53, 55] },
  { name: "Bhopal", country: "IN", lat: 23.26, lon: 77.41, t: [19, 22, 27, 32, 34, 32, 29, 28, 28, 26, 22, 19], h: [60, 50, 38, 30, 33, 52, 76, 81, 76, 60, 55, 60] },
  { name: "London", country: "GB", lat: 51.51, lon: -0.13, t: [5, 5, 8, 10, 14, 17, 19, 19, 16, 12, 8, 6], h: [87, 83, 76, 71, 70, 69, 69, 71, 76, 83, 86, 88] },
  { name: "New York", country: "US", lat: 40.71, lon: -74.01, t: [0, 1, 6, 12, 17, 23, 25, 25, 21, 14, 8, 3], h: [62, 60, 59, 58, 64, 66, 66, 68, 69, 66, 65, 63] },
  { name: "Berlin", country: "DE", lat: 52.52, lon: 13.41, t: [0, 0, 5, 9, 14, 18, 20, 20, 15, 10, 5, 2], h: [86, 83, 74, 68, 68, 68, 70, 71, 76, 81, 86, 88] },
  { name: "Paris", country: "FR", lat: 48.86, lon: 2.35, t: [5, 6, 9, 13, 17, 20, 22, 22, 18, 13, 8, 6], h: [84, 79, 73, 70, 71, 70, 71, 72, 76, 82, 84, 85] },
  { name: "Tokyo", country: "JP", lat: 35.68, lon: 139.69, t: [6, 6, 10, 15, 19, 22, 26, 27, 24, 18, 13, 8], h: [56, 56, 60, 64, 70, 76, 80, 79, 78, 73, 66, 59] },
  { name: "Singapore", country: "SG", lat: 1.35, lon: 103.82, t: [27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 27, 27], h: [84, 83, 83, 84, 83, 82, 82, 82, 82, 83, 85, 85] },
  { name: "Dubai", country: "AE", lat: 25.2, lon: 55.27, t: [20, 21, 24, 28, 32, 34, 35, 35, 32, 29, 25, 21], h: [63, 61, 57, 52, 51, 55, 57, 58, 59, 57, 58, 62] },
  { name: "Sydney", country: "AU", lat: -33.87, lon: 151.21, t: [23, 23, 22, 19, 16, 14, 13, 14, 16, 18, 20, 22], h: [72, 74, 74, 72, 73, 72, 67, 64, 66, 68, 70, 70] },
  { name: "Melbourne", country: "AU", lat: -37.81, lon: 144.96, t: [21, 21, 19, 16, 13, 11, 10, 11, 13, 15, 18, 20], h: [64, 66, 68, 70, 74, 77, 76, 72, 69, 66, 64, 63] },
  { name: "Toronto", country: "CA", lat: 43.65, lon: -79.38, t: [-5, -4, 1, 7, 13, 19, 22, 22, 17, 10, 4, -2], h: [74, 71, 67, 63, 64, 67, 69, 71, 71, 70, 75, 78] },
  { name: "Sao Paulo", country: "BR", lat: -23.55, lon: -46.63, t: [23, 23, 22, 20, 18, 17, 17, 18, 19, 20, 21, 22], h: [79, 79, 79, 79, 79, 78, 75, 73, 75, 77, 78, 79] },
  { name: "Moscow", country: "RU", lat: 55.76, lon: 37.62, t: [-8, -7, -2, 6, 13, 17, 19, 17, 11, 5, -2, -6], h: [84, 81, 76, 68, 66, 70, 73, 75, 78, 81, 85, 86] },
  { name: "Cairo", country: "EG", lat: 30.04, lon: 31.24, t: [14, 16, 19, 23, 27, 29, 30, 30, 28, 25, 20, 16], h: [58, 55, 52, 47, 45, 47, 50, 52, 54, 56, 58, 59] },
  { name: "Nairobi", country: "KE", lat: -1.29, lon: 36.82, t: [20, 21, 21, 20, 19, 18, 17, 17, 18, 19, 19, 20], h: [72, 70, 70, 74, 77, 76, 74, 72, 70, 70, 71, 73] },
  { name: "Cape Town", country: "ZA", lat: -33.92, lon: 18.42, t: [22, 22, 21, 18, 16, 14, 13, 14, 15, 17, 19, 21], h: [72, 74, 77, 78, 79, 79, 79, 78, 77, 75, 73, 72] },
  { name: "Los Angeles", country: "US", lat: 34.05, lon: -118.24, t: [15, 15, 16, 17, 19, 21, 23, 24, 23, 20, 17, 15], h: [63, 64, 67, 69, 71, 72, 72, 72, 71, 68, 64, 62] },
  { name: "San Francisco", country: "US", lat: 37.77, lon: -122.42, t: [11, 12, 13, 14, 15, 16, 17, 17, 18, 16, 14, 11], h: [77, 76, 75, 74, 73, 73, 73, 74, 74, 75, 76, 77] },
  { name: "Chicago", country: "US", lat: 41.88, lon: -87.63, t: [-4, -2, 4, 10, 16, 22, 24, 24, 19, 12, 5, -1], h: [73, 72, 70, 66, 68, 70, 71, 72, 71, 69, 72, 76] },
  { name: "Bangkok", country: "TH", lat: 13.76, lon: 100.5, t: [28, 29, 30, 31, 31, 30, 30, 30, 30, 30, 29, 28], h: [72, 74, 74, 74, 76, 77, 77, 78, 79, 78, 73, 70] },
  { name: "Jakarta", country: "ID", lat: -6.21, lon: 106.85, t: [27, 27, 28, 28, 28, 28, 27, 27, 28, 28, 28, 27], h: [82, 83, 84, 85, 84, 83, 82, 81, 81, 81, 82, 83] },
  { name: "Seoul", country: "KR", lat: 37.57, lon: 126.98, t: [-2, 0, 6, 12, 18, 22, 26, 26, 22, 15, 7, 1], h: [60, 58, 60, 62, 67, 71, 77, 76, 72, 66, 62, 60] },
  { name: "Beijing", country: "CN", lat: 39.9, lon: 116.41, t: [-3, 0, 7, 15, 21, 25, 27, 26, 21, 13, 4, -2], h: [44, 42, 44, 46, 52, 58, 68, 70, 64, 56, 50, 46] },
  { name: "Karachi", country: "PK", lat: 24.86, lon: 67.01, t: [19, 21, 24, 27, 29, 30, 29, 28, 28, 28, 25, 21], h: [63, 63, 64, 66, 68, 70, 74, 76, 75, 69, 62, 62] },
  { name: "Dhaka", country: "BD", lat: 23.81, lon: 90.41, t: [19, 22, 27, 29, 30, 30, 29, 29, 29, 28, 24, 20], h: [69, 62, 60, 66, 71, 79, 83, 82, 81, 77, 72, 70] },
  { name: "Colombo", country: "LK", lat: 6.93, lon: 79.86, t: [28, 28, 29, 29, 29, 29, 28, 28, 28, 28, 28, 28], h: [77, 76, 76, 79, 81, 81, 79, 78, 78, 78, 78, 77] },
  { name: "Kathmandu", country: "NP", lat: 27.72, lon: 85.32, t: [10, 13, 17, 21, 23, 24, 24, 24, 23, 20, 15, 12], h: [74, 66, 57, 54, 61, 74, 83, 83, 81, 74, 70, 73] },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

/** Case/space-insensitive lookup, e.g. "New Delhi" does not match — keep exact names. */
export function lookupCity(query: string): CityClimate | null {
  const q = norm(query);
  if (!q) return null;
  return CITIES.find((c) => norm(c.name) === q) ?? CITIES.find((c) => norm(c.name).includes(q) || q.includes(norm(c.name))) ?? null;
}

/** Great-circle-ish nearest known city (small distances OK for climate use). */
export function nearestCity(lat: number, lon: number): CityClimate | null {
  let best: CityClimate | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const c of CITIES) {
    const d = (c.lat - lat) ** 2 + ((c.lon - lon) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

/** Typical temperature / humidity for a city on a given date. */
export function climateNormal(city: CityClimate, date: Date): { temperatureC: number; humidity: number } {
  // Southern hemisphere: shift the calendar by six months.
  let m = date.getUTCMonth();
  if (city.lat < 0) m = (m + 6) % 12;
  return { temperatureC: city.t[m], humidity: city.h[m] };
}

/** Latitude-band climate guess for locations far from any listed city. */
export function genericClimate(lat: number, date: Date): { temperatureC: number; humidity: number } {
  const abs = Math.abs(lat);
  let m = date.getUTCMonth();
  if (lat < 0) m = (m + 6) % 12;
  // Very rough annual cycle amplitude by latitude band.
  const amplitude = abs < 15 ? 1.5 : abs < 30 ? 5 : abs < 45 ? 11 : 15;
  const base = abs < 15 ? 27 : abs < 30 ? 25 : abs < 45 ? 15 : 5;
  const seasonal = Math.cos(((m - 6.5) / 12) * 2 * Math.PI) * amplitude; // warm mid-year in the north
  const temperatureC = Math.round((base - seasonal + Number.EPSILON) * 10) / 10;
  const humidity = abs < 15 ? 80 : abs < 30 ? 65 : abs < 45 ? 70 : 72;
  return { temperatureC, humidity };
}
