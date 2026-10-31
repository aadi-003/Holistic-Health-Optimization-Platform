package com.holistic.companion

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Duration
import java.time.Instant
import java.time.temporal.ChronoUnit

/** One normalized record ready for POST /api/health/sync. */
data class SyncRecord(val metric: String, val value: Double, val recordedAt: Instant, val origin: String) {
    fun toJson(): org.json.JSONObject =
        org.json.JSONObject()
            .put("metric", metric)
            .put("value", value)
            .put("recordedAt", recordedAt.toString())
            .put("origin", origin)
}

/** Result of one read pass over Health Connect. */
data class ReadOutcome(
    val records: List<SyncRecord>,
    val origins: Set<String>,
    /** Record types whose read threw SecurityException (permission missing/revoked). */
    val deniedTypes: List<String>,
    /** Non-fatal read errors, one per record type. */
    val errors: List<String>,
)

/**
 * Real Health Connect integration via the official SDK:
 *  - availability check (Health Connect app present / up to date),
 *  - permission set + granted-permission query,
 *  - paginated reads over the last N days with per-type error isolation.
 *
 * NOTE on the Redmi Watch 5 Lite: the watch writes into Health Connect only
 * what Xiaomi Mi Fitness shares. If a measurement is absent, the read simply
 * yields no records for it — the platform displays "no records" rather than
 * inventing data.
 */
class HealthConnectManager(private val context: Context) {

    val isAvailable: Boolean
        get() = HealthConnectClient.getSdkStatus(context) == HealthConnectClient.SDK_AVAILABLE

    val sdkStatus: Int
        get() = HealthConnectClient.getSdkStatus(context)

    private val client: HealthConnectClient by lazy { HealthConnectClient.getOrCreate(context) }

    companion object {
        /** Read permissions requested on Screen 2 — only types the platform consumes. */
        val PERMISSIONS: Set<String> = setOf(
            HealthPermission.getReadPermission(StepsRecord::class),
            HealthPermission.getReadPermission(HeartRateRecord::class),
            HealthPermission.getReadPermission(RestingHeartRateRecord::class),
            HealthPermission.getReadPermission(SleepSessionRecord::class),
            HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
            HealthPermission.getReadPermission(DistanceRecord::class),
            HealthPermission.getReadPermission(ExerciseSessionRecord::class),
            HealthPermission.getReadPermission(OxygenSaturationRecord::class),
            HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
        )

        /** Map a Health Connect permission string to the platform's short key. */
        fun permissionKey(permission: String): String = when {
            permission.endsWith("READ_STEPS") -> "steps"
            permission.endsWith("READ_HEART_RATE") -> "heart_rate"
            permission.endsWith("READ_RESTING_HEART_RATE") -> "resting_heart_rate"
            permission.endsWith("READ_SLEEP") -> "sleep"
            permission.endsWith("READ_ACTIVE_CALORIES_BURNED") -> "active_calories"
            permission.endsWith("READ_TOTAL_CALORIES_BURNED") -> "total_calories"
            permission.endsWith("READ_DISTANCE") -> "distance"
            permission.endsWith("READ_EXERCISE") -> "exercise"
            permission.endsWith("READ_OXYGEN_SATURATION") -> "spo2"
            permission.endsWith("READ_HEART_RATE_VARIABILITY") -> "hrv"
            else -> permission.substringAfterLast("READ_", permission).lowercase()
        }
    }

    /** Currently granted Health Connect permissions (re-checks revocations). */
    suspend fun grantedPermissions(): Set<String> =
        client.permissionController.getGrantedPermissions()

