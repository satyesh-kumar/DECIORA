import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Radio, 
  Eye, 
  HelpCircle, 
  ShieldAlert, 
  Navigation, 
  Maximize2, 
  Layers, 
  Activity, 
  WifiOff, 
  AlertTriangle 
} from 'lucide-react';

export default function ScenarioMap({ 
  scenario, 
  communicationState = { level: 1, signalPercent: 100 }, 
  activeEvents = [], 
  selectedDecision = null,
  compact = false 
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState('tactical'); // tactical | thermal | grid
  const [inspectedFeature, setInspectedFeature] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);

  // Animate radar sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const features = scenario?.mapConfig?.features || [];
  const isBlackout = communicationState.level >= 4 || communicationState.signalPercent <= 15;
  const isDegraded = communicationState.level >= 2;

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-[var(--border-medium)] bg-[#07111F] shadow-2xl ${
      compact ? 'h-[320px]' : 'h-[340px] sm:h-[420px] md:h-[480px] lg:h-[540px]'
    }`}>
      
      {/* Top HUD Telemetry Ribbon */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2 bg-[#07111F]/85 backdrop-blur-md border-b border-[var(--border-subtle)] text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[var(--accent-cyan)] font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            GRID: {scenario?.mapConfig?.fictionalGrid || 'SECTOR-D9'}
          </span>
          <span className="text-[var(--text-muted)] hidden sm:inline">|</span>
          <span className="text-[var(--text-secondary)] hidden sm:inline">
            COORDS: 52°07'12"N, 13°24'18"E
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center bg-[#12263A] rounded-lg p-0.5 border border-[var(--border-subtle)]">
            <button
              onClick={() => setActiveLayer('tactical')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${activeLayer === 'tactical' ? 'bg-[var(--accent-cyan)] text-[#07111F] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
            >
              Tactical
            </button>
            <button
              onClick={() => setActiveLayer('thermal')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${activeLayer === 'thermal' ? 'bg-[#EF4444] text-white font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
            >
              Thermal FLIR
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#12263A] text-white hover:bg-[var(--border-medium)] text-xs font-bold"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#12263A] text-white hover:bg-[var(--border-medium)] text-xs font-bold"
              title="Zoom Out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Vector Simulation Surface */}
      <div 
        className="w-full h-full relative transition-transform duration-300 ease-out select-none"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        <svg 
          viewBox="0 0 1000 680" 
          className={`w-full h-full ${activeLayer === 'thermal' ? 'filter hue-rotate-180 contrast-125' : ''}`}
        >
          <defs>
            {/* Background Tactical Grid Pattern */}
            <pattern id="tactical-grid-pat" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.06)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.18)" />
            </pattern>

            {/* Radar Gradient */}
            <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Uncertainty Zone Pulse Gradient */}
            <radialGradient id="uncertaintyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.3)" />
              <stop offset="60%" stopColor="rgba(245, 158, 11, 0.1)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </radialGradient>
          </defs>

          {/* Base Grid */}
          <rect width="1000" height="680" fill="#07111F" />
          <rect width="1000" height="680" fill="url(#tactical-grid-pat)" />

          {/* River Kestrel (Fictional Waterway) */}
          <path 
            d="M -20,280 Q 220,330 450,290 T 780,340 T 1020,310" 
            fill="none" 
            stroke="rgba(14, 116, 144, 0.45)" 
            strokeWidth="36" 
            strokeLinecap="round"
          />
          <path 
            d="M -20,280 Q 220,330 450,290 T 780,340 T 1020,310" 
            fill="none" 
            stroke="rgba(56, 189, 248, 0.3)" 
            strokeWidth="8" 
            strokeDasharray="16 8"
          />
          <text x="120" y="325" fill="rgba(56, 189, 248, 0.4)" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="3">
            RIVER KESTREL [SECTOR BARRIER]
          </text>

          {/* Tactical Primary Roads / Approaches */}
          {/* Main Road Alpha heading across bridge */}
          <path 
            d="M 500,680 L 500,420 L 530,290 L 520,60" 
            fill="none" 
            stroke="rgba(148, 163, 184, 0.25)" 
            strokeWidth="10" 
            strokeDasharray="8 6"
          />
          {/* Ridge road heading East */}
          <path 
            d="M 500,420 Q 640,430 780,380 T 960,330" 
            fill="none" 
            stroke="rgba(148, 163, 184, 0.18)" 
            strokeWidth="6" 
            strokeDasharray="5 5"
          />
          <text x="660" y="445" fill="rgba(148, 163, 184, 0.4)" fontSize="11" fontFamily="var(--font-mono)">
            RIDGE CORRIDOR (EAST FLANK)
          </text>

          {/* Sector Bridge Alpha (Tactical Choke Point) */}
          <g transform="translate(530, 290)">
            <rect x="-35" y="-14" width="70" height="28" fill="#1E293B" stroke="var(--accent-cyan)" strokeWidth="2.5" rx="4" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="var(--accent-cyan)" strokeWidth="2" strokeDasharray="4 3" />
            <text x="42" y="5" fill="#F8FAFC" fontSize="12" fontWeight="bold" fontFamily="var(--font-mono)">
              BRIDGE ALPHA 🌉
            </text>
            <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Village Orin (Neutral Fictional Settlement) */}
          <g transform="translate(320, 160)">
            <polygon points="0,-16 16,12 -16,12" fill="rgba(34, 197, 94, 0.2)" stroke="#22C55E" strokeWidth="1.5" />
            <rect x="-18" y="14" width="36" height="14" fill="#0D1B2A" stroke="rgba(34, 197, 94, 0.5)" rx="2" />
            <text x="24" y="10" fill="#86EFAC" fontSize="12" fontFamily="var(--font-mono)">
              VILLAGE ORIN 🏠 [NEUTRAL]
            </text>
          </g>

          {/* Kestrel Forest / Ridge Contour Zone */}
          <g transform="translate(760, 210)">
            <ellipse cx="0" cy="0" rx="90" ry="55" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="6 4" />
            <text x="-45" y="-5" fill="rgba(110, 231, 183, 0.6)" fontSize="11" fontFamily="var(--font-mono)">
              KESTREL RIDGE 🌲
            </text>
            <text x="-55" y="14" fill="rgba(110, 231, 183, 0.4)" fontSize="10" fontFamily="var(--font-mono)">
              ELEVATION +140M
            </text>
          </g>

          {/* Command HQ (Base Echo) */}
          <g transform="translate(220, 540)">
            <rect x="-24" y="-24" width="48" height="48" fill="#12263A" stroke="var(--accent-cyan)" strokeWidth="2" rx="6" />
            <circle cx="0" cy="0" r="12" fill="rgba(56, 189, 248, 0.25)" />
            <text x="-8" y="5" fill="#38BDF8" fontSize="14" fontWeight="bold">🏢</text>
            <text x="32" y="4" fill="#F8FAFC" fontSize="12" fontWeight="bold" fontFamily="var(--font-mono)">
              COMMAND HQ ECHO
            </text>
          </g>

          {/* Signal Relay Tower Alpha-4 */}
          <g transform="translate(410, 480)">
            <circle cx="0" cy="0" r="14" fill="#12263A" stroke={isBlackout ? '#EF4444' : isDegraded ? '#F59E0B' : '#22C55E'} strokeWidth="2" />
            <text x="-8" y="5" fontSize="12">📡</text>
            {/* Animated Radio Frequency Waves if active */}
            {!isBlackout && (
              <>
                <circle cx="0" cy="0" r="24" fill="none" stroke={isDegraded ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 197, 94, 0.4)'} strokeWidth="1.5">
                  <animate attributeName="r" values="16;38" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            <text x="22" y="4" fill={isBlackout ? '#EF4444' : '#94A3B8'} fontSize="11" fontFamily="var(--font-mono)">
              RELAY A-4 {isBlackout ? '[OFFLINE]' : isDegraded ? '[74% DEGRADED]' : '[ONLINE]'}
            </text>
          </g>

          {/* Checkpoint Bravo */}
          <g transform="translate(680, 490)">
            <polygon points="0,-14 14,14 -14,14" fill="#1E293B" stroke="var(--accent-cyan)" strokeWidth="2" />
            <text x="20" y="4" fill="#F8FAFC" fontSize="12" fontFamily="var(--font-mono)">
              CHECKPOINT BRAVO
            </text>
          </g>

          {/* Friendly Ground Vanguard Team (●) */}
          <g transform="translate(480, 520)" className="cursor-pointer" onClick={() => setInspectedFeature('Team Vanguard')}>
            <circle cx="0" cy="0" r="18" fill="rgba(56, 189, 248, 0.2)" stroke="var(--accent-cyan)" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="var(--accent-cyan)" />
            <text x="-4" y="4" fill="#07111F" fontSize="10" fontWeight="bold">●</text>
            <text x="24" y="2" fill="#38BDF8" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono)">
              VANGUARD PATROL [YOU]
            </text>
            <text x="24" y="18" fill="#94A3B8" fontSize="10" fontFamily="var(--font-mono)">
              STATUS: READY (HOLDING SECTOR)
            </text>
          </g>

          {/* UAV Falcon (Recon Drone ◉) */}
          <g transform="translate(380, 240)">
            <circle cx="0" cy="0" r="14" fill="rgba(14, 165, 233, 0.2)" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="3 2" />
            <polygon points="0,-8 6,6 -6,6" fill="#38BDF8" />
            <text x="20" y="4" fill="#7DD3FC" fontSize="12" fontFamily="var(--font-mono)">
              UAV FALCON [◉]
            </text>
            {/* Field of View Cone */}
            <path 
              d="M 0,0 L 90,-45 L 90,45 Z" 
              fill="rgba(56, 189, 248, 0.08)" 
              stroke="rgba(56, 189, 248, 0.25)" 
              strokeDasharray="4 2"
            />
          </g>

          {/* Uncertainty Zone with Pulsing Alert & Question Marks */}
          <g transform="translate(680, 260)">
            {/* Gradient Area Fill */}
            <circle cx="0" cy="0" r="110" fill="url(#uncertaintyGrad)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" strokeDasharray="8 6">
              <animate attributeName="r" values="95;115;95" dur="4s" repeatCount="indefinite" />
            </circle>

            {/* Pulsing Radar Ring inside Uncertainty Zone */}
            <circle cx="0" cy="0" r="65" fill="none" stroke="rgba(245, 158, 11, 0.7)" strokeWidth="1.5">
              <animate attributeName="r" values="20;90" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Mystery / Uncertainty Symbols */}
            <text x="-8" y="10" fill="#F59E0B" fontSize="28" fontWeight="bold" fontFamily="var(--font-mono)">
              ?
            </text>
            <text x="-45" y="-55" fill="#FBBF24" fontSize="16" fontWeight="bold">?</text>
            <text x="35" y="-35" fill="#FBBF24" fontSize="18" fontWeight="bold">?</text>
            <text x="40" y="45" fill="#FBBF24" fontSize="16" fontWeight="bold">?</text>

            <text x="-80" y="85" fill="#FBBF24" fontSize="12" fontWeight="bold" fontFamily="var(--font-mono)" letterSpacing="1">
              UNCERTAIN CONTACT AREA
            </text>
            <text x="-70" y="102" fill="rgba(245, 158, 11, 0.8)" fontSize="10" fontFamily="var(--font-mono)">
              CONFLICTING BEARING DETECTED
            </text>
          </g>

          {/* Radar Sweep Effect centered over map */}
          <g transform="translate(500, 340)">
            <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
            <circle cx="0" cy="0" r="180" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
            <line x1="-300" y1="0" x2="300" y2="0" stroke="rgba(56, 189, 248, 0.08)" />
            <line x1="0" y1="-300" x2="0" y2="300" stroke="rgba(56, 189, 248, 0.08)" />

            {/* Rotating Radar Vector Line */}
            <line 
              x1="0" 
              y1="0" 
              x2={280 * Math.cos((radarAngle * Math.PI) / 180)} 
              y2={280 * Math.sin((radarAngle * Math.PI) / 180)} 
              stroke="rgba(56, 189, 248, 0.55)" 
              strokeWidth="2" 
            />
          </g>
        </svg>

        {/* Severe Degradation / Blackout Glitch Overlay */}
        {isBlackout && (
          <div className="absolute inset-0 bg-[#07111F]/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none p-6 text-center animate-pulse">
            <WifiOff className="w-14 h-14 text-[#EF4444] mb-3 animate-bounce" />
            <div className="text-xl font-bold font-mono text-[#EF4444] tracking-widest">
              ⚠ SATELLITE & TACTICAL LINK SEVERED
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-mono max-w-md mt-2">
              Downlink packets dropped. Map features are operating on last-cached telemetry coordinates. Real-time tactical position cannot be verified.
            </div>
          </div>
        )}

        {/* Mild/Moderate Interference Scanlines Overlay */}
        {isDegraded && !isBlackout && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[rgba(245,158,11,0.03)] to-transparent opacity-75 scanlines-overlay" />
        )}
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-2 inset-x-2 z-20 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#0D1B2A]/90 backdrop-blur-md rounded-lg border border-[var(--border-subtle)] text-[11px] font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-[var(--accent-cyan)] font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-cyan)] inline-block" /> Vanguard Team
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Neutral Village
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-amber-400 inline-block animate-ping" /> Uncertainty Zone
          </span>
          <span className="flex items-center gap-1.5 text-sky-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm border border-sky-400 inline-block" /> Sector Bridge
          </span>
        </div>

        <div className="text-[var(--text-muted)] text-[10px]">
          ABSTRACT TRAINING SIMULATION • NO REAL-WORLD TARGETS
        </div>
      </div>
    </div>
  );
}
