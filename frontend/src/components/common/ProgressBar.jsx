import React from 'react';

const ProgressBar = ({ percentage = 0, height = 8, showLabel = false, color }) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage || 0)));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="progress-container" style={{ height: `${height}px` }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${clamped}%`,
            background: color || 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
