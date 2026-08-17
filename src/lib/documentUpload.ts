import type { DocumentTypeApi } from '@/lib/api/documents';

/** Broad accept list for clinical documents (PDF, Office, images, text, etc.). */
export const DOCUMENT_UPLOAD_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tif,.tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv,image/*';

export const DOCUMENT_UPLOAD_HINT =
  'PDF, Word, Excel, PowerPoint, images, and other common formats';

export const DOCUMENT_SECTIONS: {
  label: string;
  type: DocumentTypeApi;
}[] = [
  { label: 'Past Medical Reports', type: 'PAST_MEDICAL_REPORT' },
  { label: 'Prescriptions', type: 'PRESCRIPTION' },
  { label: 'Lab Reports', type: 'LAB_REPORT' },
];

export function formatDocumentFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
