export const CLINIC_BRANDING = {
  name: 'GANESHA AYURVEDAA',
  gstNo: '12334567890',
  doctorName: 'Dr. Sweta Arya',
  doctorCredentials: 'BAMS (Ayurvedic Physician)',
  workingHours: 'Tuesday-Sunday | 10:00am - 07:00pm',
  doctorPhone: '9308712380',
  address:
    'M-38 Block Road G-III Opposite to Gurudwara Nanaksaar New Delhi-110048',
  email: 'ganeshaayurveda5@gmail.com',
  website: 'www.ganeshaayurveda.com',
  specialties:
    'GYNAECOLOGICAL DISCORD, INFERTILITY, JOINT PAIN, SKIN DISORDERS, DIGESTIVE DISORDERS, RESPIRATORY DISORDERS, STRESS & ANXIETY, WEIGHT MANAGEMENT',
  notesDefault: '',
} as const;

export function formatBillDate(iso?: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return iso;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
