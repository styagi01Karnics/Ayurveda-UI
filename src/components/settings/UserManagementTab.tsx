import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/app/ToastContext';
import {
  AddUserModal,
  type TenantRoleOption,
  type UserFormValues,
} from '@/components/settings/AddUserModal';
import { RoleChangeModal } from '@/components/settings/RoleChangeModal';
import { UsersTable } from '@/components/settings/UsersTable';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Pagination } from '@/components/ui/Pagination';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { USER_FILTER_OPTIONS } from '@/data/mock/settings';
import { useClientPagination } from '@/hooks/useClientPagination';
import {
  getUsers,
  registerUser,
  updateUser,
  updateUserStatus,
  type UserResponse,
} from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { getRoles } from '@/lib/api/roles';
import { formatAuthRole } from '@/lib/auth';
import { formatPersonName } from '@/lib/utils';
import type { SettingsUserRecord } from '@/types';

interface UserManagementTabProps {
  addUserOpen: boolean;
  onAddUserClose: () => void;
}

function mapUserToRecord(user: UserResponse): SettingsUserRecord {
  const statusUpper = String(user.status ?? '').toUpperCase();
  return {
    id: user.id,
    userId: user.username || user.email || user.id,
    fullName: formatPersonName(user.fullName) || user.fullName || '—',
    phone: user.mobileNumber
      ? user.mobileNumber.replace(/\D/g, '').slice(-10)
      : '—',
    email: user.email || '—',
    status: statusUpper === 'INACTIVE' ? 'Inactive' : 'Active',
    assignedRole: user.role,
    tenantRoleId: user.tenantRoleId,
  };
}

export function UserManagementTab({
  addUserOpen,
  onAddUserClose,
}: UserManagementTabProps) {
  const { showToast } = useToast();
  const [users, setUsers] = useState<SettingsUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tenantRoleOptions, setTenantRoleOptions] = useState<
    TenantRoleOption[]
  >([]);
  const [editUser, setEditUser] = useState<SettingsUserRecord | null>(null);
  const [roleChange, setRoleChange] = useState<{
    userId: string;
    newRole: string;
  } | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getUsers(0, 100);
      setUsers(list.map(mapUserToRecord));
    } catch (err) {
      setUsers([]);
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load users for this hospital.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const roles = await getRoles();
        if (cancelled) return;
        setTenantRoleOptions(
          roles
            .filter((role) => role.active !== false)
            .map((role) => ({
              value: role.id,
              label: role.roleName,
              description: role.description ?? '',
              pageCodes: role.pageCodes ?? [],
            })),
        );
      } catch {
        if (!cancelled) setTenantRoleOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const {
    page,
    setPage,
    pageSize,
    totalPages,
    totalElements,
    pageItems,
    resetPage,
  } = useClientPagination(filteredUsers);

  useEffect(() => {
    resetPage();
  }, [searchQuery, statusFilter, resetPage]);

  const isRoleAlreadyAssigned = (role: string, exceptUserId?: string) =>
    users.some(
      (user) =>
        user.assignedRole === role &&
        user.id !== exceptUserId &&
        user.status === 'Active',
    );

  const handleCloseUserModal = () => {
    setEditUser(null);
    onAddUserClose();
  };

  const handleSaveUser = async (values: UserFormValues) => {
    if (isRoleAlreadyAssigned(values.role, editUser?.id)) {
      showToast({
        title: 'Role already assigned',
        message: `Only one user can have the ${formatAuthRole(values.role)} role. Choose a different role.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editUser) {
        const updated = await updateUser(editUser.id, {
          fullName: values.fullName,
          email: values.email,
          role: values.role,
          tenantRoleId: values.tenantRoleId,
          mobileNumber: values.mobileNumber,
          status: values.status.toUpperCase(),
        });
        if (updated.status?.toUpperCase() !== values.status.toUpperCase()) {
          await updateUserStatus(editUser.id, values.status.toUpperCase());
        }
        setUsers((prev) =>
          prev.map((item) =>
            item.id === editUser.id ? mapUserToRecord(updated) : item,
          ),
        );
        showToast({
          title: 'User Updated',
          message: `${values.fullName} has been updated successfully.`,
        });
        handleCloseUserModal();
        void loadUsers();
        return;
      }

      const addValues = values as Extract<UserFormValues, { password: string }>;
      let created = await registerUser({
        fullName: addValues.fullName,
        email: addValues.email,
        password: addValues.password,
        role: addValues.role,
        tenantRoleId: addValues.tenantRoleId,
        mobileNumber: addValues.mobileNumber,
      });
      if (!created.mobileNumber && addValues.mobileNumber) {
        created = await updateUser(created.id, {
          mobileNumber: addValues.mobileNumber,
        });
      }
      if (addValues.status === 'Inactive') {
        created = await updateUserStatus(created.id, 'INACTIVE');
      }
      setUsers((prev) => [mapUserToRecord(created), ...prev]);
      showToast({
        title: 'User Added',
        message: `${created.fullName} has been added successfully.`,
      });
      handleCloseUserModal();
      void loadUsers();
    } catch (err) {
      showToast({
        title: editUser ? 'Could not update user' : 'Could not add user',
        message:
          err instanceof ApiError
            ? err.message
            : 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChangeRequest = (userId: string, newRole: string) => {
    if (isRoleAlreadyAssigned(newRole, userId)) {
      const holder = users.find(
        (user) => user.assignedRole === newRole && user.id !== userId,
      );
      showToast({
        title: 'Role already assigned',
        message: holder
          ? `Only one user can have the ${formatAuthRole(newRole)} role. It is already assigned to ${holder.fullName}.`
          : `Only one user can have the ${formatAuthRole(newRole)} role.`,
      });
      return;
    }
    setRoleChange({ userId, newRole });
  };

  const handleRoleChangeConfirm = async () => {
    if (!roleChange) return;
    try {
      const updated = await updateUser(roleChange.userId, {
        role: roleChange.newRole,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === roleChange.userId ? mapUserToRecord(updated) : user,
        ),
      );
      showToast({
        title: 'Role Updated',
        message: 'Assigned role has been changed successfully.',
      });
      setRoleChange(null);
    } catch (err) {
      showToast({
        title: 'Role update failed',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not update the user role.',
      });
    }
  };

  return (
    <div className="settings-card overflow-hidden rounded-2xl border border-[#ebe4d8] shadow-none">
      <div className="flex flex-col gap-3 border-b border-[#EFF0F6] px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <SearchField
            placeholder="User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            wrapperClassName="w-full sm:w-[200px]"
          />
          <div className="w-full sm:w-[160px]">
            <Select
              placeholder="Status"
              options={[...USER_FILTER_OPTIONS.status]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <AsyncStatus loading={loading} error={error} onRetry={() => void loadUsers()}>
        <UsersTable
          records={pageItems}
          onRoleChange={handleRoleChangeRequest}
          onEdit={setEditUser}
        />
        <div className="border-t border-[#EFF0F6] px-5 py-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
            disabled={loading}
          />
        </div>
      </AsyncStatus>

      <AddUserModal
        open={addUserOpen || Boolean(editUser)}
        onClose={handleCloseUserModal}
        onSubmit={handleSaveUser}
        submitting={submitting}
        tenantRoleOptions={tenantRoleOptions}
        user={editUser}
      />

      <RoleChangeModal
        open={Boolean(roleChange)}
        onClose={() => setRoleChange(null)}
        onConfirm={() => void handleRoleChangeConfirm()}
        newRole={
          roleChange?.newRole
            ? formatAuthRole(roleChange.newRole)
            : undefined
        }
      />
    </div>
  );
}
