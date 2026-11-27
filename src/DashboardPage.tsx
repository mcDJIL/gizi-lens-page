import { useEffect, useMemo, useRef, useState } from 'react'
import { Close, Menu, Search, Spark } from './components'
import { NutritionalComplianceCard, PlatformActivityCard } from './dashboard/Charts'
import {
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ClipboardCheckIcon,
  CrownIcon,
  GridIcon,
  LogoutIcon,
  ReceiptIcon,
  SchoolCapIcon,
  SettingsIcon,
  SubscriptionIcon,
  TrendUpIcon,
  UsersIcon,
  UtensilsIcon,
  WalletIcon,
} from './dashboard/DashboardIcons'
import { DashboardSubView, type SidebarMenuId } from './dashboard/DashboardSubViews'
import type { UserProfile, UserStatus } from './lib/auth'
import {
  FALLBACK_REGISTRATIONS,
  FALLBACK_TRANSACTIONS,
  KPI_BY_TIMEFRAME,
  REGIONAL_OVERVIEW,
  formatUserRoleLabel,
  formatUserStatusLabel,
  getInitials,
  mapProfileToRegistration,
  type RegistrationRecord,
  type TimeframeKey,
  type TransactionRecord,
} from './lib/dashboardData'
import {
  fetchInspections,
  fetchKpi,
  fetchPlans,
  fetchRegions,
  fetchSummary,
  fetchTransactions,
  fetchUsers,
  patchUserStatus,
  type ApiInspection,
  type ApiPlan,
  type ApiSummary,
  type ApiUser,
} from './lib/api'

type DashboardPageProps = {
  user: UserProfile
  onBackHome: () => void
  onLogout: () => Promise<void>
}

const TIMEFRAMES: TimeframeKey[] = [
  'Hari Ini',
  '7 Hari Terakhir',
  '30 Hari Terakhir',
  'Tahun Ini',
  'Kustom',
]

const MAIN_MENU: Array<{
  id: SidebarMenuId
  label: string
  badge?: string
  icon: typeof GridIcon
}> = [
  { id: 'dashboard', label: 'Dasbor', icon: GridIcon },
  { id: 'users', label: 'Manajemen Pengguna', icon: UsersIcon },
  { id: 'sppg', label: 'SPPG & Sekolah', icon: BuildingIcon },
  { id: 'menu', label: 'Pemantauan Menu', badge: 'Aktif', icon: UtensilsIcon },
  { id: 'subscriptions', label: 'Langganan', icon: SubscriptionIcon },
  { id: 'transactions', label: 'Transaksi', icon: ReceiptIcon },
  { id: 'reports', label: 'Laporan & Analitik', icon: ChartBarIcon },
]

