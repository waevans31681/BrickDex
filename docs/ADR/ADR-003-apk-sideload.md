# ADR-003: Distribute Android Build as Sideloaded APK, Not via Google Play Store

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Date** | April 2026 |
| **Author** | William A. Evans |
| **Relates to** | Android distribution, deployment strategy |

---

## Context

BrickDex v1.5 introduces an Android native app build using Capacitor, which wraps the existing React web app in a native Android shell. This enables features unavailable in the web/PWA version — primarily camera access for barcode scanning.

Once a native Android build exists, there are two ways to distribute it:

**Option A — Google Play Store**
Submit the app to the Google Play Store for public distribution. Requires a one-time $25 Google Play developer account fee, compliance with Google Play policies, an app review process, a production-ready privacy policy, and ongoing maintenance in response to Play Store policy changes and OS version requirements.

**Option B — APK sideload**
Build a self-signed APK file and install it directly onto a personal Android device that is already in developer mode. No store submission, no review process, no fee. Requires "Install Unknown Apps" permission to be enabled on the target device, which is already the case for the intended device.

---

## Decision

**We distribute the Android build as a sideloaded APK installed directly on the developer's personal Android device. The app will not be submitted to the Google Play Store.**

---

## Rationale

**1. The app is a personal tool**
BrickDex v1.0 through v2.0 is built for personal household use. There is no requirement — or intent at this stage — to distribute to a general public audience. Publishing to the Play Store to serve an audience of one household adds process overhead with no meaningful benefit.

**2. Developer mode is already enabled**
The target Android device is already in developer mode with USB debugging and "Install Unknown Apps" enabled. There is zero additional setup required to install a sideloaded APK. The barrier to this option is effectively zero.

**3. Faster iteration**
Play Store submission involves a review process that can take hours to days. With APK sideload, a new build can be on the device in under five minutes: `npm run build` → `npx cap sync android` → build in Android Studio → transfer APK → install. This tight feedback loop is valuable during active development.

**4. No cost**
A Google Play developer account costs $25 (one-time). For a personal project with no commercial intent, this cost is unnecessary.

**5. No policy compliance overhead**
Play Store submission requires a privacy policy URL, content rating questionnaire, data safety form disclosure, and compliance with Google Play's evolving developer policies. These are not unreasonable for a commercial app but are disproportionate for a personal household tool.

---

## Trade-offs

| Pro | Con |
|---|---|
| Zero distribution cost | APK must be manually transferred for each update |
| No review process delays | No automatic update mechanism (user must reinstall manually) |
| Full control over build and install timing | App not discoverable by others |
| No policy compliance overhead | Self-signed APK; not verified by Google |
| Matches the personal-use scope of the project | |

The manual update process is the only meaningful trade-off. It is accepted given the low frequency of updates expected for a personal tool and the simplicity of the transfer process (USB cable or private download link).

---

## Future Consideration

This decision does not permanently close the door on Play Store publication. If BrickDex evolves into a tool shared more broadly — for example, if the v3.0 household account feature makes it genuinely useful to a wider AFOL audience — Play Store publication can be revisited at that time. The Capacitor build pipeline produces a standard Android AAB/APK that is fully compatible with Play Store submission without any architectural changes.

Revisit criteria:
- Household account feature (v3.0) is stable and in use
- There is demonstrated interest from people outside the immediate household
- The scope of the project has shifted from personal tool to shared product

---

## Build & Install Workflow

```bash
# 1. Build the React web app
npm run build

# 2. Sync web build into the Capacitor Android project
npx cap sync android

# 3. Open in Android Studio and build a debug APK
npx cap open android
# In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

# 4. Transfer APK to device
# Option A: USB — copy APK file directly
# Option B: Host privately and download via browser on device

# 5. Install on device
# Tap the APK file on the device → Install
# (Requires: Settings → Install Unknown Apps → enabled for browser/Files app)
```
