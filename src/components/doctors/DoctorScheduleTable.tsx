import { DataTableShell } from '@/components/ui/DataTableShell';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { DoctorScheduleItem, VisitType } from '@/types';

interface DoctorScheduleTableProps {
  items: DoctorScheduleItem[];
  onStart: (id: string) => void;
  onCancel: (id: string) => void;
  startingId?: string | null;
  embedded?: boolean;
}

export function DoctorScheduleTable({
  items,
  onStart,
  onCancel,
  startingId = null,
  embedded,
}: DoctorScheduleTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="screen-label border-b border-[#e0d6c8] bg-[#faf7f2]/80">
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Visit Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#e8dfd0] hover:bg-[#faf7f2]/60"
              >
                <td className="px-5 py-4 text-brown">{item.time}</td>
                <td className="px-5 py-4 font-medium text-brown">
                  {item.patient}
                </td>
                <td className="px-5 py-4">
                  <VisitTypeText type={item.visitType} />
                </td>
                <td className="px-5 py-4">
                  <StatusText status={item.status} />
                </td>
                <td className="px-5 py-4">
                  {item.status === 'Scheduled' ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="bg-[#E6EFE3] text-[#036F4B] hover:bg-[#d8e8d4]"
                        style={{ border: '0.23px solid #036F4B' }}
                        onClick={() => onStart(item.id)}
                        disabled={startingId === item.id}
                      >
                        {startingId === item.id ? 'Starting…' : 'Start'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="bg-[#FAE3E2] text-[#DC2626] hover:bg-[#f4d4d2]"
                        style={{ border: '0.23px solid #DC2626' }}
                        onClick={() => onCancel(item.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : item.status === 'In Consultation' ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onStart(item.id)}
                    >
                      Continue
                    </Button>
                  ) : item.status === 'Completed' ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onStart(item.id)}
                    >
                      Edit
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
  return (
    <span className={cn('font-medium', type === 'Consultation' || type === 'Therapy' ? 'text-gold' : '')}>
      {type}
    </span>
  );
}

function StatusText({
  status,
}: {
  status: DoctorScheduleItem['status'];
}) {
  const color =
    status === 'Completed' || status === 'Scheduled'
      ? 'text-[#2E7D32]'
      : status === 'In Consultation'
        ? 'text-[#EAB308]'
        : 'text-text-muted';
  return <span className={cn('text-xs font-semibold', color)}>{status}</span>;
}
