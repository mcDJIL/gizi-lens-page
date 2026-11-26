import { ArrowUpRight, Logo } from '../components'

const LINKS = [
  { href: '#masalah', label: 'Masalah' },
  { href: '#cara-kerja', label: 'Cara kerja' },
  { href: '#standar', label: 'Standar gizi' },
  { href: '#fitur', label: 'Fitur' },
  { href: '#booth', label: 'Booth' },
]

const PRINCIPLES = ['Terukur', 'Transparan', 'Terlacak']

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-cream">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <div className="grid gap-10 border-b border-cream/10 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo className="text-cream" />
            <p className="mt-5 max-w-[23rem] text-[13.5px] leading-relaxed text-cream/50">
              Portal audit gizi untuk ekosistem Makan Bergizi Gratis. Memindai ompreng, mengukur lima
              pilar, dan menjaga bukti tetap bisa ditelusuri.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-cream/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-cream/45">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Dibangun untuk MBG
            </p>
          </div>

          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-cream/35">Jelajahi</p>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-cream/60 transition-colors hover:text-cream"
                  >
                    {link.label}
                    <ArrowUpRight
                      width={12}
                      height={12}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-cream/35">Prinsip</p>
            <ul className="mt-4 space-y-2.5">
              {PRINCIPLES.map((item, index) => (
                <li key={item} className="flex items-center gap-3 text-[13px] font-medium text-cream/60">
                  <span className="text-[9px] font-bold tracking-[0.12em] text-gold">0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-10 text-center">
          <p
            aria-hidden="true"
            className="select-none text-[clamp(3.5rem,19vw,10.5rem)] font-extrabold leading-[0.75] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgba(246,242,228,0.22)]"
          >
            GiziLens
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream/10 py-6 text-[10.5px] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GiziLens. Portal audit gizi MBG.</p>
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gold" />
            Lihat gizi, wujudkan generasi sehat.
          </p>
        </div>
      </div>
    </footer>
  )
}
