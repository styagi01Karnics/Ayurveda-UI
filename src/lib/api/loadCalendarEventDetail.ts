import {
  getAppointmentsByPatientId,
  getMedicalAssessmentByPatientId,
} from '@/lib/api/appointments';
import { getDoctorById } from '@/lib/api/doctors';
import {
  mapAppointmentRecordToCalendarDetail,
} from '@/lib/api/mappers';
import {
  getCalendarDoctorAvatar,
  getCalendarPatientAvatar,
  resolveCalendarEventTitle,
} from '@/lib/calendarEventAvatars';
import { getPatientById } from '@/lib/api/patients';
import { parseAppointmentDateTime } from '@/lib/calendarUtils';
import type { AppointmentDto } from '@/lib/api/types';
import type { AppointmentRecord, CalendarEventDetail } from '@/types';

function formatVisitDate(value?: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value.includes('T') ? value : `${value.slice(0, 10)}T09:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function appointmentInstant(dto: AppointmentDto): number {
  const date =
    dto.registrationDate ??
    dto.appointmentDate ??
    dto.scheduleDate ??
    dto.createdAt ??
    '';
  const time = dto.slotTime ?? dto.scheduleTime ?? '';
  const parsed = parseAppointmentDateTime({
    id: String(dto.id ?? ''),
    uhid: '',
    patient: '',
    doctor: '',
    visitType: 'Consultation',
    appointmentDate: '',
    dateCreated: date.slice(0, 10),
    status: 'Scheduled',
    registrationDate: date.slice(0, 10),
    slotTime: time,
  });
  return parsed?.getTime() ?? 0;
}

function resolveVisitHistory(
  appointments: AppointmentDto[],
  current: AppointmentRecord,
): { lastVisit: string; nextVisit: string } {
  const currentTime =
    parseAppointmentDateTime(current)?.getTime() ?? Date.now();

  const sorted = [...appointments].sort(
    (a, b) => appointmentInstant(a) - appointmentInstant(b),
  );

  let lastVisit = '—';
  let nextVisit = '—';

  for (const item of sorted) {
    const instant = appointmentInstant(item);
    if (instant <= 0) continue;
    const dateLabel = formatVisitDate(
      item.registrationDate ?? item.appointmentDate ?? item.scheduleDate,
    );

    if (instant < currentTime) {
      lastVisit = dateLabel;
    } else if (instant > currentTime && nextVisit === '—') {
      nextVisit = dateLabel;
    }
  }

  return { lastVisit, nextVisit };
}

export async function loadCalendarEventDetail(
  record: AppointmentRecord,
): Promise<CalendarEventDetail> {
  const fallback = mapAppointmentRecordToCalendarDetail(record);

  if (!record.patientId) {
    return fallback;
  }

  try {
    const [patient, appointments, medicalAssessment, doctor] = await Promise.all([
      getPatientById(record.patientId).catch(() => null),
      getAppointmentsByPatientId(record.patientId).catch(() => []),
      getMedicalAssessmentByPatientId(record.patientId).catch(() => null),
      record.assignedDoctorId
        ? getDoctorById(record.assignedDoctorId).catch(() => null)
        : Promise.resolve(null),
    ]);

    const { lastVisit, nextVisit } = resolveVisitHistory(appointments, record);
    const doshaName = medicalAssessment?.ayurvedicAssessment?.dosha?.name;
    const condition =
      medicalAssessment?.ayurvedicAssessment?.currentImbalances?.trim() ||
      medicalAssessment?.medicalHistory?.pastMedicalConditions?.trim() ||
      '—';

    const doctorName =
      doctor?.name ||
      doctor?.doctorName ||
      record.doctor ||
      fallback.doctorName;

    const doctorRole =
      doctor?.specialization?.trim() ||
      doctor?.qualification?.trim() ||
      fallback.doctorRole;

    const gender = patient?.gender
      ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1).toLowerCase()
      : '—';

    return {
      id: record.id,
      title: resolveCalendarEventTitle(record.visitType),
      appointmentDate: record.appointmentDate,
      doctorName: /^dr\.?\s/i.test(doctorName) ? doctorName : `Dr. ${doctorName}`,
      doctorRole,
      doctorAvatar: getCalendarDoctorAvatar(),
      patientName: patient?.fullName ?? record.patient,
      patientAge: patient?.age != null ? `${patient.age}yrs` : '—',
      patientGender: gender,
      patientAvatar: getCalendarPatientAvatar(patient?.gender),
      visitType: record.visitType,
      dosha: doshaName?.trim() || '—',
      condition,
      lastVisit,
      nextVisit,
    };
  } catch {
    return fallback;
  }
}
