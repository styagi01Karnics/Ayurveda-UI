import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ScheduleAppointment } from '@/types';

interface TodayScheduleCardProps {
  dateLabel: string;
  ongoing: ScheduleAppointment;
  next: ScheduleAppointment;
  remaining: number;
}

export function TodayScheduleCard({
  dateLabel,
  ongoing,
  next,
  remaining,
}: TodayScheduleCardProps) {
  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-brown">Today&apos;s Schedule</h3>
          <p className="mt-1 text-xs text-text-muted">{dateLabel}</p>
        </div>
        <Leaf className="h-5 w-5 text-kapha" strokeWidth={1.5} />
      </div>

      <ScheduleBlock title="Ongoing Appointment" appointment={ongoing} />
      <ScheduleBlock title="Next Appointment" appointment={next} className="mt-4" />

      <p className="mt-4 text-sm text-text-muted">
        Remaining Today:{' '}
        <span className="font-semibold text-brown">{remaining}</span>
      </p>

      <Button variant="outline" fullWidth className="mt-4">
        View Full Schedule
      </Button>
    </Card>
  );
}

function ScheduleBlock({
  title,
  appointment,
  className,
}: {
  title: string;
  appointment: ScheduleAppointment;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-text-muted">{title}</p>
      <p className="mt-1 text-sm font-semibold text-brown">
        {appointment.patientName}
      </p>
      <p className="text-xs text-text-muted">
        {appointment.time} · {appointment.reason}
      </p>
    </div>
  );
}
