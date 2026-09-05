// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SPA mode — no SSR, behaves like a standard Vue 3 app
  ssr: false,

  // Source directory
  srcDir: 'src/',

  // Runtime config — diakses via useRuntimeConfig()
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3020',
    },
  },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  // Auto-import components
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  /* CSS global. tokens.css = variabel desain (warna, font, radius);
     tailwind.css = lapisan komponen (.btn, .card, .table, .modal, ...).
     Gaya khusus modul ditaruh di berkas sendiri per modul dan didaftarkan
     di sini — jangan ditumpuk ke tailwind.css. */
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/tailwind.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Vite options
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3020',
          changeOrigin: true,
        },
        '/uploads': {
          target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3020',
          changeOrigin: true,
        },
      },
    },
  },

  // TypeScript strict
  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'Template Aplikasi',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
