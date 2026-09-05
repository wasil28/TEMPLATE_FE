<template>
  <div class="flex flex-col gap-4 max-w-[620px]">
    <div class="page-header">
      <div>
        <h2 class="page-title">Profil Saya</h2>
        <p class="page-subtitle">Data akun dan penggantian kata sandi</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Data akun</span></div>
      <div class="card-body flex flex-col gap-3">
        <div class="grid grid-cols-[130px_1fr] gap-y-2 text-[13px]">
          <span class="text-[color:var(--text-muted)]">Nama</span><span class="font-semibold">{{ p.nama ?? '—' }}</span>
          <span class="text-[color:var(--text-muted)]">Email</span><span>{{ p.email ?? '—' }}</span>
          <span class="text-[color:var(--text-muted)]">Jabatan</span><span>{{ p.jabatan ?? '—' }}</span>
          <span class="text-[color:var(--text-muted)]">NIP / NIK</span><span>{{ p.identitas ?? '—' }}</span>
          <template v-if="p.instansi_nama">
            <span class="text-[color:var(--text-muted)]">Instansi</span><span>{{ p.instansi_nama }}</span>
          </template>
        </div>

        <hr class="border-0 border-t border-[color:var(--hairline)] my-1" />

        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-semibold">Telepon</label>
          <input v-model="telepon" class="form-control" placeholder="Opsional" />
        </div>
        <div>
          <button class="btn btn-primary" :disabled="saving" @click="simpanProfil">
            {{ saving ? 'Menyimpan…' : 'Simpan perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Ganti kata sandi</span></div>
      <div class="card-body flex flex-col gap-3">
        <p class="text-[12.5px] text-[color:var(--text-muted)] leading-relaxed">
          Mengganti kata sandi mengakhiri seluruh sesi Anda di perangkat lain —
          termasuk sesi ini, jadi Anda akan diminta masuk kembali.
        </p>
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-semibold">Kata sandi saat ini</label>
          <input v-model="lama" type="password" class="form-control" autocomplete="current-password" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-semibold">Kata sandi baru</label>
          <input v-model="baru" type="password" class="form-control" autocomplete="new-password" placeholder="Minimal 8 karakter" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-semibold">Ulangi kata sandi baru</label>
          <input v-model="ulang" type="password" class="form-control" autocomplete="new-password" />
        </div>
        <p v-if="galat" class="text-[12px] text-danger">{{ galat }}</p>
        <div>
          <button class="btn btn-primary" :disabled="gantiing" @click="gantiSandi">
            {{ gantiing ? 'Memproses…' : 'Ganti kata sandi' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
import { authService } from '~/services/auth.service'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error.handler'
import { useAuthStore } from '~/stores/auth'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const p = ref<any>({})
const telepon = ref('')
const saving = ref(false)

const lama = ref(''); const baru = ref(''); const ulang = ref('')
const gantiing = ref(false); const galat = ref('')

onMounted(async () => {
  try {
    p.value = (await authService.getProfile()).data
    telepon.value = p.value.telepon ?? ''
  } catch (e) { toast.error(getErrorMessage(e)) }
})

async function simpanProfil() {
  saving.value = true
  try {
    p.value = (await authService.updateProfile({ telepon: telepon.value })).data
    toast.success('Profil diperbarui')
  } catch (e) { toast.error(getErrorMessage(e)) } finally { saving.value = false }
}

async function gantiSandi() {
  galat.value = ''
  if (baru.value.length < 8) { galat.value = 'Kata sandi baru minimal 8 karakter'; return }
  if (baru.value !== ulang.value) { galat.value = 'Ulangan kata sandi tidak cocok'; return }
  if (baru.value === lama.value) { galat.value = 'Kata sandi baru harus berbeda dari yang sekarang'; return }

  gantiing.value = true
  try {
    await authService.gantiSandi(lama.value, baru.value)
    toast.success('Kata sandi diganti. Silakan masuk kembali.')
    authStore.clearSession()
    router.push('/login')
  } catch (e) { galat.value = getErrorMessage(e) } finally { gantiing.value = false }
}
</script>
