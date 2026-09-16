import { apiConfig } from './config';
import { apiRequest, apiRequestList, ApiError } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.payment}${path}`;
const ep = apiEndpoints.payments;

/** POST /api/v1/payments/links — Create payment link (+ optional email/QR). */
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
  actionUrl?: string;
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

/**
 * Create payment link.
 * Body: { invoiceId, amount, firstName, email, phone, sendEmail?, upiQr? }
 */
export function createPaymentLink(payload: CreatePaymentLinkPayload) {
  return apiRequest<PaymentLinkDto>(url(ep.links), {
    method: 'POST',
    body: {
      invoiceId: payload.invoiceId,
      amount: payload.amount,
      firstName: payload.firstName,
      email: payload.email,
      phone: payload.phone,
      sendEmail: payload.sendEmail ?? true,
      upiQr: payload.upiQr ?? false,
    },
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

export async function getPaymentLinksByInvoice(invoiceId: string) {
  try {
    const data = await apiRequest<PaymentLinkDto | PaymentLinkDto[] | null>(
      url(ep.linksByInvoice(invoiceId)),
    );
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [];
    throw error;
  }
}

export function getPaymentLinkById(id: string) {
  return apiRequest<PaymentLinkDto>(url(ep.linkById(id)));
}

export function resendPaymentLinkEmail(id: string) {
  return apiRequest<PaymentLinkDto>(url(ep.linkEmail(id)), {
    method: 'POST',
  });
}

export interface SendInvoicePaymentLinkInput {
  invoiceId: string;
  amount: number;
  firstName: string;
  email: string;
  phone: string;
  sendEmail?: boolean;
  upiQr?: boolean;
}

export interface SendInvoicePaymentLinkResult {
  link: PaymentLinkDto;
  payUrl?: string;
  resent: boolean;
}

/**
 * Create a payment link (or resend an existing open link) with the standard payload.
 */
export async function sendInvoicePaymentLink(
  input: SendInvoicePaymentLinkInput,
): Promise<SendInvoicePaymentLinkResult> {
  const existing = await getPaymentLinksByInvoice(input.invoiceId).catch(
    () => [] as PaymentLinkDto[],
  );
  const openLink = existing.find((row) => {
    const status = String(row.status ?? '').toUpperCase();
    return Boolean(row.id) && status !== 'PAID' && status !== 'EXPIRED';
  });

  if (openLink?.id) {
    const resent = await resendPaymentLinkEmail(openLink.id).catch(
      () => openLink,
    );
    return {
      link: resent,
      payUrl: resolvePaymentLinkUrl(resent) ?? resolvePaymentLinkUrl(openLink),
      resent: true,
    };
  }

  const link = await createPaymentLink({
    invoiceId: input.invoiceId,
    amount: input.amount,
    firstName: input.firstName,
    email: input.email,
    phone: input.phone,
    sendEmail: input.sendEmail ?? true,
    upiQr: input.upiQr ?? false,
  });

  return {
    link,
    payUrl: resolvePaymentLinkUrl(link),
    resent: false,
  };
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
