import { beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { mockPatientDtos } from './fixtures';
import { initialAppointments, initialFollowUps } from '@/data/mock/appointments';
import { initialTreatments } from '@/data/mock/treatments';
import {
  initialClinicDoctors,
  initialClinicTherapists,
  initialClinicTherapies,
} from '@/data/mock/settings';
import { initialMedicines } from '@/data/mock/medicines';
import { initialDoctorSchedule } from '@/data/mock/doctors';

vi.mock('@/lib/api/patients', () => ({
  getAllPatients: vi.fn(async () => mockPatientDtos()),
  getPatientById: vi.fn(async (id: string) => {
    const found = mockPatientDtos().find((p) => p.id === id);
    if (!found) throw new Error('Patient not found');
    return found;
  }),
  getPatientCount: vi.fn(async () => ({
    totalPatients: 1000,
    activePatients: 200,
    inactivePatients: 800,
  })),
  createPatient: vi.fn(async (payload: { fullName: string }) => ({
    id: 'new-patient-id',
    patientCode: 'PAT-TEST-0001',
    ...payload,
    active: true,
  })),
  deletePatient: vi.fn(async () => undefined),
}));

vi.mock('@/lib/api/doctors', () => ({
  getAllDoctors: vi.fn(async () =>
    initialClinicDoctors.map((d) => ({
      id: d.id,
      name: d.name,
      doctorName: d.name,
      doctorCode: d.id,
      specialization: d.specialization,
      status: d.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
      consultationFees: d.consultationFees,
      followUpFees: d.followUpFees,
      availability: d.availability,
      active: d.status === 'Active',
    })),
  ),
  getActiveDoctors: vi.fn(async () =>
    initialClinicDoctors
      .filter((d) => d.status === 'Active')
      .map((d) => ({
        id: d.id,
        name: d.name,
        doctorName: d.name,
        doctorCode: d.id,
        specialization: d.specialization,
        status: 'ACTIVE',
        consultationFees: d.consultationFees,
        followUpFees: d.followUpFees,
        availability: d.availability,
        active: true,
      })),
  ),
  getDoctorById: vi.fn(),
  createDoctor: vi.fn(async (payload: { name?: string; doctorName?: string }) => ({
    id: `doc-${Date.now()}`,
    doctorCode: 'DOC-TEST',
    ...payload,
    status: 'ACTIVE',
    active: true,
  })),
  deleteDoctor: vi.fn(async () => undefined),
  updateDoctorStatus: vi.fn(async () => ({ id: 'doc-1', status: 'INACTIVE' })),
}));

vi.mock('@/lib/api/therapists', () => ({
  getAllTherapists: vi.fn(async () =>
    initialClinicTherapists.map((t) => ({
      id: t.id,
      name: t.name,
      therapistName: t.name,
      therapistCode: t.id,
      assignedTherapyIds: ['therapy-1'],
      status: t.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
      active: t.status === 'Active',
    })),
  ),
  getActiveTherapists: vi.fn(async () =>
    initialClinicTherapists
      .filter((t) => t.status === 'Active')
      .map((t) => ({
        id: t.id,
        name: t.name,
        therapistName: t.name,
        therapistCode: t.id,
        assignedTherapyIds: ['therapy-1'],
        status: 'ACTIVE',
        active: true,
      })),
  ),
  isTherapistActive: (therapist: { active?: boolean; status?: string }) =>
    therapist.active !== false &&
    (therapist.status ?? 'ACTIVE').toUpperCase() === 'ACTIVE',
  mapTherapistSelectOptions: (
    therapists: Array<{
      id: string;
      name?: string;
      therapistName?: string;
      active?: boolean;
      status?: string;
    }>,
  ) =>
    therapists
      .filter(
        (therapist) =>
          therapist.active !== false &&
          (therapist.status ?? 'ACTIVE').toUpperCase() === 'ACTIVE',
      )
      .map((therapist) => ({
        value: therapist.id,
        label: therapist.name || therapist.therapistName || '—',
      })),
  filterTherapistsByTherapyIds: (
    therapists: unknown[],
  ) => therapists,
  getTherapistById: vi.fn(),
  createTherapist: vi.fn(async (payload: { name?: string; therapistName?: string }) => ({
    id: `therapist-${Date.now()}`,
    therapistCode: 'THP-TEST',
    ...payload,
    status: 'ACTIVE',
    active: true,
  })),
  updateTherapist: vi.fn(async (id: string, payload: object) => ({
    id,
    ...payload,
  })),
  deleteTherapist: vi.fn(async () => undefined),
  getTherapistsByTherapyIds: vi.fn(async () =>
    initialClinicTherapists.map((t) => ({
      id: t.id,
      name: t.name,
      therapistName: t.name,
      therapistCode: t.id,
      assignedTherapyIds: ['therapy-1'],
      status: t.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
      active: t.status === 'Active',
    })),
  ),
  updateTherapistStatus: vi.fn(async () => ({ id: 'th-1', status: 'INACTIVE' })),
}));

vi.mock('@/lib/api/appointments', () => ({
  getAllTreatmentCategories: vi.fn(async () => [
    {
      id: 'cat-1',
      categoryCode: 'CAT1',
      categoryName: 'Panchakarma',
      description: 'Detox',
      active: true,
    },
  ]),
  getTreatmentCategoryById: vi.fn(),
  createTreatmentCategory: vi.fn(async (payload: { categoryName: string }) => ({
    id: `cat-${Date.now()}`,
    categoryCode: null,
    ...payload,
  })),
  getAllTherapies: vi.fn(async () =>
    initialClinicTherapies.map((t) => ({
      id: t.id,
      categoryId: 'cat-1',
      therapyCode: t.id,
      name: t.name,
      therapyName: t.name,
      description: t.name,
      durationMinutes: 45,
      price: t.price,
      status: 'ACTIVE',
      active: true,
    })),
  ),
  createTherapy: vi.fn(async (payload: { name?: string; therapyName?: string }) => ({
    id: `therapy-${Date.now()}`,
    therapyCode: 'TH001',
    categoryId: 'cat-1',
    name: payload.name ?? payload.therapyName,
    therapyName: payload.therapyName ?? payload.name,
    status: 'ACTIVE',
    active: true,
  })),
  deleteTherapy: vi.fn(async () => undefined),
  updateTherapyStatus: vi.fn(async () => ({ id: 'therapy-1', status: 'INACTIVE' })),
  getTherapiesByCategory: vi.fn(async () =>
    initialClinicTherapies.map((t) => ({
      id: t.id,
      categoryId: 'cat-1',
      therapyCode: t.id,
      name: t.name,
      therapyName: t.name,
      description: t.description,
      durationMinutes: 45,
      price: t.price,
      status: 'ACTIVE',
      active: true,
    })),
  ),
  getAppointmentPatients: vi.fn(async (query: { statusTab?: string; search?: string }) => {
    const activeRows = [
      {
        bookingId: 'ap-1',
        patientId: '37944397',
        patientDisplayId: 'PT458652',
        patientFullName: 'Khushi Shroff',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['CONSULTATION'],
        appointmentDate: '2026-10-15',
        slotTime: '10:00:00',
        bookingStatus: 'SCHEDULED',
      },
      {
        bookingId: 'ap-2',
        patientId: 'patient-2',
        patientDisplayId: 'PT458653',
        patientFullName: 'Amit Verma',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['CONSULTATION'],
        appointmentDate: '2026-10-16',
        slotTime: '11:00:00',
        bookingStatus: 'SCHEDULED',
      },
    ];
    const inactiveRows = [
      {
        bookingId: 'ap-3',
        patientId: 'patient-3',
        patientDisplayId: 'PT458654',
        patientFullName: 'Priya Nair',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['THERAPY'],
        appointmentDate: '2026-09-01',
        slotTime: '09:00:00',
        bookingStatus: 'COMPLETED',
      },
    ];
    let rows = query.statusTab === 'INACTIVE' ? inactiveRows : activeRows;
    if (query.search) {
      const q = query.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.patientFullName.toLowerCase().includes(q) ||
          r.patientDisplayId?.toLowerCase().includes(q),
      );
    }
    return rows;
  }),
  getAppointmentsByStatus: vi.fn(async () => [
    {
      id: 'ap-1',
      patientId: '37944397',
      patient: {
        id: '37944397',
        patientDisplayId: 'PT458652',
        patientCode: 'PT458652',
        fullName: 'Khushi Shroff',
        gender: 'Female',
        dateOfBirth: '2003-01-01',
        age: 23,
        preferredLanguage: 'English',
        email: 'khushi@example.com',
        mobileNumber: '9876543210',
        state: 'Maharashtra',
        city: 'Mumbai',
        address: 'Mumbai',
        emergencyContactName: 'Contact',
        emergencyRelationship: 'Parent',
        emergencyPhoneNumber: '9876543211',
        idProofType: 'AADHAAR',
        idProofNumber: '1234',
        occupation: 'Student',
        active: true,
      },
      registrationDate: '2026-10-15',
      slotTime: '10:00:00',
      assignedDoctorId: 'doc-1',
      assignedDoctor: {
        id: 'doc-1',
        name: 'Dr. Sheekha',
        doctorName: 'Dr. Sheekha',
      },
      consultationTypes: ['CONSULTATION'],
      bookingStatus: 'SCHEDULED',
    },
    {
      id: 'ap-2',
      patientId: 'patient-2',
      patient: {
        id: 'patient-2',
        patientDisplayId: 'PT458653',
        patientCode: 'PT458653',
        fullName: 'Amit Verma',
        gender: 'Male',
        dateOfBirth: '1990-01-01',
        age: 36,
        preferredLanguage: 'English',
        email: 'amit@example.com',
        mobileNumber: '9876543212',
        state: 'Maharashtra',
        city: 'Mumbai',
        address: 'Mumbai',
        emergencyContactName: 'Contact',
        emergencyRelationship: 'Parent',
        emergencyPhoneNumber: '9876543213',
        idProofType: 'AADHAAR',
        idProofNumber: '5678',
        occupation: 'Employed',
        active: true,
      },
      registrationDate: '2026-10-16',
      slotTime: '11:00:00',
      assignedDoctorId: 'doc-1',
      assignedDoctor: {
        id: 'doc-1',
        name: 'Dr. Sheekha',
        doctorName: 'Dr. Sheekha',
      },
      consultationTypes: ['CONSULTATION'],
      bookingStatus: 'SCHEDULED',
    },
    {
      id: 'ap-3',
      patientId: 'patient-3',
      patient: {
        id: 'patient-3',
        patientDisplayId: 'PT458654',
        patientCode: 'PT458654',
        fullName: 'Priya Nair',
        gender: 'Female',
        dateOfBirth: '1992-01-01',
        age: 34,
        preferredLanguage: 'English',
        email: 'priya@example.com',
        mobileNumber: '9876543214',
        state: 'Maharashtra',
        city: 'Mumbai',
        address: 'Mumbai',
        emergencyContactName: 'Contact',
        emergencyRelationship: 'Parent',
        emergencyPhoneNumber: '9876543215',
        idProofType: 'AADHAAR',
        idProofNumber: '9012',
        occupation: 'Employed',
        active: true,
      },
      registrationDate: '2026-09-01',
      slotTime: '09:00:00',
      assignedDoctorId: 'doc-1',
      assignedDoctor: {
        id: 'doc-1',
        name: 'Dr. Sheekha',
        doctorName: 'Dr. Sheekha',
      },
      consultationTypes: ['THERAPY'],
      bookingStatus: 'COMPLETED',
    },
    {
      id: 'ap-4',
      patientId: '37944397',
      patient: {
        id: '37944397',
        patientDisplayId: 'PT458655',
        patientCode: 'PT458655',
        fullName: 'Khushi Shroff',
        gender: 'Female',
        dateOfBirth: '2003-01-01',
        age: 23,
        preferredLanguage: 'English',
        email: 'khushi@example.com',
        mobileNumber: '9876543210',
        state: 'Maharashtra',
        city: 'Mumbai',
        address: 'Mumbai',
        emergencyContactName: 'Contact',
        emergencyRelationship: 'Parent',
        emergencyPhoneNumber: '9876543211',
        idProofType: 'AADHAAR',
        idProofNumber: '1234',
        occupation: 'Student',
        active: true,
      },
      registrationDate: '2026-08-05',
      slotTime: '10:30:00',
      assignedDoctorId: 'doc-1',
      assignedDoctor: {
        id: 'doc-1',
        name: 'Dr. Sheekha',
        doctorName: 'Dr. Sheekha',
      },
      consultationTypes: ['CONSULTATION'],
      bookingStatus: 'CANCELLED',
    },
  ]),
  getAllAppointmentPatients: vi.fn(async (filters: { search?: string } = {}) => {
    const activeRows = [
      {
        bookingId: 'ap-1',
        patientId: '37944397',
        patientDisplayId: 'PT458652',
        patientFullName: 'Khushi Shroff',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['CONSULTATION'],
        appointmentDate: '2026-10-15',
        slotTime: '10:00:00',
        bookingStatus: 'SCHEDULED',
      },
      {
        bookingId: 'ap-2',
        patientId: 'patient-2',
        patientDisplayId: 'PT458653',
        patientFullName: 'Amit Verma',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['CONSULTATION'],
        appointmentDate: '2026-10-16',
        slotTime: '11:00:00',
        bookingStatus: 'SCHEDULED',
      },
    ];
    const inactiveRows = [
      {
        bookingId: 'ap-3',
        patientId: 'patient-3',
        patientDisplayId: 'PT458654',
        patientFullName: 'Priya Nair',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['THERAPY'],
        appointmentDate: '2026-09-01',
        slotTime: '09:00:00',
        bookingStatus: 'COMPLETED',
      },
      {
        bookingId: 'ap-4',
        patientId: '37944397',
        patientDisplayId: 'PT458655',
        patientFullName: 'Khushi Shroff',
        assignedDoctorId: 'doc-1',
        doctorName: 'Dr. Sheekha',
        consultationTypes: ['CONSULTATION'],
        appointmentDate: '2026-08-05',
        slotTime: '10:30:00',
        bookingStatus: 'CANCELLED',
      },
    ];
    let rows = [...activeRows, ...inactiveRows];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.patientFullName.toLowerCase().includes(q) ||
          r.patientDisplayId?.toLowerCase().includes(q),
      );
    }
    return rows;
  }),
  cancelAppointment: vi.fn(async () => ({ id: 'ap-cancelled', bookingStatus: 'CANCELLED' })),
  rescheduleAppointment: vi.fn(async () => ({
    id: 'ap-rescheduled',
    bookingStatus: 'RESCHEDULED',
  })),
  markAppointmentInConsultation: vi.fn(async () => ({
    id: 'ds-1',
    bookingStatus: 'IN_CONSULTATION',
    patientId: '37944397',
  })),
  getAppointmentStats: vi.fn(async () => ({
    totalAppointments: 30,
    scheduledCount: 10,
    completedCount: 20,
    inConsultationCount: 3,
    rescheduledCount: 4,
  })),
  getTodayAppointments: vi.fn(async () => ({
    date: '2026-08-04',
    totalAppointments: initialDoctorSchedule.length,
    appointments: initialDoctorSchedule.map((item) => ({
      bookingId: item.id,
      patientId: item.patientDetailId,
      patientName: item.patient,
      slotTime: '09:30:00',
      bookingStatus: item.status === 'Completed' ? 'COMPLETED' : 'SCHEDULED',
      consultationTypes: [item.visitType.toUpperCase()],
    })),
  })),
  getAppointmentsByPatientId: vi.fn(async () =>
    initialAppointments.map((a) => ({
      id: a.id,
      patientId: '37944397',
      patientName: a.patient,
      doctorName: a.doctor,
      consultationTypes: [a.visitType.toUpperCase()],
      registrationDate: a.dateCreated,
      status: a.status,
      createdAt: `${a.dateCreated}T00:00:00`,
    })),
  ),
  getAppointmentById: vi.fn(),
  createAppointment: vi.fn(async () => ({
    id: 'ap-new',
    patientId: '37944397',
    status: 'Scheduled',
  })),
  getAppointmentTherapiesByPatientId: vi.fn(async () =>
    initialTreatments.map((t) => ({
      id: t.id,
      patientId: t.patientDetailId,
      patientName: t.patient,
      treatmentCategoryName: t.treatmentCategory,
      therapistName: t.assignedTherapist,
      scheduleDate: t.dateCreated,
      scheduleTime: '10:00:00',
      sessionFrequency: t.totalSessions,
      status: t.status,
      therapyNames: [t.therapyType],
      createdAt: `${t.dateCreated}T00:00:00`,
    })),
  ),
  createAppointmentTherapy: vi.fn(async () => ({ id: 'therapy-appt-1' })),
  getAllDoshas: vi.fn(async () => []),
  getBookingDoshas: vi.fn(async () => [
    { id: 'dosha-1', name: 'Vata', elements: '', characteristics: '', status: 'ACTIVE' },
    { id: 'dosha-2', name: 'Pitta', elements: '', characteristics: '', status: 'ACTIVE' },
    { id: 'dosha-3', name: 'Kapha', elements: '', characteristics: '', status: 'ACTIVE' },
  ]),
  ensureBookingDoshas: vi.fn(async () => [
    { id: 'dosha-1', name: 'Vata', elements: '', characteristics: '', status: 'ACTIVE' },
    { id: 'dosha-2', name: 'Pitta', elements: '', characteristics: '', status: 'ACTIVE' },
    { id: 'dosha-3', name: 'Kapha', elements: '', characteristics: '', status: 'ACTIVE' },
  ]),
  getDoshaById: vi.fn(),
  createDosha: vi.fn(),
  createMedicalAssessment: vi.fn(async () => ({ patientId: '37944397' })),
  createMedicalAssessmentWithDocuments: vi.fn(async () => ({
    patientId: '37944397',
    documents: [],
  })),
  getMedicalAssessmentByPatientId: vi.fn(async () => ({
    patientId: '37944397',
    ayurvedicAssessment: {
      bodyConstitution: 'Lean, Dry Skin',
      currentImbalances: 'Joint stiffness, Back pain',
      dosha: { id: 'dosha-1', name: 'Vata' },
    },
    physicalExamination: {
      weight: 68,
      height: 172,
      ibw: 65,
      pulse: 76,
      bp: '120/80',
      temperature: 98.6,
      pallor: 'Absent',
      acidityGas: 'Mild',
      oedema: 'Absent',
      sensorium: 'Alert',
      icterus: 'Absent',
      cyanosis: 'Absent',
      motion: 'Normal',
      micturition: 'Normal',
      lymphNodes: 'NAD',
    },
    medicalHistory: {
      pastMedicalConditions: 'None',
      pastSurgeries: 'None',
      currentMedications: 'None',
      allergies: 'None',
      familyHistory: 'None',
    },
    lifestyleInformation: {
      dietType: 'Vegetarian',
      sleepPattern: '6-7 hours',
      exerciseHabits: 'Walking',
      addiction: 'None',
    },
    systemicExamination: {
      cardiovascular: 'NAD',
      respiratory: 'NAD',
      nervous: 'NAD',
      abdomenGi: 'Soft',
      locomotor: 'NAD',
    },
    treatmentPlan: {
      investigationAndPlanSuggested: 'CBC',
      planTaken: 'Abhyanga',
    },
    documents: [],
  })),
  getAllAppointmentsForPatients: vi.fn(async () =>
    initialAppointments.map((a) => ({
      id: a.id,
      patientId: '37944397',
      patientName: a.patient,
      doctorName: a.doctor,
      consultationTypes: [a.visitType.toUpperCase()],
      registrationDate: a.dateCreated,
      status: a.status,
      createdAt: `${a.dateCreated}T00:00:00`,
    })),
  ),
  getAllAppointmentTherapiesForPatients: vi.fn(async () =>
    initialTreatments.map((t) => ({
      id: t.id,
      patientId: t.patientDetailId,
      patientName: t.patient,
      treatmentCategoryName: t.treatmentCategory,
      therapistName: t.assignedTherapist,
      scheduleDate: t.dateCreated,
      scheduleTime: '10:00:00',
      sessionFrequency: t.totalSessions,
      status: t.status,
      therapyNames: [t.therapyType],
      createdAt: `${t.dateCreated}T00:00:00`,
    })),
  ),
}));

