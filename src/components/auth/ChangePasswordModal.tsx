import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  changePasswordSchema,
  passwordRequirements,
  type ChangePasswordFormValues,
} from '@/lib/validation/changePassword.schema';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function PasswordInput({
  label,
  error,
  registration,
}: {
  label: string;
  error?: string;
  registration: ReturnType<
    ReturnType<typeof useForm<ChangePasswordFormValues>>['register']
  >;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        type={visible ? 'text' : 'password'}
        placeholder="••••••••"
        error={error}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-[34px] text-text-muted hover:text-brown"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    reset();
    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Password"
      subtitle="Update Password for enhanced account security"
      size="md"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Discard
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Apply Changes'}
          </Button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <PasswordInput
          label="Current Password *"
          error={errors.currentPassword?.message}
          registration={register('currentPassword')}
        />
        <PasswordInput
          label="New Password *"
          error={errors.newPassword?.message}
          registration={register('newPassword')}
        />
        <PasswordInput
          label="Confirm Password *"
          error={errors.confirmPassword?.message}
          registration={register('confirmPassword')}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
          {passwordRequirements.map((req) => (
            <p key={req} className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="h-1 w-1 rounded-full bg-text-muted" />
              {req}
            </p>
          ))}
        </div>
      </form>
    </Modal>
  );
}
