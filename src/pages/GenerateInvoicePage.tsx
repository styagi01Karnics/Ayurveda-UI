import { useMemo, useState } from 'react';
import { Link2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingBreadcrumbs } from '@/components/billing/BillingBreadcrumbs';
import { PaymentSuccessModal } from '@/components/billing/PaymentSuccessModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { PAYMENT_MODES } from '@/data/mock/billing';
import { getPatientByRecordId } from '@/data/mock/patients';
import {
  calculateInvoiceTotals,
  invoiceMedicineItemSchema,
  invoiceServiceStepSchema,
  invoiceSummarySchema,
  invoiceTherapyItemSchema,
  PACKAGE_TYPE_OPTIONS,
  QUANTITY_OPTIONS,
  THERAPIST_OPTIONS,
  THERAPY_NAME_OPTIONS,
  VISIT_TYPE_OPTIONS,
  type InvoiceMedicineItemValues,
  type InvoiceServiceStepValues,
  type InvoiceSummaryValues,
  type InvoiceTherapyItemValues,
} from '@/lib/validation/billing.schema';
import { MEDICINE_NAME_OPTIONS } from '@/lib/validation/medicine.schema';
import { formatCurrency } from '@/lib/utils';
import type { InvoiceLineItem, InvoiceStep, PaymentModeId } from '@/types';

const STEPS: { id: InvoiceStep; label: string }[] = [
  { id: 'service', label: 'Service Type' },
  { id: 'medicine', label: 'Medicine' },
  { id: 'therapy', label: 'Therapy' },
  { id: 'summary', label: 'Summary' },
];

const STEP_ORDER: InvoiceStep[] = ['service', 'medicine', 'therapy', 'summary'];

