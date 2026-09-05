# Panduan Frontend — Standar Penulisan Kode

Standar tim untuk semua proyek Nuxt yang lahir dari template ini. Layar contoh
**`components/catatan/DaftarCatatan.vue`** mempraktikkan seluruh pola di bawah —
baca berkas itu dulu.

---

## 1. Arsitektur

### 1.1 Alur data

```
pages/<peran>/<halaman>.vue        ← tipis: definePageMeta + satu komponen
  └─ components/<modul>/<Layar>.vue  ← state, tampilan, aksi
       ├─ services/<modul>.service.ts   ← SATU-SATUNYA yang memanggil axios
       │    └─ composables/useApi.ts     ← instance axios, cookie, 401 → /login
       ├─ composables/use<Modul>.ts     ← label, warna, pembantu format
       ├─ composables/usePeran.ts       ← peran aktif (JANGAN auth.user.roles)
       └─ stores/auth.ts                ← sesi, activeRole, menu, can()
```

Yang **tidak** ada di FE: aturan bisnis. Kalau sebuah tombol boleh/tidak boleh ditekan,
BE yang memutuskan (`pindah_boleh`, `dapat_diubah`) dan FE hanya membaca. Layar yang
menebak aturan akan berselisih dengan BE begitu aturannya berubah.

### 1.2 Struktur folder (`src/`)

```
src/
├── App.vue
├── assets/css/
│   ├── tokens.css        # variabel desain: warna, font, radius, bayangan — SATU sumber
│   ├── tailwind.css      # lapisan komponen: .btn .card .table .modal .badge .page-header …
│   └── <modul>.css       # gaya khusus modul, didaftarkan di nuxt.config.ts
├── components/
│   ├── layout/           # AppTopbar, AppSidebar (MENU_GROUPS)
│   ├── shared/           # dipakai lintas modul (RingkasanSambutan, …)
│   └── <modul>/          # Daftar<Modul>.vue, Modal<Modul>.vue, …
├── composables/          # useApi, useToast, usePeran, use<Modul>
├── layouts/              # default (shell), auth (login), blank
├── middleware/auth.ts    # sesi + roles dari definePageMeta → /403
├── pages/
│   ├── login.vue  lupa-password.vue  reset-sandi.vue  403.vue  index.vue
│   ├── [...slug].vue     # jaring: route di menu tapi page belum dibuat
│   ├── admin/…           # utilitas, profil, ringkasan, catatan
│   └── staf/…            # ringkasan, catatan
├── services/             # <modul>.service.ts — bentuk URL, tanpa logika
├── stores/               # auth.ts (ROLE_COLORS, ROLE_DASHBOARD), layout.ts
└── utils/                # error.handler.ts, icons.ts
```

---

## 2. Standar penamaan

| Jenis | Pola | Contoh |
|---|---|---|
| Page | `pages/<peran>/<kebab>.vue` | `pages/staf/catatan.vue` |
| Komponen | `PascalCase`, kata benda: `Daftar<X>`, `Modal<X>`, `Kartu<X>`, `Wizard<X>` | `DaftarCatatan.vue`, `ModalKasus.vue` |
| Folder komponen | `kebab-case` = nama modul BE | `components/catatan/` |
| Service | `<modul>.service.ts`, ekspor `<modul>Service` | `catatanService` |
| Composable | `use<Modul>.ts`, ekspor konstanta `LABEL_*` & fungsi | `useCatatan.ts` → `LABEL_STATUS`, `tglSingkat` |
| Variabel/fungsi | `camelCase`, Bahasa Indonesia, kata kerja untuk aksi | `muat()`, `simpan()`, `pindah()`, `bolehBuat` |
| Konstanta | `UPPER_SNAKE` | `LABEL_STATUS`, `MENU_GROUPS` |
| Ref boolean | sifat/keadaan | `loading`, `sibuk`, `berlingkup`, `bolehHapus` |
| Kelas CSS | `kebab-case`, BEM longgar `blok__bagian--varian` | `.stat-card__val`, `.badge-status--danger` |
| Route | `/<peran>/<halaman>` — **sama persis** dengan `route_path` di seeder menu BE | `/staf/catatan` |

Istilah teknis (`ref`, `computed`, `props`, `emit`, `payload`) tetap Inggris. Selebihnya
Indonesia, tanpa campur dalam satu nama.

---

## 3. Bentuk baku tiap berkas

### 3.1 Page — selalu tipis

```vue
<template><DaftarCatatan /></template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'], roles: ['staf'] })
import DaftarCatatan from '~/components/catatan/DaftarCatatan.vue'
</script>
```

- **Satu komponen, dua peran = dua page tipis** (`staf/catatan.vue`, `admin/catatan.vue`) memakai komponen yang sama. Komponen yang membaca `usePeran()` menyesuaikan diri.
- `roles` di `definePageMeta` adalah pagar navigasi (→ `/403`). Pagar sesungguhnya tetap BE.
- Halaman publik: `definePageMeta({ layout: 'auth', requiresAuth: false })`.

### 3.2 Komponen layar

