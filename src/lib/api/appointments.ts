import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import type {
  AppointmentDto,
  AppointmentTherapyDto,
  CreateAppointmentPayload,
  CreateAppointmentTherapyPayload,
  CreateDoshaPayload,
  CreateTreatmentCategoryPayload,
  CreateTherapyPayload,
  DoshaDto,
  TreatmentCategoryDto,
  TherapyDto,
} from './types';

const base = () => `${apiConfig.appointment}/api/v1`;

export function getAllTreatmentCategories() {
  return apiRequestList<TreatmentCategoryDto>(
    `${base()}/treatment-categories`,
  );
}

export function getTreatmentCategoryById(categoryId: string) {
  return apiRequest<TreatmentCategoryDto>(
    `${base()}/treatment-categories/${categoryId}`,
  );
}

export function createTreatmentCategory(
  payload: CreateTreatmentCategoryPayload,
) {
  return apiRequest<TreatmentCategoryDto>(`${base()}/treatment-categories`, {
    method: 'POST',
    body: payload,
  });
}

export function getAllTherapies() {
  return apiRequestList<TherapyDto>(`${base()}/therapies`);
}

export function createTherapy(payload: CreateTherapyPayload) {
  return apiRequest<TherapyDto>(`${base()}/therapies`, {
    method: 'POST',
    body: payload,
  });
}

export function getAppointmentsByPatientId(patientId: string) {
  return apiRequestList<AppointmentDto>(
    `${base()}/appointments/patient/${patientId}`,
  );
}

export function getAppointmentById(bookingId: string) {
  return apiRequest<AppointmentDto>(`${base()}/appointments/${bookingId}`);
}

export function createAppointment(payload: CreateAppointmentPayload) {
  return apiRequest<AppointmentDto>(`${base()}/appointments`, {
    method: 'POST',
    body: payload,
  });
}

export function getAppointmentTherapiesByPatientId(patientId: string) {
  return apiRequestList<AppointmentTherapyDto>(
    `${base()}/appointment-therapies/${patientId}`,
  );
}

export function createAppointmentTherapy(
  payload: CreateAppointmentTherapyPayload,
) {
  return apiRequest<AppointmentTherapyDto>(`${base()}/appointment-therapies`, {
    method: 'POST',
    body: payload,
  });
}

export function getAllDoshas() {
  return apiRequestList<DoshaDto>(`${base()}/doshas`);
}

export function getDoshaById(doshaId: string) {
  return apiRequest<DoshaDto>(`${base()}/doshas/${doshaId}`);
}

export function createDosha(payload: CreateDoshaPayload) {
  return apiRequest<DoshaDto>(`${base()}/doshas`, {
    method: 'POST',
    body: payload,
  });
}

/** Aggregate appointments across patients (no dedicated list-all endpoint). */
export async function getAllAppointmentsForPatients(
  patientIds: string[],
): Promise<AppointmentDto[]> {
  const results = await Promise.all(
    patientIds.map(async (patientId) => {
      try {
        return await getAppointmentsByPatientId(patientId);
      } catch {
        return [] as AppointmentDto[];
      }
    }),
  );
  return results.flat();
}

/** Aggregate therapy appointments across patients. */
export async function getAllAppointmentTherapiesForPatients(
  patientIds: string[],
): Promise<AppointmentTherapyDto[]> {
  const results = await Promise.all(
    patientIds.map(async (patientId) => {
      try {
        return await getAppointmentTherapiesByPatientId(patientId);
      } catch {
        return [] as AppointmentTherapyDto[];
      }
    }),
  );
  return results.flat();
}
