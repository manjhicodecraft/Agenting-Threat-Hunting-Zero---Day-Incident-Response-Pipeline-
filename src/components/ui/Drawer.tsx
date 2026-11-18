import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface DrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ open, title, subtitle, onClose, children }: DrawerProps) {
  useEscapeKey(onClose, open);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-soc-border bg-soc-sidebar shadow-card animate-slide-in-right"
      >
        <div className="flex items-start justify-between gap-4 border-b border-soc-border px-6 py-5">
          <div className="min-w-0">
            {subtitle && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-400">{subtitle}</p>}
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold text-slate-100">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-soc-elevated hover:text-slate-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}
