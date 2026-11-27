import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, Close, Download, Gamepad } from './components'
import { useScrollLock } from './hooks'
import { DEMO_LINKS } from './links'

type DemoDialogProps = {
  open: boolean
  onClose: () => void
}

export default function DemoDialog({ open, onClose }: DemoDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useScrollLock(open)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', onKeyDown)
      if (previousFocus && previousFocus.isConnected && !previousFocus.closest('[aria-hidden="true"]')) {
        previousFocus.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center overflow-hidden overscroll-none bg-forest-950/70 p-4 backdrop-blur-md touch-none sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-dialog-title"
      aria-describedby="demo-dialog-desc"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-[680px] overflow-hidden rounded-[28px] border border-line bg-cream text-ink shadow-[0_45px_100px_-30px_rgba(4,35,26,0.7)] touch-pan-y"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(214,162,62,0.22),transparent_68%)] blur-xl"
        />

        <div className="relative max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto overscroll-contain p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-muted">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-gold" />
              Portal Demo GiziLens
            </p>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup popup demo"
              className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong bg-paper text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream"
            >
              <Close width={18} height={18} />
            </button>
          </div>

          <div className="mt-5">
            <h2
              id="demo-dialog-title"
              className="text-[clamp(1.75rem,3.6vw,2.4rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-forest-900"
            >
              Mulai jelajahi{' '}
              <span className="font-serif font-normal italic tracking-[-0.01em] text-forest-700">
                GiziLens
              </span>
              .
            </h2>
            <p
              id="demo-dialog-desc"
              className="mt-3 max-w-[54ch] text-[14.5px] leading-[1.68] text-muted"
            >
              Pilih pengalaman demo yang ingin Anda coba — unduh aplikasi untuk pemindaian ompreng
              langsung di perangkat, atau mainkan gamifikasi interaktif seputar lima pilar gizi MBG.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-5 shadow-[0_20px_45px_-32px_rgba(7,46,33,0.4)] transition-colors hover:border-forest-700/40">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-2 text-forest-700">
                    <Download />
                  </span>
                  <span className="rounded-full border border-line bg-cream px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-muted">
                    Google Drive
                  </span>
                </div>

                <h3 className="mt-4 text-[17.5px] font-extrabold leading-snug tracking-[-0.025em] text-forest-900">
                  Aplikasi GiziLens
                </h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-muted">
                  Unduh file instalasi aplikasi untuk mencoba scan baki, deteksi 5 kompartemen, dan
                  ringkasan AKG di lapangan.
                </p>
              </div>

              <a
                href={DEMO_LINKS.appDownload}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group mt-5 inline-flex w-full items-center justify-between gap-3 rounded-full bg-forest-800 py-3 pl-5 pr-2.5 text-[13.5px] font-bold text-cream shadow-[0_14px_28px_-18px_rgba(7,46,33,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-900"
              >
                <span>Download Aplikasi</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-forest-900 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight width={16} height={16} />
                </span>
              </a>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-gold/45 bg-paper p-5 shadow-[0_20px_45px_-32px_rgba(7,46,33,0.4)] transition-colors hover:border-gold">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/20 text-gold-deep">
                    <Gamepad />
                  </span>
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-gold-deep">
                    Gamifikasi Web
                  </span>
                </div>

                <h3 className="mt-4 text-[17.5px] font-extrabold leading-snug tracking-[-0.025em] text-forest-900">
                  Fitur Gamifikasi Gizi
                </h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-muted">
                  Asah pemahaman komposisi menu sehat dan keseimbangan lima pilar gizi MBG lewat
                  permainan interaktif di browser.
                </p>
              </div>

              <a
                href={DEMO_LINKS.gamification}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group mt-5 inline-flex w-full items-center justify-between gap-3 rounded-full bg-gold py-3 pl-5 pr-2.5 text-[13.5px] font-bold text-forest-900 shadow-[0_14px_28px_-18px_rgba(214,162,62,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
              >
                <span>Mainkan Gamifikasi</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest-900 text-gold transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight width={16} height={16} />
                </span>
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 text-[11.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <span className="text-gold" aria-hidden="true">
                ✳
              </span>
              Tautan terbuka di tab baru · <span className="font-semibold text-forest-800">game.gizilens.web.id</span>
            </p>
            <a
              href="#cara-kerja"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 font-bold text-forest-800 transition-colors hover:text-gold-deep"
            >
              Lihat alur 4 langkah
              <ArrowRight width={14} height={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
