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
      subtitle={UI_MESSAGES.confirm.cancelAppointmentMessage}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Keep Appointment
          </Button>
          <Button
            className="bg-danger hover:bg-danger/90"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Cancelling…' : 'Cancel Appointment'}
          </Button>
        </div>
      }
    >
      <Textarea
        label="Reason of Cancellation *"
        placeholder="Enter cancel reason"
        rows={3}
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          if (error) setError(null);
        }}
        error={error ?? undefined}
        disabled={loading}
      />
    </Modal>
  );
}
