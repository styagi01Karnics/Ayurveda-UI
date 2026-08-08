import type { ReactNode } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/lib/uiMessages';

interface AsyncStatusProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function AsyncStatus({
  loading,
  error,
  onRetry,
  children,
  empty = false,
  emptyMessage = UI_MESSAGES.empty.default,
  emptyDescription,
}: AsyncStatusProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-10 text-center text-sm text-text-muted">
        {UI_MESSAGES.loading}
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
            {UI_MESSAGES.retry}
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <EmptyState
        message={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return <>{children}</>;
}
