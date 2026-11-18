import type { ReactNode } from 'react';
import { ErrorState, LoadingState } from '@/components/ui/DataState';

interface AsyncViewProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  isEmpty?: (data: T) => boolean;
  emptyState: ReactNode;
  loadingLabel?: string;
  children: (data: T) => ReactNode;
}

export function AsyncView<T>({ data, loading, error, onRetry, isEmpty, emptyState, loadingLabel, children }: AsyncViewProps<T>) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading && data === null) return <LoadingState label={loadingLabel} />;
  if (data === null) return null;
  if (isEmpty?.(data)) return <>{emptyState}</>;
  return <>{children(data)}</>;
}
