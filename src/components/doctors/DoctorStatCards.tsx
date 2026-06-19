import { Card } from '@/components/ui/Card';
import type { DoctorStats } from '@/types';

interface DoctorStatCardsProps {
  stats: DoctorStats;
}

export function DoctorStatCards({ stats }: DoctorStatCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      pills: [
        { label: `${stats.completedPatients} Completed`, variant: 'gold' as const },
        { label: `${stats.ongoingPatients} Ongoing`, variant: 'gold' as const },
      ],
    },
    {
      title: 'Active Treatment Plans',
      value: stats.activeTreatmentPlans,
      pills: [
        { label: `${stats.completedTreatmentPlans} Completed`, variant: 'gold' as const },
        { label: `${stats.ongoingTreatmentPlans} Ongoing`, variant: 'gold' as const },
      ],
    },
    {
      title: 'Completed Treatments',
      value: stats.completedTreatments,
      pills: [
        { label: `${stats.consultationCount} Consultation`, variant: 'gold' as const },
        { label: `${stats.therapyCount} Therapy`, variant: 'gold' as const },
      ],
    },
    {
      title: 'Follow Ups Due',
      value: stats.followUpsDue,
      pills: [
        { label: `${stats.followUpsScheduled} Scheduled`, variant: 'gold' as const },
        { label: `${stats.followUpsPending} Pending`, variant: 'gold' as const },
      ],
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <p className="text-sm text-text-muted">{card.title}</p>
          <p className="mt-1 text-3xl font-bold text-brown">{card.value}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.pills.map((pill) => (
              <span
                key={pill.label}
                className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold"
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
