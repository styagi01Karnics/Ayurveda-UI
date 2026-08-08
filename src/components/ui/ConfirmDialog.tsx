import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, LogOut, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/lib/uiMessages';
import { cn } from '@/lib/utils';

type ConfirmVariant = 'danger' | 'warning' | 'default';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
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
  { iconBg: string; iconColor: string; buttonClass: string; Icon: LucideIcon }
> = {
  danger: {
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
    buttonClass: 'bg-danger hover:bg-danger/90',
    Icon: Trash2,
  },
  warning: {
    iconBg: 'bg-gold/15',
    iconColor: 'text-gold-dark',
    buttonClass: 'bg-gold hover:bg-gold/90',
    Icon: AlertTriangle,
  },
  default: {
    iconBg: 'bg-brown/5',
    iconColor: 'text-brown',
    buttonClass: '',
    Icon: LogOut,
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
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
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white px-8 py-8 text-center shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 rounded p-1 text-text-muted hover:bg-brown/5 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
            styles.iconBg,
          )}
        >
          <Icon className={cn('h-6 w-6', styles.iconColor)} />
        </div>
        <h2
          id="confirm-dialog-title"
          className="mt-5 text-xl font-bold text-brown"
        >
          {title}
        </h2>
        <p id="confirm-dialog-message" className="mt-2 text-sm text-text-muted">
          {message}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {cancelLabel}
          </Button>
          <Button
            className={styles.buttonClass}
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
