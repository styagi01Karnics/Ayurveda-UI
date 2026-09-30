import { useState } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/app/ToastContext';
import { Toggle } from '@/components/ui/Toggle';
import { defaultSystemPreferences } from '@/data/mock/settings';
import { cn } from '@/lib/utils';
import type { SystemPreferences } from '@/types';

export function SystemPreferenceTab() {
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState<SystemPreferences>(
    defaultSystemPreferences,
  );

  const updatePreference = (key: keyof SystemPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    showToast({
      title: 'Preference Updated',
      message: 'System preference has been saved.',
    });
  };

  return (
    <div className="space-y-8">
      <PreferenceSection title="Appointment Settings" columns="sm:grid-cols-3">
        <Toggle
          label="SMS"
          checked={preferences.appointmentSms}
          onChange={(v) => updatePreference('appointmentSms', v)}
          showStateLabel
        />
        <Toggle
          label="Whatsapp"
          checked={preferences.appointmentWhatsapp}
          onChange={(v) => updatePreference('appointmentWhatsapp', v)}
          showStateLabel
        />
        <Toggle
          label="Email"
          checked={preferences.appointmentEmail}
          onChange={(v) => updatePreference('appointmentEmail', v)}
          showStateLabel
        />
      </PreferenceSection>

      <PreferenceSection title="Billing Settings" columns="sm:grid-cols-3">
        <Toggle
          label="Enable GST"
          checked={preferences.billingGst}
          onChange={(v) => updatePreference('billingGst', v)}
          showStateLabel
        />
        <Toggle
          label="Partial Payment"
          checked={preferences.billingPartialPayment}
          onChange={(v) => updatePreference('billingPartialPayment', v)}
          showStateLabel
        />
      </PreferenceSection>

      <PreferenceSection title="Notification Settings" columns="sm:grid-cols-3">
        <Toggle
          label="Patient Appointment Reminder"
          checked={preferences.notificationAppointmentReminder}
          onChange={(v) => updatePreference('notificationAppointmentReminder', v)}
          showStateLabel
        />
        <Toggle
          label="Follow up reminder"
          checked={preferences.notificationFollowUpReminder}
          onChange={(v) => updatePreference('notificationFollowUpReminder', v)}
          showStateLabel
        />
      </PreferenceSection>
    </div>
  );
}

function PreferenceSection({
  title,
  columns,
  children,
}: {
  title: string;
  columns: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 text-base font-semibold text-brown">{title}</h3>
      <div className={cn('grid gap-4', columns)}>{children}</div>
    </section>
  );
}
