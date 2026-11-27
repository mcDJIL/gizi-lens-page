import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type { UserProfile, UserRole, UserStatus } from './auth'
import { db } from './firebase'

export type TimeframeKey = 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'This Year' | 'Custom'
export type ActivityGranularity = 'Daily' | 'Weekly' | 'Monthly'

export type KpiSnapshot = {
  totalUsers: number
  usersTrend: string
  registeredSppg: number
  sppgTrend: string
  registeredSchools: number
  schoolsTrend: string
  totalAssessments: number
  assessmentsTrend: string
  activePremium: number
  premiumTrend: string
  totalRevenue: string
  revenueTrend: string
}

export type ActivityPoint = {
  label: string
  evaluated: number
  previous: number
}

export type RegionStat = {
  rank: number
  province: string
  sppgUnits: number
  schools: number
  assessments: number
  targetPct: number
}

export type RegistrationRecord = {
  id: string
  initials: string
  avatarTone: 'emerald' | 'blue' | 'purple' | 'amber'
  name: string
  email: string
  role: UserRole
  institution: string
  dateLabel: string
  status: UserStatus
  isFirestore?: boolean
}

export type TransactionRecord = {
  orderId: string
  user: string
  organization: string
  plan: 'Annual Pro' | 'Enterprise Kitchen' | 'Monthly Pro' | 'Multi-School Plan'
  planIcon: 'crown' | 'building' | 'spark' | 'school'
  amount: string
  status: 'Confirmed' | 'Processing'
}

export const KPI_BY_TIMEFRAME: Record<TimeframeKey, KpiSnapshot> = {
  Today: {
    totalUsers: 12480,
    usersTrend: '+2.1%',
    registeredSppg: 846,
    sppgTrend: '+4 units',
    registeredSchools: 4210,
    schoolsTrend: '+1.4%',
    totalAssessments: 11840,
    assessmentsTrend: '+15.6%',
    activePremium: 1892,
    premiumTrend: '+3.2%',
    totalRevenue: 'Rp 18.4M',
    revenueTrend: '+9.4%',
  },
  'Last 7 Days': {
    totalUsers: 12480,
    usersTrend: '+6.8%',
    registeredSppg: 846,
    sppgTrend: '+11 units',
    registeredSchools: 4210,
    schoolsTrend: '+4.2%',
    totalAssessments: 78420,
    assessmentsTrend: '+12.4%',
    activePremium: 1892,
    premiumTrend: '+9.1%',
    totalRevenue: 'Rp 118.6M',
    revenueTrend: '+11.8%',
  },
  'Last 30 Days': {
    totalUsers: 12480,
    usersTrend: '+14.2%',
    registeredSppg: 846,
    sppgTrend: '+28 units',
    registeredSchools: 4210,
    schoolsTrend: '+9.5%',
    totalAssessments: 318450,
    assessmentsTrend: '+22.8%',
    activePremium: 1892,
    premiumTrend: '+18.4%',
    totalRevenue: 'Rp 473.0M',
    revenueTrend: '+16.7%',
  },
  'This Year': {
    totalUsers: 12480,
    usersTrend: '+64.0%',
    registeredSppg: 846,
    sppgTrend: '+214 units',
    registeredSchools: 4210,
    schoolsTrend: '+48.3%',
    totalAssessments: 2840120,
    assessmentsTrend: '+74.5%',
    activePremium: 1892,
    premiumTrend: '+52.1%',
    totalRevenue: 'Rp 4.12B',
    revenueTrend: '+61.3%',
  },
  Custom: {
    totalUsers: 12480,
    usersTrend: '+11.4%',
    registeredSppg: 846,
    sppgTrend: '+19 units',
    registeredSchools: 4210,
    schoolsTrend: '+7.8%',
    totalAssessments: 241600,
    assessmentsTrend: '+19.2%',
    activePremium: 1892,
    premiumTrend: '+14.7%',
    totalRevenue: 'Rp 364.2M',
    revenueTrend: '+15.1%',
  },
}

export const ACTIVITY_BY_GRANULARITY: Record<
  ActivityGranularity,
  { subtitle: string; total: string; trend: string; highlightLabel: string; points: ActivityPoint[] }
