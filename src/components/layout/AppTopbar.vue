<template>
  <header class="topbar">
    <!-- Logo -->
    <div class="topbar-left">
      <button class="topbar-menu-btn" type="button" aria-label="Buka menu" @click.stop="layoutStore.toggleMobileNav()">
        <component :is="MenuIcon" :size="22" />
      </button>
      <div class="topbar-brand" @click="goHome">
        <div class="logo-mark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#1D6FE0"/>
            <text x="14" y="20" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="Plus Jakarta Sans,sans-serif">TP</text>
          </svg>
        </div>
        <div class="logo-text">
          <!-- Ganti dua baris ini dengan nama sistem Anda -->
          <span class="logo-title">TEMPLATE</span>
          <span class="logo-sub">Nama Sistem · Nama Instansi</span>
        </div>
      </div>
    </div>

    <!-- Search (placeholder — pencarian global menyusul bersama modul domain) -->
    <div class="topbar-center">
      <div class="topbar-search-wrap">
        <component :is="SearchIcon" :size="14" class="topbar-search-icon" />
        <input class="topbar-search-input" type="search" placeholder="Cari…" />
      </div>
    </div>

    <!-- Kanan -->
    <div class="topbar-right">
      <!-- Role switcher — hanya tampil jika user punya lebih dari 1 role -->
      <div v-if="authStore.roles.length > 1" class="role-switcher" ref="roleSwitcherRef">
        <button class="role-badge" @click.stop="toggleRole" type="button">
          <span class="role-dot" :style="{ background: authStore.activeRoleColor }" />
          <span class="role-badge-label">{{ authStore.activeRole?.nama ?? 'Pilih Role' }}</span>
          <component :is="ChevronDownIcon" :size="14" class="role-chevron" />
        </button>
        <div v-show="showRoleDrop" class="role-dropdown">
          <div class="role-dropdown-header">Ganti Tampilan Role</div>
          <button v-for="role in authStore.roles" :key="role.kode"
            class="role-opt" :class="{ 'role-opt--active': authStore.activeRole?.kode === role.kode }"
            @click="switchRole(role)" type="button">
            <span class="role-dot" :style="{ background: ROLE_COLORS[role.kode] ?? '#1D6FE0' }" />
            <span>{{ role.nama }}</span>
            <component :is="CheckIcon" v-if="authStore.activeRole?.kode === role.kode" :size="14" class="role-opt-check" />
          </button>
        </div>
      </div>
      <!-- Role tunggal: pil tanpa dropdown -->
      <div v-else-if="authStore.activeRole" class="role-badge" style="cursor:default">
        <span class="role-dot" :style="{ background: authStore.activeRoleColor }" />
        <span class="role-badge-label">{{ authStore.activeRole?.nama }}</span>
      </div>

      <!-- Avatar -->
      <div class="avatar-wrap" ref="avatarRef">
        <button class="avatar-btn" :style="{ background: authStore.activeRoleColor }" @click.stop="toggleAvatar">
          {{ initials }}
        </button>
        <div v-show="showAvatarMenu" class="avatar-menu">
          <div class="avatar-menu-header">
            <div class="avatar-btn" style="width:36px;height:36px;font-size:13px;flex-shrink:0;" :style="{ background: authStore.activeRoleColor }">{{ initials }}</div>
            <div>
              <div class="avatar-menu-name">{{ authStore.user?.nama ?? '—' }}</div>
              <div class="avatar-menu-role">{{ authStore.activeRole?.nama }}{{ authStore.user?.instansi_nama ? ` · ${authStore.user.instansi_nama}` : '' }}</div>
            </div>
          </div>
          <div class="avatar-menu-divider" />
          <button class="avatar-menu-item avatar-menu-item--danger" @click="doLogout" type="button">
            <component :is="LogOutIcon" :size="14" /> Keluar
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronDown, Check, LogOut, Search, Menu } from 'lucide-vue-next'
import { useAuthStore, ROLE_COLORS, ROLE_DASHBOARD, type Role } from '~/stores/auth'
import { useLayoutStore } from '~/stores/layout'
import { authService } from '~/services/auth.service'

// Alias untuk menghindari template warnings
const ChevronDownIcon = ChevronDown
const CheckIcon = Check
const LogOutIcon = LogOut
const SearchIcon = Search
const MenuIcon = Menu

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const router = useRouter()

const showRoleDrop = ref(false)
const showAvatarMenu = ref(false)
const roleSwitcherRef = ref<HTMLElement | null>(null)
const avatarRef = ref<HTMLElement | null>(null)

const initials = computed(() => {
  const name = authStore.user?.nama ?? ''
  return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
})

function goHome() {
  const dash = ROLE_DASHBOARD[authStore.activeRole?.kode ?? ''] ?? '/login'
  router.push(dash)
}
function toggleRole() { showRoleDrop.value = !showRoleDrop.value; showAvatarMenu.value = false }
function toggleAvatar() { showAvatarMenu.value = !showAvatarMenu.value; showRoleDrop.value = false }

function switchRole(role: Role) {
  authStore.setActiveRole(role)
  showRoleDrop.value = false
  router.push(ROLE_DASHBOARD[role.kode] ?? '/login')
}

async function doLogout() {
  try { await authService.logout() } catch { /* session sudah expired */ }
  authStore.clearSession()
  router.push('/login')
}

// Tutup dropdown saat klik di luar
function onClickOutside(e: MouseEvent) {
  if (roleSwitcherRef.value && !roleSwitcherRef.value.contains(e.target as Node)) showRoleDrop.value = false
  if (avatarRef.value && !avatarRef.value.contains(e.target as Node)) showAvatarMenu.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
