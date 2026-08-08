import { LogOut } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UI_MESSAGES } from '@/lib/uiMessages';

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={UI_MESSAGES.confirm.logoutTitle}
      message={UI_MESSAGES.confirm.logoutMessage}
      confirmLabel={UI_MESSAGES.confirm.logout}
      variant="default"
      icon={LogOut}
    />
  );
}
