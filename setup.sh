#!/bin/bash
# macOS/Linux startup script for Traffic Simulation Dashboard

echo "========================================"
echo "Traffic Simulation Dashboard"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Python version:"
python3 --version
echo ""
echo "Node.js version:"
node --version
echo ""

# Setup Backend
echo "Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
echo "Activating virtual environment..."
source venv/bin/activate
echo "Installing/updating dependencies..."
pip install -q -r requirements.txt
cd ..

# Setup Frontend
echo ""
echo "Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a minute)..."
    npm install -q
fi
cd ..

echo ""
echo "========================================"
echo "Setup complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Open a new terminal and run:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "2. Open another terminal and run:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "The dashboard will open at http://localhost:3000"
echo ""
