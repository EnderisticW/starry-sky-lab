@echo off
setlocal
title Starry Sky Lab - Local Preview

cd /d "%~dp0"

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo.
  echo [ERROR] Node.js or npm was not found.
  echo Please install Node.js, then double-click this file again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\." (
  echo Installing project dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install project dependencies.
    echo.
    pause
    exit /b 1
  )
)

if /i "%~1"=="--check" (
  call npm.cmd --version
  echo Launcher check passed.
  exit /b 0
)

echo.
echo Starting Starry Sky Lab...
echo Your browser will open automatically.
echo Press Ctrl+C or close this window to stop the preview.
echo.

call npm.cmd run dev -- --host 127.0.0.1 --open

echo.
echo Preview stopped.
pause
endlocal
