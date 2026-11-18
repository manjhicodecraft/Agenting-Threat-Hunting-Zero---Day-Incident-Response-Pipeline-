interface SecurityScoreGaugeProps {
  score: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SecurityScoreGauge({ score }: SecurityScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = clamped >= 80 ? '#22C55E' : clamped >= 60 ? '#F59E0B' : '#EF4444';
  const label = clamped >= 80 ? 'Strong' : clamped >= 60 ? 'Needs attention' : 'At risk';
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#1B2740" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-semibold text-slate-50">{clamped}</span>
          <span className="text-[11px] uppercase tracking-wider text-slate-500">of 100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color }}>
          {label}
        </p>
        <p className="mt-2 max-w-[16rem] text-sm text-slate-400">
          Score reflects open critical findings, response times, and endpoint coverage.
        </p>
      </div>
    </div>
  );
}
