import { SuccessDialog } from '@/components/ui/SuccessDialog';

interface PasswordSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function PasswordSuccessModal({ open, onClose }: PasswordSuccessModalProps) {
  return (
    <SuccessDialog
      open={open}
      onClose={onClose}
      title="Password Updated"
      message="Your password has been changed successfully."
    />
  );
}
