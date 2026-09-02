import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments.prescriptions;

export interface CreatePrescriptionMedicinePayload {
  medicineId: string;
  medicineName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface CreatePrescriptionTherapySuggestionPayload {
  therapyCategoryId: string;
  recommendedTherapyIds: string[];
}

export interface CreatePrescriptionNextFollowUpPayload {
  setUpRequired: boolean;
  schedulingOption?: string;
  suggestions?: string;
}

export interface CreatePrescriptionPayload {
  patientId: string;
  appointmentBookingId: string;
  assignedDoctorId: string;
  medicines?: CreatePrescriptionMedicinePayload[];
  therapySuggestions?: CreatePrescriptionTherapySuggestionPayload[];
  /** Doc: array of follow-up setup objects. */
  nextFollowUp?: CreatePrescriptionNextFollowUpPayload[];
  diagnosis?: string;
  notes?: string;
}

export interface PrescriptionMedicineDto {
  id?: string;
  medicineId?: string;
  medicineName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  instruction?: string;
}

export interface PrescriptionTherapySuggestionDto {
  id?: string;
  therapyCategoryId?: string;
  therapyCategoryName?: string;
  recommendedTherapyIds?: string[];
  recommendedTherapies?: {
    id?: string;
    name?: string;
    therapyId?: string;
    therapyName?: string;
  }[];
}

export interface PrescriptionNextFollowUpDto {
  setUpRequired?: boolean;
  schedulingOption?: string;
  suggestions?: string;
}

export interface PrescriptionPatientDto {
  id?: string;
  displayId?: string;
  patientDisplayId?: string;
  name?: string;
  fullName?: string;
  age?: string | number;
  gender?: string;
  weight?: string;
  height?: string;
  dietType?: string;
}

export interface PrescriptionTreatmentDto {
  consultationTypes?: { id: string; name: string }[] | string[];
  consultationDateTime?: string;
  nextAppointmentDateTime?: string;
  visitNumber?: number | null;
  totalVisits?: number | null;
  visitDisplay?: string;
}

export interface PrescriptionConsultantDto {
  id?: string;
  name?: string;
  specialization?: string;
  qualification?: string;
  contactNumber?: string;
  mobileNumber?: string;
}

export interface PrescriptionDto {
  id: string;
  patientId: string;
  appointmentBookingId?: string;
  assignedDoctorId?: string;
  diagnosis?: string;
  notes?: string;
  medicines?: PrescriptionMedicineDto[];
  therapySuggestions?: PrescriptionTherapySuggestionDto[];
  /** Doc returns an array; tolerate a single object from older payloads. */
  nextFollowUp?:
    | PrescriptionNextFollowUpDto
    | PrescriptionNextFollowUpDto[];
  patient?: PrescriptionPatientDto;
  treatment?: PrescriptionTreatmentDto;
  consultant?: PrescriptionConsultantDto;
  createdAt?: string;
  updatedAt?: string;
}

export function createPrescription(payload: CreatePrescriptionPayload) {
  return apiRequest<PrescriptionDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}

export function updatePrescription(
  prescriptionId: string,
  payload: CreatePrescriptionPayload,
) {
  return apiRequest<PrescriptionDto>(url(ep.update(prescriptionId)), {
    method: 'PUT',
    body: payload,
  });
}

export function getPrescriptionById(prescriptionId: string) {
  return apiRequest<PrescriptionDto>(url(ep.getById(prescriptionId)));
}

export function getPrescriptionsByPatient(patientId: string) {
  return apiRequestList<PrescriptionDto>(url(ep.getByPatientId(patientId)));
}
