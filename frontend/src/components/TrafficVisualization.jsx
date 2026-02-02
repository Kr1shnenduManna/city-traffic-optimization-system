import React from 'react';

const TrafficVisualization = ({ state, title }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || !state) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas with dark background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, 300, 300);

    // Draw roads
    // North-South road
    ctx.fillStyle = '#374151';
    ctx.fillRect(100, 0, 100, 300);

    // East-West road
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 100, 300, 100);

    // Draw intersection
    ctx.fillStyle = '#111827';
    ctx.fillRect(100, 100, 100, 100);

    // Draw road markings (dashed lines)
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 300);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(300, 150);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw traffic lights
    const lightRadius = 8;
    const signalColor = state.signal_state === 'green-ns' ? '#10b981' : '#ef4444';
    const otherColor = state.signal_state === 'green-ns' ? '#ef4444' : '#10b981';

    // NS traffic light (left)
    ctx.fillStyle = state.signal_state === 'green-ns' ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(50, 150, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // EW traffic light (bottom)
    ctx.fillStyle = state.signal_state === 'green-ew' ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(150, 250, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw queues as cars (simple rectangles)
    ctx.fillStyle = '#ef4444';
    const queueNS = Math.min(state.queue_ns / 10, 8);
    const queueEW = Math.min(state.queue_ew / 10, 8);

    // Draw NS queue (above intersection)
    for (let i = 0; i < queueNS; i++) {
      ctx.fillRect(120, 80 - i * 15, 20, 12);
    }

    // Draw EW queue (left of intersection)
    for (let i = 0; i < queueEW; i++) {
      ctx.fillRect(80 - i * 15, 130, 12, 20);
    }

    // Draw labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Queue NS: ${state.queue_ns}`, 150, 30);
    ctx.fillText(`Queue EW: ${state.queue_ew}`, 30, 150);
    ctx.fillText(`Speed: ${state.avg_speed.toFixed(1)} km/h`, 150, 280);

  }, [state]);

  return (
    <div className="traffic-visualization">
      <canvas ref={canvasRef} className="traffic-canvas"></canvas>
      <div className="traffic-status">
        <div className="status-item">
          <span>Signal:</span>
          <strong>{state ? state.signal_state.toUpperCase() : 'N/A'}</strong>
        </div>
        <div className="status-item">
          <span>Cluster:</span>
          <strong>{state ? state.cluster : 'N/A'}</strong>
        </div>
      </div>
    </div>
  );
};

export default TrafficVisualization;
