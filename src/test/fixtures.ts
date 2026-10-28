import type { PatientDto } from '@/lib/api/types';
import { allPatients, getPatientByDetailId } from '@/data/mock/patients';

/** Minimal patient DTO list derived from UI mocks for Vitest. */
export function mockPatientDtos(): PatientDto[] {
  return allPatients.map((record) => {
    const detail = getPatientByDetailId(record.detailId);
    return {
      id: record.detailId,
      patientCode: record.id.replace(/^#/, ''),
      fullName: record.name,
      gender: detail?.personalInfo.gender.toUpperCase() ?? 'MALE',
      dateOfBirth: '2000-01-01',
      age: Number.parseInt(detail?.personalInfo.age ?? '25', 10) || 25,
      preferredLanguage: 'Hindi',
      email: detail?.personalInfo.email ?? 'patient@example.com',
      mobileNumber: record.phone.replace(/^\+91-?/, ''),
      state: detail?.personalInfo.state ?? 'Delhi',
      city: detail?.personalInfo.city ?? 'New Delhi',
      address: detail?.personalInfo.address ?? '',
      emergencyContactName: detail?.personalInfo.emergencyName ?? '',
      emergencyRelationship: detail?.personalInfo.emergencyRelation ?? '',
      emergencyPhoneNumber:
        detail?.personalInfo.emergencyPhone.replace(/^\+91-?/, '') ?? '',
      idProofType: 'AADHAAR',
      idProofNumber: detail?.personalInfo.idProofNumber ?? '',
      occupation: detail?.personalInfo.occupation ?? '',
      insuranceDetails: detail?.personalInfo.insuranceDetails ?? '',
      active: record.isActive,
      createdAt: '2026-03-12T00:00:00',
    };
  });
}