vi.mock('@/lib/api/treatments', () => ({
  getAllTreatments: vi.fn(async () =>
    initialTreatments.map((t) => ({
      id: t.id,
      patientId: t.patientDetailId,
      treatmentPlanName: t.treatmentPlanName,
      startDate: t.startDate,
      endDate: t.endDate,
      totalSessions: t.totalSessions,
      completedSessions: t.completedSessions,
      remainingSessions: t.remainingSessions,
      assignedTherapistId: 'th-1',
      assignedTherapistName: t.assignedTherapist,
      treatmentStatus:
        t.status === 'Completed'
          ? 'COMPLETED'
          : t.status === 'Scheduled'
            ? 'SCHEDULED'
            : 'ONGOING',
    })),
  ),
  getTreatmentsByPatientId: vi.fn(async (patientId: string) =>
    initialTreatments
      .filter((t) => t.patientDetailId === patientId)
      .map((t) => ({
        id: t.id,
        patientId: t.patientDetailId,
        treatmentPlanName: t.treatmentPlanName,
        startDate: t.startDate,
        endDate: t.endDate,
        totalSessions: t.totalSessions,
        completedSessions: t.completedSessions,
        remainingSessions: t.remainingSessions,
        assignedTherapistId: 'th-1',
        assignedTherapistName: t.assignedTherapist,
        treatmentStatus:
          t.status === 'Completed'
            ? 'COMPLETED'
            : t.status === 'Scheduled'
              ? 'SCHEDULED'
              : 'ONGOING',
      })),
  ),
  createTreatment: vi.fn(async () => ({ id: 'tr-new' })),
  updateTreatment: vi.fn(),
  updateTreatmentStatus: vi.fn(),
}));

