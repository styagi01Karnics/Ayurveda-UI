import { Card } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { SalesStats } from '@/types';

interface SalesStatCardsProps {
  stats: SalesStats;
}

export function SalesStatCards({ stats }: SalesStatCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: formatNumber(stats.totalPatients),
      pills: [
        `${stats.patientsCompleted} Completed`,
        `${stats.patientsOngoing} Ongoing`,
      ],
    },
    {
      title: 'Appointments This Month',
      value: formatNumber(stats.appointmentsThisMonth),
      pills: [
        `${stats.appointmentsCompleted} Completed`,
        `${stats.appointmentsOngoing} Ongoing`,
      ],
    },
    {
      title: 'Revenue This Month',
      value: formatCurrency(stats.revenueThisMonth),
      pills: [stats.revenuePeriod],
    },
    {
      title: 'Completed Treatments',
      value: formatNumber(stats.completedTreatments),
      pills: [] as string[],
    },
  ];

  return (
    <div className="dash-grid">
      {cards.map((card) => (
        <Card key={card.title} className="dashboard-card">
          <p className="text-base font-medium text-text-muted">{card.title}</p>
          <p className="mt-2 text-[28px] font-bold leading-none text-brown">
            {card.value}
          </p>
          {card.pills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {card.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full bg-[#faf4e5] px-2.5 py-1 text-xs font-medium text-text-muted"
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
