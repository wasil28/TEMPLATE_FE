import { useAuthStore, ROLE_DASHBOARD } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.restoreSession()

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth !== false
  const allowedRoles = to.meta.roles as string[] | undefined

  if (requiresAuth && !isAuthenticated) {
    return navigateTo('/login')
  }

  /* Halaman portal publik tidak pernah dialihkan, bahkan bagi yang sudah
     masuk: seorang pengelola boleh membukanya untuk melihat apa yang dilihat
     pendaftar, dan tautan pelacakan dibagikan apa adanya. */
  if (to.path.startsWith('/publik/')) return

  if (!requiresAuth && isAuthenticated && (to.path === '/login' || to.path === '/')) {
    const dash = ROLE_DASHBOARD[authStore.activeRole?.kode ?? ''] ?? '/login'
    return navigateTo(dash)
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = authStore.activeRole && allowedRoles.includes(authStore.activeRole.kode)
    if (!hasAccess) return navigateTo('/403')
  }
})
