@echo off
REM Windows startup script for Traffic Simulation Dashboard

echo ========================================
echo Traffic Simulation Dashboard
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Python version:
python --version
echo.
echo Node.js version:
node --version
echo.

REM Setup Backend
echo Setting up backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Installing/updating dependencies...
pip install -r requirements.txt -q
cd ..

REM Setup Frontend
echo.
echo Setting up frontend...
cd frontend
if not exist node_modules (
    echo Installing dependencies (this may take a minute)...
    call npm install -q
)
cd ..

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Open a new terminal and run:
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 2. Open another terminal and run:
echo    cd frontend
echo    npm start
echo.
echo The dashboard will open at http://localhost:3000
echo.
pause
