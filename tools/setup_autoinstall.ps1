Clear-Host
# setup_autoinstall.ps1 - permanent fix (owner 2026-10-21). Run ONCE in a normal PowerShell window.
# The MedTime watcher now starts by itself: at every Windows logon, again every 5 minutes if it ever stopped
# (only one copy can run, extra starts quit at once), and from the Startup folder as a second safety net.
$dir = Join-Path $env:USERPROFILE 'Downloads\MedTime'
$watcher = Join-Path $dir 'medtime_autoinstall.ps1'
if (-not (Test-Path $watcher)) { Write-Host 'medtime_autoinstall.ps1 is missing in Downloads\MedTime - tell Claude' -ForegroundColor Red; return }
$psArgs = '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $watcher + '"'

# 1. stop the old copy
$name = 'MedTime AutoInstall'
Stop-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*medtime_autoinstall*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Write-Host '1. Old watcher stopped.' -ForegroundColor Green

# 2. scheduled task: at logon + every 5 minutes, forever
Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction SilentlyContinue
$action  = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $psArgs
$tLogon  = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$tRepeat = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5)
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName $name -Action $action -Trigger @($tLogon, $tRepeat) -Settings $settings -Description 'Installs new MedTime builds on the phone automatically' | Out-Null
Write-Host '2. Task registered: starts at logon and is checked every 5 minutes.' -ForegroundColor Green

# 3. Startup folder: second safety net (no admin needed)
$startup = [Environment]::GetFolderPath('Startup')
Set-Content -Path (Join-Path $startup 'MedTime AutoInstall.cmd') -Value ('@start "" /min powershell.exe ' + $psArgs) -Encoding ASCII
Write-Host '3. Added to the Startup folder.' -ForegroundColor Green

# 4. start now
Start-ScheduledTask -TaskName $name
Start-Sleep -Seconds 10
Write-Host '4. Last lines of the install log:' -ForegroundColor Cyan
Get-Content (Join-Path $dir 'install_log.txt') -Tail 3 -ErrorAction SilentlyContinue
Write-Host '=== DONE - go back to Claude ===' -ForegroundColor Green
