// Peta nama ikon (kolom m_menu.ikon, diisi seeder 03 BE) → komponen lucide-vue-next.
// Nama yang tidak ada di sini jatuh ke FileText TANPA galat — tambahkan di sini
// setiap kali seeder memakai ikon baru. Daftar ikon: https://lucide.dev/icons
import {
  LayoutDashboard, FileWarning, Users, ClipboardCheck, TriangleAlert,
  UserCheck, Handshake, UserCog, GraduationCap, Receipt, Wallet,
  ScrollText, Shield, ShieldCheck, Send, RefreshCw, ClipboardList,
  ListChecks, Settings2, Menu, Lock, FileText, AlertCircle, NotebookPen, UserRound,
} from 'lucide-vue-next'

const ICON_MAP: Record<string, any> = {
  'layout-dashboard': LayoutDashboard,
  'file-warning': FileWarning,
  'users': Users,
  'clipboard-check': ClipboardCheck,
  'alert-triangle': TriangleAlert,
  'user-check': UserCheck,
  'handshake': Handshake,
  'user-cog': UserCog,
  'graduation-cap': GraduationCap,
  'receipt': Receipt,
  'wallet': Wallet,
  'scroll-text': ScrollText,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'send': Send,
  'refresh-cw': RefreshCw,
  'clipboard-list': ClipboardList,
  'list-checks': ListChecks,
  'settings-2': Settings2,
  'menu': Menu,
  'lock': Lock,
  'notebook-pen': NotebookPen,
  'user-round': UserRound,
}

export function getIcon(name: string) {
  return ICON_MAP[name] ?? FileText
}
