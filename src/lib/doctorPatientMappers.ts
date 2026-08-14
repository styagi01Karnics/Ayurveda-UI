import type { PatientDetail } from '@/types';
import {
  computeRemainingSessions,
  type DoctorBillingTabValues,
  type DoctorMedicalTabValues,
  type DoctorPersonalTabValues,
  type DoctorTreatmentTabValues,
} from '@/lib/validation/doctorPatient.schema';

function asString(value: string | null | undefined, fallback = ''): string {
  return value ?? fallback;
}

function parseAge(age: string | null | undefined): string {
  const raw = asString(age);
  return raw.replace(/\D/g, '') || raw;
}

function parseDob(dob: string | null | undefined): string {
  const raw = asString(dob);
  if (!raw) return '';
  const parts = raw.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return raw;
}

function normalizeEmail(email: string | null | undefined): string {
  const raw = asString(email);
  if (!raw) return '';
  return raw.includes('@') ? raw : `${raw}@gmail.com`;
}

function phoneDigits(value: string | null | undefined): string {
  return asString(value).replace(/\D/g, '').slice(-10);
}

export function mapPatientToPersonalForm(
  patient: PatientDetail,
): DoctorPersonalTabValues {
  const info = patient.personalInfo;
  return {
    fullName: patient.name,
    gender: asString(info.gender),
    dateOfBirth: parseDob(info.dob),
    age: parseAge(info.age),
    preferredLanguage: 'English',
    consultationTypeIds: [],
    registrationDate: parseDob(info.registrationDate),
    appointmentTime: '10:00',
    assignedDoctor: asString(info.assignedDoctor),
    mobileNumber: phoneDigits(patient.phone),
    email: normalizeEmail(info.email),
    state: asString(info.state),
    city: asString(info.city),
    permanentAddress: asString(info.address),
    emergencyName: asString(info.emergencyName),
    emergencyRelation: asString(info.emergencyRelation),
    emergencyPhone: phoneDigits(info.emergencyPhone),
    patientId: `${patient.id} | ${patient.secondaryId}`,
    idProofType: asString(info.idProofType),
    idNumber: asString(info.idProofNumber),
    occupation: asString(info.occupation),
    insuranceDetails:
      asString(info.insuranceDetails) === 'N/A' ? '' : asString(info.insuranceDetails),
  };
}

export function mapPatientToMedicalForm(
  patient: PatientDetail,
): DoctorMedicalTabValues {
  const m = patient.medicalAssessment;
  return {
    doshaType: patient.dosha,
    bodyConstitution: asString(m.bodyConstitution)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    currentImbalance: m.currentImbalance,
    previousPanchakarma: m.previousPanchakarma,
    weight: m.weight,
    height: m.height,
    ibw: m.ibw,
    pulse: m.pulse,
    bp: m.bp,
    temperature: m.temperature,
    pallor: m.pallor,
    icterus: m.icterus,
    cyanosis: m.cyanosis,
    lymphNodes: m.lymphNodes,
    oedema: m.oedema,
    sensorium: m.sensorium,
    acidityGas: m.acidityGas,
    motion: m.motion,
    micturition: m.micturition,
    presentConditions: m.presentConditions,
    pastConditions: m.pastConditions,
    pastSurgeries: m.pastSurgeries,
    currentMedications: m.currentMedication,
    allergies: m.allergies ? [m.allergies] : [],
    familyHistory: m.familyHistory,
    dietType: m.diet,
    sleepPattern: m.sleep,
    exerciseHabits: m.exercise,
    addictions: '',
    cardiovascular: '',
    respiratory: '',
    nervous: '',
    abdomenGi: '',
    locomotor: '',
    investigationPlan: '',
    planDetails: '',
  };
}

export function mapPatientToTreatmentForm(
  patient: PatientDetail,
): DoctorTreatmentTabValues {
  const t = patient.treatmentFollowUp;
  const totalSessions = String(t.totalSessions);
  const completedSessions = String(t.sessionsCompleted);
  return {
    treatmentPlanId: t.treatmentPlanId ?? '',
    startDate: parseDob(t.startDate),
    endDate: parseDob(t.endDate),
    totalSessions,
    completedSessions,
    remainingSessions: computeRemainingSessions(totalSessions, completedSessions),
    assignedTherapistId: t.assignedTherapistId ?? '',
    setupRequired: 'Yes',
    followUpScheduling: 'Monthly',
    assignedDoctor: t.followUpDoctor,
    autoSmsReminder: asString(t.reminder).includes('Enabled'),
  };
}

export function mapPatientToBillingForm(
  patient: PatientDetail,
): DoctorBillingTabValues {
  const b = patient.billing;
  return {
    packageMasterId: '',
    validity: parseDob(b.validity),
    membershipStatus: b.membershipStatus,
    discountApplied: String(b.discountApplied),
    registrationFees: String(b.registrationFees),
    paymentMode: b.paymentMode,
    partialPayment: b.partialPayment,
    outstandingAmount: String(b.outstandingAmount),
    serviceType: b.serviceType,
    serviceFees: String(b.serviceFees),
    packageType: b.packageType,
    packageCharges: String(b.packageCharges),
    discount: String(b.discount),
    applyTax: true,
    cgst: '3',
    sgst: '3',
  };
}

