import api from '~/composables/useApi'

export const roleService = {
  list: () => api.get('/api/v1/roles').then((r) => r.data),
  detail: (id: number) => api.get(`/api/v1/roles/${id}`).then((r) => r.data),
  create: (payload: Record<string, any>) => api.post('/api/v1/roles', payload).then((r) => r.data),
  update: (id: number, payload: Record<string, any>) => api.patch(`/api/v1/roles/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/api/v1/roles/${id}`).then((r) => r.data),
}
