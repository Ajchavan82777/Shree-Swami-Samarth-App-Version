@echo off
title Debug - Shree Swami Samarth
color 0C

echo.
echo =====================================================
echo   SSS FOODS - DEBUG DIAGNOSTICS
echo =====================================================
echo.

echo [1] SYSTEM ENVIRONMENT
echo ----------------------
python --version 2>&1
node --version 2>&1
npm --version 2>&1
pip --version 2>&1

echo.
echo [2] BACKEND CHECKS
echo ------------------
if exist backend\app.py (echo [OK] backend/app.py found) else (echo [MISSING] backend/app.py not found)
if exist backend\requirements.txt (echo [OK] backend/requirements.txt found) else (echo [MISSING] requirements.txt not found)
if exist backend\seed\seeder.py (echo [OK] seed/seeder.py found) else (echo [MISSING] seeder.py not found)

echo.
echo [3] FRONTEND CHECKS
echo -------------------
if exist frontend-app\package.json (echo [OK] frontend-app/package.json found) else (echo [MISSING] package.json not found)
if exist frontend-app\node_modules (echo [OK] node_modules present) else (echo [WARNING] node_modules missing - run npm install)
if exist frontend-app\src\App.jsx (echo [OK] App.jsx found) else (echo [MISSING] App.jsx not found)

echo.
echo [4] PYTHON PACKAGE CHECK
echo ------------------------
cd backend
python -c "import flask; print('[OK] Flask:', flask.__version__)" 2>nul || echo [MISSING] Flask not installed - run: pip install flask
python -c "import flask_cors; print('[OK] Flask-CORS installed')" 2>nul || echo [MISSING] flask-cors - run: pip install flask-cors
python -c "import flask_jwt_extended; print('[OK] Flask-JWT installed')" 2>nul || echo [MISSING] flask-jwt-extended - run: pip install flask-jwt-extended
python -c "import werkzeug; print('[OK] Werkzeug installed')" 2>nul || echo [MISSING] werkzeug - run: pip install werkzeug
cd ..

echo.
echo [5] API CONNECTIVITY TEST
echo -------------------------
curl -s http://localhost:5000/api/health 2>nul || echo [OFFLINE] Backend not running. Start with: start.bat

echo.
echo =====================================================
echo   DEBUG COMPLETE - Review issues above
echo   To start: run start.bat
echo   To check health: run healthcheckup.bat
echo =====================================================
echo.
pause
