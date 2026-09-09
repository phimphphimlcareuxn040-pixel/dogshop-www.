@echo off
chcp 65001 > nul
title Paw Paradise - Admin Zone Launcher

echo ========================================================
echo ⚙️ Paw Paradise - Direct Admin Zone Launcher
echo ========================================================
echo.
echo 🌐 Opening Admin Control Panel: http://localhost:8000/admin.html
echo.
start http://localhost:8000/admin.html
python server.py

pause
