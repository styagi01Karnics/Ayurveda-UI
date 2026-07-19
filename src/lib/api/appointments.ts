import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
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

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments;

export function getAllTreatmentCategories() {
  return apiRequestList<TreatmentCategoryDto>(
    url(ep.treatmentCategories.getAll),
  );
}

export function getTreatmentCategoryById(categoryId: string) {
  return apiRequest<TreatmentCategoryDto>(
    url(ep.treatmentCategories.getById(categoryId)),
  );
}

export function createTreatmentCategory(
  payload: CreateTreatmentCategoryPayload,
) {
  return apiRequest<TreatmentCategoryDto>(url(ep.treatmentCategories.create), {
    method: 'POST',
    body: payload,
  });
}

export function getAllTherapies() {
  return apiRequestList<TherapyDto>(url(ep.therapies.getAll));
}

export function createTherapy(payload: CreateTherapyPayload) {
  return apiRequest<TherapyDto>(url(ep.therapies.create), {
    method: 'POST',
    body: payload,
  });
}

export function getAppointmentsByPatientId(patientId: string) {
  return apiRequestList<AppointmentDto>(
    url(ep.bookings.getByPatientId(patientId)),
  );
}

export function getAppointmentById(bookingId: string) {
  return apiRequest<AppointmentDto>(
    url(ep.bookings.getByBookingId(bookingId)),
  );
}

export function createAppointment(payload: CreateAppointmentPayload) {
  return apiRequest<AppointmentDto>(url(ep.bookings.create), {
    method: 'POST',
    body: payload,
  });
}

export function getAppointmentTherapiesByPatientId(patientId: string) {
  return apiRequestList<AppointmentTherapyDto>(
    url(ep.appointmentTherapies.getByPatientId(patientId)),
  );
}

export function createAppointmentTherapy(
  payload: CreateAppointmentTherapyPayload,
) {
  return apiRequest<AppointmentTherapyDto>(
    url(ep.appointmentTherapies.create),
    {
      method: 'POST',
      body: payload,
    },
  );
}

export function getAllDoshas() {
  return apiRequestList<DoshaDto>(url(ep.doshas.getAll));
}

export function getDoshaById(doshaId: string) {
  return apiRequest<DoshaDto>(url(ep.doshas.getById(doshaId)));
}

export function createDosha(payload: CreateDoshaPayload) {
  return apiRequest<DoshaDto>(url(ep.doshas.create), {
    method: 'POST',
    body: payload,
  });
}

/** Aggregate appointments across patients (API has no list-all endpoint). */
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