vi.mock('@/lib/api/followUps', () => ({
  getAllFollowUps: vi.fn(async () =>
    initialFollowUps.map((f) => ({
      id: f.id,
      patientId: '37944397',
      patientDisplayId: f.uhid,
      patientName: f.patient,
      assignedDoctorId: 'doc-1',
      doctorName: f.doctor,
      visitType: f.visitType.toUpperCase() === 'THERAPY' ? 'THERAPY' : 'CONSULTATION',
      appointmentDate: `${f.dateCreated}T10:30:00`,
      schedulingOption: 'AFTER_7_DAYS',
      smsReminderEnabled: false,
      status:
        f.status === 'Missed'
          ? 'MISSED'
          : f.status === 'Completed'
            ? 'COMPLETED'
            : f.status === 'Cancelled'
              ? 'CANCELLED'
              : 'UPCOMING',
    })),
  ),
  getFollowUpsByPatientId: vi.fn(async () => []),
  createFollowUp: vi.fn(async () => ({ id: 'fu-new' })),
  updateFollowUpStatus: vi.fn(),
  cancelFollowUp: vi.fn(),
}));

vi.mock('@/lib/api/packages', () => ({
  getAllPackages: vi.fn(async () => []),
  getPackagesByPatientId: vi.fn(async () => []),
  createPackage: vi.fn(),
  updatePackage: vi.fn(),
  updatePackageStatus: vi.fn(),
}));

