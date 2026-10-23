# MedTime: continue in the second Claude account (owner 2026-10-23).
# Double-click the desktop shortcut "MedTime - continue": the start prompt from HANDOFF.md is copied
# to the clipboard, claude.ai opens, and HANDOFF.md opens in Notepad. In the second account: Ctrl+V, Enter.
Clear-Host
$h = 'C:\Projects\MedTime\HANDOFF.md'
if (-not (Test-Path $h)) { Write-Host 'HANDOFF.md not found in C:\Projects\MedTime' -ForegroundColor Red; Start-Sleep 8; exit }
$t = [IO.File]::ReadAllText($h, [Text.Encoding]::UTF8)
$m = [regex]::Matches($t, '```\r?\n([\s\S]*?)\r?\n```')
if ($m.Count -eq 0) { Write-Host 'No start prompt found in HANDOFF.md' -ForegroundColor Red; Start-Sleep 8; exit }
$p = $m[$m.Count - 1].Groups[1].Value
Set-Clipboard -Value $p
Start-Process 'https://claude.ai'
Start-Process notepad.exe -ArgumentList ('"' + $h + '"')
Write-Host ''
Write-Host '  OK - the start prompt is copied.' -ForegroundColor Green
Write-Host '  In the second Claude account: click the message box, press Ctrl+V, then Enter.' -ForegroundColor Green
Write-Host ''
Start-Sleep -Seconds 10
