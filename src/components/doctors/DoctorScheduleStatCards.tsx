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
        { label: `${stats.completedPatients} Completed` },
        { label: `${stats.ongoingPatients} Ongoing` },
      ],
    },
    {
      title: 'Active Treatment Plans',
      value: stats.activeTreatmentPlans,
      pills: [
        { label: `${stats.completedTreatmentPlans} Completed` },
        { label: `${stats.ongoingTreatmentPlans} Ongoing` },
      ],
    },
    {
      title: 'Completed Treatments',
      value: stats.completedTreatments,
      pills: [
        { label: `${stats.consultationCount} Consultation` },
        { label: `${stats.therapyCount} Therapy` },
      ],
    },
    {
      title: 'Follow Ups Due',
      value: stats.followUpsDue,
      pills: [
        { label: `${stats.followUpsScheduled} Scheduled` },
        { label: `${stats.followUpsPending} Pending` },
      ],
    },
  ];

  return (
    <div className="dash-grid">
      {cards.map((card) => (
        <Card key={card.title}>
          <p className="text-sm text-text-muted">{card.title}</p>
          <p className="mt-1 text-3xl font-bold text-brown">{card.value}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.pills.map((pill) => (
              <span
                key={pill.label}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  pill.label.endsWith('Completed')
                    ? 'bg-success/15 text-success'
                    : 'bg-gold/15 text-gold',
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
