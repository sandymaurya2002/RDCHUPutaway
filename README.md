# 📦 RDC TO RDC HU PUTAWAY — Android HHT App

A warehouse handheld terminal (HHT) application for RDC-to-RDC HU (Handling Unit) Putaway operations, integrated with SAP RFC endpoints.

---

## 📁 Project Structure

```
RDCHUPutaway/
├── App.js                              ← Root entry point
├── index.js                            ← RN AppRegistry
├── app.json                            ← App name config
├── package.json                        ← Dependencies
├── babel.config.js
├── metro.config.js
├── android/
│   ├── build.gradle                    ← Root gradle config
│   ├── settings.gradle
│   ├── gradle.properties
│   └── app/
│       ├── build.gradle                ← App-level gradle
│       ├── proguard-rules.pro
│       └── src/main/
│           ├── AndroidManifest.xml     ← Permissions
│           ├── java/com/rdchuputaway/
│           │   ├── MainActivity.kt
│           │   └── MainApplication.kt
│           └── res/
│               └── values/
│                   ├── strings.xml
│                   └── styles.xml
└── src/
    ├── config/
    │   ├── appConfig.js                ← Users, plants, BIN prefix
    │   └── theme.js                    ← HHT color theme
    ├── services/
    │   └── api.js                      ← All RFC API calls (Axios)
    ├── components/
    │   ├── ScanField.js                ← Reusable scan field
    │   ├── ScannerModal.js             ← Camera barcode scanner
    │   └── StatusMessage.js            ← Status display
    ├── navigation/
    │   └── AppNavigator.js             ← Stack navigation
    └── screens/
        ├── SetupScreen.js              ← User + Plant selection
        ├── HomeScreen.js               ← Tile menu
        └── PutAwayScreen.js            ← Main BIN→HU→SAVE screen
```

---

## 🔧 Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Java JDK | 17 |
| Android Studio | Latest |
| Android SDK | API 34 |
| React Native CLI | Latest |

---

## 🚀 Quick Setup

### Step 1 — Initialize a new React Native project

```bash
npx react-native@0.73.6 init RDCHUPutaway --version 0.73.6
cd RDCHUPutaway
```

### Step 2 — Replace generated files with this project's files

Copy all files from this ZIP into the newly created project, overwriting where prompted.

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Update SAP server URL

Open `src/services/api.js` and replace line 5:

```js
// BEFORE
const BASE_URL = 'https://your-sap-server.com';

// AFTER — example
const BASE_URL = 'https://192.168.1.100:8080';
// or
const BASE_URL = 'https://sap-rfc-gateway.yourdomain.com';
```

---

## 📱 Run on Android Device / Emulator

```bash
# Connect Android device via USB (enable USB Debugging)
# OR start an emulator from Android Studio

npx react-native run-android
```

---

## 🏗️ Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

For debug APK:
```bash
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: RDC HU Putaway HHT App"
git branch -M main
git remote add origin https://github.com/sandymaurya2002/RDCHUPutaway.git
git push -u origin main
```

---

## 🔁 App Flow

```
App Launch
    │
    ▼
SetupScreen ──── Select User ID + Plant ──→ Proceed
    │
    ▼
HomeScreen ──── Tile: "RDC TO RDC HU PUTAWAY" ──→ Tap
    │
    ▼
PutAwayScreen
    │
    ├── STEP 1: Scan BIN
    │       └── POST /api/ZWM_HU_MVT_BIN_VAL_RFC
    │               ✅ Status=S → BIN validated, enable HU scan
    │               ❌ Status=E → Show error
    │
    ├── STEP 2: Scan HU  (only after BIN validated)
    │       └── POST /api/ZWM_HU_MVT_HU_VAL_RFC
    │               ✅ Status=S → HU validated, enable Save
    │               ❌ Status=E → Show error
    │
    └── STEP 3: SAVE  (only after HU validated)
            └── POST /api/ZWM_HU_MVT_SAVE_RFC
                    ✅ Status=S → Success modal → Reset
                    ❌ Status=E → Show error
```

### BIN Retention Logic

| BIN starts with | After successful Save |
|---|---|
| `001` (sticky) | BIN is **kept**, HU cleared → scan next HU |
| anything else | Both BIN and HU cleared → fresh scan |

---

## 🎯 API Reference

All APIs use `POST` with JSON body. Base URL configured in `src/services/api.js`.

### BIN Validation
```
POST /api/ZWM_HU_MVT_BIN_VAL_RFC
{ "IM_USER": "250", "IM_PLANT": "DH24", "IM_BIN": "BIN001" }
```

### HU Validation
```
POST /api/ZWM_HU_MVT_HU_VAL_RFC
{ "IM_USER": "250", "IM_PLANT": "DH24", "IM_BIN": "BIN001", "IM_HU": "HU12345" }
```

### Save Putaway
```
POST /api/ZWM_HU_MVT_SAVE_RFC
{ "IM_USER": "250", "IM_PLANT": "DH24", "IM_BIN": "BIN001", "IM_HU": "HU12345" }
```

### Response Format
```json
// Success
{ "Status": "S", "Message": "Putaway saved successfully" }

// Error
{ "Status": "E", "Message": "Invalid BIN for plant DH24" }
```

---

## ⚙️ Configuration

### Add Users (`src/config/appConfig.js`)
```js
export const USERS = [
  { label: '250 - Warehouse User', value: '250' },
  { label: '251 - Supervisor', value: '251' },
  // Add more...
];
```

### Add Plants
```js
export const PLANTS = [
  { label: 'DH24 - RDC Delhi', value: 'DH24' },
  // Add more...
];
```

### Change Sticky BIN Prefix
```js
export const STICKY_BIN_PREFIX = '001'; // BINs starting with this are retained after save
```

---

## 🔒 Permissions (AndroidManifest.xml)

| Permission | Purpose |
|---|---|
| `CAMERA` | Barcode scanning |
| `INTERNET` | SAP RFC API calls |
| `ACCESS_NETWORK_STATE` | Network error handling |
| `VIBRATE` | Scan haptic feedback |

---

## 🧪 Testing Without SAP Server

To test the UI flow without a real SAP backend, temporarily mock the API in `src/services/api.js`:

```js
// Mock responses for testing
export const validateBin = async (user, plant, bin) => {
  await new Promise(r => setTimeout(r, 800)); // Simulate network
  if (bin === 'ERR') return { Status: 'E', Message: 'Invalid BIN' };
  return { Status: 'S', Message: 'BIN validated' };
};

export const validateHU = async (user, plant, bin, hu) => {
  await new Promise(r => setTimeout(r, 800));
  return { Status: 'S', Message: 'HU validated' };
};

export const savePutaway = async (user, plant, bin, hu) => {
  await new Promise(r => setTimeout(r, 1000));
  return { Status: 'S', Message: 'Saved successfully' };
};
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `react-native-vision-camera` | High-performance barcode scanner |
| `axios` | HTTP client for RFC API calls |
| `@react-navigation/native-stack` | Screen navigation |
| `react-native-safe-area-context` | Safe area handling |

---

## 🏭 Built For

- **Device**: Rugged Android HHT (Zebra, Honeywell, Datalogic)
- **Min Android**: API 24 (Android 7.0)
- **Orientation**: Portrait locked
- **Network**: Corporate LAN / VPN to SAP
