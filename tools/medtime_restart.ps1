Clear-Host
# MedTime - restart the auto-install watcher and save a diagnostic report (M-376)
$dir = 'C:\Projects\MedTime'
$rep = Join-Path $dir 'restart_report.txt'
$adb = 'C:\ApexDash3D\tools\platform-tools\adb.exe'; if (-not (Test-Path $adb)) { $adb = 'adb' }
Start-Transcript -Path $rep -Force | Out-Null
Write-Host '=== adb devices ==='
& $adb devices -l
Write-Host '=== watcher processes (before) ==='
$procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*medtime_autoinstall*' }
$procs | Select-Object ProcessId, Name, CreationDate | Format-Table -AutoSize | Out-String | Write-Host
Write-Host '=== stopping old watchers ==='
$procs | Where-Object { $_.ProcessId -ne $PID } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; Write-Host ('stopped ' + $_.ProcessId) }
Start-Sleep -Seconds 2
Write-Host '=== scheduled task ==='
Get-ScheduledTask -TaskName 'MedTime AutoInstall' -ErrorAction SilentlyContinue | Get-ScheduledTaskInfo | Format-List LastRunTime, LastTaskResult, NextRunTime | Out-String | Write-Host
Write-Host '=== starting watcher ==='
Start-Process wscript.exe -ArgumentList ('"' + (Join-Path $dir 'medtime_autoinstall_hidden.vbs') + '"')
Start-Sleep -Seconds 25
Get-Content (Join-Path $dir 'install_log.txt') -Tail 8
if (Test-Path (Join-Path $dir 'alarm_log.txt')) { Write-Host 'alarm_log.txt OK' } else { Write-Host 'alarm_log.txt missing' }
Stop-Transcript | Out-Null
Write-Host '=== DONE - go back to Claude ===' -ForegroundColor Green
