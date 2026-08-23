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
  mobileNumber: string;
  preferredLanguage?: string;
  email?: string;
  state?: string;
  city?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyRelationship?: string;
  emergencyPhoneNumber?: string;
  idProofType?: string;
  idProofNumber?: string;
  occupation?: string;
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
  assignedTherapies?: { id: string; name?: string | null }[];
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

export type MasterStatus = 'ACTIVE' | 'INACTIVE';

export interface ConsultationTypeMasterDto {
  id: string;
  name: string;
  status?: MasterStatus | string;
}

export interface CreateConsultationTypeMasterPayload {
  name: string;
  status?: MasterStatus;
}

export interface TreatmentPlanMasterDto {
  id: string;
  name: string;
  status?: MasterStatus | string;
}

export interface CreateTreatmentPlanMasterPayload {
  name: string;
  status?: MasterStatus;
}

export interface PackageMasterDto {
  id: string;
  name: string;
  packagePrice: number;
  status?: MasterStatus | string;
}

export interface CreatePackageMasterPayload {
  name: string;
  packagePrice: number;
  status?: MasterStatus;
}

export interface ConsultationTypeRef {
  id: string;
  name: string;
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
  consultationTypes?: ConsultationTypeRef[] | string[];
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
  currentMonthAppointmentCount?: number;
  todayAppointmentCount?: number;
  ongoingCount?: number;
  [key: string]: unknown;
}

export interface TodayAppointmentItemDto {
  bookingId: string;
  assignedDoctorId?: string;
  slotTime?: string;
  bookingTime?: string;
  bookingStatus?: BookingStatus | string;
  patientId: string;
  patientName?: string;
  patientMobileNumber?: string;
  consultationTypes?: ConsultationTypeRef[] | string[];
}

export interface TodayAppointmentsResponseDto {
  doctorId?: string | null;
  date?: string;
  totalAppointments?: number;
  appointments?: TodayAppointmentItemDto[];
}

export interface RescheduleAppointmentPayload {
  patientId: string;
  registrationDate: string;
  slotTime: string;
  assignedDoctorId: string;
  consultationTypeIds: string[];
}

export interface CreateAppointmentPayload {
  patient: CreatePatientPayload;
  registrationDate: string;
  assignedDoctorId: string;
  consultationTypeIds: string[];
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
  assignedDoctor?: {
    id?: string;
    name?: string;
    doctorName?: string;
    specialization?: string;
    qualification?: string;
    mobileNumber?: string;
    status?: string;
  };
  consultationTypes?: ConsultationTypeRef[] | string[];
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

export type TreatmentStatusApi = 'SCHEDULED' | 'ONGOING' | 'COMPLETED';

export interface TreatmentDto {
  id: string;
  appointmentTherapyId?: string;
  patientId: string;
  treatmentPlanId: string;
  treatmentPlanName?: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  remainingSessions: number;
  assignedTherapistId: string;
  assignedTherapistName?: string;
  treatmentStatus: TreatmentStatusApi;
}

export interface CreateTreatmentPayload {
  patientId: string;
  treatmentPlanId: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions?: number;
  assignedTherapistId: string;
  treatmentStatus?: TreatmentStatusApi;
}

export interface UpdateTreatmentPayload {
  treatmentPlanId: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  assignedTherapistId: string;
}

export type FollowUpStatusApi =
  | 'UPCOMING'
  | 'MISSED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface FollowUpDto {
  id: string;
  patientId: string;
  patientDisplayId?: string;
  patientName?: string;
  assignedDoctorId: string;
  doctorName?: string;
  sourceBookingId?: string;
  visitTypeId: string;
  visitTypeName?: string;
  appointmentDate: string;
  schedulingOption: string;
  smsReminderEnabled: boolean;
  status: FollowUpStatusApi;
}

export interface CreateFollowUpPayload {
  patientId: string;
  assignedDoctorId: string;
  sourceBookingId?: string;
  visitTypeId: string;
  appointmentDate: string;
  schedulingOption: string;
  smsReminderEnabled?: boolean;
  status?: FollowUpStatusApi;
}

export type PatientPackageStatusApi = 'SCHEDULED' | 'ONGOING' | 'COMPLETED';

export interface PatientPackageDto {
  id: string;
  patientId: string;
  packageMasterId: string;
  packageName?: string;
  packagePrice?: number;
  validity: string;
  status: PatientPackageStatusApi;
  discountApplied: number;
}

export interface CreatePatientPackagePayload {
  patientId: string;
  packageMasterId: string;
  validity: string;
  status?: PatientPackageStatusApi;
  discountApplied: number;
}

export interface UpdatePatientPackagePayload {
  packageMasterId: string;
  validity: string;
  discountApplied: number;
}

