# MedTime auto-install watcher. Runs hidden in the background (scheduled task "MedTime AutoInstall").
# When a new MedTime-latest.apk appears in this folder, it installs it on the USB phone and starts the app.
$dir   = Join-Path $env:USERPROFILE 'Downloads\MedTime'
$apk   = Join-Path $dir 'MedTime-latest.apk'
$log   = Join-Path $dir 'install_log.txt'
$stamp = Join-Path $dir 'last_installed.txt'
$adb   = 'C:\ApexDash3D\tools\platform-tools\adb.exe'; if (-not (Test-Path $adb)) { $adb = 'adb' }
$pkg   = 'com.medtime.app'
function Log($m) { Add-Content -Path $log -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $m) -Encoding UTF8 }
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
$nextCheck = Get-Date
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
    if ((Test-Path $apk) -and (((Get-Date) - (Get-Item $apk).LastWriteTime).TotalSeconds -gt 5)) {
      $h = (Get-FileHash $apk -Algorithm MD5).Hash
      $last = ''; if (Test-Path $stamp) { $last = (Get-Content $stamp -Raw).Trim() }
      if ($h -ne $last) {
        $dev = & $adb devices 2>$null | Select-String "`tdevice$"
        if (-not $dev) {
          if ($waitedFor -ne $h) { Log 'new APK found - waiting for the phone (connect USB)'; $waitedFor = $h }
        } else {
          $out = (& $adb install -r -d $apk 2>&1 | Out-String).Trim()
          if ($out -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE|signatures do not match') {
            Log 'old app has a different signature - uninstalling it once and installing again'
            & $adb uninstall $pkg 2>&1 | Out-Null
            $out = (& $adb install -r -d $apk 2>&1 | Out-String).Trim()
          }
          if ($out -match 'Success') {
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
  Start-Sleep -Seconds 10
}
