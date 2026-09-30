import { useState } from 'react';
import { Pencil, Users } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { AddRoleModal } from '@/components/settings/AddRoleModal';
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
    <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => (
        <article
          key={role.id}
          className="relative flex min-h-[260px] flex-col rounded-2xl bg-[#faf6ee] p-5"
        >
          <button
            type="button"
            onClick={() => setEditTarget(role)}
            className="absolute right-4 top-4 rounded-full border border-[#eadfc8] bg-[#faf6ee] p-2 text-gold hover:bg-gold/10"
            aria-label={`Edit ${role.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <div className="pr-10">
            <h3 className="text-lg font-semibold text-gold">{role.name}</h3>
            <span
              className={cn(
                'mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
                role.status === 'Active'
                  ? 'bg-success/15 text-success'
                  : 'bg-gray-100 text-text-muted',
              )}
            >
              {role.status}
            </span>
          </div>

          <div className="mt-4 flex-1 border-t border-dashed border-[#eadfc8] pt-4">
            <p className="text-xs text-text-muted">{role.accessLevel}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full bg-[#f3ead6] px-2.5 py-1 text-xs text-brown"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-text-muted">
            <Users className="h-4 w-4" />
            <span>{role.userCount} users</span>
          </div>
        </article>
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
