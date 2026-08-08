import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UI_MESSAGES } from '@/lib/uiMessages';

interface CancelAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function CancelAppointmentModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: CancelAppointmentModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={UI_MESSAGES.confirm.cancelAppointmentTitle}
      message={UI_MESSAGES.confirm.cancelAppointmentMessage}
      confirmLabel="Cancel Appointment"
      submitting={loading}
    />
  );
}
