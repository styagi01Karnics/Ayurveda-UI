import { DataTableShell } from '@/components/ui/DataTableShell';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { AppointmentRecord, VisitType } from '@/types';

interface AppointmentsTableProps {
  items: AppointmentRecord[];
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  embedded?: boolean;
}

export function AppointmentsTable({
  items,
  onCancel,
  onReschedule,
  embedded,
}: AppointmentsTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Patient Code</th>
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
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => onCancel(item.id)}
                    >
                      Cancel
                    </Button>
                  ) : item.status === 'Cancelled' ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onReschedule(item.id)}
                    >
                      Reschedule
                    </Button>
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
    Scheduled: 'text-[#EAB308]',
    Completed: 'text-[#2E7D32]',
    Cancelled: 'text-danger',
  };
  return <span className={cn('font-medium', colors[status])}>{status}</span>;
}
