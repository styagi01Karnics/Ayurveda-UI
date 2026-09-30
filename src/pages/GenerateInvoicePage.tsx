import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Link2, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingBreadcrumbs } from '@/components/billing/BillingBreadcrumbs';
import {
  PaymentSuccessModal,
  mapInvoiceToPaymentSuccess,
  type PaymentSuccessDetails,
} from '@/components/billing/PaymentSuccessModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PatientSearchSelect } from '@/components/ui/PatientSearchSelect';
import { RupeeInput } from '@/components/ui/RupeeInput';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { PAYMENT_CHANNELS, PAYMENT_MODES } from '@/data/mock/billing';
import { useAsyncData } from '@/hooks/useAsyncData';
import { BOOKING_TIME_OPTIONS, DEFAULT_SESSION_FREQUENCY } from '@/lib/bookingConstraints';
import { getAllTherapies, getAppointmentPatients } from '@/lib/api/appointments';
import {
  addInvoicePayment,
  createInvoice,
  generateInvoiceFromBilling,
  getBillingById,
  getBillingsByPatient,
  getInvoiceById,
  toVisitTypeApi,
  type BillingDto,
  type CreateInvoicePayload,
  type InvoiceDto,
  type VisitTypeApi,
} from '@/lib/api/billing';
import { ApiError } from '@/lib/api/client';
import { getAllMedicines } from '@/lib/api/medicines';
import { getActivePackageMasters } from '@/lib/api/packageMasters';
import { getPatientById } from '@/lib/api/patients';
import {
  getPrescriptionsByPatient,
  type PrescriptionDto,
} from '@/lib/api/prescriptions';
import { getActiveTherapists } from '@/lib/api/therapists';
import { sendInvoicePaymentLink } from '@/lib/api/payments';
import { calculatePrescriptionMedicineQuantity } from '@/lib/prescriptionQuantity';
import type { MedicineDto } from '@/lib/api/types';
import {
  calculateInvoiceTotals,
  FIXED_CGST_PERCENT,
  FIXED_CGST_PERCENT_STR,
  FIXED_SGST_PERCENT,
  FIXED_SGST_PERCENT_STR,
  invoiceMedicineItemSchema,
  invoiceServiceStepSchema,
  invoiceSummarySchema,
  invoiceTherapyItemSchema,
  type InvoiceMedicineItemValues,
  type InvoiceServiceStepValues,
  type InvoiceSummaryValues,
  type InvoiceTherapyItemValues,
} from '@/lib/validation/billing.schema';
import { cn, formatCurrency } from '@/lib/utils';
import type {
  BillSummaryState,
  InvoiceLineItem,
  PaymentChannelId,
  PaymentModeId,
  TherapyInvoiceLineItem,
} from '@/types';

type InvoiceTabId = 'service' | 'medicine' | 'therapy' | 'summary';

const INVOICE_TABS: { id: InvoiceTabId; label: string }[] = [
  { id: 'service', label: 'Service Type' },
  { id: 'medicine', label: 'Medicine' },
  { id: 'therapy', label: 'Therapy' },
  { id: 'summary', label: 'Summary' },
];

const CONSULTATION_VISIT_OPTIONS = ['Consultation', 'Therapy', 'Follow-up'] as const;