vi.mock('@/lib/api/consultationTypes', () => ({
  getAllConsultationTypes: vi.fn(async () => [
    { id: 'ct-consultation', name: 'CONSULTATION', status: 'ACTIVE' },
    { id: 'ct-therapy', name: 'THERAPY', status: 'ACTIVE' },
  ]),
  getActiveConsultationTypes: vi.fn(async () => [
    { id: 'ct-consultation', name: 'CONSULTATION', status: 'ACTIVE' },
    { id: 'ct-therapy', name: 'THERAPY', status: 'ACTIVE' },
  ]),
  getConsultationTypeById: vi.fn(),
  createConsultationType: vi.fn(),
}));

vi.mock('@/lib/api/treatmentPlanMasters', () => ({
  getAllTreatmentPlanMasters: vi.fn(async () => [
    { id: 'tp-1', name: 'Detox Package', status: 'ACTIVE' },
  ]),
  getActiveTreatmentPlanMasters: vi.fn(async () => [
    { id: 'tp-1', name: 'Detox Package', status: 'ACTIVE' },
  ]),
  getTreatmentPlanMasterById: vi.fn(),
  createTreatmentPlanMaster: vi.fn(),
}));

vi.mock('@/lib/api/packageMasters', () => ({
  getAllPackageMasters: vi.fn(async () => [
    { id: 'pkg-1', name: 'Gold Membership', packagePrice: 15000, status: 'ACTIVE' },
  ]),
  getActivePackageMasters: vi.fn(async () => [
    { id: 'pkg-1', name: 'Gold Membership', packagePrice: 15000, status: 'ACTIVE' },
  ]),
  getPackageMasterById: vi.fn(),
  createPackageMaster: vi.fn(),
}));

