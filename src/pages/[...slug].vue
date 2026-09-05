<template>
  <div class="empty-state" style="min-height:60vh;">
    <div class="empty-state__icon">
      <Construction :size="34" style="color:var(--brand-600);" />
    </div>
    <div class="empty-state__title">{{ judul }}</div>
    <p class="empty-state__desc">
      Halaman ini sudah dipetakan di menu tetapi berkas page-nya belum dibuat.
      Lihat docs/PANDUAN.md bagian &ldquo;Menambah halaman&rdquo;.
    </p>
    <NuxtLink :to="dash" class="btn btn-secondary" style="margin-top:8px;">← Kembali ke Ringkasan</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Jaring untuk seluruh route menu yang modulnya belum dibangun.
// Menu boleh disemai lebih dulu daripada halamannya supaya struktur
// navigasi teruji sejak awal — halaman ini yang menampung sisanya.
definePageMeta({ middleware: ['auth'] })
import { Construction } from 'lucide-vue-next'
import { useAuthStore, ROLE_DASHBOARD } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const dash = computed(() => ROLE_DASHBOARD[authStore.activeRole?.kode ?? ''] ?? '/login')

// Nama layar dari menu yang cocok dengan path — supaya judulnya bermakna
const judul = computed(() => {
  const item = authStore.menuItems.find((m) => m.route_path === route.path)
  return item ? `${item.nama} — dalam pengembangan` : 'Dalam pengembangan'
})
</script>
