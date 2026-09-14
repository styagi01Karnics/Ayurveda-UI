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

export function createPaymentLink(payload: CreatePaymentLinkPayload) {
  return apiRequest<PaymentLinkDto>(url(ep.links), {
    method: 'POST',
    body: payload,
  });
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
