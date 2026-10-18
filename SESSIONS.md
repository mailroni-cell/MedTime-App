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
- Owner asked for several medicines + injection in one reminder -> M-006 added to stage 1 (approved by card).
- PC watcher did not react to the new APK (log stuck at 09:02); owner asked to restart the scheduled task.
- Owner asked for snooze 10m/30m/1h/2h and a choice whether to say medicine names and dose -> M-007.
- Owner: "open the phone from lock when needed" -> M-008.
- Build 16 installed 09:59 (watcher had hung while phone was locked; owner restarted it).
- Owner asked for Arabic, Hebrew, Romanian, French, English in menus, voice and everything -> M-009 (was planned for stage 5).
- Build 17 installed 10:08. Owner asked: scroll wheel for time, more readable medicine form -> M-010; status line + test button to move to settings (stage 5).
- Open: owner tests stage 1 and M-004.
