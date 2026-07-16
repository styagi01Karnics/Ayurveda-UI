import {
  createAppointment,
  createAppointmentTherapy,
} from '@/lib/api/appointments';
import type {
  AppointmentDto,
  AppointmentTherapyDto,
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

function toPatientPayload(data: CreatePatientValues): CreatePatientPayload {
  return {
    fullName: data.fullName,
    gender: toApiGender(data.gender),
    dateOfBirth: data.dateOfBirth,
    age: Number(data.age),
    preferredLanguage: data.preferredLanguage,
    mobileNumber: data.mobileNumber,
    email: data.email,
    state: data.state,
    city: data.city,
    address: data.permanentAddress,
    emergencyContactName: data.emergencyName,
    emergencyRelationship: data.emergencyRelation,
    emergencyPhoneNumber: data.emergencyPhone,
    idProofType: toApiIdProofType(data.idProofType),
    idProofNumber: data.idNumber,
    occupation: data.occupation,
    insuranceDetails: data.insuranceDetails || undefined,
  };
}

function extractPatientId(appointment: AppointmentDto): string | undefined {
  if (typeof appointment.patientId === 'string') return appointment.patientId;
  if (appointment.patient?.id) return appointment.patient.id;
  const nested = appointment as Record<string, unknown>;
  if (typeof nested.patient_id === 'string') return nested.patient_id;
  return undefined;
}

/**
 * Books a consultation appointment, and optionally a therapy session
 * when therapy fields are present (mirrors Create Patient modal steps 1–2).
 */
export async function bookAppointmentFlow(
  data: CreatePatientValues,
): Promise<BookAppointmentResult> {
  const appointment = await createAppointment({
    patient: toPatientPayload(data),
    registrationDate: data.registrationDate,
    assignedDoctorId: data.assignedDoctor,
    consultationTypes: toApiConsultationTypes(data.consultationTypes),
  });

  const patientId = extractPatientId(appointment);
  if (!patientId) {
    throw new Error(
      'Appointment created, but patient id was missing from the response.',
    );
  }

  const wantsTherapy = data.consultationTypes.some((type) =>
    type.toUpperCase().includes('THERAPY'),
  );

  let therapy: AppointmentTherapyDto | null = null;
  if (wantsTherapy || data.recommendedTherapies.length > 0) {
    const scheduleTime =
      data.scheduleTime.length === 5
        ? `${data.scheduleTime}:00`
        : data.scheduleTime;

    therapy = await createAppointmentTherapy({
      patientId,
      treatmentCategoryId: data.treatmentCategory,
      assignedTherapistId: data.assignedTherapist,
      scheduleDate: data.scheduleDate,
      scheduleTime,
      sessionDuration: parseSessionNumber(data.sessionDuration),
      sessionFrequency: parseSessionNumber(data.sessionFrequency) || 1,
      therapyInstructions: data.therapyInstructions,
      remarks: data.doshaType ? `Dosha: ${data.doshaType}` : undefined,
      therapyIds: data.recommendedTherapies,
    });
  }

  return { appointment, therapy, patientId };
}
