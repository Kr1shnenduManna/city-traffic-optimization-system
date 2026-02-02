# 🚦 Q-Learning Traffic Signal Optimization System

A comprehensive intelligent traffic management system using **Q-Learning reinforcement learning** to automatically optimize traffic signal timings in Bangalore. This project now includes a **modern React interactive dashboard** for real-time visualization and comparison with traditional fixed-time signal control.

## ⭐ What's New

- **🎨 React Interactive Dashboard**: Modern web-based UI with real-time visualization
- **📊 Live Performance Comparison**: Side-by-side comparison of Q-Learning vs Fixed-Time control
- **📈 Interactive Charts**: See performance metrics update in real-time
- **⚡ REST API Backend**: Scalable Flask backend for simulation engine
- **🎮 Playback Controls**: Play, pause, step, and speed control for simulations

## 📋 Project Overview

This system uses **Tabular Q-Learning** to train an agent that dynamically controls traffic signal timings to:
- ✅ Minimize vehicle queue lengths
- ✅ Reduce average wait times
- ✅ Maximize vehicle throughput
- ✅ Handle different traffic scenarios (Free Flow, Normal, Peak Congestion, Incidents)
- ✅ Show measurable improvements vs traditional controllers

**Key Technologies:**
- **Frontend**: React + Vite + Recharts (Modern Dashboard)
- **Backend**: Flask + Python (REST API)
- **ML**: Q-Learning Reinforcement Learning
- **Data**: Pandas, NumPy (data processing)
- **Visualization**: Canvas (traffic), Recharts (metrics)

## 🗂️ Project Structure

```
city-traffic-clustering/
├── backend/                               # NEW: Flask API Server
│   ├── app.py                            # Main Flask application
│   ├── requirements.txt                  # Backend dependencies
│   └── venv/                             # Virtual environment
│
├── frontend/                              # NEW: React Dashboard
│   ├── src/
│   │   ├── App.jsx                      # Main React component
│   │   ├── App.css                      # Styling
│   │   └── components/
│   │       ├── TrafficVisualization.jsx # Canvas visualization
│   │       ├── MetricsDisplay.jsx       # Metrics cards
│   │       ├── SimulationControls.jsx   # Play/pause controls
│   │       └── ComparisonChart.jsx      # Performance charts
│   ├── public/
│   │   └── index.html
│   ├── package.json                     # Frontend dependencies
│   └── vite.config.js
│
├── notebooks/
│   └── 01_Q_Learning_Agent_Training.ipynb    # Agent training (MAIN)
├── data/
│   └── processed/
│       ├── traffic_scenarios_from_clusters_k4.csv
│       └── bangalore_traffic_processed.csv
├── src/
│   ├── traffic_environment.py
│   ├── q_learning_agent.py
│   ├── signal_controllers.py
│   ├── metrics_tracker.py
│   └── predictor.py
├── results/
│   ├── trained_q_agent.npy
│   ├── training_history.json
│   └── fixed_results.csv
│
├── setup.bat                              # Windows setup script
├── setup.sh                               # macOS/Linux setup script
├── REACT_QUICKSTART.md                    # Quick start guide
├── REACT_SETUP_GUIDE.md                   # Detailed setup
├── REACT_INTEGRATION_GUIDE.md             # Architecture guide
└── README.md                              # This file
```

## 🚀 Quick Start

### The Fastest Way: Use Setup Script

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Then follow the instructions shown in the terminal.

### Manual Quick Start

#### 1. Backend Setup (Terminal 1)

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
→ API ready at `http://localhost:5000`

#### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```
→ Dashboard opens at `http://localhost:3000`

## 🎮 Using the Dashboard

1. **Automatic Initialization**: Dashboard loads and initializes the simulation
2. **Play/Pause**: Click "▶ Play" to start, "⏸ Pause" to stop
3. **Speed Control**: Adjust simulation speed (0.25x - 4x)
4. **Watch Visualizations**: See both controllers running side-by-side
5. **View Metrics**: Check real-time wait times, queues, throughput
6. **Compare Charts**: Scroll down to see performance comparisons

## 📊 Key Metrics Displayed

