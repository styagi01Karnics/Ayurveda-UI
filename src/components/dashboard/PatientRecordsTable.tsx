import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { DataTableShell } from '@/components/ui/DataTableShell';
import { cn } from '@/lib/utils';
import type { Dosha, PatientRecord, PatientStatus, VisitType } from '@/types';

interface PatientRecordsTableProps {
  records: PatientRecord[];
  title?: string;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
  viewAllTo?: string;
}

export function PatientRecordsTable({
  records,
  title = 'Recent Patient Records',
  showActions = false,
  compact = false,
  className,
  viewAllTo = '/patients',
}: PatientRecordsTableProps) {
  return (
    <DataTableShell className={cn('w-full', className)}>
      <div className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
        <h3 className="font-semibold text-brown">{title}</h3>
        <Link to={viewAllTo} className="text-sm font-medium text-gold hover:underline">
          View All
        </Link>
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[16%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[18%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
              <th className="px-3 py-3 font-medium">Patient ID</th>
              <th className="px-3 py-3 font-medium">Patient</th>
              <th className="px-3 py-3 font-medium">Doctor</th>
              <th className="px-3 py-3 font-medium">Visit Type</th>
              <th className="px-3 py-3 font-medium">Appointment Date</th>
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
                  <div className="truncate text-xs text-text-muted">
                    {record.secondaryId}
                  </div>
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
                    <span className="text-brown">{record.dosha}</span>
                    <span className="mx-1.5 text-text-muted">|</span>
                    <StatusText status={record.status} />
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
      </div>
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

function StatusText({ status }: { status: PatientStatus }) {
  const color =
    status === 'Completed'
      ? 'text-success'
      : status === 'Cancelled'
        ? 'text-danger'
        : status === 'Follow-Up'
          ? 'text-gold'
          : 'text-text-muted';
  return <span className={cn('font-medium', color)}>{status}</span>;
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
