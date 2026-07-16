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

vi.mock('@/lib/api/patients', () => ({
  getAllPatients: vi.fn(async () => mockPatientDtos()),
  getPatientById: vi.fn(async (id: string) => {
    const found = mockPatientDtos().find((p) => p.id === id);
    if (!found) throw new Error('Patient not found');
    return found;
  }),
  createPatient: vi.fn(async (payload: { fullName: string }) => ({
    id: 'new-patient-id',
    patientCode: 'PAT-TEST-0001',
    ...payload,
    active: true,
  })),
}));

vi.mock('@/lib/api/doctors', () => ({
  getAllDoctors: vi.fn(async () =>
    initialClinicDoctors.map((d) => ({
      id: d.id,
      doctorName: d.name,
      doctorCode: d.id,
      specialization: d.specialization,
      mobileNumber: '9876543210',
      email: 'doctor@example.com',
      qualification: d.specialization,
      department: d.specialization,
      consultationRoom: d.availability,
      active: d.status === 'Active',
    })),
  ),
  getDoctorById: vi.fn(),
  createDoctor: vi.fn(async (payload: { doctorName: string }) => ({
    id: `doc-${Date.now()}`,
    doctorCode: 'DOC-TEST',
    ...payload,
    active: true,
  })),
}));

vi.mock('@/lib/api/therapists', () => ({
  getAllTherapists: vi.fn(async () =>
    initialClinicTherapists.map((t) => ({
      id: t.id,
      therapistName: t.name,
      therapistCode: t.id,
      specialization: t.assignedTherapies[0] ?? 'Therapy',
      mobileNumber: '9876543210',
      email: 'therapist@example.com',
      qualification: 'Therapist',
      therapyRoom: 'Room A',
      active: t.status === 'Active',
    })),
  ),
  getTherapistById: vi.fn(),
  createTherapist: vi.fn(async (payload: { therapistName: string }) => ({
    id: `therapist-${Date.now()}`,
    therapistCode: 'THP-TEST',
    ...payload,
    active: true,
  })),
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
      therapyName: t.name,
      description: t.name,
      active: t.status === 'Active',
    })),
  ),
  createTherapy: vi.fn(async (payload: { therapyName: string }) => ({
    id: `therapy-${Date.now()}`,
    therapyCode: 'TH001',
    categoryId: 'cat-1',
    ...payload,
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
  getAllDoshas: vi.fn(async () => [
    { id: '1', name: 'Vata', elements: '', characteristics: '', active: true },
    { id: '2', name: 'Pitta', elements: '', characteristics: '', active: true },
    { id: '3', name: 'Kapha', elements: '', characteristics: '', active: true },
  ]),
  getDoshaById: vi.fn(),
  createDosha: vi.fn(),
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

vi.mock('@/lib/api/booking', () => ({
  bookAppointmentFlow: vi.fn(async () => ({
    appointment: { id: 'ap-new', patientId: '37944397' },
    therapy: null,
    patientId: '37944397',
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});
