import React from 'react';
import { 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  RotateCcw, 
  TrendingUp,
  Brain,
  HelpCircle,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { sound } from '../services/soundSystem';
import { toast } from '../services/toast';
import DecioraLogo from '../components/common/DecioraLogo';

export default function Results({ sessionData, onOpenAAR, onRestart, onGoDashboard }) {
  if (!sessionData) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-[var(--text-muted)]">No active evaluation session found.</p>
        <button onClick={onGoDashboard} className="btn btn-primary mt-4">Return to Dashboard</button>
      </div>
    );
  }

  const { score, scoreBreakdown, evaluation, decisionChosen, outcome, scenarioTitle, decisionTimeSec, commLevelMax } = sessionData;
  const breakdown = scoreBreakdown || evaluation?.breakdown || {
    decisionQuality: 26, decisionQualityMax: 30,
    informationUsage: 17, informationUsageMax: 20,
    riskManagement: 18, riskManagementMax: 20,
    decisionTime: 12, decisionTimeMax: 15,
    communication: 11, communicationMax: 15
  };

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (val >= 70) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-red-400 border-red-500/50 bg-red-500/10';
  };

  const handlePrint = () => {
    sound.playClick();
    toast.info('Generating Commander Debrief Scorecard PDF...', 'PRINT ENGINE');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="container-custom py-10 max-w-5xl">
      
      {/* Official Military Printable Header (Print Only) */}
      <div className="print-header">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 mb-6">
          <div className="flex items-center gap-3">
            <DecioraLogo size="sm" showText={false} />
            <div>
              <h1 className="text-xl font-bold font-mono tracking-wider text-slate-950">
                DECIORA COMMAND EVALUATION SCORECARD
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-600 font-mono">
                PS26048 Operational Decision Quality Assessment Dossier
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-800">
            <span className="px-2 py-0.5 border border-slate-900 font-bold bg-slate-100">
              RESTRICTED // EVALUATION ARCHIVE
            </span>
            <p className="text-[10px] text-slate-500 mt-1">SCORE: {score}/100</p>
            <p className="text-[10px] text-slate-500">DATE: {sessionData.date || new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-cyan)]/15 border border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] text-xs font-mono font-bold mb-3 uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          Mission Debrief & Evaluation
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono mb-2">
          {scenarioTitle || 'Scenario Debrief'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] font-mono">
          Evaluated under degraded communication parameters • Timestamp: {sessionData.date || 'Active Session'}
        </p>
      </div>

      {/* Main Score & Outcome Highlight Hero Card */}
      <div className="deciora-card p-6 md:p-8 bg-gradient-to-b from-[#12263A] to-[#0D1B2A] border-[var(--border-accent)] mb-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-command-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Big Circular Score Badge */}
          <div className="flex flex-col items-center text-center justify-center p-6 rounded-2xl bg-[#07111F]/80 border border-[var(--border-medium)]">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Composite Readiness Score
            </div>
            <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(score)} shadow-lg`}>
              <span className="text-5xl font-extrabold font-mono tracking-tighter">{score}</span>
              <span className="text-xs font-mono text-[var(--text-muted)]">/ 100</span>
            </div>
            <div className="mt-3 text-xs font-mono font-bold text-[var(--accent-cyan)]">
              {score >= 85 ? 'EXEMPLARY COMMAND' : score >= 70 ? 'DEFENSIBLE EXECUTION' : 'HIGH UNCERTAINTY RISK'}
            </div>
          </div>

          {/* Decision & Outcome Narrative */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">
                TRANSMITTED COMMAND DIRECTIVE:
              </div>
              <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--accent-cyan)]" />
                {decisionChosen}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07111F]/90 border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)] uppercase">Field Outcome:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  sessionData.outcomeQuality === 'optimal' || sessionData.outcomeQuality === 'success' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {sessionData.outcomeQuality === 'optimal' || sessionData.outcomeQuality === 'success' ? 'SUCCESSFUL RESOLUTION' : 'DEFENSIBLE MITIGATION'}
                </span>
              </div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed font-sans">
                {outcome || evaluation?.summary}
              </p>
            </div>

            {/* Quick Telemetry Tags */}
            <div className="flex flex-wrap gap-3 font-mono text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5 bg-[#12263A] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Decision Time: <strong className="text-white">{decisionTimeSec}s</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-[#12263A] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                Peak Degradation: <strong className="text-white">{commLevelMax}</strong>
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* 5-Axis Score Breakdown Grid */}
      <div className="mb-8">
        <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent-cyan)]" />
          Multi-Axial Competency Assessment
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          
          {/* Axis 1: Decision Quality */}
          <div className="deciora-card p-4 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
            <div className="text-[11px] text-[var(--text-muted)] uppercase mb-1">Decision Quality</div>
            <div className="text-2xl font-bold text-white mb-2">
              {breakdown.decisionQuality} <span className="text-xs text-[var(--text-muted)]">/{breakdown.decisionQualityMax || 30}</span>
            </div>
            <div className="confidence-bar-bg mb-2">
              <div 
                className="confidence-bar-fill bg-[var(--accent-cyan)]" 
                style={{ width: `${(breakdown.decisionQuality / (breakdown.decisionQualityMax || 30)) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Based on info available at decision moment (no hindsight bias)
            </div>
          </div>

          {/* Axis 2: Info Usage */}
          <div className="deciora-card p-4 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
            <div className="text-[11px] text-[var(--text-muted)] uppercase mb-1">Information Usage</div>
            <div className="text-2xl font-bold text-white mb-2">
              {breakdown.informationUsage} <span className="text-xs text-[var(--text-muted)]">/{breakdown.informationUsageMax || 20}</span>
            </div>
            <div className="confidence-bar-bg mb-2">
              <div 
                className="confidence-bar-fill bg-emerald-500" 
                style={{ width: `${(breakdown.informationUsage / (breakdown.informationUsageMax || 20)) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Cross-referenced conflicting pings before committing
            </div>
          </div>

          {/* Axis 3: Risk Management */}
          <div className="deciora-card p-4 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
            <div className="text-[11px] text-[var(--text-muted)] uppercase mb-1">Risk Management</div>
            <div className="text-2xl font-bold text-white mb-2">
              {breakdown.riskManagement} <span className="text-xs text-[var(--text-muted)]">/{breakdown.riskManagementMax || 20}</span>
            </div>
            <div className="confidence-bar-bg mb-2">
              <div 
                className="confidence-bar-fill bg-purple-500" 
                style={{ width: `${(breakdown.riskManagement / (breakdown.riskManagementMax || 20)) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Protected personnel integrity without reckless exposure
            </div>
          </div>

          {/* Axis 4: Decision Time */}
          <div className="deciora-card p-4 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
            <div className="text-[11px] text-[var(--text-muted)] uppercase mb-1">Decision Speed</div>
            <div className="text-2xl font-bold text-white mb-2">
              {breakdown.decisionTime} <span className="text-xs text-[var(--text-muted)]">/{breakdown.decisionTimeMax || 15}</span>
            </div>
            <div className="confidence-bar-bg mb-2">
              <div 
                className="confidence-bar-fill bg-sky-500" 
                style={{ width: `${(breakdown.decisionTime / (breakdown.decisionTimeMax || 15)) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Deliberate cognitive pacing under deadline pressure
            </div>
          </div>

          {/* Axis 5: Communication */}
          <div className="deciora-card p-4 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
            <div className="text-[11px] text-[var(--text-muted)] uppercase mb-1">Comm Protocol</div>
            <div className="text-2xl font-bold text-white mb-2">
              {breakdown.communication} <span className="text-xs text-[var(--text-muted)]">/{breakdown.communicationMax || 15}</span>
            </div>
            <div className="confidence-bar-bg mb-2">
              <div 
                className="confidence-bar-fill bg-amber-500" 
                style={{ width: `${(breakdown.communication / (breakdown.communicationMax || 15)) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Adapted command doctrine to signal loss
            </div>
          </div>

        </div>
      </div>

      {/* AI Qualitative Feedback Card */}
      {evaluation && (
        <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-accent)] mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                AI Decision Analysis & Tactical Feedback
              </h2>
            </div>
            {evaluation.isLiveGemini && (
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-[var(--accent-cyan)] animate-pulse" />
                POWERED BY GOOGLE GEMINI
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Strengths */}
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Observed Strengths
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-sans">
                {evaluation.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#07111F]/70 p-2.5 rounded-lg border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Areas to Refine
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-sans">
                {evaluation.weaknesses?.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#07111F]/70 p-2.5 rounded-lg border border-amber-500/20">
                    <span className="text-amber-400 font-bold shrink-0">⚠</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendation */}
          {evaluation.recommendation && (
            <div className="p-3.5 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-xs font-mono text-[var(--accent-cyan)]">
              <strong className="text-white block mb-1">COMMAND RECOMMENDATION:</strong>
              {evaluation.recommendation}
            </div>
          )}

        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="btn btn-secondary font-mono text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Scenario
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-outline font-mono text-xs flex items-center gap-2 border-[var(--accent-cyan)]/50 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/15"
            title="Print or Save Scorecard as PDF"
          >
            <Printer className="w-4 h-4" />
            Print Scorecard PDF
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoDashboard}
            className="btn btn-secondary font-mono text-xs"
          >
            Commander Dashboard
          </button>

          <button
            onClick={onOpenAAR}
            className="btn btn-primary font-mono text-xs flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            OPEN AFTER ACTION REVIEW (AAR)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
