import { useMemo, useState } from 'react';
import { Link2, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingBreadcrumbs } from '@/components/billing/BillingBreadcrumbs';
import { PaymentSuccessModal, mapInvoiceToPaymentSuccess, type PaymentSuccessDetails } from '@/components/billing/PaymentSuccessModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RupeeInput } from '@/components/ui/RupeeInput';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { PAYMENT_MODES } from '@/data/mock/billing';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAllTherapies } from '@/lib/api/appointments';
import { createInvoice, type VisitTypeApi } from '@/lib/api/billing';
import { ApiError } from '@/lib/api/client';
import { getAllMedicines } from '@/lib/api/medicines';
import { getAllPatients } from '@/lib/api/patients';
import { getAllTherapists } from '@/lib/api/therapists';
import {
  calculateInvoiceTotals,
  invoiceMedicineItemSchema,
  invoiceServiceStepSchema,
  invoiceSummarySchema,
  invoiceTherapyItemSchema,
  PACKAGE_TYPE_OPTIONS,
  QUANTITY_OPTIONS,
  VISIT_TYPE_OPTIONS,
  type InvoiceMedicineItemValues,
  type InvoiceServiceStepValues,
  type InvoiceSummaryValues,
  type InvoiceTherapyItemValues,
} from '@/lib/validation/billing.schema';
import { formatCurrency } from '@/lib/utils';
import type {
  BillSummaryState,
  InvoiceBillType,
  InvoiceLineItem,
  PaymentModeId,
  TherapyInvoiceLineItem,
} from '@/types';

const BILL_TABS: { id: InvoiceBillType; label: string }[] = [
  { id: 'service', label: 'Service Type' },
  { id: 'medicine', label: 'Medicine' },
  { id: 'therapy', label: 'Therapy' },
];

const BILL_ORDER: InvoiceBillType[] = ['service', 'medicine', 'therapy'];

const DEFAULT_SUMMARY: BillSummaryState = {
  discount: '0',
  applyTax: true,
  cgst: '3',
  sgst: '3',
};

const BILL_LABELS: Record<InvoiceBillType, string> = {
  service: 'Service Bill',
  medicine: 'Medicine Bill',
  therapy: 'Therapy Bill',
};

