import type {
  ClinicDoctorRecord,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
  SettingsRoleRecord,
  SettingsUserRecord,
  SystemPreferences,
} from '@/types';
import { ALL_PAGE_CODES } from '@/lib/pagePermissions';

export const initialClinicDoctors: ClinicDoctorRecord[] = [
  {
    id: 'doc-1',
    name: 'Dr. Shweta Arya',
    specialization: 'BAMS (Ayurvedic Physician)',
    qualification: 'BAMS',
    mobileNumber: '9876543210',
    status: 'Active',
    consultationFees: 500,
    followUpFees: 500,
    availability: 'Mon - Fri 5:00pm - 9:00pm',
  },
];

export const initialClinicTherapies: ClinicTherapyRecord[] = [
  {
    id: 'therapy-1',
    name: 'Panchakarma',
    category: 'Category',
    categoryId: 'cat-1',
    duration: '45 min.',
    price: 500,
    description: 'Panchakarma therapy',
    status: 'Active',
  },
];

export const initialClinicTherapists: ClinicTherapistRecord[] = [
  {
    id: 'therapist-1',
    name: 'Dr. Narendra Jain',
    status: 'Active',
    assignedTherapies: ['Panchakarma'],
  },
];

export const initialSettingsUsers: SettingsUserRecord[] = [
  {
    id: 'user-1',
    userId: '#GN458652',
    fullName: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul@ganeshaayurvedaa.com',
    status: 'Active',
    assignedRole: 'ADMIN',
  },
  {
    id: 'user-2',
    userId: '#GN458653',
    fullName: 'Khushi Shroff',
    phone: '+91 9876543211',
    email: 'khushi@ganeshaayurvedaa.com',
    status: 'Active',
    assignedRole: 'MANAGER',
  },
  {
    id: 'user-3',
    userId: '#GN458654',
    fullName: 'Meera Singh',
    phone: '+91 9876543212',
    email: 'meera@ganeshaayurvedaa.com',
    status: 'Inactive',
    assignedRole: 'RECEPTIONIST',
  },
];

export const initialSettingsRoles: SettingsRoleRecord[] = [
  {
    id: 'role-1',
    name: 'Super Admin',
    status: 'Active',
    accessLevel: 'Full Access',
    permissions: [...ALL_PAGE_CODES],
    userCount: 1,
  },
  {
    id: 'role-2',
    name: 'Admin',
    status: 'Active',
    accessLevel: 'Limited Access',
    permissions: [
      'DASHBOARD',
      'PATIENTS',
      'APPOINTMENTS',
      'MEDICINES',
      'BILLING',
    ],
    userCount: 1,
  },
  {
    id: 'role-3',
    name: 'Doctor',
    status: 'Active',
    accessLevel: 'Clinical Access',
    permissions: [
      'DASHBOARD',
      'PATIENTS',
      'DOCTORS',
      'APPOINTMENTS',
      'TREATMENTS',
    ],
    userCount: 0,
  },
];

export const defaultSystemPreferences: SystemPreferences = {
  appointmentSms: true,
  appointmentWhatsapp: true,
  appointmentEmail: true,
  billingGst: true,
  billingPartialPayment: true,
  notificationAppointmentReminder: true,
  notificationFollowUpReminder: true,
};

export const USER_FILTER_OPTIONS = {
  status: ['Active', 'Inactive'],
} as const;

export const THERAPY_ASSIGNMENT_OPTIONS = [
  'Panchakarma',
  'Abhyanga',
  'Shirodhara',
  'Allergy 1',
  'Allergy 2',
] as const;

export const SETTINGS_TABS = [
  { id: 'clinic' as const, label: 'Clinic Settings' },
  { id: 'users' as const, label: 'User Management' },
  { id: 'roles' as const, label: 'Role Management' },
  { id: 'system' as const, label: 'System Preference' },
];
