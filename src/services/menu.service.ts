import api from '~/composables/useApi'

export const menuService = {
  list: () => api.get('/api/v1/menu').then((r) => r.data),
  create: (payload: Record<string, any>) => api.post('/api/v1/menu', payload).then((r) => r.data),
  update: (id: number, payload: Record<string, any>) => api.patch(`/api/v1/menu/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/api/v1/menu/${id}`).then((r) => r.data),
}
