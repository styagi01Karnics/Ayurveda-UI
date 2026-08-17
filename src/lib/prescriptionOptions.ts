export const PRESCRIPTION_DOSAGE_OPTIONS = [
  { value: '1 tablet', label: '1 tablet' },
  { value: '2 tablets', label: '2 tablets' },
  { value: '3 tablets', label: '3 tablets' },
  { value: '5 ml', label: '5 ml' },
  { value: '10 ml', label: '10 ml' },
  { value: '1 capsule', label: '1 capsule' },
  { value: '2 capsules', label: '2 capsules' },
] as const;

export const PRESCRIPTION_FREQUENCY_OPTIONS = [
  { value: 'Once daily', label: 'Once daily (OD)' },
  { value: 'Twice daily', label: 'Twice daily (BD)' },
  { value: 'Thrice daily', label: 'Thrice daily (TDS)' },
  { value: 'Twice a week', label: 'Twice a week' },
  { value: 'Once a week', label: 'Once a week' },
  { value: 'At bedtime', label: 'At bedtime (HS)' },
  { value: 'As needed', label: 'As needed (SOS)' },
] as const;

export const PRESCRIPTION_SETUP_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
] as const;
