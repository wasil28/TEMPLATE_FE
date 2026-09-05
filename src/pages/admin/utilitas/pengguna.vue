<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Manajemen Pengguna</h2>
        <p class="page-subtitle">Kelola akun internal dan akun berlingkup instansi beserta perannya</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ Tambah Pengguna</button>
    </div>

    <!-- Filter & Search -->
    <div class="flex gap-[10px] flex-wrap">
      <input v-model="search" class="form-control min-w-[220px]" placeholder="Cari nama / email..." @input="debouncedLoad" />
      <select v-model="filterRole" class="form-control" @change="() => loadData()">
        <option value="">Semua Role</option>
        <option v-for="r in roles" :key="r.kode" :value="r.kode">{{ r.nama }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-6 text-center text-[color:var(--text-muted)] text-[13px]">Memuat data...</div>
      <div v-else-if="rows.length === 0" class="p-10 text-center text-[color:var(--text-subtle)] text-[13px]">
        <div class="text-[36px] mb-2">👤</div>
        <p>Belum ada pengguna</p>
      </div>
      <table v-else class="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">#</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Nama</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Email</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Jabatan</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Instansi</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Role</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Status</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase tracking-[.05em]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="row.id" class="hover:bg-[color:var(--surface-2)]">
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ (meta.page - 1) * meta.limit + i + 1 }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ row.nama }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">{{ row.email }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">{{ row.jabatan ?? '—' }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">{{ row.instansi?.nama ?? '—' }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">
              <span
                v-for="ur in row.userRoles"
                :key="ur.role?.kode"
                class="inline-block px-[7px] py-[2px] rounded-full text-[11px] bg-brand-50 text-brand-700 font-medium mr-1"
              >{{ ur.role?.nama }}</span>
              <span v-if="!row.userRoles?.length" class="text-[color:var(--text-muted)]">—</span>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">
              <span :class="['badge', row.is_active ? 'badge-success' : 'badge-danger']">{{ row.is_active ? 'Aktif' : 'Nonaktif' }}</span>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm" @click="openEdit(row)" title="Edit">✏️</button>
                <button class="btn btn-ghost btn-sm" @click="openAssignRole(row)" title="Role">🛡️</button>
                <button class="btn btn-ghost btn-sm" @click="openResetPw(row)" title="Reset Password">🔑</button>
                <button class="btn btn-ghost btn-sm" @click="confirmDelete(row)" title="Hapus">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="meta.totalPages > 1" class="flex items-center gap-3 justify-center px-[14px] py-[14px] border-t border-[color:var(--border)] text-[13px] text-[color:var(--text-muted)]">
        <button :disabled="meta.page <= 1" @click="goPage(meta.page - 1)" class="px-3 py-[5px] border border-[color:var(--border)] rounded-sm bg-white cursor-pointer text-[14px] disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
        <span>Hal {{ meta.page }} / {{ meta.totalPages }} · Total {{ meta.total }}</span>
        <button :disabled="meta.page >= meta.totalPages" @click="goPage(meta.page + 1)" class="px-3 py-[5px] border border-[color:var(--border)] rounded-sm bg-white cursor-pointer text-[14px] disabled:opacity-40 disabled:cursor-not-allowed">›</button>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/35 z-[500] flex items-center justify-center p-5" @click.self="closeModal">
      <div class="bg-[color:var(--card)] rounded-lg w-full max-w-[480px] shadow-xl">
        <div class="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
          <h3 class="text-[15px] font-bold">{{ editId ? 'Edit Pengguna' : 'Tambah Pengguna' }}</h3>
          <button @click="closeModal" class="text-[18px] text-[color:var(--text-muted)] bg-none border-none cursor-pointer">✕</button>
        </div>
        <div class="px-5 py-4 flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Nama *</label>
            <input v-model="form.nama" class="form-control" placeholder="Nama lengkap" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Email *</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="email@contoh.id" :disabled="!!editId" />
          </div>
          <div class="flex flex-col gap-1" v-if="!editId">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Password *</label>
            <input v-model="form.password" type="password" class="form-control" placeholder="Min 6 karakter" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">NIP / NIK</label>
            <input v-model="form.identitas" class="form-control" placeholder="Opsional" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Jabatan</label>
            <input v-model="form.jabatan" class="form-control" placeholder="Opsional" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Instansi (lingkup)</label>
            <select v-model="form.instansi_id" class="form-control">
              <option :value="null">— Akun internal (tanpa lingkup) —</option>
              <option v-for="ins in instansiList" :key="ins.id" :value="ins.id">{{ ins.nama }}</option>
            </select>
            <span class="text-[11px] text-[color:var(--text-subtle)]">Terisi = akun berlingkup; di seluruh modul hanya melihat data instansi tersebut.</span>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Status</label>
            <select v-model="form.is_active" class="form-control">
              <option :value="true">Aktif</option>
              <option :value="false">Nonaktif</option>
            </select>
          </div>
          <p v-if="modalError" class="text-[12px] text-danger">{{ modalError }}</p>
        </div>
        <div class="flex justify-end gap-2 px-5 py-3 border-t border-[color:var(--border)]">
          <button @click="closeModal" class="btn btn-ghost">Batal</button>
          <button @click="submitForm" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Assign Role -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-black/35 z-[500] flex items-center justify-center p-5" @click.self="showRoleModal = false">
      <div class="bg-[color:var(--card)] rounded-lg w-full max-w-[480px] shadow-xl">
        <div class="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
          <h3 class="text-[15px] font-bold">Role — {{ selectedUser?.nama }}</h3>
          <button @click="showRoleModal = false" class="text-[18px] text-[color:var(--text-muted)] bg-none border-none cursor-pointer">✕</button>
        </div>
        <div class="px-5 py-4 flex flex-col gap-3">
          <p class="text-[color:var(--text-muted)] mb-2">Pilih role untuk pengguna ini:</p>
          <div
            v-for="r in roles"
            :key="r.id"
            class="px-2 py-2 rounded-sm hover:bg-[color:var(--surface)]"
          >
            <label class="flex items-center gap-2 cursor-pointer text-[13px]">
              <input type="checkbox" :value="r.id" v-model="selectedRoleIds" />
              {{ r.nama }} <span class="text-[color:var(--text-muted)]">({{ r.kode }})</span>
            </label>
          </div>
          <p v-if="modalError" class="text-[12px] text-danger">{{ modalError }}</p>
        </div>
        <div class="flex justify-end gap-2 px-5 py-3 border-t border-[color:var(--border)]">
          <button @click="showRoleModal = false" class="btn btn-ghost">Batal</button>
          <button @click="saveRoles" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Role' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Reset Password -->
    <div v-if="showPwModal" class="fixed inset-0 bg-black/35 z-[500] flex items-center justify-center p-5" @click.self="showPwModal = false">
      <div class="bg-[color:var(--card)] rounded-lg w-full max-w-[360px] shadow-xl">
        <div class="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
          <h3 class="text-[15px] font-bold">Reset Password — {{ selectedUser?.nama }}</h3>
          <button @click="showPwModal = false" class="text-[18px] text-[color:var(--text-muted)] bg-none border-none cursor-pointer">✕</button>
        </div>
        <div class="px-5 py-4 flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold text-[color:var(--text)]">Password Baru *</label>
            <input v-model="newPw" type="password" class="form-control" placeholder="Min 6 karakter" />
          </div>
          <p v-if="modalError" class="text-[12px] text-danger">{{ modalError }}</p>
        </div>
        <div class="flex justify-end gap-2 px-5 py-3 border-t border-[color:var(--border)]">
          <button @click="showPwModal = false" class="btn btn-ghost">Batal</button>
          <button @click="doResetPw" class="btn btn-primary" :disabled="saving">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: ['auth'], roles: ['admin'] })
