import React, { useState, useEffect } from 'react';
import { toast } from '../../services/toast';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X,
  Radio
} from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toast.subscribe((updated) => setToasts(updated));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((item) => {
        let borderClass = 'border-[var(--accent-cyan)]/40 bg-[#0D1B2A]/95 text-cyan-200';
        let Icon = Info;
        let badgeColor = 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]';

        if (item.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-[#062015]/95 text-emerald-200';
          Icon = CheckCircle2;
          badgeColor = 'bg-emerald-500/20 text-emerald-400';
        } else if (item.type === 'warning') {
          borderClass = 'border-amber-500/50 bg-[#241705]/95 text-amber-200';
          Icon = AlertTriangle;
          badgeColor = 'bg-amber-500/20 text-amber-300';
        } else if (item.type === 'error') {
          borderClass = 'border-red-500/50 bg-[#250808]/95 text-red-200';
          Icon = XCircle;
          badgeColor = 'bg-red-500/20 text-red-400';
        }

        return (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 ${borderClass}`}
            role="alert"
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${badgeColor}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                  {item.title}
                </span>
                <span className="font-mono text-[10px] opacity-60">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                {item.message}
              </p>
            </div>

            <button
              onClick={() => toast.remove(item.id)}
              className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
