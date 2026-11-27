import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from './firebase'
import { fetchAdminProfile } from './api'

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

/** Global admin authorization comes only from the verified backend session. */
export async function fetchUserProfile(user: User): Promise<UserProfile | null> {
  const profile = await fetchAdminProfile()
  if (!profile || profile.uid !== user.uid || !isAdminRole({ role: profile.role })) {
    return null
  }
  return { ...profile, role: profile.role as UserRole }
}

export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  const profile = await fetchUserProfile(credential.user)
  if (!profile) {
    await signOut(auth)
    throw new Error('Akses admin ditolak atau server autentikasi tidak tersedia.')
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
