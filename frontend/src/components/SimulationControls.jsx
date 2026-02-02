import React from 'react';

const SimulationControls = ({
  isRunning,
  speed,
  currentStep,
  onPlayPause,
  onReset,
  onStep,
  onSpeedChange,
}) => {
  return (
    <div className="simulation-controls">
      <div className="controls-group">
        <button
          className={`control-btn ${isRunning ? 'pause' : 'play'}`}
          onClick={onPlayPause}
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          className="control-btn step"
          onClick={onStep}
          title="Step one iteration"
          disabled={isRunning}
        >
          ⏭ Step
        </button>

        <button
          className="control-btn reset"
          onClick={onReset}
          title="Reset simulation"
          disabled={isRunning}
        >
          🔄 Reset
        </button>
      </div>

      <div className="controls-group">
        <label htmlFor="speed-slider">Simulation Speed:</label>
        <input
          id="speed-slider"
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="speed-slider"
        />
        <span className="speed-value">{speed.toFixed(2)}x</span>
      </div>

      <div className="controls-group">
        <div className="step-counter">
          <span>Step: <strong>{currentStep}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
