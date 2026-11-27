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

export type TimeframeKey =
  | 'Hari Ini'
  | '7 Hari Terakhir'
  | '30 Hari Terakhir'
  | 'Tahun Ini'
  | 'Kustom'

export type ActivityGranularity = 'Harian' | 'Mingguan' | 'Bulanan'

export type KpiSnapshot = {
  totalUsers: number
  usersTrend: string
  usersNote: string
  registeredSppg: number
  sppgTrend: string
  sppgNote: string
  registeredSchools: number
  schoolsTrend: string
  schoolsNote: string
  totalAssessments: number
  assessmentsTrend: string
  assessmentsNote: string
  activePremium: number
  premiumTrend: string
  premiumNote: string
  totalRevenue: string
  revenueTrend: string
  revenueNote: string
}

export type ActivityPoint = {
  label: string
  evaluated: number
  previous: number
}

export type ComplianceSegment = {
  key: string
  label: string
  subtitle: string
  percentage: number
  bakiCount: number
  colorHex: string
}

export const COMPLIANCE_FALLBACK: ComplianceSegment[] = [
  {
    key: 'meets_target',
    label: 'Sesuai Target (AKG)',
    subtitle: 'Kalori & makro terpenuhi',
    percentage: 72,
    bakiCount: 229284,
    colorHex: '#10B981',
  },
  {
    key: 'needs_review',
    label: 'Perlu Tinjauan Ahli Gizi',
    subtitle: 'Selisih porsi minor',
    percentage: 18,
    bakiCount: 57321,
    colorHex: '#F59E0B',
  },
  {
    key: 'below_std',
    label: 'Di Bawah Standar',
    subtitle: 'Perlu reformulasi menu',
    percentage: 10,
    bakiCount: 31845,
    colorHex: '#EF4444',
  },
]

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
  plan: 'Tahunan Pro' | 'Dapur Enterprise' | 'Bulanan Pro' | 'Paket Multi-Sekolah'
  planIcon: 'crown' | 'building' | 'spark' | 'school'
  amount: string
  status: 'Terkonfirmasi' | 'Diproses'
}

