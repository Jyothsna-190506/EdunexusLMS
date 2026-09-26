import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EduNexus Official Logo Component
 * @param {Object} props
 * @param {'full' | 'icon' | 'mark' | 'sketchbook'} props.variant - Display format
 * @param {number} props.size - Dimension of the emblem in pixels (default: 40)
 * @param {boolean} props.withLink - Whether to wrap in a Link to home (default: false)
 * @param {string} props.subtitle - Optional custom subtitle under EduNexus
 * @param {boolean} props.darkText - Whether to force dark text (e.g. on light/sketchbook backgrounds)
 * @param {string} props.className - Additional class names
 */
export const EduNexusMark = ({ size = 40, className = '', glow = true }) => {
  const id = React.useId().replace(/:/g, '');
  
  return (
    <div 
      className={`edunexus-mark-container ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: glow ? 'drop-shadow(0 4px 14px rgba(79, 70, 229, 0.35))' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <defs>
          {/* Main Primary Gradient: Electric Indigo to Royal Violet */}
          <linearGradient id={`grad-primary-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Accent Ribbon Gradient: Violet to Luminous Cyan */}
          <linearGradient id={`grad-accent-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="60%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Cap Crown Shimmer */}
          <linearGradient id={`grad-cap-${id}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="60%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Nexus Prism Glow */}
          <radialGradient id={`rad-core-${id}`} cx="50%" cy="58%" r="40%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Core Glow */}
        <circle cx="50" cy="58" r="24" fill={`url(#rad-core-${id})`} />

        {/* Outer Shield / Nexus Prism Diamond */}
        <path
          d="M50 24 L82 48 L50 90 L18 48 Z"
          fill="rgba(15, 23, 42, 0.25)"
          stroke={`url(#grad-primary-${id})`}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Interlocking Nexus Left Ribbon */}
        <path
          d="M32 46 C32 46 44 42 48 54 C52 66 38 72 42 82 L50 90 L34 72 C28 62 32 50 32 46 Z"
          fill={`url(#grad-primary-${id})`}
          opacity="0.95"
        />

        {/* Interlocking Nexus Right Ribbon (Cyan Flow) */}
        <path
          d="M68 46 C68 46 56 42 52 54 C48 66 62 72 58 82 L50 90 L66 72 C72 62 68 50 68 46 Z"
          fill={`url(#grad-accent-${id})`}
          opacity="0.95"
        />

        {/* Central Quantum Nexus Spark */}
        <polygon
          points="50,49 53,56 60,59 53,62 50,69 47,62 40,59 47,56"
          fill="#FFFFFF"
          filter="drop-shadow(0 0 4px #38BDF8)"
        />

        {/* Academic Cap / Mortarboard Top (Edu) */}
        <polygon
          points="50,10 88,27 50,44 12,27"
          fill={`url(#grad-cap-${id})`}
          stroke="#818CF8"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Cap Crown Ridge Light */}
        <path
          d="M14 27 L50 43 L86 27"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Cap Underneath Base */}
        <path
          d="M32 38 C32 38 40 44 50 44 C60 44 68 38 68 38 L68 43 C68 49 60 54 50 54 C40 54 32 49 32 43 Z"
          fill="#312E81"
          stroke={`url(#grad-primary-${id})`}
          strokeWidth="1.2"
        />

        {/* Tassel String & Bell */}
        <path
          d="M50 27 Q78 26 80 44"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="80" cy="46" r="2.4" fill="#FBBF24" />
        <path
          d="M78 48 L82 48 L83 55 L77 55 Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};

export const EduNexusLogo = ({
  variant = 'full',
  size = 42,
  withLink = true,
  subtitle = 'LMS',
  darkText = false,
  className = '',
  style = {}
}) => {
  const content = (
    <div
      className={`edunexus-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size > 32 ? '0.75rem' : '0.5rem',
        textDecoration: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <EduNexusMark size={size} />

      {variant !== 'icon' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "'Outfit', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: `${size * 0.58}px`,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Edu
            </span>
            <span
              style={{
                fontFamily: "'Outfit', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: `${size * 0.58}px`,
                letterSpacing: '-0.025em',
                color: darkText ? '#0F172A' : 'var(--text-main, #0F172A)',
                display: 'inline-block'
              }}
            >
              Nexus
            </span>
          </div>
          {subtitle && (
            <span
              style={{
                fontSize: `${Math.max(10, size * 0.24)}px`,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--primary, #4F46E5)',
                marginTop: '3px',
                opacity: 0.9
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default EduNexusLogo;
