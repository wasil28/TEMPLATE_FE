<template>
  <div class="flex flex-col gap-4">
    <!-- Kepala halaman: eyebrow → judul + chip angka → subjudul; aksi di kanan -->
    <div class="page-header">
      <div>
        <p class="page-eyebrow">Modul contoh</p>
        <div class="page-title-row">
          <h2 class="page-title">Catatan</h2>
          <span class="badge badge-brand">{{ meta.total ?? 0 }} catatan</span>
        </div>
        <p class="page-subtitle">
          Layar contoh yang memakai seluruh pola baku: penyaring status, pencarian,
          paginasi, modal formulir, perpindahan status, dan pagar peran.
          <template v-if="berlingkup"> Anda melihat catatan instansi Anda saja.</template>
        </p>
      </div>
      <button v-if="bolehBuat" class="btn btn-primary" :disabled="sibuk" @click="bukaForm()">
        <Plus :size="15" /> Catatan baru
      </button>
    </div>

    <!-- Penyaring status: angkanya dari `ringkasan` BE, tidak dihitung di layar -->
    <div class="flex flex-wrap items-center gap-2">
      <button class="filter-chip" :class="{ 'filter-chip--active': !status }" @click="pilih('')">
        Semua <span class="count-chip">{{ jumlahSemua }}</span>
      </button>
      <button
        v-for="(l, k) in LABEL_STATUS" :key="k"
        class="filter-chip" :class="{ 'filter-chip--active': status === k }" @click="pilih(k)"
      >
        {{ l.t }} <span class="count-chip">{{ ringkasan[k] ?? 0 }}</span>
      </button>
      <input
        v-model="cari" class="form-control max-w-[280px] ml-auto"
        placeholder="Cari kode atau judul…" @keyup.enter="muat(1)"
      />
    </div>

    <div v-if="loading" class="card p-8 text-center text-[13px] text-[color:var(--text-muted)]">Memuat…</div>

    <p v-else-if="!rows.length" class="card p-10 text-center text-[13px] text-[color:var(--text-subtle)]">
      Tidak ada catatan yang cocok.
    </p>

    <div v-else class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width:120px">Kode</th>
            <th>Judul</th>
            <th>Instansi</th>
            <th class="col-num">Tenggat</th>
            <th class="col-num">Usia</th>
            <th style="width:110px">Status</th>
            <th style="width:210px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in rows" :key="c.id" :class="c.terlambat ? 'row--alert' : ''">
            <td><span class="chip-data">{{ c.kode }}</span></td>
            <td class="wrap">
              <span class="col-name">{{ c.judul }}</span>
              <span v-if="c.isi" class="cell-sub">{{ c.isi.slice(0, 80) }}{{ c.isi.length > 80 ? '…' : '' }}</span>
            </td>
            <td>{{ c.instansi?.nama ?? 'Internal' }}</td>
            <td class="col-num">
              <span :class="c.terlambat ? 'text-[color:var(--danger)] font-bold' : ''">{{ tglSingkat(c.tenggat) }}</span>
              <span class="cell-sub">{{ ucapTenggat(c.sisa_hari, c.terlambat) }}</span>
            </td>
            <td class="col-num">{{ c.umur_hari ? `${c.umur_hari} hr` : '—' }}</td>
            <td>
              <span class="badge-status" :class="`badge-status--${LABEL_STATUS[c.status]?.c}`">
                {{ LABEL_STATUS[c.status]?.t ?? c.status }}
              </span>
            </td>
            <td>
              <!-- Tombol mengikuti `pindah_boleh` dari BE — layar tidak menebak transisi -->
              <div class="flex gap-1 justify-end">
                <button v-if="c.dapat_diubah && bolehUbah" class="btn btn-secondary btn-sm" @click="bukaForm(c)">Sunting</button>
                <button v-if="c.pindah_boleh.includes('terbit')" class="btn btn-primary btn-sm" :disabled="sibuk" @click="pindah(c, 'terbitkan')">Terbitkan</button>
                <button v-if="c.pindah_boleh.includes('diarsipkan')" class="btn btn-ghost btn-sm" :disabled="sibuk" @click="pindah(c, 'arsipkan')">Arsipkan</button>
                <button v-if="c.pindah_boleh.includes('draf')" class="btn btn-ghost btn-sm" :disabled="sibuk" @click="pindah(c, 'kembalikan')">Ke draf</button>
                <button v-if="bolehHapus" class="icon-action" title="Hapus" :disabled="sibuk" @click="hapus(c)"><Trash2 :size="15" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginasi: meta dari BE (paginatedResponse) -->
    <div v-if="meta.totalPages > 1" class="pagination-bar">
      <span class="pagination-info">Hal. {{ meta.page }} dari {{ meta.totalPages }} · {{ meta.total }} catatan</span>
      <div class="flex gap-1">
        <button class="btn btn-secondary btn-sm" :disabled="meta.page <= 1" @click="muat(meta.page - 1)">‹ Sebelumnya</button>
        <button class="btn btn-secondary btn-sm" :disabled="meta.page >= meta.totalPages" @click="muat(meta.page + 1)">Berikutnya ›</button>
      </div>
    </div>

    <!-- Modal formulir: satu komponen untuk buat & sunting -->
    <div v-if="form" class="modal-overlay" @click.self="form = null">
      <div class="modal-box">
        <div class="modal-header">
          <span class="modal-title">{{ form.id ? `Sunting ${form.kode}` : 'Catatan baru' }}</span>
          <button class="modal-close" aria-label="Tutup" @click="form = null"><X :size="18" /></button>
        </div>
        <div class="modal-body flex flex-col gap-3">
          <div class="field">
            <label class="field-label">Judul *</label>
            <input v-model="form.judul" class="form-control" placeholder="Satu kalimat yang menjelaskan catatannya" />
          </div>
          <div class="field">
            <label class="field-label">Isi</label>
            <textarea v-model="form.isi" class="form-control" rows="4" />
          </div>
          <div class="form-row">
            <div class="field">
              <label class="field-label">Tenggat</label>
              <input v-model="form.tenggat" type="date" class="form-control" />
            </div>
            <!-- Akun berlingkup tidak memilih instansi — BE mengabaikannya pun -->
            <div v-if="!berlingkup" class="field">
              <label class="field-label">Instansi</label>
              <select v-model="form.instansi_id" class="form-control">
                <option :value="null">Internal</option>
                <option v-for="i in instansi" :key="i.id" :value="i.id">{{ i.nama }}</option>
              </select>
            </div>
          </div>
          <p v-if="galatForm" class="field-error-msg">{{ galatForm }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="form = null">Batal</button>
          <button class="btn btn-primary" :disabled="sibuk" @click="simpan">{{ sibuk ? 'Menyimpan…' : 'Simpan' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Trash2, X } from 'lucide-vue-next'
import { catatanService } from '~/services/catatan.service'
import { instansiService } from '~/services/instansi.service'
import { useToast } from '~/composables/useToast'
import { usePeran } from '~/composables/usePeran'
import { useAuthStore } from '~/stores/auth'
import { LABEL_STATUS, tglSingkat, ucapTenggat } from '~/composables/useCatatan'
import { getErrorMessage } from '~/utils/error.handler'

/* ── MODUL CONTOH: komponen ────────────────────────────────────────────
   Urutan baku <script setup>:
     1. impor
     2. store/composable (toast, peran, auth)
     3. state (ref)
     4. computed (turunan tampilan, pagar tombol)
     5. fungsi muat data
     6. fungsi aksi (buat/ubah/pindah/hapus)
     7. onMounted
   Pagar tombol memakai `usePeran()` + `authStore.can(route, aksi)` —
   TIDAK PERNAH `auth.user?.roles`. */

const toast = useToast()
const auth = useAuthStore()
const { punya, berlingkup } = usePeran()
const route = useRoute()

const rows = ref<any[]>([])
const meta = ref<any>({ page: 1, totalPages: 1, total: 0 })
const ringkasan = ref<Record<string, number>>({})
const instansi = ref<any[]>([])
const loading = ref(true)
const sibuk = ref(false)
const status = ref('')
const cari = ref('')
const form = ref<any>(null)
const galatForm = ref('')

const jumlahSemua = computed(() => Object.values(ringkasan.value).reduce((a, b) => a + b, 0))

/* Dua lapis pagar tampilan: peran (siapa) dan bendera otorisasi menu
   (aksi apa di halaman ini). Keduanya hanya menyembunyikan tombol — BE
   tetap menolak yang tidak berhak. */
const bolehBuat  = computed(() => punya('admin', 'staf') && auth.can(route.path, 'new'))
const bolehUbah  = computed(() => punya('admin', 'staf') && auth.can(route.path, 'edit'))
const bolehHapus = computed(() => punya('admin') && auth.can(route.path, 'delete'))

function pilih(s: string) { status.value = s; muat(1) }

async function muat(page = 1) {
  loading.value = true
  try {
    const r = await catatanService.list({
      page, limit: 10,
      ...(status.value ? { status: status.value } : {}),
      ...(cari.value.trim() ? { search: cari.value.trim() } : {}),
    })
    rows.value = r.data.items
    meta.value = r.data.meta
    ringkasan.value = r.data.ringkasan
  } catch (e) {
    toast.error(getErrorMessage(e))
  } finally {
    loading.value = false
  }
}

function bukaForm(c?: any) {
  galatForm.value = ''
  form.value = c
    ? { id: c.id, kode: c.kode, judul: c.judul, isi: c.isi ?? '', tenggat: c.tenggat ?? '', instansi_id: c.instansi_id ?? null }
    : { judul: '', isi: '', tenggat: '', instansi_id: null }
}

async function simpan() {
  if (!form.value.judul?.trim() || form.value.judul.trim().length < 3) {
    galatForm.value = 'Judul minimal 3 karakter'; return
  }
  sibuk.value = true
  try {
    const payload = {
      judul: form.value.judul.trim(),
      isi: form.value.isi?.trim() || undefined,
      tenggat: form.value.tenggat || undefined,
      instansi_id: form.value.instansi_id ?? undefined,
    }
    const r = form.value.id
      ? await catatanService.update(form.value.id, payload)
      : await catatanService.create(payload)
    toast.success(r.message)
    form.value = null
    await muat(meta.value.page)
  } catch (e) {
    galatForm.value = getErrorMessage(e)
  } finally {
    sibuk.value = false
  }
}

async function pindah(c: any, aksi: 'terbitkan' | 'arsipkan' | 'kembalikan') {
  sibuk.value = true
  try {
    const r = await catatanService[aksi](c.id)
    toast.success(r.message)
    await muat(meta.value.page)
  } catch (e) {
    toast.error(getErrorMessage(e))
  } finally {
    sibuk.value = false
  }
}

async function hapus(c: any) {
  if (!(await toast.confirm(`Hapus catatan ${c.kode}?`))) return
  sibuk.value = true
  try {
    const r = await catatanService.remove(c.id)
    toast.success(r.message)
    await muat(1)
  } catch (e) {
    toast.error(getErrorMessage(e))
  } finally {
    sibuk.value = false
  }
}

onMounted(async () => {
  await muat(1)
  // Daftar instansi hanya untuk pilihan di formulir; kegagalannya tidak menghentikan layar.
  if (!berlingkup.value) {
    try { instansi.value = (await instansiService.list()).data } catch { /* abaikan */ }
  }
})
</script>
