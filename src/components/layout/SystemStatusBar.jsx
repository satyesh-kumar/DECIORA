import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Keyboard, 
  Moon, 
  Sun,
  Volume2, 
  VolumeX, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { sound } from '../../services/soundSystem';
import { themeManager } from '../../services/themeManager';

export default function SystemStatusBar({ onOpenShortcuts }) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [isNVG, setIsNVG] = useState(themeManager.isNightVision());

  useEffect(() => {
    const unsubSound = sound.subscribe((m) => setIsMuted(m));
    const unsubTheme = themeManager.subscribe((nvg) => setIsNVG(nvg));
    return () => {
      unsubSound();
      unsubTheme();
    };
  }, []);

  return (
    <footer className="no-print mt-auto border-t border-[var(--border-subtle)] bg-[#07111F]/90 backdrop-blur-md px-4 py-2 text-[11px] font-mono text-[var(--text-muted)] select-none">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Operational System Telemetry */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-ping" />
            <span className="font-bold text-[var(--accent-green)]">SYSTEM OPERATIONAL</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-3">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>AI CORE:</span>
            <span className="text-white font-semibold flex items-center gap-1">
              GEMINI-3.8-FLASH
              <Sparkles className="w-3 h-3 text-[var(--accent-cyan)]" />
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SPEC:</span>
            <span className="text-white/80">PS26048 COMPLIANT</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-3">
            <Radio className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>LATENCY:</span>
            <span className="text-white/80">28ms HIGH-RES</span>
          </div>
        </div>

        {/* Right: Modern Quick Toggles */}
        <div className="flex items-center gap-2">
          {/* Night-Vision Phosphor Green HUD Toggle */}
          <button
            onClick={() => themeManager.toggleNightVision()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors ${
              isNVG
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-[#0D1B2A] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)]'
            }`}
            title="Toggle Night-Vision Phosphor Green CRT HUD (T)"
          >
            {isNVG ? <Sun className="w-3.5 h-3.5 text-emerald-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isNVG ? 'NVG ON' : 'NIGHT-VISION'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => sound.toggleMute()}
            className={`p-1.5 rounded-md border transition-colors ${
              isMuted
                ? 'bg-[#0D1B2A] border-[var(--border-subtle)] text-[var(--text-muted)]'
                : 'bg-[var(--accent-cyan)]/15 border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)]'
            }`}
            title={isMuted ? 'Tactical Audio Muted (M)' : 'Tactical Audio Active (M)'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Keyboard Shortcuts Dossier */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShortcuts();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0D1B2A] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-medium)] transition-colors"
            title="Open Keyboard Shortcuts (Press ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span className="hidden sm:inline">HOTKEYS</span>
            <kbd className="px-1 py-0.2 rounded bg-black/40 text-[10px] text-[var(--accent-cyan)]">?</kbd>
          </button>
        </div>

      </div>
    </footer>
  );
}
