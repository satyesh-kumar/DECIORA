import React from 'react';
import { AlertOctagon, RotateCcw, Home, Terminal } from 'lucide-react';
import DecioraLogo from './DecioraLogo';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DECIORA Tactical Console Diagnostic:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07111F] text-white flex items-center justify-center p-6 font-mono">
          <div className="max-w-xl w-full bg-[#0D1B2A] border border-red-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />

            <div className="flex items-center gap-3 mb-6">
              <DecioraLogo size="sm" showText={false} />
              <div>
                <h1 className="text-lg font-bold text-red-400 tracking-wider">
                  TELEMETRY EXCEPTION DETECTED
                </h1>
                <p className="text-xs text-[var(--text-muted)]">
                  DECIORA Mission Console Recovery Protocol
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 text-xs mb-6 font-mono overflow-x-auto">
              <div className="flex items-center gap-2 font-bold mb-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>EXCEPTION: {this.state.error?.message || 'Unexpected Command State'}</span>
              </div>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-red-300/80 max-h-36 overflow-y-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-cyan)] text-[#07111F] font-bold text-xs hover:bg-[var(--accent-cyan-hover)] transition-colors shadow-lg shadow-[var(--accent-cyan)]/20"
              >
                <RotateCcw className="w-4 h-4" />
                RE-INITIALIZE CONSOLE
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12263A] border border-[var(--border-subtle)] text-white text-xs hover:bg-[#1B3856] transition-colors"
              >
                <Home className="w-4 h-4" />
                RETURN TO HQ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
