import axios from 'axios'

// Axios instance — withCredentials wajib agar browser kirim httpOnly cookie
const api = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // httpOnly cookie dikirim otomatis, tidak perlu inject manual
})

// baseURL diambil dari runtime config saat request (NUXT_PUBLIC_API_BASE di-inline ketika build).
// Catatan: `process.env` TIDAK tersedia di browser pada SPA build (ssr: false), jadi nilainya
// harus dibaca via useRuntimeConfig(), bukan process.env.
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL = useRuntimeConfig().public.apiBase as string
  }
  return config
})

// 401 → hapus display data dan redirect ke login
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && import.meta.client) {
      localStorage.removeItem('app_user')
      localStorage.removeItem('app_active_role')
      localStorage.removeItem('app_session')
      navigateTo('/login')
    }
    return Promise.reject(error)
  },
)

export function useApi() { return api }
export default api
