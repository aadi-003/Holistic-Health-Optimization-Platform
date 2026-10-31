package com.holistic.companion

import android.content.Context
import java.time.Instant

/**
 * One full sync pass: read Health Connect → push batches to the platform →
 * record the outcome locally (the server also mirrors it on the device row).
 * Used by the manual "Sync Now" button and the background worker alike.
 */
object SyncEngine {

    data class Summary(
        val ok: Boolean,
        val message: String,
        val pushed: Int,
        val created: Int,
        val updated: Int,
        val skipped: Int,
        val deniedTypes: List<String>,
        val errors: List<String>,
    )

    /** Maximum records per HTTP request — the server accepts up to 2000. */
    private const val BATCH_SIZE = 400

    suspend fun syncNow(context: Context): Summary {
        val store = SecureStore.get(context)
        if (!store.isPaired) {
            return Summary(false, "Not paired — enter a pairing code first.", 0, 0, 0, 0, emptyList(), listOf("not paired"))
        }
        val hc = HealthConnectManager(context)
        if (!hc.isAvailable) {
            return Summary(false, "Health Connect is unavailable on this phone. Install it from the Play Store.", 0, 0, 0, 0, emptyList(), listOf("health connect unavailable"))
        }

        // Current permissions are reported with every sync so the website can
        // display them and detect revocations.
        val granted = runCatching { hc.grantedPermissions() }.getOrDefault(emptySet())
        val permissionKeys = granted.map { HealthConnectManager.permissionKey(it) }

        val outcome = hc.readAll(days = 30)

        // A permission-revoked pass still reports state to the website.
        if (outcome.deniedTypes.isNotEmpty() && outcome.records.isEmpty()) {
            val msg = "Health Connect permission missing for: ${outcome.deniedTypes.joinToString(", ")}. Re-grant in the app."
            runCatching { ApiClient.reportError(store.serverUrl, store.token!!, permissionKeys, msg) }
            return Summary(false, msg, 0, 0, 0, 0, outcome.deniedTypes, outcome.errors)
        }

        var pushed = 0
        var created = 0
        var updated = 0
        var skipped = 0
        var lastMessage = ""

        try {
            for (chunk in outcome.records.chunked(BATCH_SIZE)) {
                val res = ApiClient.pushRecords(store.serverUrl, store.token!!, permissionKeys, chunk.map { it.toJson() })
                created += res.optInt("created", 0)
                updated += res.optInt("updated", 0)
                skipped += res.optInt("skipped", 0)
                pushed += chunk.size
                lastMessage = res.optString("status", "")
            }
        } catch (e: ApiClient.ApiException) {
            val msg = when (e.code) {
                401 -> "Sync token rejected — disconnect and re-pair from the website."
                else -> "Server error (${e.code}): ${e.message}"
            }
            store.lastSyncMessage = msg
            return Summary(false, msg, pushed, created, updated, skipped, outcome.deniedTypes, outcome.errors + e.message.orEmpty())
        } catch (e: Exception) {
            val msg = "Network error: ${e.message ?: "could not reach the server"}"
            store.lastSyncMessage = msg
            return Summary(false, msg, pushed, created, updated, skipped, outcome.deniedTypes, outcome.errors + e.message.orEmpty())
        }

        val parts = mutableListOf<String>()
        if (created > 0) parts.add("$created new")
        if (updated > 0) parts.add("$updated updated")
        if (skipped > 0) parts.add("$skipped unchanged")
        val message = if (parts.isEmpty()) "No records found in the last 30 days." else "${parts.joinToString(", ")} · $pushed read"
        if (outcome.deniedTypes.isEmpty() && outcome.errors.isEmpty()) {
            store.lastSyncAt = Instant.now().toString()
            store.lastSyncMessage = message
        } else {
            // Partial: some types denied/failing — keep lastSyncAt so the 6-hour
            // background cadence still runs, but surface the problem.
            if (outcome.records.isNotEmpty()) store.lastSyncAt = Instant.now().toString()
            store.lastSyncMessage = "$message — unavailable: ${ (outcome.deniedTypes + outcome.errors).joinToString(", ") }"
        }
        return Summary(
            ok = outcome.records.isNotEmpty() || outcome.errors.isEmpty(),
            message = message + if (outcome.deniedTypes.isNotEmpty()) " — denied: ${outcome.deniedTypes.joinToString(", ")}" else "",
            pushed = pushed,
            created = created,
            updated = updated,
            skipped = skipped,
            deniedTypes = outcome.deniedTypes,
            errors = outcome.errors,
        )
    }
}
