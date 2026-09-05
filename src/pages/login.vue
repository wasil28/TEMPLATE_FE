<template>
  <div class="lr-root">

    <!-- ═══ FORM — Left ═══ -->
    <div class="lr-left">
      <!-- Top logo -->
      <div class="lr-brand">
        <div class="lr-brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <div class="lr-brand-text">
          <!-- Ganti dengan nama & deskripsi sistem Anda -->
          <span class="lr-brand-name">TEMPLATE</span>
          <span class="lr-brand-sub">Nama lengkap sistem · Nama instansi</span>
        </div>
      </div>

      <!-- Form card -->
      <div class="lr-card">
        <div class="lr-card-head">
          <h2 class="lr-title">Selamat Datang 👋</h2>
          <p class="lr-desc">Masuk dengan akun yang diberikan administrator</p>
        </div>

        <form @submit.prevent="handleLogin" novalidate class="lr-form">
          <!-- Email -->
          <div class="lf-field" :class="{ 'lf-field--err': errors.email }">
            <label class="lf-label">Email</label>
            <div class="lf-wrap">
              <svg class="lf-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input v-model="form.email" type="email" class="lf-input" placeholder="nama@contoh.id" :disabled="loading" />
            </div>
            <p v-if="errors.email" class="lf-err">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div class="lf-field" :class="{ 'lf-field--err': errors.password }">
            <label class="lf-label">Password</label>
            <div class="lf-wrap">
              <svg class="lf-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="lf-input" placeholder="••••••••" :disabled="loading" />
              <button type="button" class="lf-pw-btn" @click="showPw = !showPw" tabindex="-1">
                <svg v-if="showPw" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <p v-if="errors.password" class="lf-err">{{ errors.password }}</p>
          </div>

          <!-- API Error -->
          <div v-if="apiError" class="lf-alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ apiError }}
          </div>

          <button type="submit" class="lf-submit" :disabled="loading">
            <span v-if="loading" class="lf-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>

          <div class="lf-links">
            <NuxtLink to="/lupa-password">Lupa password?</NuxtLink>
          </div>
        </form>

        
      </div>

      <p class="lr-copy">© {{ year }} Nama Instansi. Semua hak dilindungi.</p>
    </div>

    <!-- ═══ VISUAL — Right ═══ -->
    <div class="lr-right" aria-hidden="true">

      <!-- Sky blob layers -->
      <div class="sky-layer sky-1"></div>
      <div class="sky-layer sky-2"></div>
      <div class="sky-layer sky-3"></div>

      <!-- Content -->
      <div class="vis-body">

        <!-- Panel kanan: ganti isinya dengan gambaran sistem Anda.
             Struktur (tag, judul, sub, 4 kartu fitur, bar statistik)
             dipertahankan supaya gayanya tetap serasi. -->
        <div class="vis-header">
          <div class="vis-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Template Aplikasi Internal
          </div>
          <h3 class="vis-title">
            Satu Fondasi,<br/>
            <span class="vis-title-accent">Banyak Sistem</span>
          </h3>
          <p class="vis-sub">Autentikasi, peran, menu, dan otorisasi sudah tersedia — tim langsung mengerjakan modul domainnya.</p>
        </div>

        <div class="feat-grid">
          <div class="feat-card fc-1">
            <div class="fc-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div class="fc-content">
              <div class="fc-title">Autentikasi &amp; Sesi</div>
              <div class="fc-desc">Cookie httpOnly, sesi Redis bergeser, refresh token, lupa &amp; ganti sandi</div>
            </div>
          </div>
          <div class="feat-card fc-2">
            <div class="fc-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="fc-content">
              <div class="fc-title">Peran &amp; Otorisasi</div>
              <div class="fc-desc">RBAC per endpoint, menu per peran, bendera aksi per halaman</div>
            </div>
          </div>
          <div class="feat-card fc-3">
            <div class="fc-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="fc-content">
              <div class="fc-title">Modul Contoh</div>
              <div class="fc-desc">Satu modul utuh — migrasi, entity, DTO, service, controller, layar</div>
            </div>
          </div>
          <div class="feat-card fc-4">
            <div class="fc-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div class="fc-content">
              <div class="fc-title">Standar Kode</div>
              <div class="fc-desc">Penamaan, struktur folder, alur menulis modul — lihat docs/PANDUAN.md</div>
            </div>
          </div>
        </div>

        <div class="stats-bar">
          <div class="stat-item"><div class="stat-num">2</div><div class="stat-lbl">Peran Bawaan</div></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><div class="stat-num">6</div><div class="stat-lbl">Modul Dasar</div></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><div class="stat-num">1</div><div class="stat-lbl">Modul Contoh</div></div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', requiresAuth: false })
