import api from './api';

export const menuService = {
  getAll: () => api.get('/menussemanales'),
  getById: (id) => api.get(`/menussemanales/${id}`),
  create: (data) => api.post('/menussemanales', data),
  update: (id, data) => api.put(`/menussemanales/${id}`, data),
  delete: (id) => api.delete(`/menussemanales/${id}`),
  getListaCompras: (id) => api.get(`/menussemanales/${id}/lista-compras`),
};