import { describe, expect, it } from 'vitest';
import {
  followUpSchema,
  patientStep1Schema,
  patientStep3Schema,
} from '@/lib/validation/patient.schema';

const validStep1 = {
  fullName: 'Khushi Shroff',
  gender: 'Female',
  dateOfBirth: '1995-05-15',
  age: '30',
  preferredLanguage: 'English',
  consultationTypes: ['Consultation'],
  registrationDate: '2026-10-01',
  assignedDoctor: 'Dr. Sheekha',
  mobileNumber: '9876543210',
  email: 'khushi@example.com',
  state: 'Maharashtra',
  city: 'Mumbai',
  permanentAddress: '123 Main Street',
  emergencyName: 'Parent Name',
  emergencyRelation: 'Parent',
  emergencyPhone: '9123456789',
  patientId: 'PT458652',
  idProofType: 'Aadhaar',
  idNumber: '123456789012',
  occupation: 'Employed',
};

describe('patientStep1Schema', () => {
  it('accepts valid personal information', () => {
    expect(patientStep1Schema.safeParse(validStep1).success).toBe(true);
  });

  it('rejects missing consultation types', () => {
    const result = patientStep1Schema.safeParse({
      ...validStep1,
      consultationTypes: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('patientStep3Schema', () => {
  it('requires ayurvedic assessment fields', () => {
    const result = patientStep3Schema.safeParse({
      doshaType: 'Vata',
      bodyConstitution: ['Vata'],
      currentImbalance: 'Vata aggravation',
      height: '165',
      weight: '60',
      bmi: '22',
      pulse: '72',
      bp: '120/80',
    });
    expect(result.success).toBe(true);
  });
});

describe('followUpSchema', () => {
  it('accepts valid follow up data', () => {
    const result = followUpSchema.safeParse({
      patientId: 'PT458652',
      fullName: 'Khushi Shroff',
      contactNumber: '9876543210',
      visitType: 'Consultation',
      doctor: 'Dr. Sheekha',
      scheduleDate: '2026-10-20',
      scheduleTime: '10:30',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid contact number', () => {
    const result = followUpSchema.safeParse({
      patientId: 'PT458652',
      fullName: 'Khushi Shroff',
      contactNumber: '123',
      visitType: 'Consultation',
      doctor: 'Dr. Sheekha',
      scheduleDate: '2026-10-20',
      scheduleTime: '10:30',
    });
    expect(result.success).toBe(false);
  });
});
