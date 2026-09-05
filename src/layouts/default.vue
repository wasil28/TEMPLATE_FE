<template>
  <div class="app-shell">
    <div id="topbar" class="print:hidden"><AppTopbar /></div>
    <div class="app-body">
      <div id="sidebar" class="print:hidden"><AppSidebar /></div>
      <main class="main-content print:!p-0 print:!m-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppTopbar from '~/components/layout/AppTopbar.vue'
import { authService } from '~/services/auth.service'

const authStore = useAuthStore()

onMounted(async () => {
  // Restore user + activeRole dari localStorage (sync, tidak butuh network)
  authStore.restoreSession()

  // Fetch menus dari server — wajib karena isi menu bisa berubah dari admin.
  // Juga re-fetch user agar data fresh. Jika session expired, axios interceptor
  // otomatis redirect ke /login.
  if (authStore.isAuthenticated) {
    try {
      const [meData, menuData] = await Promise.all([
        authService.me(),
        authService.menus(),
      ])
      authStore.setUser(meData.data)
      authStore.setMenuItems(menuData.data)
      if (meData.data?.roles?.length) {
        authStore.setRoles(meData.data.roles)
      }
    } catch {
      // Session expired — axios interceptor sudah handle redirect ke /login
    }
  }
})
</script>
