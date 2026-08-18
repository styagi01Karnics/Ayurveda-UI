import { getAppointmentsByPatientId } from '@/lib/api/appointments';
import { getInvoiceById, type InvoiceDto } from '@/lib/api/billing';
import { getDoctorById } from '@/lib/api/doctors';
import { mapInvoiceDtoToBillView } from '@/lib/api/mappers';
import type { DoctorDto } from '@/lib/api/types';
import { CLINIC_BRANDING } from '@/lib/clinicBranding';
import type { BillInvoiceView } from '@/types';

export interface BillDoctorDetails {
  doctorName: string;
  doctorCredentials: string;
  workingHours: string;
  doctorPhone: string;
}

function formatDoctorName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return CLINIC_BRANDING.doctorName;
  return /^dr\.?\s/i.test(trimmed) ? trimmed : `Dr. ${trimmed}`;
}

function formatDoctorCredentials(doctor: DoctorDto): string {
  const qualification = doctor.qualification?.trim();
  const specialization = doctor.specialization?.trim();

  if (qualification && specialization) {
    return `${qualification} (${specialization})`;
  }
  if (qualification) return qualification;
  if (specialization) return specialization;
  return CLINIC_BRANDING.doctorCredentials;
}

export function mapDoctorDtoToBillDoctorDetails(
  doctor: DoctorDto,
): BillDoctorDetails {
  return {
    doctorName: formatDoctorName(doctor.name || doctor.doctorName || ''),
    doctorCredentials: formatDoctorCredentials(doctor),
    workingHours: doctor.availability?.trim() || CLINIC_BRANDING.workingHours,
    doctorPhone: doctor.mobileNumber?.trim() || CLINIC_BRANDING.doctorPhone,
  };
}

function doctorDetailsFromInvoiceDto(dto: InvoiceDto): BillDoctorDetails | null {
  const extended = dto as InvoiceDto & {
    doctorName?: string;
    doctorPhone?: string;
    doctorQualification?: string;
    doctorSpecialization?: string;
    doctorAvailability?: string;
    assignedDoctorName?: string;
    assignedDoctorPhone?: string;
    assignedDoctorQualification?: string;
  };

  const name =
    extended.doctorName ??
    extended.assignedDoctorName ??
    '';
  if (!name.trim()) return null;

  const qualification =
    extended.doctorQualification ?? extended.doctorSpecialization ?? '';
  const specialization = extended.doctorSpecialization ?? '';

  return {
    doctorName: formatDoctorName(name),
    doctorCredentials:
      qualification && specialization
        ? `${qualification} (${specialization})`
        : qualification || specialization || CLINIC_BRANDING.doctorCredentials,
    workingHours:
      extended.doctorAvailability?.trim() || CLINIC_BRANDING.workingHours,
    doctorPhone:
      extended.doctorPhone ??
      extended.assignedDoctorPhone ??
      CLINIC_BRANDING.doctorPhone,
  };
}

export async function resolveBillDoctorDetails(
  patientId: string,
): Promise<BillDoctorDetails> {
  try {
    const appointments = await getAppointmentsByPatientId(patientId);
    const latest = appointments[0];
    if (!latest) {
      return {
        doctorName: CLINIC_BRANDING.doctorName,
        doctorCredentials: CLINIC_BRANDING.doctorCredentials,
        workingHours: CLINIC_BRANDING.workingHours,
        doctorPhone: CLINIC_BRANDING.doctorPhone,
      };
    }

    const doctorId =
      latest.assignedDoctorId ??
      latest.doctorId ??
      latest.assignedDoctor?.id;

    if (doctorId) {
      try {
        const doctor = await getDoctorById(doctorId);
        return mapDoctorDtoToBillDoctorDetails(doctor);
      } catch {
        const summary = latest.assignedDoctor;
        if (summary) {
          return {
            doctorName: formatDoctorName(
              summary.name || summary.doctorName || latest.doctorName || '',
            ),
            doctorCredentials:
              summary.qualification ||
              summary.specialization ||
              CLINIC_BRANDING.doctorCredentials,
            workingHours: CLINIC_BRANDING.workingHours,
            doctorPhone:
              summary.mobileNumber || CLINIC_BRANDING.doctorPhone,
          };
        }
      }
    }

    if (latest.doctorName) {
      return {
        doctorName: formatDoctorName(latest.doctorName),
        doctorCredentials: CLINIC_BRANDING.doctorCredentials,
        workingHours: CLINIC_BRANDING.workingHours,
        doctorPhone: CLINIC_BRANDING.doctorPhone,
      };
    }
  } catch {
    // fall through to clinic defaults
  }

  return {
    doctorName: CLINIC_BRANDING.doctorName,
    doctorCredentials: CLINIC_BRANDING.doctorCredentials,
    workingHours: CLINIC_BRANDING.workingHours,
    doctorPhone: CLINIC_BRANDING.doctorPhone,
  };
}

export async function loadBillInvoiceView(
  invoiceUuid: string,
): Promise<BillInvoiceView> {
  const invoice = await getInvoiceById(invoiceUuid);
  const doctorFromInvoice = doctorDetailsFromInvoiceDto(invoice);
  const doctor =
    doctorFromInvoice ??
    (await resolveBillDoctorDetails(invoice.patientId));
  return mapInvoiceDtoToBillView(invoice, doctor);
}
