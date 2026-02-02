import React from 'react';

const MetricsDisplay = ({ fixed, agent }) => {
  const calculateImprovement = (fixedVal, agentVal) => {
    if (fixedVal === 0) return 0;
    return ((fixedVal - agentVal) / fixedVal * 100).toFixed(1);
  };

  const waitTimeImprovement = calculateImprovement(fixed.avg_wait, agent.avg_wait);
  const queueImprovement = calculateImprovement(fixed.avg_queue, agent.avg_queue);
  const throughputImprovement = calculateImprovement(0, agent.total_passed - fixed.total_passed) || 
    ((agent.total_passed - fixed.total_passed) / Math.max(fixed.total_passed, 1) * 100).toFixed(1);

  return (
    <div className="metrics-display">
      <div className="metrics-grid">
        {/* Fixed Time Metrics */}
        <div className="metric-card fixed-card">
          <h4>Fixed-Time Controller</h4>
          <div className="metric-item">
            <span className="metric-label">Avg Wait Time</span>
            <span className="metric-value">{fixed.avg_wait.toFixed(2)}s</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Avg Queue Length</span>
            <span className="metric-value">{fixed.avg_queue.toFixed(2)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Vehicles Passed</span>
            <span className="metric-value">{Math.round(fixed.total_passed)}</span>
          </div>
        </div>

        {/* Q-Learning Metrics */}
        <div className="metric-card agent-card">
          <h4>Q-Learning Agent</h4>
          <div className="metric-item">
            <span className="metric-label">Avg Wait Time</span>
            <span className="metric-value">{agent.avg_wait.toFixed(2)}s</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Avg Queue Length</span>
            <span className="metric-value">{agent.avg_queue.toFixed(2)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Vehicles Passed</span>
            <span className="metric-value">{Math.round(agent.total_passed)}</span>
          </div>
        </div>

        {/* Improvements */}
        <div className="metric-card improvement-card">
          <h4>Improvements</h4>
          <div className="metric-item">
            <span className="metric-label">Wait Time Reduction</span>
            <span className={`metric-value ${waitTimeImprovement > 0 ? 'positive' : 'negative'}`}>
              {waitTimeImprovement > 0 ? '+' : ''}{waitTimeImprovement}%
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Queue Reduction</span>
            <span className={`metric-value ${queueImprovement > 0 ? 'positive' : 'negative'}`}>
              {queueImprovement > 0 ? '+' : ''}{queueImprovement}%
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Throughput Difference</span>
            <span className={`metric-value ${throughputImprovement > 0 ? 'positive' : 'negative'}`}>
              {throughputImprovement > 0 ? '+' : ''}{throughputImprovement}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
