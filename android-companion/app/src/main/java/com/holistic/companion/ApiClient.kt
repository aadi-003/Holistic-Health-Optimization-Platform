package com.holistic.companion

import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

/**
 * Minimal JSON/HTTPS client for the Holistic platform API (no extra
 * dependencies — HttpURLConnection + org.json). Every call maps onto the
 * existing backend conventions:
 *
 *   POST /api/health/pairing/complete   → exchange pairing code for sync token
 *   POST /api/health/sync               → push Health Connect records (device token)
 *   GET  /api/health/poll               → check for a web-requested sync
 */
object ApiClient {

    const val CONNECT_TIMEOUT_MS = 10_000
    const val READ_TIMEOUT_MS = 60_000

    class ApiException(val code: Int, message: String) : Exception(message)

    fun request(url: String, method: String, token: String?, body: JSONObject?): JSONObject {
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = CONNECT_TIMEOUT_MS
            readTimeout = READ_TIMEOUT_MS
            setRequestProperty("Content-Type", "application/json")
            if (token != null) setRequestProperty("Authorization", "Bearer $token")
            doOutput = body != null
            doInput = true
        }
        body?.let { conn.outputStream.use { os -> os.write(it.toString().toByteArray(Charsets.UTF_8)) } }

        val status = conn.responseCode
        val stream = if (status in 200..299) conn.inputStream else conn.errorStream
        val text = stream?.let { BufferedReader(InputStreamReader(it, Charsets.UTF_8)).use { r -> r.readText() } } ?: ""
        conn.disconnect()

        // A wrong Server URL usually ends up on an HTML error page (proxy 410,
        // captive portal, parked domain…) — make that unmistakable instead of
        // crashing inside the JSON parser.
        val json = if (text.isBlank()) {
            JSONObject()
        } else {
            try {
                JSONObject(text)
            } catch (_: Exception) {
                throw ApiException(status, "HTTP $status — the server sent a non-JSON page. Check the Server URL.")
            }
        }
        if (status !in 200..299) {
            throw ApiException(status, json.optString("error", "HTTP $status"))
        }
        return json
    }

    /** Exchange the website's pairing code for this device's sync token. */
    fun completePairing(
        baseUrl: String,
        code: String,
        deviceLabel: String,
        model: String,
        osVersion: String,
        appVersion: String,
    ): Pair<String, String> {
        val body = JSONObject()
            .put("code", code)
            .put("deviceLabel", deviceLabel)
            .put("model", model)
            .put("osVersion", osVersion)
            .put("appVersion", appVersion)
        val res = request("$baseUrl/api/health/pairing/complete", "POST", null, body)
        return res.getString("token") to res.optString("deviceId", "")
    }

    /** Push one batch of normalized Health Connect records. */
    fun pushRecords(
        baseUrl: String,
        token: String,
        permissions: List<String>,
        records: List<JSONObject>,
    ): JSONObject {
        val payload = JSONObject()
            .put("permissions", JSONArray(permissions))
            .put("records", JSONArray(records))
        return request("$baseUrl/api/health/sync", "POST", token, payload)
    }

    /** Report a sync failure (e.g. Health Connect permission revoked) without records. */
    fun reportError(baseUrl: String, token: String, permissions: List<String>, error: String): JSONObject {
        val payload = JSONObject()
            .put("permissions", JSONArray(permissions))
            .put("error", error)
            .put("records", JSONArray())
        return request("$baseUrl/api/health/sync", "POST", token, payload)
    }

    /** Lightweight poll: { requestPending, lastSyncAt, lastSyncStatus, ... }. */
    fun poll(baseUrl: String, token: String): JSONObject =
        request("$baseUrl/api/health/poll", "GET", token, null)
}
