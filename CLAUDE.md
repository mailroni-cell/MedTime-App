# MedTime - project rules (CLAUDE.md)

Every new rule the owner sets is added here right away.

## What it is
- MedTime: medication reminder app. HTML + JS page (`app/src/main/assets/index.html`) inside an Android WebView app, package `com.medtime.app`.
- Source of truth: GitHub repo `mailroni-cell/MedTime-App` (branch `main`). Not on the PC.
- Older Flutter version (reference only, not developed): repo `pill-reminder`, Google Drive "My Apps / יומן תרופות".

## Work method (cloud, different from ApexDash)
- Claude edits the code in the cloud and pushes to `main`. GitHub Actions (`.github/workflows/build-apk.yml`) builds the APK by itself.
- Claude waits for the build, downloads the APK (artifact `MedTime-Debug-APK`) and drops it into `C:\Users\Roni\Downloads\MedTime\` on the PC as `MedTime-latest.apk`.
- The PC watcher (`medtime_autoinstall.ps1`, scheduled task "MedTime AutoInstall") installs it on the phone over adb and launches the app by itself. Result is logged to `C:\Users\Roni\Downloads\MedTime\install_log.txt` - Claude reads it to confirm.
- Every build is signed with the fixed key `app/medtime-debug.keystore` (do NOT replace it, or updates stop installing over the old app). versionCode = 100 + GitHub run number.
- State files in this repo are the only source of truth: CLAUDE.md (rules), STATE.md (where we are), CHANGES.md (every change, M-xxx ID, status: ✅ tested / ⏳ waiting / ❌ failed), SESSIONS.md (one entry per session).
- Small, targeted edits; never rewrite large files without need.
- Phases: build -> test on the phone -> approval. Do not move on until the owner says "עוברים לשלב הבא". Each phase ships with a short numbered test checklist.
- No needless experiments; prefer ready libraries; for each component give a free option and a paid option with estimated cost. The owner decides.
- At ~80% usage: prepare a full handoff prompt from STATE.md + CHANGES.md.
- Never ask the owner to paste API keys or passwords in chat.

## Communication
- ALWAYS answer in Hebrew only, never English (owner rule for ALL projects, 2026-10-18). Simple, from scratch, step by step (1, 2, 3).
- Questions / choices for the owner as clickable suggestion cards.
- Each relevant reply has a short **💡 ייעול / רעיון** section.
- Each reply ends with `[📊 Estimated Session Context / Account Quota Used: ~X%]`.
- Any script for the owner: PowerShell, full script in the reply, first line `Clear-Host`.