vi.mock('@/lib/api/medicines', () => ({
  getAllMedicines: vi.fn(async () =>
    initialMedicines.map((m) => ({
      id: m.id,
      medicineName: m.name,
      category: m.category.toUpperCase(),
      manufacturer: 'Default',
      batchNumber: `B-${m.id}`,
      stockQuantity: m.stockQuantity,
      expiryDate: '2026-10-05',
      purchasePrice: m.price * 0.7,
      sellingPrice: m.price,
      price: m.price,
      lowStockAlertEnabled: true,
      lowStockThreshold: 10,
      status: 'ACTIVE',
      stockStatus:
        m.status === 'Low Stock'
          ? 'LOW_STOCK'
          : m.status === 'Out of Stock'
            ? 'OUT_OF_STOCK'
            : 'IN_STOCK',
    })),
  ),
  getMedicineCategories: vi.fn(async () => ['TABLET', 'SYRUP', 'POWDER', 'CAPSULE', 'OIL']),
  getMedicineById: vi.fn(),
  createMedicine: vi.fn(async (payload: { medicineName: string }) => [
    {
      id: `med-${Date.now()}`,
      ...payload,
      stockStatus: 'IN_STOCK',
    },
  ]),
  createMultipleMedicines: vi.fn(async (payload: object[]) =>
    payload.map((item, index) => ({
      id: `med-${Date.now()}-${index}`,
      ...item,
      stockStatus: 'IN_STOCK',
    })),
  ),
  updateMedicine: vi.fn(async (_id: string, payload: object) => ({
    id: 'med-updated',
    ...payload,
    stockStatus: 'IN_STOCK',
  })),
  deleteMedicine: vi.fn(async () => undefined),
}));

