<template>
  <div class="min-h-screen flex items-center justify-center text-[13px] text-text-muted">
    Mengalihkan…
  </div>
</template>

<script setup lang="ts">
// Akar aplikasi: arahkan sesuai keadaan sesi.
// Middleware auth sudah mengalihkan user ber-sesi ke dasbor rolenya;
// halaman ini hanya jaring pengaman untuk kunjungan langsung.
import { useAuthStore, ROLE_DASHBOARD } from '~/stores/auth'

definePageMeta({ layout: 'blank', requiresAuth: false })

const authStore = useAuthStore()
onMounted(() => {
  authStore.restoreSession()
  const dash = ROLE_DASHBOARD[authStore.activeRole?.kode ?? '']
  navigateTo(authStore.isAuthenticated && dash ? dash : '/login', { replace: true })
})
</script>