| Metric | Description | Goal |
|--------|-------------|------|
| Avg Wait Time | Average time vehicles spend waiting | Lower is Better |
| Avg Queue Length | Average number of vehicles in queue | Lower is Better |
| Vehicles Passed | Total vehicles processed | Higher is Better |
| Wait Time Reduction | % improvement by Q-Learning | Positive % |
| Queue Reduction | % improvement by Q-Learning | Positive % |

## 📚 Documentation

- **[REACT_QUICKSTART.md](REACT_QUICKSTART.md)** - Get running in 5 minutes
- **[REACT_SETUP_GUIDE.md](REACT_SETUP_GUIDE.md)** - Detailed setup instructions
- **[REACT_INTEGRATION_GUIDE.md](REACT_INTEGRATION_GUIDE.md)** - Architecture & customization
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Customization guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🚀 Quick Start

### The Fastest Way: Use Setup Script

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Then follow the instructions shown in the terminal.

### Manual Quick Start

#### 1. Backend Setup (Terminal 1)

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
→ API ready at `http://localhost:5000`

#### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```
→ Dashboard opens at `http://localhost:3000`

## 🎮 Using the Dashboard

1. **Automatic Initialization**: Dashboard loads and initializes the simulation
2. **Play/Pause**: Click "▶ Play" to start, "⏸ Pause" to stop
3. **Speed Control**: Adjust simulation speed (0.25x - 4x)
4. **Watch Visualizations**: See both controllers running side-by-side
5. **View Metrics**: Check real-time wait times, queues, throughput
6. **Compare Charts**: Scroll down to see performance comparisons

## 📊 Key Metrics Displayed

| Metric | Description | Goal |
|--------|-------------|------|
| Avg Wait Time | Average time vehicles spend waiting | Lower is Better |
| Avg Queue Length | Average number of vehicles in queue | Lower is Better |
| Vehicles Passed | Total vehicles processed | Higher is Better |
| Wait Time Reduction | % improvement by Q-Learning | Positive % |
| Queue Reduction | % improvement by Q-Learning | Positive % |

## 📚 Documentation

- **[REACT_QUICKSTART.md](REACT_QUICKSTART.md)** - Get running in 5 minutes
- **[REACT_SETUP_GUIDE.md](REACT_SETUP_GUIDE.md)** - Detailed setup instructions
- **[REACT_INTEGRATION_GUIDE.md](REACT_INTEGRATION_GUIDE.md)** - Architecture & customization
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - How to customize and extend
- **[REACT_IMPLEMENTATION_SUMMARY.md](REACT_IMPLEMENTATION_SUMMARY.md)** - Complete overview

## 📊 Q-Learning Agent Details

### State Space
- **4 Traffic Scenarios**: Free Flow, Normal, Peak, Incident
- **10 Queue Bins**: Discretized vehicle queue lengths
- **Total States**: 40 (4 clusters × 10 queue bins)

### Action Space
| Action | Description |
|--------|-------------|
| 0 | Default (no change) |
| 1 | Extend NS green |
| 2 | Extend EW green |
| 3 | Reduce cycle time |
| 4 | Increase cycle time |

### Hyperparameters

| Parameter | Value | Meaning |
|-----------|-------|---------|
| **α** (Learning Rate) | 0.1 | How fast agent learns |
| **γ** (Discount Factor) | 0.95 | Importance of future rewards |
| **ε** (Initial Epsilon) | 1.0 | Exploration probability |
| **ε decay** | 0.995 | Exploration reduction per step |
| **ε min** | 0.01 | Minimum exploration rate |

### Learning Equation

