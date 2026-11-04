#!/bin/bash
# Rebuild the sandbox Android build toolchain (wiped on sandbox recycle) and
# build the signed release APK. Idempotent: skips downloads already present.
set -euo pipefail

# 1. Full JDK 17 (system JRE lacks jlink/javac, which AGP requires).
if [ ! -x /tmp/jdk-17/bin/java ]; then
  echo "[toolchain] downloading Temurin JDK 17 (via Adoptium API redirect) ..."
  curl -sSLf -o /tmp/jdk17.tar.gz \
    "https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse?project=jdk"
  rm -rf /tmp/jdk-17
  mkdir -p /tmp/jdk-17
  tar -xzf /tmp/jdk17.tar.gz -C /tmp/jdk-17 --strip-components=1
fi

# 2. Gradle 8.9.
if [ ! -x /tmp/gradle-8.9/bin/gradle ]; then
  echo "[toolchain] downloading Gradle 8.9 ..."
  curl -sSL -o /tmp/gradle-8.9-bin.zip \
    "https://mirrors.cloud.tencent.com/gradle/gradle-8.9-bin.zip" \
    || curl -sSL -o /tmp/gradle-8.9-bin.zip \
    "https://services.gradle.org/distributions/gradle-8.9-bin.zip"
  unzip -q /tmp/gradle-8.9-bin.zip -d /tmp
fi

# 3. Android SDK licenses (AGP auto-installs platform-35 + build-tools).
SDK=/tmp/android-sdk
mkdir -p "$SDK/licenses"
echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" > "$SDK/licenses/android-sdk-license"
echo "84831b9409646a918e30573bab4c9c91346d8abd" > "$SDK/licenses/android-sdk-preview-license"

echo "[toolchain] ready: JDK $(/tmp/jdk-17/bin/java -version 2>&1 | head -1), gradle $(/tmp/gradle-8.9/bin/gradle --version 2>/dev/null | grep Gradle || echo '?')"
