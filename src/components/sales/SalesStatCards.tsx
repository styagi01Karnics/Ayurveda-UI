import { Card } from '@/components/ui/Card';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
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
        <Card key={card.title} className="dashboard-card space-y-3 p-5">
          <p className="font-sans text-[16px] font-semibold leading-5 tracking-normal text-[#838A9A]">
            {card.title}
          </p>
          <p className="font-sans text-[22px] font-semibold leading-9 tracking-normal text-[#422C23]">
            {card.value}
          </p>
          {card.pills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {card.pills.map((pill) => (
                <span
                  key={pill}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    pill.endsWith('Completed') || pill.endsWith('Scheduled')
                      ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
                      : 'bg-[#faf4e5] text-brown',
                  )}
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
