import { recentPatientRecords } from './dashboard';

export const allPatients = recentPatientRecords.concat([
  {
    id: '#PT458656',
    secondaryId: 'GAN2025-0133',
    name: 'Sneha Reddy',
    phone: '+91-9012345678',
    doctor: 'Dr. Sharma',
    visitType: 'Consultation' as const,
    appointmentDate: '11 Oct 2026, 03:45 PM',
    dosha: 'Pitta' as const,
    status: 'Completed' as const,
    isActive: true,
  },
  {
    id: '#PT458657',
    secondaryId: 'GAN2025-0134',
    name: 'Vikram Singh',
    phone: '+91-8765432109',
    doctor: 'Dr. Gupta',
    visitType: 'Follow-Up' as const,
    appointmentDate: '10 Oct 2026, 10:20 AM',
    dosha: 'Kapha' as const,
    status: 'Cancelled' as const,
    isActive: false,
  },
]);

export const FILTER_OPTIONS = {
  status: ['Completed', 'Pending', 'Cancelled', 'Follow-Up'],
  visitType: ['Consultation', 'Follow-Up', 'Treatment'],
  dosha: ['Vata', 'Pitta', 'Kapha'],
} as const;
