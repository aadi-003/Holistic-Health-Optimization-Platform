package com.holistic.companion

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

/**
 * Encrypted storage for the sync token, server URL and sync bookkeeping.
 * Falls back to plain preferences only if the Keystore-backed setup fails
 * (rare device-specific issue) — the sync token is revocable from the website.
 */
class SecureStore private constructor(context: Context) {

    private val prefs: SharedPreferences = try {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()
        EncryptedSharedPreferences.create(
            context,
            "holistic_secure_prefs",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    } catch (_: Exception) {
        context.getSharedPreferences("holistic_fallback_prefs", Context.MODE_PRIVATE)
    }

    /** Base URL of the Holistic platform, no trailing slash. */
    var serverUrl: String
        get() = (prefs.getString(KEY_SERVER, "") ?: "").trimEnd('/')
        set(value) = prefs.edit().putString(KEY_SERVER, value.trim().trimEnd('/')).apply()

    /** Device sync token issued by POST /api/health/pairing/complete. */
    var token: String?
        get() = prefs.getString(KEY_TOKEN, null)
        set(value) {
            if (value == null) prefs.edit().remove(KEY_TOKEN).apply()
            else prefs.edit().putString(KEY_TOKEN, value).apply()
        }

    var deviceLabel: String
        get() = prefs.getString(KEY_LABEL, null) ?: android.os.Build.MODEL ?: "Android phone"
        set(value) = prefs.edit().putString(KEY_LABEL, value).apply()

    /** ISO-8601 instant of the last successful sync (local bookkeeping). */
    var lastSyncAt: String?
        get() = prefs.getString(KEY_LAST_SYNC, null)
        set(value) = prefs.edit().putString(KEY_LAST_SYNC, value).apply()

    var lastSyncMessage: String?
        get() = prefs.getString(KEY_LAST_MSG, null)
        set(value) = prefs.edit().putString(KEY_LAST_MSG, value).apply()

    val isPaired: Boolean
        get() = !token.isNullOrBlank() && serverUrl.isNotBlank()

    fun reset() {
        token = null
        prefs.edit().remove(KEY_SERVER).remove(KEY_LABEL).remove(KEY_LAST_SYNC).remove(KEY_LAST_MSG).apply()
    }

    companion object {
        private const val KEY_SERVER = "server_url"
        private const val KEY_TOKEN = "sync_token"
        private const val KEY_LABEL = "device_label"
        private const val KEY_LAST_SYNC = "last_sync_at"
        private const val KEY_LAST_MSG = "last_sync_msg"

        @Volatile
        private var instance: SecureStore? = null

        fun get(context: Context): SecureStore =
            instance ?: synchronized(this) {
                instance ?: SecureStore(context.applicationContext).also { instance = it }
            }
    }
}
