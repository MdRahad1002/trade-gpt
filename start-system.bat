@echo off
echo Starting Trade GPT CRM System...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

REM Activate virtual environment and install dependencies
echo Installing backend dependencies...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Start the Flask backend server
echo.
echo Starting Flask backend server on http://localhost:5000
echo Admin credentials: admin / admin123
echo.
start /b python app.py

REM Go back to root directory
cd ..

REM Start the frontend server
echo Starting frontend server on http://localhost:8000
echo.
start /b python -m http.server 8000

echo.
echo ================================
echo  Trade GPT CRM System Started!
echo ================================
echo.
echo Frontend (Landing Page): http://localhost:8000
echo Admin Dashboard: http://localhost:8000/admin/
echo Backend API: http://localhost:5000/api
echo.
echo Default admin login:
echo Username: admin
echo Password: admin123
echo.
echo Press Ctrl+C to stop servers
echo.

REM Wait for user input to keep window open
pause