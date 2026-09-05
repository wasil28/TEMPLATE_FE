// @pinia/nuxt auto-imports defineStore + ref/computed

export interface User {
  id: number; nama: string; email: string; identitas?: string; jabatan?: string;
  instansi_id?: number | null; instansi_nama?: string | null; roles?: Role[];
}
export interface Role { id: number; kode: string; nama: string; }
export interface MenuItem {
  id: number; nama: string; ikon: string; route_path: string; urutan?: number;
  otorisasi?: { allow_view: boolean; allow_new: boolean; allow_edit: boolean; allow_delete: boolean; allow_approve: boolean; }
}

/* Dua peta ini WAJIB diperbarui setiap kali peran baru ditambahkan di
   seeder BE (01_roles). Kode peran yang tidak ada di sini tetap bisa login,
   tetapi mendarat di /login lagi karena tidak punya dasbor. */

// Warna peran — dipakai pil peran di topbar dan avatar
export const ROLE_COLORS: Record<string, string> = {
  admin: '#5B6478',
  staf:  '#1D6FE0',
}

// Halaman pendaratan per peran setelah login
export const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/admin/ringkasan',
  staf:  '/staf/ringkasan',
}

const ls = (key: string) => import.meta.client ? localStorage.getItem(key) : null
const lsSet = (key: string, val: string) => { if (import.meta.client) localStorage.setItem(key, val) }
const lsDel = (key: string) => { if (import.meta.client) localStorage.removeItem(key) }

export const useAuthStore = defineStore('auth', () => {
  // Token TIDAK disimpan di localStorage — ada di httpOnly cookie (tidak bisa diakses JS)
  // Hanya display data (non-sensitif) yang disimpan di localStorage
  const user = ref<User | null>(null)
  const roles = ref<Role[]>([])
  const activeRole = ref<Role | null>(null)
  const menuItems = ref<MenuItem[]>([])

  // isAuthenticated: true jika user ada di memory ATAU ada session flag di localStorage
  // Flag hanya memberi tahu "ada kemungkinan session valid" — validasi nyata via /auth/me
  const isAuthenticated = computed(() => !!user.value || !!ls('app_session'))
  const isAdmin = computed(() => activeRole.value?.kode === 'admin')
  // Akun berlingkup: terikat satu instansi (lihat BE m_users.instansi_id)
  const berlingkup = computed(() => user.value?.instansi_id != null)
  const activeRoleColor = computed(() => ROLE_COLORS[activeRole.value?.kode ?? ''] ?? '#1D6FE0')

  function can(routePath: string, action: 'new' | 'edit' | 'delete' | 'approve' | 'download'): boolean {
    const menu = menuItems.value.find((m) => m.route_path === routePath)
    if (!menu?.otorisasi) return false
    const map = { new: 'allow_new', edit: 'allow_edit', delete: 'allow_delete', approve: 'allow_approve', download: 'allow_download' }
    return !!(menu.otorisasi as any)[map[action]]
  }

  // setToken: tidak menyimpan token (cookie handles it), hanya set session flag
  function setToken(_accessToken: string, _refreshToken?: string) {
    lsSet('app_session', '1')
  }

  /* Yang dipersistenkan hanya data tampilan yang tidak sensitif. `instansi_id`
     ikut karena ia menentukan LINGKUP (akun berlingkup vs internal) — layar
     membacanya lewat usePeran().berlingkup sejak render pertama, sebelum
     /auth/me sempat menjawab. Roles sengaja TIDAK di sini: peran yang dipakai
     adalah activeRole, yang dipersistenkan sendiri. */
  function setUser(userData: any) {
    user.value = userData
    lsSet('app_user', JSON.stringify({
      id: userData.id, nama: userData.nama, email: userData.email,
      jabatan: userData.jabatan ?? null,
      instansi_id: userData.instansi_id ?? null,
      instansi_nama: userData.instansi_nama ?? null,
    }))
  }

  function setRoles(userRoles: Role[]) {
    roles.value = userRoles
    if (!activeRole.value && userRoles.length > 0) setActiveRole(userRoles[0])
  }

  function setActiveRole(role: Role) {
    activeRole.value = role
    lsSet('app_active_role', JSON.stringify(role))
  }

  function setMenuItems(items: MenuItem[]) {
    menuItems.value = items
    lsSet('app_menus', JSON.stringify(items))
  }

  function clearSession() {
    user.value = null; roles.value = []; activeRole.value = null; menuItems.value = []
    lsDel('app_user'); lsDel('app_active_role')
    lsDel('app_session'); lsDel('app_menus')
  }

  // Restore display data dari localStorage (sync) — menus di-cache juga agar
  // sidebar langsung tampil tanpa flash "Memuat menu..." saat refresh
  function restoreSession() {
    if (!import.meta.client) return
    const savedRole = ls('app_active_role')
    if (savedRole) { try { activeRole.value = JSON.parse(savedRole) } catch { lsDel('app_active_role') } }
    /* Hanya mengisi bila memori KOSONG. restoreSession() dipanggil middleware
       pada setiap pindah halaman; tanpa penjaga ini, `user` lengkap dari
       /auth/me ditimpa salinan localStorage yang lebih tipis setiap kali
       pengguna berpindah halaman — kolom seperti instansi_id lenyap diam-diam. */
    const savedUser = ls('app_user')
    if (savedUser && !user.value) { try { user.value = JSON.parse(savedUser) } catch { lsDel('app_user') } }
    const savedMenus = ls('app_menus')
    if (savedMenus) { try { menuItems.value = JSON.parse(savedMenus) } catch { lsDel('app_menus') } }
  }

  return {
    user, roles, activeRole, menuItems,
    isAuthenticated, isAdmin, berlingkup, activeRoleColor,
    can, setToken, setUser, setRoles, setActiveRole, setMenuItems, clearSession, restoreSession,
  }
})
