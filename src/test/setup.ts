import { beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { mockPatientDtos } from './fixtures';
import { initialAppointments } from '@/data/mock/appointments';
import { initialTreatments } from '@/data/mock/treatments';
import {
  initialClinicDoctors,
  initialClinicTherapists,
  initialClinicTherapies,
} from '@/data/mock/settings';
import { initialMedicines } from '@/data/mock/medicines';

vi.mock('@/lib/api/patients', () => ({
  getAllPatients: vi.fn(async () => mockPatientDtos()),
  getPatientById: vi.fn(async (id: string) => {
    const found = mockPatientDtos().find((p) => p.id === id);
    if (!found) throw new Error('Patient not found');
    return found;
  }),
  getPatientCount: vi.fn(async () => 1000),
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
  getTherapistById: vi.fn(),
  createTherapist: vi.fn(async (payload: { name?: string; therapistName?: string }) => ({
    id: `therapist-${Date.now()}`,
    therapistCode: 'THP-TEST',
    ...payload,
    status: 'ACTIVE',
    active: true,
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
  createMedicine: vi.fn(async (payload: { medicineName: string }) => ({
    id: `med-${Date.now()}`,
    ...payload,
    stockStatus: 'IN_STOCK',
  })),
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
  validateToken: vi.fn(),
  registerUser: vi.fn(),
}));

vi.mock('@/lib/api/billing', () => ({
  getInvoices: vi.fn(async () => [
    {
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
  createInvoice: vi.fn(async () => ({
    invoiceId: 'INV-NEW',
    patientId: '37944397',
    invoiceDate: '2026-10-15',
    totalAmount: 1000,
    paidAmount: 1000,
    leftAmount: 0,
    status: 'COMPLETED',
  })),
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
