import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const SummaryPanel = ({ data }) => {
  const [downloadCSV, setDownloadCSV] = React.useState(false);

  if (!data) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/summary_csv');
      if (!res.ok) throw new Error('Failed to fetch CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'simulation_summary.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV download failed', err);
      alert('Failed to download CSV. Check console for details.');
    }
  };

  const chartData = data.per_cluster.map((c) => ({
    cluster: `${c.cluster}`,
    name: c.name,
    wait: Number(c.wait_reduction_pct.toFixed(2)),
    queue: Number(c.queue_reduction_pct.toFixed(2)),
    pass: Number(c.passed_improvement_pct.toFixed(2)),
  }));

  return (
    <div className="metric-card summary-panel">
      <h4>Simulation Summary</h4>

      <div className="metric-item">
        <span className="metric-label">Total Steps</span>
        <span className="metric-value">{data.total_steps}</span>
      </div>

      <div className="metric-item">
        <span className="metric-label">Fixed Vehicles Passed</span>
        <span className="metric-value">{data.fixed_total_passed}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Agent Vehicles Passed</span>
        <span className="metric-value">{data.agent_total_passed}</span>
      </div>

      <div className="metric-item">
        <span className="metric-label">Overall Wait Reduction</span>
        <span className="metric-value positive">{data.improvement.wait_time_reduction_pct.toFixed(1)}%</span>
      </div>

      <div style={{ marginTop: 12 }} className="text-sm text-muted">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Per-Cluster Improvements</div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="metric-card" style={{ padding: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Wait Reduction (%)</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="cluster" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="wait" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="metric-card" style={{ padding: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Queue Reduction (%)</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="cluster" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="queue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="metric-card" style={{ padding: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Throughput Improvement (%)</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="cluster" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="pass" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="per-cluster-list" style={{ marginTop: 12 }}>
          {data.per_cluster.map((c) => (
            <div key={c.cluster} className="metric-card" style={{ padding: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700 }}>{c.cluster} — {c.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{c.steps} steps</div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <div style={{ flex: 1 }}>
                  <div className="metric-label">Wait Reduction</div>
                  <div className="metric-value positive">{c.wait_reduction_pct.toFixed(1)}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="metric-label">Queue Reduction</div>
                  <div className="metric-value positive">{c.queue_reduction_pct.toFixed(1)}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="metric-label">Throughput Improvement</div>
                  <div className="metric-value positive">{c.passed_improvement_pct.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 8 }} className="text-xs text-muted">
        <strong>Cluster legend:</strong>
        <ul style={{ marginTop: 6 }}>
          {data.per_cluster.map(c => (
            <li key={`legend-${c.cluster}`}>{c.cluster}: {c.name}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={downloadCSV} onChange={(e) => setDownloadCSV(e.target.checked)} />
          <span style={{ color: '#e5e7eb' }}>Download CSV</span>
        </label>
        <div style={{ marginTop: 8 }}>
          <button className="control-btn step" onClick={handleDownload} disabled={!downloadCSV}>
            ⤓ Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
