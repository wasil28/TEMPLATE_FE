import api from '~/composables/useApi'

export const authService = {
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }).then((r) => r.data),

  logout: () => api.post('/api/v1/auth/logout').then((r) => r.data),

  refresh: () => api.post('/api/v1/auth/refresh', {}).then((r) => r.data),

  me: () => api.get('/api/v1/auth/me').then((r) => r.data),

  menus: () => api.get('/api/v1/auth/menus').then((r) => r.data),

  getProfile: () => api.get('/api/v1/auth/profile').then((r) => r.data),

  updateProfile: (payload: { telepon?: string; foto?: string }) =>
    api.patch('/api/v1/auth/profile', payload).then((r) => r.data),

  gantiSandi: (sandi_lama: string, sandi_baru: string) =>
    api.post('/api/v1/auth/ganti-sandi', { sandi_lama, sandi_baru }).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post('/api/v1/auth/forgot-password', { email }).then((r) => r.data),

  verifyResetToken: (token: string) =>
    api.get('/api/v1/auth/reset-password/verify', { params: { token } }).then((r) => r.data),

  resetPassword: (token: string, new_password: string) =>
    api.post('/api/v1/auth/reset-password', { token, new_password }).then((r) => r.data),
}
