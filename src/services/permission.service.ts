import api from '~/composables/useApi'

export const permissionService = {
  getByRole: (roleId: number) =>
    api.get(`/api/v1/permissions/${roleId}`).then((r) => r.data),
  update: (roleId: number, permissions: Record<string, any>[]) =>
    api.patch(`/api/v1/permissions/${roleId}`, { permissions }).then((r) => r.data),
}
