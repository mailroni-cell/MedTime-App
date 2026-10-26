Clear-Host
# MedTime - restart the auto-install watcher and save a diagnostic report (M-376)
$dir = 'C:\Projects\MedTime'
$rep = Join-Path $dir 'restart_report.txt'
$adb = 'C:\ApexDash3D\tools\platform-tools\adb.exe'; if (-not (Test-Path $adb)) { $adb = 'adb' }
Start-Transcript -Path $rep -Force | Out-Null
Write-Host '=== adb devices ==='
& $adb devices -l
Write-Host '=== all powershell/wscript processes ==='
Get-CimInstance Win32_Process | Where-Object { $_.Name -in 'powershell.exe','wscript.exe','pwsh.exe' } | ForEach-Object { '{0}  {1}  {2}' -f $_.ProcessId, $_.CreationDate, $_.CommandLine } | Write-Host
Write-Host '=== mutex ==='
$m = $null
if ([System.Threading.Mutex]::TryOpenExisting('Global\MedTimeAutoInstall', [ref]$m)) { Write-Host 'mutex EXISTS (some process holds or held it)' } else { Write-Host 'mutex free' }
Write-Host '=== stopping old watchers ==='
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*medtime_autoinstall*' -and $_.ProcessId -ne $PID } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; Write-Host ('stopped ' + $_.ProcessId) }
Start-Sleep -Seconds 2
Write-Host '=== scheduled task ==='
Get-ScheduledTask -TaskName 'MedTime AutoInstall' -ErrorAction SilentlyContinue | Get-ScheduledTaskInfo | Format-List LastRunTime, LastTaskResult, NextRunTime | Out-String | Write-Host
Write-Host '=== vbs ==='
Get-Content (Join-Path $dir 'medtime_autoinstall_hidden.vbs') | Write-Host
Write-Host '=== test run of the watcher (15 s, visible errors) ==='
$o = Join-Path $dir 'watcher_test_out.txt'; $e = Join-Path $dir 'watcher_test_err.txt'
$p = Start-Process powershell.exe -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',(Join-Path $dir 'medtime_autoinstall.ps1')) -NoNewWindow -PassThru -RedirectStandardOutput $o -RedirectStandardError $e
Start-Sleep -Seconds 15
if ($p.HasExited) { Write-Host ('test run EXITED, code ' + $p.ExitCode) } else { Write-Host 'test run still running (good) - stopping it'; Stop-Process -Id $p.Id -Force }
Write-Host '--- stdout ---'; Get-Content $o -ErrorAction SilentlyContinue | Write-Host
Write-Host '--- stderr ---'; Get-Content $e -ErrorAction SilentlyContinue | Write-Host
Write-Host '=== starting watcher normally ==='
Start-Process wscript.exe -ArgumentList ('"' + (Join-Path $dir 'medtime_autoinstall_hidden.vbs') + '"')
Start-Sleep -Seconds 15
Get-Content (Join-Path $dir 'install_log.txt') -Tail 10 | Write-Host
if (Test-Path (Join-Path $dir 'alarm_log.txt')) { Write-Host 'alarm_log.txt OK' } else { Write-Host 'alarm_log.txt missing' }
Stop-Transcript | Out-Null
Write-Host '=== DONE - go back to Claude ===' -ForegroundColor Green
