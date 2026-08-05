import { DataTableShell } from '@/components/ui/DataTableShell';
import { cn } from '@/lib/utils';
import type { TreatmentRecord } from '@/types';

interface TreatmentsTableProps {
  records: TreatmentRecord[];
  onRowClick?: (record: TreatmentRecord) => void;
  embedded?: boolean;
}

export function TreatmentsTable({
  records,
  onRowClick,
  embedded,
}: TreatmentsTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Treatment Plan</th>
              <th className="px-5 py-3 font-medium">Period</th>
              <th className="px-5 py-3 font-medium">Sessions</th>
              <th className="px-5 py-3 font-medium">Assigned Therapist</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-text-muted">
                  No treatments found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className={cn(
                    'border-b border-gray-50 hover:bg-gray-50/50',
                    onRowClick && 'cursor-pointer',
                  )}
                  onClick={() => onRowClick?.(record)}
                >
                  <td className="px-5 py-4 font-medium text-brown">
                    {record.patient}
                  </td>
                  <td className="px-5 py-4 font-medium text-gold">
                    {record.treatmentPlanName}
                  </td>
                  <td className="px-5 py-4 text-brown">{record.therapistSchedule}</td>
                  <td className="px-5 py-4 text-brown">
                    <span className="block">
                      {record.completedSessions}/{record.totalSessions}
                    </span>
                    <span className="text-xs text-text-muted">
                      {record.remainingSessions} remaining
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brown">
                    {record.assignedTherapist}
                  </td>
                  <td className="px-5 py-4">
                    <TreatmentStatus status={record.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </DataTableShell>
  );
}

function TreatmentStatus({ status }: { status: TreatmentRecord['status'] }) {
  const colors: Record<TreatmentRecord['status'], string> = {
    Scheduled: 'text-text-muted',
    Ongoing: 'text-gold',
    Completed: 'text-success',
  };
  return (
    <span className={cn('font-medium', colors[status])}>{status}</span>
  );
}
