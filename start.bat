@echo off
setlocal
cd /d "%~dp0"
title Shree Swami Samarth - Starting Application
color 0A

echo.
echo =====================================================
echo   SHREE SWAMI SAMARTH FOOD ^& HOSPITALITY SERVICES
echo   Starting Application...
echo =====================================================
echo.
echo  Dir : %CD%
echo.

python --version >nul 2>&1
if errorlevel 1 ( echo [ERROR] Python not found. Please install Python 3.8+ & goto :end )
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  Python : %%v

node --version >nul 2>&1
if errorlevel 1 ( echo [ERROR] Node.js not found. Please install Node.js 18+ & goto :end )
for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo  Node   : %%v
echo.

if not exist "backend"      ( echo [ERROR] backend folder missing in %CD%      & goto :end )
if not exist "frontend-app" ( echo [ERROR] frontend-app folder missing in %CD% & goto :end )

echo [1/3] Installing backend dependencies...
cd backend
python -m pip install -r requirements.txt
if errorlevel 1 ( echo. & echo [ERROR] pip install failed. & cd .. & goto :end )
cd ..
echo  Done.
echo.

echo [2/3] Checking frontend dependencies...
cd frontend-app
if not exist node_modules (
    echo  Installing node modules...
    npm install --legacy-peer-deps
    if errorlevel 1 ( echo [ERROR] npm install failed. & cd .. & goto :end )
)
cd ..
echo  Done.
echo.

echo [3/3] Starting servers...
echo.
echo  Backend  -^> http://localhost:5000
echo  Frontend -^> http://localhost:3000
echo  Admin    -^> http://localhost:3000/admin/login
echo.

start "SSS Backend"  /d "%~dp0backend"      cmd /k "python app.py"
timeout /t 3 /nobreak >nul
start "SSS Frontend" /d "%~dp0frontend-app" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo  [OK] Servers launched!
echo  Close the Backend and Frontend windows to stop them.
echo  You can close this window now.

:end
echo.
echo =====================================================
cmd /k
