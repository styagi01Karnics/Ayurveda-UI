import { DataTableShell } from '@/components/ui/DataTableShell';
import { cn } from '@/lib/utils';
import type { DoctorDirectoryRecord } from '@/types';

interface DoctorsTableProps {
  records: DoctorDirectoryRecord[];
  embedded?: boolean;
}

export function DoctorsTable({ records, embedded }: DoctorsTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
            <th className="w-[12%] px-4 py-3 font-medium">Doctor Code</th>
            <th className="w-[16%] px-4 py-3 font-medium">Name</th>
            <th className="w-[14%] px-4 py-3 font-medium">Specialization</th>
            <th className="w-[12%] px-4 py-3 font-medium">Department</th>
            <th className="w-[12%] px-4 py-3 font-medium">Qualification</th>
            <th className="w-[12%] px-4 py-3 font-medium">Room</th>
            <th className="w-[12%] px-4 py-3 font-medium">Contact</th>
            <th className="w-[10%] px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-text-muted"
              >
                No doctors found matching your filters.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="px-4 py-4 font-medium text-brown">
                  {record.doctorCode}
                </td>
                <td className="px-4 py-4 font-medium text-brown">
                  {record.name}
                </td>
                <td className="px-4 py-4 text-brown">{record.specialization}</td>
                <td className="px-4 py-4 text-brown">{record.department}</td>
                <td className="px-4 py-4 text-brown">{record.qualification}</td>
                <td className="px-4 py-4 text-brown">
                  {record.consultationRoom}
                </td>
                <td className="px-4 py-4 text-brown">
                  <div className="space-y-0.5">
                    <p>{record.mobileNumber}</p>
                    <p className="truncate text-xs text-text-muted">
                      {record.email}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'font-medium',
                      record.status === 'Active'
                        ? 'text-success'
                        : 'text-text-muted',
                    )}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </DataTableShell>
  );
}
