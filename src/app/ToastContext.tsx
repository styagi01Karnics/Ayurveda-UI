import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  time?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function inferVariant(toast: Omit<ToastItem, 'id'>): ToastVariant {
  if (toast.variant) return toast.variant;
  const text = `${toast.title} ${toast.message}`.toLowerCase();
  if (/fail|error|could not|unable|invalid/.test(text)) return 'error';
  return 'success';
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id, variant: inferVariant(toast) }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 6000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[100] flex items-start justify-end p-4 pt-5 sm:p-6">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto flex gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-lg"
              role="status"
            >
              <CheckCircle className="h-5 w-5 shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brown">{toast.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">{toast.message}</p>
                {toast.time && (
                  <p className="mt-1 text-[10px] text-text-muted">{toast.time}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded p-1 text-text-muted hover:bg-brown/5"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

/** Figma toast: white card, green check, message, close. */
export function ToastViewport({ className }: { className?: string }) {
  const ctx = useContext(ToastContext);
  if (!ctx || ctx.toasts.length === 0) return null;

  return (
    <div className={cn('flex w-[min(100%,22rem)] flex-col gap-2', className)}>
      {ctx.toasts.map((toast) => {
        const isError = toast.variant === 'error';
        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 rounded-2xl border border-[#E8E0D4] bg-white px-4 py-3 shadow-[0_4px_18px_rgba(66,44,35,0.1)]"
            role="status"
          >
            {isError ? (
              <CircleAlert
                className="h-5 w-5 shrink-0 text-[#D64545]"
                strokeWidth={2}
              />
            ) : (
              <CircleCheck
                className="h-5 w-5 shrink-0 text-[#2E7D32]"
                strokeWidth={2}
              />
            )}
            <p className="min-w-0 flex-1 font-sans text-sm font-medium leading-5 text-[#422C23]">
              {toast.title}
            </p>
            <button
              type="button"
              onClick={() => ctx.dismiss(toast.id)}
              className="shrink-0 rounded-md p-0.5 text-[#838A9A] hover:bg-[#F5F0E4] hover:text-[#422C23]"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
