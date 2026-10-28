import { useCallback } from 'react';
import { useToast } from '@/app/ToastContext';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';

export function useAppFeedback() {
  const { showToast } = useToast();

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showToast({ title, message });
    },
    [showToast],
  );

  const showError = useCallback(
    (error: unknown, fallback: string = UI_MESSAGES.error.default) => {
      showToast({
        title: 'Error',
        message: resolveErrorMessage(error, fallback),
      });
    },
    [showToast],
  );

  return { showSuccess, showError, showToast };
}
