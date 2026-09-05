<template>
  <div class="flex flex-col gap-4">
    <div class="page-header">
      <div>
        <h2 class="page-title">Otorisasi Menu</h2>
        <p class="page-subtitle">Atur hak akses menu per role</p>
      </div>
      <button class="btn btn-primary" :disabled="!selectedRoleId || saving" @click="saveAll">
        {{ saving ? 'Menyimpan...' : '💾 Simpan Otorisasi' }}
      </button>
    </div>

    <!-- Pilih Role -->
    <div class="flex items-center gap-[10px]">
      <label class="text-[13px] font-semibold text-[color:var(--text)]">Pilih Role:</label>
      <select v-model="selectedRoleId" class="form-control" @change="loadPermissions">
        <option value="">— Pilih role —</option>
        <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.nama }} ({{ r.kode }})</option>
      </select>
    </div>

    <!-- Matrix -->
    <div class="card overflow-hidden" v-if="selectedRoleId">
      <div v-if="loading" class="p-10 text-center text-[13px] text-[color:var(--text-muted)]">Memuat otorisasi...</div>
      <div v-else-if="permItems.length===0" class="p-10 text-center text-[13px] text-[color:var(--text-muted)]">
        <div class="text-[32px] mb-2">🔒</div>
        <p>Belum ada menu tersedia</p>
      </div>
      <table v-else class="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Menu</th>
            <th class="px-[14px] py-[10px] text-left font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Route</th>
            <th class="px-[14px] py-[10px] text-center font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">View</th>
            <th class="px-[14px] py-[10px] text-center font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">New</th>
            <th class="px-[14px] py-[10px] text-center font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Edit</th>
            <th class="px-[14px] py-[10px] text-center font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Delete</th>
            <th class="px-[14px] py-[10px] text-center font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Approve</th>
            <th class="px-[14px] py-[10px] text-center font-semibold text-[color:var(--text-muted)] bg-[color:var(--surface)] border-b border-[color:var(--border)] text-[12px] uppercase">Download</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in permItems" :key="item.menu_id" class="hover:bg-[color:var(--surface-2)]">
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)]">{{ item.menu_nama }}</td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-[color:var(--text-muted)]">
              <code class="bg-[color:var(--surface)] px-[6px] py-[2px] rounded font-mono text-[11px]">{{ item.route_path }}</code>
            </td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-center"><input type="checkbox" v-model="item.allow_view" /></td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-center"><input type="checkbox" v-model="item.allow_new" /></td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-center"><input type="checkbox" v-model="item.allow_edit" /></td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-center"><input type="checkbox" v-model="item.allow_delete" /></td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-center"><input type="checkbox" v-model="item.allow_approve" /></td>
            <td class="px-[14px] py-[10px] border-b border-[color:var(--border)] text-center"><input type="checkbox" v-model="item.allow_download" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="card p-10 text-center text-[13px] text-[color:var(--text-muted)]">
      <div class="text-[32px] mb-2">👆</div>
      <p>Pilih role di atas untuk mengatur otorisasi menu</p>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: ['auth'], roles: ['admin'] })
import { roleService } from '~/services/role.service'
import { menuService } from '~/services/menu.service'
import { permissionService } from '~/services/permission.service'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error.handler'

const toast = useToast()
const roles = ref<any[]>([])
const allMenus = ref<any[]>([])
const selectedRoleId = ref<number|''>('')
const permItems = ref<any[]>([])
const loading = ref(false); const saving = ref(false)

async function loadRolesAndMenus() {
  try {
    const [rRes, mRes] = await Promise.all([roleService.list(), menuService.list()])
    roles.value = rRes.data; allMenus.value = mRes.data
  } catch(e) { toast.error(getErrorMessage(e)) }
}

async function loadPermissions() {
  if (!selectedRoleId.value) return
  loading.value=true
  try {
    const res = await permissionService.getByRole(selectedRoleId.value as number)
    const existing: Record<number,any> = {}
    for (const p of (res.data || [])) existing[p.menu_id]=p

    // Buat matrix dari semua menu
    permItems.value = allMenus.value.map((m:any) => ({
      menu_id: m.id,
      menu_nama: m.nama,
      route_path: m.route_path,
      allow_view:     existing[m.id]?.allow_view ?? false,
      allow_new:      existing[m.id]?.allow_new ?? false,
      allow_edit:     existing[m.id]?.allow_edit ?? false,
      allow_delete:   existing[m.id]?.allow_delete ?? false,
      allow_approve:  existing[m.id]?.allow_approve ?? false,
      allow_download: existing[m.id]?.allow_download ?? false,
    }))
  } catch(e) { toast.error(getErrorMessage(e)) } finally { loading.value=false }
}

async function saveAll() {
  if (!selectedRoleId.value) return
  saving.value=true
  try {
    const payload = permItems.value.map((p:any) => ({
      menu_id:p.menu_id, allow_view:p.allow_view, allow_new:p.allow_new,
      allow_edit:p.allow_edit, allow_delete:p.allow_delete,
      allow_approve:p.allow_approve, allow_download:p.allow_download,
    }))
    await permissionService.update(selectedRoleId.value as number, payload)
    toast.success('Otorisasi berhasil disimpan')
  } catch(e) { toast.error(getErrorMessage(e)) } finally { saving.value=false }
}

onMounted(loadRolesAndMenus)
</script>
