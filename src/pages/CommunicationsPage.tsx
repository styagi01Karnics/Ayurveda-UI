import { useCallback, useEffect, useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageShell } from '@/components/layout/PageShell';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAppFeedback } from '@/hooks/useAppFeedback';
import {
  getMessageHistory,
  sendEmail,
  sendSms,
  type MessageChannel,
  type MessageLogDto,
} from '@/lib/api/messaging';
import { UI_MESSAGES } from '@/lib/uiMessages';
import { cn } from '@/lib/utils';

type Tab = 'sms' | 'email';

const SMS_MAX = 160;

export function CommunicationsPage() {
  const { showSuccess, showError } = useAppFeedback();
  const [tab, setTab] = useState<Tab>('sms');
  const [history, setHistory] = useState<MessageLogDto[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [smsForm, setSmsForm] = useState({
    recipientPhone: '',
    recipientName: '',
    message: '',
  });
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    recipientName: '',
    subject: '',
    body: '',
  });

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const rows = await getMessageHistory({ limit: 50 });
      setHistory(rows);
    } catch (error) {
      setHistory([]);
      setHistoryError(UI_MESSAGES.error.loadFailed);
      showError(error, UI_MESSAGES.error.loadFailed);
    } finally {
      setLoadingHistory(false);
    }
  }, [showError]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const resetForm = () => {
    if (tab === 'sms') {
      setSmsForm({ recipientPhone: '', recipientName: '', message: '' });
    } else {
      setEmailForm({
        recipientEmail: '',
        recipientName: '',
        subject: '',
        body: '',
      });
    }
  };

  const validateForm = (): string | null => {
    if (tab === 'sms') {
      if (!smsForm.recipientPhone.trim()) return 'Recipient phone is required.';
      if (!smsForm.message.trim()) return 'SMS message is required.';
      if (smsForm.message.length > SMS_MAX) {
        return `SMS must be ${SMS_MAX} characters or fewer.`;
      }
      return null;
    }
    if (!emailForm.recipientEmail.trim()) return 'Recipient email is required.';
    if (!emailForm.subject.trim()) return 'Email subject is required.';
    if (!emailForm.body.trim()) return 'Email body is required.';
    return null;
  };

  const handleSend = async () => {
    const validationError = validateForm();
    if (validationError) {
      showError(new Error(validationError), validationError);
      return;
    }

    setSubmitting(true);
    try {
      if (tab === 'sms') {
        await sendSms({
          recipientPhone: smsForm.recipientPhone.trim(),
          recipientName: smsForm.recipientName.trim() || undefined,
          message: smsForm.message.trim(),
        });
        showSuccess('SMS Sent', UI_MESSAGES.success.smsSent);
      } else {
        await sendEmail({
          recipientEmail: emailForm.recipientEmail.trim(),
          recipientName: emailForm.recipientName.trim() || undefined,
          subject: emailForm.subject.trim(),
          body: emailForm.body.trim(),
        });
        showSuccess('Email Sent', UI_MESSAGES.success.emailSent);
      }
      setConfirmOpen(false);
      resetForm();
      await loadHistory();
    } catch (error) {
      showError(error, UI_MESSAGES.error.messagingFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredHistory = history.filter((row) =>
    tab === 'sms' ? row.channel === 'SMS' : row.channel === 'EMAIL',
  );

  return (
    <PageShell className="space-y-6">
      <section className="rounded-[28px] border border-[#e8dfd0] bg-gradient-to-br from-[#faf6ee] via-white to-[#f5ecda] px-6 py-8 sm:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dark ring-1 ring-gold/15">
          <MessageSquare className="h-3.5 w-3.5" />
          Communications
        </span>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-brown">
          SMS & Email Service
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Send appointment reminders, follow-up notes, and clinic updates directly
          to patients via SMS or email.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <div className="mb-5 flex gap-2 rounded-xl bg-cream/60 p-1">
            <TabButton
              active={tab === 'sms'}
              onClick={() => setTab('sms')}
              icon={MessageSquare}
              label="SMS"
            />
            <TabButton
              active={tab === 'email'}
              onClick={() => setTab('email')}
              icon={Mail}
              label="Email"
            />
          </div>

          {tab === 'sms' ? (
            <div className="space-y-4">
              <Input
                label="Recipient Phone"
                placeholder="+91 98765 43210"
                value={smsForm.recipientPhone}
                onChange={(e) =>
                  setSmsForm((prev) => ({
                    ...prev,
                    recipientPhone: e.target.value,
                  }))
                }
              />
              <Input
                label="Recipient Name (optional)"
                placeholder="Patient name"
                value={smsForm.recipientName}
                onChange={(e) =>
                  setSmsForm((prev) => ({
                    ...prev,
                    recipientName: e.target.value,
                  }))
                }
              />
              <div>
                <Textarea
                  label="Message"
                  rows={5}
                  placeholder="Your appointment is confirmed for tomorrow at 10:30 AM."
                  value={smsForm.message}
                  onChange={(e) =>
                    setSmsForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                />
                <p
                  className={cn(
                    'mt-1 text-right text-xs',
                    smsForm.message.length > SMS_MAX
                      ? 'text-danger'
                      : 'text-text-muted',
                  )}
                >
                  {smsForm.message.length}/{SMS_MAX}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Recipient Email"
                type="email"
                placeholder="patient@example.com"
                value={emailForm.recipientEmail}
                onChange={(e) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    recipientEmail: e.target.value,
                  }))
                }
              />
              <Input
                label="Recipient Name (optional)"
                placeholder="Patient name"
                value={emailForm.recipientName}
                onChange={(e) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    recipientName: e.target.value,
                  }))
                }
              />
              <Input
                label="Subject"
                placeholder="Appointment reminder"
                value={emailForm.subject}
                onChange={(e) =>
                  setEmailForm((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
              <Textarea
                label="Message"
                rows={8}
                placeholder="Dear patient, this is a reminder for your upcoming visit…"
                value={emailForm.body}
                onChange={(e) =>
                  setEmailForm((prev) => ({ ...prev, body: e.target.value }))
                }
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="gap-2"
              onClick={() => {
                const err = validateForm();
                if (err) {
                  showError(new Error(err), err);
                  return;
                }
                setConfirmOpen(true);
              }}
              disabled={submitting}
            >
              <Send className="h-4 w-4" />
              Send {tab === 'sms' ? 'SMS' : 'Email'}
            </Button>
            <Button variant="outline" onClick={resetForm} disabled={submitting}>
              Clear
            </Button>
          </div>
        </Card>

        <Card className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-brown">Sent Messages</h2>
              <p className="text-xs text-text-muted">
                Recent {tab === 'sms' ? 'SMS' : 'email'} delivery history
              </p>
            </div>
            <Button variant="outline" className="px-3 py-2 text-xs" onClick={() => void loadHistory()}>
              Refresh
            </Button>
          </div>

          <AsyncStatus
            loading={loadingHistory}
            error={historyError}
            onRetry={() => void loadHistory()}
            empty={filteredHistory.length === 0}
            emptyMessage={UI_MESSAGES.empty.communications}
          >
            <div className="max-h-[520px] space-y-3 overflow-y-auto">
              {filteredHistory.map((row) => (
                <MessageHistoryRow key={row.id} row={row} />
              ))}
            </div>
          </AsyncStatus>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSend}
        title={
          tab === 'sms'
            ? UI_MESSAGES.confirm.sendSmsTitle
            : UI_MESSAGES.confirm.sendEmailTitle
        }
        message={
          tab === 'sms'
            ? UI_MESSAGES.confirm.sendSmsMessage
            : UI_MESSAGES.confirm.sendEmailMessage
        }
        confirmLabel="Send"
        variant="warning"
        submitting={submitting}
      />
    </PageShell>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof MessageSquare;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-white text-brown shadow-sm ring-1 ring-[#f0ebe3]'
          : 'text-text-muted hover:text-brown',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function MessageHistoryRow({ row }: { row: MessageLogDto }) {
  const channelLabel: Record<MessageChannel, string> = {
    SMS: 'SMS',
    EMAIL: 'Email',
  };

  return (
    <article className="rounded-xl border border-[#f0ebe3] bg-cream/30 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-brown">
            {row.recipientName ? `${row.recipientName} · ` : ''}
            {row.recipient}
          </p>
          {row.subject && (
            <p className="mt-0.5 text-xs font-medium text-brown">{row.subject}</p>
          )}
          <p className="mt-1 line-clamp-2 text-xs text-text-muted">{row.message}</p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-brown/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-brown">
            {channelLabel[row.channel]}
          </span>
          <p className="mt-1 text-[10px] text-text-muted">
            {new Date(row.createdAt).toLocaleString()}
          </p>
          <p className="text-[10px] font-medium text-success">{row.status}</p>
        </div>
      </div>
    </article>
  );
}
