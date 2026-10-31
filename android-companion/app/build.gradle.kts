import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.holistic.companion"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.holistic.companion"
        minSdk = 28          // Android 9 — Health Connect's floor via the Play Store app
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        // Optional pre-fill for the server URL on the pairing screen.
        // Pass with: gradle assembleRelease -PserverUrl="https://your-deployment.example"
        // Leave empty to let users type their deployment URL.
        buildConfigField("String", "DEFAULT_SERVER_URL", "\"${project.findProperty("serverUrl") ?: ""}\"")
    }

    signingConfigs {
        create("release") {
            // Read from android-companion/keystore.properties (git-ignored).
            // Generate: see android-companion/README.md — never commit keys.
            val propsFile = rootProject.file("keystore.properties")
            if (propsFile.exists()) {
                val props = Properties().apply {
                    propsFile.inputStream().use { load(it) }
                }
                storeFile = file(props.getProperty("storeFile"))
                storePassword = props.getProperty("storePassword")
                keyAlias = props.getProperty("keyAlias")
                keyPassword = props.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            // Fall back to the debug key when no keystore is configured so CI
            // can still produce an installable APK; a real release uses the
            // keystore.properties signing config above.
            signingConfig = if (rootProject.file("keystore.properties").exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.6")
    implementation(platform("androidx.compose:compose-bom:2024.09.02"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    // Official Google Health Connect SDK
    implementation("androidx.health.connect:connect-client:1.1.0-alpha07")
    // Background synchronization
    implementation("androidx.work:work-runtime-ktx:2.9.1")
    // Encrypted token storage
    implementation("androidx.security:security-crypto:1.1.0-alpha06")
}
