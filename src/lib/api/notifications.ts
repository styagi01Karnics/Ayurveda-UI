import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.notification}${path}`;
const ep = apiEndpoints.notifications;

export type NotificationTypeApi =
  | 'APPOINTMENT'
  | 'BILLING'
  | 'MEDICINE'
  | 'THERAPY'
  | 'SYSTEM'
  | 'GENERAL';

export type NotificationPriorityApi = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface NotificationDto {
  id: string;
  recipientUserId: string;
  recipientUserName?: string;
  recipientRole?: string;
  title: string;
  message: string;
  type: NotificationTypeApi | string;
  priority: NotificationPriorityApi | string;
  referenceId?: string | null;
  referenceType?: string | null;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface CreateNotificationPayload {
  recipientUserId: string;
  recipientUserName?: string;
  recipientRole?: string;
  title: string;
  message: string;
  type: NotificationTypeApi | string;
  priority: NotificationPriorityApi | string;
  referenceId?: string;
  referenceType?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface NotificationsQuery {
  userId: string;
  unreadOnly?: boolean;
  type?: NotificationTypeApi | string;
}

export interface UnreadCountDto {
  unreadCount: number;
}

export function getNotifications(query: NotificationsQuery) {
  const params = new URLSearchParams({ userId: query.userId });
  if (query.unreadOnly) params.set('unreadOnly', 'true');
  if (query.type) params.set('type', query.type);
  return apiRequestList<NotificationDto>(
    url(`${ep.base}?${params.toString()}`),
  );
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const data = await apiRequest<UnreadCountDto | number>(
    url(`${ep.unreadCount}?userId=${encodeURIComponent(userId)}`),
  );
  if (typeof data === 'number') return data;
  return Number(data?.unreadCount ?? 0);
}

export function getNotificationById(id: string) {
  return apiRequest<NotificationDto>(url(ep.byId(id)));
}

export function createNotification(payload: CreateNotificationPayload) {
  return apiRequest<NotificationDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}

export function sendEmail(payload: SendEmailPayload) {
  return apiRequest<void>(url(ep.email), {
    method: 'POST',
    body: payload,
  });
}

export function markNotificationRead(id: string) {
  return apiRequest<NotificationDto>(url(ep.markRead(id)), { method: 'PUT' });
}

export function markAllNotificationsRead(userId: string) {
  return apiRequest<void>(
    url(`${ep.markAllRead}?userId=${encodeURIComponent(userId)}`),
    { method: 'PUT' },
  );
}

export function deleteNotification(id: string) {
  return apiRequest<void>(url(ep.byId(id)), { method: 'DELETE' });
}
