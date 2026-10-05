import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Radio, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ShieldAlert, 
  Save, 
  Download, 
  ArrowLeft, 
  RotateCcw,
  Sliders,
  ChevronRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../services/soundSystem';

export default function AAR({ sessionData, scenario, onExit }) {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [replayTime, setReplayTime] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Reflection form state
  const [reflection, setReflection] = useState({
    whyDecision: '',
    mostInfluentialInfo: '',
    unreliableInfo: '',
    repeatDecision: 'yes'
  });

  const duration = scenario?.durationSeconds || 120;
  const events = scenario?.events || [];

  // Generate enriched timeline events including user decision
  const timelineEvents = [
    {
      time: 0,
      title: 'Simulation Commenced',
      type: 'start',
      knownInfo: 'Standard baseline operations. Vanguard patrol stationed south of River Kestrel.',
      delayedInfo: 'None. Full bandwidth operational.',
      riskLevel: 'LOW',
      signalPercent: 100
    },
    ...events.map(ev => ({
      time: ev.time,
      title: ev.type === 'report' ? `Report: ${ev.source}` : ev.statusText || 'Scenario Event',
      type: ev.type,
      message: ev.message || ev.description,
      knownInfo: ev.message ? `Telemetry received: "${ev.message}" (Confidence: ${ev.confidence || 70}%)` : ev.description,
      delayedInfo: ev.delaySeconds ? `Transmitted with +${ev.delaySeconds}s latency delay over magnetic interference` : 'None',
      riskLevel: ev.isConflict ? 'HIGH (Ambiguity)' : ev.level >= 3 ? 'ELEVATED' : 'MEDIUM',
      signalPercent: ev.signalPercent ?? (ev.level === 3 ? 42 : ev.level === 2 ? 74 : 100)
    })),
    {
      time: Math.round(sessionData?.decisionTimeSec || 75),
      title: `Commander Directive: ${sessionData?.decisionChosen || 'Directive Submitted'}`,
      type: 'decision',
      knownInfo: `Transmitted order: "${sessionData?.decisionChosen}". Score evaluated at ${sessionData?.score || 85}/100.`,
      delayedInfo: 'Telemetry lock established.',
      riskLevel: 'EVALUATED',
      signalPercent: 65
    },
    {
      time: duration,
      title: 'Outcome & Debrief',
      type: 'outcome',
      knownInfo: sessionData?.outcome || 'Mission concluded successfully.',
      delayedInfo: 'All channel archives consolidated.',
      riskLevel: 'RESOLVED',
      signalPercent: 100
    }
  ].sort((a, b) => a.time - b.time);

  // Load existing reflection if previously saved
  useEffect(() => {
    if (sessionData?.id) {
      api.getAARReflection(sessionData.id).then(res => {
        if (res) {
          setReflection(res);
          setIsSaved(true);
        }
      });
    }
  }, [sessionData?.id]);

  const activeEvent = timelineEvents[selectedEventIndex] || timelineEvents[0];

  const handleSaveReflection = async (e) => {
    e.preventDefault();
    sound.playConfirm();
    if (sessionData?.id) {
      await api.saveAARReflection(sessionData.id, reflection);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleExportAAR = () => {
    sound.playClick();
    const exportData = {
      sessionId: sessionData?.id,
      scenario: scenario?.title,
      score: sessionData?.score,
      decisionTime: sessionData?.decisionTimeSec,
      decisionChosen: sessionData?.decisionChosen,
      timeline: timelineEvents,
      reflection
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DECIORA_AAR_${sessionData?.scenarioId || 'session'}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-custom py-10 max-w-6xl">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <button 
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent-cyan)] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold font-mono text-white tracking-wide">
                AFTER ACTION REVIEW (AAR)
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {scenario?.title || 'Operational Scenario'} • Post-Mission Reconstruction & Self-Reflection
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportAAR}
          className="btn btn-outline text-xs font-mono flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export AAR Data (JSON)
        </button>
      </div>

      {/* 1. SCENARIO REPLAY SCRUBBER */}
      <div className="deciora-card p-5 bg-[#0D1B2A] border-[var(--border-medium)] mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span>Interactive Timeline Replay Scrubber</span>
          </div>
          <span className="text-[var(--accent-cyan)] font-bold">
            T+{replayTime}s / {duration}s
          </span>
        </div>

        {/* Scrubber slider */}
        <input 
          type="range" 
          min="0" 
          max={duration} 
          value={replayTime}
          onChange={(e) => {
            const time = parseInt(e.target.value);
            setReplayTime(time);
            // Auto select closest event
            const closestIdx = timelineEvents.findIndex((ev, i) => {
              const next = timelineEvents[i + 1];
              return !next || (time >= ev.time && time < next.time);
            });
            if (closestIdx !== -1) setSelectedEventIndex(closestIdx);
          }}
          className="w-full h-2 bg-[#07111F] rounded-lg appearance-none cursor-pointer accent-[var(--accent-cyan)] mb-4"
        />

        {/* Visual Timeline Nodes */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 font-mono text-xs">
          {timelineEvents.map((ev, idx) => {
            const isSelected = selectedEventIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setSelectedEventIndex(idx);
                  setReplayTime(ev.time);
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all min-w-[90px] border ${
                  isSelected 
                    ? 'bg-[#162E47] border-[var(--accent-cyan)] text-white shadow-md' 
                    : 'bg-[#07111F]/70 border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <span className="text-[10px] text-[var(--accent-cyan)] font-bold">
                  00:{ev.time.toString().padStart(2, '0')}
                </span>
                <span className={`w-3 h-3 rounded-full border ${
                  ev.type === 'decision' ? 'bg-[var(--accent-cyan)] border-white' :
                  ev.type === 'report' ? 'bg-amber-400 border-amber-200' :
                  ev.type === 'outcome' ? 'bg-emerald-400 border-white' : 'bg-gray-400 border-gray-200'
                }`} />
                <span className="text-[10px] font-sans truncate max-w-[85px]">
                  {ev.title.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CLICKABLE EVENT ANALYSIS CARD */}
      <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-accent)] mb-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs font-mono">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--accent-cyan)]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Event State Reconstruction: T+{activeEvent.time}s
            </h2>
          </div>
          <span className={`px-2.5 py-0.5 rounded font-bold ${
            activeEvent.riskLevel.includes('HIGH') ? 'bg-red-500/20 text-red-400' :
            activeEvent.riskLevel.includes('MEDIUM') ? 'bg-amber-500/20 text-amber-300' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            RISK: {activeEvent.riskLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          
          <div className="p-4 rounded-xl bg-[#07111F]/90 border border-[var(--border-subtle)] space-y-1.5">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Information Available to Commander:
            </div>
            <p className="text-xs text-[var(--text-primary)] font-sans leading-relaxed">
              {activeEvent.knownInfo}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#07111F]/90 border border-[var(--border-subtle)] space-y-1.5">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Latency & Missing Information:
            </div>
            <p className="text-xs text-amber-300/90 font-sans leading-relaxed">
              {activeEvent.delayedInfo}
            </p>
          </div>

        </div>
      </div>

      {/* 3. AAR REFLECTION & SELF-ASSESSMENT QUESTIONS */}
      <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)]">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
          <MessageSquare className="w-5 h-5 text-[var(--accent-cyan)]" />
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Commander Self-Reflection & Cognition Log
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Answers are archived for Instructor performance analysis.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveReflection} className="space-y-4">
          
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-mono font-bold text-white mb-1.5">
              1. Why did you make this decision?
            </label>
            <textarea
              rows="2"
              value={reflection.whyDecision}
              onChange={(e) => setReflection({ ...reflection, whyDecision: e.target.value })}
              placeholder="e.g. Given the conflicting direction between ground visual and air thermal sensor, sending a drone minimized exposure..."
              className="deciora-input resize-none"
            />
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-mono font-bold text-white mb-1.5">
              2. What specific piece of information influenced you most?
            </label>
            <input
              type="text"
              value={reflection.mostInfluentialInfo}
              onChange={(e) => setReflection({ ...reflection, mostInfluentialInfo: e.target.value })}
              placeholder="e.g. Ground Vanguard's 64% visual observation of dust plumes..."
              className="deciora-input"
            />
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-xs font-mono font-bold text-white mb-1.5">
              3. What information did you consider unreliable or disregard?
            </label>
            <input
              type="text"
              value={reflection.unreliableInfo}
              onChange={(e) => setReflection({ ...reflection, unreliableInfo: e.target.value })}
              placeholder="e.g. The 58% air thermal ping due to potential industrial heat echoes..."
              className="deciora-input"
            />
          </div>

          {/* Question 4 */}
          <div>
            <label className="block text-xs font-mono font-bold text-white mb-1.5">
              4. Would you execute the same tactical decision under identical degradation?
            </label>
            <div className="flex items-center gap-4 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repeatDecision"
                  value="yes"
                  checked={reflection.repeatDecision === 'yes'}
                  onChange={(e) => setReflection({ ...reflection, repeatDecision: e.target.value })}
                  className="accent-[var(--accent-cyan)]"
                />
                <span className="text-white">Yes, defensible choice</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repeatDecision"
                  value="modify"
                  checked={reflection.repeatDecision === 'modify'}
                  onChange={(e) => setReflection({ ...reflection, repeatDecision: e.target.value })}
                  className="accent-[var(--accent-cyan)]"
                />
                <span className="text-white">Modify verification pacing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repeatDecision"
                  value="no"
                  checked={reflection.repeatDecision === 'no'}
                  onChange={(e) => setReflection({ ...reflection, repeatDecision: e.target.value })}
                  className="accent-[var(--accent-cyan)]"
                />
                <span className="text-white">No, adopt conservative hold</span>
              </label>
            </div>
          </div>

          {/* Submit / Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            <span className="text-xs font-mono text-emerald-400">
              {isSaved ? '✓ Reflection logged to training archive.' : ''}
            </span>

            <button
              type="submit"
              className="btn btn-primary font-mono text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save AAR Self-Reflection
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
