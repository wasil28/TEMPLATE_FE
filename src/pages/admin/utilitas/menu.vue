<template>
  <div class="flex flex-col gap-4">
    <div class="page-header">
      <div>
        <h2 class="page-title">Manajemen Menu</h2>
        <p class="page-subtitle">Struktur menu navigasi per role</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ Tambah Menu</button>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-[13px] text-[color:var(--text-muted)]">Memuat...</div>
      <div v-else-if="rows.length===0" class="p-8 text-center text-[13px] text-[color:var(--text-muted)]">
        <div class="text-[32px]">📋</div>
        <p>Belum ada menu</p>
      </div>
      <table v-else class="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">#</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Nama</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Ikon</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Route Path</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Urutan</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Status</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r,i) in rows" :key="r.id" class="hover:bg-[color:var(--surface-2)]">
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ i+1 }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ r.nama }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">
              <code class="bg-[color:var(--surface)] px-[6px] py-[2px] rounded font-mono text-[11px]">{{ r.ikon ?? '—' }}</code>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">
              <code class="bg-[color:var(--surface)] px-[6px] py-[2px] rounded font-mono text-[11px]">{{ r.route_path ?? '—' }}</code>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ r.urutan }}</td>
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
          <h3 class="text-[15px] font-bold">{{ editId ? 'Edit Menu' : 'Tambah Menu' }}</h3>
          <button @click="closeModal" class="text-[18px] text-[color:var(--text-muted)] bg-none border-none cursor-pointer">✕</button>
        </div>
        <div class="px-5 py-4 flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Nama *</label>
            <input v-model="form.nama" class="form-control" placeholder="Dashboard" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Route Path</label>
            <input v-model="form.route_path" class="form-control" placeholder="/staf/catatan" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Ikon (Lucide)</label>
            <input v-model="form.ikon" class="form-control" placeholder="layout-dashboard" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Urutan</label>
            <input v-model.number="form.urutan" type="number" class="form-control" placeholder="0" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[12px] font-semibold">Status Rilis</label>
            <select v-model="form.is_active" class="form-control"><option :value="true">Aktif (tampil di sidebar)</option><option :value="false">Nonaktif (sembunyikan — belum rilis)</option></select>
            <span class="text-[11px] text-text-muted">Menu Nonaktif disembunyikan dari sidebar semua pengguna.</span>
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
import { menuService } from '~/services/menu.service'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error.handler'

const toast = useToast()
const rows = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false); const editId = ref<number|null>(null)
const saving = ref(false); const modalError = ref('')
const form = ref({ nama:'', route_path:'', ikon:'', urutan:0, is_active:true })

async function loadData() {
  loading.value=true
  try { const res=await menuService.list(); rows.value=res.data }
  catch(e) { toast.error(getErrorMessage(e)) } finally { loading.value=false }
}

function openCreate() { editId.value=null; form.value={nama:'',route_path:'',ikon:'',urutan:0,is_active:true}; modalError.value=''; showModal.value=true }
function openEdit(r:any) { editId.value=r.id; form.value={nama:r.nama,route_path:r.route_path??'',ikon:r.ikon??'',urutan:r.urutan,is_active:r.is_active}; modalError.value=''; showModal.value=true }
function closeModal() { showModal.value=false }

async function submitForm() {
  if (!form.value.nama) { modalError.value='Nama wajib diisi'; return }
  saving.value=true; modalError.value=''
  try {
    if (editId.value) { await menuService.update(editId.value, form.value); toast.success('Menu diperbarui') }
    else { await menuService.create(form.value); toast.success('Menu ditambahkan') }
    closeModal(); loadData()
  } catch(e) { modalError.value=getErrorMessage(e) } finally { saving.value=false }
}

async function confirmDelete(r:any) {
  const ok=await toast.confirm(`Hapus menu "${r.nama}"?`)
  if (!ok) return
  try { await menuService.remove(r.id); toast.success('Menu dihapus'); loadData() }
  catch(e) { toast.error(getErrorMessage(e)) }
}

onMounted(loadData)
</script>
