@echo off
setlocal enabledelayedexpansion

:: ================================================================
::  SHREE SWAMI SAMARTH - COMPLETE TEST SUITE
::  * Shows live output in CMD window
::  * Saves a log to  tests\logs\test_run_<timestamp>.txt
::  * Window stays open after run (press any key to close)
::
::  Log format per test case:
::    N) Test Case ID          - [TC_NNN]
::       Test Case             - [function_name]
::       Status                - [PASSED / FAILED]
::       Test Case Issue Found - [None  /  error message]
::       Need to Resolve       - [No    /  Yes - reason]
::
::  Exit 0 = all passed  |  Exit 1 = failures found
:: ================================================================

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"
set "TESTS_DIR=%ROOT%\tests"
set "LOGS_DIR=%ROOT%\tests\logs"
set "VENV_ACTIVATE=%ROOT%\.venv\Scripts\activate.bat"

set "TEMP_BE=%TEMP%\sss_backend_out.tmp"
set "TEMP_FE=%TEMP%\sss_frontend_out.tmp"

set BACKEND_EXIT=0
set FRONTEND_EXIT=0
set NODE_MISSING=0

:: ────────────────────────────────────────────────────────────────
::  TIMESTAMP  (wmic - locale independent)
:: ────────────────────────────────────────────────────────────────
for /f "tokens=2 delims==" %%a in (
    'wmic os get LocalDateTime /value 2^>nul'
) do set "_DT=%%a"

set "YYYY=%_DT:~0,4%"
set "MON=%_DT:~4,2%"
set "DD=%_DT:~6,2%"
set "HH=%_DT:~8,2%"
set "MI=%_DT:~10,2%"
set "SS=%_DT:~12,2%"
set "STAMP=%YYYY%-%MON%-%DD%_%HH%-%MI%-%SS%"
set "LOG_DATE=%YYYY%-%MON%-%DD%"
set "LOG_TIME=%HH%:%MI%:%SS%"
set "LOG_FILE=%LOGS_DIR%\test_run_%STAMP%.txt"

if not exist "%LOGS_DIR%" mkdir "%LOGS_DIR%"

:: ────────────────────────────────────────────────────────────────
::  BANNER
:: ────────────────────────────────────────────────────────────────
cls
echo.
echo  ================================================================
echo    SHREE SWAMI SAMARTH - FULL APPLICATION TEST SUITE
echo    Date : %LOG_DATE%    Time : %LOG_TIME%
echo  ================================================================
echo.

:: ────────────────────────────────────────────────────────────────
::  TOOL CHECK
:: ────────────────────────────────────────────────────────────────
echo  [CHECK] Verifying required tools...
echo  ----------------------------------------------------------------

python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install Python 3.10+ and add to PATH.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  [OK]    %%v

node --version >nul 2>&1
if errorlevel 1 (
    echo  [WARN]  Node.js not found. Frontend tests will be SKIPPED.
    set NODE_MISSING=1
) else (
    for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo  [OK]    Node.js %%v
)
echo.

:: ────────────────────────────────────────────────────────────────
::  PYTHON ENVIRONMENT
:: ────────────────────────────────────────────────────────────────
echo  [SETUP] Preparing Python environment...
echo  ----------------------------------------------------------------
if exist "%VENV_ACTIVATE%" (
    echo  [INFO]  Activating virtual environment...
    call "%VENV_ACTIVATE%"
) else (
    echo  [INFO]  No .venv found. Using system Python.
)
echo  [INFO]  Installing test dependencies...
pip install -q -r "%TESTS_DIR%\requirements.txt" 2>nul
echo.

:: ────────────────────────────────────────────────────────────────
::  BACKEND TESTS
:: ────────────────────────────────────────────────────────────────
echo  ================================================================
echo    [1 / 2]  BACKEND API TESTS  (pytest)
echo  ================================================================
echo.

cd /d "%ROOT%"
python -m pytest tests\backend\ -v --tb=short --no-header -p no:warnings > "%TEMP_BE%" 2>&1
set BACKEND_EXIT=%errorlevel%

type "%TEMP_BE%"
echo.

if %BACKEND_EXIT% EQU 0 (
    echo  [RESULT]  Backend Tests  .......  PASSED
) else (
    echo  [RESULT]  Backend Tests  .......  FAILED  ^^^!
)
echo.

:: ────────────────────────────────────────────────────────────────
::  FRONTEND TESTS
:: ────────────────────────────────────────────────────────────────
echo  ================================================================
echo    [2 / 2]  FRONTEND UTILITY TESTS  (Node.js)
echo  ================================================================
echo.

if "%NODE_MISSING%"=="1" (
    echo  [SKIP]  Node.js not found. Skipping frontend tests.
    echo.> "%TEMP_FE%"
    goto :generate_log
)

node "%TESTS_DIR%\frontend\test_utils.js" > "%TEMP_FE%" 2>&1
set FRONTEND_EXIT=%errorlevel%

type "%TEMP_FE%"
echo.

if %FRONTEND_EXIT% EQU 0 (
    echo  [RESULT]  Frontend Tests  .....  PASSED
) else (
    echo  [RESULT]  Frontend Tests  .....  FAILED  ^^^!
)
echo.

:: ────────────────────────────────────────────────────────────────
::  GENERATE LOG FILE
::  NOTE: Use ^> when printing file path in echo to avoid CMD
::  treating > as a redirect operator and overwriting the log.
:: ────────────────────────────────────────────────────────────────
:generate_log
echo  ================================================================
echo    Generating Log File...
echo  ================================================================
echo.

python "%TESTS_DIR%\parse_results.py" "%TEMP_BE%" "%TEMP_FE%" "%LOG_FILE%" "%LOG_DATE%" "%LOG_TIME%"

if errorlevel 1 (
    echo  [WARN]  Log generation had an issue.
) else (
    echo.
    echo  ----------------------------------------------------------------
    echo  Log saved  :  %LOG_FILE%
    echo  ----------------------------------------------------------------
)
echo.

:: ────────────────────────────────────────────────────────────────
::  FINAL SUMMARY
:: ────────────────────────────────────────────────────────────────
echo  ================================================================
echo    FINAL SUMMARY
echo  ================================================================

if %BACKEND_EXIT% EQU 0 (
    echo    Backend  Tests  :  PASSED
) else (
    echo    Backend  Tests  :  FAILED  ^^^!
)

if "%NODE_MISSING%"=="1" (
    echo    Frontend Tests  :  SKIPPED
) else if %FRONTEND_EXIT% EQU 0 (
    echo    Frontend Tests  :  PASSED
) else (
    echo    Frontend Tests  :  FAILED  ^^^!
)

echo    Log File        :  %LOG_FILE%
echo  ================================================================
echo.

set /a OVERALL=%BACKEND_EXIT%+%FRONTEND_EXIT%

if %OVERALL% GTR 0 (
    echo  [FAILED]  Some tests failed. Check the log file for details.
) else (
    echo  [SUCCESS]  All tests PASSED!
)

echo.
echo  Press any key to close this window...
pause >nul
exit /b %OVERALL%
