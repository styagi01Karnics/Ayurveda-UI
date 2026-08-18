import { useMemo } from 'react';
import { Phone, X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <button
        type="button"
        className="fixed inset-0 bg-black/45 print:hidden"
        onClick={onClose}
        aria-label="Close prescription preview"
      />

      <div className="relative z-10 my-2 w-full max-w-4xl rounded-2xl bg-white shadow-2xl print:shadow-none">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-text-muted hover:bg-brown/5 print:hidden"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <img
                src={assets.brandLogo}
                alt=""
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="text-lg font-bold text-brown">{CLINIC_BRANDING.name}</p>
                <p className="text-xs text-text-muted">{CLINIC_BRANDING.doctorCredentials}</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-brown">{doctorName}</p>
              <p className="text-text-muted">{CLINIC_BRANDING.workingHours}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-gold">
                <Phone className="h-3.5 w-3.5" />
                {doctorPhone}
              </p>
            </div>
          </div>


          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-text-muted">Patient ID: </span>
                <span className="font-semibold text-gold">{patientId}</span>
              </p>
              <p>
                <span className="text-text-muted">Name / Age / Gender: </span>
                <span className="font-medium text-brown">
                  {patientName} | {age} | {gender}
                </span>
              </p>
              <p>
                <span className="text-text-muted">Weight / Height: </span>
                <span className="font-medium text-brown">
                  {weight} / {height}
                </span>
              </p>
              <p>
                <span className="text-text-muted">Diet Type: </span>
                <span className="font-medium text-brown">{diet}</span>
              </p>
            </div>

            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm">
              <p className="font-semibold text-brown">{visitLabel}</p>
              <p className="mt-2 text-text-muted">
                {formatPreviewDate(
                  treatment?.consultationDateTime ||
                    info.registrationDate ||
                    patient.appointmentDate,
                )}
              </p>
              <p className="mt-1 text-text-muted">
                Next:{' '}
                {formatPreviewDate(
                  treatment?.nextAppointmentDateTime ||
                    patient.treatmentFollowUp.nextFollowUp,
                )}
              </p>
              <p className="mt-1 text-brown">
                Visit No.: {patient.treatmentFollowUp.sessionsCompleted}/
                {patient.treatmentFollowUp.totalSessions || '—'}
              </p>
            </div>

            <div className="text-sm md:text-right">
              <p className="font-semibold text-brown">{doctorName}</p>
              <p className="text-text-muted">
                {consultant?.specialization
                  ? `${doctorQualification}${consultant.specialization ? ` · ${consultant.specialization}` : ''}`
                  : doctorQualification}
              </p>
              <p className="mt-1 text-gold">{doctorPhone}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-100 px-4 py-3 text-sm">
            <span className="font-semibold text-brown">Diagnosis: </span>
            <span className="text-brown">{diagnosis}</span>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-brown">Rx</p>
            <div className="space-y-4">
              {medicineLines.map((line) => (
                <div key={line.index} className="text-sm">
                  <p className="font-semibold text-brown">
                    {line.index}. {line.name}
                  </p>
                  <p className="mt-0.5 text-text-muted">{line.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {therapyLabels.length > 0 ? (
            <p className="mt-6 text-sm text-brown">
              <span className="font-semibold">Recommended Therapies: </span>
              {therapyLabels.join(', ')}
            </p>
          ) : null}

          {suggestions ? (
            <p className="mt-4 text-sm text-brown">
              <span className="font-semibold">Suggestions: </span>
              {suggestions}
            </p>
          ) : null}

          {enriched?.notes ? (
            <p className="mt-4 text-sm text-brown">
              <span className="font-semibold">Notes: </span>
              {enriched.notes}
            </p>
          ) : null}

          <div className="mt-8 border-t border-gray-100 pt-5 text-center text-xs text-gold">
            <p>{CLINIC_BRANDING.specialties}</p>
            <p className="mt-2">{CLINIC_BRANDING.address}</p>
            <p className="mt-1">
              {CLINIC_BRANDING.email} · {CLINIC_BRANDING.website}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 print:hidden">
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
