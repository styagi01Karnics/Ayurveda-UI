import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  time?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24">
        <div className="flex w-full max-w-md flex-col gap-3">
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

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