Urutan `<template>`: `page-header` → catatan/peringatan (`.note`) → penyaring → isi (tabel/kartu) → paginasi → modal.

Urutan `<script setup>`:

```ts
// 1. impor (vue, ikon, service, composable, util)
// 2. store & composable: toast, auth, usePeran, route
// 3. state: ref
// 4. computed: turunan tampilan, pagar tombol (bolehX)
// 5. muat()  — satu fungsi pemuat, dipanggil ulang setelah tiap aksi
// 6. aksi   — bukaForm(), simpan(), pindah(), hapus()
// 7. onMounted
```

Pola yang wajib:

- **Pagar tombol dua lapis**: `punya('admin','staf')` (siapa) **dan** `auth.can(route.path, 'new')` (aksi apa di halaman ini). Keduanya hanya menyembunyikan; BE tetap menolak.
- **Tombol transisi mengikuti BE**: `v-if="c.pindah_boleh.includes('terbit')"`. Jangan menulis ulang tabel transisi di layar.
- **Angka penyaring dari BE** (`ringkasan`), bukan `rows.filter(...).length` — daftar berpaginasi tidak memuat semuanya.
- **Tiap aksi**: `sibuk = true` → panggil service → `toast.success(r.message)` (pesan dari BE) → `muat()` → `finally sibuk = false`. Galat: `toast.error(getErrorMessage(e))` atau tampilkan di modal.
- **Konfirmasi** untuk aksi yang tidak bisa dibatalkan: `await toast.confirm('...')` atau `Swal.fire` dengan `input` bila butuh alasan.
- Pencarian dikirim ke BE (`search`), bukan disaring di layar, kecuali daftar sudah lengkap di memori.
- Props/emit diketik: `defineProps<{ id: number }>()`, `defineEmits<{ tutup: []; berubah: [] }>()`.

### 3.3 Service

```ts
import api from '~/composables/useApi'
export const catatanService = {
  list:   (params?: Record<string, any>) => api.get('/api/v1/catatan', { params }).then((r) => r.data),
  detail: (id: number) => api.get(`/api/v1/catatan/${id}`).then((r) => r.data),
  create: (payload: Record<string, any>) => api.post('/api/v1/catatan', payload).then((r) => r.data),
  terbitkan: (id: number) => api.patch(`/api/v1/catatan/${id}/terbitkan`).then((r) => r.data),
}
```

- Awalan `/api/v1/…` ditulis penuh — proxy Vite meneruskannya saat dev, `NUXT_PUBLIC_API_BASE` saat build.
- Unggah berkas: `FormData` + `headers: { 'Content-Type': 'multipart/form-data' }`.
- Unduh: `responseType: 'blob'`.
- **Komponen tidak pernah memanggil `api` langsung.**

### 3.4 Composable modul

Label status (`{ t, c }` — teks & kelas badge), peta unit, pembantu format tanggal/rupiah/tenggat. Tanpa API, tanpa state global.

```ts
export const LABEL_STATUS: Record<string, { t: string; c: string }> = {
  draf:   { t: 'Draf',   c: 'warning' },
  terbit: { t: 'Terbit', c: 'aktif'   },
}
```

Kelas badge yang tersedia: `badge-status--aktif | --nonaktif | --warning | --danger | --info`.

### 3.5 CSS

- **Token dulu**: warna, jarak, radius, bayangan dari `tokens.css` (`var(--brand-600)`, `var(--ink-2)`). Jangan hardcode heksadesimal di komponen.
- **Kelas komponen dulu**: `.btn .btn-primary .btn-sm`, `.card`, `.table` + `.table-wrap`, `.badge-status--*`, `.page-header`, `.modal-overlay/.modal-box/.modal-header/.modal-body/.modal-footer`, `.field/.field-label/.form-control`, `.filter-chip`, `.count-chip`, `.kotak-hitung`, `.stat-grid/.stat-card`, `.note--*`, `.dl-tight`, `.empty-state`, `.pagination-bar`. Lihat daftar lengkap di `tailwind.css`.
- **Sel tabel dua baris**: `<td class="wrap"><span class="col-name">Judul</span><span class="cell-sub">keterangan</span></td>` — `wrap` mengizinkan turun baris, `row--alert` pada `<tr>` menandai baris yang perlu perhatian.
- Kelas utilitas Tailwind untuk tata letak kecil (`flex gap-2`, `max-w-[280px]`).
- Gaya khusus modul → `assets/css/<modul>.css`, didaftarkan di `nuxt.config.ts`. **Tidak ditumpuk** ke `tailwind.css`.
- Jangan menulis `<style scoped>` untuk hal yang sudah ada kelasnya.
- **Kelas yang dirangkai dinamis** (`` :class="`badge-status--${x.c}`" ``) tidak terlihat pemindai Tailwind dan **dibuang saat build** bila tidak ada yang menulisnya literal — gejalanya sunyi: badge jadi transparan. Keluarga kelas ber-varian yang dipakai dinamis harus masuk `safelist` di `tailwind.config.js` (sudah ada untuk `badge-status--*`, `badge-*`, `icon-box-*`, `quick-card--*`, `timeline-dot--*`). Kelas di luar `@layer` (plain CSS) tidak terkena.

