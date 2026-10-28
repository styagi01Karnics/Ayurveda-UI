import { toApiGender, toApiIdProofType } from '@/lib/api/mappers';
import type { CreatePatientPayload } from '@/lib/api/types';
import type { CreatePatientValues } from '@/lib/validation/patient.schema';
function hasText(value?: string | null): value is string {
  return Boolean(value?.trim());
}

function cleanAlphaText(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, '').trim();
}

function computeAgeFromDob(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
}

/** Maps booking form values to appointment patient body — only includes filled fields. */
export function toPatientPayload(data: CreatePatientValues): CreatePatientPayload {
  const age = data.age?.trim()
    ? Number(data.age)
    : computeAgeFromDob(data.dateOfBirth);

  const mobile = data.mobileNumber.trim();
  const payload: CreatePatientPayload = {
    fullName: data.fullName.trim(),
    gender: toApiGender(data.gender),
    dateOfBirth: data.dateOfBirth,
    age: Number.isFinite(age) ? age : 0,
    mobileNumber: mobile,
  };

  if (hasText(data.preferredLanguage)) {
    const language = cleanAlphaText(data.preferredLanguage);
    if (language) payload.preferredLanguage = language;
  }

  if (hasText(data.email)) {
    payload.email = data.email.trim();
  }

  if (hasText(data.state)) {
    const state = cleanAlphaText(data.state);
    if (state) payload.state = state;
  }

  if (hasText(data.city)) {
    const city = cleanAlphaText(data.city);
    if (city) payload.city = city;
  }

  if (hasText(data.permanentAddress)) {
    payload.address = data.permanentAddress.trim();
  }

  const emergencyPhone = data.emergencyPhone?.trim();
  if (hasText(emergencyPhone) && emergencyPhone !== mobile) {
    payload.emergencyPhoneNumber = emergencyPhone;
    if (hasText(data.emergencyName)) {
      payload.emergencyContactName =
        cleanAlphaText(data.emergencyName) || data.emergencyName.trim();
    }
    if (hasText(data.emergencyRelation)) {
      payload.emergencyRelationship =
        cleanAlphaText(data.emergencyRelation) || data.emergencyRelation.trim();
    }
  }

  if (hasText(data.idProofType)) {
    payload.idProofType = toApiIdProofType(data.idProofType);
  }

  if (hasText(data.idNumber)) {
    payload.idProofNumber = data.idNumber.trim();
  }

  if (hasText(data.occupation)) {
    const occupation = cleanAlphaText(data.occupation);
    if (occupation) payload.occupation = occupation;
  }

  if (hasText(data.insuranceDetails)) {
    payload.insuranceDetails = data.insuranceDetails.trim();
  }

  return payload;
}

export { computeAgeFromDob };