interface InvoicePatientContext {
  uuid: string;
  displayId: string;
  patientCode: string;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeInvoiceTime(time: string): string {
  if (!time) return '10:00:00';
  return time.length === 5 ? `${time}:00` : time;
}

function toApiVisitType(visitType: string): VisitTypeApi {
  const upper = visitType.toUpperCase();
  if (upper.includes('THERAPY')) return 'THERAPY';
  if (upper.includes('FOLLOW')) return 'FOLLOW_UP';
  if (upper.includes('PACKAGE')) return 'PACKAGE';
  return 'CONSULTATION';
}

function parseSessionMinutes(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 45;
}

function parseSessionFrequency(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

function buildServiceLineItems(data: InvoiceServiceStepValues): InvoiceLineItem[] {
  const items: InvoiceLineItem[] = [];
  const serviceFees = Number(data.serviceFees) || 0;

  if (data.serviceFees.trim() && serviceFees >= 0) {
    items.push({
      id: 'svc-consultation',
      name: data.visitType?.trim() || 'Consultation',
      quantity: 1,
      amount: serviceFees,
      type: 'service',
    });
  }

  const packageType = data.packageType?.trim();
  if (packageType) {
    items.push({
      id: 'svc-package',
      name: packageType,
      quantity: 1,
      amount: Number(data.packageCharges) || 0,
      type: 'service',
    });
  }

  return items;
}

export function GenerateInvoicePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeBill, setActiveBill] = useState<InvoiceBillType>('service');
  const [serviceData, setServiceData] = useState<InvoiceServiceStepValues | null>(
    null,
  );
  const [medicineItems, setMedicineItems] = useState<InvoiceLineItem[]>([]);
  const [therapyItems, setTherapyItems] = useState<TherapyInvoiceLineItem[]>([]);
  const [summaries, setSummaries] = useState<Record<InvoiceBillType, BillSummaryState>>({
    service: { ...DEFAULT_SUMMARY },
    medicine: { ...DEFAULT_SUMMARY },
    therapy: { ...DEFAULT_SUMMARY },
  });
  const [paymentBill, setPaymentBill] = useState<InvoiceBillType | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentModeId>('upi');
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccessDetails, setPaymentSuccessDetails] =
    useState<PaymentSuccessDetails | null>(null);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [createdBillIds, setCreatedBillIds] = useState<
    Partial<Record<InvoiceBillType, string>>
  >({});
  const [createdBillNumbers, setCreatedBillNumbers] = useState<
    Partial<Record<InvoiceBillType, string>>
  >({});
  const [patientContext, setPatientContext] = useState<InvoicePatientContext | null>(
    null,
  );

  const { data: lookup } = useAsyncData(
    async () => {
      const [patients, medicines, therapists, therapies] = await Promise.all([
        getAllPatients().catch(() => []),
        getAllMedicines().catch(() => []),
        getAllTherapists().catch(() => []),
        getAllTherapies().catch(() => []),
      ]);

      return {
        patients: patients.map((p) => ({
          value: p.id,
          label: `${p.patientDisplayId ?? p.patientCode ?? p.id} — ${p.fullName}`,
          uuid: p.id,
          displayId: (p.patientDisplayId ?? p.patientCode ?? p.id).replace(/^#/, ''),
          patientCode: p.patientCode ?? '',
          fullName: p.fullName,
          mobileNumber: p.mobileNumber,
        })),
        medicines: medicines.map((m) => ({
          value: m.id,
          label: m.medicineName,
          price: m.sellingPrice ?? m.price ?? 0,
        })),
        therapists: therapists.map((t) => ({
          value: t.id,
          label: t.name || t.therapistName || '—',
        })),
        therapies: therapies.map((t) => ({
          value: t.name || t.therapyName || t.id,
          label: t.name || t.therapyName || '—',
          price: t.price ?? 0,
        })),
      };
    },
    {
      patients: [] as Array<{
        value: string;
        label: string;
        uuid: string;
        displayId: string;
        patientCode: string;
        fullName: string;
        mobileNumber: string;
      }>,
      medicines: [] as Array<{ value: string; label: string; price: number }>,
      therapists: [] as Array<{ value: string; label: string }>,
      therapies: [] as Array<{ value: string; label: string; price: number }>,
    },
  );

  const serviceForm = useForm<InvoiceServiceStepValues>({
    resolver: zodResolver(invoiceServiceStepSchema),
    defaultValues: {
      patientId: '',
      fullName: '',
      contactNumber: '',
      invoiceDate: todayIsoDate(),
      visitType: 'Consultation',
      serviceFees: '',
      packageType: '',
      packageCharges: '',
    },
  });

  const medicineForm = useForm<InvoiceMedicineItemValues>({
    resolver: zodResolver(invoiceMedicineItemSchema),
    defaultValues: { medicineId: '', quantity: '1', price: '' },
  });

  const therapyForm = useForm<InvoiceTherapyItemValues>({
    resolver: zodResolver(invoiceTherapyItemSchema),
    defaultValues: {
      therapyName: '',
      therapyPrice: '',
      assignedTherapistId: '',
      assignedTherapistName: '',
      scheduleDate: '',
      scheduleTime: '',
      sessionDuration: '45 mins',
      sessionFrequency: '1',
    },
  });

  const summaryForm = useForm<InvoiceSummaryValues>({
    resolver: zodResolver(invoiceSummarySchema),
    defaultValues: { ...DEFAULT_SUMMARY },
  });

  const watchedService = serviceForm.watch();
  const serviceLineItems = useMemo(
    () =>
      serviceData
        ? buildServiceLineItems(serviceData)
        : buildServiceLineItems(watchedService as InvoiceServiceStepValues),
    [serviceData, watchedService],
  );

  const lineItemsByBill: Record<InvoiceBillType, InvoiceLineItem[]> = {
    service: serviceLineItems,
    medicine: medicineItems,
    therapy: therapyItems,
  };

  const applyTax = summaryForm.watch('applyTax');
  const discount = Number(summaryForm.watch('discount') || 0);
  const cgstRate = Number(summaryForm.watch('cgst') || 3);
  const sgstRate = Number(summaryForm.watch('sgst') || 3);

  const activeTotals = useMemo(
    () =>
      calculateInvoiceTotals(
        lineItemsByBill[activeBill],
        discount,
        applyTax,
        cgstRate,
        sgstRate,
      ),
    [lineItemsByBill, activeBill, discount, applyTax, cgstRate, sgstRate],
  );

  const paymentTotals = useMemo(() => {
    if (!paymentBill) return activeTotals;
    const s = summaries[paymentBill];
    return calculateInvoiceTotals(
      lineItemsByBill[paymentBill],
      Number(s.discount || 0),
      s.applyTax,
      Number(s.cgst || 3),
      Number(s.sgst || 3),
    );
  }, [paymentBill, summaries, lineItemsByBill, activeTotals]);

  const patientInfo = serviceData ?? (watchedService as InvoiceServiceStepValues);

  const handlePatientSelect = (patientUuid: string) => {
    const selected = lookup.patients.find((p) => p.value === patientUuid);
    if (!selected) return;

    setPatientContext({
      uuid: selected.uuid,
      displayId: selected.displayId,
      patientCode: selected.patientCode,
    });

    serviceForm.setValue('patientId', selected.displayId.startsWith('#')
      ? selected.displayId
      : `#${selected.displayId}`);
    serviceForm.setValue('fullName', selected.fullName);
    serviceForm.setValue('contactNumber', selected.mobileNumber);
  };

  const handleMedicineSelect = (medicineId: string) => {
    const selected = lookup.medicines.find((m) => m.value === medicineId);
    medicineForm.setValue('medicineId', medicineId);
    if (selected) {
      medicineForm.setValue('price', String(selected.price));
    }
  };

  const handleTherapySelect = (therapyName: string) => {
    const selected = lookup.therapies.find((t) => t.value === therapyName);
    therapyForm.setValue('therapyName', therapyName);
    if (selected) {
      therapyForm.setValue('therapyPrice', String(selected.price));
    }
  };

  const handleTherapistSelect = (therapistId: string) => {
    const selected = lookup.therapists.find((t) => t.value === therapistId);
    therapyForm.setValue('assignedTherapistId', therapistId);
    therapyForm.setValue('assignedTherapistName', selected?.label ?? '');
  };

  const syncSummaryToBill = (bill: InvoiceBillType) => {
    const values = summaryForm.getValues();
    setSummaries((prev) => ({ ...prev, [bill]: { ...values } }));
  };

  const loadSummaryForBill = (bill: InvoiceBillType) => {
    summaryForm.reset(summaries[bill]);
  };

  const handleTabChange = (next: InvoiceBillType) => {
    syncSummaryToBill(activeBill);
    if (next === 'service') {
      serviceForm.handleSubmit((data) => setServiceData(data))();
    }
    setActiveBill(next);
    loadSummaryForBill(next);
    setPaymentBill(null);
  };

  const handleAddMedicine = medicineForm.handleSubmit((data) => {
    const selected = lookup.medicines.find((m) => m.value === data.medicineId);
    setMedicineItems((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        medicineId: data.medicineId,
        name: selected?.label ?? data.medicineId,
        quantity: Number(data.quantity),
        amount: Number(data.price),
        type: 'medicine',
      },
    ]);
    medicineForm.reset({ medicineId: '', quantity: '1', price: '' });
  });

  const handleAddTherapy = therapyForm.handleSubmit((data) => {
    setTherapyItems((prev) => [
      ...prev,
      {
        id: `th-${Date.now()}`,
        name: data.therapyName,
        quantity: 1,
        amount: Number(data.therapyPrice),
        type: 'therapy',
        assignedTherapist: data.assignedTherapistName ?? '',
        assignedTherapistId: data.assignedTherapistId,
        scheduleDate: data.scheduleDate,
        scheduleTime: data.scheduleTime,
        sessionDuration: data.sessionDuration,
        sessionFrequency: data.sessionFrequency,
      },
    ]);
    therapyForm.reset({
      therapyName: '',
      therapyPrice: '',
      assignedTherapistId: '',
      assignedTherapistName: '',
      scheduleDate: '',
      scheduleTime: '',
      sessionDuration: '45 mins',
      sessionFrequency: '1',
    });
  });

  const removeLineItem = (bill: InvoiceBillType, id: string) => {
    if (bill === 'medicine') {
      setMedicineItems((prev) => prev.filter((item) => item.id !== id));
    } else if (bill === 'therapy') {
      setTherapyItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openPaymentForBill = (bill: InvoiceBillType) => {
    syncSummaryToBill(activeBill);
    if (bill === 'service') {
      serviceForm.handleSubmit((data) => {
        setServiceData(data);
        setPaymentBill(bill);
      })();
      return;
    }
    if (lineItemsByBill[bill].length === 0) {
      showToast({
        title: 'Empty bill',
        message: `Add at least one item to the ${BILL_LABELS[bill].toLowerCase()} before payment.`,
      });
      return;
    }
    setPaymentBill(bill);
  };

  const handleCreateBill = async (bill: InvoiceBillType) => {
    if (paymentSubmitting) return;
    syncSummaryToBill(bill);

    let currentService = serviceData;
    if (!currentService) {
      const valid = await serviceForm.trigger();
      if (!valid) {
        showToast({
          title: 'Patient details required',
          message: 'Complete the Service Type tab with patient information first.',
        });
        setActiveBill('service');
        return;
      }
      currentService = serviceForm.getValues();
      setServiceData(currentService);
    }

    const items = lineItemsByBill[bill];
    if (items.length === 0) {
      showToast({
        title: 'Empty bill',
        message: `Add items to the ${BILL_LABELS[bill].toLowerCase()} before generating.`,
      });
      return;
    }

    const summary = summaries[bill];
    const totals = calculateInvoiceTotals(
      items,
      Number(summary.discount || 0),
      summary.applyTax,
      Number(summary.cgst || 3),
      Number(summary.sgst || 3),
    );

    if (!patientContext?.uuid) {
      showToast({
        title: 'Patient required',
        message: 'Select a patient from the list before generating an invoice.',
      });
      setActiveBill('service');
      return;
    }

    setPaymentSubmitting(true);
    try {
      const paymentMode =
        PAYMENT_MODES.find((m) => m.id === selectedPayment)?.title ?? 'UPI';

      const basePayload = {
        patientId: patientContext.uuid,
        patientDisplayId: patientContext.displayId.replace(/^#/, ''),
        patientCode: patientContext.patientCode || undefined,
        patientName: currentService.fullName,
        contactNumber: currentService.contactNumber,
        invoiceDate: currentService.invoiceDate,
        discount: Number(summary.discount || 0),
        taxEnabled: summary.applyTax,
        cgstPercent: Number(summary.cgst || 3),
        sgstPercent: Number(summary.sgst || 3),
        amountPaid: totals.total,
        paymentMethod: paymentMode.toUpperCase(),
        paymentRemarks: `${BILL_LABELS[bill]} generated from UI`,
      };

      let result;
      if (bill === 'service') {
        result = await createInvoice({
          ...basePayload,
          visitType: toApiVisitType(currentService.visitType),
          serviceFees: Number(currentService.serviceFees),
          packageType: currentService.packageType || null,
          packageCharges: Number(currentService.packageCharges || 0),
          medicines: [],
          therapies: [],
        });
      } else if (bill === 'medicine') {
        result = await createInvoice({
          ...basePayload,
          visitType: 'CONSULTATION',
          serviceFees: 0,
          packageType: null,
          packageCharges: 0,
          medicines: medicineItems.map((item) => ({
            medicineId: item.medicineId ?? item.id,
            quantity: item.quantity,
            unitPrice: item.amount,
          })),
          therapies: [],
        });
      } else {
        result = await createInvoice({
          ...basePayload,
          visitType: 'THERAPY',
          serviceFees: 0,
          packageType: null,
          packageCharges: 0,
          medicines: [],
          therapies: therapyItems.map((item) => ({
            itemName: item.name,
            quantity: item.quantity,
            unitPrice: item.amount,
            assignedTherapistId: item.assignedTherapistId,
            assignedTherapistName: item.assignedTherapist,
            scheduleDate: item.scheduleDate,
            scheduleTime: normalizeInvoiceTime(item.scheduleTime),
            sessionDuration: parseSessionMinutes(item.sessionDuration),
            sessionFrequency: parseSessionFrequency(item.sessionFrequency),
          })),
        });
      }

      setCreatedBillIds((prev) => ({
        ...prev,
        [bill]: result.id,
      }));
      setCreatedBillNumbers((prev) => ({
        ...prev,
        [bill]: result.invoiceId,
      }));
      setPaymentSuccessDetails(mapInvoiceToPaymentSuccess(result));
      setPaymentSuccessOpen(true);
      setPaymentBill(null);
      showToast({
        title: `${BILL_LABELS[bill]} created`,
        message: `Separate ${BILL_LABELS[bill].toLowerCase()} has been generated successfully.`,
      });
    } catch (err) {
      showToast({
        title: 'Invoice failed',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not create invoice.',
      });
    } finally {
      setPaymentSubmitting(false);
    }
  };

  if (paymentBill) {
    const bill = paymentBill;
    const summary = summaries[bill];
    const items = lineItemsByBill[bill];
    const totals = paymentTotals;

    return (
      <div className="space-y-5">
        <BillingBreadcrumbs />
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brown">{BILL_LABELS[bill]}</h2>
              <p className="mt-1 text-sm text-text-muted">
                {createdBillNumbers[bill]
                  ? `Bill ID: ${createdBillNumbers[bill]}`
                  : 'Separate bill — not combined with other tabs'}
              </p>
            </div>
            <Badge variant="danger">Unpaid</Badge>
          </div>

          <PatientInfoGrid patient={patientInfo} />

          <div className="mt-6">
            <LineItemsTable items={items} />
          </div>

          <BillSummaryTotals
            totals={totals}
            discount={Number(summary.discount || 0)}
            applyTax={summary.applyTax}
            cgstRate={Number(summary.cgst || 3)}
            sgstRate={Number(summary.sgst || 3)}
          />

          <div className="mt-8 rounded-xl border border-gray-100 p-4">
            <h3 className="mb-4 font-semibold text-brown">Select Mode of Payment</h3>
            <div className="space-y-3">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedPayment(mode.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${selectedPayment === mode.id
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
                      {formatCurrency(totals.total)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPaymentBill(null)}>
              Back
            </Button>
            <Button variant="outline" onClick={() => setInvoicePreviewOpen(true)}>
              Preview Invoice
            </Button>
            <Button
              onClick={() => handleCreateBill(bill)}
              disabled={paymentSubmitting}
            >
              {paymentSubmitting ? 'Creating…' : `Generate ${BILL_LABELS[bill]}`}
            </Button>
          </div>
        </Card>

        <PaymentSuccessModal
          open={paymentSuccessOpen}
          onClose={() => {
            setPaymentSuccessOpen(false);
            setPaymentSuccessDetails(null);
            navigate('/billing');
          }}
          payment={paymentSuccessDetails}
        />

        <BillInvoiceModal
          open={invoicePreviewOpen}
          onClose={() => setInvoicePreviewOpen(false)}
          invoiceId={createdBillIds[bill] ?? null}
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
            Create a separate bill for each category — service, medicine, and therapy
            are billed independently.
          </p>
        </div>

        <UnderlineTabs
          tabs={BILL_TABS}
          activeTab={activeBill}
          onChange={handleTabChange}
        />

        <div className="mt-8">
          {activeBill === 'service' && (
            <form className="space-y-6" noValidate>
              <FormSection title="Patient & Service Details">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Select
                    label="Select Patient"
                    placeholder="Choose patient"
                    options={lookup.patients.map((p) => ({
                      value: p.value,
                      label: p.label,
                    }))}
                    value={patientContext?.uuid ?? ''}
                    onChange={(e) => handlePatientSelect(e.target.value)}
                  />
                  <Input
                    label="Patient ID"
                    error={serviceForm.formState.errors.patientId?.message}
                    {...serviceForm.register('patientId')}
                    readOnly
                  />
                  <Input
                    label="Full Name"
                    error={serviceForm.formState.errors.fullName?.message}
                    {...serviceForm.register('fullName')}
                  />
                  <Input
                    label="Contact Number"
                    error={serviceForm.formState.errors.contactNumber?.message}
                    {...serviceForm.register('contactNumber')}
                  />
                  <Input
                    label="Invoice Date"
                    type="date"
                    error={serviceForm.formState.errors.invoiceDate?.message}
                    {...serviceForm.register('invoiceDate')}
                  />
                </div>
              </FormSection>

              <FormSection title="Billing Details">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                      label="Service Type *"
                      placeholder="Service Type"
                      options={[...VISIT_TYPE_OPTIONS]}
                      error={serviceForm.formState.errors.visitType?.message}
                      {...serviceForm.register('visitType')}
                    />
                    <RupeeInput
                      label="Service Fees *"
                      placeholder="0"
                      error={serviceForm.formState.errors.serviceFees?.message}
                      {...serviceForm.register('serviceFees')}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                      label="Package Type"
                      placeholder="Package Type"
                      options={[
                        { value: '', label: 'None' },
                        ...PACKAGE_TYPE_OPTIONS.map((option) => ({
                          value: option,
                          label: option,
                        })),
                      ]}
                      error={serviceForm.formState.errors.packageType?.message}
                      {...serviceForm.register('packageType')}
                    />
                    <RupeeInput
                      label={
                        serviceForm.watch('packageType')
                          ? 'Package Charges *'
                          : 'Package Charges'
                      }
                      placeholder="0"
                      disabled={!serviceForm.watch('packageType')}
                      error={serviceForm.formState.errors.packageCharges?.message}
                      {...serviceForm.register('packageCharges')}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <RupeeInput
                      label="Discount (if any)"
                      placeholder="0"
                      error={summaryForm.formState.errors.discount?.message}
                      {...summaryForm.register('discount')}
                    />
                    <div className="space-y-3">
                      <Controller
                        name="applyTax"
                        control={summaryForm.control}
                        render={({ field }) => (
                          <label className="flex items-center gap-2 text-sm font-medium text-brown">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                              checked={Boolean(field.value)}
                              onChange={(e) => field.onChange(e.target.checked)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                            CGST & SGST
                          </label>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="CGST *"
                          placeholder="3"
                          disabled={!applyTax}
                          error={summaryForm.formState.errors.cgst?.message}
                          {...summaryForm.register('cgst')}
                        />
                        <Input
                          label="SGST *"
                          placeholder="3"
                          disabled={!applyTax}
                          error={summaryForm.formState.errors.sgst?.message}
                          {...summaryForm.register('sgst')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>

              <BillSummarySection
                billLabel={BILL_LABELS.service}
                billId={createdBillNumbers.service}
                items={serviceLineItems}
                summaryForm={summaryForm}
                totals={activeTotals}
                discount={discount}
                applyTax={applyTax}
                hideDiscountAndTax
              />
            </form>
          )}

          {activeBill === 'medicine' && (
            <div className="space-y-6">
              <PatientInfoBanner patient={patientInfo} />
              <FormSection title="Add Medicine">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    label="Medicine Name"
                    placeholder="Select medicine"
                    options={lookup.medicines.map((m) => ({
                      value: m.value,
                      label: m.label,
                    }))}
                    value={medicineForm.watch('medicineId')}
                    onChange={(e) => handleMedicineSelect(e.target.value)}
                    error={medicineForm.formState.errors.medicineId?.message}
                  />
                  <Select
                    label="Quantity"
                    options={[...QUANTITY_OPTIONS]}
                    error={medicineForm.formState.errors.quantity?.message}
                    {...medicineForm.register('quantity')}
                  />
                  <Input
                    label="Price (₹)"
                    error={medicineForm.formState.errors.price?.message}
                    {...medicineForm.register('price')}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={handleAddMedicine}
                >
                  + Add Medicine
                </Button>
              </FormSection>

              <BillSummarySection
                billLabel={BILL_LABELS.medicine}
                billId={createdBillNumbers.medicine}
                items={medicineItems}
                summaryForm={summaryForm}
                totals={activeTotals}
                discount={discount}
                applyTax={applyTax}
                onRemove={(id) => removeLineItem('medicine', id)}
              />
            </div>
          )}

          {activeBill === 'therapy' && (
            <div className="space-y-6">
              <PatientInfoBanner patient={patientInfo} />
              <FormSection title="Therapy Treatment">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    label="Therapy name"
                    placeholder="Select therapy"
                    options={lookup.therapies.map((t) => ({
                      value: t.value,
                      label: t.label,
                    }))}
                    value={therapyForm.watch('therapyName')}
                    onChange={(e) => handleTherapySelect(e.target.value)}
                    error={therapyForm.formState.errors.therapyName?.message}
                  />
                  <Input
                    label="Therapy Price (₹)"
                    error={therapyForm.formState.errors.therapyPrice?.message}
                    {...therapyForm.register('therapyPrice')}
                  />
                  <Select
                    label="Assigned Therapist"
                    placeholder="Select therapist"
                    options={lookup.therapists.map((t) => ({
                      value: t.value,
                      label: t.label,
                    }))}
                    value={therapyForm.watch('assignedTherapistId')}
                    onChange={(e) => handleTherapistSelect(e.target.value)}
                    error={therapyForm.formState.errors.assignedTherapistId?.message}
                  />
                </div>
              </FormSection>
              <FormSection title="Therapy Schedule">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="Schedule Date"
                    type="date"
                    error={therapyForm.formState.errors.scheduleDate?.message}
                    {...therapyForm.register('scheduleDate')}
                  />
                  <Input
                    label="Schedule Time"
                    type="time"
                    error={therapyForm.formState.errors.scheduleTime?.message}
                    {...therapyForm.register('scheduleTime')}
                  />
                  <Input
                    label="Session Duration"
                    error={therapyForm.formState.errors.sessionDuration?.message}
                    {...therapyForm.register('sessionDuration')}
                  />
                  <Input
                    label="Session Frequency"
                    error={therapyForm.formState.errors.sessionFrequency?.message}
                    {...therapyForm.register('sessionFrequency')}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={handleAddTherapy}
                >
                  + Add Therapy
                </Button>
              </FormSection>

              <BillSummarySection
                billLabel={BILL_LABELS.therapy}
                billId={createdBillNumbers.therapy}
                items={therapyItems}
                summaryForm={summaryForm}
                totals={activeTotals}
                discount={discount}
                applyTax={applyTax}
                onRemove={(id) => removeLineItem('therapy', id)}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          {activeBill !== 'service' && (
            <Button
              variant="outline"
              onClick={() => {
                const idx = BILL_ORDER.indexOf(activeBill);
                if (idx > 0) handleTabChange(BILL_ORDER[idx - 1]);
              }}
            >
              Back
            </Button>
          )}
          {activeBill !== 'therapy' && (
            <Button
              variant="outline"
              onClick={() => {
                syncSummaryToBill(activeBill);
                if (activeBill === 'service') {
                  serviceForm.handleSubmit((data) => {
                    if (!patientContext?.uuid) {
                      showToast({
                        title: 'Patient required',
                        message: 'Select a patient from the dropdown before continuing.',
                      });
                      return;
                    }
                    setServiceData(data);
                    handleTabChange(BILL_ORDER[BILL_ORDER.indexOf(activeBill) + 1]);
                  })();
                } else {
                  handleTabChange(BILL_ORDER[BILL_ORDER.indexOf(activeBill) + 1]);
                }
              }}
            >
              Next
            </Button>
          )}
          <Button onClick={() => openPaymentForBill(activeBill)}>
            Make Payment — {BILL_LABELS[activeBill]}
          </Button>
        </div>
      </Card>

      <CreatedBillsOverview
        createdBillNumbers={createdBillNumbers}
        onGoToBill={handleTabChange}
      />
    </div>
  );
}

function PatientInfoBanner({ patient }: { patient: InvoiceServiceStepValues }) {
  return (
    <div className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm">
      <p className="font-medium text-brown">
        {patient.fullName}{' '}
        <span className="font-normal text-text-muted">
          · {patient.patientId} · {patient.contactNumber}
        </span>
      </p>
    </div>
  );
}

function PatientInfoGrid({ patient }: { patient: InvoiceServiceStepValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InfoItem label="Bill To" value="Ganesha Ayurvedaa" />
      <InfoItem label="Invoice Date" value={patient.invoiceDate} />
      <InfoItem label="Patient ID" value={patient.patientId} />
      <InfoItem label="Patient Name" value={patient.fullName} />
    </div>
  );
}

function BillSummarySection({
  billLabel,
  billId,
  items,
  summaryForm,
  totals,
  discount,
  applyTax,
  onRemove,
  hideDiscountAndTax = false,
}: {
  billLabel: string;
  billId?: string;
  items: InvoiceLineItem[];
  summaryForm: ReturnType<typeof useForm<InvoiceSummaryValues>>;
  totals: ReturnType<typeof calculateInvoiceTotals>;
  discount: number;
  applyTax: boolean;
  onRemove?: (id: string) => void;
  hideDiscountAndTax?: boolean;
}) {
  const cgstRate = Number(summaryForm.watch('cgst') || 3);
  const sgstRate = Number(summaryForm.watch('sgst') || 3);

  return (
    <section className="rounded-xl border border-[#e8dfd0] bg-[#fdf8ee]/50 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-brown">{billLabel} — Summary</h3>
        <div className="flex items-center gap-2">
          {billId && (
            <span className="text-xs text-text-muted">ID: {billId}</span>
          )}
          <Badge variant="danger">Unpaid</Badge>
        </div>
      </div>

      <LineItemsTable items={items} onRemove={onRemove} emptyLabel={`No items in ${billLabel.toLowerCase()} yet.`} />

      {!hideDiscountAndTax ? (
        <div className="mt-6">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount (if any)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="h-11 w-full rounded-lg border border-gray-300 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  {...summaryForm.register('discount')}
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-2 flex items-center gap-2">
                <Controller
                  name="applyTax"
                  control={summaryForm.control}
                  render={({ field }) => (
                    <>
                      <input
                        type="checkbox"
                        id={`apply-tax-${billLabel}`}
                        className="checkbox-gold"
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                      <label
                        htmlFor={`apply-tax-${billLabel}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        CGST & SGST
                      </label>
                    </>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CGST"
                  placeholder="3"
                  disabled={!applyTax}
                  {...summaryForm.register('cgst')}
                />
                <Input
                  label="SGST"
                  placeholder="3"
                  disabled={!applyTax}
                  {...summaryForm.register('sgst')}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <BillSummaryTotals
        totals={totals}
        discount={discount}
        applyTax={applyTax}
        cgstRate={cgstRate}
        sgstRate={sgstRate}
        className="mt-4"
      />
    </section>
  );
}

function BillSummaryTotals({
  totals,
  discount,
  applyTax,
  cgstRate,
  sgstRate,
  className,
}: {
  totals: ReturnType<typeof calculateInvoiceTotals>;
  discount: number;
  applyTax: boolean;
  cgstRate: number;
  sgstRate: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 text-sm ${className ?? ''}`}>
      <TotalRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
      {applyTax && (
        <>
          <TotalRow
            label={`CGST (${cgstRate}%)`}
            value={`+${formatCurrency(totals.cgst)}`}
          />
          <TotalRow
            label={`SGST (${sgstRate}%)`}
            value={`+${formatCurrency(totals.sgst)}`}
          />
        </>
      )}
      <TotalRow
        label="Discount"
        value={`-${formatCurrency(discount)}`}
        className="text-success"
      />
      <TotalRow label="Total" value={formatCurrency(totals.total)} bold />
    </div>
  );
}

function CreatedBillsOverview({
  createdBillNumbers,
  onGoToBill,
}: {
  createdBillNumbers: Partial<Record<InvoiceBillType, string>>;
  onGoToBill: (bill: InvoiceBillType) => void;
}) {
  const created = BILL_ORDER.filter((b) => createdBillNumbers[b]);
  if (created.length === 0) return null;

  return (
    <Card className="p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-brown">Bills generated this session</h3>
      <div className="flex flex-wrap gap-2">
        {created.map((bill) => (
          <button
            key={bill}
            type="button"
            onClick={() => onGoToBill(bill)}
            className="rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-left text-sm hover:bg-gold/10"
          >
            <span className="font-medium text-brown">{BILL_LABELS[bill]}</span>
            <span className="mt-0.5 block text-xs text-text-muted">
              {createdBillNumbers[bill]}
            </span>
          </button>
        ))}
      </div>
    </Card>
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
  emptyLabel,
}: {
  items: InvoiceLineItem[];
  onRemove?: (id: string) => void;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-text-muted">
        {emptyLabel ?? 'No line items yet.'}
      </p>
    );
  }

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
