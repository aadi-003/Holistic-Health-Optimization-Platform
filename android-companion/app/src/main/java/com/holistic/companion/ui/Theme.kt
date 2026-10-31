package com.holistic.companion.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

/**
 * Lightweight Material 3 theme echoing the platform's green primary
 * (#2e6b46) so the companion feels related to the website.
 */
private val LightColors = lightColorScheme(
    primary = Color(0xFF2E6B46),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD8EADD),
    onPrimaryContainer = Color(0xFF0B2917),
    secondary = Color(0xFF0E9BB5),
    surface = Color(0xFFF8F7F2),
    surfaceVariant = Color(0xFFEDEDE6),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF8FD3AC),
    onPrimary = Color(0xFF06301C),
    primaryContainer = Color(0xFF1D4A32),
    onPrimaryContainer = Color(0xFFD8EADD),
    secondary = Color(0xFF7FD0E2),
)

@Composable
fun HolisticTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) DarkColors else LightColors,
        content = content,
    )
}
