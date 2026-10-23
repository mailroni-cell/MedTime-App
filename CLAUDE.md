# MedTime - project rules (CLAUDE.md)

Every new rule the owner sets is added here right away.

## What it is
- MedTime: medication reminder app. HTML + JS page (`app/src/main/assets/index.html`) inside an Android WebView app, package `com.medtime.app`.
- Source of truth: GitHub repo `mailroni-cell/MedTime-App` (branch `main`). Not on the PC.
- Older Flutter version (reference only, not developed): repo `pill-reminder`, Google Drive "My Apps / יומן תרופות".

## Work method (cloud, different from ApexDash)
- Claude edits the code in the cloud and pushes to `main`. GitHub Actions (`.github/workflows/build-apk.yml`) builds the APK by itself.
- Claude waits for the build, downloads the APK (artifact `MedTime-Debug-APK`, or without login from the rolling TEST release: https://github.com/mailroni-cell/MedTime-App/releases/download/test/MedTime-latest.apk; build-info.txt there names the run) and drops it into `C:\Projects\MedTime\` on the PC as `MedTime-latest.apk`.
- The PC watcher (`medtime_autoinstall.ps1`, scheduled task "MedTime AutoInstall") installs it on the phone over adb and launches the app by itself. Result is logged to `C:\Projects\MedTime\install_log.txt` - Claude reads it to confirm.
- Two channels (M-075, owner rule 2026-10-18): every build goes only to release `test` (owner's phone). Release `latest` is what ALL users' apps update from; it changes only when the owner says "משחררים לכולם": then Claude writes the tested run number in `release/stable.txt` (`run N`) and pushes only that file; workflow `release-stable.yml` copies `test` -> `latest`. Never promote without the owner's word.
- Every build is signed with the fixed key `app/medtime-debug.keystore` (do NOT replace it, or updates stop installing over the old app). versionCode = 100 + GitHub run number.
- State files in this repo are the only source of truth: CLAUDE.md (rules), STATE.md (where we are), CHANGES.md (every change, M-xxx ID, status: ✅ tested / ⏳ waiting / ❌ failed), SESSIONS.md (one entry per session).
- Small, targeted edits; never rewrite large files without need.
- Phases: build -> test on the phone -> approval. Do not move on until the owner says "עוברים לשלב הבא". Each phase ships with a short numbered test checklist.
- No needless experiments; prefer ready libraries; for each component give a free option and a paid option with estimated cost. The owner decides.
- At ~80% usage: prepare a full handoff prompt from STATE.md + CHANGES.md.
- HANDOFF FILE (owner rule 2026-10-20, for every project): after every batch of changes and at the end of every session, update `handoff/HANDOFF.md` (where we are, what is waiting for the owner, next steps, a ready start prompt in Hebrew) and `handoff/project-memory.md`, push, and copy HANDOFF.md to the owner's PC (`C:\Projects\MedTime\HANDOFF.md`). Purpose: if time runs out here, the owner continues from the same point in his second Claude account on the same PC.
- Never ask the owner to paste API keys or passwords in chat.
- QUICK WEB UPDATES (M-140, owner rule 2026-10-21): changes only in page files (app/src/main/assets *.html/*.js/*.css) are pushed alone: no APK build, web-update.yml publishes web.zip on release test and the PC watcher pushes it to the phone in seconds (log line 'WEB UPDATED'). Java/manifest/resources changes still need an APK build (push them in a separate commit). When the owner approves a round, run workflow 'Build Android APK' by hand (workflow_dispatch) so the APK contains everything; do this always BEFORE 'משחררים לכולם'. Keep native-call guards (has(...)) in JS so a web update never breaks on an older APK.
- Fixes (owner rule 2026-10-21): small fixes are done quickly and collected into ONE push = one build; do not build again for every small fix, and do not spend long on checks for a fix. Docs-only commits use [skip ci].

- PC FOLDER (owner rule 2026-10-22, every project): all PC files of a project live in ONE folder under C:\Projects. MedTime: C:\Projects\MedTime (watcher, log, HANDOFF, images).
- AUTO HANDOFF (owner 2026-10-23, standing rule): after every batch of changes Claude updates handoff/HANDOFF.md (its LAST fenced block is always the Hebrew start prompt) and pushes, without asking. The PC gets it by itself (docs sync), and the desktop shortcut "MedTime - continue" (handoff/continue.ps1, M-319) copies that start prompt to the clipboard, opens claude.ai and HANDOFF.md. If a permanent permission is ever needed for this, ask Roni once.
- SWITCH REMINDER (owner 2026-10-23): whenever Roni asks about or announces moving to the second Claude account, first push an up-to-date HANDOFF.md, then remind him in Hebrew, 1-2-3: double-click desktop shortcut "MedTime - continue", in the second account click the message box, Ctrl+V, Enter.
- AUTO NEW THREAD (owner 2026-10-23, every project, all accounts): when a conversation gets long / token-heavy (~60% context), Claude does it by itself without asking: push a fresh handoff/HANDOFF.md, ask the coordinator to open a new main thread from the same point, and tell Roni in one Hebrew line.
- SIGNED LOG (owner 2026-10-23, both accounts): every change (code, docs, ads, PC files) gets an entry at the TOP of handoff/SYNC-LOG.md: time, which account + thread/session, exactly what changed, files, and how to undo (commit hash). Commit messages also name the account. Never rebuild or guess a design from scratch: continue from the exact existing file; source files (html/py/assets) always go to the repo (media/ads/src/).
- SHARED OUTPUTS (2026-10-23): every output file Claude makes (ads, images, videos, their source html) is also committed to the repo (folder media/ads/, [skip ci]), not only to /mnt/project-files or a scratchpad, because the second Claude account cannot see this account's folders.
- DOCS AUTO-SYNC (owner 2026-10-22): the PC watcher downloads handoff/HANDOFF.md (to C:\Projects\MedTime\HANDOFF.md) and STATE.md, CHANGES.md, CLAUDE.md, project-memory.md (to C:\Projects\MedTime\docs\) from GitHub main every 5 minutes (log line 'DOCS UPDATED'). So pushing the docs to main is enough; no manual copy to the PC needed. Private files (testers.csv) never go to the public repo; copy them to the PC directly.

## Communication
- ALWAYS answer in Hebrew only, never English (owner rule for ALL projects, 2026-10-18). Simple, from scratch, step by step (1, 2, 3).
- Questions / choices for the owner as clickable suggestion cards.
- Every change made in Hebrew applies to ALL 6 languages (he, ar, ro, fr, en, ru) at the same time (owner rule 2026-10-20; Russian added 2026-10-21, M-167).
- PROGRESS BAR (owner rule 2026-10-22, every request, no matter what): always show the progress checklist card for the work, and its first line (and the in-progress step line) carries a coloured progress bar, percent and count, e.g. `🟩🟩🟩⬜⬜⬜ 50% · 3/6` (owner asked for something brighter; the card is text only, no animation). Update it as each step finishes. It costs almost nothing (it is part of the checklist update already sent).
- (2026-10-22 10:19, owner, every project) EVERY reply message also starts with that progress bar line; the card alone scrolls out of sight.
- (2026-10-22 16:08, owner, 4th time asking, very important) EVERY reply message also ENDS with the progress bar line (start AND end).
- Each relevant reply has a short **💡 ייעול / רעיון** section. Owner (2026-10-21): after EVERY finished change, always give a concrete efficiency tip about the app or the work process (like 'updates without reinstall').
- Each reply ends with `[📊 Estimated Session Context / Account Quota Used: ~X%]`.
- Any script for the owner: PowerShell, full script in the reply, first line `Clear-Host`.
