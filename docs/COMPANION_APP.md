# Android Companion (Health Connect) — Integration Guide

This document describes the phone-based health data pipeline that replaces the
old browser-Bluetooth smartwatch flow in the **Health Data** section.

## Data flow

```
Xiaomi Redmi Watch 5 Lite
        │ Bluetooth (vendor app)
        ▼
Xiaomi Mi Fitness  (Android phone)
        │ shares supported records
        ▼
Health Connect  (Android health store)
        │ read-only permissions granted in the companion app
        ▼
Holistic Health Connect  (android-companion/, Kotlin + Compose + WorkManager)
        │ HTTPS POST /api/health/sync  (device sync token)
        ▼
Holistic platform API  (Next.js route handlers — the existing backend)
        │ HealthReading ledger (provenance "measured", source "health_connect:<origin>")
        ▼
Health Data section of the website (status, sync controls, dashboard)
```

The website never pairs with the watch over Bluetooth. Everything flows through
Health Connect, so any watch whose app writes to Health Connect works — the
Redmi Watch 5 Lite via Mi Fitness being the reference device.

## API surface

The platform's existing backend is Next.js route handlers (not a separate
FastAPI service); the companion endpoints follow the same conventions
(`json`/`errorJson` helpers, bearer auth, Prisma/SQLite). Mapping from the
requested REST names:

| Requested name                       | Actual route                          | Auth            | Purpose |
|--------------------------------------|---------------------------------------|-----------------|---------|
| `POST /api/health/pairing/create`    | same                                  | web session     | Create a single-use 8-char pairing code (10 min TTL, stored hashed) |
| `POST /api/health/pairing/complete`  | same                                  | pairing code    | Exchange code for a device sync token (raw token returned once) |
| `GET  /api/health/status`            | same                                  | web session     | Paired device, last sync, Health Connect permissions, data origins, metrics with data |
| `POST /api/health/sync`              | same                                  | device token    | Push validated records (dedupe/upsert by metric+source+timestamp) |
| `GET  /api/health/poll`              | *(added)*                             | device token    | Lightweight 15-min poll: `requestPending` + last sync info |
| `POST /api/health/sync/request`      | *(added)*                             | web session     | Web "Sync Now" — sets a 30-min request flag the poll picks up |
| `GET  /api/health/latest`            | same                                  | web session     | Latest synchronized reading per metric (dashboard tiles) |
| `GET  /api/health/history`           | same                                  | web session     | Daily series (`?days=7&metric=steps`) for dashboard charts |
| `POST /api/health/device/disconnect` | same                                  | web session     | Revoke token + delete the readings that arrived via sync |

Database: two new models in `prisma/schema.prisma` —
`HealthPairingCode` (hashed single-use codes) and `HealthCompanionDevice`
(token hash, device info, last sync bookkeeping, Health Connect data origins).
Readings reuse the existing `HealthReading` ledger with
`source = "health_connect:<dataOrigin>"`, so the combined vikriti model, History
and recommendation engines consume companion data exactly like manual entries. New companion-only metrics (`active_calories`, `distance`,
`sleep_stage_*`) are display-only and are **not** added to the combined model.

## Metrics mapping (Health Connect → platform)

| Health Connect record            | Platform metric                     | Unit | Notes |
|----------------------------------|-------------------------------------|------|-------|
| `StepsRecord`                    | `steps`                             | steps| per record |
| `HeartRateRecord` (sample series)| `heart_rate`                        | bpm  | mean of samples per record window |
| `RestingHeartRateRecord`         | `resting_heart_rate`                | bpm  | |
| `SleepSessionRecord`             | `sleep_duration` (+ `sleep_stage_light/deep/rem/awake`) | h / min | stages only when the writing app provides them |
| `ActiveCaloriesBurnedRecord`     | `active_calories`                   | kcal | display-only |
| `DistanceRecord`                 | `distance`                          | km   | display-only |
| `ExerciseSessionRecord`          | `active_minutes`                    | min  | feeds the existing activity metric |
| `OxygenSaturationRecord`         | `spo2`                              | %    | display-only |
| `HeartRateVariabilityRmssdRecord`| `hrv_rmssd`                         | ms   | |

Records are keyed `(user, metric, source, recordedAt)`; re-sending the same
record skips, a changed value updates — duplicate-safe.

## What the Redmi Watch 5 Lite actually provides

The watch never talks to Health Connect itself: **Mi Fitness** decides what is
shared. Expected through Mi Fitness: steps, heart rate, sleep sessions (with
stages on newer versions), active calories, distance, SpO2. Resting heart rate
and HRV sharing depends on the Mi Fitness version. The integration **never
invents data**: a measurement that is not shared simply stays absent and the
website lists it under "Not received yet". Verify on-device after the first
sync: open the website's Health Data section → "Available health data".

Mi Fitness setup: open Mi Fitness → **Settings → Health Connect** (or *Data
permissions*) and enable sharing for the supported categories.

## Synchronization model

- **Manual**: Sync Now in the app (instant) or on the website (best-effort —
  the phone picks the request up at its next 15-minute poll; the website cannot
  wake a phone remotely without a push service like FCM).
- **Background**: WorkManager periodic worker (15 min poll, network-constrained)
  → full sync when the website requested one or when the last sync is older
  than 6 hours.
- **No real-time streaming** is claimed anywhere in the UI.

## Building, signing and hosting the APK

See `android-companion/README.md`. Short version:

1. `cd android-companion && gradle assembleRelease` (after creating
   `keystore.properties`, git-ignored) — or run the **android-release** GitHub
   Actions workflow (secrets: `ANDROID_KEYSTORE_BASE64`,
   `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`).
2. Copy the signed APK to `public/downloads/holistic-health-companion.apk`
   in the platform repo — the site serves it at
   `/downloads/holistic-health-companion.apk`. To host elsewhere (e.g. a
   GitHub Release asset) instead, set `NEXT_PUBLIC_COMPANION_APK_URL` in `.env`.
3. Restart the site. The Health Data page always renders a real QR code
   (generated client-side from the download URL) and an enabled
   **Download Companion App** button — the QR is never a placeholder.

## Security properties

- Pairing codes: single-use, 10-minute TTL, max 5 attempts, stored as SHA-256
  hashes, unambiguous alphabet.
- Device tokens: 32 random bytes; only the SHA-256 hash is stored; revocable
  from the website; scoped to exactly one user and the companion endpoints.
- Companion reads are read-only via Health Connect permissions; the token grants
  no web-account access.
- Disconnect deletes only readings with source `health_connect:*`.
- The Android app stores the token in EncryptedSharedPreferences (Keystore
  backed) and talks HTTPS (cleartext allowed only for the emulator loopback).

## Testing

- `scripts/health-companion-test.sh` — 25-check end-to-end API test (pairing,
  single-use enforcement, sync create/dedupe/update, validation rejections,
  status, latest, history, poll, isolation, disconnect, revoked token).
- `bunx vitest run` — engine regression suite (unchanged by this feature).
- On-device checklist (needs your phone + watch): install APK → grant
  permissions → enter pairing code → Mi Fitness syncs → Sync Now → check the
  website dashboard, dedupe on second sync, disconnect removes data.

## Known limitations (owned, not hidden)

- No push-based instant sync from the website (would require FCM; the request
  flag path is ≤15 min).
- Sleep stage fidelity depends entirely on what Mi Fitness writes.
- SpO2/HRV/resting-HR availability depends on the Mi Fitness version.
- The APK is built and hosted by the owner (Android build tooling is not part
  of the web platform's runtime) — the QR code activates only once the real
  URL is configured.
