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
  AlertTriangle,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Keyboard
} from 'lucide-react';
import { sound } from '../../services/soundSystem';
import { themeManager } from '../../services/themeManager';
import DecioraLogo from '../common/DecioraLogo';

export default function CommandHeader({
  scenario,
  elapsedSeconds,
  isRunning,
  onTogglePlay,
  speedMultiplier,
  onToggleSpeed,
  onReset,
  onExit,
  communicationState,
  onOpenShortcuts
}) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNVG, setIsNVG] = useState(themeManager.isNightVision());

  useEffect(() => {
    const unsubSound = sound.subscribe((muted) => setIsMuted(muted));
    const unsubTheme = themeManager.subscribe((nvg) => setIsNVG(nvg));
    return () => {
      unsubSound();
      unsubTheme();
    };
  }, []);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        sound.toggleMute();
      } else if (e.key === 't' || e.key === 'T') {
        themeManager.toggleNightVision();
      } else if (e.key === '?') {
        if (onOpenShortcuts) onOpenShortcuts();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onExit, onOpenShortcuts]);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

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
    <header className="sticky top-0 z-40 bg-[#07111F]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-2.5 shadow-lg select-none">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand Emblem, Exit & Mission Identifier */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onExit}
            className="p-1.5 rounded-lg bg-[#12263A] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--border-medium)] transition-colors"
            title="Return to Catalog (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="hidden sm:block">
            <DecioraLogo size="xs" showText={false} animated={true} />
          </div>

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
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Mission Elapsed Timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0D1B2A] border border-[var(--border-subtle)] font-mono">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span className="text-xs text-[var(--text-muted)] uppercase">T+</span>
            <span className="text-base font-bold text-white tracking-wider">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {/* Comm Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border font-mono text-xs transition-all ${badge.bg}`}>
            <Radio className="w-3.5 h-3.5" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase hidden md:inline">COMMS:</span>
            <span className="font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {communicationState.statusText || badge.label}
            </span>
          </div>
        </div>

        {/* Right: Audio, Speed, Fullscreen, and Control Actions */}
        <div className="flex items-center gap-2">
          {/* Simulation Speed */}
          <button
            onClick={onToggleSpeed}
            className={`px-2 py-1 rounded-lg border font-mono text-xs font-bold transition-colors flex items-center gap-1 ${
              speedMultiplier > 1 
                ? 'bg-[var(--accent-cyan)]/20 border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                : 'bg-[#12263A] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
            }`}
            title="Toggle Simulation Speed (1x / 2x)"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{speedMultiplier}x</span>
          </button>

          {/* Night-Vision Phosphor Green CRT HUD Mode */}
          <button
            onClick={() => themeManager.toggleNightVision()}
            className={`p-1.5 rounded-lg border font-mono text-xs transition-colors hidden sm:flex items-center gap-1 ${
              isNVG
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-[#12263A] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)]'
            }`}
            title="Toggle Night-Vision Phosphor Green HUD (T)"
          >
            {isNVG ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenShortcuts) onOpenShortcuts();
            }}
            className="p-1.5 rounded-lg bg-[#12263A] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)] transition-colors hidden sm:flex"
            title="Open Keyboard Hotkey Dossier (?)"
          >
            <Keyboard className="w-4 h-4 text-[var(--accent-cyan)]" />
          </button>

          {/* Fullscreen Immersion Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#12263A] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)] transition-colors hidden sm:flex"
            title="Toggle Fullscreen Immersion Mode (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[var(--accent-cyan)]" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Audio Squelch Mute Button */}
          <button
            onClick={() => sound.toggleMute()}
            className={`p-1.5 rounded-lg border font-mono text-xs transition-colors ${
              isMuted 
                ? 'bg-[#12263A] border-[var(--border-subtle)] text-[var(--text-muted)]' 
                : 'bg-[#12263A] border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] hover:bg-[var(--border-accent)]'
            }`}
            title={isMuted ? 'Unmute Audio (M)' : 'Mute Tactical Audio (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border transition-all ${
              isRunning
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
            }`}
            title="Pause / Resume (Space)"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RESUME</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-[#12263A] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)] transition-colors"
            title="Restart Scenario"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
