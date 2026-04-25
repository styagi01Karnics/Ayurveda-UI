import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; fullName: string; role: string }) =>
    api.post('/auth/register', data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const patientsApi = {
  getAll: (page = 0, size = 20) => api.get(`/patients?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/patients/${id}`),
  create: (data: unknown) => api.post('/patients', data),
  update: (id: number, data: unknown) => api.put(`/patients/${id}`, data),
  delete: (id: number) => api.delete(`/patients/${id}`),
  search: (query: string) => api.get(`/patients/search?q=${encodeURIComponent(query)}`),
};

export const doctorsApi = {
  getAll: (page = 0, size = 20) => api.get(`/doctors?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/doctors/${id}`),
  create: (data: unknown) => api.post('/doctors', data),
  update: (id: number, data: unknown) => api.put(`/doctors/${id}`, data),
  delete: (id: number) => api.delete(`/doctors/${id}`),
};

export const appointmentsApi = {
  getAll: (page = 0, size = 20) => api.get(`/appointments?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/appointments/${id}`),
  create: (data: unknown) => api.post('/appointments', data),
  update: (id: number, data: unknown) => api.put(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
  getToday: () => api.get('/appointments/today'),
};

export const treatmentsApi = {
  getAll: (page = 0, size = 20) => api.get(`/treatments?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/treatments/${id}`),
  create: (data: unknown) => api.post('/treatments', data),
  update: (id: number, data: unknown) => api.put(`/treatments/${id}`, data),
  delete: (id: number) => api.delete(`/treatments/${id}`),
};

export const medicinesApi = {
  getAll: (page = 0, size = 20) => api.get(`/medicines?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/medicines/${id}`),
  create: (data: unknown) => api.post('/medicines', data),
  update: (id: number, data: unknown) => api.put(`/medicines/${id}`, data),
  delete: (id: number) => api.delete(`/medicines/${id}`),
  getLowStock: () => api.get('/medicines/low-stock'),
};

export const billsApi = {
  getAll: (page = 0, size = 20) => api.get(`/bills?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/bills/${id}`),
  create: (data: unknown) => api.post('/bills', data),
  update: (id: number, data: unknown) => api.put(`/bills/${id}`, data),
  delete: (id: number) => api.delete(`/bills/${id}`),
};

export const activityLogsApi = {
  getAll: (page = 0, size = 20) => api.get(`/activity-logs?page=${page}&size=${size}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getMe: () => api.get('/users/me'),
  update: (id: number, data: unknown) => api.put(`/users/${id}`, data),
  changePassword: (data: unknown) => api.post('/users/change-password', data),
};

export default api;
