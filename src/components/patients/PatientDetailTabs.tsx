import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/Badge';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { assets } from '@/lib/assets';
import type { PatientDetail } from '@/types';
import type { PatientDetailTab } from '@/types/patientDetail';

interface PatientDetailHeaderProps {
  patient: PatientDetail;
  activeTab: PatientDetailTab;
  onTabChange: (tab: PatientDetailTab) => void;
}

const detailTabs: { id: PatientDetailTab; label: string }[] = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'medical', label: 'Medical Assessment' },
  { id: 'treatment', label: 'Treatment & Follow Up' },
  { id: 'billing', label: 'Billing & Membership' },
];

export function PatientDetailHeader({
  patient,
  activeTab,
  onTabChange,
}: PatientDetailHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-text-muted">Patient ID</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-brown">#{patient.detailId}</h2>
            <Badge variant="gold" className="rounded-md px-3 py-1">
              {patient.treatmentStatus}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Dosha</p>
          <p className="text-xl font-bold text-gold">{patient.dosha}</p>
        </div>
      </div>

      <UnderlineTabs tabs={detailTabs} activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs text-text-muted">{item.label}</p>
          <p className="mt-0.5 text-sm font-medium text-brown">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function InfoList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4 text-sm">
          <span className="text-text-muted">{item.label}</span>
          <span className="text-right font-medium text-brown">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 text-base font-bold text-brown">{title}</h3>
      {children}
    </section>
  );
}

