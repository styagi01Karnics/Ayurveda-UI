import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';

interface PageActionContextValue {
  setHeaderAction: (action: ReactNode) => void;
}

export const PageActionContext = createContext<PageActionContextValue | null>(
  null,
);

export function usePageAction(action: ReactNode) {
  const ctx = useContext(PageActionContext);

  useEffect(() => {
    if (!ctx) return;
    ctx.setHeaderAction(action);
    return () => ctx.setHeaderAction(null);
    // ctx is stable from provider; action is memoized by callers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);
}

export function usePageActionContext() {
  const ctx = useContext(PageActionContext);
  if (!ctx) {
    throw new Error('usePageActionContext must be used within DashboardLayout');
  }
  return ctx;
}
