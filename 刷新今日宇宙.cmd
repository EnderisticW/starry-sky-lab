@echo off
setlocal
title Starry Sky Lab - Refresh NASA APOD

cd /d "%~dp0"

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo.
  echo [ERROR] Node.js or npm was not found.
  echo.
  pause
  exit /b 1
)

echo.
echo Refreshing the cached NASA cosmic observation...
echo.
call npm.cmd run refresh:apod
set refresh_result=%errorlevel%

if not "%refresh_result%"=="0" (
  echo.
  echo [ERROR] Refresh failed. The previous cache was preserved.
) else (
  echo.
  echo Refresh complete.
)

echo.
if /i "%~1"=="--check" exit /b %refresh_result%
pause
endlocal
