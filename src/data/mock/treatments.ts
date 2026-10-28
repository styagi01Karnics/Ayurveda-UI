import type { TreatmentRecord } from '@/types';

const baseTreatment = {
  patient: 'Khushi Shroff',
  patientDetailId: '37944397',
  treatmentPlanName: 'Detox Package',
  treatmentCategory: 'Joint Pain',
  therapyType: 'Panchakarma',
  assignedTherapist: 'Meera Singh',
  therapistSchedule: '05 Aug 2026 – 20 Aug 2026',
  startDate: '2026-08-05',
  endDate: '2026-08-20',
  totalSessions: 7,
  completedSessions: 0,
  remainingSessions: 7,
} satisfies Omit<TreatmentRecord, 'id' | 'status' | 'dateCreated'>;

export const initialTreatments: TreatmentRecord[] = [
  { id: 'tr-1', ...baseTreatment, status: 'Ongoing', dateCreated: '2026-08-05', completedSessions: 2, remainingSessions: 5 },
  { id: 'tr-2', ...baseTreatment, status: 'Completed', dateCreated: '2026-08-06', completedSessions: 7, remainingSessions: 0 },
  { id: 'tr-3', ...baseTreatment, status: 'Scheduled', dateCreated: '2026-08-07' },
  { id: 'tr-4', ...baseTreatment, status: 'Ongoing', dateCreated: '2026-08-08', completedSessions: 1, remainingSessions: 6 },
  { id: 'tr-5', ...baseTreatment, status: 'Completed', dateCreated: '2026-08-09', completedSessions: 7, remainingSessions: 0 },
  { id: 'tr-6', ...baseTreatment, status: 'Ongoing', dateCreated: '2026-08-10', completedSessions: 3, remainingSessions: 4 },
];

export const TREATMENT_FILTER_OPTIONS = {
  status: ['Scheduled', 'Ongoing', 'Completed'],
  treatmentPlan: [] as string[],
} as const;
