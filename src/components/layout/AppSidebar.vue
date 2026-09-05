<template>
  <!-- Backdrop drawer (hanya tampil di mobile saat menu dibuka) -->
  <div class="sidebar-backdrop" :class="{ 'sidebar-backdrop--show': layoutStore.mobileNavOpen }" @click="layoutStore.closeMobileNav()"></div>
  <aside class="sidebar" :class="{ 'sidebar--open': layoutStore.mobileNavOpen }">
    <nav class="sidebar-nav">
      <!-- Grouped menu dari store -->
      <template v-if="menuGroups.length">
        <div v-for="group in menuGroups" :key="group.group" class="nav-group">
          <div class="nav-group-label">{{ group.group }}</div>
          <NuxtLink
            v-for="item in group.items"
            :key="item.route_path"
            :to="item.route_path"
            class="nav-item"
            :class="{ 'nav-item--active': isActive(item.route_path) }"
          >
            <component :is="getIcon(item.ikon)" class="nav-icon" :size="18" />
            <span class="nav-label">{{ item.nama }}</span>
          </NuxtLink>
        </div>
      </template>

      <!-- Fallback: menu flat (dari API tanpa group) -->
      <template v-else-if="authStore.menuItems.length">
        <div class="nav-group">
          <div class="nav-group-label">Menu</div>
          <NuxtLink
            v-for="item in authStore.menuItems"
            :key="item.id"
            :to="item.route_path"
            class="nav-item"
            :class="{ 'nav-item--active': isActive(item.route_path) }"
          >
            <component :is="getIcon(item.ikon)" class="nav-icon" :size="18" />
            <span class="nav-label">{{ item.nama }}</span>
          </NuxtLink>
        </div>
      </template>

      <div v-else class="py-4 px-3">
        <span class="text-xs text-muted">Memuat menu...</span>
      </div>
    </nav>

    <!-- Footer sidebar — logout -->
    <div class="sidebar-footer">
      <button class="nav-item w-full" type="button" @click="doLogout">
        <LogOut class="nav-icon" :size="18" />
        <span class="nav-label">Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLayoutStore } from '~/stores/layout'
import { authService } from '~/services/auth.service'
import { getIcon } from '~/utils/icons'

/* Pengelompokan sidebar per peran.
   Isi menunya datang dari API (/auth/menus) sesuai otorisasi; peta ini
   hanya menentukan JUDUL GRUP dan URUTAN tampilnya. Route yang ada di
   otorisasi tetapi tidak disebut di sini TIDAK TAMPIL — jadi tiap menu baru
   di seeder 03 harus ditambahkan ke grupnya di sini. */
const MENU_GROUPS: Record<string, Record<string, string[]>> = {
  staf: {
    'Pekerjaan': ['/staf/ringkasan', '/staf/catatan'],
    'Akun': ['/admin/profil'],
  },
  admin: {
    'Pengaturan': ['/admin/ringkasan'],
    'Modul Contoh': ['/admin/catatan'],
    'Utilitas': ['/admin/utilitas/pengguna', '/admin/utilitas/roles', '/admin/utilitas/menu', '/admin/utilitas/otorisasi'],
    'Akun': ['/admin/profil'],
  },
}

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const route = useRoute()
const router = useRouter()

// Tutup drawer setiap pindah halaman; kunci scroll body saat drawer terbuka.
watch(() => route.path, () => layoutStore.closeMobileNav())
watch(() => layoutStore.mobileNavOpen, (open) => {
  if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
})

// Grouping menu dari API berdasarkan route path + MENU_GROUPS definition
const menuGroups = computed(() => {
  const roleKode = authStore.activeRole?.kode ?? ''
  const groupDef = MENU_GROUPS[roleKode]
  if (!groupDef || !authStore.menuItems.length) return []

  const menuByPath: Record<string, any> = {}
  for (const m of authStore.menuItems) menuByPath[m.route_path] = m

  return Object.entries(groupDef)
    .map(([groupName, paths]) => ({
      group: groupName,
      items: paths.map((p) => menuByPath[p]).filter(Boolean),
    }))
    .filter((g) => g.items.length > 0)
})

function isActive(routePath: string): boolean {
  return route.path === routePath
}

async function doLogout() {
  try { await authService.logout() } catch { /* session sudah expired */ }
  authStore.clearSession()
  router.push('/login')
}
</script>
