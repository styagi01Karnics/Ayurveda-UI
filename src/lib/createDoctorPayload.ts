import type { CreateDoctorPayload } from '@/lib/api/types';

/** Always include qualification/mobile as strings so JSON.stringify does not drop them. */
export function toCreateDoctorPayload(
  payload: CreateDoctorPayload,
): CreateDoctorPayload {
  return {
    name: payload.name.trim(),
    specialization: payload.specialization.trim(),
    status: payload.status,
    consultationFees: payload.consultationFees,
    followUpFees: payload.followUpFees,
    availability: payload.availability,
    mobileNumber: payload.mobileNumber?.trim() ?? '',
    qualification: payload.qualification?.trim() ?? '',
    ...(payload.email?.trim() ? { email: payload.email.trim() } : {}),
  };
}