vi.mock('@/lib/api/booking', () => ({
  submitBookingStep1: vi.fn(async () => ({
    appointment: { id: 'ap-new', patientId: '37944397' },
    patientId: '37944397',
    therapy: null,
  })),
  submitBookingStep2: vi.fn(async () => ({ id: 'therapy-appt-1' })),
  submitBookingStep3: vi.fn(async () => ({ patientId: '37944397' })),
  bookAppointmentFlow: vi.fn(async () => ({
    appointment: { id: 'ap-new', patientId: '37944397' },
    therapy: null,
    medicalAssessment: { patientId: '37944397' },
    patientId: '37944397',
  })),
}));

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(async () => ({
    accessToken: 'test-token',
    tokenType: 'Bearer',
    expiresInMs: 86400000,
    user: {
      id: 'user-1',
      tenantId: 'tenant-1',
      tenantCode: 'GAN',
      username: 'admin',
      email: 'admin@test.com',
      fullName: 'Rahul Sharma',
      role: 'TENANT_ADMIN',
      status: 'ACTIVE',
    },
    tenant: {
      id: 'tenant-1',
      tenantCode: 'GAN',
      name: 'Ganesha Clinic',
      email: 'clinic@test.com',
      phone: '+919999999999',
      address: 'Mumbai',
      status: 'ACTIVE',
    },
  })),
  signup: vi.fn(),
  registerTenant: vi.fn(async () => ({
    id: 'tenant-1',
    tenantCode: 'GAN',
    name: 'Ganesha Clinic',
    email: 'clinic@test.com',
    phone: '+919999999999',
    address: 'Mumbai',
    status: 'ACTIVE',
  })),
  getMe: vi.fn(async () => ({
    id: 'user-1',
    tenantId: 'tenant-1',
    tenantCode: 'GAN',
    username: 'admin',
    email: 'admin@test.com',
    fullName: 'Rahul Sharma',
    role: 'TENANT_ADMIN',
    status: 'ACTIVE',
  })),
  getTenant: vi.fn(async () => ({
    id: 'tenant-1',
    tenantCode: 'GAN',
    name: 'Ganesha Clinic',
    email: 'clinic@test.com',
    phone: '+919999999999',
    address: 'Mumbai',
    status: 'ACTIVE',
  })),
  getUsers: vi.fn(async () => []),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  changePassword: vi.fn(async () => undefined),
  validateToken: vi.fn(),
  registerUser: vi.fn(async () => {
    throw new Error('registerUser unavailable in tests');
  }),
}));

