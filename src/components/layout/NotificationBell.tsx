import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationDto,
} from '@/lib/api/notifications';
import { getStoredUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

function formatRelativeTime(iso: string): string {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) return '';
  const diffMs = Date.now() - time;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(time).toLocaleDateString();
}

function typeLabel(type: string): string {
  const upper = type.toUpperCase();
  if (upper === 'APPOINTMENT') return 'Appointment';
  if (upper === 'BILLING') return 'Billing';
  if (upper === 'MEDICINE') return 'Medicine';
  if (upper === 'THERAPY') return 'Therapy';
  if (upper === 'SYSTEM') return 'System';
  return 'General';
}

function typeBadgeClass(type: string): string {
  const upper = type.toUpperCase();
  if (upper === 'APPOINTMENT') return 'bg-blue-50 text-blue-700';
  if (upper === 'BILLING') return 'bg-emerald-50 text-emerald-700';
  if (upper === 'MEDICINE') return 'bg-amber-50 text-amber-800';
  if (upper === 'THERAPY') return 'bg-purple-50 text-purple-700';
  if (upper === 'SYSTEM') return 'bg-gray-100 text-gray-700';
  return 'bg-gold/10 text-brown';
}

export function NotificationBell() {
  const user = getStoredUser();
  const userId = user?.id?.trim() || '';
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [list, count] = await Promise.all([
        getNotifications({ userId }),
        getUnreadNotificationCount(userId),
      ]);
      const sorted = [...list].sort((a, b) => {
        const aTime = Date.parse(a.createdAt) || 0;
        const bTime = Date.parse(b.createdAt) || 0;
        return bTime - aTime;
      });
      setItems(sorted);
      setUnreadCount(count);
    } catch {
      setError('Could not load notifications.');
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) void refresh();
      return next;
    });
  };

  const handleMarkRead = async (notification: NotificationDto) => {
    if (notification.read) return;
    try {
      await markNotificationRead(notification.id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, read: true, readAt: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      // Keep UI unchanged; user can retry.
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId || unreadCount === 0) return;
    try {
      await markAllNotificationsRead(userId);
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
          readAt: item.readAt ?? new Date().toISOString(),
        })),
      );
      setUnreadCount(0);
    } catch {
      // Keep UI unchanged.
    }
  };

  const handleDelete = async (notificationId: string) => {
    const target = items.find((item) => item.id === notificationId);
    try {
      await deleteNotification(notificationId);
      setItems((prev) => prev.filter((item) => item.id !== notificationId));
      if (target && !target.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
    } catch {
      // Keep UI unchanged.
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative rounded-lg p-2 text-brown-muted hover:bg-brown/5"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" strokeWidth={1.5} />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-brown">Notifications</p>
              <p className="text-xs text-text-muted">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : 'You are all caught up'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              disabled={!userId || unreadCount === 0}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {!userId ? (
              <p className="px-4 py-8 text-center text-sm text-text-muted">
                Sign in again to load notifications.
              </p>
            ) : loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-text-muted">
                Loading…
              </p>
            ) : error ? (
              <div className="space-y-2 px-4 py-8 text-center">
                <p className="text-sm text-text-muted">{error}</p>
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="text-xs font-medium text-gold hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-text-muted">
                No notifications yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map((item) => (
                  <li key={item.id}>
                    <div
                      className={cn(
                        'group flex gap-3 px-4 py-3 transition-colors hover:bg-cream/60',
                        !item.read && 'bg-gold/5',
                      )}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => void handleMarkRead(item)}
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                              typeBadgeClass(item.type),
                            )}
                          >
                            {typeLabel(item.type)}
                          </span>
                          {!item.read ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          ) : null}
                          <span className="ml-auto text-[10px] text-text-muted">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="truncate text-sm font-medium text-brown">
                          {item.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                          {item.message}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id)}
                        className="mt-1 shrink-0 self-start rounded-lg p-1.5 text-text-muted opacity-0 hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
