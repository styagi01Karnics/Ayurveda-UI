import type { DoctorScheduleItem, DoctorStats } from '@/types';

export const doctorStats: DoctorStats = {
  totalPatients: 30,
  completedPatients: 20,
  ongoingPatients: 10,
  activeTreatmentPlans: 30,
  completedTreatmentPlans: 20,
  ongoingTreatmentPlans: 10,
  completedTreatments: 9,
  consultationCount: 5,
  therapyCount: 4,
  followUpsDue: 9,
  followUpsScheduled: 5,
  followUpsPending: 4,
};

export const initialDoctorSchedule: DoctorScheduleItem[] = [
  {
    id: 'ds-1',
    time: '09:30 AM',
    patient: 'Khushi Shroff',
    patientDetailId: '37944397',
    visitType: 'Consultation',
    status: 'Scheduled',
  },
  {
    id: 'ds-2',
    time: '10:00 AM',
    patient: 'Khushi Shroff',
    patientDetailId: '37944397',
    visitType: 'Therapy',
    status: 'Scheduled',
  },
  {
    id: 'ds-3',
    time: '10:30 AM',
    patient: 'Khushi Shroff',
    patientDetailId: '37944397',
    visitType: 'Consultation',
    status: 'Completed',
  },
  {
    id: 'ds-4',
    time: '11:00 AM',
    patient: 'Khushi Shroff',
    patientDetailId: '37944397',
    visitType: 'Therapy',
    status: 'Completed',
  },
  {
    id: 'ds-5',
    time: '11:30 AM',
    patient: 'Khushi Shroff',
    patientDetailId: '37944397',
    visitType: 'Consultation',
    status: 'Scheduled',
  },
  {
    id: 'ds-6',
    time: '12:00 PM',
    patient: 'Khushi Shroff',
    patientDetailId: '37944397',
    visitType: 'Therapy',
    status: 'Completed',
  },
];

export const DOCTOR_FILTER_OPTIONS = {
  status: ['Scheduled', 'Completed', 'In Consultation'],
  visitType: ['Consultation', 'Therapy'],
} as const;
