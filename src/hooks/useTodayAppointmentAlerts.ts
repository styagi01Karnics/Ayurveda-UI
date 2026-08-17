import { useEffect, useRef } from 'react';
import { useToast } from '@/app/ToastContext';
import { getTodayAppointments } from '@/lib/api/appointments';
import {
  APPOINTMENT_REMINDER_MINUTES,
  isAppointmentWithinMinutes,
  parseScheduleDateTime,
} from '@/lib/appointmentAlerts';
import { mapTodayAppointmentToScheduleItem } from '@/lib/api/mappers';

const POLL_INTERVAL_MS = 30_000;

export function useTodayAppointmentAlerts(enabled = true) {
  const { showToast } = useToast();
  const notifiedIds = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const checkAppointments = async () => {
      try {
        const today = await getTodayAppointments().catch(() => ({
          appointments: [],
        }));
        if (cancelled) return;

        const now = new Date();
        for (const item of today.appointments ?? []) {
          if (item.bookingStatus?.toUpperCase().includes('COMPLETE')) continue;
          if (item.bookingStatus?.toUpperCase().includes('CANCEL')) continue;

          const scheduledAt = parseScheduleDateTime(
            item.slotTime,
            item.bookingTime,
            now,
          );
          if (!scheduledAt) continue;
          if (!isAppointmentWithinMinutes(scheduledAt, APPOINTMENT_REMINDER_MINUTES, now)) {
            continue;
          }
          if (notifiedIds.current.has(item.bookingId)) continue;

          notifiedIds.current.add(item.bookingId);
          const mapped = mapTodayAppointmentToScheduleItem(item);
          showToast({
            title: 'Upcoming appointment',
            message: `${mapped.patient}'s ${mapped.visitType.toLowerCase()} starts at ${mapped.time} (within ${APPOINTMENT_REMINDER_MINUTES} minutes).`,
          });
        }
      } catch {
        // ignore polling errors
      }
    };

    void checkAppointments();
    const timer = window.setInterval(checkAppointments, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, showToast]);
}
