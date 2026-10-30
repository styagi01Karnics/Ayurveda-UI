import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: ReactNode;
  halo?: boolean;
  className?: string;
  /** Shows a ✕ button in the top-right corner. */
  showCloseButton?: boolean;
}

export function SuccessDialog({
  open,
  onClose,
  title,
  message,
  children,
  halo = false,
  className,
  showCloseButton = false,
}: SuccessDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-[400px] rounded-[20px] bg-white px-8 py-12 text-center shadow-xl',
          className,
        )}
        role="status"
        aria-modal="true"
        aria-labelledby="success-dialog-title"
      >
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-[#838A9A] hover:bg-[#F5F0E4] hover:text-[#422C23]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        <div
          className={cn(
            'mx-auto flex items-center justify-center',
            halo && 'h-[88px] w-[88px] rounded-full bg-[#E8F6EA]',
          )}
        >
          <img
            src={assets.icons.confirmSuccess}
            alt=""
            className={cn('object-contain', halo ? 'h-14 w-14' : 'h-16 w-16')}
          />
        </div>
        <h2
          id="success-dialog-title"
          className="mt-5 text-[22px] font-bold leading-tight text-brown"
        >
          {title}
        </h2>
        {message ? (
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-text-muted">
            {message}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
