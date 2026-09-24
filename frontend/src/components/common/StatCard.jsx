import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, isPositive = true, color = 'var(--primary)', subtitle }) => {
  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>
          {value}
        </div>
        {change && (
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            marginTop: '0.5rem',
            color: isPositive ? 'var(--success)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span>{isPositive ? '↑' : '↓'} {change}</span>
            <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>vs last month</span>
          </div>
        )}
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '16px',
        backgroundColor: `${color}18`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {Icon && <Icon size={28} />}
      </div>
    </div>
  );
};

export default StatCard;
