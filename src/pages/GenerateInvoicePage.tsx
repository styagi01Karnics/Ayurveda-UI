import { useEffect, useMemo, useState } from 'react';
import { Link2, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingBreadcrumbs } from '@/components/billing/BillingBreadcrumbs';
import { PaymentSuccessModal, mapInvoiceToPaymentSuccess, type PaymentSuccessDetails } from '@/components/billing/PaymentSuccessModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PatientSearchSelect } from '@/components/ui/PatientSearchSelect';
import { RupeeInput } from '@/components/ui/RupeeInput';
import { Select } from '@/components/ui/Select';
import { PAYMENT_MODES } from '@/data/mock/billing';
import { useAsyncData } from '@/hooks/useAsyncData';
import { BOOKING_TIME_OPTIONS } from '@/lib/bookingConstraints';
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
import { calculatePrescriptionMedicineQuantity } from '@/lib/prescriptionQuantity';
import type { MedicineDto } from '@/lib/api/types';
import {
  calculateInvoiceTotals,
  invoiceMedicineItemSchema,
  invoiceServiceStepSchema,
  invoiceSummarySchema,
  invoiceTherapyItemSchema,
  type InvoiceMedicineItemValues,
  type InvoiceServiceStepValues,
  type InvoiceSummaryValues,
  type InvoiceTherapyItemValues,
} from '@/lib/validation/billing.schema';
import { resolvePatientDisplayCode } from '@/lib/displayCodes';
import { formatCurrency } from '@/lib/utils';
import type {
  BillSummaryState,
  InvoiceLineItem,
  PaymentModeId,
  TherapyInvoiceLineItem,
} from '@/types';

type InvoiceTypeId =
  | 'consultation'
  | 'therapy'
  | 'medicine'
  | 'consultation-medicine'
  | 'consultation-therapy'
  | 'consultation-medicine-therapy';

interface InvoiceTypeOption {
  id: InvoiceTypeId;
  label: string;
  includeConsultation: boolean;
  includeMedicine: boolean;
  includeTherapy: boolean;
}

const INVOICE_TYPE_OPTIONS: InvoiceTypeOption[] = [
  {
    id: 'consultation',
    label: 'Consultation',
    includeConsultation: true,
    includeMedicine: false,
    includeTherapy: false,
  },
  {
    id: 'therapy',
    label: 'Therapy',
    includeConsultation: false,
    includeMedicine: false,
    includeTherapy: true,
  },
  {
    id: 'medicine',
    label: 'Medicine',
    includeConsultation: false,
    includeMedicine: true,
    includeTherapy: false,
  },
  {
    id: 'consultation-medicine',
    label: 'Consultation + Medicine',
    includeConsultation: true,
    includeMedicine: true,
    includeTherapy: false,
  },
  {
    id: 'consultation-therapy',
    label: 'Consultation + Therapy',
    includeConsultation: true,
    includeMedicine: false,
    includeTherapy: true,
  },
  {
    id: 'consultation-medicine-therapy',
    label: 'Consultation + Medicine + Therapy',
    includeConsultation: true,
    includeMedicine: true,
    includeTherapy: true,
  },
];

const CONSULTATION_VISIT_OPTIONS = ['Consultation', 'Therapy', 'Follow-up'] as const;

const DEFAULT_SUMMARY: BillSummaryState = {
  discount: '0',
  applyTax: true,
  cgst: '3',
  sgst: '3',
};

const PATIENT_FIELDS = [
  'patientId',
  'fullName',
  'contactNumber',
  'invoiceDate',
] as const;

function getInvoiceType(id: InvoiceTypeId): InvoiceTypeOption {
  return INVOICE_TYPE_OPTIONS.find((option) => option.id === id) ?? INVOICE_TYPE_OPTIONS[0];
}

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

function toConsultationVisitLabel(value: string): string {
  const upper = value.toUpperCase().replace(/[\s-]+/g, '_');
  if (upper.includes('FOLLOW')) return 'Follow-up';
  if (upper.includes('PACKAGE')) return 'Package';
  if (upper.includes('THERAPY') && !upper.includes('CONSULT')) return 'Therapy';
  return 'Consultation';
}

