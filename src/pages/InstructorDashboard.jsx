import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  Clock, 
  Target, 
  TrendingUp, 
  BarChart2, 
  FileText, 
  Download, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  Filter,
  Eye,
  X,
  Radar as RadarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { sound } from '../services/soundSystem';

export default function InstructorDashboard({ onViewTraineeAAR }) {
  const [analytics, setAnalytics] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([api.getInstructorAnalytics(), api.getTrainees()]).then(([anData, trData]) => {
      setAnalytics(anData);
      setTrainees(trData);
    });
  }, []);

  const filteredTrainees = trainees.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.rank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCohort = () => {
    sound.playClick();
    const exportData = {
      timestamp: new Date().toISOString(),
      analytics,
      trainees
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DECIORA_INSTRUCTOR_COHORT_REPORT_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-custom py-8 max-w-6xl">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            OVERSIGHT COMMAND & ANALYTICS • PS26048
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-wide">
            INSTRUCTOR TRAINING COMMAND CENTER
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Supervising Cohort 2026-Alpha • Evaluating decision latency and degradation resilience.
          </p>
        </div>

        <button
          onClick={handleExportCohort}
          className="btn btn-outline font-mono text-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Cohort Analytics (JSON)
        </button>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Trainees Count */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>TOTAL TRAINEES</span>
            <Users className="w-4 h-4 text-[var(--accent-cyan)]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">
            {analytics?.totalTrainees || 48}
          </div>
          <div className="text-[11px] font-mono text-emerald-400">
            14 active sessions today
          </div>
        </div>

        {/* Average Score */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>AVG COHORT SCORE</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">
            {analytics?.averageScore || 81.4}%
          </div>
          <div className="text-[11px] font-mono text-emerald-400">
            Above 75% benchmark threshold
          </div>
        </div>

        {/* Average Decision Time */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>AVG DECISION TIME</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">
            {analytics?.averageDecisionTime || '18.6s'}
          </div>
          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
            Under 30s deadline window
          </div>
        </div>

        {/* Average Accuracy */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>AVG ACCURACY</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">
            {analytics?.averageAccuracy || '83.8%'}
          </div>
          <div className="text-[11px] font-mono text-purple-300">
            Resilient under degraded comms
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Chart 1: Degradation Level vs Performance */}
        <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)]">
          <div className="mb-4 pb-3 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[var(--accent-cyan)]" />
              Cohort Score By Communication Degradation Level
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Performance drop-off across Normal, Delayed, Conflicting, and Blackout channels.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.performanceByDegradation || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="level" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} interval={0} angle={-10} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#07111F', 
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="avgScore" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Average Score" />
                <Bar dataKey="accuracy" fill="#22C55E" radius={[4, 4, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Competency Radar Chart */}
        <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)]">
          <div className="mb-4 pb-3 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <RadarIcon className="w-4 h-4 text-purple-400" />
              Cohort Competency Radar vs Tactical Benchmark
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Compares 5 decision competencies against baseline.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={analytics?.competencyRadar || []}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 9 }} />
                <Radar name="Cohort Actual" dataKey="cohort" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.4} />
                <Radar name="Target Benchmark" dataKey="benchmark" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Trainee Roster Table */}
      <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--accent-cyan)]" />
              Officer Cohort Evaluation Roster
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Click any trainee to inspect cognitive profile and action history.
            </p>
          </div>

          {/* Search filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search officer or rank..."
              className="deciora-input pl-9 py-1.5 text-xs font-mono w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase">
                <th className="py-2.5 px-3">Officer</th>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Overall</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-3">Risk Mgmt</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredTrainees.map((trainee) => (
                <tr 
                  key={trainee.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTrainee(trainee);
                  }}
                  className="hover:bg-[#12263A] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#12263A] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] text-[var(--accent-cyan)]">
                      {trainee.name.split(' ')[1]?.[0] || 'O'}
                    </span>
                    {trainee.name}
                  </td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">
                    {trainee.rank}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      trainee.overallScore >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                      trainee.overallScore >= 75 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trainee.overallScore}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-300">
                    {trainee.accuracy}%
                  </td>
                  <td className="py-3 px-3 text-sky-300">
                    {trainee.avgDecisionTimeSec}s
                  </td>
                  <td className="py-3 px-3 text-purple-300">
                    {trainee.riskManagement}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      trainee.status === 'EXEMPLARY' ? 'bg-emerald-500/15 text-emerald-400' :
                      trainee.status === 'NEEDS_REVIEW' ? 'bg-red-500/15 text-red-400' :
                      'bg-sky-500/15 text-sky-400'
                    }`}>
                      {trainee.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-[var(--accent-cyan)] hover:underline flex items-center gap-1 ml-auto">
                      <Eye className="w-3.5 h-3.5" />
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trainee Deep-Dive Profile Modal Drawer */}
      {selectedTrainee && (
        <div className="modal-backdrop">
          <div className="deciora-card p-6 max-w-2xl w-full bg-[#0D1B2A] border-[var(--border-accent)] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] flex items-center justify-center font-mono font-bold text-sm text-[var(--accent-cyan)]">
                  {selectedTrainee.name.split(' ')[1]?.[0] || 'O'}
                </span>
                <div>
                  <h3 className="text-base font-bold font-mono text-white">
                    {selectedTrainee.name}
                  </h3>
                  <div className="text-xs text-[var(--text-muted)] font-mono">
                    Rank: {selectedTrainee.rank} • Completed: {selectedTrainee.scenariosCompleted} Scenarios
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTrainee(null)}
                className="text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] text-[10px] uppercase">Decision Accuracy</span>
                <div className="text-xl font-bold text-emerald-400">{selectedTrainee.accuracy}%</div>
              </div>
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] text-[10px] uppercase">Risk Management</span>
                <div className="text-xl font-bold text-purple-400">{selectedTrainee.riskManagement}%</div>
              </div>
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] text-[10px] uppercase">Info Usage</span>
                <div className="text-xl font-bold text-amber-400">{selectedTrainee.infoUsage}%</div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-sans text-xs">
              <div className="p-3 rounded-lg bg-[#07111F]/80 border border-emerald-500/20">
                <div className="font-mono font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Key Strengths
                </div>
                <ul className="space-y-1 text-[var(--text-secondary)]">
                  {selectedTrainee.strengths?.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-[#07111F]/80 border border-amber-500/20">
                <div className="font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Areas to Refine
                </div>
                <ul className="space-y-1 text-[var(--text-secondary)]">
                  {selectedTrainee.weaknesses?.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="mb-4">
              <div className="text-xs font-mono font-bold uppercase text-[var(--text-muted)] mb-2">
                Recent Training Logs
              </div>
              <div className="space-y-2 font-mono text-xs">
                {selectedTrainee.recentSessions?.map((sess, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded bg-[#07111F] border border-[var(--border-subtle)]">
                    <div>
                      <span className="font-bold text-white">{sess.scenario}</span>
                      <span className="text-[10px] text-[var(--text-muted)] ml-2">({sess.date})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">{sess.score}/100</span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-sans">{sess.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setSelectedTrainee(null)}
                className="btn btn-secondary font-mono text-xs"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
