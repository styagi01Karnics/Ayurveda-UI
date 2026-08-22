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
}

function formatPreviewDate(value?: string): string {
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
    .map((type) => (typeof type === 'string' ? type : type.name))
    .filter(Boolean)
    .join(', ');
}

export function PrescriptionPreviewModal({
  open,
  onClose,
  onConfirm,
  patient,
  prescription,
  enriched = null,
  submitting = false,
}: PrescriptionPreviewModalProps) {
  const { data: medicines } = useAsyncData(
    async () => {
      const rows = await getAllMedicines().catch(() => []);
      return new Map(rows.map((item) => [item.id, item.medicineName]));
    },
    new Map<string, string>(),
    [open],
  );

  const { data: therapyLabels } = useAsyncData(
    async () => {
      if (enriched?.therapySuggestions?.length) {
        return enriched.therapySuggestions.flatMap((row) => {
          if (row.recommendedTherapies?.length) {
            return row.recommendedTherapies
              .map((therapy) => therapy.name)
              .filter(Boolean) as string[];
          }
          return row.recommendedTherapyIds ?? [];
        });
      }
      if (!prescription?.therapies?.length) return [] as string[];
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

      return labels;
    },
    [] as string[],
    [open, prescription, enriched],
  );

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
  const doctorQualification =
    consultant?.qualification || CLINIC_BRANDING.doctorCredentials;
  const doctorPhone =
    consultant?.contactNumber ||
    consultant?.mobileNumber ||
    CLINIC_BRANDING.doctorPhone;
  const diagnosis =
    enriched?.diagnosis?.trim() ||
    prescription?.diagnosis?.trim() ||
    (info.serviceType !== '—' ? info.serviceType : 'As assessed during consultation');
  const suggestions =
    enriched?.nextFollowUp?.suggestions || prescription?.suggestions;
  const patientName = patientBlock?.name || patientBlock?.fullName || patient.name;
  const patientId =
    patientBlock?.displayId ||
    patientBlock?.patientDisplayId ||
    patient.id;
  const age = patientBlock?.age != null ? String(patientBlock.age) : info.age || '—';
  const gender = patientBlock?.gender || info.gender || '—';
  const weight = patientBlock?.weight || patient.medicalAssessment.weight;
  const height = patientBlock?.height || patient.medicalAssessment.height;
  const diet =
    patientBlock?.dietType || patient.medicalAssessment.diet || '—';
  const visitLabel =
    treatment?.visitDisplay ||
    consultationTypeLabel(treatment?.consultationTypes) ||
    info.serviceType ||
    'Consultation';

  const consultationDate =
    treatment?.consultationDateTime ||
    info.registrationDate ||
    patient.appointmentDate;
  const nextAppointment =
    treatment?.nextAppointmentDateTime ||
    patient.treatmentFollowUp.nextFollowUp;

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

      <div className="relative z-10 my-2 w-full max-w-[794px]">
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
          className="flex min-h-[1050px] w-full flex-col overflow-hidden rounded-sm bg-white px-7 py-8 text-[11px] leading-relaxed text-[#4b4038] shadow-2xl sm:px-10 sm:py-10"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_1fr_1fr]">
            <section className="rounded-md border border-[#eadfce] p-3">
              <p>
                <span className="text-[#8b8179]">Name / Age / Gender:</span>
                <br />
                <strong>{patientName}</strong> | {age}yrs | {gender}
              </p>
              <p className="mt-2">
                <span className="text-[#8b8179]">Weight / Height:</span>
                <br />
                <strong>{weight}</strong> / {height}
              </p>
              <p className="mt-2">
                <span className="text-[#8b8179]">Diet Type:</span>
                <br />
                <strong>{diet}</strong>
              </p>
            </section>

            <section className="rounded-md border border-[#d9bd83] bg-[#fffdf8] p-3">
              <p className="flex items-center gap-1.5 font-semibold text-[#9a6c18]">
                <CalendarDays className="h-3.5 w-3.5" />
                {visitLabel}
              </p>
              <p className="mt-2">
                <span className="text-[#8b8179]">Date:</span>{' '}
                <strong>{formatPreviewDate(consultationDate)}</strong>
              </p>
              <p className="mt-1">
                <span className="text-[#8b8179]">Next:</span>{' '}
                <strong>{formatPreviewDate(nextAppointment)}</strong>
              </p>
              <p className="mt-1">
                <span className="text-[#8b8179]">Visit No.:</span>{' '}
                <strong>
                  {patient.treatmentFollowUp.sessionsCompleted}/
                  {patient.treatmentFollowUp.totalSessions || '—'}
                </strong>
              </p>
            </section>

            <section className="rounded-md border border-[#eadfce] p-3">
              <p className="font-semibold">{doctorName}</p>
              <p className="mt-1 text-[#8b8179]">
                {consultant?.specialization
                  ? `${doctorQualification} · ${consultant.specialization}`
                  : doctorQualification}
              </p>
              <p className="mt-2 flex items-center gap-1.5 font-semibold">
                <Phone className="h-3.5 w-3.5 text-[#b48225]" />
                {doctorPhone}
              </p>
            </section>
          </div>

          <div className="mt-5 border-b border-[#eee7dc] pb-4">
            <p>
              <span className="font-semibold">Patient ID:</span>{' '}
              <span className="text-[#b48225]">{patientId}</span>
            </p>
            <p className="mt-2">
              <span className="font-semibold">Diagnosis:</span> {diagnosis}
            </p>
            <p className="mt-3 text-[#a47a35]">＋ Add tests (if any)</p>
          </div>

          <section className="mt-5">
            <h3 className="font-serif text-base font-semibold italic text-[#5a4433]">
              Rx
            </h3>
            <div className="mt-3 space-y-4">
              {medicineLines.length ? (
                medicineLines.map((line) => (
                  <div key={line.index}>
                    <p className="font-semibold">
                      {line.index}. {line.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#8b8179]">
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
              <p className="rounded-sm bg-[#fcfaf5] px-3 py-3">
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

            <footer className="mt-8 border-t border-[#eadfce] pt-4 text-center text-[8px] text-[#a87924]">
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
                {submitting ? 'Saving…' : 'Confirm Prescription'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
