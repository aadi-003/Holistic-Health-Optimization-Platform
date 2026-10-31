package com.holistic.companion

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import java.time.Duration
import java.time.Instant
import java.util.concurrent.TimeUnit

/**
 * Background synchronization (WorkManager).
 *
 * Every 15 minutes the worker makes one lightweight poll call. It runs a full
 * Health Connect sync when either:
 *   - the website's "Sync Now" requested one (requestPending, 30 min window), or
 *   - the last successful sync is older than 6 hours (periodic catch-up).
 * This is periodic synchronization — never claimed as real-time streaming.
 */
class CompanionWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val store = SecureStore.get(applicationContext)
        if (!store.isPaired) return Result.success()
        if (!HealthConnectManager(applicationContext).isAvailable) return Result.success()

        return try {
            val poll = ApiClient.poll(store.serverUrl, store.token!!)
            val pending = poll.optBoolean("requestPending", false)
            val lastSyncAt = store.lastSyncAt
            val stale = lastSyncAt == null ||
                Duration.between(Instant.parse(lastSyncAt), Instant.now()).toHours() >= 6
            if (pending || stale) {
                SyncEngine.syncNow(applicationContext)
            }
            Result.success()
        } catch (e:ApiClient.ApiException) {
            if (e.code == 401) Result.success() // revoked — the user disconnected from the website
            else if (runAttemptCount < 3) Result.retry()
            else Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.success()
        }
    }

    companion object {
        private const val WORK_NAME = "holistic-companion-sync"

        fun schedule(context: Context) {
            val request = PeriodicWorkRequestBuilder<CompanionWorker>(15, TimeUnit.MINUTES)
                .setConstraints(
                    Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build(),
                )
                .build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                request,
            )
        }
    }
}
