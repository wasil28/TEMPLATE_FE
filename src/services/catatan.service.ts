import api from '~/composables/useApi'

/* ── MODUL CONTOH: service ─────────────────────────────────────────────
   Satu berkas per modul BE, satu fungsi per endpoint. Tidak ada logika di
   sini — hanya bentuk URL dan cara mengirimnya. Komponen TIDAK memanggil
   `api` langsung; semuanya lewat service supaya perubahan URL cukup di
   satu tempat. */
export const catatanService = {
  list: (params?: Record<string, any>) =>
    api.get('/api/v1/catatan', { params }).then((r) => r.data),

  detail: (id: number) => api.get(`/api/v1/catatan/${id}`).then((r) => r.data),

  create: (payload: Record<string, any>) =>
    api.post('/api/v1/catatan', payload).then((r) => r.data),

  update: (id: number, payload: Record<string, any>) =>
    api.patch(`/api/v1/catatan/${id}`, payload).then((r) => r.data),

  // Perpindahan status = endpoint sendiri, sama seperti di BE.
  terbitkan: (id: number) => api.patch(`/api/v1/catatan/${id}/terbitkan`).then((r) => r.data),
  arsipkan:  (id: number) => api.patch(`/api/v1/catatan/${id}/arsipkan`).then((r) => r.data),
  kembalikan:(id: number) => api.patch(`/api/v1/catatan/${id}/kembalikan`).then((r) => r.data),

  remove: (id: number) => api.delete(`/api/v1/catatan/${id}`).then((r) => r.data),
}
