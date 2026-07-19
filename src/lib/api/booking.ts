import {
  createAppointment,
  createAppointmentTherapy,
} from '@/lib/api/appointments';
import type {
  AppointmentDto,
  AppointmentTherapyDto,
  CreateAppointmentPayload,
  CreatePatientPayload,
} from '@/lib/api/types';
import {
  parseSessionNumber,
  toApiConsultationTypes,
  toApiGender,
  toApiIdProofType,
} from '@/lib/api/mappers';
import type { CreatePatientValues } from '@/lib/validation/patient.schema';

export interface BookAppointmentResult {
  appointment: AppointmentDto;
  therapy: AppointmentTherapyDto | null;
  patientId: string;
}

/** Exact patient object shape from Postman appointment booking curl. */
function toPatientPayload(data: CreatePatientValues): CreatePatientPayload {
  return {
    fullName: data.fullName.trim(),
    gender: toApiGender(data.gender),
    dateOfBirth: data.dateOfBirth,
    age: Number(data.age),
    preferredLanguage: data.preferredLanguage,
    mobileNumber: data.mobileNumber.trim(),
    email: data.email.trim(),
    state: data.state,
    city: data.city,
    address: data.permanentAddress.trim(),
    emergencyContactName: data.emergencyName.trim(),
    emergencyRelationship: data.emergencyRelation,
    emergencyPhoneNumber: data.emergencyPhone.trim(),
    idProofType: toApiIdProofType(data.idProofType),
    idProofNumber: data.idNumber.trim(),
    occupation: data.occupation,
    insuranceDetails: data.insuranceDetails?.trim() || 'None',
  };
}

function wantsTherapy(data: CreatePatientValues): boolean {
  return data.consultationTypes.some((type) =>
    type.toUpperCase().includes('THERAPY'),
  );
}

function extractPatientId(appointment: AppointmentDto): string | undefined {
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

/**
 * Matches Postman:
 * POST http://103.174.103.250:8103/api/v1/appointments
 * then optionally POST .../appointment-therapies
 */
export async function bookAppointmentFlow(
  data: CreatePatientValues,
): Promise<BookAppointmentResult> {
  const payload: CreateAppointmentPayload = {
    patient: toPatientPayload(data),
    registrationDate: data.registrationDate,
    assignedDoctorId: data.assignedDoctor,
    consultationTypes: toApiConsultationTypes(data.consultationTypes),
  };

  const appointment = await createAppointment(payload);

  const patientId = extractPatientId(appointment);
  if (!patientId) {
    throw new Error(
      'Appointment created, but patient id was missing from the response.',
    );
  }

  let therapy: AppointmentTherapyDto | null = null;
  if (wantsTherapy(data)) {
    if (
      !data.treatmentCategory ||
      !data.assignedTherapist ||
      !data.recommendedTherapies?.length
    ) {
      throw new Error(
        'Therapy booking requires category, therapist, and at least one therapy.',
      );
    }

    therapy = await createAppointmentTherapy({
      patientId,
      treatmentCategoryId: data.treatmentCategory,
      assignedTherapistId: data.assignedTherapist,
      scheduleDate: data.scheduleDate,
      scheduleTime: normalizeScheduleTime(data.scheduleTime),
      sessionDuration: parseSessionNumber(data.sessionDuration),
      sessionFrequency: parseSessionNumber(data.sessionFrequency) || 1,
      therapyInstructions: data.therapyInstructions,
      remarks: data.doshaType ? `Dosha: ${data.doshaType}` : undefined,
      therapyIds: data.recommendedTherapies,
    });
  }

  return { appointment, therapy, patientId };
}
