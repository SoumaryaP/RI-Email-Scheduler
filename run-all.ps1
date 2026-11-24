# Run all development services (Windows PowerShell)
# Opens two PowerShell windows to run frontend and backend (including the worker).

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Start-Process -FilePath powershell -ArgumentList -NoExit, "-Command", "Set-Location -Path '$root\frontend'; npm run dev"

Start-Process -FilePath powershell -ArgumentList -NoExit, "-Command", "Set-Location -Path '$root\backend'; npm run dev"
