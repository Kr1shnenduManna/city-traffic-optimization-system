# Quick Start: React Traffic Simulation Dashboard

Get your interactive traffic simulation running in minutes!

## ⚡ Fast Setup (5 minutes)

### 1. Install Backend Dependencies

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```
→ API will be ready at `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
→ App will open at `http://localhost:3000`

## 🎮 Using the Dashboard

1. **Page loads** → Simulation initializes automatically
2. **Click "▶ Play"** → Watch both controllers in action
3. **View metrics** → Compare wait times, queues, and throughput
4. **Adjust speed** → Use the speed slider for faster/slower simulation
5. **View charts** → Scroll down to see performance comparisons

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **Live Visualizations** | Canvas-based traffic intersection showing queue lengths and signal states |
| **Real-time Metrics** | Wait times, queue lengths, vehicles passed - updated live |
| **Performance Charts** | Line charts comparing wait times, queues, and throughput |
| **Playback Control** | Play, pause, step, reset with speed adjustment |
| **Side-by-Side Comparison** | Fixed-time vs Q-Learning agent in real-time |

## 🐛 Common Issues & Fixes

### "Connection refused" error
- **Backend not running?** Start it: `python app.py`
- **Wrong port?** Check both are running on default ports (5000 & 3000)

### "Data loading failed"
- Ensure these files exist:
  - `data/processed/bangalore_traffic_processed.csv`
  - `data/processed/traffic_scenarios_from_clusters_k4.csv`
  - `results/trained_q_agent.npy`

### Port already in use
- Kill existing process on that port, or change the port in `app.py` (Backend) or `.env` (Frontend)

## 📊 Understanding the Visualization

```
                    Traffic Light (Green/Red)
                            ↓
        ┌─────────────────────────────────────┐
        │                                     │
        │   N-S Road (Vertical)               │
        │                                     │
    ────┼──────────────────────────────────────┼────  E-W Road
        │                                     │
        │     INTERSECTION                    │
        │                                     │
        │                                     │
        └─────────────────────────────────────┘

Queue: Vehicles waiting (shown as colored boxes)
Signal State: Green = active direction, Red = blocked
```

## 📈 Interpreting Metrics

- **Avg Wait Time**: Lower is better (seconds)
- **Avg Queue Length**: Lower is better (fewer vehicles waiting)
- **Vehicles Passed**: Higher is better (more throughput)
- **Improvement %**: Positive % means Q-Learning is better

## 🚀 Performance Tips

- Use **1x-2x speed** for detailed observation
- Use **3x-4x speed** to quickly collect metrics
- **Reset** between runs to compare fresh scenarios

## 🔗 API Reference

All endpoints return JSON responses:

```javascript
// Initialize
POST /api/init

// Step simulation (1 or more steps)
POST /api/step
Body: { "steps": 1 }

// Get current state
GET /api/state

// Reset
POST /api/reset

// Health check
GET /api/health
```

## 📚 Next Steps

1. **Experiment**: Try different speeds and scenarios
2. **Analyze**: Look for patterns in the charts
3. **Customize**: Modify Q-Learning parameters in `backend/app.py`
4. **Extend**: Add new metrics or visualization features

## 🎓 Learn More

- See [REACT_SETUP_GUIDE.md](REACT_SETUP_GUIDE.md) for detailed setup
- Check project structure in [NAVIGATION_GUIDE.md](NAVIGATION_GUIDE.md)
- Review implementation details in [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

**Questions?** Check the troubleshooting section above or review the detailed guides!
