import type { PatientDetail } from '@/types';
import type {
  DoctorBillingTabValues,
  DoctorMedicalTabValues,
  DoctorPersonalTabValues,
  DoctorTreatmentTabValues,
} from '@/lib/validation/doctorPatient.schema';

function parseAge(age: string): string {
  return age.replace(/\D/g, '') || age;
}

function parseDob(dob: string): string {
  const parts = dob.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dob;
}

export function mapPatientToPersonalForm(
  patient: PatientDetail,
): DoctorPersonalTabValues {
  const info = patient.personalInfo;
  return {
    fullName: patient.name,
    gender: info.gender,
    dateOfBirth: parseDob(info.dob),
    age: parseAge(info.age),
    preferredLanguage: 'English',
    consultationTypes: [info.serviceType],
    registrationDate: parseDob(info.registrationDate),
    appointmentTime: '10:00',
    assignedDoctor: info.assignedDoctor,
    mobileNumber: patient.phone.replace(/\D/g, '').slice(-10),
    email: info.email.includes('@') ? info.email : `${info.email}@gmail.com`,
    state: info.state,
    city: info.city,
    permanentAddress: info.address,
    emergencyName: info.emergencyName,
    emergencyRelation: info.emergencyRelation,
    emergencyPhone: info.emergencyPhone.replace(/\D/g, '').slice(-10),
    patientId: `${patient.id} | ${patient.secondaryId}`,
    idProofType: info.idProofType,
    idNumber: info.idProofNumber,
    occupation: info.occupation,
    insuranceDetails: info.insuranceDetails === 'N/A' ? '' : info.insuranceDetails,
  };
}

export function mapPatientToMedicalForm(
  patient: PatientDetail,
): DoctorMedicalTabValues {
  const m = patient.medicalAssessment;
  return {
    doshaType: patient.dosha,
    bodyConstitution: m.bodyConstitution.split(',').map((s) => s.trim()),
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
  return {
    treatmentPlanName: t.treatmentName,
    startDate: parseDob(t.startDate),
    endDate: parseDob(t.endDate),
    totalSessions: String(t.totalSessions),
    completedSessions: String(t.sessionsCompleted),
    remainingSessions: String(t.remainingSessions),
    assignedTherapist: t.assignedTherapist,
    setupRequired: 'Yes',
    followUpScheduling: 'Monthly',
    assignedDoctor: t.followUpDoctor,
    autoSmsReminder: t.reminder.includes('Enabled'),
  };
}

export function mapPatientToBillingForm(
  patient: PatientDetail,
): DoctorBillingTabValues {
  const b = patient.billing;
  return {
    packageName: b.packageName,
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
      serviceType: values.consultationTypes[0] ?? patient.personalInfo.serviceType,
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
      currentImbalance: values.currentImbalance,
      previousPanchakarma: values.previousPanchakarma ?? '',
      weight: values.weight,
      height: values.height,
      ibw: values.ibw,
      pulse: values.pulse,
      bp: values.bp,
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
): PatientDetail {
  return {
    ...patient,
    treatmentFollowUp: {
      ...patient.treatmentFollowUp,
      treatmentName: values.treatmentPlanName,
      startDate: values.startDate,
      endDate: values.endDate,
      totalSessions: Number(values.totalSessions),
      sessionsCompleted: Number(values.completedSessions),
      remainingSessions: Number(values.remainingSessions),
      assignedTherapist: values.assignedTherapist,
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
      packageName: values.packageName,
      validity: values.validity,
      membershipStatus: values.membershipStatus as PatientDetail['billing']['membershipStatus'],
      discountApplied: Number(values.discountApplied),
      registrationFees: Number(values.registrationFees),
      paymentMode: values.paymentMode,
      partialPayment: values.partialPayment,
      outstandingAmount: Number(values.outstandingAmount),
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
