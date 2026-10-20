# MedTime auto-install watcher. Runs hidden in the background (scheduled task "MedTime AutoInstall").
# When a new MedTime-latest.apk appears in this folder, it installs it on the USB phone and starts the app.
$dir   = Join-Path $env:USERPROFILE 'Downloads\MedTime'
$apk   = Join-Path $dir 'MedTime-latest.apk'
$log   = Join-Path $dir 'install_log.txt'
$stamp = Join-Path $dir 'last_installed.txt'
$adb   = 'C:\ApexDash3D\tools\platform-tools\adb.exe'; if (-not (Test-Path $adb)) { $adb = 'adb' }
$pkg   = 'com.medtime.app'
function Log($m) { Add-Content -Path $log -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $m) -Encoding UTF8 }
# Permanent fix (owner 2026-10-21): adb install could hang forever (phone locked / question on the phone) and block everything.
# Now every install has a time limit; on timeout adb is reset and the install is tried again a minute later.
function AdbInstall($file, $sec) {
  $o = Join-Path $dir 'adb_out.txt'; $e = Join-Path $dir 'adb_err.txt'
  $p = Start-Process -FilePath $adb -ArgumentList @('install', '-r', '-d', ('"' + $file + '"')) -NoNewWindow -PassThru -RedirectStandardOutput $o -RedirectStandardError $e
  if (-not $p.WaitForExit($sec * 1000)) {
    try { $p.Kill() } catch { }
    & $adb kill-server 2>&1 | Out-Null
    return 'TIMEOUT'
  }
  return ((Get-Content $o -Raw -ErrorAction SilentlyContinue) + ' ' + (Get-Content $e -Raw -ErrorAction SilentlyContinue)).Trim()
}
$timedOut = ''
# Only ONE copy may ever run: a second copy sees the lock and quits at once
$mtx = New-Object System.Threading.Mutex($false, 'Global\MedTimeAutoInstall')
$own = $false
try { $own = $mtx.WaitOne(0) } catch [System.Threading.AbandonedMutexException] { $own = $true }
if (-not $own) { exit }
$ProgressPreference = 'SilentlyContinue'   # downloads are much faster without the progress bar
Log 'watcher started'
$waitedFor = ''
# M-091: builds are now bigger (offline voices inside), so the watcher fetches the newest test build from GitHub itself
$infoUrl = 'https://github.com/mailroni-cell/MedTime-App/releases/download/test/build-info.txt'
$apkUrl  = 'https://github.com/mailroni-cell/MedTime-App/releases/download/test/MedTime-latest.apk'
$built   = Join-Path $dir 'last_build.txt'
$webInfoUrl = 'https://github.com/mailroni-cell/MedTime-App/releases/download/test/web-info.txt'   # M-140
$webZipUrl  = 'https://github.com/mailroni-cell/MedTime-App/releases/download/test/web.zip'
$webSeen    = Join-Path $dir 'last_web.txt'
$nextCheck = Get-Date
$nextWeb = Get-Date
$hashFor = ''; $hashVal = ''
$myTime = (Get-Item $PSCommandPath).LastWriteTime
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
while ($true) {
  try {
    if ((Get-Date) -ge $nextCheck) {
      $nextCheck = (Get-Date).AddSeconds(60)
      try {
        $info = (Invoke-WebRequest -Uri $infoUrl -UseBasicParsing -TimeoutSec 30).Content
        if ($info -is [byte[]]) { $info = [Text.Encoding]::UTF8.GetString($info) }
        $info = "$info".Trim()
        $seen = ''; if (Test-Path $built) { $seen = (Get-Content $built -Raw).Trim() }
        if ($info -and $info -ne $seen) {
          $tmp = Join-Path $dir 'MedTime-download.tmp'
          Invoke-WebRequest -Uri $apkUrl -OutFile $tmp -UseBasicParsing -TimeoutSec 900
          Move-Item -Force $tmp $apk
          Set-Content -Path $built -Value $info
          Log ('downloaded ' + $info)
        }
      } catch { }
    }
    # M-144: quick web updates are checked every 15 seconds (APK builds stay every 60 s)
    if ((Get-Date) -ge $nextWeb) {
      $nextWeb = (Get-Date).AddSeconds(15)
      # M-140: quick web update (page files only) - pushed straight into the app on the phone, no reinstall
      try {
        $winfo = (Invoke-WebRequest -Uri $webInfoUrl -UseBasicParsing -TimeoutSec 30).Content
        if ($winfo -is [byte[]]) { $winfo = [Text.Encoding]::UTF8.GetString($winfo) }
        $winfo = "$winfo".Trim()
        $wseen = ''; if (Test-Path $webSeen) { $wseen = (Get-Content $webSeen -Raw).Trim() }
        if ($winfo -match 'base (\d+)' -and $winfo -ne $wseen -and (& $adb devices 2>$null | Select-String "`tdevice$")) {
          $base = $Matches[1]
          $wz = Join-Path $dir 'web.zip'; $wd = Join-Path $dir 'web'
          Invoke-WebRequest -Uri $webZipUrl -OutFile $wz -UseBasicParsing -TimeoutSec 120
          if (Test-Path $wd) { Remove-Item -Recurse -Force $wd }
          Expand-Archive -Path $wz -DestinationPath $wd -Force
          [IO.File]::WriteAllText((Join-Path $wd 'base.txt'), $base)
          $remote = "/sdcard/Android/data/$pkg/files/web"
          & $adb shell rm -rf $remote 2>&1 | Out-Null
          $pout = (& $adb push "$wd\." $remote 2>&1 | Out-String).Trim()
          if ($LASTEXITCODE -eq 0) {
            & $adb shell am force-stop $pkg 2>&1 | Out-Null
            & $adb shell am start -n "$pkg/.MainActivity" 2>&1 | Out-Null
            Set-Content -Path $webSeen -Value $winfo
            Log ('WEB UPDATED + STARTED ' + $winfo)
          } else { Log ('WEB UPDATE FAILED: ' + $pout) }
        }
      } catch { }
    }
    if ((Test-Path $apk) -and (((Get-Date) - (Get-Item $apk).LastWriteTime).TotalSeconds -gt 5)) {
      # M-144: hash the 100 MB file only when it changed (was every 10 s)
      $stampKey = (Get-Item $apk).LastWriteTime.Ticks.ToString() + ':' + (Get-Item $apk).Length
      if ($stampKey -ne $hashFor) { $hashVal = (Get-FileHash $apk -Algorithm MD5).Hash; $hashFor = $stampKey }
      $h = $hashVal
      $last = ''; if (Test-Path $stamp) { $last = (Get-Content $stamp -Raw).Trim() }
      if ($h -ne $last) {
        $dev = & $adb devices 2>$null | Select-String "`tdevice$"
        if (-not $dev) {
          if ($waitedFor -ne $h) { Log 'new APK found - waiting for the phone (connect USB)'; $waitedFor = $h }
        } else {
          $out = AdbInstall $apk 240
          if ($out -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE|signatures do not match') {
            Log 'old app has a different signature - uninstalling it once and installing again'
            & $adb uninstall $pkg 2>&1 | Out-Null
            $out = AdbInstall $apk 240
          }
          if ($out -eq 'TIMEOUT') {
            if ($timedOut -ne $h) { Log 'install took too long (phone locked or a question on the phone?) - unlock the phone, trying again every minute'; $timedOut = $h }
            Start-Sleep -Seconds 50
          } elseif ($out -match 'Success') {
            & $adb shell am force-stop $pkg 2>&1 | Out-Null
            & $adb shell am start -n "$pkg/.MainActivity" 2>&1 | Out-Null
            Set-Content -Path $stamp -Value $h
            Log ('INSTALLED + STARTED ' + $h)
          } else {
            Log ('INSTALL FAILED: ' + $out)
            Start-Sleep -Seconds 60
          }
        }
      }
    }
  } catch { Log ('ERROR: ' + $_) }
  # M-144: when Claude copies a newer watcher to the PC, this copy starts the new one and quits (no action needed from the owner)
  try { if ((Get-Item $PSCommandPath).LastWriteTime -ne $myTime) {
    Log 'watcher updated - restarting'; $mtx.ReleaseMutex()
    Start-Process powershell.exe -WindowStyle Hidden -ArgumentList ('-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $PSCommandPath + '"')
    exit } } catch { }
  Start-Sleep -Seconds 5
}
