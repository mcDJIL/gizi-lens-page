import type {
  ActivityPoint,
  RegionStat,
  TimeframeKey,
} from './dashboardData'
import { auth } from './firebase'

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
const API_BASE = RAW_BASE.replace(/\/+$/, '')

const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) ?? ''
const REQUEST_TIMEOUT_MS = 8000

export type ApiActivity = {
  subtitle: string
  total: string
  trend: string
  highlightLabel: string
  points: ActivityPoint[]
}

export type ApiCompliance = {
  key: string
  label: string
  subtitle: string
  percentage: number
  bakiCount: number
  colorHex: string
}

export type ApiUser = {
  uid: string
  name: string
  fullName: string
  email: string
  role: string
  institution: string
  status: 'Verified' | 'Pending Approval'
  createdAtLabel: string
  createdAtMs?: number
  isVerified: boolean
  subscriptionPlan: string
  isPremium: boolean
}

export type ApiTransaction = {
  orderId: string
  user: string
  organization: string
  plan: string
  planIcon: 'crown' | 'building' | 'spark' | 'school'
  amount: string
  status: string
  paymentStatus: string
}

export type ApiPlan = {
  id: string
  name: string
  tagline: string | null
  monthlyEquivalentPrice: number
  billedPrice: number
  originalPrice: number | null
  billingPeriod: string | null
  isPopular: boolean
  badgeText: string | null
  features: string[]
  ctaLabel: string
}

export type ApiInspection = {
  id: string
  batchCode: string
  schoolName: string | null
  session: string | null
  complianceStatus: string
  totalNetWeight: string | null
  scannedAt: string | null
  targetGroup: string | null
  officerName: string | null
  unitOperational: string | null
  imageUrl: string | null
}

export type ApiSummary = {
  users: number
  sppgUnits: number
  schools: number
  inspections: number
  paymentOrders: number
}

type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

function withBase(path: string): string {
  return `${API_BASE}/api/v1${path}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const user = auth.currentUser
    if (!user) throw new Error('Firebase session is missing')
    const token = await user.getIdToken()
    const response = await fetch(withBase(path), {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`,
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
        ...(init?.headers ?? {}),
      },
    })
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn(
          '[GiziLens API] Bearer token ditolak. Akun perlu klaim admin=true ' +
            'atau uid terdaftar di FIREBASE_ADMIN_UIDS backend.',
        )
      } else if (response.status === 503) {
        console.warn(
          '[GiziLens API] Backend belum punya service account Firebase ' +
            '(set FIREBASE_CREDENTIALS_FILE di server).',
        )
      }
      throw new Error(`HTTP ${response.status}`)
    }
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Expected JSON response')
    }
    return (await response.json()) as T
  } catch (error) {
    console.error('[GiziLens API]', path.split('?')[0], error)
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

export type ApiAdminProfile = Pick<ApiUser, 'uid' | 'name' | 'email' | 'role' | 'institution' | 'status' | 'createdAtLabel' | 'createdAtMs'>

export async function fetchAdminProfile() {
  return request<ApiAdminProfile>('/admin/me')
}

export async function fetchKpi(timeframe: TimeframeKey) {
  return request<{
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
  }>(`/dashboard/kpi?timeframe=${encodeURIComponent(timeframe)}`)
}

export async function fetchActivity(granularity: string) {
  return request<ApiActivity>(
    `/dashboard/activity?granularity=${encodeURIComponent(granularity)}`,
  )
}

export async function fetchCompliance() {
  return request<{ categories: ApiCompliance[]; total: number }>(
    '/dashboard/compliance',
  )
}

export async function fetchRegions(search?: string) {
  const query = search?.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''
  return request<{ items: RegionStat[] }>(`/dashboard/regions${query}`)
}

export async function fetchUsers(params: {
  search?: string
  page?: number
  pageSize?: number
  status?: string
}) {
  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.page) query.set('page', String(params.page))
  query.set('pageSize', String(params.pageSize ?? 100))
  if (params.status) query.set('status', params.status)
  return request<Paginated<ApiUser>>(`/users?${query.toString()}`)
}

export async function fetchUser(uid: string) {
  return request<ApiUser>(`/users/${encodeURIComponent(uid)}`)
}

export async function patchUserStatus(
  uid: string,
  status: 'Verified' | 'Pending Approval',
) {
  return request<ApiUser>(`/users/${encodeURIComponent(uid)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function fetchTransactions(params: {
  search?: string
  page?: number
  pageSize?: number
}) {
  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.page) query.set('page', String(params.page))
  query.set('pageSize', String(params.pageSize ?? 100))
  return request<Paginated<ApiTransaction>>(`/transactions?${query.toString()}`)
}

export async function fetchPlans() {
  return request<{ items: ApiPlan[] }>('/plans')
}

export async function fetchInspections(params: {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.status) query.set('status', params.status)
  if (params.page) query.set('page', String(params.page))
  query.set('pageSize', String(params.pageSize ?? 50))
  return request<Paginated<ApiInspection>>(`/inspections?${query.toString()}`)
}

export async function fetchSummary() {
  return request<ApiSummary>('/dashboard/summary')
}

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE}${path}`
}

export function getApiBaseUrl(): string {
  return API_BASE
}

export function isApiConfigured(): boolean {
  return API_BASE.length > 0
}
