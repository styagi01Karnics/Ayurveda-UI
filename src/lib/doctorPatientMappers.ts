import type { PatientDetail } from '@/types';

import {

  computeRemainingSessions,

  type DoctorBillingTabValues,

  type DoctorMedicalTabValues,

  type DoctorPersonalTabValues,

  type DoctorTreatmentTabValues,

} from '@/lib/validation/doctorPatient.schema';



/** Strip display placeholders so edit forms start empty instead of showing em dashes. */

export function sanitizeFormField(value: string | null | undefined): string {

  if (value == null) return '';

  const trimmed = value.trim();

  if (

    trimmed === '' ||

    trimmed === '—' ||

    trimmed === '-' ||

    trimmed.toLowerCase() === 'n/a' ||

    trimmed.toLowerCase() === 'none'

  ) {

    return '';

  }

  return value;

}



function parseAge(age: string | null | undefined): string {

  const raw = sanitizeFormField(age);

  return raw.replace(/\D/g, '') || raw;

}



function toIsoDate(value: string | null | undefined): string {

  const raw = sanitizeFormField(value);

  if (!raw) return '';



  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;



  if (raw.includes('T')) {

    return raw.slice(0, 10);

  }



  const parsed = new Date(raw);

  if (!Number.isNaN(parsed.getTime())) {

    return parsed.toISOString().slice(0, 10);

  }



  const parts = raw.split('/');

  if (parts.length === 3) {

    const [day, month, year] = parts;

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  }



  return '';

}



function normalizeEmail(email: string | null | undefined): string {

  const raw = sanitizeFormField(email);

  if (!raw) return '';

  return raw.includes('@') ? raw : `${raw}@gmail.com`;

}



function phoneDigits(value: string | null | undefined): string {

  return sanitizeFormField(value).replace(/\D/g, '').slice(-10);

}



export function mapPatientToPersonalForm(

  patient: PatientDetail,

): DoctorPersonalTabValues {

  const info = patient.personalInfo;

  return {

    fullName: sanitizeFormField(patient.name),

    gender: sanitizeFormField(info.gender),

    dateOfBirth: toIsoDate(info.dob),

    age: parseAge(info.age),

    preferredLanguage: 'English',

    consultationTypeIds: patient.consultationTypeIds ?? [],

    registrationDate: toIsoDate(info.registrationDate),

    appointmentTime: '10:00',

    assignedDoctor: sanitizeFormField(info.assignedDoctor),

    mobileNumber: phoneDigits(patient.phone),

    email: normalizeEmail(info.email),

    state: sanitizeFormField(info.state),

    city: sanitizeFormField(info.city),

    permanentAddress: sanitizeFormField(info.address),

    emergencyName: sanitizeFormField(info.emergencyName),

    emergencyRelation: sanitizeFormField(info.emergencyRelation),

    emergencyPhone: phoneDigits(info.emergencyPhone),

    patientId: patient.id,

    idProofType: sanitizeFormField(info.idProofType),

    idNumber: sanitizeFormField(info.idProofNumber),

    occupation: sanitizeFormField(info.occupation),

    insuranceDetails: sanitizeFormField(info.insuranceDetails),

  };

}



