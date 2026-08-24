import { useMemo } from 'react';
import { CalendarDays, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getTherapiesByCategory,
} from '@/lib/api/appointments';
import { getAllMedicines } from '@/lib/api/medicines';
import type { PrescriptionDto } from '@/lib/api/prescriptions';
import { CLINIC_BRANDING } from '@/lib/clinicBranding';
import { assets } from '@/lib/assets';
import type { DoctorPrescriptionValues } from '@/lib/validation/doctorPatient.schema';
import type { PatientDetail } from '@/types';

interface PrescriptionPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patient: PatientDetail;
  prescription: DoctorPrescriptionValues | null;
  enriched?: PrescriptionDto | null;
  submitting?: boolean;
  confirmLabel?: string;
}

function formatPreviewDate(value?: string | null): string {
  if (!value || value === '—') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function consultationTypeLabel(
  types?: { id: string; name: string }[] | string[],
): string {
  if (!types?.length) return 'Consultation';
  return types
    .map((type) =>
      typeof type === 'string'
        ? type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : type.name,
    )
    .filter(Boolean)
    .join(', ');
}

function formatMeasure(
  value: string | number | null | undefined,
  unit: string,
): string {
  if (value == null || value === '' || value === '—') return '—';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isNaN(numeric) && numeric <= 0) return '—';
  if (typeof value === 'number') return `${value} ${unit}`;
  const trimmed = String(value).trim();
  if (!trimmed) return '—';
  return /[a-zA-Z]/.test(trimmed) ? trimmed : `${trimmed} ${unit}`;
}

function collectTherapyNames(enriched?: PrescriptionDto | null): string[] {
  if (!enriched?.therapySuggestions?.length) return [];
  const names: string[] = [];
  for (const row of enriched.therapySuggestions) {
    for (const therapy of row.recommendedTherapies ?? []) {
      const label = (therapy.therapyName || therapy.name || '').trim();
      if (label) names.push(label);
    }
  }
  return [...new Set(names)];
}

function looksLikeUuidOrId(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  // Partial UUID fragments sometimes land in name fields
  return /^[0-9a-f-]{12,}$/i.test(trimmed) && trimmed.includes('-');
}

function looksLikeSessionRatio(value: string): boolean {
  return /^\d+\s*\/\s*[\d—-]+$/.test(value.trim());
}

/** Adds N days from values like `7_DAYS`, `14_DAYS`, `30_DAYS`. */
export function addDaysFromSchedulingOption(
  baseDate: string | Date | null | undefined,
  schedulingOption?: string | null,
): Date | null {
  if (!baseDate || !schedulingOption) return null;
  const match = schedulingOption.trim().match(/^(\d+)_DAYS$/i);
  if (!match) return null;
  const base =
    baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate);
  if (Number.isNaN(base.getTime())) return null;
  base.setDate(base.getDate() + Number(match[1]));
  return base;
}

function resolveTreatmentProcessTitle(patient: PatientDetail): string {
  const billing = patient.billing;
  const servicePackage = billing.billingServices?.find(
    (row) =>
      (row.packageName &&
        row.packageName !== '—' &&
        !looksLikeUuidOrId(row.packageName)) ||
      (row.packageType &&
        row.packageType !== '—' &&
        !looksLikeUuidOrId(row.packageType)) ||
      row.packageMasterId,
  );
  const packageLabel = [
    billing.packageName,
    servicePackage?.packageName,
    servicePackage?.packageType,
    billing.packageType,
  ]
    .map((value) => (value && value !== '—' ? value.trim() : ''))
    .find((value) => value && !looksLikeUuidOrId(value));

  if (packageLabel) return packageLabel;

  const treatmentName = patient.treatmentFollowUp.treatmentName?.trim();
  if (treatmentName && treatmentName !== '—' && !looksLikeUuidOrId(treatmentName)) {
    return `${treatmentName} treatment process`;
  }

  return 'Treatment process';
}

