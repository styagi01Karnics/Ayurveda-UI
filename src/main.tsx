import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRoutes } from '@/app/routes';
import { ToastProvider ,ToastViewport } from '@/app/ToastContext';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
    <AppRoutes />
     <ToastViewport className="fixed right-5 top-5 z-[9999]" />
    </ToastProvider>
  </StrictMode>,
);
