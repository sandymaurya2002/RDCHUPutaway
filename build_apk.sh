#!/bin/bash
# ============================================================
# build_apk.sh
# Sets up and builds the debug APK for RDCHUPutaway
# Run from the project root directory
# ============================================================

set -e

echo "================================================"
echo "  RDC HU Putaway — APK Build Script"
echo "================================================"

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install Node 18+ from https://nodejs.org"
  exit 1
fi
echo "✅ Node: $(node -v)"

# Check Java
if ! command -v java &> /dev/null; then
  echo "❌ Java not found. Install JDK 17 from https://adoptium.net"
  exit 1
fi
echo "✅ Java: $(java -version 2>&1 | head -1)"

# Check ANDROID_HOME
if [ -z "$ANDROID_HOME" ]; then
  echo "⚠️  ANDROID_HOME not set."
  echo "   Set it in ~/.bashrc or ~/.zshrc:"
  echo "   export ANDROID_HOME=\$HOME/Android/Sdk"
  echo "   export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
  echo ""
  echo "   Then run: source ~/.bashrc && ./build_apk.sh"
  exit 1
fi
echo "✅ ANDROID_HOME: $ANDROID_HOME"

echo ""
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🏗️  Building debug APK..."
cd android
chmod +x gradlew
./gradlew assembleDebug --no-daemon

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
  echo ""
  echo "================================================"
  echo "  ✅ APK Built Successfully!"
  echo "  📱 APK: android/${APK_PATH}"
  APK_SIZE=$(du -sh "$APK_PATH" | cut -f1)
  echo "  📦 Size: ${APK_SIZE}"
  echo ""
  echo "  Install on device:"
  echo "  adb install ${APK_PATH}"
  echo "================================================"
else
  echo "❌ Build failed — APK not found"
  exit 1
fi
