import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import type { CreateTherapistPayload, TherapistDto } from './types';

const base = () => `${apiConfig.therapist}/api/v1/therapists`;

export function getAllTherapists() {
  return apiRequestList<TherapistDto>(base());
}

export function getTherapistById(therapistId: string) {
  return apiRequest<TherapistDto>(`${base()}/${therapistId}`);
}

export function createTherapist(payload: CreateTherapistPayload) {
  return apiRequest<TherapistDto>(base(), {
    method: 'POST',
    body: payload,
  });
}
