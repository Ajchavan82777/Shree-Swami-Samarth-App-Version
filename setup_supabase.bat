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
echo    1. Collect your Supabase project credentials
echo    2. Write backend\.env
echo    3. Install Python dependencies
echo    4. Test the Supabase connection
echo.
echo  You will need (from Supabase Dashboard):
echo    - Project URL     : Settings ^> API ^> Project URL
echo    - Anon Key        : Settings ^> API ^> anon (public)
echo    - Service Role Key: Settings ^> API ^> service_role (secret)
echo.
echo =====================================================
echo.

:: ?? 1. Supabase Project URL ???????????????????????????????????????????????????
:ask_url
set "SUPABASE_URL="
echo  Enter your Supabase Project URL:
echo  (looks like: https://xxxxxxxxxxxxxx.supabase.co)
echo.
set /p SUPABASE_URL="  > "

if "!SUPABASE_URL!"=="" (
    echo  [ERROR] URL cannot be empty.
    echo.
    goto ask_url
)

echo !SUPABASE_URL! | findstr /i "supabase.co" >nul
if errorlevel 1 (
    echo  [ERROR] URL must contain supabase.co
    echo.
    goto ask_url
)

echo.
echo  [OK] Project URL accepted.
echo.

:: ?? 2. Anon Key ???????????????????????????????????????????????????????????????
:ask_anon
set "SUPABASE_ANON_KEY="
echo  Enter your Supabase Anon Key (public):
set /p SUPABASE_ANON_KEY="  > "

if "!SUPABASE_ANON_KEY!"=="" (
    echo  [ERROR] Anon key cannot be empty.
    echo.
    goto ask_anon
)
echo.
echo  [OK] Anon key accepted.
echo.

:: ?? 3. Service Role Key ???????????????????????????????????????????????????????
:ask_service
set "SUPABASE_SERVICE_ROLE_KEY="
echo  Enter your Supabase Service Role Key (secret):
set /p SUPABASE_SERVICE_ROLE_KEY="  > "

if "!SUPABASE_SERVICE_ROLE_KEY!"=="" (
    echo  [ERROR] Service role key cannot be empty.
    echo.
    goto ask_service
)
echo.
echo  [OK] Service role key accepted.
echo.

:: ?? 4. Flask JWT and Secret keys ?????????????????????????????????????????????
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

:: ?? 5. Write backend\.env ????????????????????????????????????????????????????
echo  [1/3] Writing backend\.env ...

set "WRITE_URL=!SUPABASE_URL!"
set "WRITE_ANON=!SUPABASE_ANON_KEY!"
set "WRITE_SERVICE=!SUPABASE_SERVICE_ROLE_KEY!"
set "WRITE_JWT=!JWT_KEY!"
set "WRITE_SEC=!SECRET_KEY!"

python -c "
import os
lines = [
    'SUPABASE_URL='             + os.environ['WRITE_URL'],
    'SUPABASE_ANON_KEY='        + os.environ['WRITE_ANON'],
    'SUPABASE_SERVICE_ROLE_KEY='+ os.environ['WRITE_SERVICE'],
    'JWT_SECRET_KEY='           + os.environ['WRITE_JWT'],
    'SECRET_KEY='               + os.environ['WRITE_SEC'],
    'CORS_ORIGINS=http://localhost:3000,http://localhost:5173',
    'FLASK_ENV=development',
    'PORT=5000',
]
with open('backend/.env', 'w', newline='\n') as f:
    f.write('\n'.join(lines) + '\n')
print('OK')
"

if errorlevel 1 (
    echo  [ERROR] Could not write backend\.env
    goto :fail
)
echo  [OK] backend\.env written.
echo.

:: ?? 6. Install Python dependencies ???????????????????????????????????????????
echo  [2/3] Installing Python dependencies ...
echo  (This installs the supabase Python client - may take a minute)
echo.

if exist ".venv\Scripts\pip.exe" (
    set PIP=".venv\Scripts\pip.exe"
    echo  [OK] Using virtual environment
) else (
    set PIP=pip
)

!PIP! install -q -r "backend\requirements.txt"
if errorlevel 1 (
    echo  [ERROR] pip install failed. Check your internet connection.
    goto :fail
)
echo  [OK] Dependencies installed.
echo.

:: ?? 7. Test connection ????????????????????????????????????????????????????????
echo  [3/3] Testing Supabase connection ...

set "WRITE_URL=!SUPABASE_URL!"
set "WRITE_SERVICE=!SUPABASE_SERVICE_ROLE_KEY!"

python -c "
import os, urllib.request, urllib.error, sys
url = os.environ['WRITE_URL'].rstrip('/')
key = os.environ['WRITE_SERVICE']
req = urllib.request.Request(
    url + '/rest/v1/',
    headers={'apikey': key, 'Authorization': 'Bearer ' + key}
)
try:
    urllib.request.urlopen(req, timeout=10)
    print('[OK] Supabase API connected!')
except urllib.error.HTTPError as e:
    if e.code < 500:
        print('[OK] Supabase API reachable (HTTP ' + str(e.code) + ')')
    else:
        print('[ERROR] Server returned HTTP ' + str(e.code))
        sys.exit(1)
except Exception as e:
    print('[ERROR] Cannot reach Supabase: ' + str(e))
    sys.exit(1)
"

if errorlevel 1 (
    echo.
    echo  [WARN] Connection test failed. Check your Project URL and keys.
    echo  Your .env has been saved - fix the keys and re-run if needed.
) else (
    echo.
    echo =====================================================
    echo   SETUP COMPLETE!
    echo =====================================================
    echo.
    echo  Credentials saved to backend\.env
    echo.
    echo  NEXT STEP - Run migrations manually:
    echo  ?????????????????????????????????????????????????
    echo   1. Open Supabase Dashboard
    echo   2. Go to SQL Editor
    echo   3. Paste and run: migrations\001_schema.sql
    echo   4. Then paste and run: migrations\002_seed.sql
    echo  ?????????????????????????????????????????????????
    echo.
    echo  After running migrations, start the app:
    echo    cd backend
    echo    python app.py
    echo.
    echo  Admin login:
    echo    URL     : http://localhost:5173/admin/login
    echo    Email   : admin@sssfoods.com
    echo    Password: Admin@123
    echo.
    echo =====================================================
)

echo.
goto :done

:fail
echo.
echo =====================================================
echo   SETUP FAILED - See error above
echo =====================================================
echo.

:done
echo  Press any key to exit...
pause >nul
endlocal