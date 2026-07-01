import { Badge } from '@/components/ui/Badge';
import { DataTableShell } from '@/components/ui/DataTableShell';
import { cn } from '@/lib/utils';
import type { Dosha, PatientRecord, PatientStatus, VisitType } from '@/types';

interface PatientRecordsTableProps {
  records: PatientRecord[];
  title?: string;
  showActions?: boolean;
  compact?: boolean;
}

export function PatientRecordsTable({
  records,
  title = 'Recent Patient Records',
  showActions = false,
  compact = false,
}: PatientRecordsTableProps) {
  return (
    <DataTableShell>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
        <h3 className="font-semibold text-brown">{title}</h3>
        <button type="button" className="text-sm font-medium text-gold hover:underline">
          View All
        </button>
      </div>

      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
            <th className="w-[12%] px-3 py-3 font-medium">Patient ID</th>
            <th className="w-[14%] px-3 py-3 font-medium">Patient</th>
            <th className="w-[12%] px-3 py-3 font-medium">Doctor</th>
            <th className="w-[11%] px-3 py-3 font-medium">Visit Type</th>
            <th className="w-[14%] px-3 py-3 font-medium">Appointment Date</th>
            <th className="px-3 py-3 font-medium">
              {compact ? 'Dosha | Status' : 'Dosha'}
            </th>
            {!compact && <th className="px-3 py-3 font-medium">Status</th>}
            {showActions && (
              <>
                <th className="w-[8%] px-3 py-3 font-medium">Bill</th>
                <th className="w-[10%] px-3 py-3 font-medium">Report</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-gray-50 hover:bg-gray-50/50"
            >
              <td className="px-3 py-4">
                <div className="truncate font-medium text-brown">{record.id}</div>
                <div className="truncate text-xs text-text-muted">{record.secondaryId}</div>
              </td>
              <td className="px-3 py-4">
                <div className="truncate font-medium text-brown">{record.name}</div>
                <div className="truncate text-xs text-text-muted">{record.phone}</div>
              </td>
              <td className="truncate px-3 py-4 text-brown">{record.doctor}</td>
              <td className="px-3 py-4">
                <VisitTypeBadge type={record.visitType} />
              </td>
              <td className="truncate px-3 py-4 text-text-muted">
                {record.appointmentDate}
              </td>
              {compact ? (
                <td className="px-3 py-4">
                  <div className="flex flex-wrap items-center gap-1">
                    <DoshaBadge dosha={record.dosha} />
                    <span className="text-text-muted">|</span>
                    <StatusBadge status={record.status} />
                  </div>
                </td>
              ) : (
                <>
                  <td className="px-3 py-4">
                    <DoshaBadge dosha={record.dosha} />
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                </>
              )}
              {showActions && (
                <>
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                      aria-label="Download bill"
                    >
                      ↓
                    </button>
                  </td>
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      className="rounded-lg bg-sidebar px-2 py-1.5 text-xs font-medium text-brown hover:bg-gold/10"
                    >
                      ↑ Upload
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableShell>
  );
}

function VisitTypeBadge({ type }: { type: VisitType }) {
  return (
    <span className={cn('font-medium', type === 'Consultation' && 'text-gold')}>
      {type}
    </span>
  );
}

function DoshaBadge({ dosha }: { dosha: Dosha }) {
  return <Badge variant="info">{dosha}</Badge>;
}

function StatusBadge({ status }: { status: PatientStatus }) {
  const variant =
    status === 'Completed'
      ? 'success'
      : status === 'Cancelled'
        ? 'danger'
        : status === 'Follow-Up'
          ? 'gold'
          : 'neutral';
  return <Badge variant={variant}>{status}</Badge>;
}