export const KPI_BY_TIMEFRAME: Record<TimeframeKey, KpiSnapshot> = {
  'Hari Ini': {
    totalUsers: 12480,
    usersTrend: '+2,1%',
    usersNote: 'vs kemarin',
    registeredSppg: 846,
    sppgTrend: '+4 unit',
    sppgNote: 'dapur aktif',
    registeredSchools: 4210,
    schoolsTrend: '+1,4%',
    schoolsNote: 'sekolah penerima',
    totalAssessments: 11840,
    assessmentsTrend: '+15,6%',
    assessmentsNote: 'baki terverifikasi',
    activePremium: 1892,
    premiumTrend: '+3,2%',
    premiumNote: 'konversi',
    totalRevenue: 'Rp 18,4 Jt',
    revenueTrend: '+9,4%',
    revenueNote: 'net terkonfirmasi',
  },
  '7 Hari Terakhir': {
    totalUsers: 12480,
    usersTrend: '+6,8%',
    usersNote: 'vs pekan lalu',
    registeredSppg: 846,
    sppgTrend: '+11 unit',
    sppgNote: 'dapur aktif',
    registeredSchools: 4210,
    schoolsTrend: '+4,2%',
    schoolsNote: 'sekolah penerima',
    totalAssessments: 78420,
    assessmentsTrend: '+12,4%',
    assessmentsNote: 'baki terverifikasi',
    activePremium: 1892,
    premiumTrend: '+9,1%',
    premiumNote: 'konversi',
    totalRevenue: 'Rp 118,6 Jt',
    revenueTrend: '+11,8%',
    revenueNote: 'net terkonfirmasi',
  },
  '30 Hari Terakhir': {
    totalUsers: 12480,
    usersTrend: '+14,2%',
    usersNote: 'vs bulan lalu',
    registeredSppg: 846,
    sppgTrend: '+28 unit',
    sppgNote: 'dapur aktif',
    registeredSchools: 4210,
    schoolsTrend: '+9,5%',
    schoolsNote: 'sekolah penerima',
    totalAssessments: 318450,
    assessmentsTrend: '+22,8%',
    assessmentsNote: 'baki terverifikasi',
    activePremium: 1892,
    premiumTrend: '+18,4%',
    premiumNote: 'konversi',
    totalRevenue: 'Rp 473,0 Jt',
    revenueTrend: '+16,7%',
    revenueNote: 'net terkonfirmasi',
  },
  'Tahun Ini': {
    totalUsers: 12480,
    usersTrend: '+64,0%',
    usersNote: 'vs tahun lalu',
    registeredSppg: 846,
    sppgTrend: '+214 unit',
    sppgNote: 'dapur aktif',
    registeredSchools: 4210,
    schoolsTrend: '+48,3%',
    schoolsNote: 'sekolah penerima',
    totalAssessments: 2840120,
    assessmentsTrend: '+74,5%',
    assessmentsNote: 'baki terverifikasi',
    activePremium: 1892,
    premiumTrend: '+52,1%',
    premiumNote: 'konversi',
    totalRevenue: 'Rp 4,12 M',
    revenueTrend: '+61,3%',
    revenueNote: 'net terkonfirmasi',
  },
  Kustom: {
    totalUsers: 12480,
    usersTrend: '+11,4%',
    usersNote: 'periode dipilih',
    registeredSppg: 846,
    sppgTrend: '+19 unit',
    sppgNote: 'dapur aktif',
    registeredSchools: 4210,
    schoolsTrend: '+7,8%',
    schoolsNote: 'sekolah penerima',
    totalAssessments: 241600,
    assessmentsTrend: '+19,2%',
    assessmentsNote: 'baki terverifikasi',
    activePremium: 1892,
    premiumTrend: '+14,7%',
    premiumNote: 'konversi',
    totalRevenue: 'Rp 364,2 Jt',
    revenueTrend: '+15,1%',
    revenueNote: 'net terkonfirmasi',
  },
}

export const ACTIVITY_BY_GRANULARITY: Record<
  ActivityGranularity,
  { subtitle: string; total: string; trend: string; highlightLabel: string; points: ActivityPoint[] }
