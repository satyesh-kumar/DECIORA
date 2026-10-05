import React, { useEffect } from 'react';
import { X, Keyboard, Command, Volume2, Moon, Maximize2, Play, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/soundSystem';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Pause or resume active tactical simulation', icon: Play },
    { key: '1 - 4', desc: 'Select tactical directive order (1 to 4)', icon: CheckCircle2 },
    { key: 'Enter', desc: 'Transmit and confirm chosen directive', icon: Command },
    { key: 'M', desc: 'Toggle tactical audio squelch & telemetry sound', icon: Volume2 },
    { key: 'T', desc: 'Toggle Night-Vision Phosphor Green CRT HUD mode', icon: Moon },
    { key: 'F', desc: 'Toggle full-screen tactical immersion mode', icon: Maximize2 },
    { key: 'Esc', desc: 'Close dialogs or exit simulation to catalog', icon: X },
    { key: '?', desc: 'Toggle this tactical keyboard shortcuts dossier', icon: Keyboard }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0D1B2A] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[#07111F]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-white tracking-wide">
                TACTICAL KEYBOARD DIRECTORY
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Rapid Command Telemetry Hotkeys
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 divide-y divide-[var(--border-subtle)] max-h-[70vh] overflow-y-auto">
          {shortcuts.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-lg bg-[#12263A] text-[var(--accent-cyan)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] font-medium">
                    {s.desc}
                  </span>
                </div>
                <kbd className="px-2.5 py-1 rounded-md bg-[#07111F] border border-[var(--border-subtle)] text-[var(--accent-cyan)] font-mono text-xs font-bold shadow-inner shrink-0">
                  {s.key}
                </kbd>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#07111F]/80 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#12263A] text-white">Esc</kbd> to return</span>
          <span className="text-[var(--accent-green)] font-semibold">● DECIORA INPUT READY</span>
        </div>
      </div>
    </div>
  );
}
