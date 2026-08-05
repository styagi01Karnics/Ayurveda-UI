import { apiConfig } from './config';
import { apiRequest, apiRequestFormData, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.fileUpload}${path}`;
const ep = apiEndpoints.documents;

export type DocumentTypeApi =
  | 'PAST_MEDICAL_REPORT'
  | 'PRESCRIPTION'
  | 'LAB_REPORT';

export interface DocumentDto {
  id: string;
  patientId: string;
  documentType: DocumentTypeApi;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
}

export function uploadDocument(
  patientId: string,
  documentType: DocumentTypeApi,
  file: File,
) {
  const formData = new FormData();
  formData.append('patientId', patientId);
  formData.append('documentType', documentType);
  formData.append('file', file);
  return apiRequestFormData<DocumentDto>(url(ep.upload), formData);
}

export function getDocumentsByPatientId(patientId: string) {
  return apiRequestList<DocumentDto>(url(ep.byPatientId(patientId)));
}

export function getDocumentDownloadUrl(documentId: string) {
  return url(ep.download(documentId));
}

export function deleteDocument(documentId: string) {
  return apiRequest<void>(url(ep.delete(documentId)), { method: 'DELETE' });
}
