import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.attendance}${path}`;
const ep = apiEndpoints.attendances;

export interface AttendanceDto {
  id: string;
  serialNumber?: string;
  empId: string;
  empName: string;
  staffType: string;
  attendanceDate: string;
  checkInTime: string;
  checkOutTime?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckInPayload {
  empId: string;
  empName: string;
  staffType: string;
  attendanceDate: string;
  checkInTime: string;
  status: string;
}

export interface CheckOutPayload {
  checkOutTime: string;
}

export interface UpdateAttendanceStatusPayload {
  status: string;
}

export function checkIn(payload: CheckInPayload) {
  return apiRequest<AttendanceDto>(url(ep.checkIn), {
    method: 'POST',
    body: payload,
  });
}

export function checkOut(id: string, payload: CheckOutPayload) {
  return apiRequest<AttendanceDto>(url(ep.checkOut(id)), {
    method: 'PUT',
    body: payload,
  });
}

export function updateAttendanceStatus(
  id: string,
  payload: UpdateAttendanceStatusPayload,
) {
  return apiRequest<AttendanceDto>(url(ep.status(id)), {
    method: 'PUT',
    body: payload,
  });
}

export function getAttendances() {
  return apiRequestList<AttendanceDto>(url(ep.base));
}

export function getAttendanceById(id: string) {
  return apiRequest<AttendanceDto>(url(ep.byId(id)));
}

export function getAttendancesByEmployee(empId: string) {
  return apiRequestList<AttendanceDto>(url(ep.byEmployee(empId)));
}

export function deleteAttendance(id: string) {
  return apiRequest<void>(url(ep.byId(id)), { method: 'DELETE' });
}
