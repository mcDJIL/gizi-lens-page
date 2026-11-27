import { onAuthStateChanged } from 'firebase/auth'
import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import DemoDialog from './DemoDialog'
import Nav from './Nav'
import { useReveal, useScrollProgress } from './hooks'
import { fetchUserProfile, logoutUser, type UserProfile } from './lib/auth'
import { auth } from './lib/firebase'
import Booth from './sections/Booth'
import Features from './sections/Features'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Pillars from './sections/Pillars'
import Problem from './sections/Problem'
import Ticker from './sections/Ticker'
import Workflow from './sections/Workflow'

const AuthPage = lazy(() => import('./AuthPage'))
const DashboardPage = lazy(() => import('./DashboardPage'))

type AppRoute = '/' | '/login' | '/dashboard'

function normalizeRoute(pathname: string): AppRoute {
  if (pathname === '/login') return '/login'
  if (pathname === '/dashboard') return '/dashboard'
  return '/'
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => normalizeRoute(window.location.pathname))
  const [demoOpen, setDemoOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const navigate = useCallback((next: AppRoute) => {
    if (window.location.pathname !== next) {
      window.history.pushState({}, '', next)
    }
    setRoute(next)
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUserProfile(null)
        setAuthReady(true)
        return
      }
      const profile = await fetchUserProfile(firebaseUser)
      if (!profile) {
        await logoutUser()
        setUserProfile(null)
        setAuthReady(true)
        return
      }
      setUserProfile(profile)
      setAuthReady(true)
    })
    return () => unsubscribe()
  }, [])

  const effectiveRoute: AppRoute =
    authReady && route === '/dashboard' && !userProfile
      ? '/login'
      : authReady && route === '/login' && userProfile
        ? '/dashboard'
        : route

  useEffect(() => {
    document.body.dataset.surface = effectiveRoute === '/dashboard' ? 'dashboard' : 'landing'
    return () => {
      delete document.body.dataset.surface
    }
  }, [effectiveRoute])

  useEffect(() => {
    if (window.location.pathname !== effectiveRoute) {
      window.history.replaceState({}, '', effectiveRoute)
    }
  }, [effectiveRoute])

  useReveal(effectiveRoute)
  useScrollProgress()

  if (effectiveRoute === '/dashboard') {
    if (!authReady || !userProfile) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#F7F9F8] text-[#0F2A1F]">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E5EAE7] bg-white px-5 py-3.5 text-[13.5px] font-bold shadow-sm">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10B981]" />
            Memuat Dashboard GiziLens...
          </div>
        </div>
      )
    }

    return (
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-[#F7F9F8] text-[#0F2A1F]">
            <div className="flex items-center gap-3 rounded-2xl border border-[#E5EAE7] bg-white px-5 py-3.5 text-[13.5px] font-bold shadow-sm">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10B981]" />
              Memuat Dashboard GiziLens...
            </div>
          </div>
        }
      >
        <DashboardPage
          user={userProfile}
          onBackHome={() => navigate('/')}
          onLogout={async () => {
            await logoutUser()
            navigate('/')
          }}
        />
      </Suspense>
    )
  }

  if (effectiveRoute === '/login') {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-cream text-forest-900">
            <div className="rounded-2xl border border-line bg-paper px-5 py-3.5 text-[13.5px] font-bold shadow-sm">
              Menyiapkan halaman autentikasi...
            </div>
          </div>
        }
      >
        <AuthPage
          onBackHome={() => navigate('/')}
          onSuccess={() => navigate('/dashboard')}
        />
      </Suspense>
    )
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-forest-900 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream"
      >
        Lewati ke konten
      </a>

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-gold"
        style={{ transform: 'scaleX(var(--scroll, 0))' }}
      />

      <Nav
        demoOpen={demoOpen}
        onOpenDemo={() => setDemoOpen(true)}
        isAuthenticated={Boolean(userProfile)}
        userName={userProfile?.name}
        onNavigate={navigate}
      />

      <main id="main">
        <Hero />
        <Ticker />
        <Problem />
        <Workflow />
        <Pillars />
        <Features />
        <Booth />
      </main>

      <Footer />

      <DemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  )
}