/** Infer invoice type chips from billing draft `services[].serviceType` (e.g. "Therapy + Consultation"). */
function resolveInvoiceTypeFromBillingServices(
  services: Array<{ serviceType?: string | null }> | undefined,
  fallbackVisitType?: string | null,
  hasMedicines = false,
): InvoiceTypeId {
  const tokens = new Set<string>();

  const consume = (raw: string) => {
    for (const part of raw.split(/\s*\+\s*/)) {
      const upper = part.trim().toUpperCase().replace(/[\s-]+/g, '_');
      if (!upper) continue;
      if (upper.includes('MEDICINE')) tokens.add('medicine');
      else if (upper.includes('THERAPY') || upper.includes('TREATMENT')) {
        tokens.add('therapy');
      } else if (
        upper.includes('CONSULT') ||
        upper.includes('FOLLOW') ||
        upper.includes('PACKAGE')
      ) {
        tokens.add('consultation');
      }
    }
  };

  for (const service of services ?? []) {
    if (service.serviceType) consume(service.serviceType);
  }
  if (fallbackVisitType) consume(fallbackVisitType);
  if (hasMedicines) tokens.add('medicine');

  const hasConsultation = tokens.has('consultation');
  const hasMedicine = tokens.has('medicine');
  const hasTherapy = tokens.has('therapy');

  if (hasConsultation && hasMedicine && hasTherapy) {
    return 'consultation-medicine-therapy';
  }
  if (hasConsultation && hasMedicine) return 'consultation-medicine';
  if (hasConsultation && hasTherapy) return 'consultation-therapy';
  if (hasMedicine && hasTherapy) return 'consultation-medicine-therapy';
  if (hasTherapy) return 'therapy';
  if (hasMedicine) return 'medicine';
  return 'consultation';
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

function parseSessionMinutes(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 45;
}

/** Map form session frequency to API string (doc: `"ONCE"`). */
function toSessionFrequencyApi(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '1') return 'ONCE';
  if (/^\d+$/.test(trimmed)) {
    return trimmed === '1' ? 'ONCE' : trimmed;
  }
  return trimmed.toUpperCase().replace(/[\s-]+/g, '_');
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

function pickLatestPendingBilling(billings: BillingDto[]): BillingDto | null {
  const pending = billings.filter((row) => {
    const status = String(row.status ?? '').toUpperCase();
    return status === 'PENDING' && !row.invoiceId && !row.invoiceNumber;
  });
  if (pending.length === 0) return null;
  return [...pending].sort((a, b) => {
    const aTime = a.updatedAt
      ? Date.parse(a.updatedAt)
      : a.createdAt
        ? Date.parse(a.createdAt)
        : 0;
    const bTime = b.updatedAt
      ? Date.parse(b.updatedAt)
      : b.createdAt
        ? Date.parse(b.createdAt)
        : 0;
    return bTime - aTime;
  })[0];
}

function medicineLinesFromBillingDraft(
  billing: BillingDto | null | undefined,
): InvoiceLineItem[] {
  const draftMedicines = billing?.medicines ?? [];
  if (draftMedicines.length === 0) return [];
  return draftMedicines.map((row, index) => ({
    id: row.medicineId ?? `billing-med-${index}`,
    medicineId: row.medicineId,
    name: row.medicineName || 'Medicine',
    quantity: Math.max(1, Number(row.quantity) || 1),
    amount: Number(row.unitPrice) || 0,
    type: 'medicine' as const,
  }));
}

function medicineLinesFromPrescriptions(
  prescriptions: PrescriptionDto[],
  catalogue: MedicineDto[],
): InvoiceLineItem[] {
  const catalogueById = new Map(catalogue.map((item) => [item.id, item]));
  const latestWithMeds = [...prescriptions]
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    })
    .find((rx) => (rx.medicines?.length ?? 0) > 0);

  return (latestWithMeds?.medicines ?? [])
    .filter((row) => row.medicineId)
    .map((row, index) => {
      const catalogueRow = catalogueById.get(row.medicineId as string);
      return {
        id: row.medicineId ?? `rx-med-${index}`,
        medicineId: row.medicineId,
        name: row.medicineName || catalogueRow?.medicineName || 'Medicine',
        quantity: calculatePrescriptionMedicineQuantity({
          dosage: row.dosage,
          frequency: row.frequency,
          duration: row.duration,
        }),
        amount: Number(catalogueRow?.sellingPrice ?? catalogueRow?.price ?? 0),
        type: 'medicine' as const,
      };
    });
}

