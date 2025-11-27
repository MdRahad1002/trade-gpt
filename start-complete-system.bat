@echo off
echo ========================================
echo TradeGPT - Complete System Startup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install/update dependencies
echo.
echo Installing/updating dependencies...
pip install -r requirements.txt --quiet

REM Check if database exists
if not exist "instance\leads.db" (
    echo.
    echo Database not found. Initializing...
    python -c "from app import init_db; init_db()"
)

REM Start the backend server
echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo Backend will run at: http://localhost:5000
echo Admin Dashboard: http://localhost:5000/admin
echo.
echo Default Admin Login:
echo   Username: trader07
echo   Password: trade123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start Flask app
start "TradeGPT Backend" cmd /k "python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Open admin dashboard in browser
echo.
echo Opening admin dashboard...
start http://localhost:5000/admin

REM Navigate back and start frontend server
cd ..

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
echo Frontend will run at: http://localhost:8000
echo.

REM Check if Python HTTP server is available
python -m http.server --help >nul 2>&1
if errorlevel 1 (
    echo Warning: Python HTTP server not available
    echo Please open index.html manually in your browser
    pause
    exit /b 1
)

REM Start frontend server
start "TradeGPT Frontend" cmd /k "python -m http.server 8000"

REM Wait for frontend to start
timeout /t 2 /nobreak >nul

REM Open frontend in browser
echo.
echo Opening landing page...
start http://localhost:8000/index.html

echo.
echo ========================================
echo TradeGPT System Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:5000
echo Admin:    http://localhost:5000/admin
echo.
echo Both servers are running in separate windows.
echo Close those windows or press Ctrl+C in them to stop.
echo.
pause
