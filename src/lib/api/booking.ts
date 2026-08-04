import {
  createAppointment,
  createAppointmentTherapy,
  createMedicalAssessment,
  createMedicalAssessmentWithDocuments,
} from '@/lib/api/appointments';
import { ApiError } from '@/lib/api/client';
import type {
  AppointmentDto,
  AppointmentTherapyDto,
  CreateAppointmentPayload,
  CreateAppointmentTherapyPayload,
  CreateMedicalAssessmentPayload,
  CreatePatientPayload,
  MedicalAssessmentDto,
} from '@/lib/api/types';
import {
  hasMedicalAssessmentDocuments,
  parseSessionNumber,
  toApiConsultationTypes,
  toApiGender,
  toApiIdProofType,
  toMedicalAssessmentPayload,
} from '@/lib/api/mappers';
import type { CreatePatientValues } from '@/lib/validation/patient.schema';

export interface BookingSession {
  patientId: string;
  appointment: AppointmentDto;
  therapy: AppointmentTherapyDto | null;
}

export interface BookAppointmentResult extends BookingSession {
  medicalAssessment: MedicalAssessmentDto;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function runBookingStep<T>(
  stepLabel: string,
  action: () => Promise<T>,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    const detail =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    throw new Error(`${stepLabel}: ${detail}`);
  }
}

export function toPatientPayload(data: CreatePatientValues): CreatePatientPayload {
  return {
    fullName: data.fullName.trim(),
    gender: toApiGender(data.gender),
    dateOfBirth: data.dateOfBirth,
    age: Number(data.age),
    preferredLanguage:
      data.preferredLanguage.replace(/[^a-zA-Z\s]/g, '').trim() || 'English',
    mobileNumber: data.mobileNumber.trim(),
    email: data.email.trim(),
    state: data.state.replace(/[^a-zA-Z\s]/g, '').trim(),
    city: data.city.replace(/[^a-zA-Z\s]/g, '').trim(),
    address: data.permanentAddress.trim(),
    emergencyContactName: data.emergencyName.replace(/[^a-zA-Z\s]/g, '').trim(),
    emergencyRelationship: data.emergencyRelation
      .replace(/[^a-zA-Z\s]/g, '')
      .trim(),
    emergencyPhoneNumber: data.emergencyPhone.trim(),
    idProofType: toApiIdProofType(data.idProofType),
    idProofNumber: data.idNumber.trim(),
    occupation: data.occupation
      ? data.occupation.replace(/[^a-zA-Z\s]/g, '').trim() || 'Unknown'
      : 'Unknown',
    insuranceDetails: data.insuranceDetails?.trim() || 'None',
  };
}

export function wantsTherapy(data: CreatePatientValues): boolean {
  return data.consultationTypes.some((type) =>
    type.toUpperCase().includes('THERAPY'),
  );
}

export function extractPatientId(appointment: AppointmentDto): string | undefined {
  if (typeof appointment.patientId === 'string') return appointment.patientId;
  if (appointment.patient?.id) return appointment.patient.id;
  const nested = appointment as Record<string, unknown>;
  if (typeof nested.patient_id === 'string') return nested.patient_id;
  return undefined;
}

function normalizeScheduleTime(time: string): string {
  if (!time) return time;
  return time.length === 5 ? `${time}:00` : time;
}

export function resolveSlotTime(data: CreatePatientValues): string {
  return (
    normalizeScheduleTime(data.appointmentTime || data.scheduleTime) ||
    '10:00:00'
  );
}

export function buildAppointmentPayload(
  data: CreatePatientValues,
): CreateAppointmentPayload {
  return {
    patient: toPatientPayload(data),
    registrationDate: data.registrationDate,
    assignedDoctorId: data.assignedDoctor,
    consultationTypes: toApiConsultationTypes(data.consultationTypes),
    slotTime: resolveSlotTime(data),
  };
}

export function buildTherapyPayload(
  data: CreatePatientValues,
  patientId: string,
): CreateAppointmentTherapyPayload {
  return {
    patientId,
    treatmentCategoryId: data.treatmentCategory!,
    assignedTherapistId: data.assignedTherapist!,
    scheduleDate: data.scheduleDate,
    scheduleTime: normalizeScheduleTime(data.scheduleTime),
    sessionDuration: Math.max(parseSessionNumber(data.sessionDuration), 1),
    sessionFrequency: Math.max(parseSessionNumber(data.sessionFrequency), 1),
    therapyInstructions:
      data.therapyInstructions?.trim() || 'As advised by doctor',
    therapyIds: data.recommendedTherapies ?? [],
  };
}

function assertDoshaId(doshaId: string | undefined): void {
  if (!doshaId || !UUID_RE.test(doshaId)) {
    throw new Error(
      'Select a valid dosha type before confirming (dosha list may still be loading).',
    );
  }
}

/** Step 1 — POST /api/v1/appointments */
export async function submitBookingStep1(
  data: CreatePatientValues,
): Promise<BookingSession> {
  const appointment = await runBookingStep(
    'POST /api/v1/appointments failed',
    () => createAppointment(buildAppointmentPayload(data)),
  );

  const patientId = extractPatientId(appointment);
  if (!patientId) {
    throw new Error(
      'POST /api/v1/appointments succeeded but patient id was missing from the response.',
    );
  }

  return { patientId, appointment, therapy: null };
}

/** Step 2 — POST /api/v1/appointment-therapies */
export async function submitBookingStep2(
  data: CreatePatientValues,
  session: BookingSession,
): Promise<AppointmentTherapyDto> {
  if (
    !data.treatmentCategory ||
    !data.assignedTherapist ||
    !data.recommendedTherapies?.length
  ) {
    throw new Error(
      'Therapy booking requires category, therapist, and at least one therapy.',
    );
  }

  const therapy = await runBookingStep(
    'POST /api/v1/appointment-therapies failed',
    () => createAppointmentTherapy(buildTherapyPayload(data, session.patientId)),
  );

  return therapy;
}

/** Step 3 — POST /api/v1/medical-assessment (or with-documents) */
export async function submitBookingStep3(
  data: CreatePatientValues,
  session: BookingSession,
): Promise<MedicalAssessmentDto> {
  assertDoshaId(data.doshaType);

  const assessmentPayload: CreateMedicalAssessmentPayload =
    toMedicalAssessmentPayload(data, session.patientId);
  const documents = data.uploadedDocuments;
  const withDocuments = hasMedicalAssessmentDocuments(documents);

  return runBookingStep(
    withDocuments
      ? 'POST /api/v1/medical-assessment/with-documents failed'
      : 'POST /api/v1/medical-assessment failed',
    () =>
      withDocuments
        ? createMedicalAssessmentWithDocuments(assessmentPayload, {
            pastMedicalReports: documents!.pastMedicalReports,
            prescriptions: documents!.prescriptions,
            labReports: documents!.labReports,
          })
        : createMedicalAssessment(assessmentPayload),
  );
}

/** Runs all steps sequentially (used when not stepping through the modal). */
export async function bookAppointmentFlow(
  data: CreatePatientValues,
): Promise<BookAppointmentResult> {
  const session = await submitBookingStep1(data);

  if (wantsTherapy(data)) {
    session.therapy = await submitBookingStep2(data, session);
  }

  const medicalAssessment = await submitBookingStep3(data, session);

  return { ...session, medicalAssessment };
}
