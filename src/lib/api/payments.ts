import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.payment}${path}`;
const ep = apiEndpoints.payments;

export interface CreatePaymentLinkPayload {
  invoiceId: string;
  amount: number;
  firstName: string;
  email: string;
  phone: string;
  sendEmail?: boolean;
  upiQr?: boolean;
}

export interface PaymentLinkDto {
  id?: string;
  invoiceId?: string;
  amount?: number;
  payUrl?: string;
  token?: string;
  qrPayload?: string | null;
  status?: string;
  [key: string]: unknown;
}

export interface PaymentDto {
  id: string;
  invoiceId?: string;
  amount?: number;
  status?: string;
  txnId?: string;
  paymentMethod?: string;
  [key: string]: unknown;
}

export interface InitiatePaymentPayload {
  invoiceId: string;
  amount: number;
  firstName: string;
  email: string;
  phone: string;
  productInfo?: string;
  paymentMethod?: string;
}

export interface InitiatePaymentDto {
  paymentId?: string;
  txnId?: string;
  payUrl?: string;
  status?: string;
  [key: string]: unknown;
}

/** POST /api/v1/payments/initiate — Direct PayU initiate */
export function initiatePayment(payload: InitiatePaymentPayload) {
  return apiRequest<InitiatePaymentDto>(url(ep.initiate), {
    method: 'POST',
    body: payload,
  });
}

export function getPaymentByTxn(txnId: string) {
  return apiRequest<PaymentDto>(url(ep.byTxn(txnId)));
}

export function createPaymentLink(payload: CreatePaymentLinkPayload) {
  return apiRequest<PaymentLinkDto>(url(ep.links), {
    method: 'POST',
    body: payload,
  });
}

/** Prefer absolute `payUrl`; otherwise build `/pay/{token}` for the payment host. */
export function resolvePaymentLinkUrl(link: PaymentLinkDto): string | undefined {
  const raw = typeof link.payUrl === 'string' ? link.payUrl.trim() : '';
  if (raw) {
    if (/^https?:\/\//i.test(raw)) return raw;
    const origin =
      apiConfig.payment ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    if (!origin) return raw;
    return `${origin.replace(/\/$/, '')}${raw.startsWith('/') ? raw : `/${raw}`}`;
  }

  const token = typeof link.token === 'string' ? link.token.trim() : '';
  if (!token) return undefined;

  const origin =
    apiConfig.payment ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  if (!origin) return `/pay/${token}`;
  return `${origin.replace(/\/$/, '')}/pay/${token}`;
}

export function getPaymentLinksByInvoice(invoiceId: string) {
  return apiRequestList<PaymentLinkDto>(url(ep.linksByInvoice(invoiceId)));
}

export function getPaymentLinkById(id: string) {
  return apiRequest<PaymentLinkDto>(url(ep.linkById(id)));
}

export function resendPaymentLinkEmail(id: string) {
  return apiRequest<PaymentLinkDto>(url(ep.linkEmail(id)), {
    method: 'POST',
  });
}

export function getPayments() {
  return apiRequestList<PaymentDto>(url(ep.base));
}

export function getPaymentById(paymentId: string) {
  return apiRequest<PaymentDto>(url(ep.byId(paymentId)));
}

export function refundPayment(
  paymentId: string,
  payload: { amount?: number; remarks?: string } = {},
) {
  return apiRequest<PaymentDto>(url(ep.refund(paymentId)), {
    method: 'POST',
    body: payload,
  });
}
