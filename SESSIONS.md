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
- Owner: settings under a small gear, with sound choice and low-vision display -> M-011.
- Build 19 installed 10:22. Owner: use the full phone screen -> M-012.
- Build 20 installed 10:27. Owner: full 3D graphics upgrade, best engine, shadows/gloss/motion/depth -> M-013 (Three.js, free; card offered Babylon.js / Unity as alternatives).
- Build 21 installed 10:35: owner: "moves and looks wonderful", but settings screen narrow and generic -> M-014.
- Build 22 installed 10:44. Owner: no scrolling, no frames, more color/depth in background; chose icon grid -> M-015.
- Owner: autocomplete medicine names after 2 letters -> M-016 (built-in list, recommended). Owner: frameless floating buttons/fields, centred text, capsule colour too pale -> M-017.
- Build 24 installed 11:01. Owner accepted typical-dose idea -> M-018; form scrolls again and blends into background -> M-019. Later: first-launch language screen + opening animation with owner credit.
- Build 25 installed 11:08. Owner: menu must really glow -> M-020. Build 26 OK; labels inside fields, drop item/type labels, bigger type buttons -> M-021. Build 27 installed 12:05; clear fields on 'another medicine' + glowing plus -> M-022. Build 28 12:11; smaller buttons, list scrolls, dose unit templates -> M-023. Build 29 12:17; keyboard hid suggestions -> M-024. Time sheet below screen -> M-025. Build 31 12:25; dose picker with +/- and units, quick times -> M-026. Build 32 12:30. Owner: 30 special sounds + 30 display themes -> M-027, M-028 (free: generated in-house). Owner: auto theme by time + theme preview -> M-029. Build 34. Richer animated themes with sound + more sounds -> M-030; close button -> M-031.
- Build 35 installed 14:43.
- Open: owner tests stage 1 and M-004.

## 2026-10-18 (new thread, continued from handoff)
- M-032 opening animation + first-launch language screen (credit text placeholder, asked owner). M-033 separate volume sliders: background / alert / voice.
- Same day, later: M-042 appointment wizard, M-043 title font (owner chose Audiowide, option 2 of 7) + power-symbol exit, M-044 calm mode (3D worlds + zen sounds + sleep timer), M-045 medical look (Rubik, medical add button). Builds 46, 47.
- Same day, evening: M-057 opening flows to the end + gold credit 'רוני', M-058 in-app updates (settings tile, download+install from release latest), M-059 random light around menu frames, M-060 Help tile in 5 languages.
- Same day, night: M-061..M-074: settings/help polish, full-width title, low-vision button on main screen + fixes, calm mode rebuilt (light bar, 10 worlds, real recordings via Wikimedia workflow, last mode, lock), handwritten credit Roni Schneider. Builds 57-78. Handoff written in STATE.md.

## 2026-10-18 (thread 3)
- Owner said build 78 "perfect". M-075: separate test channel (release test) and everyone channel (release latest, run 78).

## 2026-10-19 (thread 3, morning)
- Builds 96-105: M-088 name in voice, M-089 greeting badge, M-091 Piper voices inside APK (PC watcher now downloads from GitHub), M-092/M-093 opening as a pre-recorded video, M-094 reminder over other apps, M-095 auto-return after permission + no play icon + animated switch hint, M-096 credit flicker fixed (recorder waits for each frame) + fade-in, M-097 reminder comes back on top after Home/recents + calm 1.5 s logo ending. Owner: "הכל פיקס" on build 105.
