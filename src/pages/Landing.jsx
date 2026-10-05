import React from 'react';
import { 
  Play, 
  Radio, 
  WifiOff, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Brain, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  Activity, 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';
import { sound } from '../services/soundSystem';
import DecioraLogo from '../components/common/DecioraLogo';

export default function Landing({ 
  onStartTraining, 
  onLoginDemo, 
  onGoLogin 
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#07111F] text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-[var(--border-subtle)]">
        {/* Command center grid pattern & ambient cyan glow */}
        <div className="absolute inset-0 bg-command-grid opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[var(--accent-cyan)]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          
          {/* Insignia & Badge */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="mb-4">
              <DecioraLogo size="xl" showText={false} animated={true} />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-cyan)]/15 border border-[var(--accent-cyan)]/35 text-[var(--accent-cyan)] font-mono text-xs font-semibold uppercase tracking-widest shadow-lg shadow-[var(--accent-cyan)]/10 animate-in fade-in duration-300">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-ping" />
              PS26048 Tactical Training Simulator
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-mono mb-4 text-white">
            DECIORA
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--accent-cyan)] font-mono mb-6">
            Decision-Making Under Uncertainty
          </div>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
            Train commanders to make critical, defensible decisions when telemetry is <span className="text-white font-medium">incomplete, delayed, conflicting, or unavailable</span>. Evaluates decision quality at the moment of execution—not through hindsight bias.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button
              onClick={() => {
                sound.playClick();
                onStartTraining();
              }}
              className="btn btn-primary btn-lg font-mono text-sm shadow-xl shadow-[var(--accent-cyan)]/25 flex items-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-current" />
              START TRAINING
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onLoginDemo('commander');
              }}
              className="btn btn-secondary btn-lg font-mono text-sm"
            >
              VIEW LIVE DEMO
            </button>
          </div>

          {/* Instant 1-Click Role Switcher for Evaluators / Judges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-[#0D1B2A]/90 border border-[var(--border-medium)] font-mono text-xs">
            <span className="text-[var(--text-muted)] px-2">⚡ Quick Demo Access:</span>
            <button
              onClick={() => {
                sound.playClick();
                onLoginDemo('commander');
              }}
              className="px-2.5 py-1 rounded-md bg-[#12263A] hover:bg-[var(--border-accent)] text-white hover:text-[var(--accent-cyan)] transition-colors"
            >
              Commander Alpha
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onLoginDemo('instructor');
              }}
              className="px-2.5 py-1 rounded-md bg-[#12263A] hover:bg-[var(--border-accent)] text-white hover:text-emerald-400 transition-colors"
            >
              Instructor Vance
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onLoginDemo('admin');
              }}
              className="px-2.5 py-1 rounded-md bg-[#12263A] hover:bg-[var(--border-accent)] text-white hover:text-purple-400 transition-colors"
            >
              System Admin
            </button>
          </div>

        </div>

        {/* Command Center Dashboard UI Preview Mockup */}
        <div className="container-custom mt-14 max-w-5xl">
          <div className="deciora-card p-4 md:p-6 bg-[#0D1B2A]/95 border-[var(--border-accent)] shadow-2xl relative rounded-2xl overflow-hidden hud-frame">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-white">SIMULATION ACTIVE: SECTOR DELTA-9</span>
                <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  COMMS: UNSTABLE (42%)
                </span>
              </div>
              <div className="text-[var(--accent-cyan)] font-bold">
                T+01:24 | DEADLINE: 18s
              </div>
            </div>

            {/* Mock Workspace Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {/* Telemetry feed */}
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)] space-y-2">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">LIVE INTEL FEED</div>
                <div className="text-sky-300 font-bold">● GROUND PATROL VANGUARD:</div>
                <div className="text-[var(--text-secondary)] font-sans">
                  "Visual spotters detect movement heading EAST towards Ridge. (+14s delay)"
                </div>
                <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]">
                  ⚠ CONFLICT: AIR RAVEN reports NORTH.
                </div>
              </div>

              {/* Tactical Status */}
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col justify-center items-center">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">TACTICAL UNCERTAINTY</div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">68%</div>
                <div className="text-[11px] text-[var(--text-secondary)] font-sans">
                  Sensor divergence exceeds safe maneuver threshold.
                </div>
              </div>

              {/* Decision Options */}
              <div className="p-3 rounded-lg bg-[#07111F] border border-[var(--border-subtle)] space-y-1.5">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">COMMAND DIRECTIVES</div>
                <div className="p-1.5 rounded bg-[#12263A] text-white">A: Hold Position & Monitor</div>
                <div className="p-1.5 rounded bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-bold">
                  B: Deploy Drone Falcon Recon ✓
                </div>
                <div className="p-1.5 rounded bg-[#12263A] text-white">C: Dispatch Vanguard to Checkpoint</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY DECIORA? 6 CORE PILLARS */}
      <section className="py-20 bg-[#0D1B2A]/50 border-b border-[var(--border-subtle)]">
        <div className="container-custom max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase tracking-widest mb-2">
              TRAINING VALUE PROPOSITION
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              Why Decision-Making Training Under Uncertainty?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2 font-sans">
              Real-world command failures rarely stem from weapons malfunction—they happen when communications degrade and commanders freeze or panic under ambiguous telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-mono text-white mb-2">Degraded Communication</h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Experience realistic transmission delays (5s–45s), packet drops, and complete radio silence. Learn to pace commands when downlink integrity falters.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 w-fit mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-mono text-white mb-2">Conflicting Intelligence</h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Reconcile contradictory observations between ground patrols, aerial drones, and synthetic radar. Formulate defensible responses without jumping to conclusions.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-mono text-white mb-2">Time Pressure & Deadlines</h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Strict countdown timers simulate operational urgency. Balance the need for additional sensor verification against the risk of losing the tactical initiative.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-mono text-white mb-2">Non-Hindsight Risk Evaluation</h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Decisions are scored based on the information known at that specific second—not outcome hindsight. Defensible caution is rewarded even if situations turn unfavorable.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-mono text-white mb-2">AI-Powered Qualitative Feedback</h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Multi-axial intelligence engine diagnoses cognitive strengths, areas of vulnerability, and concrete tactical recommendations for every simulation run.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="deciora-card p-6 bg-[#0D1B2A] border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[var(--accent-cyan)] w-fit mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-mono text-white mb-2">Interactive After Action Review</h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Step through an interactive timeline scrubber to reconstruct what information was available, what was delayed, and record commander reflection logs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS PIPELINE */}
      <section className="py-20 border-b border-[var(--border-subtle)]">
        <div className="container-custom max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase tracking-widest mb-2">
              SIMULATION LIFECYCLE
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              The Decision-Making Architecture
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
            
            {[
              { step: '01', title: 'Scenario', desc: 'Sector brief & baseline parameters' },
              { step: '02', title: 'Intel Feed', desc: 'Incoming satellite & sensor reports' },
              { step: '03', title: 'Degradation', desc: 'Latency, noise & channel dropout' },
              { step: '04', title: 'Directive', desc: 'Select response under countdown' },
              { step: '05', title: 'Outcome', desc: 'Realize consequence & resolution' },
              { step: '06', title: 'AI Scoring', desc: '5-Axis rationality evaluation' },
              { step: '07', title: 'AAR Replay', desc: 'Event scrutiny & reflection' },
            ].map((st, i) => (
              <React.Fragment key={st.step}>
                <div className="flex-1 p-3.5 rounded-xl bg-[#0D1B2A] border border-[var(--border-subtle)] text-center w-full">
                  <div className="text-[10px] text-[var(--accent-cyan)] font-bold mb-1">{st.step}</div>
                  <div className="text-sm font-bold text-white mb-1">{st.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-sans">{st.desc}</div>
                </div>
                {i < 6 && (
                  <div className="hidden md:block text-[var(--text-muted)] font-bold">→</div>
                )}
              </React.Fragment>
            ))}

          </div>

        </div>
      </section>

      {/* TRAINING METRICS SHOWCASE */}
      <section className="py-20 bg-[#0D1B2A]/50 border-b border-[var(--border-subtle)]">
        <div className="container-custom max-w-5xl text-center">
          
          <h2 className="text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase tracking-widest mb-2">
            OBJECTIVE EVALUATION
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-12">
            Multi-Axial Scoring Model
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-[#07111F] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-white mb-1">30 pts</div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase">Decision Quality</div>
            </div>
            <div className="p-4 rounded-xl bg-[#07111F] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-emerald-400 mb-1">20 pts</div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase">Info Usage</div>
            </div>
            <div className="p-4 rounded-xl bg-[#07111F] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-purple-400 mb-1">20 pts</div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase">Risk Mgmt</div>
            </div>
            <div className="p-4 rounded-xl bg-[#07111F] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-sky-400 mb-1">15 pts</div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase">Decision Speed</div>
            </div>
            <div className="p-4 rounded-xl bg-[#07111F] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-amber-400 mb-1">15 pts</div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase">Comm Protocol</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--accent-cyan)]/15 border border-[var(--accent-cyan)]/40">
              <div className="text-2xl font-bold text-[var(--accent-cyan)] mb-1">100</div>
              <div className="text-[11px] text-white uppercase font-bold">Total Index</div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="container-custom max-w-3xl relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-4">
            Ready to test your decision-making?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-sans max-w-xl mx-auto mb-8 leading-relaxed">
            Experience high-stakes command challenges under realistic signal degradation and conflicting intelligence. No installation or setup required.
          </p>

          <button
            onClick={() => {
              sound.playClick();
              onStartTraining();
            }}
            className="btn btn-primary btn-lg font-mono text-sm shadow-xl shadow-[var(--accent-cyan)]/30 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            ENTER TRAINING SIMULATOR
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] py-8 bg-[#040D18] text-center font-mono text-xs text-[var(--text-muted)]">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong>DECIORA</strong> • Decision-Making Under Uncertainty (PS26048 Simulator)
          </div>
          <div>
            Fictional Abstract Scenarios • For Educational & Analytical Training Only
          </div>
        </div>
      </footer>

    </div>
  );
}
