import api from '~/composables/useApi'

export const instansiService = {
  list: () => api.get('/api/v1/instansi').then((r) => r.data),
}
