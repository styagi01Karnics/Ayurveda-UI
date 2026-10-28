import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import {
  USER_ROLE_OPTIONS,
  addUserSchema,
  editUserSchema,
  type AddUserFormValues,
  type EditUserFormValues,
} from '@/lib/validation/settings.schema';
import type { SettingsUserRecord } from '@/types';

export interface TenantRoleOption {
  value: string;
  label: string;
  description?: string;
  pageCodes?: string[];
}

export type UserFormValues = AddUserFormValues | EditUserFormValues;

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  submitting?: boolean;
  tenantRoleOptions?: TenantRoleOption[];
  user?: SettingsUserRecord | null;
}

export function AddUserModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  tenantRoleOptions = [],
  user = null,
}: AddUserModalProps) {
  const isEdit = Boolean(user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? editUserSchema : addUserSchema),
    defaultValues: {
      tenantRoleId: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (user) {
      reset({
        tenantRoleId: user.tenantRoleId ?? '',
        fullName: user.fullName === '—' ? '' : user.fullName,
        mobileNumber: user.phone.replace(/\D/g, '').slice(-10),
        email: user.email === '—' ? '' : user.email,
        role: user.assignedRole,
        status: user.status,
      });
      return;
    }
    reset({
      tenantRoleId: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: 'Active',
    });
  }, [open, user, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit User' : 'Add User'}
      subtitle={
        isEdit
          ? 'Please fill out the details to update user'
          : 'Please fill out the details to add user'
      }
      footer={
        <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
          {submitting ? 'Saving...' : 'Confirm'}
        </Button>
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" noValidate>
        <Select
          label="Tenant Role"
          placeholder="Select tenant role"
          options={tenantRoleOptions}
          error={'tenantRoleId' in errors ? errors.tenantRoleId?.message : undefined}
          {...register('tenantRoleId')}
        />
        <Input
          label="Full Name"
          placeholder="Full Name"
          error={'fullName' in errors ? errors.fullName?.message : undefined}
          {...register('fullName')}
        />
        <Input
          label="Mobile Number"
          placeholder="Mobile Number"
          error={'mobileNumber' in errors ? errors.mobileNumber?.message : undefined}
          {...register('mobileNumber')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Email"
          error={'email' in errors ? errors.email?.message : undefined}
          {...register('email')}
        />
        {!isEdit ? (
          <>
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              error={'password' in errors ? errors.password?.message : undefined}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              error={
                'confirmPassword' in errors
                  ? errors.confirmPassword?.message
                  : undefined
              }
              {...register('confirmPassword')}
            />
          </>
        ) : null}
        <div className="sm:col-span-2">
          <Select
            label="Role"
            placeholder="Role"
            options={[...USER_ROLE_OPTIONS]}
            error={'role' in errors ? errors.role?.message : undefined}
            {...register('role')}
          />
        </div>
      </form>
    </Modal>
  );
}
