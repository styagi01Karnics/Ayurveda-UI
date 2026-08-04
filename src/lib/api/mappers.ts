import type { CreatePatientValues } from '@/lib/validation/patient.schema';
import type {
  AppointmentDto,
  AppointmentTherapyDto,
  CreateMedicalAssessmentPayload,
  DoctorDto,
  MedicineDto,
  MedicalAssessmentDto,
  MedicalAssessmentDocuments,
  PatientAppointmentListItemDto,
  PatientDto,
  TherapistDto,
  TherapyDto,
  TreatmentCategoryDto,
} from '@/lib/api/types';
import type { InvoiceListItemDto } from '@/lib/api/billing';
import type {
  AppointmentRecord,
  ClinicDoctorRecord,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
  ClinicTreatmentCategoryRecord,
  DoctorDirectoryRecord,
  Dosha,
  MedicineRecord,
  MedicineStatus,
  PatientDetail,
  PatientRecord,
  PatientStatus,
  TreatmentRecord,
  VisitType,
} from '@/types';

function titleCase(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split(/[\s_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDisplayDate(iso?: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDisplayDateTime(date?: string | null, time?: string | null): string {
  if (!date && !time) return '—';
  if (date && time) {
    const combined = new Date(`${date}T${time}`);
    if (!Number.isNaN(combined.getTime())) {
      return combined.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return `${date}, ${time}`;
  }
  return formatDisplayDate(date);
}

function normalizeVisitType(raw?: string | string[] | null): VisitType {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return 'Consultation';
  const upper = value.toUpperCase();
  if (upper.includes('THERAPY')) return 'Therapy';
  if (upper.includes('FOLLOW')) return 'Follow-Up';
  if (upper.includes('TREATMENT')) return 'Treatment';
  return 'Consultation';
}

function normalizeAppointmentStatus(
  raw?: string | null,
): AppointmentRecord['status'] {
  const value = (raw ?? 'SCHEDULED').toUpperCase();
  if (value.includes('COMPLETE')) return 'Completed';
  if (value.includes('CANCEL')) return 'Cancelled';
  return 'Scheduled';
}

function normalizeTreatmentStatus(
  raw?: string | null,
): TreatmentRecord['status'] {
  const value = (raw ?? 'Ongoing').toLowerCase();
  if (value.includes('complete')) return 'Completed';
  return 'Ongoing';
}

function pickDosha(name?: string | null): Dosha {
  const value = (name ?? '').toLowerCase();
  if (value.includes('pitta')) return 'Pitta';
  if (value.includes('kapha')) return 'Kapha';
  return 'Vata';
}

export function mapPatientToRecord(
  patient: PatientDto,
  extras?: Partial<PatientRecord>,
): PatientRecord {
  const code = patient.patientCode || patient.id.slice(0, 8);
  return {
    id: code.startsWith('#') ? code : `#${code}`,
    secondaryId: patient.patientCode || patient.id,
    detailId: patient.id,
    name: patient.fullName,
    phone: patient.mobileNumber ? `+91-${patient.mobileNumber}` : '—',
    doctor: extras?.doctor ?? '—',
    visitType: extras?.visitType ?? 'Consultation',
    appointmentDate:
      extras?.appointmentDate ?? formatDisplayDate(patient.createdAt),
    dosha: extras?.dosha ?? 'Vata',
    status: extras?.status ?? 'Pending',
    isActive:
      extras?.isActive ??
      (patient.status
        ? patient.status.toUpperCase() === 'ACTIVE'
        : patient.active),
  };
}

export function mapPatientToDetail(
  patient: PatientDto,
  extras?: Partial<PatientDetail>,
): PatientDetail {
  const summary = mapPatientToRecord(patient, extras);
  return {
    ...summary,
    treatmentStatus: extras?.treatmentStatus ?? 'Pending',
    personalInfo: {
      gender: titleCase(patient.gender),
      age: `${patient.age}yrs`,
      dob: formatDisplayDate(patient.dateOfBirth),
      serviceType: extras?.personalInfo?.serviceType ?? summary.visitType,
      registrationDate: formatDisplayDate(patient.createdAt),
      assignedDoctor: extras?.personalInfo?.assignedDoctor ?? summary.doctor,
      therapyDuration: extras?.personalInfo?.therapyDuration ?? '—',
      email: patient.email,
      city: patient.city,
      state: patient.state,
      address: patient.address,
      emergencyName: patient.emergencyContactName,
      emergencyRelation: patient.emergencyRelationship,
      emergencyPhone: patient.emergencyPhoneNumber
        ? `+91-${patient.emergencyPhoneNumber}`
        : '—',
      idProofType: titleCase(patient.idProofType),
      idProofNumber: patient.idProofNumber,
      occupation: patient.occupation,
      insuranceDetails: patient.insuranceDetails || 'N/A',
    },
    medicalAssessment: extras?.medicalAssessment ?? {
      bodyConstitution: '—',
      currentImbalance: '—',
      previousPanchakarma: '—',
      weight: '—',
      height: '—',
      ibw: '—',
      pulse: '—',
      bp: '—',
      pallor: '—',
      temperature: '—',
      acidityGas: '—',
      oedema: '—',
      sensorium: '—',
      icterus: '—',
      cyanosis: '—',
      motion: '—',
      micturition: '—',
      lymphNodes: '—',
      presentConditions: '—',
      pastConditions: '—',
      pastSurgeries: '—',
      currentMedication: '—',
      allergies: '—',
      familyHistory: '—',
      diet: '—',
      sleep: '—',
      exercise: '—',
      reports: [],
    },
    treatmentFollowUp: extras?.treatmentFollowUp ?? {
      treatmentName: '—',
      startDate: '—',
      endDate: '—',
      totalSessions: 0,
      sessionsCompleted: 0,
      remainingSessions: 0,
      assignedTherapist: '—',
      nextFollowUp: '—',
      followUpDoctor: '—',
      reminder: '—',
      appointmentHistory: [],
    },
    billing: extras?.billing ?? {
      packageName: '—',
      validity: '—',
      membershipStatus: 'Pending' as PatientStatus,
      discountApplied: 0,
      registrationFees: 0,
      paymentMode: '—',
      partialPayment: '—',
      outstandingAmount: 0,
      serviceType: '—',
      serviceFees: 0,
      packageType: '—',
      packageCharges: 0,
      discount: 0,
      taxRate: '—',
    },
    invoice: extras?.invoice ?? {
      clinicName: 'Ganesha Ayurvedaa',
      gstNo: '—',
      doctorName: summary.doctor,
      doctorCredentials: '—',
      workingHours: '—',
      doctorPhone: '—',
      invoiceNo: '—',
      invoiceDate: formatDisplayDate(patient.createdAt),
      paymentMode: '—',
      amountDue: 0,
      items: [],
      subtotal: 0,
      cgst: 0,
      sgst: 0,
      discount: 0,
      total: 0,
      conditions: '—',
      address: patient.address,
      email: patient.email,
      website: '—',
    },
  };
}

export function mapAppointmentToRecord(
  appointment: AppointmentDto,
  doctorsById: Map<string, DoctorDto> = new Map(),
): AppointmentRecord {
  const doctorId = appointment.assignedDoctorId ?? appointment.doctorId;
  const doctor =
    appointment.doctorName ??
    appointment.assignedDoctor?.name ??
    (doctorId ? doctorsById.get(doctorId)?.name : undefined) ??
    (doctorId ? doctorsById.get(doctorId)?.doctorName : undefined) ??
    '—';

  const patient =
    appointment.patientName ??
    appointment.fullName ??
    appointment.patient?.fullName ??
    '—';

  const patientCode =
    appointment.patient?.patientCode ??
    (typeof appointment.patientId === 'string'
      ? appointment.patientId.slice(0, 8)
      : 'APT');

  const visitType = normalizeVisitType(
    appointment.consultationTypes ?? appointment.visitType,
  );

  const appointmentDate = formatDisplayDateTime(
    appointment.appointmentDate ??
      appointment.scheduleDate ??
      appointment.registrationDate,
    appointment.scheduleTime ?? appointment.slotTime,
  );

  return {
    id: String(appointment.id ?? appointment.bookingId ?? crypto.randomUUID()),
    uhid: patientCode.startsWith('#') ? patientCode : `#${patientCode}`,
    patient,
    doctor,
    visitType,
    appointmentDate,
    dateCreated: (
      appointment.registrationDate ??
      appointment.createdAt?.slice(0, 10) ??
      ''
    ).slice(0, 10),
    status: normalizeAppointmentStatus(
      appointment.bookingStatus ?? appointment.status,
    ),
  };
}

export function mapPatientAppointmentListItemToPatientRecord(
  item: PatientAppointmentListItemDto,
  tab: 'active' | 'inactive' = 'active',
): PatientRecord {
  const displayId =
    item.patientDisplayId ??
    item.patientCode ??
    item.patientId.slice(0, 8);

  const bookingStatus = (item.bookingStatus ?? '').toUpperCase();
  let status: PatientRecord['status'] = 'Pending';
  if (bookingStatus.includes('COMPLETE')) status = 'Completed';
  else if (bookingStatus.includes('CANCEL')) status = 'Cancelled';
  else if (bookingStatus.includes('CONSULTATION') || bookingStatus.includes('IN_CONSULTATION'))
    status = 'Pending';

  return {
    id: displayId.startsWith('#') ? displayId : `#${displayId}`,
    secondaryId: item.patientCode ?? item.patientId,
    detailId: item.patientId,
    name: item.patientFullName,
    phone: item.patientMobileNumber
      ? item.patientMobileNumber.startsWith('+')
        ? item.patientMobileNumber
        : `+91-${item.patientMobileNumber.replace(/^\+91-?/, '')}`
      : '—',
    doctor: item.doctorName ?? '—',
    visitType: normalizeVisitType(item.consultationTypes),
    appointmentDate: formatDisplayDateTime(
      item.appointmentDate,
      item.slotTime,
    ),
    dosha: pickDosha(item.doshaName),
    status,
    isActive: tab === 'active',
  };
}

export function mapPatientAppointmentListItemToRecord(
  item: PatientAppointmentListItemDto,
): AppointmentRecord {
  const displayId =
    item.patientDisplayId ??
    item.patientCode ??
    item.patientId.slice(0, 8);

  return {
    id: String(item.bookingId),
    uhid: displayId.startsWith('#') ? displayId : `#${displayId}`,
    patient: item.patientFullName,
    doctor: item.doctorName ?? '—',
    visitType: normalizeVisitType(item.consultationTypes),
    appointmentDate: formatDisplayDateTime(
      item.appointmentDate,
      item.slotTime,
    ),
    dateCreated: (item.bookingTime ?? item.appointmentDate ?? '').slice(0, 10),
    status: normalizeAppointmentStatus(item.bookingStatus),
    patientId: item.patientId,
    assignedDoctorId: item.assignedDoctorId,
    registrationDate: item.appointmentDate ?? '',
    slotTime: item.slotTime ?? '',
    consultationTypes: item.consultationTypes ?? [],
  };
}

export function mapAppointmentTherapyToTreatment(
  therapy: AppointmentTherapyDto,
  patientName?: string,
): TreatmentRecord {
  const therapyType =
    therapy.therapyNames?.[0] ??
    therapy.therapies?.[0]?.name ??
    therapy.therapies?.[0]?.therapyName ??
    'Therapy';

  const therapistName =
    therapy.therapistName ??
    therapy.assignedTherapist?.name ??
    therapy.assignedTherapist?.therapistName ??
    '—';

  const patientId =
    therapy.patientId ?? therapy.patient?.id ?? '';

  return {
    id: String(therapy.therapyId ?? therapy.id ?? crypto.randomUUID()),
    patient:
      patientName ??
      therapy.patientName ??
      therapy.patient?.fullName ??
      '—',
    patientDetailId: patientId,
    treatmentCategory:
      therapy.treatmentCategoryName ??
      therapy.categoryName ??
      therapy.treatmentCategory?.categoryName ??
      '—',
    therapyType,
    assignedTherapist: therapistName,
    therapistSchedule: formatDisplayDateTime(
      therapy.scheduleDate,
      therapy.scheduleTime,
    ),
    totalSessions: therapy.sessionFrequency ?? 0,
    status: normalizeTreatmentStatus(
      therapy.therapyStatus ?? therapy.status,
    ),
    dateCreated: (therapy.createdAt ?? therapy.scheduleDate ?? '').slice(0, 10),
  };
}

function formatFileSize(bytes?: number): string {
  if (bytes == null || !Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function displayOrDash(value: string | number | null | undefined, suffix = ''): string {
  if (value === null || value === undefined || value === '') return '—';
  return `${value}${suffix}`;
}

/** Maps GET /api/v1/medical-assessment/{patientId} → UI medical assessment tab. */
export function mapMedicalAssessmentDtoToUi(
  assessment: MedicalAssessmentDto | null | undefined,
): import('@/types').PatientMedicalAssessment {
  const ayur = assessment?.ayurvedicAssessment;
  const phys = assessment?.physicalExamination;
  const hist = assessment?.medicalHistory;
  const life = assessment?.lifestyleInformation;
  const systemic = assessment?.systemicExamination;
  const plan = assessment?.treatmentPlan;
  const docs = assessment?.documents ?? [];

  return {
    bodyConstitution: displayOrDash(ayur?.bodyConstitution),
    currentImbalance: displayOrDash(ayur?.currentImbalances),
    previousPanchakarma: '—',
    doshaName: displayOrDash(ayur?.dosha?.name),
    weight: displayOrDash(phys?.weight, ' kg'),
    height: displayOrDash(phys?.height, ' cm'),
    ibw: displayOrDash(phys?.ibw, ' kg'),
    pulse: displayOrDash(phys?.pulse, ' bpm'),
    bp: displayOrDash(phys?.bp),
    pallor: displayOrDash(phys?.pallor),
    temperature: displayOrDash(phys?.temperature, '°F'),
    acidityGas: displayOrDash(phys?.acidityGas),
    oedema: displayOrDash(phys?.oedema),
    sensorium: displayOrDash(phys?.sensorium),
    icterus: displayOrDash(phys?.icterus),
    cyanosis: displayOrDash(phys?.cyanosis),
    motion: displayOrDash(phys?.motion),
    micturition: displayOrDash(phys?.micturition),
    lymphNodes: displayOrDash(phys?.lymphNodes),
    presentConditions: '—',
    pastConditions: displayOrDash(hist?.pastMedicalConditions),
    pastSurgeries: displayOrDash(hist?.pastSurgeries),
    currentMedication: displayOrDash(hist?.currentMedications),
    allergies: displayOrDash(hist?.allergies),
    familyHistory: displayOrDash(hist?.familyHistory),
    diet: displayOrDash(life?.dietType),
    sleep: displayOrDash(life?.sleepPattern),
    exercise: displayOrDash(life?.exerciseHabits),
    addiction: displayOrDash(life?.addiction),
    cardiovascular: displayOrDash(systemic?.cardiovascular),
    respiratory: displayOrDash(systemic?.respiratory),
    nervous: displayOrDash(systemic?.nervous),
    abdomenGi: displayOrDash(systemic?.abdomenGi),
    locomotor: displayOrDash(systemic?.locomotor),
    investigationPlan: displayOrDash(plan?.investigationAndPlanSuggested),
    planTaken: displayOrDash(plan?.planTaken),
    reports: docs.map((doc) => ({
      name: doc.fileName || titleCase(doc.documentType) || 'Document',
      size: formatFileSize(doc.fileSize),
      time: titleCase(doc.documentType?.replace(/_/g, ' ')) || 'Uploaded',
      type: 'file' as const,
    })),
  };
}

export function mapInvoicesToPatientBilling(
  invoices: InvoiceListItemDto[],
): {
  billing: import('@/types').PatientBillingMembership;
  invoice: import('@/types').PatientInvoice;
} {
  const latest = invoices[0];
  const outstanding = invoices.reduce(
    (sum, inv) => sum + (inv.leftAmount ?? 0),
    0,
  );
  const paid = invoices.reduce((sum, inv) => sum + (inv.paidAmount ?? 0), 0);
  const total = invoices.reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);
  const status = latest?.status?.toUpperCase();

  return {
    billing: {
      packageName: '—',
      validity: '—',
      membershipStatus:
        status === 'COMPLETED'
          ? 'Completed'
          : status === 'ONGOING'
            ? 'Pending'
            : 'Pending',
      discountApplied: 0,
      registrationFees: 0,
      paymentMode: '—',
      partialPayment: paid > 0 && outstanding > 0 ? formatCurrencyLike(paid) : '—',
      outstandingAmount: outstanding,
      serviceType: '—',
      serviceFees: total,
      packageType: '—',
      packageCharges: 0,
      discount: 0,
      taxRate: '—',
    },
    invoice: {
      clinicName: 'Ganesha Ayurvedaa',
      gstNo: '—',
      doctorName: '—',
      doctorCredentials: '—',
      workingHours: '—',
      doctorPhone: '—',
      invoiceNo: latest?.invoiceId ?? '—',
      invoiceDate: latest ? formatDisplayDate(latest.invoiceDate) : '—',
      paymentMode: '—',
      amountDue: outstanding,
      items: [],
      subtotal: total,
      cgst: 0,
      sgst: 0,
      discount: 0,
      total,
      conditions: '—',
      address: '—',
      email: '—',
      website: '—',
    },
  };
}

function formatCurrencyLike(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function mapDoctorToClinicRecord(doctor: DoctorDto): ClinicDoctorRecord {
  return {
    id: doctor.id,
    name: doctor.name || doctor.doctorName || '—',
    specialization: doctor.specialization || '—',
    status: doctor.status === 'ACTIVE' || doctor.active ? 'Active' : 'Inactive',
    consultationFees: doctor.consultationFees ?? 0,
    followUpFees: doctor.followUpFees ?? 0,
    availability: doctor.availability || `${doctor.department || ''} · ${doctor.consultationRoom || ''}`,
  };
}

export function mapDoctorToDirectoryRecord(
  doctor: DoctorDto,
): DoctorDirectoryRecord {
  return {
    id: doctor.id,
    doctorCode: doctor.doctorCode || '',
    name: doctor.name || doctor.doctorName || '—',
    specialization: doctor.specialization || '',
    qualification: doctor.qualification || '',
    department: doctor.department || '',
    consultationRoom: doctor.consultationRoom || '',
    mobileNumber: doctor.mobileNumber || '',
    email: doctor.email || '',
    status: doctor.status === 'ACTIVE' || doctor.active ? 'Active' : 'Inactive',
  };
}

export function mapTherapistToClinicRecord(
  therapist: TherapistDto,
  therapiesById: Map<string, TherapyDto> = new Map(),
): ClinicTherapistRecord {
  const assignedTherapies = (therapist.assignedTherapyIds ?? [])
    .map((id) => {
      const therapy = therapiesById.get(id);
      return therapy?.name || therapy?.therapyName || id;
    })
    .filter(Boolean);

  return {
    id: therapist.id,
    name: therapist.name || therapist.therapistName || '—',
    status:
      therapist.status === 'ACTIVE' || therapist.active ? 'Active' : 'Inactive',
    assignedTherapies,
  };
}

export function mapTherapyToClinicRecord(
  therapy: TherapyDto,
  categoriesById: Map<string, TreatmentCategoryDto>,
): ClinicTherapyRecord {
  const cId = therapy.categoryId || '';
  return {
    id: therapy.id,
    name: therapy.name || therapy.therapyName || '—',
    category: categoriesById.get(cId)?.categoryName ?? cId,
    categoryId: cId,
    duration: therapy.durationMinutes ? `${therapy.durationMinutes} mins` : '—',
    price: therapy.price ?? 0,
    description: therapy.description || '—',
    status:
      therapy.status === 'ACTIVE' || therapy.active ? 'Active' : 'Inactive',
  };
}

export function mapTreatmentCategoryToRecord(
  category: TreatmentCategoryDto,
): ClinicTreatmentCategoryRecord {
  return {
    id: category.id,
    name: category.categoryName,
    description: category.description || '—',
  };
}

function normalizeMedicineStockStatus(
  stockStatus?: string | null,
  stockQuantity?: number,
): MedicineStatus {
  const value = (stockStatus ?? '').toUpperCase().replace(/\s+/g, '_');
  if (value === 'LOW_STOCK') return 'Low Stock';
  if (value === 'OUT_OF_STOCK') return 'Out of Stock';
  if (value === 'IN_STOCK') return 'In Stock';
  if (stockQuantity === 0) return 'Out of Stock';
  return 'In Stock';
}

export function mapMedicineToRecord(medicine: MedicineDto): MedicineRecord {
  const stockQuantity = medicine.stockQuantity ?? medicine.quantity ?? 0;
  const categoryCode = medicine.category.trim().toUpperCase();

  return {
    id: medicine.id,
    name: medicine.medicineName,
    category: titleCase(categoryCode),
    categoryCode,
    stockQuantity,
    expiryDate: formatDisplayDate(medicine.expiryDate),
    price: medicine.sellingPrice ?? medicine.price ?? 0,
    status: normalizeMedicineStockStatus(medicine.stockStatus, stockQuantity),
    manufacturer: medicine.manufacturer,
    batchNumber: medicine.batchNumber,
    purchasePrice: medicine.purchasePrice,
    lowStockThreshold: medicine.lowStockThreshold,
    lowStockAlertEnabled: medicine.lowStockAlertEnabled,
  };
}

export function mapMedicineCategoryOptions(categories: string[]) {
  return categories.map((code) => ({
    value: code,
    label: titleCase(code),
  }));
}

export function toApiMedicineCategory(category: string): string {
  return category.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiGender(gender: string): string {
  return gender.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiIdProofType(idProofType: string): string {
  return idProofType.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiConsultationTypes(
  types: string[],
): Array<'CONSULTATION' | 'THERAPY'> {
  return types.map((type) => {
    const upper = type.toUpperCase();
    return upper.includes('THERAPY') ? 'THERAPY' : 'CONSULTATION';
  });
}

export function fromApiConsultationTypes(
  types?: string[] | null,
): string[] {
  if (!types?.length) return ['Consultation'];
  return types.map((type) => {
    const upper = type.toUpperCase();
    return upper.includes('THERAPY') ? 'Therapy' : 'Consultation';
  });
}

export function slotTimeForInput(slotTime?: string | null): string {
  if (!slotTime) return '10:00';
  return slotTime.slice(0, 5);
}

export function normalizeSlotTimeForApi(time: string): string {
  if (!time) return '10:00:00';
  return time.length === 5 ? `${time}:00` : time;
}

export function parseSessionNumber(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function parseNumericField(value: string | undefined, fallback = 0): number {
  if (!value?.trim()) return fallback;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseIntegerField(value: string | undefined, fallback = 0): number {
  if (!value?.trim()) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function joinList(values: string[] | undefined): string {
  return (values ?? []).filter(Boolean).join(', ');
}

export function hasMedicalAssessmentDocuments(
  documents?: MedicalAssessmentDocuments | CreatePatientValues['uploadedDocuments'],
): boolean {
  if (!documents) return false;
  return (
    (documents.pastMedicalReports?.length ?? 0) > 0 ||
    (documents.prescriptions?.length ?? 0) > 0 ||
    (documents.labReports?.length ?? 0) > 0
  );
}

/** Maps Step 3 form values to POST /api/v1/medical-assessment body. */
export function toMedicalAssessmentPayload(
  data: CreatePatientValues,
  patientId: string,
): CreateMedicalAssessmentPayload {
  const weight = parseNumericField(data.weight);
  const height = parseNumericField(data.height);

  return {
    patientId,
    ayurvedicAssessment: {
      patientId,
      doshaId: data.doshaType,
      bodyConstitution: joinList(data.bodyConstitution),
      currentImbalances: data.currentImbalance,
    },
    physicalExamination: {
      patientId,
      weight,
      height,
      ibw: parseNumericField(data.ibw, weight > 0 ? weight : 60),
      pulse: parseIntegerField(data.pulse, 72),
      bp: data.bp,
      temperature: parseNumericField(data.temperature, 98.6),
      pallor: data.pallor ?? '',
      icterus: data.icterus ?? '',
      cyanosis: data.cyanosis ?? '',
      lymphNodes: data.lymphNodes ?? '',
      oedema: data.oedema ?? '',
      sensorium: data.sensorium ?? '',
      acidityGas: data.acidityGas ?? '',
      motion: data.motion ?? '',
      micturition: data.micturition ?? '',
    },
    medicalHistory: {
      patientId,
      pastMedicalConditions: data.pastMedicalConditions ?? '',
      pastSurgeries: data.pastSurgeries ?? '',
      currentMedications: data.currentMedications ?? '',
      allergies: joinList(data.allergies),
      familyHistory: data.familyHistory ?? '',
    },
    lifestyleInformation: {
      patientId,
      dietType: data.dietType ?? '',
      sleepPattern: data.sleepPattern ?? '',
      exerciseHabits: data.exerciseHabits ?? '',
      addiction: data.addictions ?? '',
    },
    systemicExamination: {
      patientId,
      cardiovascular: data.cardiovascular ?? '',
      respiratory: data.respiratory ?? '',
      nervous: data.nervous ?? '',
      abdomenGi: data.abdomenGi ?? '',
      locomotor: data.locomotor ?? '',
    },
    treatmentPlan: {
      patientId,
      investigationAndPlanSuggested: data.investigationPlan ?? '',
      planTaken: data.planDetails ?? '',
    },
  };
}

export { pickDosha, titleCase };

function formatInvoiceDate(date: string): string {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-IN');
}

function mapInvoiceStatus(status: string): import('@/types').BillingStatus {
  const upper = status.toUpperCase();
  if (upper === 'COMPLETED') return 'Completed';
  return 'Ongoing';
}

function mapActivityAction(action: string): import('@/types').ActivityLogAction {
  const map: Record<string, import('@/types').ActivityLogAction> = {
    VIEWED: 'Viewed',
    CREATED: 'Created',
    UPDATED: 'Updated',
    DELETED: 'Deleted',
  };
  return map[action.toUpperCase()] ?? 'Viewed';
}

export function mapInvoiceToBillingRecord(
  invoice: import('@/lib/api/billing').InvoiceListItemDto,
  index = 0,
): import('@/types').BillingRecord {
  const displayId = invoice.patientDisplayId ?? invoice.patientId;
  return {
    id: invoice.invoiceId || `bill-${index}`,
    invoiceId: invoice.invoiceId,
    patientId: displayId.startsWith('#') ? displayId : `#${displayId}`,
    secondaryPatientId: invoice.patientCode ?? invoice.patientId,
    patientUuid: invoice.patientId,
    invoiceDate: formatInvoiceDate(invoice.invoiceDate),
    totalAmount: invoice.totalAmount ?? 0,
    paidAmount: invoice.paidAmount ?? 0,
    leftAmount: invoice.leftAmount ?? 0,
    status: mapInvoiceStatus(invoice.status),
  };
}

export function mapActivityLogDtoToRecord(
  log: import('@/lib/api/activityLogs').ActivityLogDto,
): import('@/types').ActivityLogRecord {
  return {
    id: log.id,
    page: log.page,
    action: mapActivityAction(log.action),
    target: log.target,
    before: log.before ?? '—',
    after: log.after ?? '—',
    timestamp: log.timestamp,
  };
}

export function mapSalesDtoToRecord(
  sale: import('@/lib/api/billing').SalesRecordDto,
  index = 0,
): import('@/types').SalesInvoiceRecord {
  return {
    id: sale.invoiceId || `sale-${index}`,
    invoiceId: sale.invoiceId,
    invoiceDate: formatInvoiceDate(sale.invoiceDate),
    treatmentCategory: sale.treatmentCategory ?? '—',
    serviceType: sale.serviceType,
    totalAmount: sale.totalAmount ?? 0,
  };
}

export function mapScheduleAppointment(
  item?: import('@/lib/api/dashboard').ScheduleAppointmentDto | null,
  fallback?: import('@/types').ScheduleAppointment,
): import('@/types').ScheduleAppointment {
  if (!item?.patientName) {
    return (
      fallback ?? {
        patientName: '—',
        time: '—',
        reason: 'No appointment scheduled',
      }
    );
  }
  const service = item.serviceType?.replace(/_/g, ' ') ?? 'Consultation';
  return {
    patientName: item.patientName,
    time: item.slotTime?.slice(0, 5) ?? '—',
    reason: `${titleCase(service)} · ${item.bookingStatus ?? 'Scheduled'}`,
  };
}

export function buildDashboardStats(input: {
  patientCount?: number;
  appointmentStats?: import('@/lib/api/dashboard').AppointmentStatsDto | null;
  billingSummary?: import('@/lib/api/billing').BillingSummaryDto | null;
}): import('@/types').DashboardStats {
  const appt = input.appointmentStats;
  const billing = input.billingSummary;
  const totalPatients = input.patientCount ?? 0;

  return {
    totalPatients,
    patientGrowth: 0,
    patientsToday: appt?.todayAppointmentCount ?? 0,
    activePatients: Math.round(totalPatients * 0.2),
    inactivePatients: Math.max(0, totalPatients - Math.round(totalPatients * 0.2)),
    totalAppointments: appt?.currentMonthAppointmentCount ?? 0,
    appointmentGrowth: 0,
    appointmentsToday: appt?.todayAppointmentCount ?? 0,
    billingTotal: billing?.totalRevenue ?? 0,
    billsGenerated: billing?.totalBillsGenerated ?? 0,
    pendingPayments: billing?.pendingPayments ?? 0,
    collectedPayments: billing?.collectedPayments ?? 0,
  };
}
