import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  USER_ROLE_OPTIONS,
  addUserSchema,
  type AddUserFormValues,
} from '@/lib/validation/settings.schema';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddUserFormValues) => void | Promise<void>;
  submitting?: boolean;
}

export function AddUserModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
}: AddUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userId: '',
      fullName: '',
      contactNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        userId: '',
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
    }
  }, [open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add User"
      subtitle="Please fill out the details to add user"
      footer={
        <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
          {submitting ? 'Saving...' : 'Confirm'}
        </Button>
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" noValidate>
        <Input
          label="User ID"
          placeholder="User ID"
          error={errors.userId?.message}
          {...register('userId')}
        />
        <Input
          label="Full Name"
          placeholder="Full Name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Contact Number"
          placeholder="Contact Number"
          error={errors.contactNumber?.message}
          {...register('contactNumber')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <div className="sm:col-span-2">
          <Select
            label="Role"
            placeholder="Role"
            options={[...USER_ROLE_OPTIONS]}
            error={errors.role?.message}
            {...register('role')}
          />
        </div>
      </form>
    </Modal>
  );
}
