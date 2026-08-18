import { apiConfig } from './config';
import { ApiError, apiRequest, apiRequestFormData, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  AppointmentDto,
  AppointmentStatsDto,
  AppointmentTherapyDto,
  CreateAppointmentPayload,
  CreateAppointmentTherapyPayload,
  CreateDoshaPayload,
  CreateMedicalAssessmentPayload,
  CreateTreatmentCategoryPayload,
  CreateTherapyPayload,
  DoshaDto,
  MedicalAssessmentDocuments,
  MedicalAssessmentDto,
  PatientAppointmentListItemDto,
  RescheduleAppointmentPayload,
  TreatmentCategoryDto,
  TherapyDto,
  TodayAppointmentsResponseDto,
} from './types';

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments;

// ── Treatment categories ─────────────────────────────────────────────────────

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

// ── Therapies ────────────────────────────────────────────────────────────────

export function getAllTherapies(status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE') {
  return apiRequestList<TherapyDto>(
    `${url(ep.therapies.getAll)}?status=${status}`,
  );
}

export function createTherapy(payload: CreateTherapyPayload) {
  return apiRequest<TherapyDto>(url(ep.therapies.create), {
    method: 'POST',
    body: payload,
  });
}

export function getTherapyById(therapyId: string) {
  return apiRequest<TherapyDto>(url(ep.therapies.getById(therapyId)));
}

export function getTherapiesByCategory(
  categoryId: string,
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE',
) {
  return apiRequestList<TherapyDto>(
    `${url(ep.therapies.getByCategoryId(categoryId))}?status=${status}`,
  );
}

export function deleteTherapy(therapyId: string) {
  return apiRequest<void>(url(ep.therapies.getById(therapyId)), {
    method: 'DELETE',
  });
}

export function updateTherapyStatus(therapyId: string, status: string) {
  return apiRequest<TherapyDto>(url(ep.therapies.updateStatus(therapyId)), {
    method: 'PATCH',
    body: { status },
  });
}

export function updateTherapy(
  therapyId: string,
  payload: Partial<CreateTherapyPayload>,
) {
  return apiRequest<TherapyDto>(url(ep.therapies.getById(therapyId)), {
    method: 'PUT',
    body: payload,
  });
}

// ── Appointments ─────────────────────────────────────────────────────────────

/**
 * Appointment booking list tabs.
 * ACTIVE = non-closed bookings, or closed bookings that already have a follow-up.
 * INACTIVE = cancelled/completed bookings with no follow-up linked via sourceBookingId.
 */
export type PatientListTab = 'ACTIVE' | 'INACTIVE';

export interface AppointmentPatientsQuery {
  statusTab: PatientListTab;
  search?: string;
  bookingStatus?: string;
  consultationTypeId?: string;
  doshaId?: string;
  doctorId?: string;
}

function buildAppointmentPatientsUrl(query: AppointmentPatientsQuery): string {
  const params = new URLSearchParams({ statusTab: query.statusTab });
  if (query.search) params.set('search', query.search);
  if (query.bookingStatus) params.set('bookingStatus', query.bookingStatus);
  if (query.consultationTypeId) {
    params.set('consultationTypeId', query.consultationTypeId);
  }
  if (query.doshaId) params.set('doshaId', query.doshaId);
  if (query.doctorId) params.set('doctorId', query.doctorId);
  return `${url(ep.bookings.getAllPatients)}?${params.toString()}`;
}

export function getAppointmentPatients(query: AppointmentPatientsQuery) {
  return apiRequestList<PatientAppointmentListItemDto>(
    buildAppointmentPatientsUrl(query),
  );
}

/** Fetches both ACTIVE and INACTIVE appointment lists. */
export async function getAllAppointmentPatients(
  filters: Omit<AppointmentPatientsQuery, 'statusTab'> = {},
) {
  const [active, inactive] = await Promise.all([
    getAppointmentPatients({ ...filters, statusTab: 'ACTIVE' }),
    getAppointmentPatients({ ...filters, statusTab: 'INACTIVE' }),
  ]);
  return [...active, ...inactive];
}

export function getAppointmentsByPatientId(patientId: string) {
  return apiRequestList<AppointmentDto>(
    url(ep.bookings.getByPatientId(patientId)),
  );
}

export function getAppointmentById(bookingId: string) {
  return apiRequest<AppointmentDto>(url(ep.bookings.getByBookingId(bookingId)));
}

export function getAppointmentsByStatus(bookingStatus = 'ALL') {
  return apiRequestList<AppointmentDto>(
    url(ep.bookings.getByStatus(bookingStatus)),
  );
}

