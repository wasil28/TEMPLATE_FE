<template>
  <div class="min-h-screen flex items-center justify-center bg-surface px-4">
    <div class="w-full max-w-[400px] mx-auto bg-card rounded-xl p-6 sm:p-10 shadow-lg">
      <NuxtLink to="/login" class="text-[13px] text-brand-600">← Kembali ke Login</NuxtLink>
      <h2 class="mt-4 mb-1 text-[20px] font-bold">Lupa Password</h2>
      <p class="text-[13px] text-text-muted mb-5">Masukkan email untuk mendapat link reset</p>
      <form @submit.prevent="send" class="flex flex-col gap-3.5">
        <input v-model="email" type="email" class="px-3 py-2.5 border-[1.5px] border-border rounded-sm text-[14px] outline-none focus:border-brand-600" placeholder="email@contoh.id" />
        <div v-if="sent" class="px-2.5 py-2.5 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-sm text-[13px] text-[var(--success)]">
          ✅ Jika email terdaftar, link reset telah dikirim.
        </div>
        <button type="submit" class="py-[11px] bg-brand-600 text-white font-semibold rounded-sm border-none cursor-pointer disabled:opacity-60" :disabled="loading">
          {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
        </button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">


definePageMeta({ layout: 'auth', requiresAuth: false })
import { authService } from '~/services/auth.service'

const email = ref(''); const loading = ref(false); const sent = ref(false)
async function send() {
  if (!email.value) return
  loading.value = true
  try { await authService.forgotPassword(email.value); sent.value = true }
  finally { loading.value = false }
}
</script>
