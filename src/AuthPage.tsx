import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Logo, ShieldCheck } from './components'
import { loginWithEmail, mapAuthError } from './lib/auth'

type AuthPageProps = {
  onBackHome: () => void
  onSuccess: () => void
}

export default function AuthPage({ onBackHome, onSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Email dan password admin wajib diisi.')
      return
    }

    setLoading(true)
    try {
      await loginWithEmail(email, password)
      onSuccess()
    } catch (err) {
      setError(mapAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-cream text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(15,42,31,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,42,31,0.045)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1140px] flex-col justify-center px-5 py-8 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-paper px-4 py-2 text-[13px] font-bold text-forest-900 transition hover:border-forest-800 hover:bg-forest-900 hover:text-cream"
          >
            <ArrowRight className="rotate-180" width={15} height={15} />
            Kembali ke Beranda
          </button>

          <span className="hidden items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-forest-800 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
            Admin Portal · gizilens-32aa6
          </span>
        </div>

        <div className="grid overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_40px_90px_-40px_rgba(7,46,33,0.45)] lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="relative flex flex-col justify-between overflow-hidden bg-forest-950 p-8 text-cream sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(214,162,62,0.28),transparent_65%)] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(42,117,84,0.32),transparent_65%)] blur-2xl"
            />

            <div className="relative">
              <Logo className="text-cream" />
              <p className="mt-8 flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">
                <span className="h-px w-6 bg-gold/60" />
                Portal Admin MBG
              </p>
              <h1 className="mt-4 text-[clamp(1.85rem,3.2vw,2.6rem)] font-extrabold leading-[1.06] tracking-[-0.04em]">
                Kendali penuh untuk{' '}
                <span className="font-serif font-normal italic text-gold">mengawal</span> kualitas
                gizi.
              </h1>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.7] text-cream/70">
                Masuk ke dasbor administrator GiziLens untuk memantau performa SPPG, kepatuhan AKG,
                dan sinkronisasi data nasional secara real-time.
              </p>
            </div>

            <div className="relative mt-10 space-y-3 border-t border-cream/15 pt-6">
              {[
                'Akses khusus administrator terdaftar di Firebase Auth',
                'Sinkronisasi data langsung ke Cloud Firestore',
                'Monitoring dashboard BGN Nutrition terpusat',
              ].map((item) => (
                <p key={item} className="flex items-center gap-2.5 text-[13px] text-cream/80">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                    <Check width={12} height={12} />
                  </span>
                  {item}
                </p>
              ))}
            </div>
          </aside>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="border-b border-line pb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-2 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-forest-800">
                Admin Only
              </span>
              <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-forest-900">
                Login Administrator
              </h2>
              <p className="mt-1 text-[13.5px] text-muted">
                Masuk menggunakan akun admin Firebase Anda untuk membuka Dashboard Overview.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800"
              >
                <ShieldCheck className="mt-0.5 shrink-0 text-red-600" width={18} height={18} />
                <span>{error}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-[12px] font-bold tracking-[-0.01em] text-forest-900"
                >
                  Alamat Email Admin
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gizilens.web.id"
                  className="mt-1.5 w-full rounded-xl border border-line-strong bg-cream/40 px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-muted/60 focus:border-forest-700 focus:bg-paper focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="block text-[12px] font-bold tracking-[-0.01em] text-forest-900"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer text-[11px] font-semibold text-forest-700 hover:text-gold-deep"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  className="mt-1.5 w-full rounded-xl border border-line-strong bg-cream/40 px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-muted/60 focus:border-forest-700 focus:bg-paper focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-forest-800 px-6 py-3.5 text-[14px] font-bold text-cream shadow-[0_16px_34px_-20px_rgba(7,46,33,0.95)] transition hover:-translate-y-0.5 hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? 'Memproses...' : 'Masuk ke Dashboard'}</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-forest-900 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight width={16} height={16} />
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-[12px] text-muted">
              Pendaftaran publik dinonaktifkan. Hubungi super admin bila membutuhkan akses akun.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
