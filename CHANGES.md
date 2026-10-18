# MedTime - CHANGES

Status: ✅ tested / ⏳ waiting / ❌ failed

| ID | Date | Files | Description | Status |
|---|---|---|---|---|
| M-001 | 2026-10-18 | app/build.gradle (was Build.gradle), build.gradle | Build fix: app build file name was Build.gradle (Linux is case-sensitive -> "assembleDebug not found"); removed duplicate Android plugin declaration. First successful APK | ✅ built |
| M-002 | 2026-10-18 | app/build.gradle, app/medtime-debug.keystore | Fixed signing key (updates install over the old app) + versionCode from GitHub run number | ⏳ |
| M-003 | 2026-10-18 | CLAUDE.md, STATE.md, CHANGES.md, SESSIONS.md | Project rules and state files (same method as ApexDash, adapted to GitHub cloud builds) | ✅ |
