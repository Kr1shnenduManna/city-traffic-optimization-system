# React Dashboard Integration Guide

This guide explains how the React frontend integrates with your existing Q-Learning traffic optimization project.

## 📁 New Project Structure

```
city-traffic-clustering/
├── backend/                          # NEW: Flask API server
│   ├── app.py                       # Main Flask application
│   ├── requirements.txt              # Python dependencies for backend
│   ├── .gitignore
│   └── venv/                        # Virtual environment (auto-created)
│
├── frontend/                         # NEW: React dashboard
│   ├── src/
│   │   ├── App.jsx                  # Main React app component
│   │   ├── App.css                  # Styling
│   │   ├── index.jsx                # React entry point
│   │   └── components/              # Reusable components
│   │       ├── TrafficVisualization.jsx   # Canvas-based visualization
│   │       ├── MetricsDisplay.jsx        # Metrics cards
│   │       ├── SimulationControls.jsx    # Play/pause/speed controls
│   │       └── ComparisonChart.jsx      # Recharts comparison charts
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── package.json                 # JS dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── .gitignore
│   └── node_modules/               # Dependencies (auto-created)
│
├── setup.bat                         # NEW: Windows setup script
├── setup.sh                          # NEW: macOS/Linux setup script
├── REACT_QUICKSTART.md              # NEW: Quick start guide
├── REACT_SETUP_GUIDE.md             # NEW: Detailed setup guide
│
├── src/                             # EXISTING: Python modules
│   ├── q_learning_agent.py         # Used by backend API
│   ├── traffic_environment.py      # Used by backend API
│   ├── signal_controllers.py       # Used by backend API
│   ├── predictor.py                # Used by backend API
│   └── metrics_tracker.py          # Used by backend API
│
├── data/                            # EXISTING: Data files
├── results/                         # EXISTING: Model files
├── notebooks/                       # EXISTING: Jupyter notebooks
├── requirements.txt                 # EXISTING: Old Streamlit dependencies
├── streamlit_app.py                # OLD: Can be archived/deleted
├── README.md                        # EXISTING: Original README
└── ... other existing files ...
```

## 🔄 How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                           │
│           (Vite + React + Recharts)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Traffic Visualizations (Canvas)                   │  │
│  │ • Metrics Display (Live Stats)                      │  │
│  │ • Simulation Controls (Play/Pause)                  │  │
│  │ • Comparison Charts (Performance Data)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                     ↓↑ HTTP/JSON                            │
│              http://localhost:3000                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   FLASK API SERVER                          │
│           (REST API + Simulation Engine)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • /api/init - Initialize simulation                 │  │
│  │ • /api/step - Run simulation steps                  │  │
│  │ • /api/state - Get current state                    │  │
│  │ • /api/reset - Reset simulation                     │  │
│  │ • /api/stats - Get statistics                       │  │
│  └──────────────────────────────────────────────────────┘  │
│         Uses your existing Python modules ↓                 │
│              http://localhost:5000                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                SIMULATION ENGINE                            │
│           (Q-Learning + Traffic Environment)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • TrafficEnvironment - Simulates intersection       │  │
│  │ • QLearningAgent - AI decision making              │  │
│  │ • AgentController - Agent actions                  │  │
│  │ • FixedTimeController - Baseline comparisons       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔌 API Integration

The backend Flask server bridges your existing Python code with the React frontend:

### Data Flow Example

```
1. User clicks "Play" in React UI
   ↓
2. JavaScript fetch() → POST /api/init
   ↓
3. Flask initializes TrafficEnvironment and QLearningAgent
   ↓
4. Every tick: fetch() → POST /api/step
   ↓
5. Flask runs one simulation step on both controllers
   ↓
6. Returns metrics (wait time, queue length, vehicles passed)
   ↓
7. React updates visualization and charts
   ↓
8. Loop back to step 4
```

## 🚀 Key Differences from Streamlit

### Streamlit (Old)
- Single-page framework
- Reruns entire script on state change
- Limited interactivity
- All code in one file

### React + Flask (New)
- **Separation of concerns**: Frontend (UI) and Backend (Logic)
- **Real-time updates**: WebSocket-ready architecture
- **Better performance**: Only updates what changed
- **Scalable**: Easy to add features
- **Professional UI**: Full control over styling

## 🔧 What Was Changed

### ✅ What Stayed the Same
- All your Q-Learning agent code (`q_learning_agent.py`)
- Traffic environment simulation (`traffic_environment.py`)
- Signal controllers (`signal_controllers.py`)
- Data files and trained models
- Original Jupyter notebooks

### ✨ What Was Added
- **Backend Flask API** (`backend/app.py`)
- **React Dashboard** (`frontend/src/`)
- **Components** for visualization and metrics
- **Charts** for comparison (using Recharts)
- **Setup scripts** for easy installation

### ❌ What Was Removed/Optional
- Streamlit apps (can be archived)
- Direct frontend logic from Python

## 📊 Component Breakdown

### TrafficVisualization Component
- Renders a canvas-based traffic intersection
- Shows queue lengths as colored boxes
- Displays traffic light state (red/green)
- Updates in real-time as simulation runs

### MetricsDisplay Component
- Shows metrics for both controllers side-by-side
- Calculates improvements (percentage better)
- Color-coded (red for fixed, green for Q-Learning)
- Updates live as simulation progresses

### SimulationControls Component
- Play/Pause button
- Step button (advance one step)
- Reset button
- Speed slider (0.25x to 4x)
- Step counter display

### ComparisonChart Component
- Three line charts comparing:
  - Average wait time over time
  - Average queue length over time
  - Cumulative vehicles passed
- Uses Recharts library
- Updates with new data points
- Shows trends and patterns

## 🔗 Extending the Dashboard

### Adding New Metrics
1. Add calculation in `backend/app.py` step function
2. Add chart in `ComparisonChart.jsx`
3. Add card in `MetricsDisplay.jsx`

### Adding New Visualizations
1. Create new component in `frontend/src/components/`
2. Import in `App.jsx`
3. Pass required state/data as props

### Changing Colors/Styling
- Edit `frontend/src/App.css`
- CSS variables at the top for easy customization

## ⚡ Performance Considerations

- Simulation runs independently on backend
- Frontend only updates when data arrives
- Charts auto-limit to last 100 data points to prevent slowdown
- Use speed control to adjust simulation speed without freezing UI

## 🐛 Debugging

### Check Backend Logs
Watch the terminal where `python app.py` is running

### Check Browser Console
Press F12 in browser, go to Console tab

### Check Network Tab
Press F12, go to Network tab, watch API requests

### Common Issues
- CORS errors → Add Flask-CORS (already done)
- Port conflicts → Change ports in app.py or frontend
- Data loading → Check file paths in backend/app.py

## 📈 Next Steps

1. **Run the setup script** (`setup.bat` or `setup.sh`)
2. **Start the backend** from `backend/` directory
3. **Start the frontend** from `frontend/` directory
4. **Open** http://localhost:3000
5. **Experiment** with different simulations
6. **Customize** as needed for your research

## 🎓 Learning Resources

- [React Fundamentals](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [REST API Best Practices](https://restfulapi.net/)
- [Recharts Documentation](https://recharts.org/)

## 📝 Notes

- All existing Python code is preserved and reusable
- The backend can be extended to support more features
- The frontend is completely decoupled and can be replaced if needed
- Data is validated on both frontend and backend
- Easy to add WebSocket support for real-time updates in future

---

**Happy Dashboard Building! 🎉**
