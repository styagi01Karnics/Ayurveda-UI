import { apiConfig } from './config';
import { apiRequest, apiRequestList, apiRequestPage, type PagedResult } from './client';
import { apiEndpoints } from './endpoints';
import type { CreateMedicinePayload, MedicineDto } from './types';
import { DEFAULT_PAGE_SIZE } from '@/components/ui/Pagination';

const url = (path: string) => `${apiConfig.medicine}${path}`;
const ep = apiEndpoints.medicines;

export function getAllMedicinesPaged(params?: {
  medicineName?: string;
  category?: string;
  stockStatus?: string;
  page?: number;
  size?: number;
}): Promise<PagedResult<MedicineDto>> {
  const searchParams = new URLSearchParams();
  if (params?.medicineName) searchParams.append('medicineName', params.medicineName);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.stockStatus) searchParams.append('stockStatus', params.stockStatus);
  searchParams.append('page', String(params?.page ?? 0));
  searchParams.append('size', String(params?.size ?? DEFAULT_PAGE_SIZE));
  return apiRequestPage<MedicineDto>(`${url(ep.base)}?${searchParams.toString()}`);
}

export function getAllMedicines(params?: {
  medicineName?: string;
  category?: string;
  stockStatus?: string;
  page?: number;
  size?: number;
}) {
  return getAllMedicinesPaged(params).then((page) => page.content);
}

export function getMedicineById(medicineId: string) {
    return apiRequest<MedicineDto>(url(ep.getById(medicineId)));
}

export function createMedicine(payload: CreateMedicinePayload) {
    return apiRequest<MedicineDto[]>(url(ep.base), {
        method: 'POST',
        body: payload,
    });
}

export function createMultipleMedicines(payload: CreateMedicinePayload[]) {
    return apiRequest<MedicineDto[]>(url(ep.base), {
        method: 'POST',
        body: payload,
    });
}

export function updateMedicine(medicineId: string, payload: Partial<CreateMedicinePayload>) {
    return apiRequest<MedicineDto>(url(ep.getById(medicineId)), {
        method: 'PUT',
        body: payload,
    });
}

export function deleteMedicine(medicineId: string) {
    return apiRequest<void>(url(ep.getById(medicineId)), {
        method: 'DELETE',
    });
}

export function getStockSummary() {
    return apiRequest<Record<string, number>>(url(ep.stockSummary));
}

export function getStockByCategory(category: string) {
    return apiRequestList<MedicineDto>(url(ep.stockByCategory(category)));
}

export function deductMedicineStock(medicineId: string, quantity: number) {
    return apiRequest<void>(url(ep.deductStock(medicineId)), {
        method: 'POST',
        body: { quantity },
    });
}

export function getMedicineCategories() {
    return apiRequestList<string>(url(ep.categories));
}

export function getMedicineNames() {
    return apiRequestList<{ id: string; medicineName: string }>(url(ep.names));
}

export function getMedicineManufacturers() {
    return apiRequestList<string>(url(ep.manufacturers));
}

export function getLowStockMedicines() {
    return apiRequestList<MedicineDto>(url(ep.lowStock));
}

export function restoreMedicineStock(medicineId: string, quantity: number) {
    return apiRequest<void>(url(ep.restoreStock(medicineId)), {
        method: 'POST',
        body: { quantity },
    });
}
