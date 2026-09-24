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
    <Card className="dashboard-card today-schedule-card relative flex h-full min-h-0 flex-col overflow-hidden p-3.5">
      <img
        src={assets.scheduleDecor}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-0 h-[88px] w-[88px] object-contain object-right-top sm:h-[100px] sm:w-[100px]"
      />

      <div className="relative z-[1] mb-2 pr-24 sm:pr-28">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.5} />
          <h3 className="font-sans text-[16px] font-bold leading-5 tracking-normal text-[#6A4739]">
            Today&apos;s Schedule
          </h3>
        </div>
        <p className="mt-1 pl-6 font-sans text-[11px] font-semibold leading-none tracking-normal text-[#BE880B]">
          {dateLabel}
        </p>
      </div>

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-1.5">
        <ScheduleSubCard title="Ongoing Appointment:">
          <p className={SCHEDULE_VALUE}>
            {ongoing.patientName || '—'}
          </p>
          {ongoing.reason ? (
            <p className={`mt-0.5 ${SCHEDULE_VALUE}`}>{ongoing.reason}</p>
          ) : null}
        </ScheduleSubCard>

        <ScheduleSubCard title="Next Appointment:">
          <p className={SCHEDULE_VALUE}>
            {next.patientName
              ? `${next.patientName}${next.time ? ` - ${next.time}` : ''}`
              : '—'}
          </p>
          {next.reason ? (
            <p className={`mt-0.5 ${SCHEDULE_VALUE}`}>{next.reason}</p>
          ) : null}
        </ScheduleSubCard>

        <ScheduleSubCard title="Remaining Today:">
          <p className={SCHEDULE_VALUE}>{remaining}</p>
        </ScheduleSubCard>
      </div>

      <Link
        to={viewFullScheduleTo}
        className="relative z-[1] mt-2 block w-full shrink-0 rounded-xl border border-[#BE880B] bg-[#FFFFFFCC] py-2 text-center text-sm font-semibold text-[#BE880B] transition-colors hover:bg-white"
      >
        View Full Schedule
      </Link>
    </Card>
  );
}

const SCHEDULE_VALUE =
  'font-sans text-[10px] font-semibold leading-[150%] tracking-normal text-[#422C23]';

function ScheduleSubCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center rounded-xl bg-[#FFFFFFCC] px-3 py-1.5 shadow-sm shadow-brown/5">
      <p className="font-sans text-[12px] font-semibold leading-4 tracking-normal text-[#727983]">
        {title}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