$$Q(s,a) \leftarrow Q(s,a) + \alpha [r + \gamma \max_{a'} Q(s',a') - Q(s,a)]$$

Where:
- $s$ = current state
- $a$ = action taken
- $r$ = reward received
- $s'$ = next state
- $\alpha$ = learning rate
- $\gamma$ = discount factor

## � Training Tips

1. **Increase Episodes**: For better convergence, modify `n_episodes` in the notebook (e.g., 500)
2. **Adjust Learning Rate**: Increase `α` (0.1→0.2) for faster learning, decrease for stability
3. **Modify Epsilon Decay**: Faster decay (0.995→0.98) encourages earlier exploitation
4. **Try Different Scenarios**: Train on specific clusters for specialized control
5. **Monitor Metrics**: Watch for reward convergence and queue reduction trends

## 🐛 Troubleshooting

### "Could not load trained agent"
- Ensure you've run the training notebook first
- Check `results/trained_q_agent.npy` exists
- Verify file permissions

### Dashboard won't start
- Check backend server is running on port 5000
- Check frontend is running on port 3000
- Verify all dependencies are installed

### Import errors
- Verify all dependencies installed: `pip install -r backend/requirements.txt` and `npm install` in frontend
- Check project root is correctly detected

## 🔄 Traffic Scenarios

### Cluster 0: Free Flow (9.15% of data)
- Traffic Volume: 32,187 vehicles/hr
- Average Speed: 38.4 km/h
- Congestion: 88.9%
- Spawn Rate: 25.5 vehicles/min

### Cluster 1: Normal (14.66% of data)
- Traffic Volume: 11,192 vehicles/hr
- Average Speed: 45.0 km/h
- Congestion: 37.2%
- Spawn Rate: 8.9 vehicles/min

### Cluster 2: Peak Congestion (24.12% of data)
- Traffic Volume: 20,425 vehicles/hr
- Average Speed: 45.1 km/h
- Congestion: 68.2%
- Spawn Rate: 16.2 vehicles/min

### Cluster 3: Incident/Disrupted (52.07% of data)
- Traffic Volume: 37,878 vehicles/hr
- Average Speed: 35.4 km/h
- Congestion: 97.6%
- Spawn Rate: 30.0 vehicles/min
- Incident Probability: 1.0 (high)

## 📁 Input Data Format

### traffic_scenarios_from_clusters_k4.csv
Cluster profiles with:
- `cluster_id`, `traffic_state_name`, `Traffic Volume`, `Average Speed`, `Congestion Level`, `spawn_rate`, `incident_prob`

### bangalore_traffic_with_clusters_k4.csv
Historical traffic data with:
- `Traffic Volume`, `Average Speed`, `Congestion Level`, `cluster` labels
- Weather conditions, incident reports, road capacity utilization

## 🎯 Training Tips

1. **Increase Episodes**: For better convergence, modify `n_episodes` in the notebook (e.g., 500)
2. **Adjust Learning Rate**: Increase `α` (0.1→0.2) for faster learning, decrease for stability
3. **Modify Epsilon Decay**: Faster decay (0.995→0.98) encourages earlier exploitation
4. **Try Different Scenarios**: Train on specific clusters for specialized control
5. **Monitor Metrics**: Watch for reward convergence and queue reduction trends

## 🐛 Troubleshooting

### "Could not load trained agent"
- Ensure you've run the training notebook first
- Check `results/trained_q_agent.npy` exists
- Verify file permissions

### Dashboard won't start
- Check backend server is running on port 5000
- Check frontend is running on port 3000
- Verify all dependencies are installed

### Import errors
- Verify all dependencies installed: `pip install -r backend/requirements.txt` and `npm install` in frontend
- Check project root is correctly detected

## 📚 References

1. **Sutton & Barto** (2018). *Reinforcement Learning: An Introduction*
2. **Watkins & Dayan** (1992). Q-Learning paper
3. **Traffic Signal Control Literature**: Deep RL for traffic signal timing optimization

## 🤝 Contributing

Improvements welcome! Consider:
- Deep Q-Networks (DQN) for larger state spaces
- Multi-agent Q-Learning for multiple intersections
- Real-time data integration
- Policy gradient methods (A3C, PPO)

## 📄 License

MIT License - Feel free to use for research, education, or commercial projects.

## 👨‍💻 Author

Created as an intelligent traffic management solution for Bangalore urban traffic optimization.

---

**Get Started Now!** Follow the [REACT_QUICKSTART.md](REACT_QUICKSTART.md) guide to run the dashboard in minutes.

Happy traffic optimizing! 🚦✨
