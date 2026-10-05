import React, { useState, useEffect } from 'react';
import { 
  Play, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Award, 
  Clock, 
  FileText, 
  Radio, 
  ChevronRight, 
  Layers, 
  CheckCircle, 
  AlertTriangle,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { api } from '../services/api';
import { sound } from '../services/soundSystem';

export default function CommanderDashboard({ user, onStartTraining, onViewAAR, onSelectScenario }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrainingHistory().then(data => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  // Performance progression chart data
  const chartData = [
    { session: 'Sim 1', accuracy: 72, riskMgmt: 74, overall: 73 },
    { session: 'Sim 2', accuracy: 78, riskMgmt: 80, overall: 76 },
    { session: 'Sim 3', accuracy: 81, riskMgmt: 85, overall: 80 },
    { session: 'Sim 4', accuracy: 76, riskMgmt: 82, overall: 78 },
    { session: 'Sim 5', accuracy: 89, riskMgmt: 91, overall: 87 },
    { session: 'Sim 6', accuracy: 92, riskMgmt: 94, overall: 91 }
  ];

  return (
    <div className="container-custom py-8 max-w-6xl">
      
      {/* Commander Welcome & Mission Readiness Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            OPERATIONAL COMMAND READINESS • PS26048
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-wide">
            COMMANDER DASHBOARD
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Logged in as: <strong className="text-white">{user?.name || 'Commander Alpha'}</strong> ({user?.callsign || 'VANGUARD-ACTUAL'}) • Rank: {user?.rank || 'Captain'}
          </p>
        </div>

        {/* Start Training Primary CTA */}
        <button
          onClick={() => {
            sound.playClick();
            onStartTraining();
          }}
          className="btn btn-primary btn-lg font-mono text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-[var(--accent-cyan)]/25"
        >
          <Play className="w-4 h-4 fill-current" />
          START NEW TRAINING
        </button>
      </div>

      {/* Mission Readiness Key Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Metric 1: Overall Score */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>OVERALL SCORE</span>
            <Award className="w-4 h-4 text-[var(--accent-cyan)]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-2">
            {user?.readinessScore || 84}
            <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/100</span>
          </div>
          <div className="confidence-bar-bg mb-2">
            <div className="confidence-bar-fill bg-[var(--accent-cyan)]" style={{ width: '84%' }} />
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            +6% improvement vs cohort
          </div>
        </div>

        {/* Metric 2: Decision Accuracy */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>DECISION ACCURACY</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-2">
            {user?.decisionAccuracy || 88}%
          </div>
          <div className="confidence-bar-bg mb-2">
            <div className="confidence-bar-fill bg-emerald-500" style={{ width: '88%' }} />
          </div>
          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
            Optimal under conflicting intel
          </div>
        </div>

        {/* Metric 3: Risk Management */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>RISK MANAGEMENT</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-2">
            {user?.riskManagement || 91}%
          </div>
          <div className="confidence-bar-bg mb-2">
            <div className="confidence-bar-fill bg-purple-500" style={{ width: '91%' }} />
          </div>
          <div className="text-[11px] font-mono text-purple-300">
            Disciplined force preservation
          </div>
        </div>

        {/* Metric 4: Information Usage */}
        <div className="deciora-card p-5 bg-[#0D1B2A]/90 border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
            <span>INFORMATION USAGE</span>
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mb-2">
            {user?.informationUsage || 82}%
          </div>
          <div className="confidence-bar-bg mb-2">
            <div className="confidence-bar-fill bg-amber-500" style={{ width: '82%' }} />
          </div>
          <div className="text-[11px] font-mono text-amber-300">
            Cross-verifies delayed feeds
          </div>
        </div>

      </div>

      {/* Performance Progression Chart */}
      <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)] mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent-cyan)]" />
              Cognitive Performance Progression Under Degradation
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Evaluates decision accuracy and risk control across successive training runs.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[var(--accent-cyan)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-cyan)] inline-block" /> Overall Score
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Accuracy
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Risk Mgmt
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis dataKey="session" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
              <YAxis domain={[50, 100]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#07111F', 
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="overall" stroke="#38BDF8" strokeWidth={2.5} fillOpacity={1} fill="url(#cyanGrad)" />
              <Area type="monotone" dataKey="accuracy" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#greenGrad)" />
              <Line type="monotone" dataKey="riskMgmt" stroke="#A855F7" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Training History Table */}
      <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-medium)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent-cyan)]" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Recent Training Sessions
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {history.length} Sessions Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase">
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Decision Time</th>
                <th className="py-2.5 px-3">Max Degradation</th>
                <th className="py-2.5 px-3 text-center">Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#12263A]/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    {item.scenarioTitle}
                  </td>
                  <td className="py-3 px-3 text-[var(--text-muted)]">
                    {item.date}
                  </td>
                  <td className="py-3 px-3 text-sky-300">
                    {item.decisionTimeSec}s
                  </td>
                  <td className="py-3 px-3 text-amber-300">
                    {item.commLevelMax}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      item.score >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                      item.score >= 70 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.score}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onViewAAR(item)}
                      className="btn btn-outline btn-sm font-mono text-[11px] inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      View AAR
                    </button>
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
