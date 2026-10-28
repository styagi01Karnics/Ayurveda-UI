import type { SalesInvoiceRecord, SalesStats } from '@/types';

export const salesStats: SalesStats = {
  totalPatients: 30,
  patientsCompleted: 20,
  patientsOngoing: 10,
  appointmentsThisMonth: 30,
  appointmentsCompleted: 20,
  appointmentsOngoing: 10,
  revenueThisMonth: 245000,
  revenuePeriod: 'From 10 May - 16 May',
  completedTreatments: 9,
};

export const salesInvoices: SalesInvoiceRecord[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `sale-${index + 1}`,
    invoiceId: 'INV-1024',
    invoiceDate: '5/10/2026',
    treatmentCategory: 'Joint Pain',
    serviceType: 'Panchakarma',
    totalAmount: 15000,
  }),
);

export const SALES_FILTER_OPTIONS = {
  serviceType: ['Panchakarma', 'Consultation', 'Therapy', 'Monthly', 'Shirodhara'],
} as const;
