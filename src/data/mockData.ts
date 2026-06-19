export interface PatientRecord {
  id: string;
  secondaryId: string;
  name: string;
  phone: string;
  doctor: string;
  visitType: string;
  appointmentDate: string;
  dosha: string;
  status: string;
}

export const samplePatients: PatientRecord[] = [
  {
    id: "#PT458652",
    secondaryId: "GAN2025-0129",
    name: "Khushi Shroff",
    phone: "+91-9205061339",
    doctor: "Dr. Sheekha",
    visitType: "Consultation",
    appointmentDate: "15 Oct 2026, 01:05 AM",
    dosha: "Vata",
    status: "Completed",
  },
  {
    id: "#PT458653",
    secondaryId: "GAN2025-0130",
    name: "Rahul Patel",
    phone: "+91-9876543210",
    doctor: "Dr. Sharma",
    visitType: "Follow-Up",
    appointmentDate: "16 Oct 2026, 10:30 AM",
    dosha: "Pitta",
    status: "Scheduled",
  },
  {
    id: "#PT458654",
    secondaryId: "GAN2025-0131",
    name: "Priya Mehta",
    phone: "+91-9123456789",
    doctor: "Dr. Sheekha",
    visitType: "Consultation",
    appointmentDate: "17 Oct 2026, 02:00 PM",
    dosha: "Kapha",
    status: "In Progress",
  },
];

export const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "layout-grid" },
  { label: "Patients", path: "/patients", icon: "users" },
  { label: "Doctors", path: "/doctors", icon: "stethoscope" },
  { label: "Appointments", path: "/appointments", icon: "calendar-days" },
  { label: "Treatments", path: "/treatments", icon: "heart-pulse" },
  { label: "Medicines", path: "/medicines", icon: "pill" },
  { label: "Sales", path: "/sales", icon: "bar-chart-3" },
  { label: "Activity Logs", path: "/activity-log", icon: "history" },
  { label: "Billing", path: "/billing", icon: "receipt" },
  { label: "Settings", path: "/settings", icon: "settings" },
] as const;
