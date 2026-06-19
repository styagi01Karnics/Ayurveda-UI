import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  backTo: string;
  actions?: React.ReactNode;
}

export function Modal({ title, children, backTo, actions }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <Link
          to={backTo}
          className="absolute right-4 top-4 rounded-full p-1 text-muted hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="size-5" />
        </Link>
        <h2 className="mb-4 text-xl font-semibold text-brown">{title}</h2>
        <div className="text-sm text-brown-muted">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[10px] bg-white/80 p-4 shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  subtitle,
  filter = "Monthly",
  children,
}: {
  title: string;
  value: string;
  subtitle?: string;
  filter?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-muted">{title}</p>
        <div className="flex items-center gap-1 rounded-full border border-stroke px-3 py-1 text-xs text-brown/70">
          {filter}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <p className="text-[22px] font-semibold text-brown">{value}</p>
      {subtitle && <p className="text-sm font-medium text-gold">{subtitle}</p>}
      {children}
    </Card>
  );
}

export function PrimaryButton({
  children,
  onClick,
  to,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  type?: "button" | "submit";
  className?: string;
}) {
  const cls = `rounded-[10px] bg-gold px-6 py-2.5 text-sm font-bold text-white transition hover:bg-gold/90 ${className}`;
  if (to) {
    return (
      <Link to={to} className={`inline-block text-center ${cls}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
  to,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  className?: string;
}) {
  const cls = `rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold-light ${className}`;
  if (to) {
    return (
      <Link to={to} className={`inline-block text-center ${cls}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function PatientTable({
  patients,
  showBill = false,
  showReport = false,
}: {
  patients: import("../data/mockData").PatientRecord[];
  showBill?: boolean;
  showReport?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stroke text-brown-muted">
            <th className="pb-3 pr-4 font-normal">Patient ID</th>
            <th className="pb-3 pr-4 font-normal">Patient</th>
            <th className="pb-3 pr-4 font-normal">Doctor</th>
            <th className="pb-3 pr-4 font-normal">Visit Type</th>
            <th className="pb-3 pr-4 font-normal">Appointment Date</th>
            <th className="pb-3 pr-4 font-normal">Dosha | Status</th>
            {showBill && <th className="pb-3 pr-4 font-normal">Bill</th>}
            {showReport && <th className="pb-3 font-normal">Report</th>}
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b border-stroke/60">
              <td className="py-4 pr-4">
                <p className="font-medium text-brown">{p.id}</p>
                <p className="text-text-secondary">{p.secondaryId}</p>
              </td>
              <td className="py-4 pr-4">
                <Link to="/patients/details-1" className="block">
                  <p className="font-medium text-brown hover:text-gold">{p.name}</p>
                  <p className="text-text-secondary">{p.phone}</p>
                </Link>
              </td>
              <td className="py-4 pr-4 text-brown">{p.doctor}</td>
              <td className="py-4 pr-4 font-medium text-gold">{p.visitType}</td>
              <td className="py-4 pr-4 text-brown">{p.appointmentDate}</td>
              <td className="py-4 pr-4">
                <span className="text-dosha">{p.dosha}</span>
                <span className="mx-1.5 text-gray-300">|</span>
                <span className="text-success-text">{p.status}</span>
              </td>
              {showBill && (
                <td className="py-4 pr-4">
                  <Link
                    to="/patients/bill-download"
                    className="inline-flex rounded border border-stroke p-1.5 hover:bg-gold-light"
                    aria-label="Download bill"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </Link>
                </td>
              )}
              {showReport && (
                <td className="py-4">
                  <Link
                    to="/patients/upload-document"
                    className="inline-flex items-center gap-1 rounded-lg border border-gold px-3 py-1 text-xs font-medium text-gold hover:bg-gold-light"
                  >
                    Upload
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { label: string; value: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            active === tab.value ? "bg-gold-light text-brown" : "text-muted hover:bg-white/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