import { userService } from '~/services/user.service'
import { roleService } from '~/services/role.service'
import { instansiService } from '~/services/instansi.service'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error.handler'

const toast = useToast()

// ─── State ─────────────────────────────────────────────────────────────────
const rows = ref<any[]>([])
const roles = ref<any[]>([])
const meta = ref({ page: 1, limit: 10, total: 0, totalPages: 1 })
const loading = ref(false)
const search = ref('')
const filterRole = ref('')

// Modal create/edit
const showModal = ref(false)
const editId = ref<number | null>(null)
const saving = ref(false)
const modalError = ref('')
const form = ref<any>({ nama: '', email: '', password: '', identitas: '', jabatan: '', instansi_id: null, is_active: true })
const instansiList = ref<any[]>([])

// Modal role
const showRoleModal = ref(false)
const selectedUser = ref<any>(null)
const selectedRoleIds = ref<number[]>([])

// Modal reset pw
const showPwModal = ref(false)
const newPw = ref('')

// ─── Load ───────────────────────────────────────────────────────────────────
async function loadData(page = 1) {
  loading.value = true
  try {
    const res = await userService.list({ page, limit: 10, search: search.value, role: filterRole.value || undefined })
    rows.value = res.data.items
    meta.value = res.data.meta
  } catch (e) {
    toast.error(getErrorMessage(e))
  } finally {
    loading.value = false }
}

