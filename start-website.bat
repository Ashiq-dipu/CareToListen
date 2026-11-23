@echo off
title Care 2 Listen — Update 1 Dev Server
echo ===================================================================
echo           CARE 2 LISTEN — V2 REDESIGN (UPDATE 1)
echo           Starting Local Development Server...
echo ===================================================================
echo.

cd /d "%~dp0"

:: Check if node_modules exists, otherwise run npm install
if not exist "node_modules\" (
    echo [INFO] First time run detected in Update 1. Installing dependencies...
    call npm install
    echo.
)

echo [INFO] Launching Care To Listen (Update 1) on http://localhost:5174/ ...
call npx vite --port 5174 --open

pause
