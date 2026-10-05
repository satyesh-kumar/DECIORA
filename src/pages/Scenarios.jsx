import React, { useState } from 'react';
import { 
  Play, 
  Radio, 
  WifiOff, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { SCENARIOS } from '../services/mockData';
import { sound } from '../services/soundSystem';

export default function Scenarios({ onSelectScenario, onBack }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  const filteredScenarios = selectedDifficulty === 'ALL'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.difficulty.toUpperCase() === selectedDifficulty);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  const getCommIcon = (profile) => {
    if (profile.summary.toLowerCase().includes('blackout')) {
      return <WifiOff className="w-4 h-4 text-red-400" />;
    }
    if (profile.summary.toLowerCase().includes('conflict')) {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
    return <Radio className="w-4 h-4 text-[var(--accent-cyan)]" />;
  };

  return (
    <div className="container-custom py-10 max-w-6xl">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] font-bold mb-1">
            <span>OPERATIONAL CATALOGUE</span>
            <span>•</span>
            <span>PS26048 MODULES</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-wide">
            TRAINING SCENARIO SELECTION
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Select a specialized simulation envelope to evaluate decision-making under uncertainty.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#12263A] p-1 rounded-lg border border-[var(--border-subtle)] font-mono text-xs">
          {['ALL', 'MEDIUM', 'HARD'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedDifficulty(tab)}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedDifficulty === tab 
                  ? 'bg-[var(--accent-cyan)] text-[#07111F] font-bold' 
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid (4 Scenarios) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScenarios.map((scenario) => {
          return (
            <div
              key={scenario.id}
              className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                {/* Header: Code & Difficulty */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
                      {scenario.code}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {scenario.sector}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getDifficultyBadge(scenario.difficulty)}`}>
                    {scenario.difficulty} DIFFICULTY
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold font-mono text-white mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
                  {scenario.title}
                </h2>

                {/* Objective */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 font-sans">
                  {scenario.objective}
                </p>

                {/* Communication Degradation Profile Tag */}
                <div className="p-3 rounded-lg bg-[#07111F]/90 border border-[var(--border-subtle)] mb-5 font-mono text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    {getCommIcon(scenario.communicationProfile)}
                    <span>{scenario.communicationProfile.summary}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Est. Duration: {Math.floor(scenario.durationSeconds / 60)}m {scenario.durationSeconds % 60}s • Decision Window: {scenario.decisionWindowSeconds}s
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Fictional Sector Simulation
                </span>

                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectScenario(scenario);
                  }}
                  className="btn btn-primary font-mono text-xs flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-[var(--accent-cyan)]/25"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  START SIMULATION
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
