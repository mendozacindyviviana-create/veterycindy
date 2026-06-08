import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const appointmentService = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  addClinicalNotes: (id, data) => api.put(`/appointments/${id}/clinical-notes`, data),
  processPayment: (id, data) => api.post(`/appointments/${id}/payment`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const patientService = {
  getMyPets: () => api.get('/patients/my-pets'),
  getAll: () => api.get('/patients/all'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const contactService = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
};
