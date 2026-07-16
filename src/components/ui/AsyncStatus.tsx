import type { ReactNode } from 'react';

interface AsyncStatusProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

export function AsyncStatus({
  loading,
  error,
  onRetry,
  children,
  empty = false,
  emptyMessage = 'No records found.',
}: AsyncStatusProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-10 text-center text-sm text-text-muted">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-8 text-center">
        <p className="text-sm font-medium text-danger">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-medium text-gold hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-10 text-center text-sm text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return <>{children}</>;
}
