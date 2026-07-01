import { AppIcon } from '@/components/ui/AppIcon';
import { assets } from '@/lib/assets';

interface AppointmentConfirmedModalProps {
  open: boolean;
  onClose: () => void;
}

export function AppointmentConfirmedModal({
  open,
  onClose,
}: AppointmentConfirmedModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <AppIcon src={assets.icons.close} className="h-4 w-4" />
        </button>
        <AppIcon
          src={assets.icons.confirmSuccess}
          className="mx-auto h-16 w-16"
        />
        <h2 className="mt-5 text-xl font-bold text-brown">Appointment confirmed</h2>
        <p className="mt-2 text-sm text-text-muted">
          The appointment has been successfully scheduled for the patient
        </p>
      </div>
    </div>
  );
}