export function GenerateInvoicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billingId = searchParams.get('billingId');
  const { showToast } = useToast();
  const [invoiceTypeId, setInvoiceTypeId] = useState<InvoiceTypeId>('consultation');
  const [serviceData, setServiceData] = useState<InvoiceServiceStepValues | null>(
    null,
  );
  const [medicineItems, setMedicineItems] = useState<InvoiceLineItem[]>([]);
  const [therapyItems, setTherapyItems] = useState<TherapyInvoiceLineItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentModeId>('upi');
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

  const invoiceType = getInvoiceType(invoiceTypeId);
  const { includeConsultation, includeMedicine, includeTherapy } = invoiceType;
  const availableInvoiceTypes = INVOICE_TYPE_OPTIONS;

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
      visitType: 'Consultation',
      serviceFees: '',
      packageMasterId: '',
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
      sessionFrequency: 'ONCE',
    },
  });

  const summaryForm = useForm<InvoiceSummaryValues>({
    resolver: zodResolver(invoiceSummarySchema),
    defaultValues: { ...DEFAULT_SUMMARY },
  });

  const watchedService = serviceForm.watch();
  const serviceLineItems = useMemo(
    () =>
      includeConsultation
        ? serviceData
          ? buildServiceLineItems(serviceData)
          : buildServiceLineItems(watchedService as InvoiceServiceStepValues)
        : [],
    [includeConsultation, serviceData, watchedService],
  );

  const selectedLineItems = useMemo(() => {
    const items: InvoiceLineItem[] = [];
    if (includeConsultation) items.push(...serviceLineItems);
    if (includeMedicine) items.push(...medicineItems);
    if (includeTherapy) items.push(...therapyItems);
    return items;
  }, [
    includeConsultation,
    includeMedicine,
    includeTherapy,
    serviceLineItems,
    medicineItems,
    therapyItems,
  ]);

  const applyTax = summaryForm.watch('applyTax');
  const discount = Number(summaryForm.watch('discount') || 0);
  const cgstRate = Number(summaryForm.watch('cgst') || 3);
  const sgstRate = Number(summaryForm.watch('sgst') || 3);
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

  const patientInfo = serviceData ?? (watchedService as InvoiceServiceStepValues);

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
    },
  ) => {
    setPatientBillingLoading(true);
    try {
      if (selected) {
        setPatientContext({
          uuid: patientUuid,
          displayId: selected.displayId,
          patientCode: selected.patientCode,
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
    });
  };

  /** Resolve typed patient code (e.g. GAN-DL-PT-00013) and load pending bill + Rx. */
  const handlePatientCodeCommit = () => {
    if (billingId) return;
    const raw = serviceForm.getValues('patientId').trim().replace(/^#/, '');
    if (!raw) return;

    const matched = lookup.patients.find((p) => {
      const code = (p.patientCode || p.displayId || '').replace(/^#/, '');
      return (
        code.toLowerCase() === raw.toLowerCase() ||
        p.uuid === raw ||
        p.value === raw
      );
    });
    if (!matched) {
      showToast({
        title: 'Patient not found',
        message: 'Enter a valid patient code from the active patient list.',
      });
      return;
    }

    void loadPatientPendingBillingAndPrescription(matched.uuid, {
      displayId: matched.displayId,
      patientCode: matched.patientCode,
      fullName: matched.fullName,
      mobileNumber: matched.mobileNumber,
    });
  };

  useEffect(() => {
    if (!billingId) return;
    let cancelled = false;

    void (async () => {
      try {
        setPatientBillingLoading(true);
        const billing = await getBillingById(billingId);
        if (cancelled) return;
        await applyBillingDraftToForm(billing);
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

  const handleInvoiceTypeChange = (nextId: InvoiceTypeId) => {
    const next = getInvoiceType(nextId);
    setInvoiceTypeId(nextId);
    setPaymentOpen(false);
    if (next.includeConsultation) {
      const currentVisit = serviceForm.getValues('visitType');
      if (!currentVisit || currentVisit === 'Therapy') {
        serviceForm.setValue('visitType', 'Consultation');
      }
    } else if (next.includeTherapy) {
      serviceForm.setValue('visitType', 'Therapy');
    } else {
      serviceForm.setValue('visitType', 'Consultation');
    }
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
      sessionFrequency: 'ONCE',
    });
  });

  const removeLineItem = (id: string) => {
    setMedicineItems((prev) => prev.filter((item) => item.id !== id));
    setTherapyItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openPayment = async () => {
    const patientValid = await serviceForm.trigger([...PATIENT_FIELDS]);
    if (!patientValid) {
      showToast({
        title: 'Patient details required',
        message: 'Complete patient information before continuing to payment.',
      });
      return;
    }

    if (!patientContext?.uuid && !activeBillingId) {
      showToast({
        title: 'Patient required',
        message: 'Select a patient from the list before generating an invoice.',
      });
      return;
    }

    if (includeConsultation) {
      const consultationValid = await serviceForm.trigger([
        'visitType',
        'serviceFees',
        'packageMasterId',
        'packageCharges',
      ]);
      const serviceFees = serviceForm.getValues('serviceFees')?.trim();
      if (!consultationValid || !serviceFees) {
        if (!serviceFees) {
          serviceForm.setError('serviceFees', {
            type: 'manual',
            message: 'Service fees is required',
          });
        }
        showToast({
          title: 'Consultation details required',
          message: 'Enter visit type and service fees for a consultation invoice.',
        });
        return;
      }
    }

    if (includeMedicine && medicineItems.length === 0) {
      showToast({
        title: 'Medicine required',
        message: 'Add at least one medicine before generating this invoice.',
      });
      return;
    }

    if (includeTherapy && therapyItems.length === 0) {
      showToast({
        title: 'Therapy required',
        message: 'Add at least one therapy before generating this invoice.',
      });
      return;
    }

    setServiceData(serviceForm.getValues());
    setPaymentOpen(true);
  };

  const handleCreateInvoice = async () => {
    if (paymentSubmitting) return;

    let currentService = serviceData ?? serviceForm.getValues();
    const patientValid = await serviceForm.trigger([...PATIENT_FIELDS]);
    if (!patientValid) {
      showToast({
        title: 'Patient details required',
        message: 'Complete patient information before generating an invoice.',
      });
      setPaymentOpen(false);
      return;
    }
    currentService = serviceForm.getValues();
    setServiceData(currentService);

    if (selectedLineItems.length === 0) {
      showToast({
        title: 'Empty invoice',
        message: 'Add the selected billing items before generating an invoice.',
      });
      return;
    }

    if (!patientContext?.uuid && !activeBillingId) {
      showToast({
        title: 'Patient required',
        message: 'Select a patient from the list before generating an invoice.',
      });
      setPaymentOpen(false);
      return;
    }

    setPaymentSubmitting(true);
    try {
      const paymentMode =
        PAYMENT_MODES.find((m) => m.id === selectedPayment)?.title ?? 'UPI';
      const summary = summaryForm.getValues();
      const visitType: VisitTypeApi =
        includeTherapy && !includeConsultation
          ? 'THERAPY'
          : toVisitTypeApi(currentService.visitType || 'Consultation');

      const medicinesPayload = includeMedicine
        ? medicineItems.map((item) => ({
            medicineId: item.medicineId ?? item.id,
            quantity: item.quantity,
            unitPrice: item.amount,
          }))
        : [];

      const therapiesPayload = includeTherapy
        ? therapyItems.map((item) => ({
            itemName: item.name,
            quantity: item.quantity,
            unitPrice: item.amount,
            assignedTherapistId: item.assignedTherapistId,
            assignedTherapistName: item.assignedTherapist,
            scheduleDate: item.scheduleDate,
            scheduleTime: normalizeInvoiceTime(item.scheduleTime),
            sessionDuration: parseSessionMinutes(item.sessionDuration),
            sessionFrequency: toSessionFrequencyApi(
              item.sessionFrequency || 'ONCE',
            ),
          }))
        : [];

      const packageChargesRaw = currentService.packageCharges?.trim();
      const packageCharges =
        includeConsultation && packageChargesRaw
          ? Number(packageChargesRaw)
          : null;

      const basePayload: CreateInvoicePayload = {
        patientId: patientContext?.uuid ?? '',
        patientDisplayId: patientContext?.displayId.replace(/^#/, ''),
        patientCode: patientContext?.patientCode || undefined,
        patientName: currentService.fullName,
        contactNumber: currentService.contactNumber,
        invoiceDate: currentService.invoiceDate,
        visitType,
        serviceFees: includeConsultation
          ? Number(currentService.serviceFees) || 0
          : 0,
        packageMasterId: includeConsultation
          ? currentService.packageMasterId || null
          : null,
        packageType: includeConsultation
          ? currentService.packageType || null
          : null,
        packageCharges,
        discount: Number(summary.discount || 0),
        taxEnabled: summary.applyTax,
        cgstPercent: Number(summary.cgst || 3),
        sgstPercent: Number(summary.sgst || 3),
        amountPaid: 0,
        paymentMethod: paymentMode.toUpperCase(),
        paymentRemarks: activeBillingId
          ? 'Invoice generated from doctor billing draft'
          : `${invoiceType.label} invoice generated from UI`,
        medicines: medicinesPayload,
        therapies: therapiesPayload,
      };

      const result = activeBillingId
        ? await generateInvoiceFromBilling(activeBillingId, basePayload)
        : await createInvoice(basePayload);

      let settled = result;
      try {
        settled = await settleInvoicePayment(
          result,
          paymentMode.toUpperCase(),
          basePayload.paymentRemarks ?? 'Payment collected at invoice generation',
          selectedPayment === 'partial',
        );
      } catch {
        showToast({
          title: 'Invoice created',
          message:
            'The invoice was generated, but payment could not be recorded. You can collect it from Billing.',
        });
      }

      setCreatedInvoiceId(settled.id);
      setCreatedInvoiceNumber(settled.invoiceId);
      setPaymentSuccessDetails(mapInvoiceToPaymentSuccess(settled));
      setPaymentSuccessOpen(true);
      setPaymentOpen(false);
      showToast({
        title: 'Invoice generated',
        message: activeBillingId
          ? 'The billing draft has been completed and the invoice is ready.'
          : `${invoiceType.label} invoice has been generated successfully.`,
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

  if (paymentOpen) {
    return (
      <div className="space-y-5">
        <BillingBreadcrumbs />
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brown">
                {invoiceType.label} Invoice
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                   </p>
            </div>
            <Badge variant="danger">Unpaid</Badge>
          </div>

          <PatientInfoGrid patient={patientInfo} />

          <div className="mt-6">
            <LineItemsTable items={selectedLineItems} />
          </div>

          <BillSummaryTotals
            totals={invoiceTotals}
            discount={Number(summaryValues.discount || 0)}
            applyTax={summaryValues.applyTax}
            cgstRate={Number(summaryValues.cgst || 3)}
            sgstRate={Number(summaryValues.sgst || 3)}
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
                      {formatCurrency(invoiceTotals.total)}
                    </p>
                  </div>
                </button>
              ))}
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
    <div className="space-y-5">
      <BillingBreadcrumbs />

      <Card className="p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-brown">
            {activeBillingId
              ? 'Start Invoice from Billing Draft'
              : 'Generate Invoice'}
          </h2>
          {patientBillingLoading ? (
            <p className="mt-1 text-sm text-text-muted">
              Loading pending bill and prescription…
            </p>
          ) : linkedBillingId && !billingId ? (
            <p className="mt-1 text-sm text-text-muted">
              Pending billing draft linked for this patient.
            </p>
          ) : null}
        </div>

        <FormSection title="Invoice Type">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {availableInvoiceTypes.map((option) => {
              const selected = option.id === invoiceTypeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleInvoiceTypeChange(option.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    selected
                      ? 'border-gold bg-gold/10 text-brown'
                      : 'border-gray-100 text-text-muted hover:border-gold/40 hover:text-brown'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </FormSection>

        <form className="mt-6 space-y-6" noValidate>
          <FormSection title="Patient Details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <PatientSearchSelect
                label="Select Patient"
                placeholder="Search by patient code or name (min 4 characters)"
                options={lookup.patients.map((p) => ({
                  value: p.value,
                  label: p.label,
                  patientId: p.displayId || p.patientCode || p.value,
                  name: p.fullName,
                }))}
                value={patientContext?.uuid ?? ''}
                onChange={handlePatientSelect}
                disabled={Boolean(billingId) || patientBillingLoading}
              />
              <Input
                label="Patient Code"
                placeholder="e.g. GAN-DL-PT-00013"
                error={serviceForm.formState.errors.patientId?.message}
                readOnly={Boolean(billingId)}
                disabled={patientBillingLoading}
                {...serviceForm.register('patientId', {
                  onBlur: () => {
                    handlePatientCodeCommit();
                  },
                })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePatientCodeCommit();
                  }
                }}
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

          {includeConsultation && (
            <FormSection title="Consultation">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Visit Type *"
                    placeholder="Visit type"
                    options={[...CONSULTATION_VISIT_OPTIONS]}
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
                    label="Package Name"
                    placeholder="Select package"
                    options={[
                      { value: '', label: 'None' },
                      ...lookup.packageMasters,
                    ]}
                    error={serviceForm.formState.errors.packageMasterId?.message}
                    {...serviceForm.register('packageMasterId', {
                      onChange: (e) => handlePackageSelect(e.target.value),
                    })}
                  />
                  <RupeeInput
                    label={
                      serviceForm.watch('packageMasterId')
                        ? 'Package Charges *'
                        : 'Package Charges'
                    }
                    placeholder="0"
                    disabled={!serviceForm.watch('packageMasterId')}
                    error={serviceForm.formState.errors.packageCharges?.message}
                    {...serviceForm.register('packageCharges')}
                  />
                </div>
              </div>
            </FormSection>
          )}

          {includeMedicine && (
            <FormSection title="Medicine">
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
                <Input
                  label="Quantity"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 2"
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
          )}

          {includeTherapy && (
            <>
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
                  <Select
                    label="Schedule Time"
                    placeholder="Select time"
                    options={BOOKING_TIME_OPTIONS}
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
            </>
          )}

          <BillSummarySection
            billLabel={`${invoiceType.label} Invoice`}
            billId={createdInvoiceNumber ?? undefined}
            items={selectedLineItems}
            summaryForm={summaryForm}
            totals={invoiceTotals}
            discount={discount}
            applyTax={applyTax}
            onRemove={removeLineItem}
          />
        </form>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button onClick={() => void openPayment()}>Continue to Payment</Button>
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

function PatientInfoGrid({ patient }: { patient: InvoiceServiceStepValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InfoItem label="Bill To" value="Ganesha Ayurvedaa" />
      <InfoItem label="Invoice Date" value={patient.invoiceDate} />
      <InfoItem label="Patient Code" value={patient.patientId} />
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
                  readOnly
                  tabIndex={-1}
                  className="cursor-not-allowed bg-gray-50 opacity-80"
                  {...summaryForm.register('cgst')}
                />
                <Input
                  label="SGST"
                  placeholder="3"
                  readOnly
                  tabIndex={-1}
                  className="cursor-not-allowed bg-gray-50 opacity-80"
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
                  {item.type === 'service' ? null : (
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="text-text-muted hover:text-danger"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
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
