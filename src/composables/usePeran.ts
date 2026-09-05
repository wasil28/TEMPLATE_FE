import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

/* Peran yang sedang dipakai pengguna.

   Dibuat satu tempat karena sebelumnya tersebar sebagai
   `auth.user?.roles.map(r => r.kode)` di enam belas komponen — dan itu
   salah dengan cara yang sunyi: `app_user` di localStorage sengaja
   hanya menyimpan id, nama, dan surel (lihat `setUser`), sehingga
   `user.roles` ada tepat setelah login lalu HILANG begitu halaman
   dimuat ulang. Akibatnya tiap tombol yang berpagar peran menghilang
   sesudah refresh, tanpa galat, tanpa jejak di konsol.

   `activeRole` yang bertahan, dan ia pula yang benar secara arti:
   seseorang berperan ganda sedang bertindak sebagai satu peran, bukan
   sebagai gabungan keduanya. */
export function usePeran() {
  const auth = useAuthStore()

  const kode = computed(() => auth.activeRole?.kode ?? '')
  const peran = computed<string[]>(() => (kode.value ? [kode.value] : []))
  const punya = (...k: string[]) => k.includes(kode.value)

  return {
    /** Kode peran aktif, mis. 'staf'. Kosong bila sesi belum pulih. */
    kode,
    /** Bentuk larik — agar pemanggil lama yang menulis `peran.includes(...)` tetap jalan. */
    peran,
    /** `punya('staf', 'admin')` — benar bila peran aktif salah satunya. */
    punya,
    isAdmin: computed(() => kode.value === 'admin'),
    /** Akun terikat satu instansi — hanya melihat data instansinya. */
    berlingkup: computed(() => auth.user?.instansi_id != null),
  }
}
