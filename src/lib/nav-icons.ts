import gridOutline from '@/assets/appointments/grid.svg?raw';
import personOutline from '@/assets/appointments/person.svg?raw';
import doctorOutline from '@/assets/appointments/doctor.svg?raw';
import calendarPersonOutline from '@/assets/appointments/calendar-person.svg?raw';
import heartOutline from '@/assets/appointments/heart.svg?raw';
import briefcaseOutline from '@/assets/appointments/briefcase.svg?raw';
import histogramOutline from '@/assets/appointments/histogram.svg?raw';
import salesFilled from '@/assets/nav/sales.svg?raw';
import appointmentsFilled from '@/assets/nav/filled/appointments.svg?raw';
import historyOutline from '@/assets/appointments/history.svg?raw';
import documentOutline from '@/assets/appointments/document.svg?raw';
import settingsOutline from '@/assets/appointments/settings.svg?raw';
import dashboardFilled from '@/assets/nav/filled/dashboard.svg?raw';
import patientsFilled from '@/assets/nav/filled/patients.svg?raw';
import doctorsFilled from '@/assets/nav/filled/doctors.svg?raw';
import treatmentsFilled from '@/assets/nav/filled/treatments.svg?raw';
import medicinesFilled from '@/assets/nav/filled/medicines.svg?raw';
import activityLogsFilled from '@/assets/nav/filled/activity-logs.svg?raw';
import billingFilled from '@/assets/nav/filled/billing.svg?raw';
import settingsFilled from '@/assets/nav/filled/settings.svg?raw';

export const navIconSet = {
  dashboard: { outline: gridOutline, filled: dashboardFilled },
  patients: { outline: personOutline, filled: patientsFilled },
  doctors: { outline: doctorOutline, filled: doctorsFilled },
  appointments: { outline: calendarPersonOutline, filled: appointmentsFilled },
  treatments: { outline: heartOutline, filled: treatmentsFilled },
  medicines: { outline: briefcaseOutline, filled: medicinesFilled },
  sales: { outline: histogramOutline, filled: salesFilled },
  activityLogs: { outline: historyOutline, filled: activityLogsFilled },
  billing: { outline: documentOutline, filled: billingFilled },
  settings: { outline: settingsOutline, filled: settingsFilled },
} as const;

export type NavIconKey = keyof typeof navIconSet;
