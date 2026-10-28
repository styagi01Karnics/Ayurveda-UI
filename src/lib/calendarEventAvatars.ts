import type { VisitType } from '@/types';

export function resolveCalendarEventTitle(visitType: VisitType): string {
  switch (visitType) {
    case 'Consultation':
      return 'Quarterly Health Checkup';
    case 'Therapy':
      return 'Therapy Session';
    case 'Follow-Up':
      return 'Follow-Up Visit';
    case 'Treatment':
      return 'Treatment Session';
    default:
      return 'Health Checkup';
  }
}
