import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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

const DETAIL_LABEL =
  'align-middle font-sans text-[14px] font-medium leading-5 tracking-normal text-[#737373]';
const DETAIL_VALUE =
  'align-middle font-sans text-sm font-medium leading-3 tracking-normal text-[#404040]';

export function PatientDetailHeader({
  patient,
  activeTab,
  onTabChange,
}: PatientDetailHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={DETAIL_LABEL}>Patient ID</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-brown">{patient.id}</h2>
            <Badge variant="gold" className="rounded-md px-3 py-1">
              {patient.treatmentStatus}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className={DETAIL_LABEL}>Dosha</p>
          <p className="text-xl font-bold text-gold">{patient.dosha}</p>
        </div>
      </div>

      <div className="border-t border-[#ebe4d8] pt-4">
        <UnderlineTabs tabs={detailTabs} activeTab={activeTab} onChange={onTabChange} />
      </div>
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <p className={DETAIL_LABEL}>{item.label}</p>
          <p className={DETAIL_VALUE}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function InfoList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4">
          <span className={DETAIL_LABEL}>{item.label}</span>
          <span className={`text-right ${DETAIL_VALUE}`}>{item.value}</span>
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
    <section className="rounded-xl bg-[#FAF9F5] p-4">
      <h3 className="mb-3 font-sans text-[16px] font-medium leading-[150%] tracking-normal text-[#422C23]">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PersonalInfoTab({ patient }: { patient: PatientDetail }) {
  const info = patient.personalInfo;

  return (
    <div className="space-y-4">
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
            { label: 'Patient ID', value: patient.id },
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
    <div className="space-y-4">
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
    <div className="app-card flex items-center justify-between rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        {type === 'folder' ? (
          <AppIcon src={assets.icons.folder} className="h-5 w-5" />
        ) : (
          <AppIcon src={assets.icons.pdf} className="h-5 w-5" />
        )}
        <div>
          <p className={DETAIL_VALUE}>{name}</p>
          <p className={DETAIL_LABEL}>{time}</p>
        </div>
      </div>
      <Badge variant="gold">{size}</Badge>
    </div>
  );
}

function hasPlanValue(value?: string | number) {
  if (value == null) return false;
  const text = String(value).trim();
  return text !== '' && text !== '—' && text !== '-';
}

export function TreatmentFollowUpTab({ patient }: { patient: PatientDetail }) {
  const t = patient.treatmentFollowUp;
  const hasActivePlan =
    hasPlanValue(t.treatmentName) ||
    hasPlanValue(t.startDate) ||
    hasPlanValue(t.endDate) ||
    hasPlanValue(t.assignedTherapist);

  return (
    <div className="space-y-4">
      <SectionBlock title="Active Treatment Plan">
        {hasActivePlan ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={`py-2 pr-4 text-left ${DETAIL_LABEL}`}>Treatment Name</th>
                  <th className={`py-2 pr-4 text-left ${DETAIL_LABEL}`}>Start / End Date</th>
                  <th className={`py-2 pr-4 text-left ${DETAIL_LABEL}`}>Total Sessions</th>
                  <th className={`py-2 pr-4 text-left ${DETAIL_LABEL}`}>Sessions Completed</th>
                  <th className={`py-2 pr-4 text-left ${DETAIL_LABEL}`}>Remaining Sessions</th>
                  <th className={`py-2 text-left ${DETAIL_LABEL}`}>Assigned Therapist</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`py-2 pr-4 ${DETAIL_VALUE}`}>{t.treatmentName}</td>
                  <td className={`py-2 pr-4 ${DETAIL_VALUE}`}>
                    {t.startDate} - {t.endDate}
                  </td>
                  <td className={`py-2 pr-4 ${DETAIL_VALUE}`}>{t.totalSessions}</td>
                  <td className={`py-2 pr-4 ${DETAIL_VALUE}`}>{t.sessionsCompleted}</td>
                  <td className={`py-2 pr-4 ${DETAIL_VALUE}`}>{t.remainingSessions}</td>
                  <td className={`py-2 ${DETAIL_VALUE}`}>{t.assignedTherapist}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className={DETAIL_VALUE}>No active treatment plan</p>
        )}
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
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={`py-2 text-left ${DETAIL_LABEL}`}>Visit Type</th>
                <th className={`py-2 text-left ${DETAIL_LABEL}`}>Date</th>
                <th className={`py-2 text-left ${DETAIL_LABEL}`}>Status</th>
                <th className={`py-2 text-left ${DETAIL_LABEL}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {t.appointmentHistory.map((row, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className={`py-3 ${DETAIL_VALUE}`}>{row.visitType}</td>
                  <td className={`py-3 ${DETAIL_VALUE}`}>{row.date}</td>
                  <td className="py-3">
                    {row.status === 'Completed' || row.status === 'Scheduled' ? (
                      <span className="text-xs font-semibold text-[#2E7D32]">
                        {row.status}
                      </span>
                    ) : (
                      <Badge variant="success">{row.status}</Badge>
                    )}
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

export function BillingMembershipTab({
  patient,
  onDownloadBill,
}: {
  patient: PatientDetail;
  onDownloadBill?: () => void;
}) {
  const b = patient.billing;

  return (
    <div className="space-y-4">
      {onDownloadBill && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="gap-2"
            onClick={onDownloadBill}
          >
            <AppIcon src={assets.icons.download} className="h-4 w-4" />
            Download Bill
          </Button>
        </div>
      )}
      <SectionBlock title="Billing & Membership">
        <InfoGrid
          items={[
            { label: 'Package Name', value: b.packageName || '—' },
            { label: 'Validity', value: b.validity || '—' },
            { label: 'Status', value: b.membershipStatus || '—' },
            { label: 'Discount Applied', value: `₹${b.discountApplied}` },
          ]}
        />
      </SectionBlock>

      <SectionBlock title="Billing Details">
        <InfoList
          items={[
            ...(b.billingServices && b.billingServices.length > 0
              ? b.billingServices.flatMap((service, index) => [
                  {
                    label:
                      b.billingServices!.length > 1
                        ? `Service Type ${index + 1}`
                        : 'Service Type',
                    value: service.serviceType || '—',
                  },
                  {
                    label: 'Service Fees',
                    value: `₹${service.serviceFees}`,
                  },
                  ...(service.packageName || service.packageMasterId
                    ? [
                        {
                          label: 'Package',
                          value: service.packageName || service.packageType || '—',
                        },
                        {
                          label: 'Package Charges',
                          value: `₹${service.packageCharges ?? 0}`,
                        },
                      ]
                    : []),
                ])
              : [
                  { label: 'Service Type', value: b.serviceType },
                  { label: 'Service Fees', value: `₹${b.serviceFees}` },
                  ...(b.packageType && b.packageType !== '—'
                    ? [
                        { label: 'Package Type', value: b.packageType },
                        {
                          label: 'Package Charges',
                          value: `₹${b.packageCharges}`,
                        },
                      ]
                    : []),
                ]),
            ...(b.billingDraftStatus
              ? [
                  {
                    label: 'Billing draft',
                    value: b.billingDraftStatus === 'PENDING' ? 'Pending' : 'Completed',
                  },
                ]
              : []),
            ...(b.discount
              ? [{ label: 'Discount', value: `₹${b.discount}` }]
              : []),
            ...(b.taxRate && b.taxRate !== '—' && b.taxRate !== '0%' && b.taxRate !== '0'
              ? [{ label: 'CGST & SGST', value: b.taxRate }]
              : []),
          ]}
        />
      </SectionBlock>
    </div>
  );
}
