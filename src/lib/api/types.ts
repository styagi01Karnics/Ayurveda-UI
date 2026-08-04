/** Shared envelope returned by backend services. */
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface PatientDto {
  id: string;
  patientDisplayId?: string;
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
  status?: string;
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
  name?: string;
  doctorName?: string;
  doctorCode?: string;
  specialization?: string;
  mobileNumber?: string;
  email?: string;
  qualification?: string;
  department?: string;
  consultationRoom?: string;
  consultationFees?: number;
  followUpFees?: number;
  availability?: string;
  status?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorPayload {
  name: string;
  specialization: string;
  status: string;
  consultationFees: number;
  followUpFees: number;
  availability: string;
  // Legacy fields
  doctorName?: string;
  mobileNumber?: string;
  email?: string;
  qualification?: string;
  department?: string;
  consultationRoom?: string;
}

export interface TherapistDto {
  id: string;
  name?: string;
  therapistName?: string;
  therapistCode?: string;
  specialization?: string;
  mobileNumber?: string;
  email?: string;
  qualification?: string;
  therapyRoom?: string;
  assignedTherapyIds?: string[];
  status?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTherapistPayload {
  name: string;
  status: string;
  assignedTherapyIds: string[];
  // Legacy fields
  therapistName?: string;
  specialization?: string;
  mobileNumber?: string;
  email?: string;
  qualification?: string;
  therapyRoom?: string;
}

export interface TreatmentCategoryDto {
  id: string;
  categoryCode: string | null;
  categoryName: string;
  description: string;
  status?: string;
  active?: boolean;
}

export interface CreateTreatmentCategoryPayload {
  categoryName: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  /** @deprecated use status */
  active?: boolean;
}

export interface TherapyDto {
  id: string;
  categoryId?: string;
  name?: string;
  therapyCode?: string;
  therapyName?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  status?: string;
  active?: boolean;
}

export interface CreateTherapyPayload {
  categoryId: string;
  name: string;
  description: string;
  durationMinutes?: number;
  price?: number;
  status?: string;
  // Legacy
  therapyName?: string;
  active?: boolean;
}

export interface DoshaDto {
  id: string;
  name: string;
  elements?: string;
  characteristics?: string;
  status?: string;
  active?: boolean;
}

export interface CreateDoshaPayload {
  name: string;
  elements?: string;
  characteristics?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  /** @deprecated use status */
  active?: boolean;
}

export type BookingStatus =
  | 'SCHEDULED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'IN_CONSULTATION'
  | 'COMPLETED';

export interface PatientAppointmentListItemDto {
  bookingId: string;
  patientId: string;
  patientDisplayId?: string;
  patientCode?: string;
  patientFullName: string;
  patientMobileNumber?: string;
  assignedDoctorId?: string;
  doctorName?: string;
  consultationTypes?: string[];
  appointmentDate?: string;
  slotTime?: string;
  bookingTime?: string;
  doshaId?: string;
  doshaName?: string;
  bookingStatus?: BookingStatus | string;
}

export interface AppointmentStatsDto {
  totalAppointments?: number;
  scheduledCount?: number;
  completedCount?: number;
  cancelledCount?: number;
  inConsultationCount?: number;
  rescheduledCount?: number;
  [key: string]: unknown;
}

export interface RescheduleAppointmentPayload {
  patientId: string;
  registrationDate: string;
  slotTime: string;
  assignedDoctorId: string;
  consultationTypes: string[];
}

export type ConsultationTypeApi = 'CONSULTATION' | 'THERAPY';

export interface CreateAppointmentPayload {
  patient: CreatePatientPayload;
  registrationDate: string;
  assignedDoctorId: string;
  consultationTypes: ConsultationTypeApi[];
  slotTime?: string;
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
  assignedDoctor?: { id?: string; name?: string };
  consultationTypes?: ConsultationTypeApi[] | string[];
  visitType?: string;
  registrationDate?: string;
  appointmentDate?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  slotTime?: string;
  bookingStatus?: BookingStatus | string;
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
  id?: string;
  therapyId?: string;
  patientId?: string;
  patientName?: string;
  patient?: { id?: string; fullName?: string; patientCode?: string };
  treatmentCategoryId?: string;
  treatmentCategoryName?: string;
  categoryName?: string;
  treatmentCategory?: {
    id?: string;
    categoryName?: string;
    categoryCode?: string;
  };
  assignedTherapistId?: string;
  therapistName?: string;
  assignedTherapist?: {
    id?: string;
    name?: string;
    therapistName?: string;
    therapistCode?: string;
  };
  scheduleDate?: string;
  scheduleTime?: string;
  sessionDuration?: number;
  sessionFrequency?: number;
  therapyInstructions?: string;
  remarks?: string;
  therapyIds?: string[];
  therapyNames?: string[];
  therapies?: { id?: string; name?: string; therapyName?: string }[];
  therapyStatus?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface MedicineDto {
  id: string;
  medicineName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  stockQuantity: number;
  /** @deprecated legacy alias — prefer stockQuantity */
  quantity?: number;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  price?: number;
  lowStockAlertEnabled: boolean;
  lowStockThreshold: number;
  status?: string;
  stockStatus?: string;
}

export interface CreateMedicinePayload {
  medicineName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  lowStockAlertEnabled: boolean;
  lowStockThreshold: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

// ── Medical assessment (combined POST /api/v1/medical-assessment) ─────────────

export interface CreateAyurvedicAssessmentPayload {
  patientId: string;
  doshaId: string;
  bodyConstitution?: string;
  currentImbalances?: string;
}

export interface CreatePhysicalExaminationPayload {
  patientId: string;
  weight: number;
  height: number;
  ibw: number;
  pulse: number;
  bp: string;
  temperature: number;
  pallor?: string;
  icterus?: string;
  cyanosis?: string;
  lymphNodes?: string;
  oedema?: string;
  sensorium?: string;
  acidityGas?: string;
  motion?: string;
  micturition?: string;
}

export interface CreateMedicalHistoryPayload {
  patientId: string;
  pastMedicalConditions?: string;
  pastSurgeries?: string;
  currentMedications?: string;
  allergies?: string;
  familyHistory?: string;
}

export interface CreateLifestyleInformationPayload {
  patientId: string;
  dietType?: string;
  sleepPattern?: string;
  exerciseHabits?: string;
  addiction?: string;
}

export interface CreateSystemicExaminationPayload {
  patientId: string;
  cardiovascular?: string;
  respiratory?: string;
  nervous?: string;
  abdomenGi?: string;
  locomotor?: string;
}

export interface CreateTreatmentPlanPayload {
  patientId: string;
  investigationAndPlanSuggested?: string;
  planTaken?: string;
}

export interface CreateMedicalAssessmentPayload {
  patientId: string;
  ayurvedicAssessment: CreateAyurvedicAssessmentPayload;
  physicalExamination: CreatePhysicalExaminationPayload;
  medicalHistory: CreateMedicalHistoryPayload;
  lifestyleInformation: CreateLifestyleInformationPayload;
  systemicExamination: CreateSystemicExaminationPayload;
  treatmentPlan: CreateTreatmentPlanPayload;
}

export interface AyurvedicAssessmentDto {
  id?: string;
  patientId?: string;
  doshaId?: string;
  dosha?: { id?: string; name?: string };
  bodyConstitution?: string;
  currentImbalances?: string;
}

export interface PhysicalExaminationDto {
  id?: string;
  patientId?: string;
  weight?: number;
  height?: number;
  ibw?: number;
  pulse?: number;
  bp?: string;
  temperature?: number;
  pallor?: string;
  icterus?: string;
  cyanosis?: string;
  lymphNodes?: string;
  oedema?: string;
  sensorium?: string;
  acidityGas?: string;
  motion?: string;
  micturition?: string;
}

export interface MedicalHistoryDto {
  id?: string;
  patientId?: string;
  pastMedicalConditions?: string;
  pastSurgeries?: string;
  currentMedications?: string;
  allergies?: string;
  familyHistory?: string;
}

export interface LifestyleInformationDto {
  id?: string;
  patientId?: string;
  dietType?: string;
  sleepPattern?: string;
  exerciseHabits?: string;
  addiction?: string;
}

export interface SystemicExaminationDto {
  id?: string;
  patientId?: string;
  cardiovascular?: string;
  respiratory?: string;
  nervous?: string;
  abdomenGi?: string;
  locomotor?: string;
}

export interface TreatmentPlanDto {
  id?: string;
  patientId?: string;
  investigationAndPlanSuggested?: string;
  planTaken?: string;
}

export interface AssessmentDocumentDto {
  id?: string;
  bookingId?: string;
  documentType?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  downloadUrl?: string;
}

export interface MedicalAssessmentDto {
  patientId: string;
  ayurvedicAssessment?: AyurvedicAssessmentDto | null;
  physicalExamination?: PhysicalExaminationDto | null;
  medicalHistory?: MedicalHistoryDto | null;
  lifestyleInformation?: LifestyleInformationDto | null;
  systemicExamination?: SystemicExaminationDto | null;
  treatmentPlan?: TreatmentPlanDto | null;
  documents?: AssessmentDocumentDto[];
}

export interface MedicalAssessmentDocuments {
  pastMedicalReports?: File[];
  prescriptions?: File[];
  labReports?: File[];
}

