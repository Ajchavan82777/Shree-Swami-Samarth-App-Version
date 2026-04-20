@echo off
title Health Check - Shree Swami Samarth
color 0E

echo.
echo =====================================================
echo   SSS FOODS - HEALTH CHECK
echo =====================================================
echo.

set PASS=0
set FAIL=0

:: Check Backend API
echo [CHECK] Backend API (http://localhost:5000/api/health)...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo   [FAIL] Backend is NOT running or unreachable
    set /a FAIL+=1
) else (
    echo   [PASS] Backend is UP and running
    set /a PASS+=1
    for /f "delims=" %%i in ('curl -s http://localhost:5000/api/health') do echo   Response: %%i
)

echo.

:: Check Frontend
echo [CHECK] Frontend (http://localhost:3000)...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo   [FAIL] Frontend is NOT running
    set /a FAIL+=1
) else (
    echo   [PASS] Frontend is UP and running
    set /a PASS+=1
)

echo.

:: Check Python
echo [CHECK] Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo   [FAIL] Python not installed
    set /a FAIL+=1
) else (
    for /f "delims=" %%v in ('python --version') do echo   [PASS] %%v
    set /a PASS+=1
)

:: Check Node
echo [CHECK] Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo   [FAIL] Node.js not installed
    set /a FAIL+=1
) else (
    for /f "delims=" %%v in ('node --version') do echo   [PASS] Node.js %%v
    set /a PASS+=1
)

echo.
echo =====================================================
echo   HEALTH SUMMARY: %PASS% PASSED, %FAIL% FAILED
if %FAIL%==0 (
    echo   STATUS: ALL SYSTEMS OPERATIONAL
) else (
    echo   STATUS: ISSUES DETECTED - Run start.bat to fix
)
echo =====================================================
echo.
pause