vi.mock('@/lib/api/roles', () => ({
  getUiPages: vi.fn(async () => {
    throw new Error('ui-pages unavailable in tests');
  }),
  getRoles: vi.fn(async () => {
    throw new Error('roles unavailable in tests');
  }),
  getRoleById: vi.fn(),
  createRole: vi.fn(async () => {
    throw new Error('createRole unavailable in tests');
  }),
  updateRole: vi.fn(async () => {
    throw new Error('updateRole unavailable in tests');
  }),
  deleteRole: vi.fn(),
  bootstrapSuperAdmin: vi.fn(),
  createHospital: vi.fn(),
  getHospitals: vi.fn(async () => []),
}));

vi.mock('@/lib/api/billing', () => ({
  getInvoices: vi.fn(async () => [
    {
      id: 'd565b93d-f8ef-43e1-9ca0-3d29fcab750d',
      invoiceId: 'INV-1024',
      patientId: '37944397',
      patientDisplayId: 'PT458652',
      patientCode: 'GAN2025-0129',
      invoiceDate: '2026-10-05',
      totalAmount: 15000,
      paidAmount: 15000,
      leftAmount: 0,
      status: 'COMPLETED',
    },
  ]),
  getInvoiceById: vi.fn(async (invoiceId: string) => ({
    id: 'inv-1',
    invoiceId,
    patientId: '37944397',
    patientDisplayId: 'PT458652',
    patientCode: 'GAN2025-0129',
    patientName: 'Khushi Shroff',
    contactNumber: '+919876543210',
    invoiceDate: '2026-10-05',
    visitType: 'CONSULTATION',
    serviceFees: 15000,
    subtotal: 15000,
    discount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 0,
    status: 'COMPLETED',
    items: [
      {
        id: 'item-1',
        itemType: 'SERVICE',
        itemName: 'Consultation',
        quantity: 1,
        unitPrice: 15000,
        amount: 15000,
      },
    ],
    payments: [
      {
        id: 'pay-1',
        amountPaid: 15000,
        paymentDate: '2026-10-05T10:00:00',
        paymentMethod: 'Cash',
      },
    ],
  })),
  createInvoice: vi.fn(async () => ({
    id: 'inv-uuid-new',
    invoiceId: 'INV-NEW',
    patientId: '37944397',
    invoiceDate: '2026-10-15',
    totalAmount: 1000,
    paidAmount: 0,
    leftAmount: 1000,
    status: 'UNPAID',
  })),
  addInvoicePayment: vi.fn(async () => ({
    id: 'inv-uuid-new',
    invoiceId: 'INV-NEW',
    patientId: '37944397',
    invoiceDate: '2026-10-15',
    totalAmount: 1000,
    paidAmount: 1000,
    leftAmount: 0,
    status: 'COMPLETED',
  })),
  createBilling: vi.fn(async () => ({
    id: 'billing-draft-1',
    patientId: '37944397',
    status: 'PENDING',
    services: [],
  })),
  getBillings: vi.fn(async () => []),
  getBillingById: vi.fn(async () => ({
    id: 'billing-draft-1',
    patientId: '37944397',
    patientDisplayId: 'PT458652',
    patientCode: 'GAN2025-0129',
    patientName: 'Khushi Shroff',
    contactNumber: '9876543210',
    billingDate: '2026-10-15',
    visitType: 'CONSULTATION',
    status: 'PENDING',
    services: [
      {
        serviceType: 'Consultation',
        serviceFees: 800,
        packageCharges: 800,
      },
    ],
  })),
  getBillingsByPatient: vi.fn(async () => []),
  generateInvoiceFromBilling: vi.fn(async () => ({
    id: 'inv-from-billing',
    invoiceId: 'INV-BILL',
    patientId: '37944397',
    invoiceDate: '2026-10-15',
    totalAmount: 800,
    paidAmount: 0,
    leftAmount: 800,
    status: 'UNPAID',
  })),
  toVisitTypeApi: (value: string) => {
    const upper = value.toUpperCase();
    if (upper.includes('THERAPY')) return 'THERAPY';
    if (upper.includes('FOLLOW')) return 'FOLLOW_UP';
    if (upper.includes('PACKAGE')) return 'PACKAGE';
    return 'CONSULTATION';
  },
  getSales: vi.fn(async () => ({
    revenueThisMonth: 2756,
    revenueFrom: '2026-08-01',
    revenueTo: '2026-08-31',
    sales: [
      {
        invoiceId: 'INV-1002',
        invoiceDate: '2026-08-04',
        treatmentCategory: null,
        serviceType: 'Therapy',
        totalAmount: 1908,
      },
      {
        invoiceId: 'INV-1001',
        invoiceDate: '2026-08-04',
        treatmentCategory: null,
        serviceType: 'Monthly',
        totalAmount: 848,
      },
    ],
  })),
  getSalesRevenueMonth: vi.fn(async () => ({
    year: 2026,
    month: 10,
    totalRevenue: 125000,
  })),
  getDashboardBillingSummary: vi.fn(async () => ({
    period: 'MONTHLY',
    fromDate: '2026-10-01',
    toDate: '2026-10-31',
    totalRevenue: 450492,
    totalBillsGenerated: 12,
    pendingPayments: 228000,
    collectedPayments: 228000,
  })),
}));

