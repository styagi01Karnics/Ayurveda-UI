/** Centralized static asset paths — public PNGs + Figma-export SVGs from src/assets */

import scheduleDecor from '@/assets/signup/tulsi.png';
import sidebarBg from '@/assets/appointments/sidebar-bg.png';
import avatar from '@/assets/appointments/avatar.png';
import doctorReenaAvatar from '@/assets/appointments/doctor-reena.png';
import patientRajAvatar from '@/assets/appointments/patient-raj.png';
import searchIcon from '@/assets/appointments/search.svg';
import downloadIcon from '@/assets/appointments/arrow-download.svg';
import uploadIcon from '@/assets/doctors/upload-cloud.svg';
import addIcon from '@/assets/appointments/add.svg';
import addGoldIcon from '@/assets/doctors/add-gold.svg';
import editIcon from '@/assets/doctors/edit.svg';
import trashIcon from '@/assets/doctors/trash01.svg';
import closeIcon from '@/assets/appointments/close.svg';
import chevronIcon from '@/assets/appointments/chevron.svg';
import appsListIcon from '@/assets/appointments/apps-list.svg';
import popupCalendarIcon from '@/assets/appointments/popup-calendar.svg';
import confirmSuccessIcon from '@/assets/appointments/book/confirm-success.svg';
import medicineSuccessIcon from '@/assets/medicines/medicine-added-success.svg';
import medicineAddIcon from '@/assets/medicines/medicine-add-icon.svg';
import medicineCalendarIcon from '@/assets/medicines/medicine-calendar.svg';
import folderIcon from '@/assets/appointments/book/icon-folder.svg';
import pdfIcon from '@/assets/appointments/book/icon-pdf.svg';
import checkmarkIcon from '@/assets/doctors/checkmark.svg';
import { navIconSet, type NavIconKey } from '@/lib/nav-icons';

export { navIconSet, type NavIconKey };

export const assets = {
  brandLogo: '/assets/brand-logo.png',
  dosha: {
    vata: '/assets/vata.png',
    pitta: '/assets/pitta.png',
    kapha: '/assets/kapha.png',
  },
  auth: {
    loginDecorTopRight: '/assets/login-decor-right.png',
    loginDecorBottomLeft: '/assets/login-decor-left.png',
    signupDecorBottomRight: '/assets/signup-decor-right.png',
  },
  sidebarBg,
  scheduleDecor,
  avatar,
  calendarEvent: {
    doctor: doctorReenaAvatar,
    patientMale: patientRajAvatar,
    patientFemale: avatar,
  },
  icons: {
    nav: navIconSet,
    search: searchIcon,
    download: downloadIcon,
    upload: uploadIcon,
    add: addIcon,
    addGold: addGoldIcon,
    edit: editIcon,
    trash: trashIcon,
    close: closeIcon,
    chevron: chevronIcon,
    listView: appsListIcon,
    calendarView: popupCalendarIcon,
    confirmSuccess: confirmSuccessIcon,
    medicineSuccess: medicineSuccessIcon,
    medicineAdd: medicineAddIcon,
    medicineCalendar: medicineCalendarIcon,
    folder: folderIcon,
    pdf: pdfIcon,
    checkmark: checkmarkIcon,
  },
} as const;
