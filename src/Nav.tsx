import { useEffect, useState } from 'react'
import { ArrowRight, Button, Close, Logo, Menu } from './components'
import { useScrollLock, useScrolled } from './hooks'

const LINKS = [
  { href: '#masalah', label: 'Masalah' },
  { href: '#cara-kerja', label: 'Cara kerja' },
  { href: '#standar', label: 'Standar' },
  { href: '#fitur', label: 'Fitur' },
  { href: '#booth', label: 'Booth' },
]

type NavProps = {
  demoOpen: boolean
  onOpenDemo: () => void
  isAuthenticated: boolean
  userName?: string
  onNavigate: (path: '/' | '/login' | '/dashboard') => void
}

export default function Nav({
  demoOpen,
  onOpenDemo,
  isAuthenticated,
  userName,
  onNavigate,
}: NavProps) {
  const scrolled = useScrolled(20)
  const [open, setOpen] = useState(false)

  useScrollLock(open)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? 'bg-cream/85 shadow-[0_1px_0_rgba(15,42,31,.09)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between gap-6 px-6 sm:px-8">
          <a
            className="text-forest-900 transition-opacity hover:opacity-70"
            href="#atas"
            aria-label="GiziLens — kembali ke atas"
          >
            <Logo />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {LINKS.map((link) => (
              <a
                key={link.href}
                className="rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-ink/75 transition-colors hover:bg-forest-900/5 hover:text-forest-900"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              {isAuthenticated ? (
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => onNavigate('/dashboard')}
                >
                  Dashboard{userName ? ` · ${userName.split(' ')[0]}` : ''}
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => onNavigate('/login')}>
                  Login
                </Button>
              )}
              <Button
                size="sm"
                arrow
                aria-haspopup="dialog"
                aria-expanded={demoOpen}
                onClick={onOpenDemo}
              >
                Coba demo
              </Button>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-paper/60 text-forest-900 transition hover:bg-paper lg:hidden"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-cream px-6 pb-8 pt-[100px] transition-all duration-500 lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Navigasi mobile">
          {LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="group flex items-center gap-5 border-b border-line py-5 text-[28px] font-bold tracking-[-0.03em] text-forest-900"
            >
              <span className="text-[11px] font-semibold tracking-[0.2em] text-gold">0{index + 1}</span>
              {link.label}
              <ArrowRight className="ml-auto text-line-strong transition-transform group-hover:translate-x-1 group-hover:text-forest-700" />
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3 border-t border-line pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Portal audit gizi MBG
          </p>
          {isAuthenticated ? (
            <Button
              variant="gold"
              className="w-full"
              onClick={() => {
                setOpen(false)
                onNavigate('/dashboard')
              }}
            >
              Buka Dashboard
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setOpen(false)
                onNavigate('/login')
              }}
            >
              Login Admin
            </Button>
          )}
          <Button
            arrow
            className="w-full"
            aria-haspopup="dialog"
            aria-expanded={demoOpen}
            onClick={() => {
              setOpen(false)
              onOpenDemo()
            }}
          >
            Coba demo
          </Button>
        </div>
      </div>
    </>
  )
}