    /**
     * Read the last [days] days from every permitted record type.
     * Handles pagination via pageToken and isolates failures per type:
     * a denied or failing type never aborts the whole sync.
     */
    suspend fun readAll(days: Int = 30): ReadOutcome {
        val end = Instant.now().truncatedTo(ChronoUnit.SECONDS)
        val start = end.minus(days.toLong(), ChronoUnit.DAYS)
        val records = mutableListOf<SyncRecord>()
        val origins = mutableSetOf<String>()
        val denied = mutableListOf<String>()
        val errors = mutableListOf<String>()

        suspend fun <T : Record> read(
            type: Class<T>,
            typeName: String,
            convert: (T) -> List<SyncRecord>,
        ) {
            var pageToken: String? = null
            try {
                do {
                    val response = client.readRecords(
                        ReadRecordsRequest(
                            recordType = type,
                            timeRangeFilter = TimeRangeFilter.between(start, end),
                            pageSize = 500,
                            pageToken = pageToken,
                        ),
                    )
                    for (record in response.records) {
                        origins.add(record.metadata.dataOrigin.packageName)
                        records.addAll(convert(record))
                    }
                    pageToken = response.pageToken
                } while (pageToken != null)
            } catch (e: SecurityException) {
                denied.add(typeName)
            } catch (e: Exception) {
                errors.add("$typeName: ${e.message ?: "read failed"}")
            }
        }

        read(StepsRecord::class.java, "steps") { r ->
            listOf(SyncRecord("steps", r.count.toDouble(), r.endTime, r.metadata.dataOrigin.packageName))
        }

        read(HeartRateRecord::class.java, "heart_rate") { r ->
            val bpm = r.samples.map { it.beatsPerMinute }.filter { it in 30.0..230.0 }
            if (bpm.isEmpty()) emptyList()
            else listOf(
                SyncRecord("heart_rate", Math.round(bpm.average()), r.endTime, r.metadata.dataOrigin.packageName),
            )
        }

        read(RestingHeartRateRecord::class.java, "resting_heart_rate") { r ->
            listOf(
                SyncRecord(
                    "resting_heart_rate",
                    r.beatsPerMinute.toDouble(),
                    r.time,
                    r.metadata.dataOrigin.packageName,
                ),
            )
        }

        read(SleepSessionRecord::class.java, "sleep") { r ->
            val origin = r.metadata.dataOrigin.packageName
            val hours = Duration.between(r.startTime, r.endTime).toMillis() / 3_600_000.0
            val out = mutableListOf(
                SyncRecord("sleep_duration", Math.round(hours * 100) / 100.0, r.endTime, origin),
            )
            // Aggregate stage minutes per session; stages arrive inside the
            // session record when the writing app provides them.
            val stageMinutes = mutableMapOf<String, Long>()
            for (stage in r.stages) {
                val key = when (stage.stage) {
                    SleepSessionRecord.STAGE_AWAKE -> "sleep_stage_awake"
                    SleepSessionRecord.STAGE_DEEP -> "sleep_stage_deep"
                    SleepSessionRecord.STAGE_REM -> "sleep_stage_rem"
                    else -> "sleep_stage_light"
                }
                stageMinutes[key] = (stageMinutes[key] ?: 0L) +
                    Duration.between(stage.startTime, stage.endTime).toMinutes()
            }
            for ((key, minutes) in stageMinutes) {
                out.add(SyncRecord(key, minutes.toDouble(), r.endTime, origin))
            }
            out
        }

        read(ActiveCaloriesBurnedRecord::class.java, "active_calories") { r ->
            listOf(
                SyncRecord(
                    "active_calories",
                    Math.round(r.energy.inKilocalories * 10) / 10.0,
                    r.endTime,
                    r.metadata.dataOrigin.packageName,
                ),
            )
        }

        read(DistanceRecord::class.java, "distance") { r ->
            listOf(
                SyncRecord(
                    "distance",
                    Math.round(r.length.inKilometers * 100) / 100.0,
                    r.endTime,
                    r.metadata.dataOrigin.packageName,
                ),
            )
        }

        // Exercise sessions feed the platform's existing "active minutes" metric.
        read(ExerciseSessionRecord::class.java, "exercise") { r ->
            val minutes = Duration.between(r.startTime, r.endTime).toMinutes()
            if (minutes <= 0) emptyList()
            else listOf(
                SyncRecord("active_minutes", minutes.toDouble(), r.endTime, r.metadata.dataOrigin.packageName),
            )
        }

        read(OxygenSaturationRecord::class.java, "spo2") { r ->
            val pct = r.percentage
            if (pct in 50.0..100.0) {
                listOf(SyncRecord("spo2", pct, r.time, r.metadata.dataOrigin.packageName))
            } else {
                emptyList()
            }
        }

        read(HeartRateVariabilityRmssdRecord::class.java, "hrv") { r ->
            listOf(
                SyncRecord(
                    "hrv_rmssd",
                    r.heartRateVariabilityMillis,
                    r.time,
                    r.metadata.dataOrigin.packageName,
                ),
            )
        }

        return ReadOutcome(records, origins, denied, errors)
    }
}