export function applyPersonalFormToPatient(
  patient: PatientDetail,
  values: DoctorPersonalTabValues,
): PatientDetail {
  return {
    ...patient,
    name: values.fullName,
    phone: `+91-${values.mobileNumber}`,
    doctor: values.assignedDoctor,
    personalInfo: {
      ...patient.personalInfo,
      gender: values.gender,
      age: `${values.age}yrs`,
      dob: values.dateOfBirth,
      serviceType: patient.personalInfo.serviceType,
      registrationDate: values.registrationDate,
      assignedDoctor: values.assignedDoctor,
      email: values.email,
      state: values.state,
      city: values.city,
      address: values.permanentAddress,
      emergencyName: values.emergencyName,
      emergencyRelation: values.emergencyRelation,
      emergencyPhone: values.emergencyPhone,
      idProofType: values.idProofType,
      idProofNumber: values.idNumber,
      occupation: values.occupation,
      insuranceDetails: values.insuranceDetails || 'N/A',
    },
  };
}

export function applyMedicalFormToPatient(
  patient: PatientDetail,
  values: DoctorMedicalTabValues,
): PatientDetail {
  return {
    ...patient,
    dosha: values.doshaType as PatientDetail['dosha'],
    medicalAssessment: {
      ...patient.medicalAssessment,
      bodyConstitution: values.bodyConstitution.join(', '),
      currentImbalance: values.currentImbalance ?? '',
      previousPanchakarma: values.previousPanchakarma ?? '',
      weight: values.weight ?? '',
      height: values.height ?? '',
      ibw: values.ibw ?? '',
      pulse: values.pulse ?? '',
      bp: values.bp ?? '',
      temperature: values.temperature ?? '',
      pallor: values.pallor ?? '',
      icterus: values.icterus ?? '',
      cyanosis: values.cyanosis ?? '',
      lymphNodes: values.lymphNodes ?? '',
      oedema: values.oedema ?? '',
      sensorium: values.sensorium ?? '',
      acidityGas: values.acidityGas ?? '',
      motion: values.motion ?? '',
      micturition: values.micturition ?? '',
      presentConditions: values.presentConditions ?? '',
      pastConditions: values.pastConditions ?? '',
      pastSurgeries: values.pastSurgeries ?? '',
      currentMedication: values.currentMedications ?? '',
      allergies: values.allergies?.join(', ') ?? '',
      familyHistory: values.familyHistory ?? '',
      diet: values.dietType ?? '',
      sleep: values.sleepPattern ?? '',
      exercise: values.exerciseHabits ?? '',
    },
  };
}

export function applyTreatmentFormToPatient(
  patient: PatientDetail,
  values: DoctorTreatmentTabValues,
  therapists: { value: string; label: string }[] = [],
): PatientDetail {
  const therapistName =
    therapists.find((therapist) => therapist.value === values.assignedTherapistId)
      ?.label ?? patient.treatmentFollowUp.assignedTherapist;

  return {
    ...patient,
    treatmentFollowUp: {
      ...patient.treatmentFollowUp,
      treatmentName: values.treatmentPlanId,
      startDate: values.startDate,
      endDate: values.endDate,
      totalSessions: Number(values.totalSessions),
      sessionsCompleted: Number(values.completedSessions),
      remainingSessions: Number(
        values.remainingSessions ||
          computeRemainingSessions(values.totalSessions, values.completedSessions),
      ),
      assignedTherapistId: values.assignedTherapistId,
      assignedTherapist: therapistName,
      followUpDoctor: values.assignedDoctor,
      reminder: values.autoSmsReminder ? 'Auto SMS Enabled' : 'Auto SMS Disabled',
    },
  };
}

export function applyBillingFormToPatient(
  patient: PatientDetail,
  values: DoctorBillingTabValues,
): PatientDetail {
  return {
    ...patient,
    billing: {
      ...patient.billing,
      packageName: values.packageMasterId,
      validity: values.validity,
      membershipStatus: values.membershipStatus as PatientDetail['billing']['membershipStatus'],
      discountApplied: Number(values.discountApplied),
      registrationFees: values.registrationFees
        ? Number(values.registrationFees)
        : patient.billing.registrationFees,
      paymentMode: values.paymentMode ?? patient.billing.paymentMode,
      partialPayment: values.partialPayment ?? patient.billing.partialPayment,
      outstandingAmount: values.outstandingAmount
        ? Number(values.outstandingAmount)
        : patient.billing.outstandingAmount,
      serviceType: values.serviceType,
      serviceFees: Number(values.serviceFees),
      packageType: values.packageType,
      packageCharges: Number(values.packageCharges),
      discount: Number(values.discount),
      taxRate: values.applyTax
        ? `${values.cgst ?? '3'}%`
        : patient.billing.taxRate,
    },
  };
}
