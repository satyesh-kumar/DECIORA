import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  FileText, 
  Award, 
  ArrowLeft, 
  ShieldCheck, 
  Radio, 
  Play 
} from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../services/soundSystem';

export default function History({ onBack, onViewAAR, onStartTraining }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.getTrainingHistory().then(data => setHistory(data));
  }, []);

  return (
    <div className="container-custom py-10 max-w-5xl">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent-cyan)] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold font-mono text-white tracking-wide">
                TRAINING SESSION HISTORY
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Historical record of simulations, chosen command directives, and After Action Reviews.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onStartTraining();
          }}
          className="btn btn-primary font-mono text-xs"
        >
          New Training Run
        </button>
      </div>

      {/* History Session Cards */}
      <div className="space-y-4">
        {history.map((sess) => (
          <div 
            key={sess.id}
            className="deciora-card p-5 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-medium)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
          >
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">
                  {sess.scenarioTitle}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  • {sess.date}
                </span>
              </div>

              <div className="text-xs text-[var(--accent-cyan)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Directive: "{sess.decisionChosen}"
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] text-[var(--text-muted)]">
                <span>Latency: <strong className="text-white">{sess.decisionTimeSec}s</strong></span>
                <span>Peak Interference: <strong className="text-amber-400">{sess.commLevelMax}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
              <div className="text-right font-mono">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Readiness Score</div>
                <div className={`text-2xl font-extrabold ${
                  sess.score >= 85 ? 'text-emerald-400' :
                  sess.score >= 70 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {sess.score}/100
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onViewAAR(sess);
                }}
                className="btn btn-outline font-mono text-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Inspect AAR
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
