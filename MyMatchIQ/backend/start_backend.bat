@echo off
echo Starting MyMatchIQ Backend Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if virtual environment exists, if not create one
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/upgrade pip
python -m pip install --upgrade pip --quiet

REM Install core dependencies (skip problematic ones for now)
echo Installing core dependencies...
python -m pip install fastapi uvicorn[standard] pydantic pydantic-settings sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart alembic python-dotenv --quiet

REM Try to install psycopg2-binary (may fail, but that's okay for testing)
python -m pip install psycopg2-binary --quiet 2>nul

REM Try to install numpy and pandas (may fail with Python 3.14, but we'll try)
python -m pip install numpy --quiet 2>nul
python -m pip install pandas --quiet 2>nul

echo.
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
