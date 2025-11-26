@echo off
echo ========================================
echo   DEPLOYMENT CHECKLIST
echo ========================================
echo.
echo [1/4] Checking backend files...
if exist "backend\Procfile" (
    echo   ✓ Procfile found
) else (
    echo   ✗ Procfile missing! Creating...
    echo web: python app.py > backend\Procfile
)

if exist "backend\requirements.txt" (
    echo   ✓ requirements.txt found
) else (
    echo   ✗ requirements.txt missing!
)

if exist "backend\app.py" (
    echo   ✓ app.py found
) else (
    echo   ✗ app.py missing!
)

echo.
echo [2/4] Admin credentials updated:
echo   Username: trader07
echo   Password: trade123
echo.

echo [3/4] Next steps:
echo   1. Deploy backend folder to Railway
echo   2. Copy your Railway URL
echo   3. Update API URLs in:
echo      - admin/admin-script.js (line 6)
echo      - script.js (lines 275, 629)
echo   4. Re-upload to Netlify
echo.

echo [4/4] Files ready for deployment:
echo   ✓ index.html
echo   ✓ education.html
echo   ✓ admin/index.html (credentials removed)
echo   ✓ backend/app.py (new admin: trader07/trade123)
echo.

echo ========================================
echo   READ: FIX_DEPLOYMENT.md for details
echo ========================================
pause
