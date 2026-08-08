import { describe, expect, it } from 'vitest';
import { toPatientPayload } from '@/lib/api/bookingPatientPayload';
import type { CreatePatientValues } from '@/lib/validation/patient.schema';

const minimalBooking: CreatePatientValues = {
  fullName: 'Test Patient',
  gender: 'Female',
  dateOfBirth: '1990-01-15',
  mobileNumber: '9876543210',
  consultationTypeIds: ['ct-1'],
  treatmentCategory: '',
  recommendedTherapies: [],
  scheduleDate: '',
  scheduleTime: '',
  sessionDuration: '',
  sessionFrequency: '',
  assignedTherapist: '',
  therapyInstructions: '',
  doshaType: '',
  bodyConstitution: [],
};

describe('toPatientPayload', () => {
  it('sends only required fields when optional sections are empty', () => {
    const payload = toPatientPayload(minimalBooking);

    expect(payload).toEqual({
      fullName: 'Test Patient',
      gender: 'FEMALE',
      dateOfBirth: '1990-01-15',
      age: expect.any(Number),
      mobileNumber: '9876543210',
    });
    expect(payload.emergencyPhoneNumber).toBeUndefined();
    expect(payload.email).toBeUndefined();
    expect(payload.address).toBeUndefined();
    expect(payload.idProofType).toBeUndefined();
  });

  it('includes optional fields only when the user filled them', () => {
    const payload = toPatientPayload({
      ...minimalBooking,
      email: 'test@example.com',
      state: 'Maharashtra',
      city: 'Mumbai',
      permanentAddress: 'Andheri',
      idProofType: 'Aadhaar',
      idNumber: '566767676767',
    });

    expect(payload.email).toBe('test@example.com');
    expect(payload.state).toBe('Maharashtra');
    expect(payload.city).toBe('Mumbai');
    expect(payload.address).toBe('Andheri');
    expect(payload.idProofType).toBe('AADHAAR');
    expect(payload.idProofNumber).toBe('566767676767');
    expect(payload.emergencyPhoneNumber).toBeUndefined();
  });

  it('does not copy mobile into emergency phone', () => {
    const payload = toPatientPayload({
      ...minimalBooking,
      emergencyName: 'Parent',
      emergencyRelation: 'Father',
    });

    expect(payload.emergencyPhoneNumber).toBeUndefined();
    expect(payload.emergencyContactName).toBeUndefined();
  });

  it('includes emergency contact when phone differs from mobile', () => {
    const payload = toPatientPayload({
      ...minimalBooking,
      emergencyName: 'Parent',
      emergencyRelation: 'Father',
      emergencyPhone: '9123456789',
    });

    expect(payload.emergencyPhoneNumber).toBe('9123456789');
    expect(payload.emergencyContactName).toBe('Parent');
    expect(payload.emergencyRelationship).toBe('Father');
  });
});
