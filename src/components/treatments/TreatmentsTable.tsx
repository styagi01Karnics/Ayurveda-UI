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
              <th className="px-5 py-3 font-medium">Treatment Category</th>
              <th className="px-5 py-3 font-medium">Therapy Type</th>
              <th className="px-5 py-3 font-medium">Assigned Therapist</th>
              <th className="px-5 py-3 font-medium">Total Sessions</th>
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
                  <td className="px-5 py-4 text-brown">{record.treatmentCategory}</td>
                  <td className="px-5 py-4 font-medium text-gold">
                    {record.therapyType}
                  </td>
                  <td className="px-5 py-4 text-brown">
                    <span className="block">{record.assignedTherapist}</span>
                    <span className="text-xs text-text-muted">
                      {record.therapistSchedule}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brown">{record.totalSessions}</td>
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
  return (
    <span
      className={cn(
        'font-medium',
        status === 'Ongoing' ? 'text-gold' : 'text-success',
      )}
    >
      {status}
    </span>
  );
}