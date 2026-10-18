# MedTime - STATE (updated 2026-10-18 08:30)

## Where we are
- First successful build ever on 2026-10-18 (run #10, before that 9 failed builds).
- App today: dark Hebrew screen, small Three.js animation on top, add reminder / delete reminder. Basic.
- Automation set up: GitHub build -> APK to PC folder -> watcher installs + launches on the phone.

## Waiting
- Owner runs `setup_autoinstall.ps1` once on the PC (registers the watcher). Then installs are automatic.
- Owner tests the app on the phone.

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
