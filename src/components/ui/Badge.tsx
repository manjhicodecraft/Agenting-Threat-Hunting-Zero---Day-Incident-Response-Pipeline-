import type { ReactNode } from 'react';
import type { Severity } from '@/services/api/types';
import { severityMeta } from '@/utils/format';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = severityMeta[severity];
  return (
    <Badge className={meta.badge}>
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot, severity === 'critical' && 'animate-pulse-dot')} />
      {meta.label}
    </Badge>
  );
}
