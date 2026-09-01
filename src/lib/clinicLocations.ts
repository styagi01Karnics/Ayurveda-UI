export const CLINIC_LOCATIONS = [
  {
    value: 'delhi-nanaksaar',
    label: 'New Delhi — Nanaksaar (M-38 Block Road G-III)',
  },
  {
    value: 'delhi-south',
    label: 'New Delhi — South Extension',
  },
  {
    value: 'gurgaon',
    label: 'Gurugram — Sector 54',
  },
] as const;

export type ClinicLocationId = (typeof CLINIC_LOCATIONS)[number]['value'];

const LOCATION_KEY = 'ganesha_clinic_location';

export function getStoredClinicLocation(): string | null {
  return localStorage.getItem(LOCATION_KEY);
}

export function setStoredClinicLocation(locationId: string): void {
  localStorage.setItem(LOCATION_KEY, locationId);
}

export function clearStoredClinicLocation(): void {
  localStorage.removeItem(LOCATION_KEY);
}

export function getClinicLocationLabel(locationId: string | null | undefined): string {
  if (!locationId) return '—';
  return (
    CLINIC_LOCATIONS.find((location) => location.value === locationId)?.label ??
    locationId
  );
}
