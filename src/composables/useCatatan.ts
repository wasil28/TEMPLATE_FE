/* ── MODUL CONTOH: composable ──────────────────────────────────────────
   Label, peta warna, dan pembantu tampilan untuk satu modul. Bukan tempat
   memanggil API (itu service) dan bukan tempat aturan bisnis (itu BE). */

export const LABEL_STATUS: Record<string, { t: string; c: string }> = {
  draf:       { t: 'Draf',       c: 'warning'  },
  terbit:     { t: 'Terbit',     c: 'aktif'    },
  diarsipkan: { t: 'Diarsipkan', c: 'nonaktif' },
}

export const tglSingkat = (t?: string | Date | null) =>
  t ? new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/* Sisa hari diucapkan seperti orang mengucapkannya. */
export const ucapTenggat = (sisa: number | null, terlambat: boolean) => {
  if (sisa == null) return 'tanpa tenggat'
  if (terlambat) return `lewat ${Math.abs(sisa)} hari`
  if (sisa === 0) return 'hari ini'
  return `${sisa} hari lagi`
}
