import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowLeft,
  Medal,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../services/soundSystem';

export default function Leaderboard({ onBack, onStartTraining }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.getLeaderboard().then(data => setLeaderboard(data));
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
              <Trophy className="w-5 h-5 text-amber-400" />
            </span>
            <div>
              <h1 className="text-2xl font-bold font-mono text-white tracking-wide">
                OPERATIONAL LEADERBOARD
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Ranking officers by composite uncertainty decision index & risk discipline.
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
          Compete in Simulation
        </button>
      </div>

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 font-mono">
        {leaderboard.slice(0, 3).map((lead, idx) => (
          <div 
            key={idx}
            className={`deciora-card p-5 text-center relative overflow-hidden ${
              idx === 0 
                ? 'bg-gradient-to-b from-[#162E47] to-[#0D1B2A] border-[var(--border-accent)] ring-1 ring-[var(--accent-cyan)]' 
                : 'bg-[#0D1B2A] border-[var(--border-subtle)]'
            }`}
          >
            <div className="absolute top-2 right-2 text-2xl font-extrabold text-[var(--text-muted)]/20">
              #{lead.rank}
            </div>

            <div className="inline-flex p-3 rounded-full bg-[#07111F] border border-[var(--border-medium)] mb-3">
              <Medal className={`w-6 h-6 ${
                idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600'
              }`} />
            </div>

            <h2 className="text-base font-bold text-white mb-0.5">
              {lead.name}
            </h2>
            <div className="text-[11px] text-[var(--accent-cyan)] mb-3">
              {lead.callsign}
            </div>

            <div className="text-3xl font-extrabold text-white mb-2">
              {lead.score} <span className="text-xs text-[var(--text-muted)]">/ 100</span>
            </div>

            <div className="flex justify-center gap-3 text-[11px] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-2 mt-2">
              <span>Acc: <strong className="text-white">{lead.accuracy}</strong></span>
              <span>Speed: <strong className="text-white">{lead.speed}</strong></span>
              <span>Risk: <strong className="text-white">{lead.risk}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Commander</th>
                <th className="py-2.5 px-3">Callsign</th>
                <th className="py-2.5 px-3 text-center">Composite Score</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Decision Speed</th>
                <th className="py-2.5 px-3">Risk Mgmt</th>
                <th className="py-2.5 px-3 text-right">Runs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {leaderboard.map((item, index) => (
                <tr 
                  key={index}
                  className={`hover:bg-[#12263A] transition-colors ${
                    item.name.includes('(You)') ? 'bg-[#12263A]/90 font-bold border-l-2 border-l-[var(--accent-cyan)]' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-[var(--accent-cyan)]">
                    {item.rank}
                  </td>
                  <td className="py-3 px-3 text-white">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-[var(--text-muted)]">
                    {item.callsign}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400">
                      {item.score}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-300">
                    {item.accuracy}
                  </td>
                  <td className="py-3 px-3 text-sky-300">
                    {item.speed}
                  </td>
                  <td className="py-3 px-3 text-purple-300">
                    {item.risk}
                  </td>
                  <td className="py-3 px-3 text-right text-[var(--text-secondary)]">
                    {item.completed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
