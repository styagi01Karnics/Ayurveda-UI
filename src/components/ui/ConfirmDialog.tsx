import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, LogOut, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/lib/uiMessages';
import { cn } from '@/lib/utils';

export type ConfirmVariant = 'danger' | 'warning' | 'logout' | 'success' | 'default';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: LucideIcon;
  submitting?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  {
    halo: string;
    inner: string;
    iconColor: string;
    buttonClass: string;
    Icon: LucideIcon;
  }
> = {
  danger: {
    halo: 'bg-[#FCE9E8]',
    inner: 'bg-[#F8D5D2]',
    iconColor: 'text-[#E14E3C]',
    buttonClass: 'bg-[#E14E3C] text-white hover:bg-[#cf4535]',
    Icon: Trash2,
  },
  warning: {
    halo: 'bg-[#FFF6E0]',
    inner: 'bg-[#FBE8B6]',
    iconColor: 'text-[#E5A31A]',
    buttonClass: '',
    Icon: Save,
  },
  logout: {
    halo: 'bg-[#FDECEC]',
    inner: 'bg-[#F8D9D6]',
    iconColor: 'text-brown',
    buttonClass: '',
    Icon: LogOut,
  },
  success: {
    halo: 'bg-[#E8F6EA]',
    inner: 'bg-[#D4EED8]',
    iconColor: 'text-[#4CAF50]',
    buttonClass: '',
    Icon: CheckCircle2,
  },
  default: {
    halo: 'bg-brown/5',
    inner: 'bg-brown/10',
    iconColor: 'text-brown',
    buttonClass: '',
    Icon: AlertTriangle,
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = UI_MESSAGES.confirm.confirm,
  cancelLabel = UI_MESSAGES.confirm.cancel,
  variant = 'danger',
  icon,
  submitting = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const styles = variantStyles[variant];
  const Icon = icon ?? styles.Icon;
  const handleCancel = onCancel ?? onClose;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={submitting ? undefined : onClose}
        aria-label="Close"
        disabled={submitting}
      />
      <div
        className="relative z-10 w-full max-w-[440px] rounded-[20px] bg-white px-6 pb-6 pt-8 text-center shadow-xl sm:px-8"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 rounded-md p-1 text-[#9A8C84] hover:bg-brown/5 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div
          className={cn(
            'mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full',
            styles.halo,
          )}
        >
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              styles.inner,
            )}
          >
            <Icon className={cn('h-6 w-6', styles.iconColor)} strokeWidth={1.75} />
          </div>
        </div>

        <h2
          id="confirm-dialog-title"
          className="mt-5 text-[22px] font-bold leading-tight text-brown"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-message"
          className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-muted"
        >
          {message}
        </p>

        <div className="mt-7 flex w-full gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
            className="h-12 min-w-0 flex-1 rounded-xl border-[#E6E0D8] bg-white px-3 text-brown hover:bg-brown/[0.03]"
          >
            {cancelLabel}
          </Button>
          <Button
            className={cn(
              'h-12 min-w-0 flex-1 rounded-xl px-3',
              styles.buttonClass,
            )}
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? 'Please wait…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
