@echo off
REM Start backend: creates/activates virtual environment, installs requirements, and runs app.py
SETLOCAL
cd /d "%~dp0"
echo ------------------------------------------------------------
echo Starting backend in %CD%
echo ------------------------------------------------------------


































nENDLOCALpython app.py
necho Launching backend (python app.py)...)  echo requirements.txt not found, skipping dependency install.) ELSE (  pip install -r requirements.txt  echo Installing requirements from requirements.txt...
nIF EXIST requirements.txt (python -m pip install --upgrade pip
necho Upgrading pip...call "venv\Scripts\activate.bat"
necho Activating virtual environment...)  )    exit /b 1    pause    echo Failed to create virtual environment.  IF ERRORLEVEL 1 (  python -m venv venv  echo Creating virtual environment...IF NOT EXIST "venv\Scripts\activate.bat" (REM Create virtual environment if it does not exist)  exit /b 1  pause  echo Python not found on PATH. Please install Python 3.8+ and add it to PATH.IF ERRORLEVEL 1 (python --version >nul 2>&1REM Check that python is availablen