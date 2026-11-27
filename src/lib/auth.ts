import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from './firebase'
import { fetchUser, fetchUsers, type ApiUser } from './api'

export type UserRole =
  | 'admin'
  | 'Ahli Gizi'
  | 'Petugas SPPG'
  | 'PIC Sekolah'
  | 'Supir Distribusi'
  | 'BGN National Admin'

export type UserStatus = 'Pending Approval' | 'Verified'

export type UserProfile = {
  uid: string
  name: string
  email: string
  role: UserRole
  institution: string
  status: UserStatus
  createdAtLabel: string
  createdAtMs?: number
}

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'superadmin', 'bgn national admin'])

export function isAdminRole(data: Record<string, unknown>): boolean {
  if (data.isAdmin === true) return true
  if (typeof data.role === 'string') {
    return ADMIN_ROLES.has(data.role.trim().toLowerCase())
  }
  return false
}

function mapApiUser(profile: ApiUser): UserProfile {
  return {
    uid: profile.uid,
    name: profile.name || profile.fullName,
    email: profile.email,
    role: profile.role as UserRole,
    institution: profile.institution,
    status: profile.status,
    createdAtLabel: profile.createdAtLabel,
    createdAtMs: profile.createdAtMs,
  }
}

function allowedAdminEmails(): string[] {
  return (((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean))
}

function isAllowlistedAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return allowedAdminEmails().includes(email.toLowerCase())
}

/**
 * Firebase only authenticates the admin. The role/profile lives in PostgreSQL
 * and is loaded through the GiziLens API.
 */
export async function fetchUserProfile(user: User): Promise<UserProfile | null> {
  const allowlisted = isAllowlistedAdmin(user.email)
  const byUid = await fetchUser(user.uid)
  if (byUid) {
    if (!isAdminRole({ role: byUid.role }) && !allowlisted) return null
    return { ...mapApiUser(byUid), role: allowlisted ? 'BGN National Admin' : (byUid.role as UserRole) }
  }

  if (user.email) {
    const result = await fetchUsers({ search: user.email, pageSize: 5 })
    const matched = result?.items.find(
      (item) => item.email.toLowerCase() === user.email?.toLowerCase(),
    )
    if (matched) {
      if (!isAdminRole({ role: matched.role }) && !allowlisted) return null
      return { ...mapApiUser(matched), role: allowlisted ? 'BGN National Admin' : (matched.role as UserRole) }
    }
  }

  // API/DB belum tersedia: izinkan email admin yang dikonfigurasi (atau semua
  // saat daftar kosong untuk mode demo lokal).
  const email = (user.email ?? '').toLowerCase()
  const allowlist = allowedAdminEmails()
  if (allowlist.length > 0 && !allowlist.includes(email)) return null

  return {
    uid: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Admin GiziLens',
    email: user.email || '',
    role: 'BGN National Admin',
    institution: 'Badan Gizi Nasional (BGN)',
    status: 'Verified',
    createdAtLabel: 'Hari ini',
  }
}

export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  const profile = await fetchUserProfile(credential.user)
  if (!profile) {
    await signOut(auth)
    throw new Error('Akun ini tidak memiliki role admin di database GiziLens.')
  }
  return profile
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}

export function mapAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau password tidak sesuai. Silakan periksa kembali.'
    case 'auth/invalid-email':
      return 'Format email tidak valid.'
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan login. Tunggu sebentar lalu coba lagi.'
    case 'auth/operation-not-allowed':
      return 'Metode login Email/Password belum diaktifkan di Firebase Authentication project gizilens-32aa6.'
    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah. Periksa jaringan Anda lalu coba lagi.'
    default:
      return error instanceof Error
        ? error.message
        : 'Terjadi kesalahan saat memproses autentikasi.'
  }
}