> = {
  Harian: {
    subtitle: 'Total Penilaian Harian',
    total: '11.840',
    trend: '+8,6% dibanding kemarin',
    highlightLabel: '11.840 baki',
    points: [
      { label: '06:00', evaluated: 12000, previous: 9000 },
      { label: '08:00', evaluated: 28000, previous: 21000 },
      { label: '10:00', evaluated: 44000, previous: 35000 },
      { label: '12:00', evaluated: 72000, previous: 54000 },
      { label: '14:00', evaluated: 64000, previous: 51000 },
      { label: '16:00', evaluated: 56000, previous: 42000 },
      { label: 'Sekarang', evaluated: 81000, previous: 63000 },
    ],
  },
  Mingguan: {
    subtitle: 'Total Penilaian Mingguan',
    total: '78.420',
    trend: '+12,4% dibanding pekan lalu',
    highlightLabel: '78.420 baki',
    points: [
      { label: 'Sen', evaluated: 21000, previous: 18000 },
      { label: 'Sel', evaluated: 33000, previous: 26000 },
      { label: 'Rab', evaluated: 30000, previous: 29000 },
      { label: 'Kam', evaluated: 46000, previous: 53000 },
      { label: 'Jum', evaluated: 79000, previous: 68000 },
      { label: 'Sab', evaluated: 71000, previous: 63000 },
      { label: 'Min (Hari Ini)', evaluated: 86000, previous: 72000 },
    ],
  },
  Bulanan: {
    subtitle: 'Total Penilaian Bulanan',
    total: '318.450',
    trend: '+22,8% dibanding bulan lalu',
    highlightLabel: '318.450 baki',
    points: [
      { label: 'P1', evaluated: 38000, previous: 31000 },
      { label: 'P2', evaluated: 51000, previous: 42000 },
      { label: 'P3', evaluated: 64000, previous: 53000 },
      { label: 'P4', evaluated: 71000, previous: 60000 },
      { label: 'P5', evaluated: 68000, previous: 58000 },
      { label: 'P6', evaluated: 82000, previous: 67000 },
      { label: 'Saat Ini', evaluated: 90000, previous: 74000 },
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
    dateLabel: 'Hari ini, 10:45',
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
    dateLabel: 'Hari ini, 09:20',
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
    dateLabel: 'Kemarin',
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
    dateLabel: '2 hari lalu',
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
    dateLabel: '3 hari lalu',
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
    dateLabel: '4 hari lalu',
    status: 'Pending Approval',
  },
]

export const FALLBACK_TRANSACTIONS: TransactionRecord[] = [
  {
    orderId: '#TRX-2025-0891',
    user: 'dr. Farah Nabila, M.Gizi',
    organization: 'Klinik Gizi Sentral',
    plan: 'Tahunan Pro',
    planIcon: 'crown',
    amount: 'Rp 2.400.000',
    status: 'Terkonfirmasi',
  },
  {
    orderId: '#TRX-2025-0890',
    user: 'SPPG Malang Sentral',
    organization: 'Unit Dapur MBG 04',
    plan: 'Dapur Enterprise',
    planIcon: 'building',
    amount: 'Rp 12.000.000',
    status: 'Terkonfirmasi',
  },
  {
    orderId: '#TRX-2025-0889',
    user: 'Hendra Wijaya, S.Gz',
    organization: 'Ahli Gizi Auditor',
    plan: 'Bulanan Pro',
    planIcon: 'spark',
    amount: 'Rp 250.000',
    status: 'Terkonfirmasi',
  },
  {
    orderId: '#TRX-2025-0888',
    user: 'Yayasan Pendidikan Taruna',
    organization: 'Pengelola 3 Sekolah',
    plan: 'Paket Multi-Sekolah',
    planIcon: 'school',
    amount: 'Rp 4.500.000',
    status: 'Terkonfirmasi',
  },
  {
    orderId: '#TRX-2025-0887',
    user: 'SPPG Bandung Kulon',
    organization: 'Unit Dapur MBG 09',
    plan: 'Dapur Enterprise',
    planIcon: 'building',
    amount: 'Rp 12.000.000',
    status: 'Terkonfirmasi',
  },
  {
    orderId: '#TRX-2025-0886',
    user: 'Nadia Kusuma, S.Gz',
    organization: 'Auditor Lapangan Jabar',
    plan: 'Tahunan Pro',
    planIcon: 'crown',
    amount: 'Rp 2.400.000',
    status: 'Terkonfirmasi',
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

export function formatUserStatusLabel(status: UserStatus): string {
  return status === 'Verified' ? 'Terverifikasi' : 'Menunggu Persetujuan'
}

export function formatUserRoleLabel(role: UserRole): string {
  return role === 'admin' ? 'Admin BGN' : role
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
    dateLabel: profile.createdAtLabel || 'Hari ini',
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
          dateLabel: typeof data.createdAtLabel === 'string' ? data.createdAtLabel : 'Hari ini',
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
            dateLabel: typeof data.createdAtLabel === 'string' ? data.createdAtLabel : 'Hari ini',
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
    return {
      ok: true,
      message: 'Contoh data transaksi berhasil disinkronkan ke Firestore gizilens-32aa6.',
    }
  } catch {
    return {
      ok: false,
      message:
        'Gagal menulis ke koleksi transactions (periksa aturan Firestore Rules untuk akses tulis admin).',
    }
  }
}
