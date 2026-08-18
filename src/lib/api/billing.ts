import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.billing}${path}`;
const ep = apiEndpoints.billing;
const dash = apiEndpoints.dashboard;

export type InvoiceStatus = 'UNPAID' | 'ONGOING' | 'COMPLETED';
export type BillingDraftStatus = 'PENDING' | 'COMPLETED';
export type BillingPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type VisitTypeApi =
  | 'CONSULTATION'
  | 'FOLLOW_UP'
  | 'THERAPY'
  | 'PACKAGE';

export function toVisitTypeApi(value: string): VisitTypeApi {
  const upper = value.toUpperCase().replace(/[\s-]+/g, '_');
  if (upper.includes('THERAPY')) return 'THERAPY';
  if (upper.includes('FOLLOW')) return 'FOLLOW_UP';
  if (upper.includes('PACKAGE')) return 'PACKAGE';
  return 'CONSULTATION';
}

export interface InvoiceMedicineItem {
  medicineId: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTherapyItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  assignedTherapistId?: string;
  assignedTherapistName?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  sessionDuration?: number;
  sessionFrequency?: number;
}

export interface CreateInvoicePayload {
  patientId: string;
  patientDisplayId?: string;
  patientCode?: string;
  patientName: string;
  contactNumber: string;
  invoiceDate: string;
  visitType: VisitTypeApi;
  serviceFees: number;
  packageMasterId?: string | null;
  packageType?: string | null;
  packageCharges?: number;
  medicines?: InvoiceMedicineItem[];
  therapies?: InvoiceTherapyItem[];
  discount?: number;
  taxEnabled?: boolean;
  cgstPercent?: number;
  sgstPercent?: number;
  amountPaid?: number;
  paymentMethod?: string;
  paymentRemarks?: string;
}

export interface InvoicePaymentDto {
  id: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  remarks?: string | null;
}

export interface InvoiceItemDto {
  id: string;
  itemType: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  medicineId?: string | null;
  assignedTherapistId?: string | null;
  assignedTherapistName?: string | null;
  scheduleDate?: string | null;
  scheduleTime?: string | null;
  sessionDuration?: number | null;
  sessionFrequency?: number | null;
}

export interface InvoiceDto {
  id: string;
  invoiceId: string;
  patientId: string;
  patientDisplayId?: string;
  formattedPatientId?: string;
  patientCode?: string;
  patientName: string;
  contactNumber?: string;
  invoiceDate: string;
  visitType?: VisitTypeApi | string;
  serviceFees?: number;
  packageType?: string | null;
  packageCharges?: number;
  subtotal?: number;
  discount?: number;
  taxEnabled?: boolean;
  cgstPercent?: number;
  cgstAmount?: number;
  sgstPercent?: number;
  sgstAmount?: number;
  totalAmount: number;
  paidAmount: number;
  leftAmount?: number;
  status: InvoiceStatus;
  billSections?: string[];
  /** Assigned doctor UUID when returned by billing list/detail APIs. */
  assignedDoctorId?: string;
  doctorName?: string;
  doctorPhone?: string;
  doctorQualification?: string;
  doctorSpecialization?: string;
  doctorAvailability?: string;
  items?: InvoiceItemDto[];
  payments?: InvoicePaymentDto[];
}

export interface InvoiceListItemDto {
  /** Invoice UUID — use for GET/DELETE /api/v1/invoices/{id} */
  id: string;
  /** Human-readable invoice number, e.g. INV-1002 */
  invoiceId: string;
  patientId: string;
  patientDisplayId?: string;
  patientCode?: string;
  patientName?: string;
  invoiceDate: string;
  totalAmount: number;
  paidAmount: number;
  leftAmount: number;
  status: InvoiceStatus;
}

export interface InvoicePaymentPayload {
  amountPaid: number;
  paymentMethod: string;
  remarks?: string;
}

export interface SalesRecordDto {
  invoiceId: string;
  invoiceDate: string;
  treatmentCategory?: string | null;
  serviceType: string;
  totalAmount: number;
}

export interface SalesResponseDto {
  revenueThisMonth: number;
  revenueFrom: string;
  revenueTo: string;
  sales: SalesRecordDto[];
}

export interface SalesRevenueDto {
  year: number;
  month: number;
  totalRevenue: number;
}

export interface BillingSummaryDto {
  period: BillingPeriod;
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  totalBillsGenerated: number;
  pendingPayments: number;
  collectedPayments: number;
}

export interface InvoicesQuery {
  patientId?: string;
  status?: InvoiceStatus;
}

export interface SalesQuery {
  serviceType?: string;
  dateCreated?: string;
}

export function getInvoices(query: InvoicesQuery = {}) {
  const params = new URLSearchParams();
  if (query.patientId) params.set('patientId', query.patientId);
  if (query.status) params.set('status', query.status);
  const qs = params.toString();
  return apiRequestList<InvoiceListItemDto>(
    url(`${ep.invoices}${qs ? `?${qs}` : ''}`),
  );
}

/** @param id Invoice UUID (not the display number like INV-1002). */
export function getInvoiceById(id: string) {
  return apiRequest<InvoiceDto>(url(ep.invoiceById(id)));
}

export function createInvoice(payload: CreateInvoicePayload) {
  return apiRequest<InvoiceDto>(url(ep.invoices), {
    method: 'POST',
    body: payload,
  });
}

export interface BillingServiceItemPayload {
  serviceType: string;
  serviceFees: number;
}

export interface CreateBillingPayload {
  patientId: string;
  patientName: string;
  contactNumber: string;
  billingDate: string;
  services: BillingServiceItemPayload[];
}

export interface BillingServiceItemDto {
  id?: string;
  serviceType?: string;
  serviceFees?: number;
  packageMasterId?: string | null;
  packageName?: string | null;
  packageType?: string | null;
  packageCharges?: number;
}

export interface BillingDto {
  id: string;
  patientId: string;
  patientDisplayId?: string;
  formattedPatientId?: string;
  patientCode?: string;
  patientName?: string;
  contactNumber?: string;
  billingDate?: string;
  visitType?: VisitTypeApi | string;
  status: BillingDraftStatus | string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  services?: BillingServiceItemDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BillingsQuery {
  status?: BillingDraftStatus;
}

export function createBilling(payload: CreateBillingPayload) {
  return apiRequest<BillingDto>(url(ep.billings), {
    method: 'POST',
    body: payload,
  });
}

export function getBillings(query: BillingsQuery = {}) {
  const params = new URLSearchParams();
  if (query.status) params.set('status', query.status);
  const qs = params.toString();
  return apiRequestList<BillingDto>(
    url(`${ep.billings}${qs ? `?${qs}` : ''}`),
  );
}

export function getBillingById(billingId: string) {
  return apiRequest<BillingDto>(url(ep.billingById(billingId)));
}

export function getBillingsByPatient(patientId: string) {
  return apiRequestList<BillingDto>(url(ep.billingsByPatient(patientId)));
}

export function generateInvoiceFromBilling(
  billingId: string,
  payload: Partial<CreateInvoicePayload> = {},
) {
  return apiRequest<InvoiceDto>(url(ep.generateInvoiceFromBilling(billingId)), {
    method: 'POST',
    body: payload,
  });
}

export function addInvoicePayment(
  invoiceId: string,
  payload: InvoicePaymentPayload,
) {
  return apiRequest<InvoiceListItemDto>(url(ep.invoicePayment(invoiceId)), {
    method: 'POST',
    body: payload,
  });
}

export function deleteInvoice(invoiceId: string) {
  return apiRequest<void>(url(ep.invoiceById(invoiceId)), {
    method: 'DELETE',
  });
}

export function getSales(query: SalesQuery = {}) {
  const params = new URLSearchParams();
  if (query.serviceType) params.set('serviceType', query.serviceType);
  if (query.dateCreated) params.set('dateCreated', query.dateCreated);
  const qs = params.toString();
  return apiRequest<SalesResponseDto | SalesRecordDto[]>(
    url(`${ep.sales}${qs ? `?${qs}` : ''}`),
  ).then(normalizeSalesResponse);
}

function normalizeSalesResponse(
  data: SalesResponseDto | SalesRecordDto[] | null | undefined,
): SalesResponseDto {
  if (Array.isArray(data)) {
    const total = data.reduce((sum, row) => sum + (row.totalAmount ?? 0), 0);
    return {
      revenueThisMonth: total,
      revenueFrom: '',
      revenueTo: '',
      sales: data,
    };
  }

  return {
    revenueThisMonth: data?.revenueThisMonth ?? 0,
    revenueFrom: data?.revenueFrom ?? '',
    revenueTo: data?.revenueTo ?? '',
    sales: Array.isArray(data?.sales) ? data.sales : [],
  };
}

export function getSalesRevenueMonth(year: number, month: number) {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });
  return apiRequest<SalesRevenueDto>(
    url(`${ep.salesRevenueMonth}?${params.toString()}`),
  );
}

export function getDashboardBillingSummary(period: BillingPeriod = 'MONTHLY') {
  return apiRequest<BillingSummaryDto>(
    url(`${dash.billingSummary}?period=${period}`),
  );
}
