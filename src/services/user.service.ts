import api from '~/composables/useApi'

export const userService = {
  list: (params?: Record<string, any>) =>
    api.get('/api/v1/users', { params }).then((r) => r.data),

  detail: (id: number) =>
    api.get(`/api/v1/users/${id}`).then((r) => r.data),

  create: (payload: Record<string, any>) =>
    api.post('/api/v1/users', payload).then((r) => r.data),

  update: (id: number, payload: Record<string, any>) =>
    api.patch(`/api/v1/users/${id}`, payload).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/api/v1/users/${id}`).then((r) => r.data),

  assignRoles: (id: number, roleIds: number[]) =>
    api.post(`/api/v1/users/${id}/roles`, { role_ids: roleIds }).then((r) => r.data),

  resetPassword: (id: number, newPassword: string) =>
    api.post(`/api/v1/users/${id}/reset-password`, { new_password: newPassword }).then((r) => r.data),
}