export function getAppointmentsToday(consultationTypeId: string) {
  return apiRequestList<AppointmentDto>(
    url(ep.bookings.getTodayByConsultationTypeId(consultationTypeId)),
  );
}

export function getTodayAppointments() {
  return apiRequest<TodayAppointmentsResponseDto>(url(ep.bookings.getTodayAll));
}

export function getAppointmentsByDate(registrationDate: string) {
  return apiRequestList<AppointmentDto>(
    url(ep.bookings.getByDate(registrationDate)),
  );
}

export function getAppointmentStats() {
  return apiRequest<AppointmentStatsDto>(url(ep.bookings.getStats));
}

export function getCancelledAppointments() {
  return apiRequestList<AppointmentDto>(url(ep.bookings.getCancelled));
}

export function getDoctorTodayAppointments(doctorId: string) {
  return apiRequestList<AppointmentDto>(
    url(ep.bookings.getDoctorToday(doctorId)),
  );
}

export function createAppointment(payload: CreateAppointmentPayload) {
  return apiRequest<AppointmentDto>(url(ep.bookings.create), {
    method: 'POST',
    body: payload,
  });
}

export function cancelAppointment(bookingId: string) {
  return apiRequest<AppointmentDto>(url(ep.bookings.cancel(bookingId)), {
    method: 'PUT',
  });
}

export function rescheduleAppointment(
  bookingId: string,
  payload: RescheduleAppointmentPayload,
) {
  return apiRequest<AppointmentDto>(url(ep.bookings.reschedule(bookingId)), {
    method: 'PUT',
    body: payload,
  });
}

export function markAppointmentInConsultation(bookingId: string) {
  return apiRequest<AppointmentDto>(
    url(ep.bookings.inConsultation(bookingId)),
    { method: 'PUT' },
  );
}

export function completeAppointment(bookingId: string) {
  return apiRequest<AppointmentDto>(url(ep.bookings.complete(bookingId)), {
    method: 'PUT',
  });
}

export function deleteAppointment(bookingId: string) {
  return apiRequest<void>(url(ep.bookings.getByBookingId(bookingId)), {
    method: 'DELETE',
  });
}

// ── Appointment therapies ────────────────────────────────────────────────────

export function getAppointmentTherapiesByPatientId(patientId: string) {
  return apiRequestList<AppointmentTherapyDto>(
    url(ep.appointmentTherapies.getByPatientId(patientId)),
  );
}