function resolveVisitLabel(
  treatment: PrescriptionDto['treatment'] | undefined,
  fallbackServiceType?: string,
): string {
  const visitDisplay = treatment?.visitDisplay?.trim();
  if (
    visitDisplay &&
    visitDisplay !== '—' &&
    !looksLikeSessionRatio(visitDisplay) &&
    !looksLikeUuidOrId(visitDisplay)
  ) {
    return visitDisplay;
  }

  const fromTypes = consultationTypeLabel(treatment?.consultationTypes);
  if (fromTypes) return fromTypes;

  if (
    fallbackServiceType &&
    fallbackServiceType !== '—' &&
    !looksLikeSessionRatio(fallbackServiceType)
  ) {
    return fallbackServiceType;
  }

  return 'Consultation';
}

export function PrescriptionPreviewModal({
  open,
  onClose,
  onConfirm,
  patient,
  prescription,
  enriched = null,
  submitting = false,
  confirmLabel = 'Confirm Prescription',
}: PrescriptionPreviewModalProps) {
  const { data: medicines } = useAsyncData(
    async () => {
      const rows = await getAllMedicines().catch(() => []);
      return new Map(rows.map((item) => [item.id, item.medicineName]));
    },
    new Map<string, string>(),
    [open],
  );

  const enrichedTherapyLabels = useMemo(
    () => collectTherapyNames(enriched),
    [enriched],
  );

  const { data: draftTherapyLabels } = useAsyncData(
    async () => {
      if (enrichedTherapyLabels.length || !prescription?.therapies?.length) {
        return [] as string[];
      }
      const labels: string[] = [];

      for (const row of prescription.therapies) {
        if (!row.categoryId || !row.therapyIds?.length) continue;
        const therapies = await getTherapiesByCategory(row.categoryId).catch(
          () => [],
        );
        const byId = new Map(
          therapies.map((therapy) => [
            therapy.id,
            therapy.name || therapy.therapyName || therapy.id,
          ]),
        );
        for (const therapyId of row.therapyIds ?? []) {
          const label = byId.get(therapyId);
          if (label) labels.push(label);
        }
      }

      return [...new Set(labels)];
    },
    [] as string[],
    [open, prescription, enrichedTherapyLabels.length],
  );

  const therapyLabels =
    enrichedTherapyLabels.length > 0
      ? enrichedTherapyLabels
      : draftTherapyLabels;

  const medicineLines = useMemo(() => {
    if (enriched?.medicines?.length) {
      return enriched.medicines.map((row, index) => ({
        index: index + 1,
        name: row.medicineName || 'Medicine',
        instruction:
          row.instruction ||
          [row.dosage, row.frequency, row.duration, row.notes]
            .filter(Boolean)
            .join(' | '),
      }));
    }
    if (!prescription) return [];
    return prescription.medicines
      .filter((row) => row.medicineId)
      .map((row, index) => {
        const name = medicines.get(row.medicineId ?? '') ?? 'Medicine';
        const instruction = [
          row.dosage,
          row.frequency,
          row.duration,
          row.notes,
        ]
          .filter(Boolean)
          .join(' | ');
        return { index: index + 1, name, instruction };
      });
  }, [medicines, prescription, enriched]);

  if (!open || (!prescription && !enriched)) return null;

  const printReady = Boolean(enriched);
  const info = patient.personalInfo;
  const patientBlock = enriched?.patient;
  const consultant = enriched?.consultant;
  const treatment = enriched?.treatment;
  const doctorName =
    consultant?.name ||
    (info.assignedDoctor && info.assignedDoctor !== '—'
      ? info.assignedDoctor
      : CLINIC_BRANDING.doctorName);
  const doctorQualification = [
    consultant?.qualification,
    consultant?.specialization,
  ]
    .filter((part) => Boolean(part && String(part).trim()))
    .join(' · ');
  const doctorPhone =
    consultant?.contactNumber ||
    consultant?.mobileNumber ||
    CLINIC_BRANDING.doctorPhone;
  const diagnosis =
    enriched?.diagnosis?.trim() ||
    prescription?.diagnosis?.trim() ||
    '—';
  const suggestions =
    enriched?.nextFollowUp?.suggestions || prescription?.suggestions;
  const patientName =
    patientBlock?.name || patientBlock?.fullName || patient.name;
  const patientId =
    patientBlock?.displayId ||
    patientBlock?.patientDisplayId ||
    patient.id;
  const age =
    patientBlock?.age != null ? String(patientBlock.age) : info.age || '—';
  const gender = patientBlock?.gender || info.gender || '—';
  const weightLabel = formatMeasure(
    patientBlock?.weight ?? patient.medicalAssessment.weight,
    'kg',
  );
  const heightLabel = formatMeasure(
    patientBlock?.height ?? patient.medicalAssessment.height,
    'cm',
  );
  const diet =
    (patientBlock?.dietType && String(patientBlock.dietType).trim()) ||
    (patient.medicalAssessment.diet &&
    patient.medicalAssessment.diet !== '—'
      ? patient.medicalAssessment.diet
      : '—');
  const visitLabel = resolveVisitLabel(treatment, info.serviceType);

  const consultationDate =
    treatment?.consultationDateTime ||
    info.registrationDate ||
    patient.appointmentDate;

  const followUpSetupRequired =
    enriched?.nextFollowUp?.setUpRequired === true ||
    prescription?.setupRequired === 'Yes';
  const followUpScheduling =
    enriched?.nextFollowUp?.schedulingOption ||
    prescription?.followUpScheduling ||
    '';
  const computedNextFollowUp = followUpSetupRequired
    ? addDaysFromSchedulingOption(consultationDate, followUpScheduling)
    : null;

  const nextAppointment = followUpSetupRequired
    ? computedNextFollowUp?.toISOString() ||
      treatment?.nextAppointmentDateTime ||
      null
    : treatment?.nextAppointmentDateTime ||
      patient.treatmentFollowUp.nextFollowUp;
  const treatmentProcessTitle = resolveTreatmentProcessTitle(patient);
  const visitNoLabel =
    treatment?.visitNumber != null || treatment?.totalVisits != null
      ? `${treatment.visitNumber ?? 0}/${treatment.totalVisits ?? '—'}`
      : `${patient.treatmentFollowUp.sessionsCompleted || 0}/${
          patient.treatmentFollowUp.totalSessions || '—'
        }`;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/45 p-4 sm:p-8">
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          body * { visibility: hidden !important; }
          #prescription-print-sheet,
          #prescription-print-sheet * { visibility: visible !important; }
          #prescription-print-sheet {
            position: fixed !important;
            inset: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <button
        type="button"
        className="fixed inset-0 print:hidden"
        onClick={onClose}
        aria-label="Close prescription preview"
      />

      <div className="relative z-10 my-2 w-full max-w-[850px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-lg bg-white/90 p-1.5 text-text-muted shadow-sm hover:bg-white print:hidden"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <article
          id="prescription-print-sheet"
          className="flex min-h-[1050px] w-full flex-col overflow-hidden rounded-sm bg-white px-7 py-8 text-[13px] leading-[1.65] text-[#382a23] shadow-2xl sm:px-10 sm:py-10"
        >
          <header className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src={assets.brandLogo}
                alt={CLINIC_BRANDING.name}
                className="h-14 w-14 object-contain"
              />
              <p className="text-xl font-bold leading-tight text-[#38271f]">
                GANESHA
                <br />
                AYURVEDA
              </p>
            </div>
            <div className="pr-7 text-left">
              <p className="text-lg font-bold text-[#38271f]">{doctorName}</p>
              {doctorQualification ? (
                <p className="mt-1">{doctorQualification}</p>
              ) : null}
              <p className="mt-1">
                <span className="text-[#c18813]">
                  {CLINIC_BRANDING.workingHours.split('|')[0]}
                </span>
                {' | '}
                {CLINIC_BRANDING.workingHours.split('|')[1]}
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-[#8b8179]" />
                {doctorPhone}
              </p>
            </div>
          </header>

          <h2 className="mt-5 border-b-2 border-dashed border-[#cbb792] pb-4 text-center text-base font-bold text-[#b97700]">
            {treatmentProcessTitle}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_1.05fr_.95fr]">
            <section>
              <p className="mb-2 font-semibold text-[#6f625a]">Patient Details</p>
              <p>
                Patient ID:{' '}
                <strong className="text-[#c18813]">{patientId}</strong>
              </p>
              <p className="mt-2 text-[#8b8179]">Name / Age / Gender:</p>
              <p className="font-semibold">
                {patientName} | {age}yrs | {gender}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[#8b8179]">Weight / Height:</p>
                  <p className="font-semibold">
                    {weightLabel} / {heightLabel}
                  </p>
                </div>
                <div>
                  <p className="text-[#8b8179]">Diet Type:</p>
                  <p className="font-semibold text-[#31813c]">{diet || '—'}</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 font-semibold text-[#6f625a]">Treatment Details</p>
              <div className="rounded-md border-2 border-[#c99432] bg-[#fff8e9] p-3">
                <p className="font-semibold text-[#bd7d00]">{visitLabel}</p>
                <p className="mt-2 flex items-start gap-1.5">
                  <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8b8179]" />
                  <strong>{formatPreviewDate(consultationDate)}</strong>
                </p>
                <p className="mt-1">
                  Next: <strong>{formatPreviewDate(nextAppointment)}</strong>
                </p>
                <p className="mt-1">
                  Visit No.: <strong>{visitNoLabel}</strong>
                </p>
              </div>
            </section>

            <section>
              <p className="mb-2 font-semibold text-[#6f625a]">Consultant:</p>
              <p className="font-semibold">{doctorName}</p>
              {doctorQualification ? (
                <p className="mt-2">{doctorQualification}</p>
              ) : null}
              <p className="mt-2 flex items-center gap-1.5 font-semibold">
                <Phone className="h-3.5 w-3.5 text-[#8b8179]" />
                {doctorPhone}
              </p>
            </section>
          </div>

          <div className="mt-5 rounded-md border border-[#ded1bd] bg-[#f9f5ed] px-4 py-3">
            <p>
              <span className="text-[#8b8179]">Diagnosis :</span>{' '}
              <strong>{diagnosis}</strong>
            </p>
            <p className="mt-3 border border-[#e5dccd] bg-white px-3 py-2 text-[#756a63]">
              ＋&nbsp; Add tests (if any)
            </p>
          </div>

          <section className="mt-4">
            <h3 className="font-serif text-xl font-bold italic text-[#493226]">
              Rx
            </h3>
            <div className="mt-3 space-y-4">
              {medicineLines.length ? (
                medicineLines.map((line) => (
                  <div key={line.index}>
                    <p className="font-semibold">
                      {line.index}. {line.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#6f625a]">
                      {line.instruction || 'As directed by the doctor'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#8b8179]">No medicines prescribed.</p>
              )}
            </div>
          </section>

          <div className="mt-auto pt-10">
            {therapyLabels.length > 0 ? (
              <p className="rounded-md border border-[#e3d5bd] bg-[#f9f5ed] px-4 py-3">
                <span className="font-semibold">Recommended Therapies:</span>{' '}
                {therapyLabels.join(', ')}
              </p>
            ) : null}

            {suggestions ? (
              <p className="mt-3 px-3">
                <span className="font-semibold">Suggestions:</span> {suggestions}
              </p>
            ) : null}

            {enriched?.notes ? (
              <p className="mt-2 px-3">
                <span className="font-semibold">Notes:</span> {enriched.notes}
              </p>
            ) : null}

            <footer className="mt-8 border-t-2 border-[#c99432] pt-4 text-center text-[10px] font-medium leading-relaxed text-[#926716]">
              <p>
                For All Service Appointments · Call/WhatsApp: {doctorPhone} ·{' '}
                {CLINIC_BRANDING.specialties}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[#766b61]">
                <span>{CLINIC_BRANDING.address}</span>
                <span>{CLINIC_BRANDING.email}</span>
                <span>{CLINIC_BRANDING.website}</span>
              </div>
            </footer>
          </div>
        </article>

        <div className="flex justify-end gap-3 rounded-b-xl bg-white px-6 py-4 shadow-2xl print:hidden">
          {printReady ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => window.print()}>Print</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Edit
              </Button>
              <Button onClick={onConfirm} disabled={submitting}>
                {submitting ? 'Saving…' : confirmLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
