import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';

type Tone = 'primary' | 'critical' | 'warning' | 'success';

const toneClasses: Record<Tone, { icon: string; value: string; glow: string }> = {
  primary: { icon: 'bg-primary-500/15 text-primary-400', value: 'text-slate-100', glow: 'from-primary-500/20' },
  critical: { icon: 'bg-critical-500/15 text-critical-400', value: 'text-critical-400', glow: 'from-critical-500/20' },
  warning: { icon: 'bg-warning-500/15 text-warning-400', value: 'text-warning-400', glow: 'from-warning-500/20' },
  success: { icon: 'bg-success-500/15 text-success-400', value: 'text-success-400', glow: 'from-success-500/20' },
};

interface StatCardProps {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone?: Tone;
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'primary' }: StatCardProps) {
  const classes = toneClasses[tone];
  return (
    <Card interactive className="group relative overflow-hidden p-5 animate-fade-in">
      <div
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
          classes.glow,
        )}
      />
      <div className="relative flex items-start justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', classes.icon)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className={cn('relative mt-4 font-mono text-3xl font-semibold tracking-tight', classes.value)}>{value}</p>
      <p className="relative mt-2 text-xs text-slate-500">{hint}</p>
    </Card>
  );
}