export function getTherapistTodayAppointmentTherapies(therapistId: string) {
  return apiRequestList<AppointmentTherapyDto>(
    url(ep.appointmentTherapies.getTherapistToday(therapistId)),
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

// ── Doshas ───────────────────────────────────────────────────────────────────

export function getAllDoshas() {
  return apiRequestList<DoshaDto>(url(ep.doshas.getAll));
}

function isActiveDosha(dosha: DoshaDto): boolean {
  if (!dosha.status && dosha.active === undefined) return true;
  if (dosha.status) return dosha.status.toUpperCase() === 'ACTIVE';
  return dosha.active !== false;
}

let bookingDoshasCache: DoshaDto[] | null = null;
let bookingDoshasPromise: Promise<DoshaDto[]> | null = null;

/**
 * Loads doshas for booking dropdowns. Cached; never auto-POSTs to avoid 409 conflicts.
 */
export async function getBookingDoshas(): Promise<DoshaDto[]> {
  if (bookingDoshasCache?.length) return bookingDoshasCache;
  if (bookingDoshasPromise) return bookingDoshasPromise;

  bookingDoshasPromise = getAllDoshas()
    .then((list) => {
      const active = list.filter(isActiveDosha);
      bookingDoshasCache = active;
      return active;
    })
    .finally(() => {
      bookingDoshasPromise = null;
    });

  return bookingDoshasPromise;
}

/** @deprecated Use getBookingDoshas() */
export async function ensureBookingDoshas(): Promise<DoshaDto[]> {
  return getBookingDoshas();
}

export function invalidateBookingDoshasCache() {
  bookingDoshasCache = null;
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

// ── Schedule ─────────────────────────────────────────────────────────────────

export function getTodaysSchedule() {
  return apiRequest<unknown>(url(ep.schedule.todaysSchedule));
}

/** Generic POST helper for patient-scoped assessment resources. */
function postAssessment<T>(path: string, payload: Record<string, unknown>) {
  return apiRequest<T>(url(path), { method: 'POST', body: payload });
}

function getAssessmentListByPatient<T>(
  pathFn: (patientId: string) => string,
  patientId: string,
) {
  return apiRequestList<T>(url(pathFn(patientId)));
}

export function createAyurvedicAssessment(payload: Record<string, unknown>) {
  return postAssessment<unknown>(ep.ayurvedicAssessments.create, payload);
}

export function getAyurvedicAssessmentsByPatientId(patientId: string) {
  return getAssessmentListByPatient<unknown>(
    ep.ayurvedicAssessments.getByPatientId,
    patientId,
  );
}

export function createMedicalAssessment(payload: CreateMedicalAssessmentPayload) {
  return apiRequest<MedicalAssessmentDto>(url(ep.medicalAssessment.create), {
    method: 'POST',
    body: payload,
  });
}

export function createMedicalAssessmentWithDocuments(
  payload: CreateMedicalAssessmentPayload,
  documents: MedicalAssessmentDocuments,
) {
  const formData = new FormData();
  formData.append(
    'data',
    new File([JSON.stringify(payload)], 'data.json', {
      type: 'application/json',
    }),
  );

  for (const file of documents.pastMedicalReports ?? []) {
    formData.append('pastMedicalReports', file);
  }
  for (const file of documents.prescriptions ?? []) {
    formData.append('prescriptions', file);
  }
  for (const file of documents.labReports ?? []) {
    formData.append('labReports', file);
  }

  return apiRequestFormData<MedicalAssessmentDto>(
    url(ep.medicalAssessment.createWithDocuments),
    formData,
  );
}

export function getMedicalAssessmentByPatientId(patientId: string) {
  return apiRequest<MedicalAssessmentDto>(
    url(ep.medicalAssessment.getByPatientId(patientId)),
  ).catch((error) => {
    if (error instanceof ApiError && (error.status === 404 || error.status === 204)) {
      return null;
    }
    throw error;
  });
}

export function createMedicalHistory(payload: Record<string, unknown>) {
  return postAssessment<unknown>(ep.medicalHistories.create, payload);
}

export function getMedicalHistoriesByPatientId(patientId: string) {
  return getAssessmentListByPatient<unknown>(
    ep.medicalHistories.getByPatientId,
    patientId,
  );
}

export function createPhysicalExamination(payload: Record<string, unknown>) {
  return postAssessment<unknown>(ep.physicalExaminations.create, payload);
}

export function getPhysicalExaminationsByPatientId(patientId: string) {
  return getAssessmentListByPatient<unknown>(
    ep.physicalExaminations.getByPatientId,
    patientId,
  );
}

export function createSystemicExamination(payload: Record<string, unknown>) {
  return postAssessment<unknown>(ep.systemicExaminations.create, payload);
}

export function getSystemicExaminationsByPatientId(patientId: string) {
  return getAssessmentListByPatient<unknown>(
    ep.systemicExaminations.getByPatientId,
    patientId,
  );
}

export function createLifestyleInformation(payload: Record<string, unknown>) {
  return postAssessment<unknown>(ep.lifestyleInformation.create, payload);
}

export function getLifestyleInformationByPatientId(patientId: string) {
  return getAssessmentListByPatient<unknown>(
    ep.lifestyleInformation.getByPatientId,
    patientId,
  );
}

export function createTreatmentPlan(payload: Record<string, unknown>) {
  return postAssessment<unknown>(
    apiEndpoints.appointments.treatmentPlans.create,
    payload,
  );
}

export function getTreatmentPlansByPatientId(patientId: string) {
  return apiRequestList<unknown>(
    url(apiEndpoints.appointments.treatmentPlans.getByPatientId(patientId)),
  );
}

/** @deprecated Prefer getAppointmentPatients() */
export async function getAllAppointmentsForPatients(
  patientIds: string[],
): Promise<AppointmentDto[]> {
  try {
    const list = await getAllAppointmentPatients();
    if (list.length > 0) {
      return list.map((item) => ({
        id: item.bookingId,
        bookingId: item.bookingId,
        patientId: item.patientId,
        patientName: item.patientFullName,
        doctorName: item.doctorName,
        assignedDoctorId: item.assignedDoctorId,
        consultationTypes: item.consultationTypes,
        appointmentDate: item.appointmentDate,
        scheduleTime: item.slotTime,
        slotTime: item.slotTime,
        registrationDate: item.appointmentDate,
        bookingStatus: item.bookingStatus,
        status: item.bookingStatus,
        createdAt: item.bookingTime,
      }));
    }
  } catch {
    // fall through to per-patient fetch
  }

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
