<template>
  <div class="min-h-screen flex items-center justify-center bg-surface px-4">
    <div class="w-full max-w-[420px] bg-card rounded-xl p-6 sm:p-9 shadow-lg">
      <h2 class="text-[20px] font-bold mb-1">Tetapkan kata sandi</h2>

      <template v-if="memeriksa">
        <p class="text-[13px] text-text-muted">Memeriksa tautan…</p>
      </template>

      <template v-else-if="!sah">
        <p class="text-[13px] text-text-muted mb-4">
          Tautan ini tidak berlaku atau sudah kedaluwarsa. Mintalah tautan baru kepada
          pengelola beasiswa.
        </p>
        <NuxtLink to="/login" class="btn btn-secondary">← Kembali ke halaman masuk</NuxtLink>
      </template>

      <template v-else-if="selesai">
        <p class="text-[13px] text-text-muted mb-4">
          Kata sandi ditetapkan. Anda sudah dapat masuk memakai <b>{{ email }}</b>.
        </p>
        <NuxtLink to="/login" class="btn btn-primary">Masuk sekarang</NuxtLink>
      </template>

      <template v-else>
        <p class="text-[13px] text-text-muted mb-5">
          Untuk akun <b>{{ email }}</b>. Setelah ini Anda dapat masuk kembali.
        </p>
        <form class="flex flex-col gap-3.5" @submit.prevent="simpan">
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Kata sandi baru</label>
            <input v-model="sandi" type="password" class="form-control" placeholder="Minimal 8 karakter" autocomplete="new-password" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Ulangi kata sandi</label>
            <input v-model="ulang" type="password" class="form-control" autocomplete="new-password" />
          </div>
          <p v-if="galat" class="text-[12px] text-danger">{{ galat }}</p>
          <button type="submit" class="btn btn-primary" :disabled="menyimpan">
            {{ menyimpan ? 'Menyimpan…' : 'Tetapkan kata sandi' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', requiresAuth: false })
import { authService } from '~/services/auth.service'
import { getErrorMessage } from '~/utils/error.handler'

const route = useRoute()
const token = String(route.query.token ?? '')
const memeriksa = ref(true)
const sah = ref(false)
const email = ref('')
const sandi = ref(''); const ulang = ref('')
const galat = ref(''); const menyimpan = ref(false); const selesai = ref(false)

onMounted(async () => {
  if (!token) { memeriksa.value = false; return }
  try {
    const d = (await authService.verifyResetToken(token)).data
    sah.value = !!d.valid
    email.value = d.email ?? ''
  } catch { sah.value = false } finally { memeriksa.value = false }
})

async function simpan() {
  galat.value = ''
  // Sejalan dengan ambang penggantian mandiri di Fase 1.
  if (sandi.value.length < 8) { galat.value = 'Kata sandi minimal 8 karakter'; return }
  if (sandi.value !== ulang.value) { galat.value = 'Ulangan kata sandi tidak cocok'; return }
  menyimpan.value = true
  try {
    await authService.resetPassword(token, sandi.value)
    selesai.value = true
  } catch (e) { galat.value = getErrorMessage(e) } finally { menyimpan.value = false }
}
</script>
