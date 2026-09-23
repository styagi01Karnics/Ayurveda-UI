import { Settings2 } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { formatAuthRole } from '@/lib/auth';
import { USER_ROLE_OPTIONS } from '@/lib/validation/settings.schema';
import { cn, formatPersonName } from '@/lib/utils';
import type { SettingsUserRecord } from '@/types';

interface UsersTableProps {
  records: SettingsUserRecord[];
  onRoleChange: (userId: string, newRole: string) => void;
}

function formatDisplayUserId(userId: string): string {
  const trimmed = userId.trim();
  if (!trimmed || trimmed === '—') return '—';
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function formatDisplayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91-${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91-${digits.slice(2)}`;
  }
  return phone || '—';
}

export function UsersTable({ records, onRoleChange }: UsersTableProps) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#EFF0F6] text-[12px] font-medium text-[#838A9A]">
            <th className="px-5 py-3.5 font-medium">User ID</th>
            <th className="px-5 py-3.5 font-medium">Name / Phone Number</th>
            <th className="px-5 py-3.5 font-medium">Email</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium">Assigned Role</th>
            <th className="px-5 py-3.5 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-[#838A9A]">
                No users found matching your filters.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id} className="border-b border-[#EFF0F6]">
                <td className="px-5 py-4 font-medium text-[#422C23]">
                  {formatDisplayUserId(record.userId)}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-[#422C23]">
                    {formatPersonName(record.fullName) || record.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-[#67554D]">
                    {formatDisplayPhone(record.phone)}
                  </p>
                </td>
                <td className="px-5 py-4 text-[#422C23]">{record.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      record.status === 'Active'
                        ? 'text-success'
                        : 'text-[#838A9A]',
                    )}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#FAF4E5] px-3 py-1 text-xs font-medium text-[#422C23]">
                    {formatAuthRole(record.assignedRole)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Select
                      className="min-w-[148px] !border-[#BE880B] !bg-white !py-2 !text-xs !font-medium !text-[#422C23]"
                      options={[...USER_ROLE_OPTIONS]}
                      value={record.assignedRole}
                      onChange={(e) => {
                        if (
                          e.target.value &&
                          e.target.value !== record.assignedRole
                        ) {
                          onRoleChange(record.id, e.target.value);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF4E5] text-[#422C23] transition-colors hover:bg-[#BE880B] hover:text-white"
                      aria-label={`Edit ${record.fullName}`}
                    >
                      <Settings2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
