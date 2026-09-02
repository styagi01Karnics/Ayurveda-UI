import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type { CreateMedicinePayload, MedicineDto } from './types';

const url = (path: string) => `${apiConfig.medicine}${path}`;
const ep = apiEndpoints.medicines;

export function getAllMedicines(params?: { medicineName?: string; category?: string; stockStatus?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.medicineName) searchParams.append('medicineName', params.medicineName);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.stockStatus) searchParams.append('stockStatus', params.stockStatus);
    const query = searchParams.toString();
    return apiRequestList<MedicineDto>(`${url(ep.base)}${query ? `?${query}` : ''}`);
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