const MEDICINE_QUANTITY_OPTIONS = Array.from({ length: 20 }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

const DEFAULT_SUMMARY: BillSummaryState = {
  discount: '0',
  applyTax: true,
  cgst: FIXED_CGST_PERCENT_STR,
  sgst: FIXED_SGST_PERCENT_STR,
};

const PATIENT_FIELDS = [
  'patientId',
  'fullName',
  'contactNumber',
  'invoiceDate',
] as const;

const EMPTY_THERAPY_VALUES: InvoiceTherapyItemValues = {
  therapyName: '',
  therapyPrice: '',
  assignedTherapistId: '',
  assignedTherapistName: '',
  scheduleDate: '',
  scheduleTime: '',
  sessionDuration: '45 mins',
  sessionFrequency: '1',
};

interface InvoicePatientContext {
  uuid: string;
  displayId: string;
  patientCode: string;
  email?: string;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeInvoiceTime(time: string): string {
  if (!time) return '10:00:00';
  return time.length === 5 ? `${time}:00` : time;
}

function toConsultationVisitLabel(value: string): string {
  const upper = value.toUpperCase().replace(/[\s-]+/g, '_');
  if (upper.includes('FOLLOW')) return 'Follow-up';
  if (upper.includes('PACKAGE')) return 'Package';
  if (upper.includes('THERAPY') && !upper.includes('CONSULT')) return 'Therapy';
  return 'Consultation';
}

function parseSessionMinutes(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 45;
}

/** Map form session frequency to API integer (backend expects Integer, e.g. 1). */
function toSessionFrequencyApi(value: string): number {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed || trimmed === 'ONCE' || trimmed === '1') return 1;
  const digits = trimmed.match(/\d+/);
  if (digits) return Math.max(Number(digits[0]), 1);
  return 1;
}

function formatBillDateTime(isoDate: string): string {
  const now = new Date();
  const date = isoDate ? new Date(`${isoDate}T${now.toTimeString().slice(0, 8)}`) : now;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function describeInvoiceLabel(
  hasService: boolean,
  hasMedicine: boolean,
  hasTherapy: boolean,
): string {
  const parts: string[] = [];
  if (hasService) parts.push('Consultation');
  if (hasMedicine) parts.push('Medicine');
  if (hasTherapy) parts.push('Therapy');
  return parts.join(' + ') || 'Invoice';
}

function buildServiceLineItems(data: InvoiceServiceStepValues): InvoiceLineItem[] {
  const items: InvoiceLineItem[] = [];
  const serviceFees = Number(data.serviceFees) || 0;

  if (data.serviceFees?.trim() && serviceFees >= 0) {
    items.push({
      id: 'svc-consultation',
      name: data.visitType?.trim() || 'Consultation',
      quantity: 1,
      amount: serviceFees,
      type: 'service',
    });
  }

  const packageMasterId = data.packageMasterId?.trim();
  const packageCharges = Number(data.packageCharges) || 0;
  if (packageMasterId && packageCharges >= 0 && data.packageCharges?.trim()) {
    items.push({
      id: 'svc-package',
      name: data.packageType?.trim() || 'Package',
      quantity: 1,
      amount: packageCharges,
      type: 'service',
    });
  }

  return items;
}

async function settleInvoicePayment(
  invoice: InvoiceDto,
  paymentMethod: string,
  remarks: string,
  partial: boolean,
): Promise<InvoiceDto> {
  const due =
    invoice.leftAmount ??
    Math.max(0, (invoice.totalAmount ?? 0) - (invoice.paidAmount ?? 0));
  if (due <= 0) return invoice;

  const amountPaid = partial ? Math.min(500, due) : due;
  if (amountPaid <= 0) return invoice;

  await addInvoicePayment(invoice.id, {
    amountPaid,
    paymentMethod,
    remarks,
  });
  return getInvoiceById(invoice.id);
}

export function GenerateInvoicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billingId = searchParams.get('billingId');
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<InvoiceTabId>('service');
  const [serviceData, setServiceData] = useState<InvoiceServiceStepValues | null>(
    null,
  );
  const [medicineItems, setMedicineItems] = useState<InvoiceLineItem[]>([]);
  const [therapyItems, setTherapyItems] = useState<TherapyInvoiceLineItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] =
    useState<PaymentChannelId>('via_payment');
  const [selectedPayment, setSelectedPayment] = useState<PaymentModeId>('upi');
  const [viaPaymentOpen, setViaPaymentOpen] = useState(true);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccessDetails, setPaymentSuccessDetails] =
    useState<PaymentSuccessDetails | null>(null);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);
  const [createdInvoiceNumber, setCreatedInvoiceNumber] = useState<string | null>(
    null,
  );
  const [patientContext, setPatientContext] = useState<InvoicePatientContext | null>(
    null,
  );
  /** Pending billing draft linked for generate-invoice (URL or patient-code lookup). */
  const [linkedBillingId, setLinkedBillingId] = useState<string | null>(billingId);
  const [patientBillingLoading, setPatientBillingLoading] = useState(false);

  const { data: lookup } = useAsyncData(
    async () => {
      const [patients, medicines, therapists, therapies, packageMasters] =
        await Promise.all([
          getAppointmentPatients({ statusTab: 'ACTIVE' }).catch(() => []),
          getAllMedicines().catch(() => []),
          getActiveTherapists().catch(() => []),
          getAllTherapies().catch(() => []),
          getActivePackageMasters().catch(() => []),
        ]);

      return {
        patients: patients.map((p) => {
          const code = resolvePatientDisplayCode(p).replace(/^#/, '');
          return {
            value: p.patientId,
            label: `${code || '—'} — ${p.patientFullName}`,
            uuid: p.patientId,
            displayId: code,
            patientCode: p.patientCode ?? code,
            fullName: p.patientFullName,
            mobileNumber: p.patientMobileNumber ?? '',
            email: p.patientEmail ?? p.email ?? undefined,
          };
        }),
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
        packageMasters: packageMasters.map((pkg) => ({
          value: pkg.id,
          label: pkg.name,
          price: pkg.packagePrice ?? 0,
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
        email?: string;
      }>,
      medicines: [] as Array<{ value: string; label: string; price: number }>,
      therapists: [] as Array<{ value: string; label: string }>,
      therapies: [] as Array<{ value: string; label: string; price: number }>,
      packageMasters: [] as Array<{ value: string; label: string; price: number }>,
    },
  );

  const serviceForm = useForm<InvoiceServiceStepValues>({
    resolver: zodResolver(invoiceServiceStepSchema),
    defaultValues: {
      patientId: '',
      fullName: '',
      contactNumber: '',
      invoiceDate: todayIsoDate(),
      visitType: '',
      serviceFees: '',
      packageMasterId: '',
      packageType: '',
      packageCharges: '',
    },
  });

  const medicineForm = useForm<InvoiceMedicineItemValues>({
    resolver: zodResolver(invoiceMedicineItemSchema),
    defaultValues: { medicineId: '', quantity: '', price: '' },
  });

  const therapyForm = useForm<InvoiceTherapyItemValues>({
    resolver: zodResolver(invoiceTherapyItemSchema),
    defaultValues: EMPTY_THERAPY_VALUES,
  });

  const summaryForm = useForm<InvoiceSummaryValues>({
    resolver: zodResolver(invoiceSummarySchema),
    defaultValues: { ...DEFAULT_SUMMARY },
  });

  const validatePatientDetails = async (): Promise<boolean> => {
    const patientValid = await serviceForm.trigger([...PATIENT_FIELDS]);
    if (!patientValid) {
      showToast({
        title: 'Patient details required',
        message: 'Fill patient ID, full name, contact number, and invoice date first.',
      });
      return false;
    }

    if (!patientContext?.uuid && !billingId) {
      serviceForm.setError('patientId', {
        type: 'manual',
        message: 'Select a patient',
      });
      showToast({
        title: 'Patient required',
        message: 'Select a patient from the list before continuing.',
      });
      return false;
    }

    return true;
  };

  const goToTab = async (id: InvoiceTabId) => {
    if (id !== 'service' && activeTab === 'service') {
      const valid = await validatePatientDetails();
      if (!valid) return;
    }
    setActiveTab(id);
  };

  const watchedService = serviceForm.watch();
  const serviceLineItems = useMemo(
    () =>
      buildServiceLineItems(
        (serviceData ?? watchedService) as InvoiceServiceStepValues,
      ),
    [serviceData, watchedService],
  );

  const selectedLineItems = useMemo(
    () => [...serviceLineItems, ...medicineItems, ...therapyItems],
    [serviceLineItems, medicineItems, therapyItems],
  );

  const applyTax = summaryForm.watch('applyTax');
  const discount = Number(summaryForm.watch('discount') || 0);
  const cgstRate = FIXED_CGST_PERCENT;
  const sgstRate = FIXED_SGST_PERCENT;
  const summaryValues = summaryForm.watch();

  const invoiceTotals = useMemo(
    () =>
      calculateInvoiceTotals(
        selectedLineItems,
        discount,
        applyTax,
        cgstRate,
        sgstRate,
      ),
    [selectedLineItems, discount, applyTax, cgstRate, sgstRate],
  );

  const medicineSubtotal = useMemo(
    () =>
      medicineItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
    [medicineItems],
  );
  const therapySubtotal = useMemo(
    () =>
      therapyItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
    [therapyItems],
  );

  const patientInfo = serviceData ?? (watchedService as InvoiceServiceStepValues);
  const invoiceLabel = describeInvoiceLabel(
    serviceLineItems.length > 0,
    medicineItems.length > 0,
    therapyItems.length > 0,
  );
  const packageTypeValue = serviceForm.watch('packageType');
  const packageTypeOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = PACKAGE_TYPE_OPTIONS.map(
      (option) => ({
        value: option,
        label: option,
      }),
    );
    if (
      packageTypeValue &&
      !PACKAGE_TYPE_OPTIONS.includes(
        packageTypeValue as (typeof PACKAGE_TYPE_OPTIONS)[number],
      )
    ) {
      options.push({ value: packageTypeValue, label: packageTypeValue });
    }
    return options;
  }, [packageTypeValue]);

  const applyBillingDraftToForm = async (
    billing: BillingDto,
    options?: { patientDto?: Awaited<ReturnType<typeof getPatientById>> | null },
  ) => {
    const patientDto =
      options?.patientDto ??
      (billing.patientId
        ? await getPatientById(billing.patientId).catch(() => null)
        : null);

    const displayId = resolvePatientDisplayCode({
      patientCode: billing.patientCode ?? patientDto?.patientCode,
      patientDisplayId: billing.patientDisplayId,
      formattedPatientId: billing.formattedPatientId,
      patientId: billing.patientId,
    }).replace(/^#/, '');

    const first = billing.services?.[0];
    const serviceTypeLabel =
      first?.serviceType || billing.visitType || 'Consultation';
    let medicineLines = medicineLinesFromBillingDraft(billing);
    const resolvedType = resolveInvoiceTypeFromBillingServices(
      billing.services,
      billing.visitType,
      medicineLines.length > 0,
    );
    const resolvedOption = getInvoiceType(resolvedType);
    const contact = (billing.contactNumber ?? '').replace(/\D/g, '').slice(-10);

    setInvoiceTypeId(resolvedType);
    setPaymentOpen(false);
    setLinkedBillingId(billing.id);
    setPatientContext({
      uuid: billing.patientId,
      displayId,
      patientCode: billing.patientCode ?? patientDto?.patientCode ?? displayId,
      email: patientDto?.email || undefined,
    });

    const visitType = resolvedOption.includeConsultation
      ? toConsultationVisitLabel(serviceTypeLabel.toString())
      : resolvedOption.includeTherapy
        ? 'Therapy'
        : 'Consultation';

    serviceForm.reset({
      patientId: displayId ? `#${displayId}` : '',
      fullName: billing.patientName ?? patientDto?.fullName ?? '',
      contactNumber: contact || (patientDto?.mobileNumber ?? ''),
      invoiceDate: todayIsoDate(),
      visitType:
        visitType === 'Therapy' && resolvedOption.includeConsultation
          ? 'Consultation'
          : visitType,
      serviceFees: String(Math.round(first?.serviceFees ?? 0) || ''),
      packageMasterId: first?.packageMasterId ?? '',
      packageType: first?.packageType ?? first?.packageName ?? '',
      packageCharges: first?.packageCharges
        ? String(Math.round(first.packageCharges))
        : '',
    });
    // Prefer master catalogue price when draft has a package but no charges.
    if (first?.packageMasterId && !first.packageCharges) {
      const master = lookup.packageMasters.find(
        (p) => p.value === first.packageMasterId,
      );
      if (master) {
        serviceForm.setValue('packageType', master.label);
        if (master.price > 0) {
          serviceForm.setValue('packageCharges', String(Math.round(master.price)));
        }
      }
    }
    setServiceData(serviceForm.getValues());

    // POST /billings is services-only; prefill medicines from latest prescription.
    if (medicineLines.length === 0 && billing.patientId) {
      const [prescriptions, catalogue] = await Promise.all([
        getPrescriptionsByPatient(billing.patientId).catch(() => []),
        getAllMedicines().catch(() => []),
      ]);
      medicineLines = medicineLinesFromPrescriptions(prescriptions, catalogue);
    }

    setMedicineItems(medicineLines);
    if (medicineLines.length > 0) {
      setInvoiceTypeId(
        resolveInvoiceTypeFromBillingServices(
          billing.services,
          billing.visitType,
          true,
        ),
      );
    }
  };

  const loadPatientPendingBillingAndPrescription = async (
    patientUuid: string,
    selected?: {
      displayId: string;
      patientCode: string;
      fullName: string;
      mobileNumber: string;
      email?: string;
    },
  ) => {
    setPatientBillingLoading(true);
    try {
      if (selected) {
        setPatientContext({
          uuid: patientUuid,
          displayId: selected.displayId,
          patientCode: selected.patientCode,
          email: selected.email,
        });
        serviceForm.setValue(
          'patientId',
          selected.displayId.startsWith('#')
            ? selected.displayId
            : `#${selected.displayId}`,
        );
        serviceForm.setValue('fullName', selected.fullName);
        serviceForm.setValue('contactNumber', selected.mobileNumber);
      }

      const [billings, prescriptions, catalogue] = await Promise.all([
        getBillingsByPatient(patientUuid).catch(() => [] as BillingDto[]),
        getPrescriptionsByPatient(patientUuid).catch(() => []),
        getAllMedicines().catch(() => []),
      ]);

      const pendingSummary = pickLatestPendingBilling(billings);
      if (pendingSummary) {
        const pendingDetail =
          (await getBillingById(pendingSummary.id).catch(() => null)) ??
          pendingSummary;
        await applyBillingDraftToForm(pendingDetail);
        showToast({
          title: 'Pending bill loaded',
          message:
            'Consultation fees and prescription medicines were filled from the pending billing draft.',
        });
        return;
      }

      // No pending draft — still fill medicines from latest prescription.
      setLinkedBillingId(null);
      const medicineLines = medicineLinesFromPrescriptions(
        prescriptions,
        catalogue,
      );
      setMedicineItems(medicineLines);
      if (medicineLines.length > 0) {
        setInvoiceTypeId((prev) => {
          const option = getInvoiceType(prev);
          if (option.includeMedicine) return prev;
          if (option.includeConsultation) return 'consultation-medicine';
          return 'medicine';
        });
        showToast({
          title: 'Prescription loaded',
          message:
            'No pending billing draft found. Medicines were filled from the latest prescription.',
        });
      } else {
        showToast({
          title: 'Patient selected',
          message: 'No pending billing draft or prescription medicines found.',
        });
      }
    } catch (err) {
      showToast({
        title: 'Could not load billing details',
        message:
          err instanceof ApiError
            ? err.message
            : 'Failed to fetch pending bill or prescription for this patient.',
      });
    } finally {
      setPatientBillingLoading(false);
    }
  };

  const handlePatientSelect = (patientUuid: string) => {
    if (!patientUuid) {
      setPatientContext(null);
      setLinkedBillingId(billingId);
      setMedicineItems([]);
      return;
    }

    const selected = lookup.patients.find((p) => p.value === patientUuid);
    if (!selected) return;

    void loadPatientPendingBillingAndPrescription(patientUuid, {
      displayId: selected.displayId,
      patientCode: selected.patientCode,
      fullName: selected.fullName,
      mobileNumber: selected.mobileNumber,
      email: selected.email,
    });
  };

    serviceForm.setValue(
      'patientId',
      selected.displayId.startsWith('#')
        ? selected.displayId
        : `#${selected.displayId}`,
    );
    serviceForm.setValue('fullName', selected.fullName);
    serviceForm.setValue('contactNumber', selected.mobileNumber);
  };

  useEffect(() => {
    if (!billingId) return;
    let cancelled = false;

    void (async () => {
      try {
        setPatientBillingLoading(true);
        const billing = await getBillingById(billingId);
        if (cancelled) return;

        const displayId = (
          billing.patientDisplayId ??
          billing.formattedPatientId ??
          billing.patientId
        ).replace(/^#/, '');
        const first = billing.services?.[0];
        const serviceTypeLabel =
          first?.serviceType || billing.visitType || 'Consultation';
        const contact = (billing.contactNumber ?? '').replace(/\D/g, '').slice(-10);

        setPaymentOpen(false);
        setPatientContext({
          uuid: billing.patientId,
          displayId,
          patientCode: billing.patientCode ?? '',
        });

        serviceForm.reset({
          patientId: displayId.startsWith('#') ? displayId : `#${displayId}`,
          fullName: billing.patientName ?? '',
          contactNumber: contact,
          invoiceDate: todayIsoDate(),
          visitType: toConsultationVisitLabel(serviceTypeLabel.toString()),
          serviceFees: String(Math.round(first?.serviceFees ?? 0) || ''),
          packageMasterId: first?.packageMasterId ?? '',
          packageType: first?.packageType ?? first?.packageName ?? '',
          packageCharges: first?.packageCharges
            ? String(Math.round(first.packageCharges))
            : '',
        });
        setServiceData(serviceForm.getValues());
      } catch (err) {
        if (cancelled) return;
        showToast({
          title: 'Billing draft not found',
          message:
            err instanceof ApiError
              ? err.message
              : 'Could not load the pending billing draft.',
        });
      } finally {
        if (!cancelled) setPatientBillingLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per billingId
  }, [billingId]);

  const activeBillingId = linkedBillingId || billingId;
  const handleMedicineSelect = (medicineId: string) => {
    const selected = lookup.medicines.find((m) => m.value === medicineId);
    medicineForm.setValue('medicineId', medicineId);
    if (selected) {
      medicineForm.setValue('price', String(selected.price));
    }
  };

  const handlePackageSelect = (packageMasterId: string) => {
    serviceForm.setValue('packageMasterId', packageMasterId);
    if (!packageMasterId) {
      serviceForm.setValue('packageType', '');
      serviceForm.setValue('packageCharges', '');
      return;
    }
    const selected = lookup.packageMasters.find((p) => p.value === packageMasterId);
    if (!selected) return;
    serviceForm.setValue('packageType', selected.label);
    serviceForm.setValue(
      'packageCharges',
      selected.price > 0 ? String(Math.round(selected.price)) : '',
    );
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
    medicineForm.reset({ medicineId: '', quantity: '', price: '' });
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
    therapyForm.reset(EMPTY_THERAPY_VALUES);
  });

  const removeLineItem = (id: string) => {
    setMedicineItems((prev) => prev.filter((item) => item.id !== id));
    setTherapyItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openPayment = async () => {
    const patientValid = await validatePatientDetails();
    if (!patientValid) {
      void goToTab('service');
      return;
    }

    if (serviceForm.getValues('packageType')?.trim()) {
      const packageValid = await serviceForm.trigger(['packageCharges']);
      if (!packageValid) {
        void goToTab('service');
        showToast({
          title: 'Package charges required',
          message: 'Enter package charges if a package type is selected.',
        });
        return;
      }
    }

    const currentItems = [
      ...buildServiceLineItems(serviceForm.getValues()),
      ...medicineItems,
      ...therapyItems,
    ];
    if (currentItems.length === 0) {
      showToast({
        title: 'Add charges',
        message:
          'Fill Service Type, Medicine, or Therapy — any combination — before making payment.',
      });
      return;
    }

    setServiceData(serviceForm.getValues());
    setPaymentOpen(true);
  };

  const handleCreateInvoice = async () => {
    if (paymentSubmitting) return;

    let currentService = serviceData ?? serviceForm.getValues();
    const patientValid = await validatePatientDetails();
    if (!patientValid) {
      setPaymentOpen(false);
      void goToTab('service');
      return;
    }
    currentService = serviceForm.getValues();
    setServiceData(currentService);

    const lineItems = [
      ...buildServiceLineItems(currentService),
      ...medicineItems,
      ...therapyItems,
    ];
    if (lineItems.length === 0) {
      showToast({
        title: 'Empty invoice',
        message: 'Add at least one service, medicine, or therapy before generating an invoice.',
      });
      return;
    }

    if (!patientContext?.uuid && !activeBillingId) {
      showToast({
        title: 'Patient required',
        message: 'Select a patient from the list before generating an invoice.',
      });
      setPaymentOpen(false);
      void goToTab('service');
      return;
    }

    const hasConsultation = buildServiceLineItems(currentService).length > 0;
    const hasMedicine = medicineItems.length > 0;
    const hasTherapy = therapyItems.length > 0;
    const label = describeInvoiceLabel(hasConsultation, hasMedicine, hasTherapy);

    setPaymentSubmitting(true);
    try {
      const paymentMethodApi = toApiPaymentMethod(selectedChannel);
      const paymentModeLabel = resolvePaymentMethodLabel(
        selectedChannel,
        selectedPayment,
      );
      const summary = summaryForm.getValues();
      const visitType: VisitTypeApi =
        hasTherapy && !hasConsultation
          ? 'THERAPY'
          : toVisitTypeApi(currentService.visitType || 'Consultation');

      const basePayload: CreateInvoicePayload = {
        patientId: patientContext?.uuid ?? '',
        patientDisplayId: patientContext?.displayId.replace(/^#/, ''),
        patientCode: patientContext?.patientCode || undefined,
        patientName: currentService.fullName,
        contactNumber: currentService.contactNumber,
        patientEmail: patientContext?.email || undefined,
        invoiceDate: currentService.invoiceDate,
        visitType,
        serviceFees: Number(currentService.serviceFees) || 0,
        packageMasterId: currentService.packageMasterId || null,
        packageType: currentService.packageType || null,
        packageCharges: Number(currentService.packageCharges || 0),
        discount: Number(summary.discount || 0),
        taxEnabled: summary.applyTax,
        cgstPercent: FIXED_CGST_PERCENT,
        sgstPercent: FIXED_SGST_PERCENT,
        amountPaid: 0,
        paymentMethod: paymentMethodApi,
        paymentRemarks: activeBillingId
          ? 'Invoice generated from doctor billing draft'
          : `${label} invoice generated from UI`,
        medicines: medicineItems.map((item) => ({
          medicineId: item.medicineId ?? item.id,
          quantity: item.quantity,
          unitPrice: item.amount,
        })),
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
      };

      const result = activeBillingId
        ? await generateInvoiceFromBilling(activeBillingId, basePayload)
        : await createInvoice(basePayload);

      let settled = result;
      let paymentLinkUrl: string | undefined;
      let paymentLinkEmailed = false;
      let paymentLinkEmail: string | undefined;
      try {
        if (shouldCreatePaymentLink(selectedChannel, selectedPayment)) {
          const due =
            result.leftAmount ??
            Math.max(
              0,
              (result.totalAmount ?? 0) - (result.paidAmount ?? 0),
            );
          const phone = currentService.contactNumber?.replace(/\D/g, '') ?? '';
          const firstName =
            currentService.fullName.trim().split(/\s+/)[0] || 'Patient';

          let email = patientContext?.email?.trim() || undefined;
          if (!email && patientContext?.uuid) {
            const patient = await getPatientById(patientContext.uuid).catch(
              () => null,
            );
            email = patient?.email?.trim() || undefined;
            if (email) {
              setPatientContext((prev) =>
                prev ? { ...prev, email } : prev,
              );
            }
          }

          if (due <= 0) {
            showToast({
              title: 'Invoice already paid',
              message: 'No balance left to create a payment link.',
            });
          } else if (!email || phone.length < 10) {
            showToast({
              title: 'Payment link not sent',
              message:
                'Invoice was created unpaid. Add a valid patient email and 10-digit phone, then use Billing → Send link.',
            });
          } else {
            const linkResult = await sendInvoicePaymentLink({
              invoiceId: result.id,
              amount: due,
              firstName,
              email,
              phone: phone.slice(-10),
              sendEmail: true,
              upiQr: false,
            });
            paymentLinkUrl = linkResult.payUrl;
            paymentLinkEmailed = linkResult.emailSent;
            paymentLinkEmail = linkResult.link.email || email;
          }
        } else {
          settled = await settleInvoicePayment(
            result,
            paymentMethodApi === 'ONLINE' ? 'CASH' : paymentMethodApi,
            basePayload.paymentRemarks ??
              'Payment collected at invoice generation',
            selectedChannel === 'via_payment' && selectedPayment === 'partial',
          );
        }
      } catch (err) {
        showToast({
          title: 'Invoice created',
          message:
            err instanceof ApiError
              ? `Invoice saved, but payment step failed: ${err.message}`
              : 'The invoice was generated, but the payment link could not be created.',
        });
      }

      setCreatedInvoiceId(settled.id);
      setCreatedInvoiceNumber(settled.invoiceNumber ?? settled.invoiceId);
      setPaymentSuccessDetails({
        ...mapInvoiceToPaymentSuccess(settled),
        paymentMethod: paymentModeLabel,
        ...(paymentLinkUrl
          ? {
              amount: settled.leftAmount ?? settled.totalAmount,
              payUrl: paymentLinkUrl,
              recipientEmail: paymentLinkEmail,
              emailSent: paymentLinkEmailed,
              title: paymentLinkEmailed
                ? 'Payment link emailed'
                : 'Payment link created',
            }
          : {}),
      });
      setPaymentSuccessOpen(true);
      setPaymentOpen(false);
      showToast({
        title: 'Invoice generated',
        message: billingId
          ? 'The billing draft has been completed and the invoice is ready.'
          : `${label} invoice has been generated successfully.`,
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

  const renderFooter = () => {
    if (activeTab === 'service' || activeTab === 'medicine') {
      return (
        <>
          <Button
            className="min-w-[120px] px-8 py-2.5"
            onClick={() =>
              void goToTab(activeTab === 'service' ? 'medicine' : 'therapy')
            }
          >
            Next
          </Button>
          <Button className="min-w-[160px] px-8 py-2.5" onClick={() => void openPayment()}>
            Make Payment
          </Button>
        </>
      );
    }

    if (activeTab === 'therapy') {
      return (
        <Button className="min-w-[132px] px-8 py-2.5" onClick={() => void goToTab('summary')}>
          Confirm
        </Button>
      );
    }

    return (
      <Button className="min-w-[160px] px-8 py-2.5" onClick={() => void openPayment()}>
        Make Payment
      </Button>
    );
  };

  if (paymentOpen) {
    return (
      <div className="space-y-5">
        <BillingBreadcrumbs />
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brown">
                {invoiceLabel} Invoice
              </h2>
            </div>
            <UnpaidBadge />
          </div>

          <PatientInfoGrid patient={patientInfo} />

          <div className="mt-6">
            <LineItemsPanel
              items={selectedLineItems}
              nameHeader="Bill Name"
              onRemove={removeLineItem}
            />
          </div>

          <BillSummaryTotals
            totals={invoiceTotals}
            discount={Number(summaryValues.discount || 0)}
            applyTax={summaryValues.applyTax}
            cgstRate={FIXED_CGST_PERCENT}
            sgstRate={FIXED_SGST_PERCENT}
          />

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
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Back
            </Button>
            <Button variant="outline" onClick={() => setInvoicePreviewOpen(true)}>
              Preview Invoice
            </Button>
            <Button
              onClick={() => void handleCreateInvoice()}
              disabled={paymentSubmitting}
            >
              {paymentSubmitting ? 'Creating…' : 'Generate Invoice'}
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
          invoiceId={createdInvoiceId}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] flex-col gap-4">
      <BillingBreadcrumbs />

      <Card className="flex flex-1 flex-col p-6 sm:px-8 sm:py-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-brown">Generate Invoice</h2>
          <p className="mt-1 text-sm text-text-muted">
            Please fill out the details to generate invoice
          </p>
        </div>

        <nav className="grid grid-cols-4" aria-label="Invoice sections">
          {INVOICE_TABS.map((tab) => {
            const isCurrent = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => void goToTab(tab.id)}
                aria-current={isCurrent ? 'page' : undefined}
                className="flex justify-start"
              >
                <span
                  className={cn(
                    'relative pb-3 text-sm font-medium transition-colors',
                    isCurrent ? 'text-gold' : 'text-brown',
                  )}
                >
                  {tab.label}
                  {isCurrent ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-1 flex-col pt-7">
          {activeTab === 'service' ? (
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
              {billingId ? (
                <Input
                  label="Patient ID"
                  placeholder="Patient ID"
                  error={serviceForm.formState.errors.patientId?.message}
                  {...serviceForm.register('patientId')}
                  readOnly
                />
              ) : (
                <Select
                  label="Patient ID"
                  placeholder="Patient ID"
                  options={lookup.patients.map((patient) => ({
                    value: patient.value,
                    label: patient.displayId.startsWith('#')
                      ? patient.displayId
                      : `#${patient.displayId}`,
                  }))}
                  value={patientContext?.uuid ?? ''}
                  onChange={(event) => handlePatientSelect(event.target.value)}
                  error={serviceForm.formState.errors.patientId?.message}
                />
              )}
              <Input
                label="Full Name"
                placeholder="Full Name"
                error={serviceForm.formState.errors.fullName?.message}
                {...serviceForm.register('fullName')}
              />
              <Input
                label="Contact Number"
                placeholder="Contact Number"
                error={serviceForm.formState.errors.contactNumber?.message}
                {...serviceForm.register('contactNumber')}
              />
              <Input
                label="Invoice Date"
                type="date"
                error={serviceForm.formState.errors.invoiceDate?.message}
                {...serviceForm.register('invoiceDate')}
              />
              <Select
                label="Visit Type"
                placeholder="Visit Type"
                options={[...CONSULTATION_VISIT_OPTIONS]}
                error={serviceForm.formState.errors.visitType?.message}
                {...serviceForm.register('visitType')}
              />
              <RupeeInput
                label="Service Fees"
                placeholder=""
                error={serviceForm.formState.errors.serviceFees?.message}
                {...serviceForm.register('serviceFees')}
              />
              <div className="sm:col-span-2">
                <Select
                  label="Package Type"
                  placeholder="Package Type"
                  options={packageTypeOptions}
                  error={serviceForm.formState.errors.packageType?.message}
                  {...serviceForm.register('packageType', {
                    onChange: (event) => {
                      if (!event.target.value) {
                        serviceForm.setValue('packageCharges', '');
                      }
                      serviceForm.setValue('packageMasterId', '');
                    },
                  })}
                />
              </div>
              <RupeeInput
                label="Package Charges"
                placeholder=""
                disabled={!packageTypeValue}
                error={serviceForm.formState.errors.packageCharges?.message}
                {...serviceForm.register('packageCharges')}
              />
            </div>
          ) : null}

          {activeTab === 'medicine' ? (
            <div>
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
                <Select
                  label="Medicine Name"
                  placeholder="Medicine Name"
                  options={lookup.medicines.map((medicine) => ({
                    value: medicine.value,
                    label: medicine.label,
                  }))}
                  value={medicineForm.watch('medicineId')}
                  onChange={(event) => handleMedicineSelect(event.target.value)}
                  error={medicineForm.formState.errors.medicineId?.message}
                />
                <Select
                  label="Quantity"
                  placeholder="Quantity"
                  options={MEDICINE_QUANTITY_OPTIONS}
                  error={medicineForm.formState.errors.quantity?.message}
                  {...medicineForm.register('quantity')}
                />
                <RupeeInput
                  label="Price"
                  placeholder=""
                  error={medicineForm.formState.errors.price?.message}
                  {...medicineForm.register('price')}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2.5"
                  onClick={handleAddMedicine}
                >
                  + Add More Medicine
                </Button>
              </div>

              {medicineItems.length > 0 ? (
                <>
                  <div className="mt-8">
                    <LineItemsPanel
                      items={medicineItems}
                      nameHeader="Medicine Name"
                      onRemove={removeLineItem}
                    />
                  </div>
                  <SubtotalRow amount={medicineSubtotal} />
                </>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'therapy' ? (
            <div>
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-brown">
                    Therapy Treatment
                  </h3>
                  <button
                    type="button"
                    className="rounded p-1 text-text-muted hover:bg-brown/5 hover:text-brown"
                    aria-label="Clear therapy treatment"
                    onClick={() => {
                      therapyForm.setValue('therapyName', '');
                      therapyForm.setValue('therapyPrice', '');
                      therapyForm.setValue('assignedTherapistId', '');
                      therapyForm.setValue('assignedTherapistName', '');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
                  <Select
                    label="Therapy name"
                    placeholder="Therapy name"
                    options={lookup.therapies.map((therapy) => ({
                      value: therapy.value,
                      label: therapy.label,
                    }))}
                    value={therapyForm.watch('therapyName')}
                    onChange={(event) => handleTherapySelect(event.target.value)}
                    error={therapyForm.formState.errors.therapyName?.message}
                  />
                  <RupeeInput
                    label="Therapy Price"
                    placeholder=""
                    error={therapyForm.formState.errors.therapyPrice?.message}
                    {...therapyForm.register('therapyPrice')}
                  />
                  <Select
                    label="Assigned Therapist"
                    placeholder="Assigned Therapist"
                    options={lookup.therapists.map((therapist) => ({
                      value: therapist.value,
                      label: therapist.label,
                    }))}
                    value={therapyForm.watch('assignedTherapistId')}
                    onChange={(event) => handleTherapistSelect(event.target.value)}
                    error={therapyForm.formState.errors.assignedTherapistId?.message}
                  />
                </div>
              </section>

              <section className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-brown">
                    Therapy Schedule
                  </h3>
                  <button
                    type="button"
                    className="rounded p-1 text-text-muted hover:bg-brown/5 hover:text-brown"
                    aria-label="Clear therapy schedule"
                    onClick={() => {
                      therapyForm.setValue('scheduleDate', '');
                      therapyForm.setValue('scheduleTime', '');
                      therapyForm.setValue('sessionDuration', '45 mins');
                      therapyForm.setValue('sessionFrequency', '1');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="Schedule Date"
                    type="date"
                    error={therapyForm.formState.errors.scheduleDate?.message}
                    {...therapyForm.register('scheduleDate')}
                  />
                  <Select
                    label="Schedule Time"
                    placeholder="Schedule Time"
                    options={BOOKING_TIME_OPTIONS}
                    error={therapyForm.formState.errors.scheduleTime?.message}
                    {...therapyForm.register('scheduleTime')}
                  />
                  <Input
                    label="Session Duration"
                    placeholder="Session Duration"
                    error={therapyForm.formState.errors.sessionDuration?.message}
                    {...therapyForm.register('sessionDuration')}
                  />
                  <Input
                    label="Session Frequency"
                    placeholder="Session Frequency"
                    error={therapyForm.formState.errors.sessionFrequency?.message}
                    {...therapyForm.register('sessionFrequency')}
                  />
                </div>
              </section>

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2.5"
                  onClick={handleAddTherapy}
                >
                  + Add More Therapy
                </Button>
              </div>

              {therapyItems.length > 0 ? (
                <>
                  <div className="mt-8">
                    <LineItemsPanel
                      items={therapyItems}
                      nameHeader="Therapy Name"
                      onRemove={removeLineItem}
                    />
                  </div>
                  <SubtotalRow amount={therapySubtotal} />
                </>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'summary' ? (
            <BillingSummaryTab
              billId={createdInvoiceNumber}
              patient={patientInfo}
              items={selectedLineItems}
              summaryForm={summaryForm}
              totals={invoiceTotals}
              discount={discount}
              applyTax={applyTax}
              cgstRate={cgstRate}
              sgstRate={sgstRate}
              onRemove={removeLineItem}
            />
          ) : null}
        </div>

        <div className="mt-auto flex justify-end gap-3 pt-10">
          {renderFooter()}
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
    </div>
  );
}

function BillingSummaryTab({
  billId,
  patient,
  items,
  summaryForm,
  totals,
  discount,
  applyTax,
  cgstRate,
  sgstRate,
  onRemove,
}: {
  billId?: string | null;
  patient: InvoiceServiceStepValues;
  items: InvoiceLineItem[];
  summaryForm: ReturnType<typeof useForm<InvoiceSummaryValues>>;
  totals: ReturnType<typeof calculateInvoiceTotals>;
  discount: number;
  applyTax: boolean;
  cgstRate: number;
  sgstRate: number;
  onRemove?: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-base font-semibold text-brown">Billing Summary</h3>
        <span className="text-text-muted" aria-hidden>
          <X className="h-4 w-4" />
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brown">
          Bill ID:{' '}
          <span className="font-medium">
            {billId ? `#${billId.replace(/^#/, '')}` : '—'}
          </span>
        </p>
        <UnpaidBadge />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem label="Bill To" value="Ganesha Ayurveda" />
        <InfoItem
          label="Bill Date & Time"
          value={formatBillDateTime(patient.invoiceDate)}
        />
        <InfoItem
          label="Patient ID"
          value={
            patient.patientId
              ? patient.patientId.startsWith('#')
                ? patient.patientId
                : `#${patient.patientId}`
              : '—'
          }
        />
        <InfoItem label="Patient Name" value={patient.fullName || '—'} />
      </div>

      <LineItemsPanel items={items} nameHeader="Bill Name" onRemove={onRemove} />

      <div className="mt-6 grid grid-cols-1 items-end gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-muted">
            Discount (if any)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              ₹
            </span>
            <input
              type="number"
              min={0}
              placeholder=""
              className="h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-4 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              {...summaryForm.register('discount')}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Controller
              name="applyTax"
              control={summaryForm.control}
              render={({ field }) => (
                <>
                  <input
                    type="checkbox"
                    id="apply-tax-summary"
                    className="checkbox-gold"
                    checked={Boolean(field.value)}
                    onChange={(event) => field.onChange(event.target.checked)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <label
                    htmlFor="apply-tax-summary"
                    className="text-sm font-medium text-brown"
                  >
                    CGST & SGST
                  </label>
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="CGST"
              disabled={!applyTax}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              {...summaryForm.register('cgst')}
            />
            <input
              placeholder="SGST"
              disabled={!applyTax}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              {...summaryForm.register('sgst')}
            />
          </div>
        </div>
      </div>

      <BillSummaryTotals
        totals={totals}
        discount={discount}
        applyTax={applyTax}
        cgstRate={cgstRate}
        sgstRate={sgstRate}
        className="mt-6"
      />
    </section>
  );
}

function PatientInfoGrid({ patient }: { patient: InvoiceServiceStepValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InfoItem label="Bill To" value="Ganesha Ayurveda" />
      <InfoItem label="Invoice Date" value={patient.invoiceDate} />
      <InfoItem label="Patient ID" value={patient.patientId} />
      <InfoItem label="Patient Name" value={patient.fullName} />
    </div>
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
    <div className={cn('space-y-2.5 text-sm', className)}>
      <TotalRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
      {applyTax ? (
        <>
          <TotalRow
            label={`Tax (${cgstRate}% on Subtotal)`}
            value={`+${formatCurrency(totals.cgst)}`}
          />
          <TotalRow
            label={`Tax (${sgstRate}% on Subtotal)`}
            value={`+${formatCurrency(totals.sgst)}`}
          />
        </>
      ) : null}
      <TotalRow
        label="Discount"
        value={`-${formatCurrency(discount)}`}
        className="text-success"
      />
      <TotalRow label="Total" value={formatCurrency(totals.total)} bold />
    </div>
  );
}

function SubtotalRow({ amount }: { amount: number }) {
  return (
    <div className="mt-6 flex items-center justify-between px-1 text-sm">
      <span className="text-text-muted">Subtotal</span>
      <span className="font-medium text-brown">{formatCurrency(amount)}</span>
    </div>
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

function UnpaidBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e7a3ad] px-3 py-0.5 text-xs font-medium text-[#d45b6a]">
      Unpaid
    </span>
  );
}

function LineItemsPanel({
  items,
  nameHeader,
  onRemove,
}: {
  items: InvoiceLineItem[];
  nameHeader: string;
  onRemove?: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-[#faf6ee] px-6 py-8 text-center text-sm text-text-muted">
        No items added yet. Use any tab to add service, medicine, or therapy charges.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#faf6ee]">
      <div className="grid grid-cols-[minmax(0,1fr)_7.5rem_6.5rem] gap-4 px-6 py-3 text-sm text-text-muted">
        <span>{nameHeader}</span>
        <span>Quantity</span>
        <span className="text-right">Amount</span>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="group grid grid-cols-[minmax(0,1fr)_7.5rem_6.5rem] items-center gap-4 px-6 py-2.5 text-sm"
        >
          <span className="inline-flex min-w-0 items-center gap-2 font-medium text-brown">
            <Link2 className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="truncate">{item.name}</span>
            {onRemove && item.type !== 'service' ? (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="ml-1 text-text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </span>
          <span className="text-brown">{item.quantity}</span>
          <span className="text-right font-medium text-brown">
            {formatCurrency(item.amount * item.quantity)}
          </span>
        </div>
      ))}
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
      <span className={bold ? 'text-brown' : 'text-text-muted'}>{label}</span>
      <span className={className ?? 'text-brown'}>{value}</span>
    </div>
  );
}
