import api from './api';

export const ingredienteService = {
  getAll: (params) => api.get('/ingredientes', { params }),
  getById: (id) => api.get(`/ingredientes/${id}`),
  create: (data) => api.post('/ingredientes', data),
  update: (id, data) => api.put(`/ingredientes/${id}`, data),
  delete: (id) => api.delete(`/ingredientes/${id}`),
};