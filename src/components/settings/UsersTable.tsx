import { ChevronDown, Lock, UserPlus } from 'lucide-react';
import { USER_ROLE_OPTIONS } from '@/lib/validation/settings.schema';
import { cn } from '@/lib/utils';
import type { SettingsUserRecord } from '@/types';

interface UsersTableProps {
  records: SettingsUserRecord[];
  onRoleChange: (userId: string, newRole: string) => void;
}

const COLUMNS =
  'grid grid-cols-[7.5rem_minmax(0,1.3fr)_minmax(0,1.3fr)_5.5rem_7.5rem_minmax(11.5rem,auto)] items-center gap-3';

export function UsersTable({ records, onRoleChange }: UsersTableProps) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="min-w-[52rem]">
      <div
        className={cn(
          COLUMNS,
          'border-t border-dashed border-[#eadfc8] px-1 py-3 text-xs text-text-muted',
        )}
      >
        <span>User ID</span>
        <span>Name / Phone Number</span>
        <span>Email</span>
        <span>Status</span>
        <span>Assigned Role</span>
        <span>Action</span>
      </div>

      {records.length === 0 ? (
        <p className="border-t border-[#eadfc8] px-1 py-12 text-center text-sm text-text-muted">
          No users found matching your filters.
        </p>
      ) : (
        records.map((record) => (
          <div
            key={record.id}
            className={cn(COLUMNS, 'border-t border-[#eadfc8] px-1 py-4 text-sm')}
          >
            <span className="font-medium text-brown">{record.userId}</span>
            <div className="min-w-0">
              <p className="truncate font-medium text-brown">{record.fullName}</p>
              <p className="truncate text-xs text-text-muted">{record.phone}</p>
            </div>
            <span className="min-w-0 truncate text-brown">{record.email}</span>
            <span
              className={cn(
                'font-medium',
                record.status === 'Active' ? 'text-success' : 'text-text-muted',
              )}
            >
              {record.status}
            </span>
            <div>
              {record.fullName ? (
                <span className="inline-flex rounded-full bg-[#faf4e5] px-3 py-1 text-xs font-medium text-gold">
                  {record.assignedRole}
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-2">
              <div className="relative">
                <select
                  value={record.assignedRole}
                  onChange={(event) => {
                    if (
                      event.target.value &&
                      event.target.value !== record.assignedRole
                    ) {
                      onRoleChange(record.id, event.target.value);
                    }
                  }}
                  className="appearance-none rounded-lg border border-gold bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  aria-label={`Change role for ${record.fullName || record.userId}`}
                >
                  {USER_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold" />
              </div>
              <button
                type="button"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  record.status === 'Active'
                    ? 'border border-gold bg-[#faf4e5] text-gold hover:bg-gold/10'
                    : 'bg-gold text-white hover:bg-gold-dark',
                )}
                aria-label={`Edit ${record.fullName || record.userId}`}
              >
                {record.status === 'Active' ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
}
