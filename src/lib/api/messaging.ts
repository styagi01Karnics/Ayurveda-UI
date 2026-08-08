import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.notification}${path}`;

export type MessageChannel = 'SMS' | 'EMAIL';

export interface SendSmsPayload {
  recipientPhone: string;
  recipientName?: string;
  message: string;
  patientId?: string;
  bookingId?: string;
}

export interface SendEmailPayload {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  body: string;
  patientId?: string;
  bookingId?: string;
}

export interface MessageLogDto {
  id: string;
  channel: MessageChannel;
  recipient: string;
  recipientName?: string;
  subject?: string;
  message: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  createdAt: string;
}

export interface MessageHistoryQuery {
  channel?: MessageChannel;
  limit?: number;
}

export function sendSms(payload: SendSmsPayload) {
  return apiRequest<MessageLogDto>(url(apiEndpoints.messaging.sms), {
    method: 'POST',
    body: payload,
  });
}

export function sendEmail(payload: SendEmailPayload) {
  return apiRequest<MessageLogDto>(url(apiEndpoints.messaging.email), {
    method: 'POST',
    body: payload,
  });
}

export function getMessageHistory(query: MessageHistoryQuery = {}) {
  const params = new URLSearchParams();
  if (query.channel) params.set('channel', query.channel);
  if (query.limit) params.set('limit', String(query.limit));
  const qs = params.toString();
  return apiRequestList<MessageLogDto>(
    url(qs ? `${apiEndpoints.messaging.history}?${qs}` : apiEndpoints.messaging.history),
  );
}
