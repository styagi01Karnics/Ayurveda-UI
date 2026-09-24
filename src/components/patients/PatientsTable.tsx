import { Link } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/Badge';
import { DataTableShell } from '@/components/ui/DataTableShell';
import { IconActionButton } from '@/components/ui/IconActionButton';
import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';
import type { Dosha, PatientRecord, PatientStatus, VisitType } from '@/types';

interface PatientsTableProps {
  records: PatientRecord[];
  onRowClick?: (record: PatientRecord) => void;
  onDownloadBill?: (record: PatientRecord) => void;
  onUploadReport?: (record: PatientRecord) => void;
  embedded?: boolean;
}

export function PatientsTable({
  records,
  onRowClick,
  onDownloadBill,
  onUploadReport,
  embedded,
}: PatientsTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="screen-label border-b border-gray-100 bg-gray-50/80">
            <th className="w-[11%] px-3 py-3">Patient Code</th>
            <th className="w-[14%] px-3 py-3">Patient</th>
            <th className="w-[12%] px-3 py-3">Doctor</th>
            <th className="w-[11%] px-3 py-3">Visit Type</th>
            <th className="w-[14%] px-3 py-3">Appointment Date</th>
            <th className="w-[18%] px-3 py-3">Dosha | Status</th>
            <th className="w-[8%] px-3 py-3">Bill</th>
            <th className="w-[12%] px-3 py-3">Report</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-12 text-center text-text-muted">
                No patients found matching your filters.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={() => onRowClick?.(record)}
                    className="w-full text-left hover:text-gold"
                  >
                    <div className="truncate font-medium text-brown">{record.id}</div>
                    {record.secondaryId ? (
                      <div className="truncate text-xs text-text-muted">
                        {record.secondaryId}
                      </div>
                    ) : null}
                  </button>
                </td>
                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={() => onRowClick?.(record)}
                    className="w-full text-left hover:text-gold"
                  >
                    <div className="truncate font-medium text-brown">{record.name}</div>
                    <div className="truncate text-xs text-text-muted">{record.phone}</div>
                  </button>
                </td>
                <td className="truncate px-3 py-4 text-brown">{record.doctor}</td>
                <td className="px-3 py-4">
                  <VisitTypeText type={record.visitType} />
                </td>
                <td className="truncate px-3 py-4 text-text-muted">
                  {record.appointmentDate}
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap items-center gap-1">
                    <DoshaBadge dosha={record.dosha} />
                    <span className="text-text-muted">|</span>
                    <StatusBadge status={record.status} />
                  </div>
                </td>
                <td className="px-3 py-4">
                  <IconActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadBill?.(record);
                    }}
                    aria-label={`Download bill for ${record.name}`}
                  >
                    <AppIcon src={assets.icons.download} className="h-4 w-4" />
                  </IconActionButton>
                </td>
                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUploadReport?.(record);
                    }}
                    className="inline-flex max-w-full items-center gap-1 rounded-lg bg-sidebar px-2 py-1.5 text-xs font-medium text-brown hover:bg-gold/10"
                  >
                    <UploadCloud className="h-3.5 w-3.5 shrink-0 text-brown" strokeWidth={2} />
                    <span className="truncate">Upload</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </DataTableShell>
  );
}

function VisitTypeText({ type }: { type: VisitType }) {
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
  const color =
    status === 'Completed' || status === 'Scheduled'
      ? 'text-[#2E7D32]'
      : status === 'Cancelled' || status === 'Missed'
        ? 'text-[#D64545]'
        : status === 'Pending' ||
            status === 'Follow-Up' ||
            status === 'Upcoming'
          ? 'text-[#EAB308]'
          : 'text-text-muted';
  return <span className={cn('text-xs font-semibold', color)}>{status}</span>;
}

export function PatientBreadcrumbs() {
  return (
    <nav className="text-sm text-text-muted">
      <Link to="/patients" className="hover:text-gold">
        Patients
      </Link>
      <span className="mx-2">/</span>
      <span className="text-brown">Patient Details</span>
    </nav>
  );
}
