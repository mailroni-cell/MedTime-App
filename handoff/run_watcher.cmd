@echo off
schtasks /run /tn "MedTime AutoInstall"
echo %date% %time% started by run_watcher.cmd >> "%~dp0run_watcher_log.txt"
timeout /t 3 >nul
