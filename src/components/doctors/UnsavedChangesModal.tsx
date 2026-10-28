import { Save } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface UnsavedChangesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
}

export function UnsavedChangesModal({
  open,
  onClose,
  onConfirm,
  onDiscard,
}: UnsavedChangesModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onCancel={onDiscard}
      onConfirm={onConfirm}
      title="Unsaved changes"
      message="Do you want to save or discard changes?"
      variant="warning"
      icon={Save}
    />
  );
}
