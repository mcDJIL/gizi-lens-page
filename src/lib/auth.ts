import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

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

export async function fetchUserProfile(user: User): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (!snap.exists()) return null

    const data = snap.data()
    if (!isAdminRole(data)) return null

    const rawRole = typeof data.role === 'string' ? data.role.trim() : 'admin'
    const normalizedRole: UserRole =
      rawRole.toLowerCase() === 'admin' || rawRole.toLowerCase() === 'super_admin'
        ? 'BGN National Admin'
        : (rawRole as UserRole)

    return {
      uid: user.uid,
      name:
        typeof data.name === 'string' && data.name
          ? data.name
          : user.displayName || user.email?.split('@')[0] || 'Admin GiziLens',
      email: typeof data.email === 'string' && data.email ? data.email : user.email || '',
      role: normalizedRole,
      institution:
        typeof data.institution === 'string' && data.institution
          ? data.institution
          : 'Badan Gizi Nasional (BGN)',
      status: (data.status as UserStatus) || 'Verified',
      createdAtLabel: typeof data.createdAtLabel === 'string' ? data.createdAtLabel : 'Hari ini',
      createdAtMs: typeof data.createdAtMs === 'number' ? data.createdAtMs : undefined,
    }
  } catch {
    return null
  }
}

export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  const profile = await fetchUserProfile(credential.user)
  if (!profile) {
    await signOut(auth)
    throw new Error('Akun ini tidak memiliki role admin di Firestore (koleksi users).')
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
