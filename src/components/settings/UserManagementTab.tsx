import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/app/ToastContext';
import { AddUserModal } from '@/components/settings/AddUserModal';
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
  type UserResponse,
} from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { getRoles } from '@/lib/api/roles';
import { formatAuthRole } from '@/lib/auth';
import { formatPersonName } from '@/lib/utils';
import type { AddUserFormValues } from '@/lib/validation/settings.schema';
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
    Array<{ value: string; label: string }>
  >([]);
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

  const handleAddUser = async (values: AddUserFormValues) => {
    if (isRoleAlreadyAssigned(values.role)) {
      showToast({
        title: 'Role already assigned',
        message: `Only one user can have the ${formatAuthRole(values.role)} role. Choose a different role.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      let created = await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
        tenantRoleId: values.tenantRoleId,
        mobileNumber: values.mobileNumber,
      });
      if (!created.mobileNumber && values.mobileNumber) {
        created = await updateUser(created.id, {
          mobileNumber: values.mobileNumber,
        });
      }
      setUsers((prev) => [mapUserToRecord(created), ...prev]);
      showToast({
        title: 'User Added',
        message: `${created.fullName} has been added successfully.`,
      });
      onAddUserClose();
      void loadUsers();
    } catch (err) {
      showToast({
        title: 'Could not add user',
        message:
          err instanceof ApiError
            ? err.message
            : 'Register user failed. Please try again.',
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
        open={addUserOpen}
        onClose={onAddUserClose}
        onSubmit={handleAddUser}
        submitting={submitting}
        tenantRoleOptions={tenantRoleOptions}
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
