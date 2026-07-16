/** Shared envelope returned by backend services. */
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface PatientDto {
  id: string;
  patientCode: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  preferredLanguage: string;
  email: string;
  mobileNumber: string;
  state: string;
  city: string;
  address: string;
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyPhoneNumber: string;
  idProofType: string;
  idProofNumber: string;
  occupation: string;
  insuranceDetails?: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientPayload {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  preferredLanguage: string;
  mobileNumber: string;
  email: string;
  state: string;
  city: string;
  address: string;
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyPhoneNumber: string;
  idProofType: string;
  idProofNumber: string;
  occupation: string;
  insuranceDetails?: string;
}

export interface DoctorDto {
  id: string;
  doctorName: string;
  doctorCode: string;
  specialization: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  department: string;
  consultationRoom: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorPayload {
  doctorName: string;
  specialization: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  department: string;
  consultationRoom: string;
}

export interface TherapistDto {
  id: string;
  therapistName: string;
  therapistCode: string;
  specialization: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  therapyRoom: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTherapistPayload {
  therapistName: string;
  specialization: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  therapyRoom: string;
}

export interface TreatmentCategoryDto {
  id: string;
  categoryCode: string | null;
  categoryName: string;
  description: string;
  active: boolean;
}

export interface CreateTreatmentCategoryPayload {
  categoryName: string;
  description: string;
  active: boolean;
}

export interface TherapyDto {
  id: string;
  categoryId: string;
  therapyCode: string;
  therapyName: string;
  description: string;
  active: boolean;
}

export interface CreateTherapyPayload {
  categoryId: string;
  therapyName: string;
  description: string;
  active: boolean;
}

export interface DoshaDto {
  id: string;
  name: string;
  elements: string;
  characteristics: string;
  active: boolean;
}

export interface CreateDoshaPayload {
  name: string;
  elements: string;
  characteristics: string;
  active: boolean;
}

export type ConsultationTypeApi = 'CONSULTATION' | 'THERAPY';

export interface CreateAppointmentPayload {
  patient: CreatePatientPayload;
  registrationDate: string;
  assignedDoctorId: string;
  consultationTypes: ConsultationTypeApi[];
}

export interface AppointmentDto {
  id: string;
  bookingId?: string;
  patientId?: string;
  patient?: PatientDto | null;
  patientName?: string;
  fullName?: string;
  assignedDoctorId?: string;
  doctorId?: string;
  doctorName?: string;
  consultationTypes?: ConsultationTypeApi[] | string[];
  visitType?: string;
  registrationDate?: string;
  appointmentDate?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CreateAppointmentTherapyPayload {
  patientId: string;
  treatmentCategoryId: string;
  assignedTherapistId: string;
  scheduleDate: string;
  scheduleTime: string;
  sessionDuration: number;
  sessionFrequency: number;
  therapyInstructions: string;
  remarks?: string;
  therapyIds: string[];
}

export interface AppointmentTherapyDto {
  id: string;
  patientId?: string;
  patientName?: string;
  treatmentCategoryId?: string;
  treatmentCategoryName?: string;
  categoryName?: string;
  assignedTherapistId?: string;
  therapistName?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  sessionDuration?: number;
  sessionFrequency?: number;
  therapyInstructions?: string;
  remarks?: string;
  therapyIds?: string[];
  therapyNames?: string[];
  therapies?: { id?: string; therapyName?: string }[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