> = {
  Daily: {
    subtitle: 'Daily Total Assessments',
    total: '11,840',
    trend: '+8.6% vs yesterday',
    highlightLabel: '11,840 baki',
    points: [
      { label: '06:00', evaluated: 12000, previous: 9000 },
      { label: '08:00', evaluated: 28000, previous: 21000 },
      { label: '10:00', evaluated: 44000, previous: 35000 },
      { label: '12:00', evaluated: 72000, previous: 54000 },
      { label: '14:00', evaluated: 64000, previous: 51000 },
      { label: '16:00', evaluated: 56000, previous: 42000 },
      { label: 'Now', evaluated: 81000, previous: 63000 },
    ],
  },
  Weekly: {
    subtitle: 'Weekly Total Assessments',
    total: '78,420',
    trend: '+12.4% vs previous week',
    highlightLabel: '78,420 baki',
    points: [
      { label: 'Mon', evaluated: 21000, previous: 18000 },
      { label: 'Tue', evaluated: 33000, previous: 26000 },
      { label: 'Wed', evaluated: 30000, previous: 29000 },
      { label: 'Thu', evaluated: 46000, previous: 53000 },
      { label: 'Fri', evaluated: 79000, previous: 68000 },
      { label: 'Sat', evaluated: 71000, previous: 63000 },
      { label: 'Sun (Today)', evaluated: 86000, previous: 72000 },
    ],
  },
  Monthly: {
    subtitle: 'Monthly Total Assessments',
    total: '318,450',
    trend: '+22.8% vs previous month',
    highlightLabel: '318,450 baki',
    points: [
      { label: 'W1', evaluated: 38000, previous: 31000 },
      { label: 'W2', evaluated: 51000, previous: 42000 },
      { label: 'W3', evaluated: 64000, previous: 53000 },
      { label: 'W4', evaluated: 71000, previous: 60000 },
      { label: 'W5', evaluated: 68000, previous: 58000 },
      { label: 'W6', evaluated: 82000, previous: 67000 },
      { label: 'Current', evaluated: 90000, previous: 74000 },
    ],
  },
}

export const REGIONAL_OVERVIEW: RegionStat[] = [
  {
    rank: 1,
    province: 'Jawa Barat',
    sppgUnits: 264,
    schools: 1310,
    assessments: 98240,
    targetPct: 92,
  },
  {
    rank: 2,
    province: 'Jawa Timur',
    sppgUnits: 198,
    schools: 980,
    assessments: 74180,
    targetPct: 78,
  },
  {
    rank: 3,
    province: 'Jawa Tengah',
    sppgUnits: 162,
    schools: 810,
    assessments: 62900,
    targetPct: 66,
  },
  {
    rank: 4,
    province: 'DKI & Banten',
    sppgUnits: 124,
    schools: 640,
    assessments: 51320,
    targetPct: 54,
  },
  {
    rank: 5,
    province: 'Sumatera Utara',
    sppgUnits: 98,
    schools: 470,
    assessments: 31810,
    targetPct: 38,
  },
]

export const FALLBACK_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'seed-1',
    initials: 'NA',
    avatarTone: 'emerald',
    name: 'Nurul Anggraini, S.Gz',
    email: 'nurul.gizi@gmail.com',
    role: 'Ahli Gizi',
    institution: 'SPPG Cibinong 02',
    dateLabel: 'Today, 10:45',
    status: 'Pending Approval',
  },
  {
    id: 'seed-2',
    initials: 'BH',
    avatarTone: 'blue',
    name: 'Bambang Hartono',
    email: 'bambang.sppg@gmail.com',
    role: 'Petugas SPPG',
    institution: 'SPPG Sukmajaya 01',
    dateLabel: 'Today, 09:20',
    status: 'Verified',
  },
  {
    id: 'seed-3',
    initials: 'SW',
    avatarTone: 'purple',
    name: 'Siti Wahyuni, S.Pd',
    email: 'siti.sdn01@sekolah.id',
    role: 'PIC Sekolah',
    institution: 'SDN Cibinong 04',
    dateLabel: 'Yesterday',
    status: 'Verified',
  },
  {
    id: 'seed-4',
    initials: 'AS',
    avatarTone: 'amber',
    name: 'Agus Santoso',
    email: 'agus.logistik@gmail.com',
    role: 'Supir Distribusi',
    institution: 'Armada Sentral 03',
    dateLabel: '2 days ago',
    status: 'Verified',
  },
  {
    id: 'seed-5',
    initials: 'DM',
    avatarTone: 'emerald',
    name: 'dr. Dian Maharani',
    email: 'dian.maharani@bgn.go.id',
    role: 'Ahli Gizi',
    institution: 'SPPG Bekasi Timur 04',
    dateLabel: '3 days ago',
    status: 'Verified',
  },
  {
    id: 'seed-6',
    initials: 'RP',
    avatarTone: 'blue',
    name: 'Rizky Pratama',
    email: 'rizky.sppg@gmail.com',
    role: 'Petugas SPPG',
    institution: 'SPPG Depok Baru 02',
    dateLabel: '4 days ago',
    status: 'Pending Approval',
  },
]

