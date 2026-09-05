<template>
  <div>
    <!-- Banner sambutan -->
    <div class="greeting-banner">
      <div class="greeting-inner">
        <div>
          <div class="greeting-sub">Selamat datang,</div>
          <div class="greeting-name">{{ authStore.user?.nama ?? '—' }}</div>
          <div class="greeting-info">
            {{ authStore.activeRole?.nama }}
            <template v-if="authStore.user?.jabatan"> &middot; {{ authStore.user.jabatan }}</template>
            <template v-if="authStore.user?.instansi_nama"> &middot; {{ authStore.user.instansi_nama }}</template>
          </div>
        </div>
      </div>
    </div>

    <!-- Isi ringkasan diisi tiap proyek: kartu statistik, daftar tindakan, dsb. -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header"><span class="card-title">{{ judul }}</span></div>
      <div class="card-body">
        <p class="text-[13px] text-text-muted leading-relaxed">
          {{ deskripsi }}
        </p>
        <p class="text-[13px] text-text-muted leading-relaxed mt-2">
          Ganti isi kartu ini dengan ringkasan yang berguna bagi peran ini &mdash;
          kelas <code>.stat-grid</code>, <code>.stat-card</code>, dan <code>.dash-panel</code>
          sudah tersedia di tailwind.css.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

defineProps<{ judul: string; deskripsi: string }>()
const authStore = useAuthStore()
</script>
