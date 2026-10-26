Clear-Host
# MedTime - restart the auto-install watcher and show its state (M-376)
$dir = 'C:\Projects\MedTime'
$adb = 'C:\ApexDash3D\tools\platform-tools\adb.exe'; if (-not (Test-Path $adb)) { $adb = 'adb' }
Write-Host '=== adb devices ===' -ForegroundColor Cyan
& $adb devices -l
Write-Host '=== watcher processes ===' -ForegroundColor Cyan
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*medtime_autoinstall*' } | Select-Object ProcessId, CreationDate | Format-Table -AutoSize
Write-Host '=== starting watcher ===' -ForegroundColor Cyan
Start-Process wscript.exe -ArgumentList ('"' + (Join-Path $dir 'medtime_autoinstall_hidden.vbs') + '"')
Start-Sleep -Seconds 20
Get-Content (Join-Path $dir 'install_log.txt') -Tail 8
if (Test-Path (Join-Path $dir 'alarm_log.txt')) { Write-Host 'alarm_log.txt OK' -ForegroundColor Green } else { Write-Host 'alarm_log.txt missing' -ForegroundColor Yellow }
Write-Host '=== DONE - go back to Claude ===' -ForegroundColor Green
