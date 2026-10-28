import { Clock } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatAppointmentReminderTime } from '@/lib/appointmentAlerts';
import type { DoctorScheduleItem } from '@/types';

interface ConsultationNotStartedModalProps {
  open: boolean;
  appointment: DoctorScheduleItem | null;
  onClose: () => void;
}

export function ConsultationNotStartedModal({
  open,
  appointment,
  onClose,
}: ConsultationNotStartedModalProps) {
  const scheduledLabel =
    appointment?.scheduledAt != null
      ? formatAppointmentReminderTime(new Date(appointment.scheduledAt))
      : appointment?.time ?? 'the scheduled time';

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onClose}
      title="Consultation has not started yet"
      message={`This appointment is scheduled for ${scheduledLabel}. You can start the consultation within 5 minutes of the scheduled time.`}
      confirmLabel="OK"
      cancelLabel="Close"
      variant="default"
      icon={Clock}
    />
  );
}