const GOVERNANCE_MENU: Array<{
  id: SidebarMenuId
  label: string
  icon: typeof SettingsIcon
}> = [
  { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
]

const ROLE_BADGE_CLASS: Record<string, string> = {
  admin: 'bg-[#073624] text-white',
  'Ahli Gizi': 'bg-[#E7F6EE] text-[#059669]',
  'Petugas SPPG': 'bg-[#EFF6FF] text-[#2563EB]',
  'PIC Sekolah': 'bg-[#F3E8FF] text-[#7C3AED]',
  'Supir Distribusi': 'bg-[#FFFBEB] text-[#D97706]',
  'BGN National Admin': 'bg-[#073624] text-white',
}

const AVATAR_TONE_CLASS: Record<RegistrationRecord['avatarTone'], string> = {
  emerald: 'bg-[#E7F6EE] text-[#059669]',
  blue: 'bg-[#EFF6FF] text-[#2563EB]',
  purple: 'bg-[#F3E8FF] text-[#7C3AED]',
  amber: 'bg-[#FFFBEB] text-[#D97706]',
}

function toneForRole(role: string): RegistrationRecord['avatarTone'] {
  switch (role) {
    case 'Ahli Gizi':
      return 'emerald'
    case 'Petugas SPPG':
      return 'blue'
    case 'PIC Sekolah':
      return 'purple'
    default:
      return 'amber'
  }
}

function mapApiRegistration(item: ApiUser): RegistrationRecord {
  return {
    id: item.uid,
    initials: getInitials(item.name),
    avatarTone: toneForRole(item.role),
    name: item.name,
    email: item.email,
    role: item.role as RegistrationRecord['role'],
    institution: item.institution,
    dateLabel: item.createdAtLabel,
    status: item.status,
    isFirestore: true,
  }
}

function getIndonesianGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return 'Selamat Pagi'
  if (hour >= 11 && hour < 15) return 'Selamat Siang'
  if (hour >= 15 && hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

function PlanIcon({ icon }: { icon: TransactionRecord['planIcon'] }) {
  switch (icon) {
    case 'crown':
      return <CrownIcon width={13} height={13} className="text-[#059669]" />
    case 'building':
      return <BuildingIcon width={13} height={13} className="text-[#2563EB]" />
    case 'spark':
      return <Spark width={13} height={13} className="text-[#059669]" />
    default:
      return <SchoolCapIcon width={13} height={13} className="text-[#4F46E5]" />
  }
}

export default function DashboardPage({ user, onBackHome, onLogout }: DashboardPageProps) {
  const [activeMenu, setActiveMenu] = useState<SidebarMenuId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<TimeframeKey>('30 Hari Terakhir')
  const [searchQuery, setSearchQuery] = useState('')
  const [regPage, setRegPage] = useState(1)
  const [trxPage, setTrxPage] = useState(1)
  const [apiUsers, setApiUsers] = useState<RegistrationRecord[]>([])
  const [apiStatus, setApiStatus] = useState<'online' | 'fallback'>('fallback')
  const [apiKpi, setApiKpi] = useState<Awaited<ReturnType<typeof fetchKpi>>>(null)
  const [apiRegions, setApiRegions] = useState<typeof REGIONAL_OVERVIEW | null>(null)
  const [apiTransactions, setApiTransactions] = useState<TransactionRecord[] | null>(null)
  const [apiPlans, setApiPlans] = useState<ApiPlan[] | null>(null)
  const [apiInspections, setApiInspections] = useState<ApiInspection[] | null>(null)
  const [apiSummary, setApiSummary] = useState<ApiSummary | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetchKpi(timeframe).then((result) => {
      if (!cancelled && result) setApiKpi(result)
    })
    return () => {
      cancelled = true
    }
  }, [timeframe])

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      fetchUsers({ search: searchQuery, pageSize: 100 }).then((result) => {
        if (cancelled) return
        if (result) {
          setApiUsers(result.items.map(mapApiRegistration))
          setApiStatus('online')
        } else {
          setApiStatus('fallback')
        }
      })
    }, 250)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    let cancelled = false
    fetchRegions(searchQuery).then((result) => {
      if (!cancelled && result) setApiRegions(result.items)
    })
    return () => {
      cancelled = true
    }
  }, [searchQuery])

  useEffect(() => {
    let cancelled = false
    fetchTransactions({ search: searchQuery, pageSize: 100 }).then((result) => {
      if (cancelled) return
      setApiTransactions(
        result
          ? result.items.map((item) => ({
              orderId: item.orderId,
              user: item.user,
              organization: item.organization,
              plan: item.plan as TransactionRecord['plan'],
              planIcon: item.planIcon,
              amount: item.amount,
              status: item.status as TransactionRecord['status'],
            }))
          : null,
      )
    })
    return () => {
      cancelled = true
    }
  }, [searchQuery])

  useEffect(() => {
    let cancelled = false
    fetchPlans().then((result) => {
      if (!cancelled) setApiPlans(result?.items ?? null)
    })
    fetchSummary().then((result) => {
      if (!cancelled) setApiSummary(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      fetchInspections({ search: searchQuery, pageSize: 50 }).then((result) => {
        if (!cancelled) setApiInspections(result?.items ?? null)
      })
    }, 250)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
      if (event.key === 'Escape') {
        setProfileMenuOpen(false)
        setNotifOpen(false)
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const mergedRegistrations = useMemo(() => {
    if (apiStatus === 'online') {
      return apiUsers.length > 0 ? apiUsers : [mapProfileToRegistration(user)]
    }

    const baseList = [mapProfileToRegistration(user)]
    const existingEmails = new Set(baseList.map((u) => u.email.toLowerCase()))
    const seededExtras = FALLBACK_REGISTRATIONS.filter(
      (item) => !existingEmails.has(item.email.toLowerCase()),
    )
    return [...baseList, ...seededExtras]
  }, [apiStatus, apiUsers, user])

  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return mergedRegistrations
    return mergedRegistrations.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q),
    )
  }, [mergedRegistrations, searchQuery])

  const filteredTransactions = useMemo(() => {
    if (apiTransactions) return apiTransactions
    const q = searchQuery.trim().toLowerCase()
    if (!q) return FALLBACK_TRANSACTIONS
    return FALLBACK_TRANSACTIONS.filter(
      (trx) =>
        trx.orderId.toLowerCase().includes(q) ||
        trx.user.toLowerCase().includes(q) ||
        trx.organization.toLowerCase().includes(q) ||
        trx.plan.toLowerCase().includes(q),
    )
  }, [apiTransactions, searchQuery])

  const filteredRegions = useMemo(() => {
    if (apiRegions) return apiRegions
    const q = searchQuery.trim().toLowerCase()
    if (!q) return REGIONAL_OVERVIEW
    const matched = REGIONAL_OVERVIEW.filter((r) => r.province.toLowerCase().includes(q))
    return matched.length > 0 ? matched : REGIONAL_OVERVIEW
  }, [apiRegions, searchQuery])

  const kpi = apiKpi ?? KPI_BY_TIMEFRAME[timeframe]
  const totalUsersDisplay = kpi.totalUsers.toLocaleString('id-ID')

  const regTotalPages = Math.max(1, Math.ceil(filteredRegistrations.length / 4))
  const safeRegPage = Math.min(regPage, regTotalPages)
  const visibleRegistrations = filteredRegistrations.slice((safeRegPage - 1) * 4, safeRegPage * 4)

  const trxTotalPages = Math.max(1, Math.ceil(filteredTransactions.length / 4))
  const safeTrxPage = Math.min(trxPage, trxTotalPages)
  const visibleTransactions = filteredTransactions.slice((safeTrxPage - 1) * 4, safeTrxPage * 4)

  const handleToggleUserStatus = async (id: string, current: UserStatus) => {
    const next: UserStatus = current === 'Verified' ? 'Pending Approval' : 'Verified'
    const updated = await patchUserStatus(id, next)
    if (updated) {
      setApiUsers((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, status: updated.status } : item,
        ),
      )
    }
  }

  const activeSectionLabel =
    [...MAIN_MENU, ...GOVERNANCE_MENU].find((m) => m.id === activeMenu)?.label ?? 'Dasbor'

  const userInitials = getInitials(user.name)
  const firstName = user.name.replace(/^(dr\.|drs\.|prof\.)\s*/i, '').split(' ')[0] || 'Admin'
  const greeting = getIndonesianGreeting()

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white px-4 py-5">
      <div>
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            type="button"
            onClick={onBackHome}
            className="flex cursor-pointer items-center gap-2.5 text-left"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#073624] text-white">
              <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="10" y="10" width="12" height="12" rx="3.5" fill="currentColor" />
                <rect x="25" y="10" width="12" height="12" rx="3.5" fill="currentColor" opacity=".5" />
                <rect x="10" y="25" width="12" height="12" rx="3.5" fill="currentColor" opacity=".5" />
                <rect x="25" y="25" width="12" height="12" rx="3.5" fill="currentColor" />
                <path d="M32 8c2.2-3.2 5.8-4 8-3.6.2 2-.8 5.4-4.2 7.4" fill="#d6a23e" />
              </svg>
            </span>
            <span>
              <span className="flex items-center gap-1.5 text-[16px] font-extrabold leading-none tracking-[-0.03em] text-[#0F2A1F]">
                GiziLens
                <span className="rounded bg-[#E7F6EE] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#059669]">
                  ADMIN
                </span>
              </span>
              <span className="mt-1 block text-[11px] font-medium text-[#6B7A72]">
                Pemantauan Gizi BGN
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#6B7A72] hover:bg-[#F4F7F5] lg:hidden"
          >
            <Close width={17} height={17} />
          </button>
        </div>

        <div className="mt-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#98A59E]">
            MENU UTAMA
          </p>
          <nav className="mt-2 space-y-1" aria-label="Menu utama">
            {MAIN_MENU.map((item) => {
              const Icon = item.icon
              const active = activeMenu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
                    active
                      ? 'bg-[#073624] text-white shadow-[0_8px_18px_-10px_rgba(7,54,36,0.9)]'
                      : 'text-[#4B5B53] hover:bg-[#F4F7F5] hover:text-[#0F2A1F]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={active ? 'text-white' : 'text-[#7C8B83]'} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active ? 'bg-white/15 text-white' : 'bg-[#E7F6EE] text-[#059669]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#98A59E]">
            TATA KELOLA
          </p>
          <nav className="mt-2 space-y-1" aria-label="Menu tata kelola">
            {GOVERNANCE_MENU.map((item) => {
              const Icon = item.icon
              const active = activeMenu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
                    active
                      ? 'bg-[#073624] text-white shadow-[0_8px_18px_-10px_rgba(7,54,36,0.9)]'
                      : 'text-[#4B5B53] hover:bg-[#F4F7F5] hover:text-[#0F2A1F]'
                  }`}
                >
                  <Icon className={active ? 'text-white' : 'text-[#7C8B83]'} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E5EAE7] bg-[#F8FAF9] p-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E3EDE7] text-[12px] font-extrabold text-[#073624]">
            {userInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-bold text-[#0F2A1F]">{user.name}</p>
            <p className="truncate text-[11px] text-[#6B7A72]">
              {formatUserRoleLabel(user.role)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F7F9F8] text-[#0F2A1F]">
      <aside className="hidden w-[252px] shrink-0 border-r border-[#E5EAE7] bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-[#04231A]/50 backdrop-blur-xs lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSidebarOpen(false)
          }}
        >
          <aside className="h-full w-[264px] border-r border-[#E5EAE7] bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[#E5EAE7] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka navigasi dasbor"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[#E5EAE7] text-[#0F2A1F] hover:bg-[#F7F9F8] lg:hidden"
              >
                <Menu width={19} height={19} />
              </button>
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A9891]">
                  <span>Beranda</span>
                  <span>›</span>
                  <span className="font-semibold text-[#0F2A1F]">{activeSectionLabel}</span>
                </p>
                <h1 className="text-[18px] font-extrabold leading-tight tracking-[-0.025em] text-[#0F2A1F]">
                  {activeMenu === 'dashboard' ? 'Ringkasan Dasbor' : activeSectionLabel}
                </h1>
              </div>
            </div>

            <div className="hidden max-w-[360px] flex-1 md:block">
              <div className="flex items-center gap-2 rounded-xl border border-[#E5EAE7] bg-[#F8FAF9] px-3 py-2 focus-within:border-[#059669] focus-within:bg-white">
                <Search width={16} height={16} className="shrink-0 text-[#8A9891]" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setRegPage(1)
                    setTrxPage(1)
                  }}
                  placeholder="Cari SPPG, sekolah, pengguna, atau menu..."
                  className="w-full bg-transparent text-[12.5px] text-[#0F2A1F] placeholder:text-[#8A9891] focus:outline-none"
                />
                <kbd className="shrink-0 rounded border border-[#DFE5E2] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#6B7A72]">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((prev) => !prev)
                    setProfileMenuOpen(false)
                  }}
                  aria-label="Notifikasi"
                  className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[#E5EAE7] bg-white text-[#526058] transition hover:bg-[#F7F9F8]"
                >
                  <BellIcon />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E5EAE7] bg-white p-3.5 shadow-xl">
                    <p className="text-[12px] font-bold text-[#0F2A1F]">Notifikasi Sinkronisasi BGN</p>
                    <div className="mt-2.5 space-y-2 text-[12px]">
                      <div className="rounded-xl bg-[#F8FAF9] p-2.5">
                        <p className="font-semibold text-[#0F2A1F]">Firebase Auth Terhubung</p>
                        <p className="mt-0.5 text-[11px] text-[#6B7A72]">
                          Login aktif sebagai {user.email}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#ECFDF5] p-2.5">
                        <p className="font-semibold text-[#059669]">
                          {apiUsers.length} akun live di PostgreSQL
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#047857]">
                          API GiziLens terhubung ke database aplikasi.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="hidden items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1.5 text-[11.5px] font-bold text-[#059669] sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                {apiStatus === 'online' ? 'Sinkronisasi BGN: Online' : 'Sinkronisasi BGN: Lokal'}
              </span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen((prev) => !prev)
                    setNotifOpen(false)
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-1.5 py-1 transition hover:border-[#E5EAE7] hover:bg-[#F8FAF9]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E3EDE7] text-[11.5px] font-extrabold text-[#073624]">
                    {userInitials}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-[12.5px] font-bold leading-tight text-[#0F2A1F]">
                      {user.name}
                    </span>
                    <span className="block text-[10.5px] text-[#6B7A72]">
                      {formatUserRoleLabel(user.role)}
                    </span>
                  </span>
                  <ChevronDownIcon className="hidden text-[#8A9891] sm:block" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E5EAE7] bg-white p-2 shadow-xl">
                    <div className="border-b border-[#EEF2F0] px-3 py-2">
                      <p className="truncate text-[12.5px] font-bold text-[#0F2A1F]">{user.name}</p>
                      <p className="truncate text-[11px] text-[#6B7A72]">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        onBackHome()
                      }}
                      className="mt-1 flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-[12.5px] font-semibold text-[#0F2A1F] hover:bg-[#F7F9F8]"
                    >
                      Kembali ke Halaman Utama
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        setActiveMenu('settings')
                      }}
                      className="flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-[12.5px] font-semibold text-[#0F2A1F] hover:bg-[#F7F9F8]"
                    >
                      Pengaturan Data
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        void onLogout()
                      }}
                      className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-[12.5px] font-bold text-[#DC2626] hover:bg-red-50"
                    >
                      <LogoutIcon />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
          {activeMenu !== 'dashboard' ? (
            <DashboardSubView
              section={activeMenu}
              registrations={mergedRegistrations}
              regions={filteredRegions}
              transactions={filteredTransactions}
              plans={apiPlans}
              inspections={apiInspections}
              summary={apiSummary}
              searchQuery={searchQuery}
              syncStatus={apiStatus}
              onToggleUserStatus={handleToggleUserStatus}
              onBackOverview={() => setActiveMenu('dashboard')}
            />
          ) : (
            <>
              <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E5EAE7] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,31,0.03)] sm:p-6 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] sm:text-[24px]">
                    {greeting}, {firstName}! 👋
                  </h2>
                  <p className="mt-1 text-[13.5px] text-[#6B7A72]">
                    Berikut ringkasan performa platform GiziLens untuk operasional MBG nasional.
                  </p>
                </div>

                <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#E5EAE7] bg-[#F7F9F8] p-1">
                  {TIMEFRAMES.map((item) => {
                    const active = timeframe === item
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTimeframe(item)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
                          active
                            ? 'bg-white text-[#0F2A1F] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                            : 'text-[#6B7A72] hover:text-[#0F2A1F]'
                        }`}
                      >
                        {item === 'Kustom' && <CalendarIcon />}
                        {item}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section
                aria-label="Statistik utama"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
              >
                <article className="rounded-2xl border border-[#E5EAE7] bg-white p-4 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7A72]">Total Pengguna</span>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ECFDF5] text-[#059669]">
                      <UsersIcon width={16} height={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                    {totalUsersDisplay}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-bold text-[#059669]">
                      <TrendUpIcon />
                      {kpi.usersTrend}
                    </span>
                    <span className="text-[#8A9891]">{kpi.usersNote}</span>
                  </p>
                </article>

                <article className="rounded-2xl border border-[#E5EAE7] bg-white p-4 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7A72]">SPPG Terdaftar</span>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ECFDF5] text-[#059669]">
                      <BuildingIcon width={16} height={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                    {kpi.registeredSppg.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-bold text-[#059669]">
                      <TrendUpIcon />
                      {kpi.sppgTrend}
                    </span>
                    <span className="text-[#8A9891]">{kpi.sppgNote}</span>
                  </p>
                </article>

                <article className="rounded-2xl border border-[#E5EAE7] bg-white p-4 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7A72]">
                      Sekolah Terdaftar
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                      <SchoolCapIcon width={16} height={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                    {kpi.registeredSchools.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-bold text-[#059669]">
                      <TrendUpIcon />
                      {kpi.schoolsTrend}
                    </span>
                    <span className="text-[#8A9891]">{kpi.schoolsNote}</span>
                  </p>
                </article>

                <article className="rounded-2xl border border-[#E5EAE7] bg-white p-4 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7A72]">Total Penilaian</span>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFFBEB] text-[#D97706]">
                      <ClipboardCheckIcon width={16} height={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                    {kpi.totalAssessments.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-bold text-[#059669]">
                      <TrendUpIcon />
                      {kpi.assessmentsTrend}
                    </span>
                    <span className="text-[#8A9891]">{kpi.assessmentsNote}</span>
                  </p>
                </article>

                <article className="rounded-2xl border border-[#E5EAE7] bg-white p-4 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7A72]">Langganan Aktif</span>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ECFDF5] text-[#059669]">
                      <CrownIcon width={16} height={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                    {kpi.activePremium.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-bold text-[#059669]">
                      <TrendUpIcon />
                      {kpi.premiumTrend}
                    </span>
                    <span className="text-[#8A9891]">{kpi.premiumNote}</span>
                  </p>
                </article>

                <article className="rounded-2xl border border-[#E5EAE7] bg-white p-4 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7A72]">
                      Total Pendapatan
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                      <WalletIcon width={16} height={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                    {kpi.totalRevenue}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="font-bold text-[#059669]">{kpi.revenueTrend}</span>
                    <span className="text-[#8A9891]">{kpi.revenueNote}</span>
                  </p>
                </article>
              </section>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <PlatformActivityCard onViewReport={() => setActiveMenu('reports')} />
                </div>
                <div className="lg:col-span-4">
                  <NutritionalComplianceCard />
                </div>
              </div>

              <section className="rounded-2xl border border-[#E5EAE7] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,31,0.03)] sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0F2A1F]">
                        Ringkasan Ekosistem GiziLens
                      </h3>
                      <span className="rounded-md bg-[#E7F6EE] px-2 py-0.5 text-[11px] font-bold text-[#059669]">
                        Cakupan Nasional
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-[#6B7A72]">
                      Rincian dapur SPPG terdaftar, sekolah penerima manfaat, dan intensitas
                      inspeksi per wilayah.
                    </p>
                  </div>

                  <div className="flex items-center gap-5 text-[12px] font-medium text-[#526058]">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
                      Aktivitas Penilaian
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#073624]" />
                      Kesiapan Infrastruktur
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('sppg')}
                      className="cursor-pointer font-bold text-[#059669] hover:text-[#047857]"
                    >
                      Lihat Semua ›
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                  {filteredRegions.slice(0, 5).map((region) => (
                    <article
                      key={region.province}
                      className="flex flex-col justify-between rounded-2xl border border-[#E5EAE7] bg-[#FAFDFB] p-4 transition hover:border-[#A7F3D0]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[13.5px] font-bold leading-snug text-[#0F2A1F]">
                            {region.rank}. {region.province}
                          </h4>
                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              region.rank <= 3
                                ? 'bg-[#E7F6EE] text-[#059669]'
                                : 'bg-[#EEF2F0] text-[#526058]'
                            }`}
                          >
                            Peringkat #{region.rank}
                          </span>
                        </div>

                        <dl className="mt-3 space-y-1.5 text-[12px]">
                          <div className="flex items-center justify-between">
                            <dt className="text-[#6B7A72]">Unit SPPG:</dt>
                            <dd className="font-bold text-[#0F2A1F] tabular-nums">
                              {region.sppgUnits} unit
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-[#6B7A72]">Sekolah:</dt>
                            <dd className="font-bold text-[#0F2A1F] tabular-nums">
                              {region.schools.toLocaleString('id-ID')} sekolah
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-[#6B7A72]">Penilaian:</dt>
                            <dd className="font-bold text-[#059669] tabular-nums">
                              {region.assessments.toLocaleString('id-ID')} baki
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div className="mt-4">
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#E5EAE7]">
                          <div
                            className="h-full rounded-full bg-[#059669]"
                            style={{ width: `${region.targetPct}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-center text-[10.5px] font-medium text-[#8A9891]">
                          {region.targetPct}% Target Volume
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <section className="flex flex-col justify-between rounded-2xl border border-[#E5EAE7] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,31,0.03)] sm:p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0F2A1F]">
                          Pendaftaran Pengguna Terbaru
                        </h3>
                        <p className="mt-0.5 text-[12px] text-[#6B7A72]">
                          Personel baru yang terdaftar untuk operasional MBG.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveMenu('users')}
                        className="shrink-0 cursor-pointer text-[12px] font-bold text-[#059669] hover:text-[#047857]"
                      >
                        Lihat Semua ›
                      </button>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[540px] text-left text-[12.5px]">
                        <thead>
                          <tr className="border-b border-[#EEF2F0] text-[11px] font-semibold text-[#8A9891]">
                            <th className="py-2.5 pr-3">Nama Pengguna</th>
                            <th className="py-2.5 pr-3">Peran</th>
                            <th className="py-2.5 pr-3">Institusi</th>
                            <th className="py-2.5 pr-3">Tanggal</th>
                            <th className="py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEF2F0]">
                          {visibleRegistrations.map((row) => (
                            <tr key={row.id} className="hover:bg-[#FAFDFB]">
                              <td className="py-3 pr-3">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${AVATAR_TONE_CLASS[row.avatarTone]}`}
                                  >
                                    {row.initials}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="truncate font-bold text-[#0F2A1F]">{row.name}</p>
                                    <p className="truncate text-[11px] text-[#8A9891]">{row.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-3">
                                <span
                                  className={`inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                    ROLE_BADGE_CLASS[row.role] ?? 'bg-[#F4F7F5] text-[#526058]'
                                  }`}
                                >
                                  {formatUserRoleLabel(row.role)}
                                </span>
                              </td>
                              <td className="py-3 pr-3 font-medium text-[#526058]">
                                {row.institution}
                              </td>
                              <td className="py-3 pr-3 whitespace-nowrap text-[#6B7A72]">
                                {row.dateLabel}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (row.isFirestore) {
                                      void handleToggleUserStatus(row.id, row.status)
                                    }
                                  }}
                                  title={
                                    row.isFirestore
                                      ? 'Klik untuk ubah status verifikasi di database'
                                      : undefined
                                  }
                                  className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                    row.isFirestore ? 'cursor-pointer' : 'cursor-default'
                                  } ${
                                    row.status === 'Verified'
                                      ? 'bg-[#ECFDF5] text-[#059669]'
                                      : 'border border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]'
                                  }`}
                                >
                                  {formatUserStatusLabel(row.status)}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F0] pt-4 text-[11.5px] text-[#8A9891]">
                    <span>
                      Menampilkan {visibleRegistrations.length} dari {totalUsersDisplay} akun
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={safeRegPage === 1}
                        onClick={() => setRegPage((p) => Math.max(1, p - 1))}
                        className="cursor-pointer rounded-lg border border-[#E5EAE7] px-2.5 py-1 font-semibold text-[#526058] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Sebelumnya
                      </button>
                      {Array.from({ length: regTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setRegPage(page)}
                          className={`h-7 w-7 cursor-pointer rounded-lg font-bold ${
                            safeRegPage === page
                              ? 'bg-[#073624] text-white'
                              : 'border border-[#E5EAE7] text-[#526058] hover:bg-[#F7F9F8]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={safeRegPage >= regTotalPages}
                        onClick={() => setRegPage((p) => Math.min(regTotalPages, p + 1))}
                        className="cursor-pointer rounded-lg border border-[#E5EAE7] px-2.5 py-1 font-semibold text-[#526058] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                </section>

                <section className="flex flex-col justify-between rounded-2xl border border-[#E5EAE7] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,31,0.03)] sm:p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0F2A1F]">
                          Transaksi Langganan Terbaru
                        </h3>
                        <p className="mt-0.5 text-[12px] text-[#6B7A72]">
                          Pembayaran berhasil yang terkonfirmasi untuk audit MBG Premium.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveMenu('transactions')}
                        className="shrink-0 cursor-pointer text-[12px] font-bold text-[#059669] hover:text-[#047857]"
                      >
                        Lihat Semua ›
                      </button>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[540px] text-left text-[12.5px]">
                        <thead>
                          <tr className="border-b border-[#EEF2F0] text-[11px] font-semibold text-[#8A9891]">
                            <th className="py-2.5 pr-3">ID Pesanan</th>
                            <th className="py-2.5 pr-3">Pengguna</th>
                            <th className="py-2.5 pr-3">Paket</th>
                            <th className="py-2.5 pr-3">Nominal</th>
                            <th className="py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEF2F0]">
                          {visibleTransactions.map((trx) => (
                            <tr key={trx.orderId} className="hover:bg-[#FAFDFB]">
                              <td className="py-3 pr-3 font-mono text-[11.5px] font-semibold text-[#6B7A72]">
                                {trx.orderId}
                              </td>
                              <td className="py-3 pr-3">
                                <p className="font-bold text-[#0F2A1F]">{trx.user}</p>
                                <p className="text-[11px] text-[#8A9891]">{trx.organization}</p>
                              </td>
                              <td className="py-3 pr-3">
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E5EAE7] bg-[#F8FAF9] px-2.5 py-1 text-[11px] font-bold text-[#0F2A1F]">
                                  <PlanIcon icon={trx.planIcon} />
                                  {trx.plan}
                                </span>
                              </td>
                              <td className="py-3 pr-3 whitespace-nowrap font-bold text-[#0F2A1F] tabular-nums">
                                {trx.amount}
                              </td>
                              <td className="py-3 text-right">
                                <span className="inline-block rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                                  {trx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F0] pt-4 text-[11.5px] text-[#8A9891]">
                    <span>Menampilkan {visibleTransactions.length} pembayaran terkonfirmasi</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={safeTrxPage === 1}
                        onClick={() => setTrxPage((p) => Math.max(1, p - 1))}
                        className="cursor-pointer rounded-lg border border-[#E5EAE7] px-2.5 py-1 font-semibold text-[#526058] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Sebelumnya
                      </button>
                      {Array.from({ length: trxTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setTrxPage(page)}
                          className={`h-7 w-7 cursor-pointer rounded-lg font-bold ${
                            safeTrxPage === page
                              ? 'bg-[#073624] text-white'
                              : 'border border-[#E5EAE7] text-[#526058] hover:bg-[#F7F9F8]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={safeTrxPage >= trxTotalPages}
                        onClick={() => setTrxPage((p) => Math.min(trxTotalPages, p + 1))}
                        className="cursor-pointer rounded-lg border border-[#E5EAE7] px-2.5 py-1 font-semibold text-[#526058] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          <footer className="flex flex-col gap-3 border-t border-[#E5EAE7] pt-5 text-[11.5px] text-[#8A9891] sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong className="font-bold text-[#0F2A1F]">Portal Admin GiziLens</strong> •
              Terintegrasi dengan Badan Gizi Nasional (BGN) &amp; Kemenkes RI
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBackHome}
                className="cursor-pointer hover:text-[#0F2A1F]"
              >
                Halaman Utama
              </button>
              <span>Kebijakan Privasi</span>
              <span>SOP Standar MBG</span>
              <span>Log API Audit</span>
              <span className="font-mono text-[11px]">v2.4.0-admin</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
