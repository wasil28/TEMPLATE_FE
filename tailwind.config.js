/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/components/**/*.vue',
  ],
  /* Kelas yang dirangkai DINAMIS di template — mis. `badge-status--${x.c}` —
     tidak terlihat oleh pemindai konten Tailwind, lalu dibuang dari
     @layer components saat build. Gejalanya sunyi: kelas dasarnya ada,
     variannya hilang, badge jadi transparan. Pola di bawah menjaga seluruh
     varian tetap terkirim. Tambahkan pola baru bila membuat keluarga kelas
     ber-varian yang dipakai dinamis. */
  safelist: [
    { pattern: /^badge-status--(aktif|nonaktif|warning|danger|info)$/ },
    { pattern: /^badge-(pending|verified|rejected|info|brand|neutral|success|warning|danger|secondary)$/ },
    { pattern: /^icon-box-(blue|green|amber|purple|pink|red|teal|sky|indigo|primary|success|warning|danger|secondary|orange)$/ },
    { pattern: /^quick-card--(blue|green|purple|amber|orange)$/ },
    { pattern: /^timeline-dot--(done|active|pending)$/ },
  ],
  theme: {
    extend: {
      colors: {
        // ── Warna merek — selaraskan dengan tokens.css ──
        brand: {
          50:  '#EFF5FE',
          100: '#DCEAFD',
          200: '#BFDBFE',
          300: '#8FC0F7',
          400: '#6BAEF3',
          500: '#3B8BEE',
          600: '#1D6FE0',
          700: '#1557B8',
          800: '#10448F',
          900: '#0E3A78',
        },
        // ── Permukaan: putih di atas sapuan biru tipis ──
        surface:     '#F4F7FC',
        'surface-2': '#EFF4FB',
        card:        '#FFFFFF',
        border:      '#DCE5F2',
        'border-hover': '#C6D5EC',
        canvas:   '#EDF2FA',
        strip:    '#FAFCFE',
        sunken:   '#F4F7FC',
        raised:   '#FAFCFE',
        hairline: '#E9EEF7',
        ink:      '#14213D',
        'ink-2':  '#4A5A75',
        'ink-3':  '#8A97AC',
        // ── Aksen kategori (kotak ikon pastel) ──
        // `gold` dipertahankan namanya agar kelas lama tetap jalan, kini bernuansa amber.
        gold:       '#F0A020',
        'gold-soft':'#FEF3E2',
        'gold-line':'#F7DCAF',
        sky:        '#45AEF5',
        'sky-bg':   '#E8F6FE',
        violet:     '#7C5CE8',
        'violet-bg':'#EFEBFD',
        // ── Semantik status ──
        success:        '#1FA463',
        'success-bg':   '#E4F6ED',
        'success-border':'#A7E3C4',
        warning:        '#E8890C',
        'warning-bg':   '#FEF3E2',
        'warning-border':'#F7DCAF',
        danger:         '#E0483C',
        'danger-bg':    '#FDECEA',
        'danger-border':'#F7C4BF',
        info:           '#45AEF5',
        'info-bg':      '#E8F6FE',
        'info-border':  '#BAE6FD',
        // ── Teks ──
        'text-primary': '#14213D',
        'text-muted':   '#4A5A75',
        'text-subtle':  '#8A97AC',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs:   '6px',
        sm:   '10px',
        DEFAULT: '12px',
        lg:   '16px',
        xl:   '20px',
        '2xl':'26px',
        full: '9999px',
      },
      // Bayangan lembut bernuansa biru — mengambang, bukan menekan.
      boxShadow: {
        xs:  '0 1px 2px rgba(20,33,61,.04)',
        sm:  '0 1px 2px rgba(20,33,61,.04), 0 4px 12px -6px rgba(29,111,224,.14)',
        DEFAULT: '0 2px 6px rgba(20,33,61,.05), 0 16px 34px -18px rgba(29,111,224,.28)',
        md:  '0 3px 10px rgba(20,33,61,.06), 0 20px 40px -20px rgba(29,111,224,.34)',
        lg:  '0 6px 18px rgba(20,33,61,.07), 0 28px 56px -24px rgba(29,111,224,.40)',
        xl:  '0 10px 28px rgba(20,33,61,.09), 0 40px 80px -30px rgba(29,111,224,.46)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      spacing: {
        'topbar': '62px',
        'sidebar': '244px',
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #45AEF5 0%, #1D6FE0 55%, #1557B8 100%)',
        'grad-surface': 'linear-gradient(135deg, #FAFCFE 0%, #EFF4FB 100%)',
        // Sapuan biru lembut di belakang kartu putih (latar aplikasi).
        'grad-canvas':
          'radial-gradient(1200px 700px at 8% -8%, #E7F0FE 0%, transparent 58%),' +
          'radial-gradient(1000px 620px at 96% 4%, #E3EEFD 0%, transparent 55%),' +
          'radial-gradient(900px 600px at 60% 108%, #EAF2FE 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in':   { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up':  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'shimmer':   { to: { backgroundPosition: '-200% 0' } },
        'modal-in':  { from: { opacity: '0', transform: 'scale(.94) translateY(12px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'dropdown-in':{ from: { opacity: '0', transform: 'translateY(-6px) scale(.98)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        'spin':      { to: { transform: 'rotate(360deg)' } },
        'fade-slide-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in':    'fade-in .15s ease-out',
        'slide-up':   'slide-up .3s ease both',
        'modal-in':   'modal-in .2s cubic-bezier(.34,1.56,.64,1)',
        'dropdown-in':'dropdown-in .15s cubic-bezier(.4,0,.2,1)',
        'shimmer':    'shimmer 1.5s infinite',
        'spin-fast':  'spin .6s linear infinite',
        'fade-up':    'fade-slide-up .35s ease both',
      },
    },
  },
  plugins: [],
}
