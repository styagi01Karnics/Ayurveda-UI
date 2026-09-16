import { apiConfig } from './config';
import { apiRequest, apiRequestList, ApiError } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.payment}${path}`;
const ep = apiEndpoints.payments;

/**
 * POST /api/v1/payments/links
 * Exact body used in ops how-to (no gateway credentials).
 */
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
  email?: string;
  emailSent?: boolean;
  upiQr?: boolean;
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

function normalizeAmount(amount: number): number {
  return Math.round(Number(amount) * 100) / 100;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

/** POST /api/v1/payments/initiate */
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
 * Create + email payment link.
 * ```json
 * { "invoiceId", "amount", "firstName", "email", "phone", "sendEmail": true, "upiQr": false }
 * ```
 */
export function createPaymentLink(payload: CreatePaymentLinkPayload) {
  return apiRequest<PaymentLinkDto>(url(ep.links), {
    method: 'POST',
    body: {
      invoiceId: payload.invoiceId,
      amount: normalizeAmount(payload.amount),
      firstName: payload.firstName.trim(),
      email: payload.email.trim(),
      phone: normalizePhone(payload.phone),
      sendEmail: payload.sendEmail ?? true,
      upiQr: payload.upiQr ?? false,
    } satisfies CreatePaymentLinkPayload,
  });
}

/** Prefer absolute `payUrl` from payment-service (e.g. http://host:8112/pay/...). */
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

/** POST /api/v1/payments/links/{id}/email — resend */
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
  /** Default false per how-to; set true only if PayU DBQR is enabled. */
  upiQr?: boolean;
}

export interface SendInvoicePaymentLinkResult {
  link: PaymentLinkDto;
  payUrl?: string;
  resent: boolean;
  emailSent: boolean;
}

/**
 * Create a payment link (or resend an existing OPEN link) using the how-to payload.
 */
export async function sendInvoicePaymentLink(
  input: SendInvoicePaymentLinkInput,
): Promise<SendInvoicePaymentLinkResult> {
  const existing = await getPaymentLinksByInvoice(input.invoiceId).catch(
    () => [] as PaymentLinkDto[],
  );
  const openLink = existing.find((row) => {
    const status = String(row.status ?? 'OPEN').toUpperCase();
    return Boolean(row.id) && (status === 'OPEN' || status === '');
  });

  if (openLink?.id) {
    const resent = await resendPaymentLinkEmail(openLink.id).catch(
      () => openLink,
    );
    return {
      link: resent,
      payUrl: resolvePaymentLinkUrl(resent) ?? resolvePaymentLinkUrl(openLink),
      resent: true,
      emailSent: resent.emailSent !== false,
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
    emailSent: link.emailSent === true,
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
