import api from './api';

export const comidaService = {
  getAll: (params) => api.get('/comidas', { params }),
  getById: (id) => api.get(`/comidas/${id}`),
  create: (data) => api.post('/comidas', data),
  update: (id, data) => api.put(`/comidas/${id}`, data),
  delete: (id) => api.delete(`/comidas/${id}`),
};