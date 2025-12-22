@echo off
echo Starting MyMatchIQ Backend Server (Simple Mode)...
echo.

cd /d "%~dp0"

REM Try to start with system Python
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause

