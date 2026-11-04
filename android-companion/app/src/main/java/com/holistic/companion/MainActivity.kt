package com.holistic.companion

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.health.connect.client.PermissionController
import com.holistic.companion.ui.AppRoot
import com.holistic.companion.ui.HolisticTheme

/**
 * Entry point. Hosts the four-screen flow:
 * Welcome → Health Connect permissions → account pairing → sync home.
 * If the app is already paired it opens directly on the sync home.
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            HolisticTheme {
                // Health Connect runtime permission contract.
                var granted by remember { mutableStateOf<Set<String>?>(null) }
                val permissionLauncher = rememberLauncherForActivityResult(
                    PermissionController.createRequestPermissionResultContract(),
                ) { result: Set<String> ->
                    granted = result
                }

                AppRoot(
                    permissionResult = granted,
                    onGrantPermissions = {
                        permissionLauncher.launch(HealthConnectManager.PERMISSIONS)
                    },
                    onPairingComplete = { CompanionWorker.schedule(this) },
                )
            }
        }

        // Ensure periodic background sync exists for already-paired installs.
        if (SecureStore.get(this).isPaired) {
            CompanionWorker.schedule(this)
        }
    }
}
