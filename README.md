# TEMPLATE_FE

Frontend dasar — Nuxt 3 (`ssr: false`, SPA) + Pinia + Tailwind + lucide + sweetalert2.
Pasangannya: [TEMPLATE_BE](https://github.com/wasil28/TEMPLATE_BE) — cara memulai proyek
baru dari kedua template ada di README repo itu.

**Yang sudah ada:** halaman login / lupa sandi / reset sandi, shell aplikasi (topbar dengan pil peran & avatar, sidebar ber-grup per peran dari API), halaman profil, utilitas admin (pengguna, peran, menu, otorisasi), jaring "dalam pengembangan" untuk route yang belum dibuat, dan **layar contoh `Catatan`** yang memakai seluruh pola baku.

## Menjalankan lokal

```bash
cp .env.example .env      # NUXT_PUBLIC_API_BASE=http://localhost:3020
yarn install
yarn dev                  # :5174 — proxy /api dan /uploads ke BE
yarn typecheck            # nuxi prepare + vue-tsc
```

Masuk dengan akun demo dari `yarn seed` di BE.

## Baca selanjutnya

**`docs/PANDUAN.md`** — struktur folder, alur data, standar penamaan, bentuk baku page/komponen/service/composable, alur menambah halaman baru (termasuk apa yang harus disentuh di BE), aturan wajib, daftar periksa.
