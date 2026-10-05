import React from 'react';
import { 
  Target, 
  Users, 
  Radio, 
  Shield, 
  AlertOctagon, 
  Signal, 
  WifiOff, 
  CheckCircle2, 
  Info, 
  ChevronRight 
} from 'lucide-react';
import SignalWaveform from './SignalWaveform';

export default function MissionSidebar({ 
  scenario, 
  communicationState = { level: 1, signalPercent: 100 },
  elapsedSeconds = 0 
}) {
  const signalPercent = communicationState.signalPercent ?? 100;
  const isSevere = communicationState.level >= 4 || signalPercent <= 15;

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-4">
      
      {/* Mission Objective Card */}
      <div className="deciora-card p-4 border-[var(--border-subtle)] bg-[#0D1B2A]/90">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-cyan)] font-bold">
          <Target className="w-4 h-4" />
          <span>Operational Directive</span>
        </div>
        <h2 className="text-sm font-semibold text-white mb-2 leading-snug">
          {scenario?.objective || 'Determine the safest response to uncertain sector movement.'}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {scenario?.context || 'Evaluate all incoming sensor telemetry and resolve discrepancies before committing ground assets.'}
        </p>

        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--text-muted)]">Difficulty:</span>
          <span className={`font-semibold ${
            scenario?.difficulty === 'Hard' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {scenario?.difficulty || 'Medium'}
          </span>
        </div>
      </div>

      {/* Real-time Communication Link Telemetry */}
      <div className={`deciora-card p-4 border transition-all ${
        isSevere 
          ? 'border-red-500/50 bg-red-950/20 shadow-lg shadow-red-500/10' 
          : 'border-[var(--border-subtle)] bg-[#0D1B2A]/90'
      }`}>
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
            <Radio className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span>Downlink Telemetry</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            communicationState.level === 1 ? 'bg-emerald-500/20 text-emerald-400' :
            communicationState.level === 2 ? 'bg-amber-500/20 text-amber-400' :
            communicationState.level === 3 ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400 animate-pulse'
          }`}>
            LVL {communicationState.level || 1}
          </span>
        </div>

        {/* Signal Strength Meter Bar */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--text-muted)]">Carrier Signal:</span>
            <span className="font-bold text-white">{signalPercent}%</span>
          </div>
          <div className="confidence-bar-bg">
            <div 
              className={`confidence-bar-fill transition-all duration-500 ${
                signalPercent > 70 ? 'bg-emerald-500' :
                signalPercent > 40 ? 'bg-amber-500' :
                signalPercent > 15 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${signalPercent}%` }}
            />
          </div>
        </div>

        {/* Real-time Oscillograph Waveform */}
        <div className="mb-3">
          <SignalWaveform level={communicationState.level || 1} signalPercent={signalPercent} />
        </div>

        {/* Technical Status Readout */}
        <div className="bg-[#07111F]/70 rounded-lg p-2.5 border border-[var(--border-subtle)] font-mono text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Latency:</span>
            <span className="text-white">
              {communicationState.level === 1 ? '12ms' : communicationState.level === 2 ? '+14.2s (Delay)' : '+38.5s (Critical)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Packet Integrity:</span>
            <span className={communicationState.level >= 3 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {communicationState.level === 1 ? '100%' : communicationState.level === 2 ? '82%' : communicationState.level === 3 ? '44%' : '0% (Severed)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Relay Tower A4:</span>
            <span className={isSevere ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {isSevere ? 'LINK LOST' : 'REPEATING'}
            </span>
          </div>
        </div>

        {communicationState.description && (
          <div className="mt-2.5 text-[11px] text-[var(--text-secondary)] font-mono flex items-start gap-1.5 bg-[#12263A]/80 p-2 rounded border border-[var(--border-subtle)]">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{communicationState.description}</span>
          </div>
        )}
      </div>

      {/* Available Fictional Units & Sector Assets */}
      <div className="deciora-card p-4 border-[var(--border-subtle)] bg-[#0D1B2A]/90">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-white font-bold">
          <Users className="w-4 h-4 text-[var(--accent-cyan)]" />
          <span>Deployed Units</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {/* Friendly Ground Team */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#07111F]/70 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-cyan)]" />
              <div>
                <div className="text-white font-bold">Team Vanguard</div>
                <div className="text-[10px] text-[var(--text-muted)]">4 Operators • Armored Rover</div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isSevere ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isSevere ? 'OFFLINE' : 'HOLDING'}
            </span>
          </div>

          {/* Recon UAV Falcon */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#07111F]/70 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <div>
                <div className="text-white font-bold">UAV Falcon</div>
                <div className="text-[10px] text-[var(--text-muted)]">Optical / FLIR Recon Drone</div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              elapsedSeconds >= 65 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {elapsedSeconds >= 65 ? 'WEAK SIGNAL' : 'AIRBORNE'}
            </span>
          </div>

          {/* Sector HQ */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#07111F]/70 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
              <div>
                <div className="text-white font-bold">Base Echo (HQ)</div>
                <div className="text-[10px] text-[var(--text-muted)]">Tactical Operations Center</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              OPERATIONAL
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
