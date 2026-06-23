import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  CLINIC_STATUS_OPTIONS,
  PERMISSION_MODULES,
  roleSchema,
  type RoleFormValues,
} from '@/lib/validation/settings.schema';
import type { SettingsRoleRecord } from '@/types';
import { cn } from '@/lib/utils';

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
  role?: SettingsRoleRecord | null;
}

export function AddRoleModal({
  open,
  onClose,
  onSubmit,
  role,
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
      status: 'Active',
      accessLevel: 'Full Access',
      permissions: [],
    },
  });

  const selectedPermissions = watch('permissions');

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        status: role.status,
        accessLevel: role.accessLevel,
        permissions: role.permissions,
      });
    } else {
      reset({
        name: '',
        status: 'Active',
        accessLevel: 'Full Access',
        permissions: [],
      });
    }
  }, [role, reset, open]);

  const togglePermission = (permission: string) => {
    const current = selectedPermissions ?? [];
    if (current.includes(permission)) {
      setValue(
        'permissions',
        current.filter((p) => p !== permission),
        { shouldValidate: true },
      );
    } else {
      setValue('permissions', [...current, permission], { shouldValidate: true });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={role ? 'Edit Role' : 'Add New Role'}
      subtitle="Configure role permissions and access level"
      footer={
        <Button onClick={handleSubmit(onSubmit)}>
          {role ? 'Save Changes' : 'Confirm'}
        </Button>
      }
    >
      <form className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Role Name"
            placeholder="Role Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Select
            label="Status"
            options={[...CLINIC_STATUS_OPTIONS]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>
        <Input
          label="Access Level"
          placeholder="Access Level"
          error={errors.accessLevel?.message}
          {...register('accessLevel')}
        />
        <div>
          <p className="mb-2 text-xs font-medium text-text-muted">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {PERMISSION_MODULES.map((permission) => {
              const isSelected = selectedPermissions?.includes(permission);
              return (
                <button
                  key={permission}
                  type="button"
                  onClick={() => togglePermission(permission)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    isSelected
                      ? 'bg-gold text-white'
                      : 'bg-cream text-brown hover:bg-gold/10',
                  )}
                >
                  {permission}
                </button>
              );
            })}
          </div>
          {errors.permissions?.message && (
            <p className="mt-1.5 text-xs text-danger" role="alert">
              {errors.permissions.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
