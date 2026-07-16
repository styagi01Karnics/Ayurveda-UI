import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BillingMembershipTab,
  MedicalAssessmentTab,
  PatientDetailHeader,
  PersonalInfoTab,
  TreatmentFollowUpTab,
} from '@/components/patients/PatientDetailTabs';
import { PatientBreadcrumbs } from '@/components/patients/PatientsTable';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { getPatientByDetailId } from '@/data/mock/patients';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getAppointmentTherapiesByPatientId,
  getAppointmentsByPatientId,
} from '@/lib/api/appointments';
import { getAllDoctors } from '@/lib/api/doctors';
import { mapPatientToDetail } from '@/lib/api/mappers';
import { getPatientById } from '@/lib/api/patients';
import { getAllTherapists } from '@/lib/api/therapists';
import type { PatientDetail } from '@/types';
import type { PatientDetailTab } from '@/types/patientDetail';

function mergeWithMockDetail(detail: PatientDetail): PatientDetail {
  const mock = getPatientByDetailId(detail.detailId);
  if (!mock) return detail;

  return {
    ...mock,
    ...detail,
    name: detail.name || mock.name,
    phone: detail.phone || mock.phone,
    doctor: detail.doctor !== '—' ? detail.doctor : mock.doctor,
    personalInfo: {
      ...mock.personalInfo,
      ...Object.fromEntries(
        Object.entries(detail.personalInfo).filter(
          ([, value]) => value && value !== '—',
        ),
      ),
    },
    medicalAssessment: mock.medicalAssessment,
    treatmentFollowUp: mock.treatmentFollowUp,
    billing: mock.billing,
    invoice: mock.invoice,
    treatmentStatus: mock.treatmentStatus,
    dosha: mock.dosha,
    status: mock.status,
  };
}

export function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');

  const { data: patient, loading, error, reload } = useAsyncData(
    async () => {
      if (!patientId) return null;

      const [apiPatient, doctors, therapists, appointments, therapies] =
        await Promise.all([
          getPatientById(patientId),
          getAllDoctors().catch(() => []),
          getAllTherapists().catch(() => []),
          getAppointmentsByPatientId(patientId).catch(() => []),
          getAppointmentTherapiesByPatientId(patientId).catch(() => []),
        ]);

      const latestAppointment = appointments[0];
      const doctorId =
        latestAppointment?.assignedDoctorId ?? latestAppointment?.doctorId;
      const doctorName =
        latestAppointment?.doctorName ??
        (doctorId
          ? doctors.find((d) => d.id === doctorId)?.doctorName
          : undefined);

      const therapy = therapies[0];
      const therapistName =
        therapy?.therapistName ??
        (therapy?.assignedTherapistId
          ? therapists.find((t) => t.id === therapy.assignedTherapistId)
              ?.therapistName
          : undefined);

      const mapped = mapPatientToDetail(apiPatient, {
        doctor: doctorName ?? '—',
        visitType: latestAppointment
          ? (latestAppointment.consultationTypes?.[0] ?? 'Consultation')
              .toString()
              .toLowerCase()
              .includes('therapy')
            ? 'Therapy'
            : 'Consultation'
          : 'Consultation',
        appointmentDate: latestAppointment?.registrationDate ?? undefined,
        personalInfo: {
          gender: '',
          age: '',
          dob: '',
          serviceType: 'Consultation',
          registrationDate: '',
          assignedDoctor: doctorName ?? '—',
          therapyDuration: therapy?.sessionDuration
            ? `${therapy.sessionDuration} mins`
            : '—',
          email: '',
          city: '',
          state: '',
          address: '',
          emergencyName: '',
          emergencyRelation: '',
          emergencyPhone: '',
          idProofType: '',
          idProofNumber: '',
          occupation: '',
          insuranceDetails: '',
        },
        treatmentFollowUp: {
          treatmentName:
            therapy?.treatmentCategoryName ?? therapy?.categoryName ?? '—',
          startDate: therapy?.scheduleDate ?? '—',
          endDate: '—',
          totalSessions: therapy?.sessionFrequency ?? 0,
          sessionsCompleted: 0,
          remainingSessions: therapy?.sessionFrequency ?? 0,
          assignedTherapist: therapistName ?? '—',
          nextFollowUp: therapy?.scheduleDate ?? '—',
          followUpDoctor: doctorName ?? '—',
          reminder: '—',
          appointmentHistory: appointments.slice(0, 5).map((appt) => ({
            visitType: (appt.consultationTypes?.[0] ?? 'Consultation')
              .toString()
              .toLowerCase()
              .includes('therapy')
              ? 'Therapy'
              : 'Consultation',
            date: appt.registrationDate ?? appt.createdAt?.slice(0, 10) ?? '—',
            status: 'Scheduled' as const,
          })),
        },
      });

      return mergeWithMockDetail(mapped);
    },
    null,
    [patientId],
  );

  return (
    <div className="space-y-5">
      <PatientBreadcrumbs />

      <AsyncStatus
        loading={loading}
        error={error}
        onRetry={reload}
        empty={!loading && !error && !patient}
        emptyMessage="Patient not found."
      >
        {patient && (
          <Card className="p-5 sm:p-6">
            <PatientDetailHeader
              patient={patient}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-8">
              {activeTab === 'personal' && <PersonalInfoTab patient={patient} />}
              {activeTab === 'medical' && (
                <MedicalAssessmentTab patient={patient} />
              )}
              {activeTab === 'treatment' && (
                <TreatmentFollowUpTab patient={patient} />
              )}
              {activeTab === 'billing' && (
                <BillingMembershipTab patient={patient} />
              )}
            </div>
          </Card>
        )}
      </AsyncStatus>

      <button
        type="button"
        onClick={() => navigate('/patients')}
        className="text-sm font-medium text-gold hover:underline"
      >
        ← Back to Patients
      </button>
    </div>
  );
}

export type { PatientDetailTab };
