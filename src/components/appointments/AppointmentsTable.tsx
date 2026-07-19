import { DataTableShell } from '@/components/ui/DataTableShell';
import { cn } from '@/lib/utils';
import type { AppointmentRecord, VisitType } from '@/types';

interface AppointmentsTableProps {
  items: AppointmentRecord[];
  onCancel: (id: string) => void;
  embedded?: boolean;
}

export function AppointmentsTable({
  items,
  onCancel,
  embedded,
}: AppointmentsTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">UHID No.</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Visit Type</th>
              <th className="px-5 py-3 font-medium">Appointment Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
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
                  <VisitTypeText type={item.visitType} />
                </td>
                <td className="px-5 py-4 text-text-muted">
                  {item.appointmentDate}
                </td>
                <td className="px-5 py-4">
                  <AppointmentStatus status={item.status} />
                </td>
                <td className="px-5 py-4">
                  {item.status === 'Scheduled' ? (
                    <button
                      type="button"
                      onClick={() => onCancel(item.id)}
                      className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/15"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </DataTableShell>
  );
}

function VisitTypeText({ type }: { type: VisitType }) {
  return <span className="font-medium text-gold">{type}</span>;
}

function AppointmentStatus({
  status,
}: {
  status: AppointmentRecord['status'];
}) {
  const colors = {
    Scheduled: 'text-gold',
    Completed: 'text-success',
    Cancelled: 'text-danger',
  };
  return <span className={cn('font-medium', colors[status])}>{status}</span>;
}