import { useAuthStore, ROLE_DASHBOARD } from '~/stores/auth'
import { authService } from '~/services/auth.service'
import { getErrorMessage } from '~/utils/error.handler'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const loading = ref(false)
const apiError = ref('')
const showPw = ref(false)
const year = new Date().getFullYear()

function validate(): boolean {
  errors.email = ''; errors.password = ''
  if (!form.email) { errors.email = 'Email wajib diisi'; return false }
  if (!form.email.includes('@')) { errors.email = 'Format email tidak valid'; return false }
  if (form.password.length < 6) { errors.password = 'Password minimal 6 karakter'; return false }
  return true
}
async function handleLogin() {
  if (!validate()) return
  loading.value = true; apiError.value = ''
  try {
    const result = await authService.login(form.email, form.password)
    const { user } = result.data
    authStore.setToken('cookie', 'cookie')
    authStore.setUser(user)
    authStore.setRoles(user.roles)
    const menusResult = await authService.menus()
    authStore.setMenuItems(menusResult.data)
    const roleKode = user.roles[0]?.kode ?? ''
    router.push(ROLE_DASHBOARD[roleKode] ?? '/login')
  } catch (err) {
    apiError.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   ROOT — soft sky-blue split layout
══════════════════════════════════════════════════════════ */
.lr-root {
  min-height: 100vh;
  display: flex;
  background: #EEF5FF;
  align-items: stretch;
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
}

/* ══════════════════════════════════════════════════════════
   LEFT — form panel (white, clean)
══════════════════════════════════════════════════════════ */
.lr-left {
  width: 100%;
  max-width: 460px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 48px 40px;
  gap: 0;
  background: #EEF5FF;
}

/* Brand */
.lr-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 28px;
}
.lr-brand-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563EB, #60A5FA);
  display: flex; align-items: center; justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(37,99,235,.28);
}
.lr-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.lr-brand-name {
  font-size: 14px;
  font-weight: 700;
  color: #1E3A6E;
  letter-spacing: -.1px;
}
.lr-brand-sub {
  font-size: 9.5px;
  font-weight: 600;
  color: #8096B5;
  max-width: 280px;
  margin-top: 1px;
}

/* Form card */
.lr-card {
  width: 100%;
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 2px 4px rgba(37,99,235,.04),
    0 12px 48px rgba(37,99,235,.10),
    0 1px 0 rgba(255,255,255,.9) inset;
  overflow: hidden;
}
.lr-card-head { padding: 32px 32px 0; }
.lr-title {
  font-size: 22px;
  font-weight: 800;
  color: #0F2057;
  letter-spacing: -.3px;
  margin: 0 0 6px;
}
.lr-desc {
  font-size: 13px;
  color: #7A8EAD;
  margin: 0;
  line-height: 1.5;
}

