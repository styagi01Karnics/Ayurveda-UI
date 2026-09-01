import { useMemo, useState } from 'react';
import { useToast } from '@/app/ToastContext';
import { AddUserModal } from '@/components/settings/AddUserModal';
import { RoleChangeModal } from '@/components/settings/RoleChangeModal';
import { UsersTable } from '@/components/settings/UsersTable';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { initialSettingsUsers, USER_FILTER_OPTIONS } from '@/data/mock/settings';
import type { AddUserFormValues } from '@/lib/validation/settings.schema';
import type { SettingsUserRecord } from '@/types';

interface UserManagementTabProps {
  addUserOpen: boolean;
  onAddUserClose: () => void;
}

export function UserManagementTab({
  addUserOpen,
  onAddUserClose,
}: UserManagementTabProps) {
  const { showToast } = useToast();
  const [users, setUsers] = useState(initialSettingsUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleChange, setRoleChange] = useState<{
    userId: string;
    newRole: string;
  } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.userId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const isRoleAlreadyAssigned = (role: string, exceptUserId?: string) =>
    users.some(
      (user) =>
        user.assignedRole === role &&
        user.id !== exceptUserId &&
        user.status === 'Active',
    );

  const handleAddUser = (values: AddUserFormValues) => {
    if (isRoleAlreadyAssigned(values.role)) {
      showToast({
        title: 'Role already assigned',
        message: `Only one user can have the ${values.role} role. Choose a different role.`,
      });
      return;
    }

    const record: SettingsUserRecord = {
      id: `user-${Date.now()}`,
      userId: values.userId.startsWith('#') ? values.userId : `#${values.userId}`,
      fullName: values.fullName,
      phone: values.contactNumber,
      email: values.email,
      status: 'Active',
      assignedRole: values.role,
    };
    setUsers((prev) => [record, ...prev]);
    showToast({
      title: 'User Added',
      message: `${record.fullName} has been added successfully.`,
    });
    onAddUserClose();
  };

  const handleRoleChangeRequest = (userId: string, newRole: string) => {
    if (isRoleAlreadyAssigned(newRole, userId)) {
      const holder = users.find(
        (user) => user.assignedRole === newRole && user.id !== userId,
      );
      showToast({
        title: 'Role already assigned',
        message: holder
          ? `Only one user can have the ${newRole} role. It is already assigned to ${holder.fullName}.`
          : `Only one user can have the ${newRole} role.`,
      });
      return;
    }
    setRoleChange({ userId, newRole });
  };

  const handleRoleChangeConfirm = () => {
    if (!roleChange) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === roleChange.userId
          ? { ...user, assignedRole: roleChange.newRole }
          : user,
      ),
    );
    showToast({
      title: 'Role Updated',
      message: 'Assigned role has been changed successfully.',
    });
    setRoleChange(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative sm:col-start-2 sm:grid sm:grid-cols-2 sm:gap-3">
          <SearchField
            placeholder="User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            placeholder="Status"
            options={[...USER_FILTER_OPTIONS.status]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <UsersTable
        records={filteredUsers}
        onRoleChange={handleRoleChangeRequest}
      />

      <AddUserModal
        open={addUserOpen}
        onClose={onAddUserClose}
        onSubmit={handleAddUser}
      />

      <RoleChangeModal
        open={Boolean(roleChange)}
        onClose={() => setRoleChange(null)}
        onConfirm={handleRoleChangeConfirm}
        newRole={roleChange?.newRole}
      />
    </div>
  );
}
