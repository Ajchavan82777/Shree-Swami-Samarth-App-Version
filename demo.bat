@echo off
title Shree Swami Samarth - DEMO MODE
color 0B

:: Always run from the folder containing this script
cd /d "%~dp0"

echo.
echo =====================================================
echo   SHREE SWAMI SAMARTH FOOD ^& HOSPITALITY SERVICES
echo   DEMO MODE - All sample data pre-loaded
echo =====================================================
echo.
echo  DEMO ADMIN CREDENTIALS:
echo  ========================
echo  URL      : http://localhost:3000/admin/login
echo  Email    : admin@shreeswamisamarthfoods.demo
echo  Password : Admin@123
echo.
echo  PUBLIC WEBSITE: http://localhost:3000
echo.
echo  WHAT'S IN THE DEMO:
echo  - 6 sample inquiries (corporate + wedding + events)
echo  - 4 active corporate leads (Tech Mahindra, Infosys, etc.)
echo  - 3 confirmed bookings with payment tracking
echo  - 2 quotations (one draft, one converted)
echo  - 3 invoices (paid, partial, partial)
echo  - 8 menu packages across all categories
echo  - 5 staff members
echo  - 5 client testimonials
echo =====================================================
echo.

:: Check backend folder
if not exist backend (
    echo [ERROR] backend folder not found in: %CD%
    pause
    exit /b 1
)

:: Check frontend folder
if not exist frontend-app (
    echo [ERROR] frontend-app folder not found in: %CD%
    pause
    exit /b 1
)

cd backend
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install backend dependencies. See errors above.
    pause
    exit /b 1
)
cd ..

cd frontend-app
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies.
        cd ..
        pause
        exit /b 1
    )
)
cd ..

echo Starting servers in DEMO mode...

start "SSS Backend [DEMO]" cmd /k "cd /d "%~dp0backend" && python app.py || (echo. && echo [ERROR] Backend failed to start. && pause)"
timeout /t 3 /nobreak >nul
start "SSS Frontend [DEMO]" cmd /k "cd /d "%~dp0frontend-app" && npm run dev || (echo. && echo [ERROR] Frontend failed to start. && pause)"
timeout /t 5 /nobreak >nul

start http://localhost:3000
start http://localhost:3000/admin/login

echo.
echo [DEMO] Application started! Both browser windows opened.
echo Close the Backend and Frontend windows to stop the servers.
echo.
pause
