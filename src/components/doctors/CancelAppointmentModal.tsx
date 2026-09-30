import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { UI_MESSAGES } from '@/lib/uiMessages';

interface CancelAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void | Promise<void>;
  loading?: boolean;
}

export function CancelAppointmentModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setReason('');
      setError(null);
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('Please enter a reason for cancellation');
      return;
    }
    void onConfirm(trimmed);
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title={UI_MESSAGES.confirm.cancelAppointmentTitle}
      message={UI_MESSAGES.confirm.cancelAppointmentMessage}
      confirmLabel={UI_MESSAGES.confirm.delete}
      submitting={loading}
    />
  );
}