/* Form body */
.lr-form {
  padding: 24px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Fields */
.lf-field { margin-bottom: 18px; }
.lf-label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: #3B5998;
  letter-spacing: .05em;
  text-transform: uppercase;
  margin-bottom: 7px;
}
.lf-wrap {
  display: flex;
  align-items: center;
  background: #F4F8FF;
  border: 1.5px solid #DBEAFE;
  border-radius: 11px;
  padding: 0 14px;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.lf-wrap:focus-within {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37,99,235,.09);
  background: #fff;
}
.lf-field--err .lf-wrap {
  border-color: #F43F5E;
  box-shadow: 0 0 0 3px rgba(244,63,94,.08);
}
.lf-ico { color: #93BBDF; flex-shrink: 0; }
.lf-input {
  flex: 1;
  padding: 13px 8px 13px 10px;
  font-size: 14px;
  font-weight: 500;
  color: #0F2057;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
}
.lf-input::placeholder { color: #BCCFE0; }
.lf-input:disabled { opacity: .6; cursor: not-allowed; }

.lf-pw-btn {
  background: none; border: none;
  color: #93BBDF; cursor: pointer;
  padding: 4px;
  display: flex; align-items: center;
  transition: color .15s;
}
.lf-pw-btn:hover { color: #2563EB; }

.lf-err { font-size: 11.5px; color: #F43F5E; margin: 5px 0 0; }

.lf-alert {
  display: flex; align-items: center; gap: 7px;
  padding: 11px 14px;
  background: #FFF1F2;
  border: 1.5px solid #FECDD3;
  border-radius: 10px;
  font-size: 13px;
  color: #E11D48;
  margin-bottom: 10px;
}

.lf-submit {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%);
  color: #fff;
  font-size: 14px; font-weight: 700;
  border: none; border-radius: 12px;
  cursor: pointer;
  transition: all .22s;
  box-shadow: 0 4px 18px rgba(37,99,235,.38);
  font-family: inherit;
  letter-spacing: .01em;
  margin-top: 4px;
}
.lf-submit:hover:not(:disabled) {
  transform: translateY(-1.5px);
  box-shadow: 0 8px 28px rgba(37,99,235,.48);
}
.lf-submit:active:not(:disabled) { transform: none; }
.lf-submit:disabled { opacity: .6; cursor: not-allowed; }

.lf-spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.lf-links {
  display: flex; justify-content: space-between;
  padding: 14px 0 4px;
}
.lf-links a {
  font-size: 12px; font-weight: 600;
  color: #2563EB;
  text-decoration: none;
  transition: opacity .15s;
}
.lf-links a:hover { opacity: .7; }

/* Divider + Microsoft 365 */
.lf-divider {
  display: flex; align-items: center;
  gap: 14px;
  margin: 6px 0 16px;
}
.lf-divider span {
  font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .09em;
  color: #A4B1C2;
  white-space: nowrap;
}
.lf-divider::before, .lf-divider::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(to right, transparent, #DCE3EC, transparent);
}

.lf-ms {
  width: 100%;
  display: flex; align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #E4E9F1;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 5px 16px rgba(37,99,235,.05);
  font-family: inherit;
  cursor: pointer;
  transition: transform .2s cubic-bezier(.2,.8,.2,1), box-shadow .2s, border-color .2s;
}
.lf-ms:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: #C7D7F0;
  box-shadow: 0 2px 4px rgba(15,23,42,.05), 0 12px 28px rgba(37,99,235,.15);
}
.lf-ms:active:not(:disabled) { transform: translateY(0); transition-duration: .05s; }
.lf-ms:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }

.lf-ms-logo {
  display: grid; place-items: center;
  width: 36px; height: 36px;
  border-radius: 10px;
  background: #F2F6FC;
  flex-shrink: 0;
  transition: background .2s;
}
.lf-ms:hover:not(:disabled) .lf-ms-logo { background: #E9F1FD; }

.lf-ms-text {
  flex: 1; text-align: left;
  font-size: 13.5px; font-weight: 500;
  color: #64748B; letter-spacing: -.01em;
}
.lf-ms-text strong { color: #1E293B; font-weight: 700; }

.lf-ms-arrow {
  color: #B6C0CF; flex-shrink: 0;
  transition: transform .2s cubic-bezier(.2,.8,.2,1), color .2s;
}
.lf-ms:hover:not(:disabled) .lf-ms-arrow { transform: translateX(3px); color: #2563EB; }

/* Demo */
.lr-demo {
  margin-top: 20px;
  border-top: 1.5px solid #DBEAFE;
  padding: 16px 32px 24px;
}
.demo-sum {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600;
  color: #7A8EAD; cursor: pointer;
  list-style: none;
  transition: color .15s;
}
.demo-sum:hover { color: #3B5998; }
.demo-sum::-webkit-details-marker { display: none; }
.demo-arr { margin-left: auto; transition: transform .2s; }
details[open] .demo-arr { transform: rotate(180deg); }
.demo-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 12px;
}
.demo-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 8px;
  font-size: 11px; font-weight: 600;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 9%, white);
  border: 1.5px solid color-mix(in srgb, var(--c) 25%, white);
  border-radius: 8px;
  cursor: pointer; text-align: left;
  transition: all .15s;
  font-family: inherit;
}
.demo-chip:hover {
  background: color-mix(in srgb, var(--c) 16%, white);
  transform: translateY(-1px);
}
.demo-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--c);
  flex-shrink: 0;
}

.lr-copy {
  font-size: 11.5px;
  color: #90AED0;
  margin: 18px 0 0 2px;
}

/* ══════════════════════════════════════════════════════════
   RIGHT — soft sky blue visual panel
══════════════════════════════════════════════════════════ */
.lr-right {
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* Soft sky blue gradient — evoking open sky & freshness */
  background: linear-gradient(160deg, #C8E4FF 0%, #BFDBFE 30%, #A5CAFF 60%, #93C5FD 100%);
  padding: 60px 48px;
}

/* Soft sky layered blobs */
.sky-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 50%;
}
.sky-1 {
  background: radial-gradient(ellipse 70% 50% at 80% 10%, rgba(255,255,255,.55) 0%, transparent 60%);
}
.sky-2 {
  background: radial-gradient(ellipse 60% 60% at 10% 80%, rgba(147,197,253,.45) 0%, transparent 65%);
  animation: sky-drift 14s ease-in-out infinite;
}
.sky-3 {
  background: radial-gradient(ellipse 50% 40% at 60% 70%, rgba(219,234,254,.4) 0%, transparent 60%);
  animation: sky-drift 10s ease-in-out infinite reverse;
  animation-delay: -4s;
}
@keyframes sky-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, -20px) scale(1.05); }
}