vi.mock('@/lib/api/prescriptions', () => ({
  createPrescription: vi.fn(async () => ({
    id: 'rx-1',
    patientId: '37944397',
    diagnosis: 'Migraine',
  })),
  getPrescriptionById: vi.fn(async () => ({
    id: 'rx-1',
    patientId: '37944397',
    diagnosis: 'Migraine',
    medicines: [],
    therapySuggestions: [],
    consultant: {
      name: 'Dr. Sheekha',
      qualification: 'BAMS',
      mobileNumber: '9876543210',
    },
    patient: {
      displayId: '#PT458652',
      name: 'Khushi Shroff',
      age: 32,
      gender: 'Female',
    },
  })),
  getPrescriptionsByPatient: vi.fn(async () => []),
}));

vi.mock('@/lib/api/activityLogs', () => ({
  getActivityLogs: vi.fn(async () => [
    {
      id: 'log-1',
      page: 'Patients',
      action: 'UPDATED',
      target: 'Patient #PT458652',
      before: 'ACTIVE',
      after: 'INACTIVE',
      timestamp: '2026-08-03T12:00:00',
    },
  ]),
  createActivityLog: vi.fn(),
  getActivityLogById: vi.fn(),
}));

vi.mock('@/lib/api/dashboard', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/dashboard')>();
  return {
    ...actual,
    getDashboardMedicineStock: vi.fn(async () => ({
      totalStock: 500,
      tablets: 200,
      syrups: 150,
      powder: 150,
      statusBreakdown: { inStock: 40, outOfStock: 2, lowStock: 5 },
      lowStockItems: [],
    })),
    getTodaysSchedule: vi.fn(async () => ({
      date: '2026-08-03',
      currentDateTime: '2026-08-03T17:00:00',
      ongoingAppointment: {
        patientName: 'Rahul Patel',
        serviceType: 'CONSULTATION',
        bookingStatus: 'IN_CONSULTATION',
        slotTime: '01:05:00',
      },
      nextAppointment: {
        patientName: 'Khushi Shroff',
        serviceType: 'CONSULTATION',
        bookingStatus: 'SCHEDULED',
        slotTime: '10:30:00',
      },
      remainingToday: 4,
    })),
    getAppointmentStats: vi.fn(async () => ({
      currentMonthAppointmentCount: 40,
      completedCount: 25,
      ongoingCount: 3,
      todayAppointmentCount: 8,
    })),
    getDashboardBillingSummary: vi.fn(async () => ({
      period: 'MONTHLY',
      fromDate: '2026-10-01',
      toDate: '2026-10-31',
      totalRevenue: 450492,
      totalBillsGenerated: 12,
      pendingPayments: 228000,
      collectedPayments: 228000,
    })),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});
