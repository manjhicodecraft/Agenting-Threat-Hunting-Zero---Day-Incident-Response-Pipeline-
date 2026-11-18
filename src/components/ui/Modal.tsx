import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({ open, title, description, onClose, footer, children }: ModalProps) {
  useEscapeKey(onClose, open);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-soc-border bg-soc-card shadow-card animate-fade-in"
      >
        <div className="flex items-start justify-between gap-4 border-b border-soc-border px-6 py-5">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-soc-elevated hover:text-slate-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-soc-border bg-soc-sidebar/50 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
