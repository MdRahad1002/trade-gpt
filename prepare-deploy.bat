@echo off
REM Trade GPT Deployment Preparation Script for Windows

echo.
echo ========================================
echo  Trade GPT Deployment Preparation
echo ========================================
echo.

REM Check if backend folder exists
if not exist "backend" (
    echo [ERROR] backend folder not found
    exit /b 1
)
echo [OK] Backend folder found

REM Check files
if exist "backend\requirements.txt" (
    echo [OK] requirements.txt exists
) else (
    echo [INFO] requirements.txt not found - please check DEPLOYMENT_GUIDE.md
)

if exist "backend\Procfile" (
    echo [OK] Procfile exists
) else (
    echo [INFO] Procfile not found - please check DEPLOYMENT_GUIDE.md
)

if exist "netlify.toml" (
    echo [OK] netlify.toml exists
) else (
    echo [INFO] netlify.toml not found - please check DEPLOYMENT_GUIDE.md
)

echo.
echo ========================================
echo  Deployment Checklist
echo ========================================
echo.
echo Backend Files:
echo   - requirements.txt
echo   - Procfile
echo   - render.yaml
echo   - app.py
echo.
echo Frontend Files:
echo   - netlify.toml
echo   - index.html
echo   - script.js
echo   - styles.css
echo   - admin folder
echo.
echo ========================================
echo  Quick Deployment Steps
echo ========================================
echo.
echo 1. DEPLOY BACKEND (Railway - Easiest)
echo    - Go to https://railway.app
echo    - Sign up with GitHub
echo    - Click "New Project"
echo    - Select "Deploy from GitHub repo"
echo    - Choose your backend folder
echo    - Copy the Railway URL
echo.
echo 2. UPDATE API URLS
echo    - Open script.js
echo    - Find line with "http://localhost:5000"
echo    - Replace with your Railway URL
echo    - Do the same in admin/admin-script.js
echo.
echo 3. DEPLOY FRONTEND (Netlify - Easiest)
echo    - Go to https://netlify.com
echo    - Sign up
echo    - Click "Add new site"
echo    - Drag and drop your project folder
echo    - Done! Site is live
echo.
echo ========================================
echo  Documentation Files
echo ========================================
echo.
echo - QUICK_DEPLOY.md      (Quick start guide)
echo - DEPLOYMENT_GUIDE.md  (Complete guide)
echo - API_DOCUMENTATION.md (API reference)
echo.
echo Press any key to open the quick deploy guide...
pause >nul
notepad QUICK_DEPLOY.md
