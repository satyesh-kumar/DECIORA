import React, { useRef, useEffect } from 'react';
import { 
  Inbox, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Radio, 
  Flame, 
  Info, 
  WifiOff, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function InformationFeed({ 
  reports = [], 
  conflicts = [], 
  communicationState = {} 
}) {
  const feedEndRef = useRef(null);

  // Auto-scroll to latest incoming report
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reports.length]);

  const hasConflict = reports.some(r => r.isConflict);

  return (
    <div className="deciora-card h-full flex flex-col bg-[#0D1B2A]/90 border-[var(--border-subtle)] overflow-hidden">
      
      {/* Header */}
      <div className="p-3.5 border-b border-[var(--border-subtle)] bg-[#07111F]/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4 text-[var(--accent-cyan)]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Incoming Intel Feed
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#12263A] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            {reports.length} Reports
          </span>
          {hasConflict && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
              CONFLICT
            </span>
          )}
        </div>
      </div>

      {/* Conflicting Intelligence Warning Banner */}
      {hasConflict && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 p-2.5 flex items-start gap-2.5 text-xs font-mono text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-400 tracking-wide">
              ⚠ CONFLICTING REPORTS DETECTED
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">
              Ground Vanguard reports Eastward movement, while Air Raven reports Northward approach. Verify before committing.
            </div>
          </div>
        </div>
      )}

      {/* Severe Signal Disruption Banner */}
      {communicationState.level >= 4 && (
        <div className="bg-red-500/10 border-b border-red-500/30 p-2.5 flex items-start gap-2.5 text-xs font-mono text-red-300">
          <WifiOff className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-400 tracking-wide">
              ⚠ COMMUNICATION BLACKOUT IN EFFECT
            </div>
            <div className="text-[11px] text-red-200/80 mt-0.5">
              Ground patrol Vanguard OFFLINE. Recon Falcon OFFLINE. Transmissions delayed indefinitely.
            </div>
          </div>
        </div>
      )}

      {/* Live Scrollable Feed */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono">
        {reports.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-[var(--text-muted)] text-xs p-4">
            <Radio className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
            <div>Awaiting initial transmission...</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-1">Monitoring tactical downlink frequencies</div>
          </div>
        ) : (
          reports.map((report, idx) => {
            const isConflicting = report.isConflict;
            const confidence = report.confidence ?? 60;

            return (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border transition-all text-xs ${
                  isConflicting 
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-500/10' 
                    : 'bg-[#12263A]/80 border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                {/* Report Header: Source, Time, Delay */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--border-subtle)] text-[11px]">
                  <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    report.category === 'ground' ? 'text-sky-400' :
                    report.category === 'air' ? 'text-purple-400' :
                    report.category === 'intel' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {report.category === 'ground' && '● '}
                    {report.category === 'air' && '▲ '}
                    {report.category === 'intel' && '📡 '}
                    {report.source}
                  </span>

                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                    {report.delaySeconds > 0 && (
                      <span className="text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        +{report.delaySeconds}s delay
                      </span>
                    )}
                    <span>T+{report.time}s</span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-[12px] text-[var(--text-primary)] leading-relaxed mb-2.5 font-sans">
                  {report.message}
                </p>

                {/* Confidence Bar & Reliability Meta */}
                <div className="space-y-1.5 pt-1 border-t border-[var(--border-subtle)] text-[10px]">
                  <div className="flex items-center justify-between text-[var(--text-muted)]">
                    <span>Confidence Assessment:</span>
                    <span className={`font-bold ${
                      confidence >= 70 ? 'text-emerald-400' :
                      confidence >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {confidence}%
                    </span>
                  </div>
                  <div className="confidence-bar-bg">
                    <div 
                      className={`confidence-bar-fill ${
                        confidence >= 70 ? 'bg-emerald-500' :
                        confidence >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                    <span>Source Reliability:</span>
                    <span className="text-[var(--text-secondary)]">{report.reliability || 'Unconfirmed'}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>

    </div>
  );
}
