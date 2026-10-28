import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  PermissionSwitch,
  PermissionToggleGrid,
} from '@/components/settings/PermissionToggleGrid';
import {
  ALL_PAGE_CODES,
  type PageCode,
} from '@/lib/pagePermissions';
import {
  roleSchema,
  type RoleFormValues,
} from '@/lib/validation/settings.schema';
import type { SettingsRoleRecord } from '@/types';

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void | Promise<void>;
  role?: SettingsRoleRecord | null;
  permissionModules?: readonly PageCode[];
  submitting?: boolean;
}

export function AddRoleModal({
  open,
  onClose,
  onSubmit,
  role,
  permissionModules = ALL_PAGE_CODES,
  submitting = false,
}: AddRoleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Active',
      accessLevel: 'Full Access',
      permissions: [...permissionModules],
    },
  });

  const selectedPermissions = watch('permissions');
  const status = watch('status');

  useEffect(() => {
    if (!open) return;
    if (role) {
      reset({
        name: role.name,
        description: role.description ?? '',
        status: role.status,
        accessLevel: role.accessLevel,
        permissions: role.permissions,
      });
      return;
    }
    reset({
      name: '',
      description: '',
      status: 'Active',
      accessLevel: 'Full Access',
      permissions: [...permissionModules],
    });
  }, [role, reset, open, permissionModules]);

  const togglePermission = (pageCode: string) => {
    const current = selectedPermissions ?? [];
    if (current.includes(pageCode)) {
      setValue(
        'permissions',
        current.filter((item) => item !== pageCode),
        { shouldValidate: true },
      );
      return;
    }
    setValue('permissions', [...current, pageCode], { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={role ? 'Edit Role' : 'Add New Role'}
      subtitle="Please fill out the role details"
      footer={
        <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
          {submitting ? 'Saving...' : role ? 'Save Changes' : 'Confirm'}
        </Button>
      }
    >
      <form className="space-y-5" noValidate>
        <Input
          label="Role"
          placeholder="Role"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Role Description"
          placeholder="Role Description"
          error={errors.description?.message}
          {...register('description')}
        />

        <div>
          <p className="field-label mb-3">Permissions</p>
          <PermissionToggleGrid
            modules={permissionModules}
            selected={selectedPermissions ?? []}
            onToggle={togglePermission}
          />
          {errors.permissions?.message ? (
            <p className="mt-1.5 text-xs text-danger" role="alert">
              {errors.permissions.message}
            </p>
          ) : null}
        </div>

        <PermissionSwitch
          label="Status"
          checked={status === 'Active'}
          onChange={() =>
            setValue('status', status === 'Active' ? 'Inactive' : 'Active', {
              shouldValidate: true,
            })
          }
        />
      </form>
    </Modal>
  );
}
