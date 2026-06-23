import { useState } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/app/ToastContext';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { defaultSystemPreferences } from '@/data/mock/settings';
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
    <div className="space-y-6">
      <PreferenceSection title="Appointment Settings">
        <Toggle
          label="SMS"
          checked={preferences.appointmentSms}
          onChange={(v) => updatePreference('appointmentSms', v)}
        />
        <Toggle
          label="Whatsapp"
          checked={preferences.appointmentWhatsapp}
          onChange={(v) => updatePreference('appointmentWhatsapp', v)}
        />
        <Toggle
          label="Email"
          checked={preferences.appointmentEmail}
          onChange={(v) => updatePreference('appointmentEmail', v)}
        />
      </PreferenceSection>

      <PreferenceSection title="Billing Settings">
        <Toggle
          label="Enable GST"
          checked={preferences.billingGst}
          onChange={(v) => updatePreference('billingGst', v)}
        />
        <Toggle
          label="Partial Payment"
          checked={preferences.billingPartialPayment}
          onChange={(v) => updatePreference('billingPartialPayment', v)}
        />
      </PreferenceSection>

      <PreferenceSection title="Notification Settings">
        <Toggle
          label="Patient Appointment Reminder"
          checked={preferences.notificationAppointmentReminder}
          onChange={(v) => updatePreference('notificationAppointmentReminder', v)}
        />
        <Toggle
          label="Follow up reminder"
          checked={preferences.notificationFollowUpReminder}
          onChange={(v) => updatePreference('notificationFollowUpReminder', v)}
        />
      </PreferenceSection>
    </div>
  );
}

function PreferenceSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-base font-semibold text-brown">{title}</h3>
      <div className="space-y-2">{children}</div>
    </Card>
  );
}
