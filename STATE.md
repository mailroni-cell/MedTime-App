# MedTime - STATE (updated 2026-10-18, stage 1)

## Where we are
- First successful build ever on 2026-10-18 (run #10, before that 9 failed builds).
- App today: dark Hebrew screen, small Three.js animation on top, add reminder / delete reminder. Basic.
- Automation set up: GitHub build -> APK to PC folder -> watcher installs + launches on the phone.

## Now
- Stage 1 (M-005 reminders when app is closed + voice, M-006 several medicines / injections per reminder, M-007 snooze choices + voice options, M-008 unlock when needed, M-009 5 languages, M-010 scroll time picker + readable medicine cards, M-011 settings screen under a gear: language, voice, sounds, low-vision, status/test, M-012 full screen, M-013 full 3D graphics = start of stage 4, M-014 settings screen redesign, M-015 frameless icon-grid settings + nebula background, M-016 medicine name autocomplete, M-017 frameless floating fields + vivid capsule, M-018 typical dose suggestion, M-019 no-scroll form + contrast halo, M-020 neon glowing menu, M-021 labels inside fields + bigger type buttons, M-022 previous medicines as chips + glowing plus, M-023 reminders screen + dose units, M-024 suggestions above the keyboard, M-025 time sheet fix, M-026 dose picker (+/-, units) + quick times, M-027 32 special sounds, M-028 30 display themes).
- Planned (owner, later): first-launch screen with language choice that makes clear the language can be set; impressive opening animation on every launch with credit to the owner (ask for the exact credit text).
- Stage 5 (settings) is partly done by M-011; still open from the old app: themes/backgrounds picker (stage 4), volume slider. built and sent to the phone, waiting for owner test. M-004 also still waiting for test.
- Old app source: the whole Flutter app (main.dart) is embedded in pill-reminder/.github/workflows/build.yml, no Drive needed.

## Done and verified
- Auto-install works: watcher registered 2026-10-18 08:58, log shows "INSTALLED + STARTED" (run #10 APK).

## DECISION (owner, 2026-10-18 09:00): bring ALL features of the old rich version into MedTime
Owner tested: "the app looks basic, without all the elements". Port everything from Cyber Pharma 3D v2.1 (Flutter, pill-reminder) into MedTime (HTML/JS + Java), in stages, each stage: build -> auto-install -> owner tests.
Sources of the old version:
- Google Drive "My Apps / יומן תרופות": main.dart (Google Doc id 1ExAKFz3TVaOYGdyZM2-XxDjg1eF9PSuGB_aOkhjKxpA), CHANGELOG.md (id 1nTNR1hFrIDS-08AiogiSkwpMeCS39KeD8NOKChym8uE), pubspec.yaml
- GitHub repo mailroni-cell/pill-reminder: .github/workflows/build.yml (whole Flutter app embedded in the workflow)
Proposed stages (owner to approve order):
1. Real reminders: Android AlarmManager + notifications that fire when the app is closed, full-screen pop-up, sound + vibration, TTS reading of medicine name + dose (Java bridge to WebView).
2. Doctor appointments: type, doctor, date/time, clinic address, alert before (0/15/30/60/120 min/1 day), Waze + Google Maps buttons.
3. Dose picker by horizontal scroll [1 2 3 4 5 6 8 10] with neon highlight + haptic click.
4. Look: 3D "pneumatic" buttons with vibration, thick frames with 4 materials (glossy polymer, brushed titanium, carbon neon, quantum gold), deep 3D layers, 14 animated 3D backgrounds (seamless loop), neon color themes.
5. Settings screen: live preview, background / theme / frame pickers, language, 16 alert sounds with test, volume slider, accessibility + voice switches.

## Ideas (from the old Flutter version pill-reminder)
- Voice reading (TTS) of medicine name and dose.
- Reminders that pop up when the app is closed (Android alarms, needs Java side).
- Doctor appointments with an alert before + Waze / Google Maps buttons.
- Dose picker by scrolling, 16 alert sounds, themes.

## Important paths
- Repo: github.com/mailroni-cell/MedTime-App (main)
- Web app: app/src/main/assets/index.html; Java: app/src/main/java/com/medtime/app/MainActivity.java
- PC: C:\Users\Roni\Downloads\MedTime\ (MedTime-latest.apk, medtime_autoinstall.ps1, install_log.txt)
- adb: C:\ApexDash3D\tools\platform-tools\adb.exe (shared with ApexDash)
