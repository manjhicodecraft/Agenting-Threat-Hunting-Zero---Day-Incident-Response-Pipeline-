import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Inbox, Loader2, RotateCw } from 'lucide-react';
import type { ReactNode } from 'react';

export function LoadingState({ label = 'Loading data from the analysis pipeline...' }: { label?: string }) {
  return (
    <div className="flex flex-col gap-4 p-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin text-primary-400" aria-hidden />
        {label}
      </div>
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="h-10 rounded-lg bg-[linear-gradient(90deg,#151F30_25%,#1B2740_50%,#151F30_75%)] bg-[length:200%_100%] animate-shimmer"
        />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center animate-fade-in">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-soc-elevated text-slate-400">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="max-w-sm text-sm text-slate-400">{description}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center animate-fade-in" role="alert">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-critical-500/15 text-critical-400">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-slate-100">We could not load this data</h3>
      <p className="max-w-md text-sm text-slate-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-lg border border-soc-border bg-soc-elevated px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-primary-500/50 hover:bg-primary-500/10"
        >
          <RotateCw className="h-4 w-4" aria-hidden />
          Try again
        </button>
      )}
    </div>
  );
}
