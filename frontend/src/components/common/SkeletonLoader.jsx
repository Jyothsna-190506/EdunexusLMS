import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  return (
    <div className="grid-auto">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            height: type === 'card' ? '360px' : '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'pulse 1.5s infinite ease-in-out',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ height: '180px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ height: '20px', width: '70%', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px' }} />
          <div style={{ height: '14px', width: '90%', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px' }} />
          <div style={{ height: '14px', width: '40%', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', marginTop: 'auto' }} />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
