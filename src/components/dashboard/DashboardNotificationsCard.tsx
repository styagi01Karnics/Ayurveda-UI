import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import {
  getNotifications,
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
  return days < 7 ? `${days}d ago` : new Date(time).toLocaleDateString();
}

export function DashboardNotificationsCard() {
  const userId = getStoredUser()?.id?.trim() || '';
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getNotifications({ userId });
      const sorted = [...list].sort((a, b) => {
        const aTime = Date.parse(a.createdAt) || 0;
        const bTime = Date.parse(b.createdAt) || 0;
        return bTime - aTime;
      });
      setItems(sorted.slice(0, 5));
    } catch {
      setError('Unable to load notifications.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleOpen = async (item: NotificationDto) => {
    if (item.read) return;
    try {
      await markNotificationRead(item.id);
      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? { ...row, read: true, readAt: new Date().toISOString() }
            : row,
        ),
      );
    } catch {
      // Ignore; list stays as-is.
    }
  };

  return (
    <Card className="flex h-full min-h-0 flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-gold/10 p-2 text-gold">
            <Bell className="h-4 w-4" />
          </span>
          <h3 className="font-semibold text-brown">Notifications</h3>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs font-medium text-gold hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="min-h-0 flex-1">
        {!userId ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Sign in to see notifications.
          </p>
        ) : loading && items.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">Loading…</p>
        ) : error ? (
          <p className="py-6 text-center text-sm text-text-muted">{error}</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            No notifications yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => void handleOpen(item)}
                  className={cn(
                    'w-full rounded-lg px-1 py-2.5 text-left hover:bg-cream/70',
                    !item.read && 'bg-gold/5',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium text-brown">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-text-muted">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                    {item.message}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
