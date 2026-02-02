import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonChart = ({ fixedData, agentData }) => {
  // Prepare data for charts
  const chartData = fixedData.map((fixed, idx) => ({
    step: fixed.step,
    fixedWait: fixed.avg_wait_time,
    agentWait: agentData[idx]?.avg_wait_time || 0,
    fixedQueue: (fixed.queue_ns + fixed.queue_ew) / 2,
    agentQueue: ((agentData[idx]?.queue_ns || 0) + (agentData[idx]?.queue_ew || 0)) / 2,
    fixedPassed: fixed.vehicles_passed,
    agentPassed: agentData[idx]?.vehicles_passed || 0,
  })).slice(-100); // Show last 100 steps

  return (
    <div className="comparison-charts">
      <h2>Real-Time Performance Comparison</h2>
      
      <div className="chart-container">
        <div className="chart">
          <h3>Average Wait Time Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="step" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="fixedWait"
                stroke="#ef4444"
                name="Fixed-Time"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="agentWait"
                stroke="#10b981"
                name="Q-Learning"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Average Queue Length Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="step" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="fixedQueue"
                stroke="#ef4444"
                name="Fixed-Time"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="agentQueue"
                stroke="#10b981"
                name="Q-Learning"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Cumulative Vehicles Passed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="step" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="fixedPassed"
                stroke="#ef4444"
                name="Fixed-Time"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="agentPassed"
                stroke="#10b981"
                name="Q-Learning"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
