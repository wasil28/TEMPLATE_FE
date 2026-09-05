export const useLayoutStore = defineStore('layout', () => {
  const sidebarCollapsed = ref(false)
  const mobileNavOpen = ref(false)        // drawer sidebar di layar kecil (≤900px)
  const loading = ref(false)
  const notifUnreadCount = ref(0)

  function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value }
  function toggleMobileNav() { mobileNavOpen.value = !mobileNavOpen.value }
  function closeMobileNav() { mobileNavOpen.value = false }
  function setLoading(val: boolean) { loading.value = val }
  function setNotifCount(count: number) { notifUnreadCount.value = count }

  return { sidebarCollapsed, mobileNavOpen, loading, notifUnreadCount, toggleSidebar, toggleMobileNav, closeMobileNav, setLoading, setNotifCount }
})
