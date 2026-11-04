# Android Companion — Health Connect Integration Guide

## Architecture (per the project brief and research report Ch. 8)

```
Smartwatch (Wear OS / Fitbit / Garmin / Samsung)
      │  vendor sync
      ▼
Phone: Health Connect (aggregates all apps' health data)
      │  per-type permissions, pull-based reads
      ▼
Holistic Android companion (Kotlin)
      │  normalise to UTC, attach provenance per record
      ▼
Holistic ingest API  →  database  →  web dashboard
```

Design rules taken from the research report:

- **Pull-based reads** on app open + a daily background job; expect late-arriving backfill.
- **Per-type consent** with plain-language purpose strings; partial consent must work (grant
  steps, deny sleep). Consent is stored in the platform's `ConsentRecord` ledger and revocable.
- **Provenance per record.** Every stored reading carries `measured` provenance and its source
  string, so the UI can distinguish actual smartwatch readings from manual, simulated and
  estimated values.
- **Never** recompute vendor estimates, never send health data to third parties, and never
  label a wearable variable as a dosha measure.

## What the companion must implement

Record types (Health Connect):

| Permission | Health Connect type | Unit |
|---|---|---|
| Heart rate | `HeartRateRecord` (series) | bpm |
| Resting heart rate | `RestingHeartRateRecord` | bpm |
| HRV | `HeartRateVariabilityRmssdRecord` | ms |
| Sleep | `SleepSessionRecord` (+ stages) | session → duration h |
| Steps | `StepsRecord` | count |
| SpO₂ | `OxygenSaturationRecord` | % (display-only in the platform) |
| Active minutes | derived from `ExerciseSessionRecord` / steps | min |

Ingest endpoint (already implemented in this repository):

```
POST /api/readings        { metric, value, recordedAt }   provenance: "measured"
```

The dashboard, combined model and recommendation engine consume these records exactly as they
consume manual entries — only the provenance label differs.

## Kotlin sketch (companion app)

```kotlin
// build.gradle.kts
// implementation("androidx.health.connect:connect-client:1.1.0-alpha07")

val PERMISSIONS = setOf(
  HealthPermission.getReadPermission(HeartRateRecord::class),
  HealthPermission.getReadPermission(RestingHeartRateRecord::class),
  HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
  HealthPermission.getReadPermission(SleepSessionRecord::class),
  HealthPermission.getReadPermission(StepsRecord::class),
)

suspend fun syncWeek(client: HealthConnectClient, api: HolisticApi) {
  val granted = client.permissionController.getGrantedPermissions()
  if (!granted.containsAll(PERMISSIONS)) return  // partial consent: sync only granted types

  val now = Instant.now()
  val weekAgo = now.minus(7, ChronoUnit.DAYS)

  val steps = client.readRecords(StepsRecord::class, timeRangeFilter(weekAgo, now))
  for (r in steps.records) {
    api.postReading(metric = "steps", value = r.count.toDouble(), recordedAt = r.startTime)
  }

  val sleep = client.readRecords(SleepSessionRecord::class, timeRangeFilter(weekAgo, now))
  for (s in sleep.records) {
    val hours = Duration.between(s.startTime, s.endTime).toMinutes() / 60.0
    api.postReading(metric = "sleep_duration", value = hours, recordedAt = s.endTime)
  }
  // ... analogous for heart rate (average per day), resting HR, RMSSD
}
```

Play Console requires a **health-apps declaration** before shipping Health Connect reads;
background reads and reads older than 30 days need separate permissions.

## Testing on a real device

1. Install Health Connect and a source app (e.g. Fitbit) on an Android 14+ device or emulator
   with Google Play images.
2. Generate sample data: `adb shell` + the Health Connect CLI, or a source app's demo mode.
3. In the Holistic companion, request permissions, run the sync, and verify records appear in
   the web dashboard with provenance **Smartwatch reading**.
4. Revoke a permission in Health Connect settings → verify the platform shows the variable as
   unavailable (never as zero) and stops ingesting that type.

## What this repository ships instead

This sandbox cannot compile or run an Android emulator, so the web app ships:

- the consent/status screen with per-type switches and revocation (stored in `ConsentRecord`),
- a clearly labelled **simulation mode** (`provenance: "simulated"`) that exercises every
  downstream pipeline, and
- complete manual entry as a full alternative path.

No feature pretends to read a real watch: the Wearables screen states this explicitly.