async function loadRoles() {
  try { const res = await roleService.list(); roles.value = res.data } catch {}
}

async function loadInstansi() {
  try { const res = await instansiService.list(); instansiList.value = res.data } catch {}
}

let debounceTimer: any
function debouncedLoad() { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => loadData(), 300) }
function goPage(p: number) { loadData(p) }

// ─── Create / Edit ───────────────────────────────────────────────────────────
function openCreate() {
  editId.value = null
  form.value = { nama: '', email: '', password: '', identitas: '', jabatan: '', instansi_id: null, is_active: true }
  modalError.value = ''
  showModal.value = true
}

function openEdit(row: any) {
  editId.value = row.id
  form.value = { nama: row.nama, email: row.email, password: '', identitas: row.identitas ?? '', jabatan: row.jabatan ?? '', instansi_id: row.instansi_id ?? null, is_active: row.is_active }
  modalError.value = ''
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function submitForm() {
  if (!form.value.nama || !form.value.email) { modalError.value = 'Nama dan email wajib diisi'; return }
  if (!editId.value && form.value.password.length < 6) { modalError.value = 'Password minimal 6 karakter'; return }
  saving.value = true; modalError.value = ''
  try {
    const bersih = (o: any) => {
      const p = { ...o }
      if (!p.identitas) delete p.identitas
      if (!p.jabatan) delete p.jabatan
      if (p.instansi_id == null) delete p.instansi_id
      return p
    }
    if (editId.value) {
      const { password, ...payload } = bersih(form.value)
      await userService.update(editId.value, payload)
      toast.success('Data pengguna berhasil diperbarui')
    } else {
      await userService.create(bersih(form.value))
      toast.success('Pengguna berhasil ditambahkan')
    }
    closeModal(); loadData(meta.value.page)
  } catch (e) { modalError.value = getErrorMessage(e) } finally { saving.value = false }
}

async function confirmDelete(row: any) {
  const ok = await toast.confirm(`Hapus pengguna "${row.nama}"?`)
  if (!ok) return
  try { await userService.remove(row.id); toast.success('Pengguna dihapus'); loadData(meta.value.page) }
  catch (e) { toast.error(getErrorMessage(e)) }
}

// ─── Assign Role ──────────────────────────────────────────────────────────────
function openAssignRole(row: any) {
  selectedUser.value = row
  selectedRoleIds.value = row.userRoles?.map((ur: any) => ur.role_id) ?? []
  modalError.value = ''; showRoleModal.value = true
}

async function saveRoles() {
  saving.value = true; modalError.value = ''
  try {
    await userService.assignRoles(selectedUser.value.id, selectedRoleIds.value)
    toast.success('Role berhasil diperbarui'); showRoleModal.value = false; loadData(meta.value.page)
  } catch (e) { modalError.value = getErrorMessage(e) } finally { saving.value = false }
}

// ─── Reset Password ──────────────────────────────────────────────────────────
function openResetPw(row: any) { selectedUser.value = row; newPw.value = ''; modalError.value = ''; showPwModal.value = true }

async function doResetPw() {
  if (newPw.value.length < 6) { modalError.value = 'Minimal 6 karakter'; return }
  saving.value = true; modalError.value = ''
  try {
    await userService.resetPassword(selectedUser.value.id, newPw.value)
    toast.success('Password berhasil direset'); showPwModal.value = false
  } catch (e) { modalError.value = getErrorMessage(e) } finally { saving.value = false }
}

onMounted(() => { loadData(); loadRoles(); loadInstansi() })
</script>
