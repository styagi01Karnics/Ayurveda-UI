import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type { CreateTherapistPayload, TherapistDto } from './types';

const url = (path: string) => `${apiConfig.therapist}${path}`;

export function getAllTherapists() {
  return apiRequestList<TherapistDto>(url(apiEndpoints.therapists.getAll));
}

export function isTherapistActive(therapist: TherapistDto): boolean {
  if (therapist.active === false) return false;
  const status = (therapist.status ?? 'ACTIVE').toUpperCase();
  return status === 'ACTIVE';
}

/** ACTIVE therapists only — use for assignment dropdowns. */
export function getActiveTherapists() {
  return getAllTherapists().then((therapists) =>
    therapists.filter(isTherapistActive),
  );
}

export function getTherapistById(therapistId: string) {
  return apiRequest<TherapistDto>(
    url(apiEndpoints.therapists.getById(therapistId)),
  );
}

export function createTherapist(payload: CreateTherapistPayload) {
  return apiRequest<TherapistDto>(url(apiEndpoints.therapists.create), {
    method: 'POST',
    body: payload,
  });
}

export type UpdateTherapistPayload = {
  name: string;
  status: string;
  assignedTherapyIds: string[];
};

export function updateTherapist(
  therapistId: string,
  payload: UpdateTherapistPayload,
) {
  return apiRequest<TherapistDto>(
    url(apiEndpoints.therapists.update(therapistId)),
    {
      method: 'PUT',
      body: payload,
    },
  );
}

export function deleteTherapist(therapistId: string) {
  return apiRequest<void>(url(apiEndpoints.therapists.getById(therapistId)), {
    method: 'DELETE',
  });
}

export function updateTherapistStatus(therapistId: string, status: string) {
  return apiRequest<TherapistDto>(
    url(apiEndpoints.therapists.updateStatus(therapistId)),
    {
      method: 'PATCH',
      body: { status },
    },
  );
}

export function getTherapistsByTherapyIds(therapyIds: string[]) {
  const query = therapyIds.map(id => `therapyIds=${id}`).join('&');
  return apiRequestList<TherapistDto>(`${url(apiEndpoints.therapists.getByTherapies)}?${query}`);
}

export function mapTherapistSelectOptions(
  therapists: TherapistDto[],
): { value: string; label: string }[] {
  return therapists
    .filter(isTherapistActive)
    .map((therapist) => ({
      value: therapist.id,
      label: therapist.name || therapist.therapistName || '—',
    }));
}

export function filterTherapistsByTherapyIds(
  therapists: TherapistDto[],
  therapyIds: string[],
): TherapistDto[] {
  if (!therapyIds.length) {
    return therapists;
  }

  const filtered = therapists.filter((therapist) => {
    const assignedIds = [
      ...(therapist.assignedTherapyIds ?? []),
      ...(therapist.assignedTherapies?.map((therapy) => therapy.id) ?? []),
    ];
    return therapyIds.some((therapyId) => assignedIds.includes(therapyId));
  });

  return filtered.length > 0 ? filtered : therapists;
}
