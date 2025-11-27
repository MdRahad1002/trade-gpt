@echo off
echo ========================================
echo TradeGPT - Quick Error Fix Script
echo ========================================
echo.

echo Step 1: Checking backend directory...
cd backend
if errorlevel 1 (
    echo ERROR: Cannot find backend directory
    pause
    exit /b 1
)

echo Step 2: Activating virtual environment...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    echo ✓ Virtual environment activated
) else (
    echo WARNING: Virtual environment not found, using system Python
)

echo.
echo Step 3: Initializing database...
python init_production_db.py --force
if errorlevel 1 (
    echo.
    echo WARNING: init_production_db.py had issues, trying alternative...
    python -c "from app import init_db; init_db()"
)

echo.
echo Step 4: Verifying admin user...
python -c "from app import app, Admin; app.app_context().push(); admin = Admin.query.filter_by(username='tradeadmin').first(); print('Admin exists:', admin is not None); print('Username:', admin.username if admin else 'N/A')"

echo.
echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo Admin Credentials:
echo   Username: tradeadmin
echo   Password: adm1234
echo.
echo Access URLs:
echo   Local Admin:  http://localhost:5000/admin
echo   Local Page2:  http://localhost:5000/page2-lead-capture.html
echo   Production:   http://tradegpt.sbs/admin (use HTTP if SSL not configured)
echo.
echo Next Steps:
echo 1. Start the backend with: python app.py
echo 2. Login to admin panel
echo 3. For production: Run init_production_db.py on your server
echo.
pause