/* ── Vis content ─── */
.vis-body {
  position: relative;
  z-index: 2;
  max-width: 460px;
  width: 100%;
}

/* Header */
.vis-header { margin-bottom: 32px; }

.vis-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #1D4ED8;
  background: rgba(255,255,255,.6);
  border: 1px solid rgba(37,99,235,.18);
  border-radius: 20px;
  padding: 5px 12px;
  margin-bottom: 18px;
  backdrop-filter: blur(8px);
}

.vis-title {
  font-size: 38px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -1.2px;
  color: #0F2057;
  margin: 0 0 14px;
}
.vis-title-accent {
  background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #0EA5E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  animation: shimmer 4s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.vis-sub {
  font-size: 14px;
  color: #3B5998;
  line-height: 1.7;
  margin: 0;
  max-width: 380px;
  opacity: .85;
}

/* ── Feature grid ─── */
.feat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.feat-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(255,255,255,.85);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(16px);
  transition: transform .22s, background .22s, box-shadow .22s;
  animation: card-in .65s cubic-bezier(.22,1,.36,1) both;
  box-shadow: 0 2px 12px rgba(37,99,235,.07);
}
.feat-card:hover {
  transform: translateY(-3px);
  background: rgba(255,255,255,.88);
  box-shadow: 0 8px 28px rgba(37,99,235,.14);
}
.fc-1 { animation-delay: .05s; }
.fc-2 { animation-delay: .15s; }
.fc-3 { animation-delay: .25s; }
.fc-4 { animation-delay: .35s; }
@keyframes card-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fc-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.fc-1 .fc-icon { background: rgba(245,158,11,.14); color: #D97706; }
.fc-2 .fc-icon { background: rgba(16,185,129,.14); color: #059669; }
.fc-3 .fc-icon { background: rgba(37,99,235,.14); color: #2563EB; }
.fc-4 .fc-icon { background: rgba(139,92,246,.14); color: #7C3AED; }

.fc-content { min-width: 0; }
.fc-title {
  font-size: 13px;
  font-weight: 700;
  color: #0F2057;
  margin-bottom: 4px;
  line-height: 1.3;
}
.fc-desc {
  font-size: 11.5px;
  color: #4B6A9E;
  line-height: 1.55;
}

/* ── Stats bar ─── */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(255,255,255,.85);
  border-radius: 14px;
  padding: 16px 20px;
  backdrop-filter: blur(16px);
  margin-bottom: 16px;
  animation: card-in .65s cubic-bezier(.22,1,.36,1) .45s both;
  box-shadow: 0 2px 12px rgba(37,99,235,.07);
}
.stat-item {
  flex: 1;
  text-align: center;
}
.stat-num {
  font-size: 20px;
  font-weight: 800;
  color: #0F2057;
  letter-spacing: -.5px;
  line-height: 1;
}
.stat-lbl {
  font-size: 11px;
  color: #5B80C0;
  margin-top: 4px;
  font-weight: 500;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(37,99,235,.15);
  flex-shrink: 0;
}

/* ══════════════════════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════════════════════ */
@media (max-width: 960px) {
  .lr-root { flex-direction: column; align-items: stretch; }
  .lr-left {
    max-width: 100%;
    padding: 32px 24px 28px;
    justify-content: flex-start;
  }
  .lr-right {
    min-height: 480px;
    padding: 40px 24px;
  }
  .vis-title { font-size: 30px; }
  .feat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
}

@media (max-width: 480px) {
  .lr-left { padding: 24px 16px 20px; }
  .lr-card-head, .lr-form { padding-left: 20px; padding-right: 20px; }
  .lr-demo { padding-left: 20px; padding-right: 20px; }
  .vis-title { font-size: 26px; letter-spacing: -.7px; }
  .feat-grid { grid-template-columns: 1fr; }
  .demo-chips { grid-template-columns: repeat(2, 1fr); }
  .stats-bar { gap: 0; padding: 12px 14px; }
  .stat-num { font-size: 17px; }
}
</style>