export function mapPatientToMedicalForm(

  patient: PatientDetail,

): DoctorMedicalTabValues {

  const m = patient.medicalAssessment;

  return {

    doshaType: sanitizeFormField(patient.dosha) || patient.dosha,

    bodyConstitution: sanitizeFormField(m.bodyConstitution)

      .split(',')

      .map((s) => s.trim())

      .filter(Boolean),

    currentImbalance: sanitizeFormField(m.currentImbalance),

    previousPanchakarma: sanitizeFormField(m.previousPanchakarma),

    weight: sanitizeFormField(m.weight),

    height: sanitizeFormField(m.height),

    ibw: sanitizeFormField(m.ibw),

    pulse: sanitizeFormField(m.pulse),

    bp: sanitizeFormField(m.bp),

    temperature: sanitizeFormField(m.temperature),

    pallor: sanitizeFormField(m.pallor),

    icterus: sanitizeFormField(m.icterus),

    cyanosis: sanitizeFormField(m.cyanosis),

    lymphNodes: sanitizeFormField(m.lymphNodes),

    oedema: sanitizeFormField(m.oedema),

    sensorium: sanitizeFormField(m.sensorium),

    acidityGas: sanitizeFormField(m.acidityGas),

    motion: sanitizeFormField(m.motion),

    micturition: sanitizeFormField(m.micturition),

    presentConditions: sanitizeFormField(m.presentConditions),

    pastConditions: sanitizeFormField(m.pastConditions),

    pastSurgeries: sanitizeFormField(m.pastSurgeries),

    currentMedications: sanitizeFormField(m.currentMedication),

    allergies: sanitizeFormField(m.allergies) ? [sanitizeFormField(m.allergies)] : [],

    familyHistory: sanitizeFormField(m.familyHistory),

    dietType: sanitizeFormField(m.diet),

    sleepPattern: sanitizeFormField(m.sleep),

    exerciseHabits: sanitizeFormField(m.exercise),

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

  const totalSessions = sanitizeFormField(String(t.totalSessions)) || '0';

  const completedSessions = sanitizeFormField(String(t.sessionsCompleted)) || '0';

  return {

    treatmentPlanId: t.treatmentPlanId ?? '',

    startDate: toIsoDate(t.startDate),

    endDate: toIsoDate(t.endDate),

    totalSessions,

    completedSessions,

    remainingSessions: computeRemainingSessions(totalSessions, completedSessions),

    assignedTherapistId: t.assignedTherapistId ?? '',

    setupRequired: 'Yes',

    followUpScheduling: 'Monthly',

    assignedDoctor: sanitizeFormField(t.followUpDoctor),

    autoSmsReminder: sanitizeFormField(t.reminder).includes('Enabled'),

  };

}



export function mapPatientToBillingForm(

  patient: PatientDetail,

): DoctorBillingTabValues {

  const b = patient.billing;

  return {

    packageMasterId: '',

    validity: toIsoDate(b.validity),

    membershipStatus: b.membershipStatus,

    discountApplied: sanitizeFormField(String(b.discountApplied)),

    registrationFees: sanitizeFormField(String(b.registrationFees)),

    paymentMode: sanitizeFormField(b.paymentMode),

    partialPayment: sanitizeFormField(b.partialPayment),

    outstandingAmount: sanitizeFormField(String(b.outstandingAmount)),

    billingServices: [
      {
        serviceType: sanitizeFormField(b.serviceType),
        serviceFees: sanitizeFormField(String(b.serviceFees)),
        packageType: sanitizeFormField(b.packageType),
        packageCharges: sanitizeFormField(String(b.packageCharges)),
        discount: sanitizeFormField(String(b.discount)),
      },
    ],

    applyTax: b.taxRate === '0%' || b.taxRate === '0'
      ? false
      : true,
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

    consultationTypeIds: values.consultationTypeIds,

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

      serviceType: values.billingServices[0]?.serviceType ?? patient.billing.serviceType,

      serviceFees: values.billingServices[0]?.serviceFees
        ? Number(values.billingServices[0].serviceFees)
        : patient.billing.serviceFees,

      packageType:
        values.billingServices[0]?.packageType?.trim()
          ? values.billingServices[0].packageType
          : patient.billing.packageType,

      packageCharges:
        values.billingServices[0]?.packageType?.trim() &&
        values.billingServices[0]?.packageCharges
          ? Number(values.billingServices[0].packageCharges)
          : values.billingServices[0]?.packageType?.trim()
            ? 0
            : patient.billing.packageCharges,

      discount: values.billingServices[0]?.discount
        ? Number(values.billingServices[0].discount)
        : patient.billing.discount,

      taxRate: values.applyTax
        ? `${values.cgst ?? '3'}%`
        : patient.billing.taxRate,

    },

  };

}


