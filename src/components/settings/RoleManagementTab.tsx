import { useState } from 'react';
import { Pencil, Users } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { AddRoleModal } from '@/components/settings/AddRoleModal';
import { Card } from '@/components/ui/Card';
import { initialSettingsRoles } from '@/data/mock/settings';
import type { RoleFormValues } from '@/lib/validation/settings.schema';
import { cn } from '@/lib/utils';
import type { SettingsRoleRecord } from '@/types';

interface RoleManagementTabProps {
  addRoleOpen: boolean;
  onAddRoleClose: () => void;
}

export function RoleManagementTab({
  addRoleOpen,
  onAddRoleClose,
}: RoleManagementTabProps) {
  const { showToast } = useToast();
  const [roles, setRoles] = useState(initialSettingsRoles);
  const [editTarget, setEditTarget] = useState<SettingsRoleRecord | null>(null);

  const modalOpen = addRoleOpen || Boolean(editTarget);

  const handleCloseModal = () => {
    setEditTarget(null);
    onAddRoleClose();
  };

  const handleSubmit = (values: RoleFormValues) => {
    if (editTarget) {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editTarget.id
            ? {
                ...role,
                name: values.name,
                status: values.status,
                accessLevel: values.accessLevel,
                permissions: values.permissions,
              }
            : role,
        ),
      );
      showToast({
        title: 'Role Updated',
        message: `${values.name} has been updated successfully.`,
      });
    } else {
      setRoles((prev) => [
        ...prev,
        {
          id: `role-${Date.now()}`,
          name: values.name,
          status: values.status,
          accessLevel: values.accessLevel,
          permissions: values.permissions,
          userCount: 0,
        },
      ]);
      showToast({
        title: 'Role Added',
        message: `${values.name} has been created successfully.`,
      });
    }
    handleCloseModal();
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.id} className="relative p-5">
          <button
            type="button"
            onClick={() => setEditTarget(role)}
            className="absolute right-4 top-4 rounded-full border border-gray-200 bg-cream p-2 text-gold hover:bg-gold/10"
            aria-label={`Edit ${role.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <div className="flex items-start justify-between gap-3 pr-10">
            <div>
              <h3 className="text-lg font-semibold text-gold">{role.name}</h3>
              <span
                className={cn(
                  'mt-1 inline-block text-xs font-medium',
                  role.status === 'Active' ? 'text-success' : 'text-text-muted',
                )}
              >
                {role.status}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-text-muted">{role.accessLevel}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {role.permissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full bg-cream px-2.5 py-1 text-xs text-brown"
              >
                {permission}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-1.5 text-xs text-text-muted">
            <Users className="h-4 w-4" />
            <span>{role.userCount} users</span>
          </div>
        </Card>
      ))}

      <AddRoleModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        role={editTarget}
      />
    </div>
  );
}
