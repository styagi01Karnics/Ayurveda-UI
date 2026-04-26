export const PERIOD_OPTIONS = ['Monthly', 'Quarterly', 'Yearly'] as const;
export type Period = typeof PERIOD_OPTIONS[number];

export const CHART_DATA_BY_PERIOD: Record<Period, { label: string; newPatients: number; followUps: number }[]> = {
  Monthly: [
    { label: 'Sep', newPatients: 42, followUps: 28 },
    { label: 'Oct', newPatients: 58, followUps: 36 },
    { label: 'Nov', newPatients: 51, followUps: 44 },
  ],
  Quarterly: [
    { label: 'Q1', newPatients: 120, followUps: 80 },
    { label: 'Q2', newPatients: 160, followUps: 110 },
    { label: 'Q3', newPatients: 145, followUps: 130 },
  ],
  Yearly: [
    { label: '2022', newPatients: 420, followUps: 280 },
    { label: '2023', newPatients: 580, followUps: 360 },
    { label: '2024', newPatients: 640, followUps: 420 },
  ],
};

export const STATUS_CONFIG: Record<string, { bg: string; color: string; border: string }> = {
  COMPLETED: { bg: '#E6EFE3', color: '#2E7D32', border: '#036F4B' },
  CONFIRMED: { bg: '#E6EFE3', color: '#2E7D32', border: '#036F4B' },
  PENDING:   { bg: '#FEF9C3', color: '#EAB308', border: '#EAB308' },
  CANCELLED: { bg: '#FAE3E2', color: '#DC2626', border: '#DC2626' },
  ACTIVE:    { bg: '#E6EFE3', color: '#2E7D32', border: '#036F4B' },
  INACTIVE:  { bg: '#F3F4F6', color: '#737373', border: '#D1D5DB' },
};
