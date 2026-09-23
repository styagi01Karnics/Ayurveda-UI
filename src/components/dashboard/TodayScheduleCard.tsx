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
    <Card className="dashboard-card relative flex h-full flex-col overflow-hidden border-[#e8dfd0] bg-[#F5F0E4] p-5">
      <img
        src={assets.scheduleDecor}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-0 h-[118px] w-[118px] object-contain object-right-top sm:h-[136px] sm:w-[136px]"
      />

      <div className="relative z-[1] mb-4 pr-[7.5rem] sm:pr-32">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.5} />
          <h3 className="dashboard-card-title">Today&apos;s Schedule</h3>
        </div>
        <p className="mt-1.5 pl-6 font-sans text-[11px] font-semibold leading-none tracking-normal text-[#BE880B]">
          {dateLabel}
        </p>
      </div>

      <div className="relative z-[1] space-y-2.5">
        <ScheduleSubCard title="Ongoing Appointment:">
          <p className="text-sm font-semibold text-brown">
            {ongoing.patientName || '—'}
          </p>
          {ongoing.reason ? (
            <p className="mt-0.5 text-xs text-text-muted">{ongoing.reason}</p>
          ) : null}
        </ScheduleSubCard>

        <ScheduleSubCard title="Next Appointment:">
          <p className="text-sm font-semibold text-brown">
            {next.patientName
              ? `${next.patientName}${next.time ? ` - ${next.time}` : ''}`
              : '—'}
          </p>
          {next.reason ? (
            <p className="mt-0.5 text-xs text-text-muted">{next.reason}</p>
          ) : null}
        </ScheduleSubCard>

        <ScheduleSubCard title="Remaining Today:">
          <p className="text-sm font-semibold text-brown">{remaining}</p>
        </ScheduleSubCard>
      </div>

      <Link
        to={viewFullScheduleTo}
        className="relative z-[1] mt-5 block w-full rounded-xl border border-gold bg-transparent py-2.5 text-center text-sm font-semibold text-gold transition-colors hover:bg-gold/5"
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
    <div className="rounded-xl bg-[#fffcf7] px-3.5 py-2.5 shadow-sm shadow-brown/5">
      <p className="text-xs text-text-muted">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
