import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Radio, 
  Wifi, 
  WifiOff, 
  Clock, 
  ArrowLeft,
  FastForward,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../../services/soundSystem';

export default function CommandHeader({
  scenario,
  elapsedSeconds,
  isRunning,
  onTogglePlay,
  speedMultiplier,
  onToggleSpeed,
  onReset,
  onExit,
  communicationState
}) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  useEffect(() => {
    return sound.subscribe((muted) => setIsMuted(muted));
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine badge styling based on comm level
  const getCommBadge = () => {
    const lvl = communicationState.level || 1;
    switch (lvl) {
      case 1:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'STABLE [100%]'
        };
      case 2:
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          label: `DEGRADED [${communicationState.signalPercent || 74}%]`
        };
      case 3:
        return {
          bg: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
          dot: 'bg-orange-500 animate-pulse',
          label: `UNSTABLE [${communicationState.signalPercent || 42}%]`
        };
      case 4:
      default:
        return {
          bg: 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse',
          dot: 'bg-red-500',
          label: `CRITICAL BLACKOUT [${communicationState.signalPercent || 0}%]`
        };
    }
  };

  const badge = getCommBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#07111F]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-3 shadow-lg">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Exit & Mission Identifier */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onExit}
            className="p-1.5 rounded-lg bg-[#12263A] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--border-medium)] transition-colors"
            title="Return to Scenarios"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
                {scenario?.code || 'SCEN-01'}
              </span>
              <h1 className="text-sm md:text-base font-bold font-mono text-white tracking-wide">
                {scenario?.title || 'Operational Scenario'}
              </h1>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono hidden sm:block">
              {scenario?.sector || 'Sector Delta-9'}
            </div>
          </div>
        </div>

        {/* Center: Mission Clock & Communication Health Status */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mission Elapsed Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1B2A] border border-[var(--border-subtle)] font-mono">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span className="text-xs text-[var(--text-muted)] uppercase">T+</span>
            <span className="text-base font-bold text-white tracking-wider">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {/* Comm Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${badge.bg}`}>
            <Radio className="w-3.5 h-3.5" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase hidden md:inline">COMMS:</span>
            <span className="font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {communicationState.statusText || badge.label}
            </span>
          </div>
        </div>

        {/* Right: Audio, Speed, and Control Actions */}
        <div className="flex items-center gap-2">
          {/* Simulation Speed */}
          <button
            onClick={onToggleSpeed}
            className={`px-2 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors flex items-center gap-1 ${
              speedMultiplier > 1 
                ? 'bg-[var(--accent-cyan)]/20 border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                : 'bg-[#12263A] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
            }`}
            title="Toggle Simulation Speed"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{speedMultiplier}x</span>
          </button>

          {/* Audio Squelch Mute Button */}
          <button
            onClick={() => sound.toggleMute()}
            className={`p-2 rounded-lg border font-mono text-xs transition-colors ${
              isMuted 
                ? 'bg-[#12263A] border-[var(--border-subtle)] text-[var(--text-muted)]' 
                : 'bg-[#12263A] border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] hover:bg-[var(--border-accent)]'
            }`}
            title={isMuted ? 'Unmute Audio Squelch' : 'Mute Tactical Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
              isRunning
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>RESUME</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-[#12263A] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)] transition-colors"
            title="Restart Scenario"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
