import { Settings2 } from 'lucide-react';
import { DataTableShell } from '@/components/ui/DataTableShell';
import { Select } from '@/components/ui/Select';
import { USER_ROLE_OPTIONS } from '@/lib/validation/settings.schema';
import { cn } from '@/lib/utils';
import type { SettingsUserRecord } from '@/types';

interface UsersTableProps {
  records: SettingsUserRecord[];
  onRoleChange: (userId: string, newRole: string) => void;
}

export function UsersTable({ records, onRoleChange }: UsersTableProps) {
  return (
    <DataTableShell>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">User ID</th>
              <th className="px-5 py-3 font-medium">Name / Phone Number</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Assigned Role</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-text-muted">
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-medium text-brown">{record.userId}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-brown">{record.fullName}</p>
                    <p className="text-xs text-text-muted">{record.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-brown">{record.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'font-medium',
                        record.status === 'Active' ? 'text-success' : 'text-text-muted',
                      )}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-gold">
                      {record.assignedRole}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Select
                        className="min-w-[140px] text-xs"
                        options={[...USER_ROLE_OPTIONS]}
                        value={record.assignedRole}
                        onChange={(e) => {
                          if (e.target.value && e.target.value !== record.assignedRole) {
                            onRoleChange(record.id, e.target.value);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 bg-cream px-2.5 py-2 text-brown hover:bg-gold/10"
                        aria-label={`Edit ${record.fullName}`}
                      >
                        <Settings2 className="h-4 w-4 text-gold" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </DataTableShell>
  );
}