export function PersonalInfoTab({ patient }: { patient: PatientDetail }) {
  const info = patient.personalInfo;

  return (
    <div className="space-y-8">
      <SectionBlock title="Basic Information">
        <InfoGrid
          items={[
            { label: 'Name', value: patient.name },
            { label: 'Gender', value: info.gender },
            { label: 'Age', value: info.age },
            { label: 'DOB', value: info.dob },
            { label: 'Service Type', value: info.serviceType },
            { label: 'Registration Date', value: info.registrationDate },
            { label: 'Assigned Doctor', value: info.assignedDoctor },
            { label: 'Therapy Duration', value: info.therapyDuration },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Contact Information">
        <InfoList
          items={[
            { label: 'Mobile No.', value: patient.phone },
            { label: 'Email', value: info.email },
            { label: 'City / State', value: `${info.city} / ${info.state}` },
            { label: 'Address', value: info.address },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Emergency Contact">
        <InfoGrid
          items={[
            { label: 'Name', value: info.emergencyName },
            { label: 'Relation', value: info.emergencyRelation },
            { label: 'Mobile No.', value: info.emergencyPhone },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Identification & Admin">
        <InfoGrid
          items={[
            { label: 'Patient ID', value: `${patient.id} | ${patient.secondaryId}` },
            { label: 'ID Proof type', value: info.idProofType },
            { label: 'ID No.', value: info.idProofNumber },
            { label: 'Occupation', value: info.occupation },
            { label: 'Insurance Details', value: info.insuranceDetails },
          ]}
        />
      </SectionBlock>
    </div>
  );
}

export function MedicalAssessmentTab({ patient }: { patient: PatientDetail }) {
  const m = patient.medicalAssessment;

  return (
    <div className="space-y-8">
      <SectionBlock title="Ayurvedic Assessment">
        <InfoGrid
          items={[
            { label: 'Dosha', value: m.doshaName ?? '—' },
            { label: 'Body Constitution', value: m.bodyConstitution },
            { label: 'Current Imbalance', value: m.currentImbalance },
            { label: 'Previous Panchakarma', value: m.previousPanchakarma },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Physical Examination">
        <InfoGrid
          items={[
            { label: 'Weight', value: m.weight },
            { label: 'Height', value: m.height },
            { label: 'IBW', value: m.ibw },
            { label: 'Pulse', value: m.pulse },
            { label: 'BP', value: m.bp },
            { label: 'Pallor', value: m.pallor },
            { label: 'Temperature', value: m.temperature },
            { label: 'Acidity / Gas', value: m.acidityGas },
            { label: 'Oedema', value: m.oedema },
            { label: 'Sensorium', value: m.sensorium },
            { label: 'Icterus', value: m.icterus },
            { label: 'Cyanosis', value: m.cyanosis },
            { label: 'Motion', value: m.motion },
            { label: 'Micturition', value: m.micturition },
            { label: 'Lymph Nodes', value: m.lymphNodes },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Medical History">
        <div className="rounded-xl bg-gray-50 p-4">
          <InfoList
            items={[
              { label: 'Present Medical Conditions', value: m.presentConditions },
              { label: 'Past Medical Conditions', value: m.pastConditions },
              { label: 'Past Surgeries', value: m.pastSurgeries },
              { label: 'Current Medication', value: m.currentMedication },
              { label: 'Allergies', value: m.allergies },
              { label: 'Family History', value: m.familyHistory },
            ]}
          />
        </div>
      </SectionBlock>

      <SectionBlock title="Lifestyle">
        <InfoGrid
          items={[
            { label: 'Diet', value: m.diet },
            { label: 'Sleep', value: m.sleep },
            { label: 'Exercise', value: m.exercise },
            { label: 'Addiction', value: m.addiction ?? '—' },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Systemic Examination">
        <InfoGrid
          items={[
            { label: 'Cardiovascular', value: m.cardiovascular ?? '—' },
            { label: 'Respiratory', value: m.respiratory ?? '—' },
            { label: 'Nervous', value: m.nervous ?? '—' },
            { label: 'Abdomen / GI', value: m.abdomenGi ?? '—' },
            { label: 'Locomotor', value: m.locomotor ?? '—' },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Treatment Plan">
        <InfoList
          items={[
            {
              label: 'Investigation & Plan Suggested',
              value: m.investigationPlan ?? '—',
            },
            { label: 'Plan Taken', value: m.planTaken ?? '—' },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Reports">
        <div className="space-y-2">
          {m.reports.length === 0 ? (
            <p className="text-sm text-text-muted">No reports uploaded.</p>
          ) : (
            m.reports.map((report) => (
              <ReportRow key={`${report.name}-${report.time}`} {...report} />
            ))
          )}
        </div>
      </SectionBlock>
    </div>
  );
}

function ReportRow({
  name,
  size,
  time,
  type,
}: {
  name: string;
  size: string;
  time: string;
  type: 'folder' | 'file';
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        {type === 'folder' ? (
          <AppIcon src={assets.icons.folder} className="h-5 w-5" />
        ) : (
          <AppIcon src={assets.icons.pdf} className="h-5 w-5" />
        )}
        <div>
          <p className="text-sm font-medium text-brown">{name}</p>
          <p className="text-xs text-text-muted">{time}</p>
        </div>
      </div>
      <Badge variant="gold">{size}</Badge>
    </div>
  );
}

export function TreatmentFollowUpTab({ patient }: { patient: PatientDetail }) {
  const t = patient.treatmentFollowUp;

  return (
    <div className="space-y-8">
      <SectionBlock title="Active Treatment Plan">
        <div className="overflow-x-auto rounded-xl bg-gray-50">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-text-muted">
                <th className="px-4 py-3 text-left font-medium">Treatment Name</th>
                <th className="px-4 py-3 text-left font-medium">Start / End Date</th>
                <th className="px-4 py-3 text-left font-medium">Total Sessions</th>
                <th className="px-4 py-3 text-left font-medium">Sessions Completed</th>
                <th className="px-4 py-3 text-left font-medium">Remaining Sessions</th>
                <th className="px-4 py-3 text-left font-medium">Assigned Therapist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 font-medium text-brown">{t.treatmentName}</td>
                <td className="px-4 py-3 text-brown">
                  {t.startDate} - {t.endDate}
                </td>
                <td className="px-4 py-3 text-brown">{t.totalSessions}</td>
                <td className="px-4 py-3 text-brown">{t.sessionsCompleted}</td>
                <td className="px-4 py-3 text-brown">{t.remainingSessions}</td>
                <td className="px-4 py-3 text-brown">{t.assignedTherapist}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionBlock>

      <SectionBlock title="Upcoming Follow up">
        <InfoList
          items={[
            { label: 'Next Follow-up', value: t.nextFollowUp },
            { label: 'Doctor', value: t.followUpDoctor },
            { label: 'Reminder', value: t.reminder },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Appointment History">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-text-muted">
                <th className="py-2 text-left font-medium">Visit Type</th>
                <th className="py-2 text-left font-medium">Date</th>
                <th className="py-2 text-left font-medium">Status</th>
                <th className="py-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {t.appointmentHistory.map((row, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-gold">{row.visitType}</td>
                  <td className="py-3 text-brown">{row.date}</td>
                  <td className="py-3">
                    <Badge variant="success">{row.status}</Badge>
                  </td>
                  <td className="py-3">
                    <button type="button" className="text-sm font-medium text-gold underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>
    </div>
  );
}

export function BillingMembershipTab({ patient }: { patient: PatientDetail }) {
  const b = patient.billing;

  return (
    <div className="space-y-8">
      <SectionBlock title="Billing & Membership">
        <DataRow
          headers={['Package Name', 'Validity', 'Status', 'Discount Applied']}
          values={[
            b.packageName,
            b.validity,
            b.membershipStatus,
            `₹${b.discountApplied}`,
          ]}
          highlights={[3]}
        />
      </SectionBlock>

      <SectionBlock title="Billing Details">
        <InfoList
          items={[
            { label: 'Service Type', value: b.serviceType },
            { label: 'Service Fees', value: `₹${b.serviceFees}` },
            { label: 'Package Type', value: b.packageType },
            { label: 'Package Charges', value: `₹${b.packageCharges}` },
            { label: 'Discount', value: `₹${b.discount}` },
            { label: 'CGST & SGST', value: b.taxRate },
          ]}
        />
      </SectionBlock>
    </div>
  );
}

function DataRow({
  headers,
  values,
  highlights = [],
}: {
  headers: string[];
  values: string[];
  highlights?: number[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-gray-50">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {values.map((v, i) => (
              <td
                key={i}
                className={`px-4 py-3 font-medium ${highlights.includes(i) ? 'text-gold' : 'text-brown'}`}
              >
                {i === 2 && v === 'Completed' ? (
                  <Badge variant="success">{v}</Badge>
                ) : (
                  v
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