export function GenerateInvoicePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [phase, setPhase] = useState<'form' | 'payment'>('form');
  const [step, setStep] = useState<InvoiceStep>('service');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);
  const [serviceData, setServiceData] = useState<InvoiceServiceStepValues | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentModeId>('upi');
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);

  const serviceForm = useForm<InvoiceServiceStepValues>({
    resolver: zodResolver(invoiceServiceStepSchema),
    defaultValues: {
      patientId: '#PT458652',
      fullName: 'Khushi Shroff',
      contactNumber: '9205061339',
      invoiceDate: '2026-10-15',
      visitType: 'Consultation',
      serviceFees: '800',
      packageType: 'Monthly',
      packageCharges: '800',
    },
  });

  const medicineForm = useForm<InvoiceMedicineItemValues>({
    resolver: zodResolver(invoiceMedicineItemSchema),
    defaultValues: { medicineName: '', quantity: '1', price: '200' },
  });

  const therapyForm = useForm<InvoiceTherapyItemValues>({
    resolver: zodResolver(invoiceTherapyItemSchema),
    defaultValues: {
      therapyName: '',
      therapyPrice: '800',
      assignedTherapist: '',
      scheduleDate: '',
      scheduleTime: '',
      sessionDuration: '60 mins',
      sessionFrequency: 'Weekly',
    },
  });

  const summaryForm = useForm<InvoiceSummaryValues>({
    resolver: zodResolver(invoiceSummarySchema),
    defaultValues: { discount: '400', applyTax: true, cgst: '3', sgst: '3' },
  });

  const applyTax = summaryForm.watch('applyTax');
  const discount = Number(summaryForm.watch('discount') || 0);
  const cgstRate = Number(summaryForm.watch('cgst') || 3);
  const sgstRate = Number(summaryForm.watch('sgst') || 3);

  const totals = useMemo(
    () =>
      calculateInvoiceTotals(lineItems, discount, applyTax, cgstRate, sgstRate),
    [lineItems, discount, applyTax, cgstRate, sgstRate],
  );

  const previewPatient = serviceData
    ? getPatientByRecordId(serviceData.patientId.replace('#', ''))
    : getPatientByRecordId('PT458652');

  const syncServiceLineItems = (data: InvoiceServiceStepValues) => {
    setServiceData(data);
    setLineItems((prev) => {
      const withoutService = prev.filter((item) => item.type !== 'service');
      return [
        {
          id: 'svc-1',
          name: 'Treatments',
          quantity: 1,
          amount: Number(data.serviceFees),
          type: 'service',
        },
        {
          id: 'svc-2',
          name: data.packageType,
          quantity: 1,
          amount: Number(data.packageCharges),
          type: 'service',
        },
        ...withoutService.filter((i) => i.type !== 'service'),
      ];
    });
  };

  const handleServiceNext = serviceForm.handleSubmit((data) => {
    syncServiceLineItems(data);
    setStep('medicine');
  });

  const handleAddMedicine = medicineForm.handleSubmit((data) => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: data.medicineName,
        quantity: Number(data.quantity),
        amount: Number(data.price),
        type: 'medicine',
      },
    ]);
    medicineForm.reset({ medicineName: '', quantity: '1', price: '200' });
  });

  const handleAddTherapy = therapyForm.handleSubmit((data) => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `th-${Date.now()}`,
        name: data.therapyName,
        quantity: 1,
        amount: Number(data.therapyPrice),
        type: 'therapy',
      },
    ]);
    therapyForm.reset({
      therapyName: '',
      therapyPrice: '800',
      assignedTherapist: '',
      scheduleDate: '',
      scheduleTime: '',
      sessionDuration: '60 mins',
      sessionFrequency: 'Weekly',
    });
  });

  const goToPayment = () => {
    if (!serviceData) {
      serviceForm.handleSubmit((data) => {
        syncServiceLineItems(data);
        setPhase('payment');
      })();
      return;
    }
    setPhase('payment');
  };

  const handleGeneratePaymentLink = () => {
    setPaymentSuccessOpen(true);
    showToast({
      title: 'Payment Link Generated',
      message: 'Payment link has been sent to the patient.',
    });
  };

  const handleStepChange = (next: InvoiceStep) => {
    if (step === 'service' && next !== 'service') {
      serviceForm.handleSubmit((data) => {
        syncServiceLineItems(data);
        setStep(next);
      })();
      return;
    }
    setStep(next);
  };

  const removeLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (phase === 'payment') {
    return (
      <div className="space-y-5">
        <BillingBreadcrumbs />
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brown">Final Billing Summary</h2>
              <p className="mt-1 text-sm text-text-muted">Bill ID: #Bill123456789</p>
            </div>
            <Badge variant="danger">Unpaid</Badge>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Bill To" value="Ganesha Ayurvedaa" />
            <InfoItem
              label="Bill Date & Time"
              value="15 Oct 2026, 01:05 AM"
            />
            <InfoItem label="Patient ID" value={serviceData?.patientId ?? '#PT458652'} />
            <InfoItem label="Patient Name" value={serviceData?.fullName ?? 'Khushi Shroff'} />
          </div>

          <LineItemsTable items={lineItems} />

          <div className="mt-4 space-y-2 text-sm">
            <TotalRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
            <TotalRow label="Tax (3% on Subtotal)" value={formatCurrency(totals.tax)} />
            <TotalRow label="Discount" value={`-${formatCurrency(discount)}`} className="text-success" />
            <TotalRow label="Total" value={formatCurrency(totals.total)} bold />
          </div>

          <div className="mt-8 rounded-xl border border-gray-100 p-4">
            <h3 className="mb-4 font-semibold text-brown">Select Mode of Payment</h3>
            <div className="space-y-3">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedPayment(mode.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                    selectedPayment === mode.id
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-100 hover:border-gold/30'
                  }`}
                >
                  <div>
                    <p className="font-medium text-brown">{mode.title}</p>
                    <p className="text-xs text-text-muted">{mode.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brown">
                      {formatCurrency(mode.amount)}
                    </p>
                    <p className="text-xs text-gold">Extra 1% off</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPhase('form')}>
              Back
            </Button>
            <Button variant="outline" onClick={() => setInvoicePreviewOpen(true)}>
              Preview Invoice
            </Button>
            <Button onClick={handleGeneratePaymentLink}>
              Generate Payment Link
            </Button>
          </div>
        </Card>

        <PaymentSuccessModal
          open={paymentSuccessOpen}
          onClose={() => {
            setPaymentSuccessOpen(false);
            navigate('/billing');
          }}
          amount={
            PAYMENT_MODES.find((m) => m.id === selectedPayment)?.amount ?? totals.total
          }
        />

        <BillInvoiceModal
          open={invoicePreviewOpen}
          onClose={() => setInvoicePreviewOpen(false)}
          patient={previewPatient ?? null}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BillingBreadcrumbs />

      <Card className="p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-brown">Generate Invoice</h2>
          <p className="text-sm text-text-muted">
            Please fill out the details to generate invoice
          </p>
        </div>

        <UnderlineTabs tabs={STEPS} activeTab={step} onChange={handleStepChange} />

        <div className="mt-8">
          {step === 'service' && (
            <form className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Patient ID" error={serviceForm.formState.errors.patientId?.message} {...serviceForm.register('patientId')} />
                <Input label="Full Name" error={serviceForm.formState.errors.fullName?.message} {...serviceForm.register('fullName')} />
                <Input label="Contact Number" error={serviceForm.formState.errors.contactNumber?.message} {...serviceForm.register('contactNumber')} />
                <Input label="Invoice Date" type="date" error={serviceForm.formState.errors.invoiceDate?.message} {...serviceForm.register('invoiceDate')} />
                <Select label="Visit Type" options={[...VISIT_TYPE_OPTIONS]} error={serviceForm.formState.errors.visitType?.message} {...serviceForm.register('visitType')} />
                <Input label="Service Fees (₹)" error={serviceForm.formState.errors.serviceFees?.message} {...serviceForm.register('serviceFees')} />
                <Select label="Package Type" options={[...PACKAGE_TYPE_OPTIONS]} error={serviceForm.formState.errors.packageType?.message} {...serviceForm.register('packageType')} />
                <Input label="Package Charges (₹)" error={serviceForm.formState.errors.packageCharges?.message} {...serviceForm.register('packageCharges')} />
              </div>
            </form>
          )}

          {step === 'medicine' && (
            <div className="space-y-6">
              <FormSection title="Add Medicine">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select label="Medicine Name" options={[...MEDICINE_NAME_OPTIONS]} error={medicineForm.formState.errors.medicineName?.message} {...medicineForm.register('medicineName')} />
                  <Select label="Quantity" options={[...QUANTITY_OPTIONS]} error={medicineForm.formState.errors.quantity?.message} {...medicineForm.register('quantity')} />
                  <Input label="Price (₹)" error={medicineForm.formState.errors.price?.message} {...medicineForm.register('price')} />
                </div>
                <Button type="button" variant="outline" className="mt-4" onClick={handleAddMedicine}>
                  + Add More Medicine
                </Button>
              </FormSection>
              <LineItemsTable
                items={lineItems.filter((i) => i.type === 'medicine')}
                onRemove={removeLineItem}
              />
              <SubtotalRow items={lineItems.filter((i) => i.type === 'medicine')} />
            </div>
          )}

          {step === 'therapy' && (
            <div className="space-y-6">
              <FormSection title="Therapy Treatment">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select label="Therapy name" options={[...THERAPY_NAME_OPTIONS]} error={therapyForm.formState.errors.therapyName?.message} {...therapyForm.register('therapyName')} />
                  <Input label="Therapy Price (₹)" error={therapyForm.formState.errors.therapyPrice?.message} {...therapyForm.register('therapyPrice')} />
                  <Select label="Assigned Therapist" options={[...THERAPIST_OPTIONS]} error={therapyForm.formState.errors.assignedTherapist?.message} {...therapyForm.register('assignedTherapist')} />
                </div>
              </FormSection>
              <FormSection title="Therapy Schedule">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Input label="Schedule Date" type="date" error={therapyForm.formState.errors.scheduleDate?.message} {...therapyForm.register('scheduleDate')} />
                  <Input label="Schedule Time" type="time" error={therapyForm.formState.errors.scheduleTime?.message} {...therapyForm.register('scheduleTime')} />
                  <Input label="Session Duration" error={therapyForm.formState.errors.sessionDuration?.message} {...therapyForm.register('sessionDuration')} />
                  <Input label="Session Frequency" error={therapyForm.formState.errors.sessionFrequency?.message} {...therapyForm.register('sessionFrequency')} />
                </div>
                <Button type="button" variant="outline" className="mt-4" onClick={handleAddTherapy}>
                  + Add More Therapy
                </Button>
              </FormSection>
              <LineItemsTable
                items={lineItems.filter((i) => i.type === 'therapy')}
                onRemove={removeLineItem}
              />
              <SubtotalRow items={lineItems.filter((i) => i.type === 'therapy')} />
            </div>
          )}

          {step === 'summary' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brown">Billing Summary</h3>
                <Badge variant="danger">Unpaid</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem label="Bill To" value="Ganesha Ayurvedaa" />
                <InfoItem label="Bill Date & Time" value="15 Oct 2026, 01:05 AM" />
                <InfoItem label="Patient ID" value={serviceData?.patientId ?? serviceForm.watch('patientId')} />
                <InfoItem label="Patient Name" value={serviceData?.fullName ?? serviceForm.watch('fullName')} />
              </div>
              <LineItemsTable items={lineItems} onRemove={removeLineItem} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Input label="Discount (if any) (₹)" {...summaryForm.register('discount')} />
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-brown">
                    <input type="checkbox" className="rounded border-gray-300 text-gold focus:ring-gold" {...summaryForm.register('applyTax')} />
                    CGST & SGST
                  </label>
                  {applyTax && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <Input label="CGST (%)" {...summaryForm.register('cgst')} />
                      <Input label="SGST (%)" {...summaryForm.register('sgst')} />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <TotalRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
                <TotalRow label="Tax (3% on Subtotal)" value={`+${formatCurrency(totals.cgst)}`} />
                <TotalRow label="Tax (3% on Subtotal)" value={`+${formatCurrency(totals.sgst)}`} />
                <TotalRow label="Discount" value={`-${formatCurrency(discount)}`} className="text-success" />
                <TotalRow label="Total" value={formatCurrency(totals.total)} bold />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {step !== 'service' && (
            <Button
              variant="outline"
              onClick={() => {
                const idx = STEP_ORDER.indexOf(step);
                if (idx > 0) setStep(STEP_ORDER[idx - 1]);
              }}
            >
              Back
            </Button>
          )}
          {step === 'therapy' ? (
            <Button
              onClick={therapyForm.handleSubmit(() => setStep('summary'))}
            >
              Confirm
            </Button>
          ) : step === 'summary' ? (
            <Button onClick={goToPayment}>Make Payment</Button>
          ) : (
            <>
              <Button onClick={step === 'service' ? handleServiceNext : () => setStep(STEP_ORDER[STEP_ORDER.indexOf(step) + 1])}>
                Next
              </Button>
              <Button onClick={goToPayment}>Make Payment</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brown">{title}</h3>
        <button type="button" className="text-text-muted" aria-label={`Close ${title}`}>
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-brown">{value}</p>
    </div>
  );
}

function LineItemsTable({
  items,
  onRemove,
}: {
  items: InvoiceLineItem[];
  onRemove?: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl bg-gray-50">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-text-muted">
            <th className="px-4 py-3 text-left font-medium">Bill Name</th>
            <th className="px-4 py-3 text-left font-medium">Quantity</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            {onRemove && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium text-brown">
                <span className="inline-flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-gold" />
                  {item.name}
                </span>
              </td>
              <td className="px-4 py-3 text-brown">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-brown">
                {formatCurrency(item.amount * item.quantity)}
              </td>
              {onRemove && (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="text-text-muted hover:text-danger"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubtotalRow({ items }: { items: InvoiceLineItem[] }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0,
  );
  if (items.length === 0) return null;
  return (
    <div className="flex justify-between border-t border-dashed border-gray-200 pt-4 text-sm">
      <span className="text-text-muted">Subtotal</span>
      <span className="font-bold text-brown">{formatCurrency(subtotal)}</span>
    </div>
  );
}

function TotalRow({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-bold' : ''}`}>
      <span className="text-text-muted">{label}</span>
      <span className={className ?? 'text-brown'}>{value}</span>
    </div>
  );
}
