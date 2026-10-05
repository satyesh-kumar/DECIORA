import React from 'react';

export default function DecioraLogo({ size = 'md', showText = true, animated = false, subtitle = true }) {
  const sizeMap = {
    xs: { icon: 24, text: 'text-sm', sub: 'text-[8px]' },
    sm: { icon: 30, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' }
  };

  const config = sizeMap[size] || sizeMap.md;
  const dimension = config.icon;

  return (
    <div className="inline-flex items-center gap-2.5 select-none font-mono">
      {/* Precision Vector Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        <svg 
          viewBox="0 0 64 64" 
          width={dimension} 
          height={dimension} 
          className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
          fill="none"
        >
          <defs>
            <linearGradient id="logoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#12263A" />
              <stop offset="100%" stopColor="#07111F" />
            </linearGradient>
            <linearGradient id="logoCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Hexagonal Titanium Shield */}
          <polygon 
            points="32,4 56,18 56,46 32,60 8,46 8,18" 
            fill="url(#logoShieldGrad)" 
            stroke="#38BDF8" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          
          {/* Outer Telemetry Radar Ring */}
          <circle 
            cx="32" 
            cy="32" 
            r="21" 
            stroke="#38BDF8" 
            strokeWidth="1.2" 
            strokeDasharray="6 3" 
            opacity="0.6"
            className={animated ? 'animate-[spin_10s_linear_infinite]' : ''}
            style={{ transformOrigin: 'center center' }}
          />
          
          {/* Crosshair Notches */}
          <line x1="32" y1="13" x2="32" y2="19" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="45" x2="32" y2="51" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="32" x2="19" y2="32" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="32" x2="51" y2="32" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* Radio Waves */}
          <path d="M 23,26 A 11,11 0 0,1 41,26" fill="none" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 26,29 A 7,7 0 0,1 38,29" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />

          {/* Central Strategic Chevron / Delta Apex */}
          <polygon points="32,23 41,39 32,35 23,39" fill="url(#logoCyanGrad)" />

          {/* Core Pulse Point */}
          <circle cx="32" cy="32" r="2.5" fill="#FFFFFF" />
        </svg>

        {/* Ambient Glow Ping */}
        {animated && (
          <div className="absolute inset-0 rounded-full border border-[var(--accent-cyan)]/40 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Typography Branding */}
      {showText && (
        <div className="leading-tight">
          <div className={`font-extrabold tracking-wider text-white font-mono flex items-center gap-1.5 ${config.text}`}>
            <span>DECIORA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
          </div>
          {subtitle && (
            <div className={`text-[var(--text-muted)] tracking-widest font-mono uppercase font-semibold ${config.sub}`}>
              PS26048 SIMULATOR
            </div>
          )}
        </div>
      )}
    </div>
  );
}
