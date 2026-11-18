import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-500 hover:shadow-glow',
  secondary: 'border border-soc-border bg-soc-elevated text-slate-100 hover:border-primary-500/50 hover:bg-primary-500/10',
  ghost: 'text-slate-300 hover:bg-soc-elevated hover:text-slate-100',
  danger: 'bg-critical-600 text-white hover:bg-critical-500 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.4)]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export function Button({ variant = 'secondary', size = 'md', icon, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
