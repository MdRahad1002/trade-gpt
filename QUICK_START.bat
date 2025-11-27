@echo off
echo.
echo ========================================
echo    TradeGPT - Quick Start Guide
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Start Complete System (Frontend + Backend + Admin)
echo 2. Start Backend Only (API + Database)
echo 3. Start Frontend Only (Landing Pages)
echo 4. Open Admin Dashboard
echo 5. Run Database Migration
echo 6. Create Database Backup
echo 7. View System Status
echo 8. Install/Update Dependencies
echo 9. Exit
echo.
set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto start_complete
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto open_admin
if "%choice%"=="5" goto migrate_db
if "%choice%"=="6" goto backup_db
if "%choice%"=="7" goto system_status
if "%choice%"=="8" goto install_deps
if "%choice%"=="9" goto end

:start_complete
echo.
echo Starting Complete System...
call start-complete-system.bat
goto menu

:start_backend
echo.
echo Starting Backend Server...
cd backend
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt --quiet
echo.
echo Backend starting at http://localhost:5000
echo Press Ctrl+C to stop
python app.py
cd ..
goto menu

:start_frontend
echo.
echo Starting Frontend Server...
echo Frontend will run at http://localhost:8000
start http://localhost:8000/index.html
python -m http.server 8000
goto menu

:open_admin
echo.
echo Opening Admin Dashboard...
start http://localhost:5000/admin
echo.
echo Admin Login:
echo   Username: trader07
echo   Password: trade123
echo.
pause
goto menu

:migrate_db
echo.
echo Running Database Migration...
cd backend
python migrate_database.py
cd ..
pause
goto menu

:backup_db
echo.
echo Creating Database Backup...
cd backend
python backup_db.py backup
cd ..
pause
goto menu

:system_status
echo.
echo ========================================
echo System Status
echo ========================================
echo.
python --version
echo.
pip --version
echo.
if exist "backend\instance\leads.db" (
    echo Database: EXISTS ✓
) else (
    echo Database: NOT FOUND ✗
)
echo.
if exist "backend\venv\" (
    echo Virtual Environment: EXISTS ✓
) else (
    echo Virtual Environment: NOT FOUND ✗
)
echo.
pause
goto menu

:install_deps
echo.
echo Installing/Updating Dependencies...
cd backend
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Upgrading pip...
python -m pip install --upgrade pip
echo Installing requirements...
pip install -r requirements.txt
echo.
echo ✓ Dependencies installed!
cd ..
pause
goto menu

:menu
cls
goto start

:end
echo.
echo Thank you for using TradeGPT!
echo.
exit
