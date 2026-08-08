import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UI_MESSAGES } from '@/lib/uiMessages';

interface DeleteClinicItemModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: 'Doctor' | 'Therapy' | 'Therapist';
}

export function DeleteClinicItemModal({
  open,
  onClose,
  onConfirm,
  itemType,
}: DeleteClinicItemModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      message={UI_MESSAGES.confirm.deleteMessage(`this ${itemType.toLowerCase()}`)}
      confirmLabel={UI_MESSAGES.confirm.delete}
    />
  );
}
