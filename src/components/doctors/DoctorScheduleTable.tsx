import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { DoctorScheduleItem, VisitType } from '@/types';

interface DoctorScheduleTableProps {
  items: DoctorScheduleItem[];
  onStart: (id: string) => void;
  onCancel: (id: string) => void;
}

export function DoctorScheduleTable({
  items,
  onStart,
  onCancel,
}: DoctorScheduleTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs text-text-muted">
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
                className="border-b border-gray-50 hover:bg-gray-50/50"
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
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="px-4 py-1.5 text-xs bg-success hover:bg-success/90"
                        onClick={() => onStart(item.id)}
                      >
                        Start
                      </Button>
                      <button
                        type="button"
                        onClick={() => onCancel(item.id)}
                        className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/15"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function VisitTypeText({ type }: { type: VisitType }) {
  return (
    <span className={cn('font-medium', type === 'Consultation' || type === 'Therapy' ? 'text-gold' : '')}>
      {type}
    </span>
  );
}

function StatusText({ status }: { status: 'Scheduled' | 'Completed' }) {
  return (
    <span
      className={cn(
        'font-medium',
        status === 'Scheduled' ? 'text-gold' : 'text-success',
      )}
    >
      {status}
    </span>
  );
}
