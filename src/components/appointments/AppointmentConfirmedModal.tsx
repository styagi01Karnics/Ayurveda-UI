import { SuccessDialog } from '@/components/ui/SuccessDialog';

interface AppointmentConfirmedModalProps {
  open: boolean;
  onClose: () => void;
}

export function AppointmentConfirmedModal({
  open,
  onClose,
}: AppointmentConfirmedModalProps) {
  return (
    <SuccessDialog
      open={open}
      onClose={onClose}
      title="Appointment confirmed"
      message="The appointment has been successfully scheduled for the patient"
    />
  );
}
