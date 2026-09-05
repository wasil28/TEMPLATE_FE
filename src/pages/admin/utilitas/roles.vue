<template>
  <div class="flex flex-col gap-4">
    <div class="page-header">
      <div>
        <h2 class="page-title">Manajemen Role</h2>
        <p class="page-subtitle">Kelola peran sistem — kode peran dipakai di @Roles() BE dan definePageMeta FE</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ Tambah Role</button>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-[13px] text-[color:var(--text-muted)]">Memuat...</div>
      <div v-else-if="rows.length === 0" class="p-8 text-center text-[13px] text-[color:var(--text-muted)]">
        <div class="text-[32px]">🛡️</div>
        <p>Belum ada role</p>
      </div>
      <table v-else class="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">#</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Kode</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Nama</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Deskripsi</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Status</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="r.id" class="hover:bg-[color:var(--surface-2)]">
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ i + 1 }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">
              <code class="bg-[color:var(--surface)] px-[6px] py-[2px] rounded font-mono text-[12px]">{{ r.kode }}</code>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ r.nama }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">{{ r.deskripsi ?? '—' }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">
              <span :class="['badge', r.is_active ? 'badge-success' : 'badge-danger']">{{ r.is_active ? 'Aktif' : 'Nonaktif' }}</span>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm" @click="openEdit(r)">✏️</button>
                <button class="btn btn-ghost btn-sm" @click="confirmDelete(r)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/35 z-[500] flex items-center justify-center p-5" @click.self="closeModal">
      <div class="bg-[color:var(--card)] rounded-lg w-full max-w-[420px] shadow-xl">
        <div class="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
          <h3 class="text-[15px] font-bold">{{ editId ? 'Edit Role' : 'Tambah Role' }}</h3>
          <button @click="closeModal" class="text-[18px] text-[color:var(--text-muted)] bg-none border-none cursor-pointer">✕</button>
        </div>
        <div class="px-5 py-4 flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Kode *</label>
            <input v-model="form.kode" class="form-control" placeholder="admin / staf / ..." :disabled="!!editId" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Nama *</label>
            <input v-model="form.nama" class="form-control" placeholder="Nama role" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Deskripsi</label>
            <textarea v-model="form.deskripsi" class="form-control" rows="2" placeholder="Opsional" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Status</label>
            <select v-model="form.is_active" class="form-control"><option :value="true">Aktif</option><option :value="false">Nonaktif</option></select>
          </div>
          <p v-if="modalError" class="text-[12px] text-danger">{{ modalError }}</p>
        </div>
        <div class="flex justify-end gap-2 px-5 py-3 border-t border-[color:var(--border)]">
          <button @click="closeModal" class="btn btn-ghost">Batal</button>
          <button @click="submitForm" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: ['auth'], roles: ['admin'] })
import { roleService } from '~/services/role.service'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error.handler'

const toast = useToast()
const rows = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false)
const editId = ref<number|null>(null)
const saving = ref(false)
const modalError = ref('')
const form = ref({ kode:'', nama:'', deskripsi:'', is_active:true })

async function loadData() {
  loading.value = true
  try { const res = await roleService.list(); rows.value = res.data }
  catch(e) { toast.error(getErrorMessage(e)) } finally { loading.value = false }
}

function openCreate() { editId.value=null; form.value={kode:'',nama:'',deskripsi:'',is_active:true}; modalError.value=''; showModal.value=true }
function openEdit(r: any) { editId.value=r.id; form.value={kode:r.kode,nama:r.nama,deskripsi:r.deskripsi??'',is_active:r.is_active}; modalError.value=''; showModal.value=true }
function closeModal() { showModal.value=false }

async function submitForm() {
  if (!form.value.kode||!form.value.nama) { modalError.value='Kode dan nama wajib diisi'; return }
  saving.value=true; modalError.value=''
  try {
    if (editId.value) { await roleService.update(editId.value, form.value); toast.success('Role diperbarui') }
    else { await roleService.create(form.value); toast.success('Role ditambahkan') }
    closeModal(); loadData()
  } catch(e) { modalError.value=getErrorMessage(e) } finally { saving.value=false }
}

async function confirmDelete(r: any) {
  const ok = await toast.confirm(`Hapus role "${r.nama}"?`)
  if (!ok) return
  try { await roleService.remove(r.id); toast.success('Role dihapus'); loadData() }
  catch(e) { toast.error(getErrorMessage(e)) }
}

onMounted(loadData)
</script>
