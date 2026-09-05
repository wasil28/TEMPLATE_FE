<template>
  <div class="empty-state" style="min-height:100vh;">
    <div style="font-size:72px;font-weight:800;color:var(--danger);opacity:.2;line-height:1;">403</div>
    <div class="empty-state__icon" style="background:var(--danger-bg);">
      <ShieldOff :size="36" style="color:var(--danger);" />
    </div>
    <div class="empty-state__title">Akses Ditolak</div>
    <p class="empty-state__desc">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
    <NuxtLink :to="dash" class="btn btn-primary" style="margin-top:8px;">← Kembali ke Ringkasan</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank', requiresAuth: false })
import { ShieldOff } from 'lucide-vue-next'
import { useAuthStore, ROLE_DASHBOARD } from '~/stores/auth'

const authStore = useAuthStore()
const dash = computed(() => ROLE_DASHBOARD[authStore.activeRole?.kode ?? ''] ?? '/login')
</script>
