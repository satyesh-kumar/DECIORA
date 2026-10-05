import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Radio, 
  CheckCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { sound } from '../services/soundSystem';

export default function Login({ onLoginSuccess, onGoLanding }) {
  const [mode, setMode] = useState('login'); // login | register | forgot
  const [email, setEmail] = useState('commander@deciora.sim');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('commander');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playClick();
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(role);
      setLoading(false);
    }, 400);
  };

  const handleDemoQuick = (targetRole) => {
    sound.playConfirm();
    onLoginSuccess(targetRole);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-command-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[var(--accent-cyan)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-6">
        <button
          onClick={onGoLanding}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-cyan)] hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Portal Home
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-[#0D1B2A] border border-[var(--border-accent)] mb-3 shadow-lg shadow-[var(--accent-cyan)]/15">
          <Radio className="w-8 h-8 text-[var(--accent-cyan)]" />
        </div>

        <h1 className="text-2xl font-bold font-mono tracking-wider text-white">
          DECIORA COMMAND ACCESS
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
          PS26048 Simulation Authentication & Oversight Interface
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Fast 1-Click Demo Logins for Judges / Evaluators */}
        <div className="deciora-card p-4 bg-[#0D1B2A]/90 border-[var(--border-accent)] mb-6 shadow-xl text-center">
          <div className="text-[11px] font-mono uppercase font-bold text-[var(--accent-cyan)] mb-2 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-ping" />
            1-Click Demo Access (No Password Required)
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <button
              onClick={() => handleDemoQuick('commander')}
              className="p-2 rounded-lg bg-[#12263A] hover:bg-[var(--accent-cyan)]/20 border border-[var(--border-medium)] hover:border-[var(--accent-cyan)] text-white hover:text-[var(--accent-cyan)] transition-all font-semibold"
            >
              Commander
            </button>
            <button
              onClick={() => handleDemoQuick('instructor')}
              className="p-2 rounded-lg bg-[#12263A] hover:bg-emerald-500/20 border border-[var(--border-medium)] hover:border-emerald-500 text-white hover:text-emerald-400 transition-all font-semibold"
            >
              Instructor
            </button>
            <button
              onClick={() => handleDemoQuick('admin')}
              className="p-2 rounded-lg bg-[#12263A] hover:bg-purple-500/20 border border-[var(--border-medium)] hover:border-purple-500 text-white hover:text-purple-400 transition-all font-semibold"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Standard Credentials Form Card */}
        <div className="deciora-card p-6 sm:p-8 bg-[#0D1B2A] border-[var(--border-subtle)] shadow-2xl">
          
          <div className="flex border-b border-[var(--border-subtle)] mb-6 font-mono text-xs">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-center border-b-2 font-bold transition-all ${
                mode === 'login' ? 'border-[var(--accent-cyan)] text-white' : 'border-transparent text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-center border-b-2 font-bold transition-all ${
                mode === 'register' ? 'border-[var(--accent-cyan)] text-white' : 'border-transparent text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Register Trainee
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            
            {/* Role Selector */}
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">
                Access Tier / Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="deciora-input"
              >
                <option value="commander">Commander (Training Simulator & Readiness)</option>
                <option value="instructor">Instructor (Cohort Oversight & AAR Analytics)</option>
                <option value="admin">System Admin (Simulation Engine & Configurations)</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">
                Callsign / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commander@deciora.sim"
                  className="deciora-input pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[var(--text-muted)] uppercase">
                  Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Mode Active: Enter any password or use the 1-click login buttons above.')}
                  className="text-[11px] text-[var(--accent-cyan)] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="deciora-input pl-9"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-2.5 font-bold flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'AUTHORIZE TERMINAL SESSION' : 'REGISTER OFFICER'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
