import { useEffect, useState } from 'react';
import { Menu, Radio, UserRound } from 'lucide-react';
import { env } from '@/config/env';

interface TopBarProps {
  onOpenNavigation: () => void;
}

export function TopBar({ onOpenNavigation }: TopBarProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-soc-border bg-soc-bg/85 px-4 backdrop-blur-md md:px-8">
      <button
        type="button"
        onClick={onOpenNavigation}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-soc-elevated lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {env.useMockData ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-warning-500/30 bg-warning-500/10 px-3 py-1 text-xs font-medium text-warning-400">
          <Radio className="h-3.5 w-3.5" aria-hidden />
          Demo data, not live telemetry
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full border border-success-500/30 bg-success-500/10 px-3 py-1 text-xs font-medium text-success-400">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse-dot" />
          Connected to analysis API
        </span>
      )}

      <div className="ml-auto flex items-center gap-4">
        <time className="hidden font-mono text-sm tabular-nums text-slate-400 sm:block" dateTime={now.toISOString()}>
          {now.toLocaleTimeString('en-US', { hour12: false })}
        </time>
        <div className="flex items-center gap-3 rounded-full border border-soc-border bg-soc-card py-1 pl-1 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-primary-300">
            <UserRound className="h-4 w-4" aria-hidden />
          </span>
          <span className="hidden text-sm font-medium text-slate-200 sm:block">Tier 2 Analyst</span>
        </div>
      </div>
    </header>
  );
}
