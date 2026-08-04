import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { assets } from '@/lib/assets';
import type { ScheduleAppointment } from '@/types';

interface TodayScheduleCardProps {
  dateLabel: string;
  ongoing: ScheduleAppointment;
  next: ScheduleAppointment;
  remaining: number;
  viewFullScheduleTo?: string;
}

export function TodayScheduleCard({
  dateLabel,
  ongoing,
  next,
  remaining,
  viewFullScheduleTo = '/appointments',
}: TodayScheduleCardProps) {
  return (
    <Card className="dashboard-card relative overflow-hidden border-[#e8dfd0] bg-[#fdf8ee] p-5">
      <img
        src={assets.scheduleDecor}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[88px] w-[88px] object-contain sm:h-[100px] sm:w-[100px]"
      />

      <div className="relative mb-4 pr-16">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.5} />
          <h3 className="font-serif text-base font-semibold text-brown">
            Today&apos;s Schedule
          </h3>
        </div>
        <p className="mt-1 pl-6 text-xs font-medium text-gold">{dateLabel}</p>
      </div>

      <div className="space-y-2.5">
        <ScheduleSubCard title="Ongoing Appointment:">
          <p className="text-sm font-semibold text-brown">{ongoing.patientName}</p>
          <p className="text-xs text-text-muted">{ongoing.reason}</p>
        </ScheduleSubCard>

        <ScheduleSubCard title="Next Appointment:">
          <p className="text-sm font-semibold text-brown">
            {next.patientName} - {next.time}
          </p>
          <p className="text-xs text-text-muted">{next.reason}</p>
        </ScheduleSubCard>

        <ScheduleSubCard title="Remaining Today:">
          <p className="text-sm font-semibold text-brown">{remaining}</p>
        </ScheduleSubCard>
      </div>

      <Link
        to={viewFullScheduleTo}
        className="mt-5 block w-full rounded-xl border border-gold bg-transparent py-2.5 text-center text-sm font-semibold text-gold transition-colors hover:bg-gold/5"
      >
        View Full Schedule
      </Link>
    </Card>
  );
}

function ScheduleSubCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#fffcf7] px-3.5 py-2.5">
      <p className="text-xs text-text-muted">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
