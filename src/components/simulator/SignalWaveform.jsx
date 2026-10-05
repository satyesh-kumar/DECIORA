import React, { useRef, useEffect } from 'react';

export default function SignalWaveform({ level = 1, signalPercent = 100 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    const render = () => {
      step += 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      // Color selection based on degradation level
      let strokeColor = '#22C55E';
      if (level === 2) strokeColor = '#F59E0B';
      if (level === 3) strokeColor = '#FB923C';
      if (level >= 4 || signalPercent <= 15) strokeColor = '#EF4444';

      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = strokeColor;
      ctx.shadowBlur = 6;
      ctx.shadowColor = strokeColor;

      for (let x = 0; x < width; x++) {
        let y = mid;
        if (level >= 4 || signalPercent <= 10) {
          // Flatline with occasional micro glitch
          const glitch = Math.random() > 0.96 ? (Math.random() - 0.5) * 8 : 0;
          y = mid + glitch;
        } else if (level === 3) {
          // Chaotic jitter wave
          const noise = (Math.random() - 0.5) * 12;
          const sine = Math.sin((x * 0.06) + step) * 10;
          y = mid + sine + noise;
        } else if (level === 2) {
          // Moderate wave with harmonic interference
          const sine1 = Math.sin((x * 0.05) + step) * 12;
          const sine2 = Math.sin((x * 0.12) - step * 1.5) * 4;
          y = mid + sine1 + sine2;
        } else {
          // Clean stable sine wave
          y = mid + Math.sin((x * 0.06) + step) * 14;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [level, signalPercent]);

  return (
    <div className="w-full bg-[#07111F] rounded border border-[var(--border-subtle)] p-1.5 font-mono text-[10px] overflow-hidden">
      <div className="flex items-center justify-between text-[var(--text-muted)] mb-1 px-1">
        <span>RF DOWNLINK CARRIER</span>
        <span className={level >= 4 ? 'text-red-400 font-bold' : level >= 2 ? 'text-amber-400' : 'text-emerald-400'}>
          {level >= 4 ? 'CARRIER LOST' : `${signalPercent}% INTEGRITY`}
        </span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={240} 
        height={36} 
        className="w-full h-9 block"
      />
    </div>
  );
}
