import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { DoctorStats } from '@/types';

interface DoctorScheduleStatCardsProps {
  stats: DoctorStats;
}

export function DoctorScheduleStatCards({ stats }: DoctorScheduleStatCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      pills: [
        { label: `${stats.completedPatients} Completed`, tone: 'success' as const },
        { label: `${stats.ongoingPatients} Ongoing`, tone: 'muted' as const },
      ],
    },
    {
      title: 'Active Treatment Plans',
      value: stats.activeTreatmentPlans,
      pills: [
        { label: `${stats.completedTreatmentPlans} Completed`, tone: 'success' as const },
        { label: `${stats.ongoingTreatmentPlans} Ongoing`, tone: 'muted' as const },
      ],
    },
    {
      title: 'Completed Treatments',
      value: stats.completedTreatments,
      pills: [
        { label: `${stats.consultationCount} Consultation`, tone: 'muted' as const },
        { label: `${stats.therapyCount} Therapy`, tone: 'muted' as const },
      ],
    },
    {
      title: 'Follow Ups Due',
      value: stats.followUpsDue,
      pills: [
        { label: `${stats.followUpsScheduled} Scheduled`, tone: 'muted' as const },
        { label: `${stats.followUpsPending} Pending`, tone: 'muted' as const },
      ],
    },
  ];

  return (
    <div className="dash-grid">
      {cards.map((card) => (
        <Card key={card.title} className="dashboard-card space-y-3 p-5">
          <p className="dashboard-card-title text-brown">{card.title}</p>
          <p className="text-[28px] font-bold leading-none tracking-tight text-brown">
            {card.value}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {card.pills.map((pill) => (
              <span
                key={pill.label}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  pill.tone === 'success'
                    ? 'bg-success/15 text-success'
                    : 'bg-[#faf4e5] text-brown',
                )}
              >
                {pill.label}
              </span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
