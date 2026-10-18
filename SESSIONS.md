# SESSIONS - MedTime

## 2026-10-18 08:00-08:30 – Found the project, first build, automation
- Requests: "יש לי פרוייקט שנקרא medtime תוכל לחפש אותו"; "אני רוצה שאתה תעשה את הכל, שיהיה לי אוטומציה מלאה"; "להצמיד את הפרוייקט ... תחת אותם כללים ... להתקין אוטומטית בטלפון ולהריץ תמיד".
- Done: found repo MedTime-App on GitHub (owner mailroni-cell); GitHub connected to Claude; M-001 build fix (first successful APK, run #10); M-002 fixed signing key + version from run number; M-003 rules/state files; PC auto-install watcher scripts in C:\Users\Roni\Downloads\MedTime\.
- Open: owner runs setup_autoinstall.ps1 once; owner tests the app; owner pins a Claude project "MedTime" in the sidebar.

## 2026-10-18 08:57-09:05 – Auto-install verified, decision to port all old features
- Owner ran setup (first pasted into CMD by mistake; then via `powershell -ExecutionPolicy Bypass -File ...`). Log: INSTALLED + STARTED.
- Owner: app looks basic -> chose "bring everything into MedTime". Plan written in STATE.md. Handoff prompt prepared (usage ~80%).

## 2026-10-18 06:00 – Stage 1: reminders when the app is closed + voice
- Owner approved the stage 1 plan (card). Done: M-005 (alarm clock reminders, full-screen reminder, Hebrew TTS, Taken/Snooze, dose field, test button, status line). Workflow publishes release `latest` so the APK downloads without login.
- Open: owner tests stage 1 and M-004.
