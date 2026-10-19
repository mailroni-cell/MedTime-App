# MedTime - STATE (updated 2026-10-18, stage 1)

## Where we are
- First successful build ever on 2026-10-18 (run #10, before that 9 failed builds).
- App today: dark Hebrew screen, small Three.js animation on top, add reminder / delete reminder. Basic.
- Automation set up: GitHub build -> APK to PC folder -> watcher installs + launches on the phone.

## M-075 (2026-10-18): two update channels
- Builds now publish to release `test` (owner's phone). Release `latest` = what all users get = run 78 (approved "מושלם"). Promote only on "משחררים לכולם": set `run N` in release/stable.txt, push only that file.
- Delivery loop below now downloads from releases/download/test/ (not latest).
- M-076 friendly permission screens, build 82 installed 20:50 (hash FD268802). Shareable APK for owner: /mnt/project-files/medtime-share/MedTime.apk (build 82). Users (latest) still on run 80 = same app as 78.

## HANDOFF (2026-10-18 night, end of session) - read this first
- Latest: build 78 (run 78) = M-067..M-074, all ⏳ waiting for owner test. Build 78 installed on the phone 20:30.
- Recent: 👓 low-vision button on main screen (neon + halo when on), low-vision note fits screen, handwritten credit "פיתוח ועיצוב: רוני שניידר" / "Designed & developed by Roni Schneider" (SVG paths, scratchpad shaping with uharfbuzz), calm mode: 10 3D worlds, light bottom bar (Display/Sound/Timer/↺ Last mode/🔓 Lock), opens quiet with nothing pre-chosen, real nature recordings (M-072, from Wikimedia Commons by workflow fetch-sounds.yml + tools/sounds_pick.json; credits in Help "🎧"), seamless cross-fading sound player (ambPlayer in relax.js).
- Owner said "perfect" on real sounds. Fire / underwater / space / synth still synthesized (no good free recording found).
- Delivery loop: push main -> wait release latest build-info.txt has the SHA -> curl APK to /mnt/project-files/medtime-builds/ -> device_commit_files to C:\Users\Roni\Downloads\MedTime\MedTime-latest.apk (force) -> check size with device_list_dir (first copy is often the OLD file, recommit) -> stage install_log.txt, hash must match md5.
- Parked (needs owner's word): separate calm app "הפרות של אורלי" - start only on "מתחילים את הפרות של אורלי".

## Now
- 2026-10-19 morning: build 105 installed and owner said "הכל פיקס" (all good). Tested: M-085..M-097 (video opening 11.7 s re-recorded with tools/splash-capture.js, welcome wizard, Piper voices inside the APK ~100 MB, name in reminder voice, greeting badge, medicine reminder on top of everything until answered incl. Home/recents, auto-return to the app after a permission, animated switch hint). APK too big for PC delivery tool: the PC watcher downloads release test itself. Release latest still run 78 era stable; promote only on "משחררים לכולם". Open ideas offered (not decided): strong vibration every 30 s until answered, paid Hebrew neural voice (Azure ~$16 per 1M chars), Google Play ($25).
- 2026-10-18 night: build 93 (M-085 smooth colourful opening, M-086 first-install wizard name/text/look/voice + home greeting + rerun button in language tile, M-087 Piper offline voices via sherpa-onnx v1.12.20; packs on release "voices" made by voices.yml, app downloads them once on Wi-Fi). APK 25 MB (PC delivery tool limit 30 MB per file - keep voices out of the APK). Waiting: phone USB connect, owner test, owner answer on card 'auto download vs inside APK'. Idea offered: say the user's name in the reminder voice.
- 2026-10-18 evening (later): builds 58-60 = M-061..M-064 (settings labels fit, help tile 📖, glint on icons, full-width title with settings/exit at bottom corners, no panel behind main menu, stacked main buttons, low-vision fits, floor fades). Build 60 installed 19:03. HANDOFF: next session reads CLAUDE.md, STATE.md, CHANGES.md (last rows M-057..M-064 all ⏳ waiting for owner test), continues build->deliver->install loop.
- 2026-10-18 evening: builds 49-52 installed (M-046..M-051): appointment wizard 7 steps, styled dialogs, 3D opening 6.6 s + big title, clean home + 7-step medicine wizard (medwiz.js), Done buttons. Owner idea for later (not started, needs his go): separate calm app "הפרות של אורלי" (only calm mode: many 3D backgrounds, sounds, nature, recommendations).
- 2026-10-18 evening: M-057..M-060 (opening fix + credit, in-app updates via Updater.java + release latest, menu frame glint, Help tile). Updates need one-time "allow installs from MedTime" on the phone.
- 2026-10-18 evening: build 75 installed (M-072 real nature recordings from Wikimedia Commons via fetch-sounds workflow; fire/underwater/space/synth still synthesized).
- 2026-10-18 evening: build 68 installed 19:56 (M-067..M-071: 👓 low-vision button on main screen, neon when on; calm menu with headed sections + 5 new worlds + seamless cross-faded sounds + no-sound; handwritten credit "רוני שניידר" / "Roni Schneider"). All ⏳ waiting for owner test.
- 2026-10-18 afternoon: build 46 (M-042 appointment wizard, M-043 Audiowide title + ECG line + clean power exit icon) installed 17:31. Build 47 = M-044 calm mode (relax.js: 5 Three.js worlds, synthesized bowls/Om + nature loops, breathing guide, sleep timer) + M-045 medical look (Rubik font everywhere, medical add-reminder button). Open ideas offered to owner: share appointment to WhatsApp, 'every two days' / 'once a month'.
- 2026-10-18: owner said go ("זורם עם כל מה שרשמת צא לדרך") -> stage 2 built as M-036 (appointments) + M-037 text size. Open data comes from data.gov.il via GitHub Actions (tools/fetch_data.py), since the cloud editor cannot reach data.gov.il.
- Stage 1 (M-005 reminders when app is closed + voice, M-006 several medicines / injections per reminder, M-007 snooze choices + voice options, M-008 unlock when needed, M-009 5 languages, M-010 scroll time picker + readable medicine cards, M-011 settings screen under a gear: language, voice, sounds, low-vision, status/test, M-012 full screen, M-013 full 3D graphics = start of stage 4, M-014 settings screen redesign, M-015 frameless icon-grid settings + nebula background, M-016 medicine name autocomplete, M-017 frameless floating fields + vivid capsule, M-018 typical dose suggestion, M-019 no-scroll form + contrast halo, M-020 neon glowing menu, M-021 labels inside fields + bigger type buttons, M-022 previous medicines as chips + glowing plus, M-023 reminders screen + dose units, M-024 suggestions above the keyboard, M-025 time sheet fix, M-026 dose picker (+/-, units) + quick times, M-027 32 special sounds, M-028 30 display themes, M-029 auto theme by time + theme preview, M-030 animated theme worlds + ambient sound + 62 sounds, M-031 close button).
- Build 35 (M-030, M-031) installed 2026-10-18 14:43. M-032 (opening animation + first-launch language screen) and M-033 (volume sliders) built next.
- Credit wording chosen: "© רוני 2026". M-034 keyboard room + M-035 sharp readable text added. Next stage 2 (doctor appointments + Waze) only after owner says "עוברים לשלב הבא".
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
2. Doctor appointments: type, doctor, date/time, clinic address, alert before (0/15/30/60/120 min/1 day), Waze + Google Maps buttons. Owner additions 2026-10-18: own "appointment reminder" control, clinic phone (tap to call), automatic Waze when it is time to leave, street/city autocomplete, and if possible clinic data from the web by health fund (Clalit/Maccabi/Meuhedet/Leumit). Start only after "עוברים לשלב הבא".
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
