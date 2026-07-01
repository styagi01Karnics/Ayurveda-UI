import { DataTableShell } from '@/components/ui/DataTableShell';
import { cn } from '@/lib/utils';
import type { FollowUpRecord } from '@/types';

interface FollowUpsTableProps {
  items: FollowUpRecord[];
}

export function FollowUpsTable({ items }: FollowUpsTableProps) {
  return (
    <DataTableShell>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">UHID No.</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Visit Type</th>
              <th className="px-5 py-3 font-medium">Appointment Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4 font-medium text-brown">{item.uhid}</td>
                <td className="px-5 py-4 text-brown">{item.patient}</td>
                <td className="px-5 py-4 text-brown">{item.doctor}</td>
                <td className="px-5 py-4">
                  <span className="font-medium text-gold">{item.visitType}</span>
                </td>
                <td className="px-5 py-4 text-text-muted">
                  {item.appointmentDate}
                </td>
                <td className="px-5 py-4">
                  <FollowUpStatus status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </DataTableShell>
  );
}

function FollowUpStatus({ status }: { status: FollowUpRecord['status'] }) {
  const colors: Record<FollowUpRecord['status'], string> = {
    Upcoming: 'text-gold',
    Missed: 'text-danger',
    Completed: 'text-success',
  };
  return <span className={cn('font-medium', colors[status])}>{status}</span>;
}
