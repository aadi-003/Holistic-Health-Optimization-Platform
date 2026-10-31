package com.holistic.companion.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import com.holistic.companion.ApiClient
import com.holistic.companion.BuildConfig
import com.holistic.companion.CompanionWorker
import com.holistic.companion.HealthConnectManager
import com.holistic.companion.SecureStore
import com.holistic.companion.SyncEngine
import java.net.URL
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import kotlinx.coroutines.launch

/**
 * The four companion screens:
 *   Welcome → Health Connect permissions → website account pairing → sync home.
 */

private val DATA_TYPES = listOf(
    "Steps", "Heart rate", "Resting heart rate", "Sleep (incl. stages)",
    "Active calories", "Distance", "Exercise sessions", "SpO2", "HRV (RMSSD)",
)

/** Screen keys for the simple state-machine navigation. */
private const val SCREEN_WELCOME = "welcome"
private const val SCREEN_PERMISSIONS = "permissions"
private const val SCREEN_PAIRING = "pairing"
private const val SCREEN_HOME = "home"

/**
 * Root navigation. Already-paired installs open directly on the sync home.
 */
@Composable
fun AppRoot(
    permissionResult: Set<String>?,
    onGrantPermissions: () -> Unit,
    onPairingComplete: () -> Unit,
) {
    val context = LocalContext.current
    val store = remember(context) { SecureStore.get(context) }
    var screen by rememberSaveable {
        mutableStateOf(if (store.isPaired) SCREEN_HOME else SCREEN_WELCOME)
    }

    when (screen) {
        SCREEN_WELCOME -> WelcomeScreen(onContinue = { screen = SCREEN_PERMISSIONS })
        SCREEN_PERMISSIONS -> PermissionsScreen(
            result = permissionResult,
            onGrant = onGrantPermissions,
            onContinue = { screen = SCREEN_PAIRING },
        )
        SCREEN_PAIRING -> PairingScreen(onPaired = {
            onPairingComplete()
            screen = SCREEN_HOME
        })
        else -> HomeScreen(onDisconnect = { screen = SCREEN_PAIRING })
    }
}

@Composable
fun WelcomeScreen(onContinue: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(28.dp),
        verticalArrangement = Arrangement.Center,
    ) {
        Text("Holistic", style = MaterialTheme.typography.displaySmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        Text("Health Connect", style = MaterialTheme.typography.headlineSmall, color = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(18.dp))
        Text(
            "Syncs your phone's health records — steps, heart rate, sleep, activity and more — " +
                "to your Holistic Health Optimization Platform account.",
            style = MaterialTheme.typography.bodyLarge,
        )
        Spacer(Modifier.height(14.dp))
        Text(
            "• Read-only access via Health Connect\n" +
                "• Encrypted token, HTTPS only\n" +
                "• Disconnect anytime from the website",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(30.dp))
        Button(onClick = onContinue, modifier = Modifier.fillMaxWidth()) {
            Text("Continue")
        }
    }
}

@Composable
fun PermissionsScreen(
    result: Set<String>?,
    onGrant: () -> Unit,
    onContinue: () -> Unit,
) {
    val context = LocalContext.current
    val hc = remember { HealthConnectManager(context) }
    val available = hc.isAvailable

    Column(
        modifier = Modifier.fillMaxSize().padding(28.dp).verticalScroll(rememberScrollState()),
    ) {
        Text("Health Connect", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(10.dp))

        Card(colors = CardDefaults.cardColors(containerColor = if (available) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant)) {
            Column(Modifier.padding(16.dp)) {
                Text(
                    if (available) "Health Connect is available" else "Health Connect is unavailable",
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    if (available) "Your watch data reaches Health Connect through its writing app (for a Redmi Watch 5 Lite that is Mi Fitness)."
                    else "Install or update Health Connect from the Play Store, then return here.",
                    style = MaterialTheme.typography.bodySmall,
                )
            }
        }
        Spacer(Modifier.height(16.dp))

        Text("Data the app will read", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(6.dp))
        DATA_TYPES.forEach { Text("•  $it", style = MaterialTheme.typography.bodyMedium) }

        Spacer(Modifier.height(20.dp))
        if (result == null) {
            Button(onClick = onGrant, enabled = available, modifier = Modifier.fillMaxWidth()) {
                Text("Grant Health Connect permissions")
            }
            Spacer(Modifier.height(6.dp))
            TextButton(onClick = onContinue, modifier = Modifier.fillMaxWidth()) {
                Text("Continue without granting (can grant later)")
            }
        } else {
            Text(
                "Granted ${result.size} permission(s). You can change these anytime in Android Settings → Health Connect.",
                style = MaterialTheme.typography.bodyMedium,
            )
            Spacer(Modifier.height(12.dp))
            Button(onClick = onContinue, modifier = Modifier.fillMaxWidth()) {
                Text("Continue")
            }
        }
    }
}

