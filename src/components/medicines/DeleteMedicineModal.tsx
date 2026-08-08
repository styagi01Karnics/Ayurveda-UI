import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UI_MESSAGES } from '@/lib/uiMessages';

interface DeleteMedicineModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  medicineName?: string;
  submitting?: boolean;
}

export function DeleteMedicineModal({
  open,
  onClose,
  onConfirm,
  medicineName,
  submitting = false,
}: DeleteMedicineModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Medicine"
      message={UI_MESSAGES.confirm.deleteMessage(medicineName ?? 'this medicine')}
      confirmLabel={UI_MESSAGES.confirm.delete}
      submitting={submitting}
    />
  );
}
