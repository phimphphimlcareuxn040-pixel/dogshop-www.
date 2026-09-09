@echo off
chcp 65001 > nul
title Paw Paradise - One Click Server Launcher

echo ========================================================
echo 🐾 Paw Paradise - One-Click Web & Upload Server Launcher
echo ========================================================
echo.
echo 📍 Directory: %~dp0
echo 🌐 Web Address: http://localhost:8000/
echo ⚙️ Admin Zone: http://localhost:8000/admin.html
echo.
echo 🚀 Launching Web Browser & Python Upload Server...
echo --------------------------------------------------------

start http://localhost:8000/
python server.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️ Error starting server with 'python'. Trying 'python3'...
    python3 server.py
)

pause
