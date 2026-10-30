@echo off
title Speakout B1+ Hub
echo.
echo   ==========================================
echo     Speakout 3rd B1+ Learning Hub - Server
echo   ==========================================
echo.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
