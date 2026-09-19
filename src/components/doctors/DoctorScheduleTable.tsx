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
            <tr className="border-b border-[#e0d6c8] bg-[#faf7f2]/80 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Visit Type</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
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
                        className="h-8 rounded-lg bg-success px-4 py-1.5 text-xs font-semibold text-white hover:bg-success/90"
                        onClick={() => onStart(item.id)}
                        disabled={startingId === item.id}
                      >
                        {startingId === item.id ? 'Starting…' : 'Start'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => onCancel(item.id)}
                        className="h-8 rounded-lg border border-danger/25 bg-[#fceaea] px-4 py-1.5 text-xs font-semibold text-danger hover:bg-[#f8dede]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : item.status === 'In Consultation' ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-lg border-gold bg-white px-4 py-1.5 text-xs font-semibold text-gold hover:bg-gold/5"
                      onClick={() => onStart(item.id)}
                    >
                      Continue
                    </Button>
                  ) : item.status === 'Completed' ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-lg border-gold bg-white px-4 py-1.5 text-xs font-semibold text-gold hover:bg-gold/5"
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
    status === 'Completed'
      ? 'text-[#2E7D32]'
      : status === 'Scheduled' || status === 'In Consultation'
        ? 'text-[#EAB308]'
        : 'text-text-muted';
  return <span className={cn('text-xs font-semibold', color)}>{status}</span>;
}
