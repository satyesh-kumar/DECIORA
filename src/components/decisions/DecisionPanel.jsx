import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  X, 
  ArrowRight,
  Flame,
  Radio
} from 'lucide-react';
import { sound } from '../../services/soundSystem';

export default function DecisionPanel({
  scenario,
  isDecisionRequired = false,
  remainingSeconds = 30,
  totalWindowSeconds = 30,
  onConfirmDecision,
  disabled = false
}) {
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const decisions = scenario?.decisions || [];

  const handleSelect = (decision) => {
    if (disabled) return;
    sound.playClick();
    setSelectedDecision(decision);
  };

  const handleOpenConfirm = () => {
    if (!selectedDecision || disabled) return;
    sound.playClick();
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    if (!selectedDecision) return;
    sound.playConfirm();
    setShowConfirmModal(false);
    onConfirmDecision(selectedDecision);
  };

  const isUrgent = remainingSeconds <= 10;

  return (
    <div className={`deciora-card p-4 transition-all duration-300 ${
      isDecisionRequired 
        ? 'border-[var(--accent-cyan)] shadow-lg shadow-[var(--accent-cyan)]/10 bg-[#0D1B2A]' 
        : 'border-[var(--border-subtle)] bg-[#0D1B2A]/70 opacity-90'
    }`}>
      
      {/* Top Banner: Decision Required & Timer Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isDecisionRequired ? 'bg-[var(--accent-cyan)] animate-ping' : 'bg-[var(--text-muted)]'}`} />
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
            Tactical Command Directive
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">
            — Select optimal course of action based on current telemetry
          </span>
        </div>

        {isDecisionRequired && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
            isUrgent 
              ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
              : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          }`}>
            <Clock className="w-4 h-4" />
            <span>DEADLINE:</span>
            <span className="text-sm">{remainingSeconds}s</span>
          </div>
        )}
      </div>

      {/* Decision Choice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {decisions.map((decision) => {
          const isSelected = selectedDecision?.id === decision.id;

          return (
            <div
              key={decision.id}
              onClick={() => handleSelect(decision)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#162E47] border-[var(--accent-cyan)] shadow-md shadow-[var(--accent-cyan)]/20 ring-1 ring-[var(--accent-cyan)]'
                  : 'bg-[#12263A]/80 border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[#12263A]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    isSelected 
                      ? 'bg-[var(--accent-cyan)] text-[#07111F]' 
                      : 'bg-[#0D1B2A] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                  }`}>
                    {decision.code}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono">
                    {decision.title}
                  </h3>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]' : 'border-[var(--border-medium)]'
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#07111F]" />}
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2 font-sans pl-8">
                {decision.description}
              </p>

              {/* Trade-off summary */}
              <div className="pl-8 text-[11px] font-mono text-[var(--text-muted)] flex items-start gap-1.5 bg-[#07111F]/50 p-2 rounded border border-[var(--border-subtle)]">
                <span className="text-amber-400 font-bold shrink-0">Trade-off:</span>
                <span>{decision.tacticalTradeoff}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Trigger Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-[var(--text-muted)] font-mono">
          {selectedDecision ? (
            <span className="text-[var(--accent-cyan)] font-medium">
              Selected: Choice {selectedDecision.code} — {selectedDecision.title}
            </span>
          ) : (
            <span>Select one option to formulate command order</span>
          )}
        </div>

        <button
          onClick={handleOpenConfirm}
          disabled={!selectedDecision || disabled}
          className={`btn btn-lg ${
            selectedDecision && !disabled 
              ? 'btn-primary' 
              : 'opacity-50 cursor-not-allowed bg-[#12263A] text-[var(--text-muted)] border-[var(--border-subtle)]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>CONFIRM TACTICAL DECISION</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* 2-Step Confirmation Modal */}
      {showConfirmModal && selectedDecision && (
        <div className="modal-backdrop">
          <div className="deciora-card p-6 max-w-lg w-full bg-[#0D1B2A] border-[var(--border-accent)] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-mono uppercase text-white">
                  Confirm Command Order
                </h3>
              </div>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)]">
                <div className="text-[10px] text-[var(--text-muted)] uppercase mb-1">SELECTED DIRECTIVE:</div>
                <div className="text-sm font-bold text-[var(--accent-cyan)] mb-1">
                  [{selectedDecision.code}] {selectedDecision.title}
                </div>
                <div className="text-[var(--text-secondary)] font-sans text-xs">
                  {selectedDecision.description}
                </div>
              </div>

              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                ⚠ Notice: Once transmitted, field assets will immediately commit to this maneuver. Telemetry evaluation will record this decision based on current information state.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary text-xs"
              >
                Cancel / Reconsider
              </button>
              <button
                onClick={handleFinalConfirm}
                className="btn btn-primary text-xs"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Transmit Order Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
