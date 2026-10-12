@echo off
echo ===================================================
echo       Starting ProductLife DPP Application
echo ===================================================

echo Starting Spring Boot Backend on http://localhost:8081...
start "ProductLife Backend" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0backend\run_backend.ps1"

timeout /t 5 /nobreak >nul

echo Starting Vite Frontend on http://localhost:5174...
start "ProductLife Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Application services launched:
echo - Frontend: http://localhost:5174
echo - Backend:  http://localhost:8081
echo - H2 DB:    http://localhost:8081/h2-console
echo.
