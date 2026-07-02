@echo off
echo ===================================================
echo             Starting CampusLaunch Project
echo ===================================================
echo.

:: Check Backend Dependencies
if not exist "%~dp0backend\node_modules" (
    echo [Backend] node_modules not found. Installing dependencies first...
    start "CampusLaunch Backend" cmd /k "cd /d "%~dp0backend" && npm install && npm start"
) else (
    echo [Backend] Starting server...
    start "CampusLaunch Backend" cmd /k "cd /d "%~dp0backend" && npm start"
)

:: Check Frontend Dependencies
if not exist "%~dp0frontend\node_modules" (
    echo [Frontend] node_modules not found. Installing dependencies first...
    start "CampusLaunch Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"
) else (
    echo [Frontend] Starting dev server...
    start "CampusLaunch Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
)

echo.
echo ===================================================
echo  Both services have been launched in separate windows.
echo ===================================================
pause
