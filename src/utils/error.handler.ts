import type { AxiosError } from 'axios'

// Ekstrak pesan error dari response API atau exception umum
export function getErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<any>
  if (axiosErr?.response?.data?.message) {
    const msg = axiosErr.response.data.message
    return Array.isArray(msg) ? msg.join(', ') : String(msg)
  }
  if (axiosErr?.message) return axiosErr.message
  return 'Terjadi kesalahan. Silakan coba lagi.'
}
