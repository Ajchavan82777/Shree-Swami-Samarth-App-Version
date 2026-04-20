@echo off
title Deploy - Shree Swami Samarth
color 0A

echo.
echo =====================================================
echo   SSS FOODS - DEPLOYMENT PREPARATION
echo =====================================================
echo.

set BUILD_DIR=dist_build

echo [1/5] Cleaning old build artifacts...
if exist %BUILD_DIR% rmdir /s /q %BUILD_DIR%
mkdir %BUILD_DIR%
mkdir %BUILD_DIR%\backend
mkdir %BUILD_DIR%\frontend

echo [2/5] Copying backend...
xcopy /E /I /Q backend %BUILD_DIR%\backend >nul
echo [OK] Backend ready

echo [3/5] Building frontend production bundle...
cd frontend-app
call npm run build 2>&1
if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    cd ..
    pause
    exit /b 1
)
xcopy /E /I /Q dist ..\%BUILD_DIR%\frontend >nul
cd ..
echo [OK] Frontend built

echo [4/5] Creating production start script...
echo @echo off > %BUILD_DIR%\start_production.bat
echo start "Backend" cmd /k "cd backend && python app.py" >> %BUILD_DIR%\start_production.bat
echo timeout /t 3 /nobreak >> %BUILD_DIR%\start_production.bat
echo start "Frontend" cmd /k "cd frontend && npx serve -s . -p 80" >> %BUILD_DIR%\start_production.bat

echo [5/5] Verifying...
if exist %BUILD_DIR%\backend\app.py echo [OK] Backend app.py present
if exist %BUILD_DIR%\frontend\index.html echo [OK] Frontend index.html present

echo.
echo =====================================================
echo   BUILD COMPLETE!
echo   Output:   .\%BUILD_DIR%\
echo   Backend:  .\%BUILD_DIR%\backend\
echo   Frontend: .\%BUILD_DIR%\frontend\
echo =====================================================
echo.
echo IMPORTANT: Change admin password before production!
pause
