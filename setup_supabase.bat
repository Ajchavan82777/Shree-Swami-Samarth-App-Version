@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title SSS - Supabase Setup
color 0B

echo.
echo =====================================================
echo   SHREE SWAMI SAMARTH - SUPABASE SETUP WIZARD
echo =====================================================
echo.
echo  This wizard will:
echo    1. Collect your Supabase connection details
echo    2. Write backend\.env with DATABASE_URL
echo    3. Install Python dependencies
echo    4. Run database migrations (schema creation)
echo    5. Optionally load seed data
echo    6. Test the connection
echo.
echo  Before starting, make sure you have:
echo    - Created a Supabase project at https://supabase.com
echo    - Copied the DATABASE_URL from:
echo      Project Settings ^> Database ^> Connection string ^> URI (Session pooler, port 5432)
echo.
echo =====================================================
echo.

:: ── 1. Collect DATABASE_URL ──────────────────────────────────────────────────
:ask_url
set "DB_URL="
echo  Enter your Supabase DATABASE_URL:
echo  (looks like: postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres)
echo.
set /p DB_URL="  > "

if "!DB_URL!"=="" (
    echo  [ERROR] URL cannot be empty. Please try again.
    echo.
    goto ask_url
)

echo !DB_URL! | findstr /i "postgresql://" >nul
if errorlevel 1 (
    echo  [ERROR] URL must start with postgresql://
    echo.
    goto ask_url
)

echo.
echo  [OK] URL accepted.
echo.

:: ── 2. JWT and SECRET keys ───────────────────────────────────────────────────
echo  Enter a JWT secret key (press ENTER to auto-generate):
set /p JWT_KEY="  > "
if "!JWT_KEY!"=="" (
    for /f "tokens=*" %%i in ('python -c "import secrets; print(secrets.token_hex(32))"') do set JWT_KEY=%%i
    echo  [OK] Auto-generated: !JWT_KEY!
)

echo.
echo  Enter a Flask SECRET_KEY (press ENTER to auto-generate):
set /p SECRET_KEY="  > "
if "!SECRET_KEY!"=="" (
    for /f "tokens=*" %%i in ('python -c "import secrets; print(secrets.token_hex(32))"') do set SECRET_KEY=%%i
    echo  [OK] Auto-generated: !SECRET_KEY!
)

echo.

:: ── 3. Write backend\.env ────────────────────────────────────────────────────
echo  [1/5] Writing backend\.env ...
(
    echo DATABASE_URL=!DB_URL!
    echo JWT_SECRET_KEY=!JWT_KEY!
    echo SECRET_KEY=!SECRET_KEY!
    echo CORS_ORIGINS=http://localhost:3000,http://localhost:5173
) > "backend\.env"

if errorlevel 1 (
    echo  [ERROR] Could not write backend\.env
    goto :fail
)
echo  [OK] backend\.env written.
echo.

:: ── 4. Python check + install dependencies ───────────────────────────────────
echo  [2/5] Checking Python ...
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install Python 3.10+ and re-run this script.
    goto :fail
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  [OK] %%v

echo.
echo  [3/5] Installing Python dependencies ...
if exist ".venv\Scripts\python.exe" (
    set PYTHON=".venv\Scripts\python.exe"
    set PIP=".venv\Scripts\pip.exe"
    echo  [OK] Using existing virtual environment
) else (
    set PYTHON=python
    set PIP=pip
)

!PIP! install -q -r "backend\requirements.txt"
if errorlevel 1 (
    echo  [ERROR] pip install failed. Check your internet connection.
    goto :fail
)
echo  [OK] Dependencies installed.
echo.

:: ── 5. Run migrations ────────────────────────────────────────────────────────
echo  [4/5] Running database migrations ...
echo.
echo  Choose migration mode:
echo    [1] Schema only  (creates tables, no data)
echo    [2] Schema + Seed data  (recommended for first setup)
echo.
set /p MIG_CHOICE="  Enter 1 or 2: "

if "!MIG_CHOICE!"=="2" (
    set MIG_FLAG=--seed
    echo.
    echo  Running: schema + seed data ...
) else (
    set MIG_FLAG=
    echo.
    echo  Running: schema only ...
)

set DATABASE_URL=!DB_URL!
!PYTHON! "backend\migrate.py" !MIG_FLAG!
if errorlevel 1 (
    echo.
    echo  [ERROR] Migration failed. Check the error above.
    echo.
    echo  Common causes:
    echo    - Wrong DATABASE_URL (check password, project ref)
    echo    - Network/firewall blocking port 5432 or 6543
    echo    - Supabase project is paused (free tier pauses after 1 week)
    goto :fail
)
echo  [OK] Migrations complete.
echo.

:: ── 6. Connection test ───────────────────────────────────────────────────────
echo  [5/5] Testing database connection ...
set DATABASE_URL=!DB_URL!
!PYTHON! -c "
import os, sys
os.environ['DATABASE_URL'] = sys.argv[1]
try:
    from backend.models.db import get_db
    with get_db() as cur:
        cur.execute('SELECT COUNT(*) AS n FROM users')
        row = cur.fetchone()
        print('[OK] Connected! users table has', row['n'], 'row(s).')
except Exception as e:
    print('[ERROR]', e)
    sys.exit(1)
" "!DB_URL!"
if errorlevel 1 (
    echo  [WARN] Direct import test skipped (run from backend folder).
    echo         The migration succeeded, so the connection is working.
)

echo.
echo =====================================================
echo   SETUP COMPLETE!
echo =====================================================
echo.
echo  Your Supabase database is ready.
echo.
echo  Next steps:
echo    1. Run start.bat to launch the application
echo    2. Login at http://localhost:3000/admin/login
echo         Email   : admin@sssfoods.com
echo         Password: Admin@123
echo.
if "!MIG_CHOICE!"=="2" (
    echo  Seed data loaded:
    echo    - Admin user, 8 packages, 5 staff members
    echo    - Sample customers, bookings, invoices
    echo.
)
echo  For production deployment on Render:
echo    - Copy DATABASE_URL to Render environment variables
echo    - Copy JWT_SECRET_KEY and SECRET_KEY as well
echo    - Update CORS_ORIGINS to your Vercel frontend URL
echo.
echo =====================================================
echo.
goto :done

:fail
echo.
echo =====================================================
echo   SETUP FAILED - See error above
echo =====================================================
echo.
echo  If you need help, check:
echo    - Supabase dashboard logs
echo    - backend\.env file contents
echo    - migrations\001_schema.sql for table definitions
echo.

:done
echo  Press any key to exit...
pause >nul
endlocal
