import doctorReenaAvatar from '@/assets/appointments/doctor-reena.png';
import patientRajAvatar from '@/assets/appointments/patient-raj.png';
import defaultAvatar from '@/assets/appointments/avatar.png';
import type { VisitType } from '@/types';

export const calendarEventAvatars = {
  doctor: doctorReenaAvatar,
  patientMale: patientRajAvatar,
  patientFemale: defaultAvatar,
  patientDefault: patientRajAvatar,
} as const;

export function getCalendarDoctorAvatar(): string {
  return calendarEventAvatars.doctor;
}

export function getCalendarPatientAvatar(gender?: string | null): string {
  const normalized = gender?.trim().toLowerCase();
  if (normalized === 'female' || normalized === 'f') {
    return calendarEventAvatars.patientFemale;
  }
  if (normalized === 'male' || normalized === 'm') {
    return calendarEventAvatars.patientMale;
  }
  return calendarEventAvatars.patientDefault;
}

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
