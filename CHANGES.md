# MedTime - CHANGES

Status: ✅ tested / ⏳ waiting / ❌ failed

| ID | Date | Files | Description | Status |
|---|---|---|---|---|
| M-001 | 2026-10-18 | app/build.gradle (was Build.gradle), build.gradle | Build fix: app build file name was Build.gradle (Linux is case-sensitive -> "assembleDebug not found"); removed duplicate Android plugin declaration. First successful APK | ✅ built |
| M-002 | 2026-10-18 | app/build.gradle, app/medtime-debug.keystore | Fixed signing key (updates install over the old app) + versionCode from GitHub run number | ⏳ |
| M-003 | 2026-10-18 | CLAUDE.md, STATE.md, CHANGES.md, SESSIONS.md | Project rules and state files (same method as ApexDash, adapted to GitHub cloud builds) | ✅ |
| M-004 | 2026-10-18 | MainActivity.java | Opens over the lock screen: turns the screen on, shows above the lock screen, dismisses a swipe-only lock, keeps the screen on. PIN/fingerprint lock is not bypassed (security) | ⏳ |
| M-005 | 2026-10-18 | Reminders.java, AlarmReceiver.java, ReminderService.java, AlarmActivity.java, ActionReceiver.java, BootReceiver.java, NativeBridge.java, MainActivity.java, AndroidManifest.xml, index.html, build-apk.yml | Stage 1: real daily reminders via Android alarm clock (fire when the app is closed, survive reboot), full-screen reminder over the lock screen with sound + vibration, Hebrew TTS readout of name + dose (said twice, alarm volume), buttons Taken / Snooze 10 min, dose field, status line with fix buttons, test reminder in 1 minute. Workflow also publishes the APK as release `latest` (public download link) and shows build errors as annotations | ⏳ |
