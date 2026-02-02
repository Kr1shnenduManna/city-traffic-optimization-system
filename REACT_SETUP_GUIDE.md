# Traffic Signal Optimization Dashboard

A React-based interactive web application for comparing Q-Learning agent traffic control with traditional fixed-time signal controllers.

## 🚀 Features

- **Real-time Traffic Simulation**: Visualize traffic flow at an intersection
- **Dual Scenario Comparison**: Watch fixed-time vs Q-Learning agent side-by-side
- **Live Metrics**: Monitor wait times, queue lengths, and vehicle throughput
- **Interactive Charts**: Compare performance metrics in real-time
- **Playback Controls**: Play, pause, step through, and reset simulations
- **Speed Control**: Adjust simulation speed from 0.25x to 4x
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows:
   ```bash
   venv\Scripts\activate
   ```
   - macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Start the Backend Server

From the `backend` directory:

```bash
python app.py
```

The API server will start at `http://localhost:5000`

### Start the Frontend Development Server

From the `frontend` directory:

```bash
npm start
```

The React app will open at `http://localhost:3000`

## 📊 How to Use

1. **Play/Pause**: Click the "▶ Play" button to start the simulation or "⏸ Pause" to pause it
2. **Step**: Click "⏭ Step" to advance one simulation step at a time
3. **Reset**: Click "🔄 Reset" to restart the simulation from the beginning
4. **Speed Control**: Use the slider to adjust simulation speed
5. **Watch Metrics**: View real-time performance metrics in the cards below the visualizations
6. **Compare Data**: View detailed comparison charts showing the differences between both approaches

## 🔄 How the Simulation Works

### Fixed-Time Controller
- Uses predetermined signal timings based on traffic patterns
- Signal changes at fixed intervals regardless of current traffic conditions
- Serves as a baseline for comparison

### Q-Learning Agent
- Uses a trained Q-Learning reinforcement learning model
- Adapts signal timings based on current queue lengths and traffic patterns
- Makes decisions to optimize for minimum wait times and maximum throughput

## 📈 Metrics Explained

- **Avg Wait Time**: Average time vehicles wait at the intersection
- **Avg Queue Length**: Average number of vehicles waiting at any given time
- **Vehicles Passed**: Total number of vehicles that passed through the intersection
- **Wait Time Reduction**: Percentage improvement in wait times
- **Queue Reduction**: Percentage improvement in queue lengths
- **Throughput Difference**: Percentage change in vehicles passed

## 🗂️ Project Structure

```
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Main styles
│   │   ├── index.jsx         # React entry point
│   │   └── components/
│   │       ├── TrafficVisualization.jsx
│   │       ├── MetricsDisplay.jsx
│   │       ├── SimulationControls.jsx
│   │       └── ComparisonChart.jsx
│   ├── public/
│   │   └── index.html        # HTML template
│   └── package.json          # JavaScript dependencies
│
└── src/                       # Shared Python modules
    ├── q_learning_agent.py
    ├── traffic_environment.py
    ├── signal_controllers.py
    ├── predictor.py
    └── metrics_tracker.py
```

## 🔌 API Endpoints

### `POST /api/init`
Initialize the simulation environment

**Response:**
```json
{
  "status": "success",
  "message": "Simulation initialized"
}
```

### `POST /api/step`
Run simulation steps

**Request Body:**
```json
{
  "steps": 1
}
```

**Response:**
```json
{
  "status": "success",
  "fixed_metrics": [...],
  "agent_metrics": [...],
  "current_step": 42
}
```

### `GET /api/state`
Get current state of both simulations

**Response:**
```json
{
  "status": "success",
  "fixed_state": {...},
  "agent_state": {...},
  "current_step": 42
}
```

### `POST /api/reset`
Reset simulation to initial state

**Response:**
```json
{
  "status": "success",
  "message": "Simulation reset"
}
```

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy"
}
```

## 🎨 Customization

### Adjusting Simulation Parameters

Edit the initialization parameters in [backend/app.py](backend/app.py):

```python
simulation_state["agent"] = QLearningAgent(
    n_states=4,          # Number of traffic patterns
    n_queue_bins=10,     # Queue length bins
    n_actions=5,         # Number of possible actions
    lr=0.1,              # Learning rate
    gamma=0.95,          # Discount factor
)
```

### Styling Changes

Modify colors and styles in [frontend/src/App.css](frontend/src/App.css)

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, ensure Flask-CORS is installed:
```bash
pip install Flask-CORS
```

### Port Already in Use
If port 5000 or 3000 is already in use, modify the port in:
- Backend: Change `port=5000` in `app.py`
- Frontend: Set `PORT=3001` environment variable before `npm start`

### Data Not Loading
Ensure the data files exist in the correct locations:
- `data/processed/bangalore_traffic_processed.csv`
- `data/processed/traffic_scenarios_from_clusters_k4.csv`
- `results/trained_q_agent.npy`

## 📚 References

- [Q-Learning Algorithm](https://en.wikipedia.org/wiki/Q-learning)
- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Recharts Documentation](https://recharts.org)

## 📄 License

This project is part of the Traffic Clustering and Optimization research initiative.

## 👨‍💻 Author

Krishnendu Manna

## 📧 Support

For issues or questions, please check the project documentation or create an issue in the repository.

---

**Happy Traffic Optimizing! 🚗💨**
