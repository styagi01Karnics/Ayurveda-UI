import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import type { DoctorDirectoryRecord } from '@/types';

interface DoctorStatCardsProps {
  doctors: DoctorDirectoryRecord[];
}

export function DoctorStatCards({ doctors }: DoctorStatCardsProps) {
  const stats = useMemo(() => {
    const active = doctors.filter((d) => d.status === 'Active').length;
    const inactive = doctors.length - active;
    const departments = [...new Set(doctors.map((d) => d.department))];
    const specializations = [...new Set(doctors.map((d) => d.specialization))];
    const rooms = [...new Set(doctors.map((d) => d.consultationRoom))];

    return { active, inactive, departments, specializations, rooms };
  }, [doctors]);

  const cards = [
    {
      title: 'Total Doctors',
      value: doctors.length,
      pills: [
        { label: `${stats.active} Active` },
        { label: `${stats.inactive} Inactive` },
      ],
    },
    {
      title: 'Departments',
      value: stats.departments.length,
      pills: stats.departments.slice(0, 2).map((dept) => ({ label: dept })),
    },
    {
      title: 'Specializations',
      value: stats.specializations.length,
      pills: stats.specializations.slice(0, 2).map((spec) => ({ label: spec })),
    },
    {
      title: 'Consultation Rooms',
      value: stats.rooms.length,
      pills: stats.rooms.slice(0, 2).map((room) => ({ label: room })),
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