---

## 4. Alur menambah halaman / modul baru

Contoh: layar `Pengajuan` untuk peran `staf`. **Separuh langkahnya ada di BE** — sidebar dan
hak akses dibaca dari basis data, bukan dari kode FE.

| # | Sisi | Langkah | Berkas |
|---|---|---|---|
| 1 | BE | Modul & endpoint-nya sudah ada (lihat panduan BE) | |
| 2 | BE | Daftarkan menu: `{ nama, ikon, route_path: '/staf/pengajuan', urutan }` | `seeders/03_menus.seeder.ts` |
| 3 | BE | Beri otorisasi + bendera aksi | `seeders/05_otorisasi_menu.seeder.ts` |
| 4 | BE | `yarn seed` (idempoten — hanya menambah yang belum ada) | |
| 5 | FE | Ikon baru? tambahkan ke peta | `utils/icons.ts` |
| 6 | FE | Masukkan route ke grup sidebar peran | `components/layout/AppSidebar.vue` → `MENU_GROUPS` |
| 7 | FE | Service | `services/pengajuan.service.ts` |
| 8 | FE | Composable label/format | `composables/usePengajuan.ts` |
| 9 | FE | Komponen layar — salin `DaftarCatatan.vue`, ganti nama | `components/pengajuan/DaftarPengajuan.vue` |
| 10 | FE | Page tipis per peran | `pages/staf/pengajuan.vue` (+ `pages/admin/pengajuan.vue` bila perlu) |
| 11 | FE | `yarn typecheck`, lalu **buka dengan tiap peran** — termasuk setelah refresh halaman (pagar peran harus tetap tampil) | |

Peran baru? Selain seeder BE (`01_roles`), sentuh `stores/auth.ts` (`ROLE_COLORS`, `ROLE_DASHBOARD`)
dan `AppSidebar.vue` (`MENU_GROUPS`), lalu buat `pages/<peran>/ringkasan.vue`.

Route yang sudah di menu tetapi page-nya belum ada jatuh ke `pages/[...slug].vue`
("dalam pengembangan") — jadi menu boleh disemai lebih dulu.

---

## 5. Aturan lintas modul

**Sesi & peran**
- Peran **hanya** lewat `usePeran()` (`kode`, `peran`, `punya()`, `isAdmin`, `berlingkup`). `auth.user?.roles` **tidak ada** setelah refresh — tombol akan lenyap diam-diam.
- Token di cookie httpOnly; `localStorage` hanya data tampilan (`app_user`, `app_active_role`, `app_menus`, flag `app_session`).
- `restoreSession()` hanya mengisi store yang **kosong**. Ia dipanggil middleware pada setiap pindah halaman; bila menimpa, `user` lengkap dari `/auth/me` diganti salinan localStorage yang lebih tipis dan kolom seperti `instansi_id` lenyap diam-diam setelah navigasi pertama. Jangan "menyederhanakan" penjaga `!user.value` itu.
- 401 dari API → `useApi` membersihkan sesi dan mengalihkan ke `/login`. Komponen tidak perlu menanganinya.

**Tampilan**
- Pesan toast memakai `r.message` dari BE. FE tidak mengarang kalimat sukses.
- Keadaan kosong pakai `.empty-state` atau `card p-10 text-center`; pemuatan pakai teks `Memuat…`, bukan spinner buatan sendiri.
- Tanggal: `toLocaleDateString('id-ID', …)`; angka: `toLocaleString('id-ID')`.
- Nilai kosong ditampilkan `—`, bukan `null`/`undefined`/`0` yang menyesatkan.

**Modal**
- Overlay `@click.self="tutup"`, tombol tutup di header, aksi utama di footer kanan.
- Formulir satu modal untuk buat & sunting (`form.id` menentukan mode).
- Galat validasi BE ditampilkan **di dalam modal** (`galatForm`), bukan toast, supaya orang tidak kehilangan isian.

**Komentar**
- Bahasa Indonesia, menjelaskan **mengapa**. Komentar di `<template>` untuk keputusan tampilan yang tidak jelas dari markup.

---

## 6. Daftar periksa sebelum PR

- [ ] `yarn typecheck` bersih
- [ ] Page tipis; logika ada di komponen; API hanya di service
- [ ] Peran lewat `usePeran()`; pagar tombol dua lapis (`punya` + `auth.can`)
- [ ] Tombol transisi membaca `pindah_boleh`/`dapat_diubah` dari BE
- [ ] Angka penyaring dari BE, bukan dihitung di layar
- [ ] Route = `route_path` seeder; sudah masuk `MENU_GROUPS`; ikon ada di `icons.ts`
- [ ] Diuji dengan **tiap peran** dan **setelah refresh**
- [ ] Warna/jarak dari token; tidak ada heksadesimal di komponen
- [ ] Nilai kosong `—`; pesan sukses dari BE; galat form tampil di modal
