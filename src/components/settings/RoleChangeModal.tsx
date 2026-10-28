import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface RoleChangeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newRole?: string;
}

export function RoleChangeModal({
  open,
  onClose,
  onConfirm,
  newRole,
}: RoleChangeModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Assigned Role Changed"
      message={
        newRole
          ? `Are you sure you want to change the assigned role to ${newRole}`
          : 'Are you sure you want to change the assigned role'
      }
      variant="success"
    />
  );
}
