import React, { useState, useEffect, useRef } from 'react';
import TrafficVisualization from './components/TrafficVisualization';
import MetricsDisplay from './components/MetricsDisplay';
import ComparisonChart from './components/ComparisonChart';
import SummaryPanel from './components/SummaryPanel';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : 'http://localhost:5000/api';

function App() {
  const [simulationState, setSimulationState] = useState({
    fixed_state: null,
    agent_state: null,
    current_step: 0,
  });
  
  const [metrics, setMetrics] = useState({
    fixed: [],
    agent: [],
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  // Initialize simulation
  useEffect(() => {
    initializeSimulation();
  }, []);

  const initializeSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/init`, { method: 'POST' });
      const data = await response.json();
      
      if (data.status === 'success') {
        getState();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to initialize simulation: ' + err.message);
    }
  };

  const getState = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/state`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setSimulationState(data);
      }
    } catch (err) {
      setError('Failed to get state: ' + err.message);
    }
  };

  const stepSimulation = async (steps = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setMetrics({
          fixed: [...metrics.fixed, ...data.fixed_metrics],
          agent: [...metrics.agent, ...data.agent_metrics],
        });
        
        await getState();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to step simulation: ' + err.message);
    }
  };

  const handlePlayPause = async () => {
    const wasRunning = isRunning;
    const newRunning = !isRunning;
    setIsRunning(newRunning);

    // If we are stopping the simulation (transition running -> stopped), fetch summary
    if (wasRunning && !newRunning) {
      try {
        const res = await fetch(`${API_BASE_URL}/stats`);
        const data = await res.json();
        if (data.status === 'success') {
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      }
    }
  };

  const handleReset = async () => {
    try {
      setIsRunning(false);
      const response = await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
      const data = await response.json();
      
      if (data.status === 'success') {
        setMetrics({ fixed: [], agent: [] });
        setSummary(null);
        await initializeSimulation();
      }
    } catch (err) {
      setError('Failed to reset simulation: ' + err.message);
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      stepSimulation(1);
    }, 1000 / speed);
    
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Auto-scroll to summary when simulation stops and summary is available
  const summaryRef = useRef(null);

  useEffect(() => {
    if (!isRunning && summary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [summary, isRunning]);

  const calculateStats = () => {
    if (metrics.fixed.length === 0 || metrics.agent.length === 0) {
      return {
        fixedStats: { avg_wait: 0, avg_queue: 0, total_passed: 0 },
        agentStats: { avg_wait: 0, avg_queue: 0, total_passed: 0 },
      };
    }

    const calcMetrics = (data) => {
      const avgWait = data.reduce((sum, m) => sum + m.avg_wait_time, 0) / data.length;
      const avgQueue = data.reduce((sum, m) => sum + (m.queue_ns + m.queue_ew), 0) / data.length / 2;
      const totalPassed = data.reduce((sum, m) => sum + m.vehicles_passed, 0);
      
      return { avg_wait: avgWait, avg_queue: avgQueue, total_passed: totalPassed };
    };

    return {
      fixedStats: calcMetrics(metrics.fixed),
      agentStats: calcMetrics(metrics.agent),
    };
  };

  const stats = calculateStats();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚦 Intelligent Traffic Signal Control System</h1>
        <p>Q-Learning Agent vs Fixed-Time Controller Comparison</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="container">
        {/* Controls */}
        <div className="simulation-controls">
          <div className="controls-group">
            <button
              onClick={handlePlayPause}
              className={`control-btn ${isRunning ? 'pause' : 'play'}`}
            >
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              onClick={handleReset}
              className="control-btn reset"
            >
              ↻ Reset
            </button>
            <button
              onClick={() => stepSimulation(1)}
              className="control-btn step"
              disabled={isRunning}
            >
              → Step
            </button>
          </div>

          <div className="controls-group">
            <label className="speed-control">
              <span className="speed-label">Speed:</span>
              <input
                id="speed-slider"
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
              <span className="speed-value">{speed}x</span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="step-counter">
              ⏱ Step: {simulationState.current_step}
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`${API_BASE_URL}/stats`);
                  const d = await res.json();
                  if (d.status === 'success') setSummary(d);
                } catch (err) {
                  console.error('Failed to fetch summary', err);
                }
              }}
              className="control-btn reset"
              disabled={isRunning}
              title={isRunning ? 'Stop the simulation to view the report' : 'Show summary report'}
            >
              📊 Show Summary
            </button>
          </div>
        </div>

        {/* Main Simulation View */}
        <div className="main-grid">
          {/* Left: Visualizations */}
          <div className="visualization-section">
            <div className="visualization-container">
              {/* Fixed-Time Controller */}
              <div className="traffic-sim">
                <h3>Fixed-Time Controller</h3>
                {simulationState.fixed_state && (
                  <TrafficVisualization
                    state={simulationState.fixed_state}
                    title="Fixed Timing"
                  />
                )}
              </div>
              
              {/* Q-Learning Agent */}
              <div className="traffic-sim">
                <h3>Q-Learning Agent</h3>
                {simulationState.agent_state && (
                  <TrafficVisualization
                    state={simulationState.agent_state}
                    title="Q-Learning Agent"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Metrics & Comparison */}
          <div className="sidebar">
            {/* Metrics Display */}
            <div className="metrics-section">
              <MetricsDisplay
                fixed={stats.fixedStats}
                agent={stats.agentStats}
              />
            </div>
          </div>
        </div>

        {/* Comparison Charts */}
        {metrics.fixed.length > 0 && metrics.agent.length > 0 && (
          <div className="charts-section">
            <ComparisonChart
              fixedData={metrics.fixed}
              agentData={metrics.agent}
            />
          </div>
        )}

        {/* Summary Report (shown after simulation stops; appears after charts) */}
        {!isRunning && summary && (
          <div ref={summaryRef} className="charts-section" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12 }}>Simulation Report</h3>
            <SummaryPanel data={summary} />
          </div>
        )}

        {/* Instructions */}
        <div className="instructions-section">
          <strong>How to use:</strong> Click Start to begin the simulation. The system will compare Fixed-Time signal control with Q-Learning Agent optimization. 
          Adjust simulation speed as needed. Watch the metrics to see real-time performance differences.
        </div>
      </div>
    </div>
  );
}

export default App;