export const FALLBACK_TRANSACTIONS: TransactionRecord[] = [
  {
    orderId: '#TRX-2025-0891',
    user: 'dr. Farah Nabila, M.Gizi',
    organization: 'Klinik Gizi Sentral',
    plan: 'Annual Pro',
    planIcon: 'crown',
    amount: 'Rp 2.400.000',
    status: 'Confirmed',
  },
  {
    orderId: '#TRX-2025-0890',
    user: 'SPPG Malang Sentral',
    organization: 'Unit Dapur MBG 04',
    plan: 'Enterprise Kitchen',
    planIcon: 'building',
    amount: 'Rp 12.000.000',
    status: 'Confirmed',
  },
  {
    orderId: '#TRX-2025-0889',
    user: 'Hendra Wijaya, S.Gz',
    organization: 'Ahli Gizi Auditor',
    plan: 'Monthly Pro',
    planIcon: 'spark',
    amount: 'Rp 250.000',
    status: 'Confirmed',
  },
  {
    orderId: '#TRX-2025-0888',
    user: 'Yayasan Pendidikan Taruna',
    organization: 'Pengelola 3 Sekolah',
    plan: 'Multi-School Plan',
    planIcon: 'school',
    amount: 'Rp 4.500.000',
    status: 'Confirmed',
  },
  {
    orderId: '#TRX-2025-0887',
    user: 'SPPG Bandung Kulon',
    organization: 'Unit Dapur MBG 09',
    plan: 'Enterprise Kitchen',
    planIcon: 'building',
    amount: 'Rp 12.000.000',
    status: 'Confirmed',
  },
  {
    orderId: '#TRX-2025-0886',
    user: 'Nadia Kusuma, S.Gz',
    organization: 'Auditor Lapangan Jabar',
    plan: 'Annual Pro',
    planIcon: 'crown',
    amount: 'Rp 2.400.000',
    status: 'Confirmed',
  },
]

export function getInitials(name: string): string {
  const parts = name
    .replace(/^(dr\.|drs\.|prof\.)\s*/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return 'GL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
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

export function mapProfileToRegistration(profile: UserProfile): RegistrationRecord {
  return {
    id: profile.uid,
    initials: getInitials(profile.name),
    avatarTone: toneForRole(profile.role),
    name: profile.name,
    email: profile.email,
    role: profile.role,
    institution: profile.institution,
    dateLabel: profile.createdAtLabel || 'Today',
    status: profile.status,
    isFirestore: true,
  }
}

export function subscribeFirestoreUsers(
  onData: (records: RegistrationRecord[]) => void,
  onStatus: (state: 'online' | 'fallback') => void,
): () => void {
  const usersQuery = query(collection(db, 'users'), orderBy('createdAtMs', 'desc'), limit(25))

  return onSnapshot(
    usersQuery,
    (snapshot) => {
      onStatus('online')
      const liveUsers: RegistrationRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        const name = typeof data.name === 'string' && data.name ? data.name : 'Pengguna GiziLens'
        const role = (data.role as UserRole) || 'Ahli Gizi'
        return {
          id: docSnap.id,
          initials: getInitials(name),
          avatarTone: toneForRole(role),
          name,
          email: typeof data.email === 'string' ? data.email : '-',
          role,
          institution: typeof data.institution === 'string' ? data.institution : 'Unit MBG',
          dateLabel: typeof data.createdAtLabel === 'string' ? data.createdAtLabel : 'Today',
          status: (data.status as UserStatus) || 'Pending Approval',
          isFirestore: true,
        }
      })
      onData(liveUsers)
    },
    async () => {
      try {
        const snap = await getDocs(collection(db, 'users'))
        onStatus('online')
        const fallbackDocs: RegistrationRecord[] = snap.docs.map((docSnap) => {
          const data = docSnap.data()
          const name = typeof data.name === 'string' && data.name ? data.name : 'Pengguna GiziLens'
          const role = (data.role as UserRole) || 'Ahli Gizi'
          return {
            id: docSnap.id,
            initials: getInitials(name),
            avatarTone: toneForRole(role),
            name,
            email: typeof data.email === 'string' ? data.email : '-',
            role,
            institution: typeof data.institution === 'string' ? data.institution : 'Unit MBG',
            dateLabel: typeof data.createdAtLabel === 'string' ? data.createdAtLabel : 'Today',
            status: (data.status as UserStatus) || 'Pending Approval',
            isFirestore: true,
          }
        })
        onData(fallbackDocs)
      } catch {
        onStatus('fallback')
        onData([])
      }
    },
  )
}

export async function toggleFirestoreUserStatus(
  uid: string,
  nextStatus: UserStatus,
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch {
    return false
  }
}

export async function seedBaselineTransactionsToFirestore(): Promise<{ ok: boolean; message: string }> {
  try {
    await Promise.all(
      FALLBACK_TRANSACTIONS.slice(0, 4).map((trx, idx) =>
        setDoc(
          doc(db, 'transactions', trx.orderId.replace('#', '')),
          {
            ...trx,
            orderIndex: idx,
            syncedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ),
    )
    return { ok: true, message: 'Sample transaksi berhasil disinkronkan ke Firestore gizilens-32aa6.' }
  } catch {
    return {
      ok: false,
      message:
        'Gagal menulis ke koleksi transactions (periksa Firestore Security Rules untuk akses write user login).',
    }
  }
}