@Composable
fun PairingScreen(onPaired: () -> Unit) {
    val context = LocalContext.current
    val store = remember { SecureStore.get(context) }
    var serverUrl by remember { mutableStateOf(store.serverUrl.ifBlank { BuildConfig.DEFAULT_SERVER_URL }) }
    var code by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier.fillMaxSize().padding(28.dp).verticalScroll(rememberScrollState()),
    ) {
        Text("Pair your account", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        Text(
            "1. Open the Health Data section of the website.\n" +
                "2. Tap \"Generate pairing code\".\n" +
                "3. Enter the 8-character code here (valid for 10 minutes).",
            style = MaterialTheme.typography.bodyMedium,
        )
        Spacer(Modifier.height(20.dp))

        OutlinedTextField(
            value = serverUrl,
            onValueChange = { serverUrl = it },
            label = { Text("Server URL") },
            supportingText = { Text("Your platform's address, e.g. https://holistic.example.com") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(
            value = code,
            onValueChange = { raw -> code = raw.uppercase().filter { it.isLetterOrDigit() }.take(8) },
            label = { Text("Pairing code") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(18.dp))

        Button(
            onClick = {
                val base = serverUrl.trim().trimEnd('/')
                if (!isValidServerUrl(base)) {
                    error = "Enter an HTTPS server URL (http is allowed only for 10.0.2.2 / localhost)."
                    return@Button
                }
                busy = true
                error = null
                scope.launch {
                    try {
                        val label = listOfNotNull(android.os.Build.MANUFACTURER, android.os.Build.MODEL)
                            .joinToString(" ").trim().ifBlank { "Android phone" }
                        val (token, _) = ApiClient.completePairing(
                            baseUrl = base,
                            code = code.trim(),
                            deviceLabel = label,
                            model = android.os.Build.MODEL ?: "",
                            osVersion = "Android ${android.os.Build.VERSION.RELEASE ?: ""}",
                            appVersion = BuildConfig.VERSION_NAME,
                        )
                        store.serverUrl = base
                        store.token = token
                        store.deviceLabel = label
                        CompanionWorker.schedule(context)
                        onPaired()
                    } catch (e: Exception) {
                        error = e.message ?: "Pairing failed."
                    }
                    busy = false
                }
            },
            enabled = !busy && serverUrl.isNotBlank() && code.length >= 6,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(if (busy) "Pairing…" else "Pair account")
        }
        error?.let {
            Spacer(Modifier.height(10.dp))
            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
fun HomeScreen(onDisconnect: () -> Unit) {
    val context = LocalContext.current
    val store = remember { SecureStore.get(context) }
    val hc = remember { HealthConnectManager(context) }
    val scope = rememberCoroutineScope()
    var syncing by remember { mutableStateOf(false) }
    var summary by remember { mutableStateOf<SyncEngine.Summary?>(null) }
    var grantedCount by remember { mutableStateOf<Int?>(null) }
    var pendingRequest by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        grantedCount = runCatching { hc.grantedPermissions().size }.getOrNull()
        runCatching { ApiClient.poll(store.serverUrl, store.token!!) }.onSuccess {
            pendingRequest = it.optBoolean("requestPending", false)
        }
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(28.dp).verticalScroll(rememberScrollState()),
    ) {
        Text("Holistic Health Connect", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(16.dp))

        StatusCard("Health Connect", if (hc.isAvailable) "Available" else "Unavailable — install from the Play Store")
        StatusCard("Website account", "${store.deviceLabel} → ${hostOf(store.serverUrl)}")
        StatusCard("Health Connect permissions", grantedCount?.let { "$it granted" } ?: "Not checked yet")
        StatusCard(
            "Last successful sync",
            store.lastSyncAt?.let { formatInstant(it) } ?: "No sync yet — tap Sync Now",
            detail = summary?.message ?: store.lastSyncMessage,
        )
        if (pendingRequest) {
            StatusCard("Website request", "The website asked for a sync — running it now…")
        }

        Spacer(Modifier.height(20.dp))
        Button(
            onClick = {
                scope.launch {
                    syncing = true
                    pendingRequest = false
                    summary = SyncEngine.syncNow(context)
                    grantedCount = runCatching { hc.grantedPermissions().size }.getOrNull()
                    syncing = false
                }
            },
            enabled = !syncing,
            modifier = Modifier.fillMaxWidth(),
        ) {
            if (syncing) {
                CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                Spacer(Modifier.size(10.dp))
            }
            Text(if (syncing) "Syncing…" else "Sync Now")
        }
        Spacer(Modifier.height(8.dp))
        OutlinedButton(onClick = {
            scope.launch {
                SyncEngine.syncNow(context) // final catch-up push
                SecureStore.get(context).reset()
                CompanionWorker.schedule(context) // KEEP policy keeps periodic work; token check stops it
                onDisconnect()
            }
        }, modifier = Modifier.fillMaxWidth()) {
            Text("Disconnect from website")
        }

        Spacer(Modifier.height(18.dp))
        Text(
            "Background sync: the app checks the website every 15 minutes and syncs any requested changes; " +
                "it also runs a full sync at least every 6 hours. This is periodic synchronization, not real-time streaming.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun StatusCard(title: String, value: String, detail: String? = null) {
    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Column(Modifier.padding(14.dp)) {
            Text(title, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
            Text(value, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
            detail?.takeIf { it.isNotBlank() }?.let {
                Spacer(Modifier.height(4.dp))
                Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

private fun isValidServerUrl(url: String): Boolean = try {
    val parsed = URL(url)
    parsed.protocol == "https" || parsed.host == "10.0.2.2" || parsed.host == "localhost"
} catch (_: Exception) {
    false
}

private fun hostOf(url: String): String = try {
    URL(url).host
} catch (_: Exception) {
    url
}

private fun formatInstant(iso: String): String = try {
    val formatter = DateTimeFormatter.ofPattern("d MMM uuuu, HH:mm")
    Instant.parse(iso).atZone(ZoneId.systemDefault()).format(formatter)
} catch (_: Exception) {
    iso
}
