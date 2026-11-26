import type { CSSProperties } from 'react'
import { Check, Eyebrow } from '../components'

const BARS = [
  { label: 'Energi', value: '701 / 762 kkal', pct: 92, warn: false },
  { label: 'Protein', value: '23,1 / 24 g', pct: 96, warn: false },
  { label: 'Lemak sehat', value: '28,2 / 25 g', pct: 113, warn: true },
  { label: 'Karbohidrat kompleks', value: '89 / 110 g', pct: 81, warn: false },
  { label: 'Serat', value: '10,2 / 12 g', pct: 85, warn: false },
]

export default function Pillars() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="standar">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-sage/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Eyebrow num="03">Standar</Eyebrow>
          <h2 className="mt-6 text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-forest-900">
            Lima pilar.
            <br />
            Satu <span className="font-serif font-normal italic text-forest-700">standar</span> untuk
            setiap baki.
          </h2>
          <p className="mt-6 max-w-[31rem] text-[15.5px] leading-[1.7] text-muted">
            Setiap sesi diuji terhadap target AKG sesuai kelompok usia — energi, protein, lemak sehat,
            karbohidrat kompleks, dan serat. Bukan sekadar “cukup banyak”, tapi terukur.
          </p>

          <div className="mt-9 border-l-2 border-gold pl-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-deep">
              Ambang kepatuhan
            </p>
            <p className="mt-2 max-w-[26rem] text-[14px] leading-[1.65] text-muted">
              Toleransi <b className="font-bold text-forest-900">±10%</b> dari target AKG kelompok usia.
              Di luar rentang, sesi otomatis ditandai untuk ditinjau.
            </p>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {['Energi', 'Protein', 'Lemak', 'Karbo', 'Serat'].map((item, index) => (
              <li className="flex items-center gap-2" key={item}>
                <span className="text-gold">0{index + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]" data-reveal>
          <div className="relative -rotate-[1.5deg] rounded-3xl border border-line bg-paper p-6 shadow-[0_45px_90px_-45px_rgba(7,46,33,0.45)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted">
                  Contoh analisis
                </p>
                <h3 className="mt-1 text-[19px] font-extrabold tracking-[-0.03em] text-forest-900">
                  Ringkasan 5 pilar
                </h3>
              </div>
              <span className="rounded-full border border-forest-900/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-forest-700">
                AKG ±10%
              </span>
            </div>

            <div className="mt-6">
              {BARS.map((bar, index) => (
                <div className="mt-4 first:mt-0" key={bar.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12.5px] font-semibold text-ink/85">{bar.label}</span>
                    <span
                      className={`text-[10.5px] font-medium tabular-nums ${
                        bar.warn ? 'text-gold-deep' : 'text-muted'
                      }`}
                    >
                      {bar.value}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sage-2">
                    <span
                      className={`bar-fill block h-full rounded-full ${
                        bar.warn ? 'bg-gold' : 'bg-forest-700'
                      }`}
                      style={
                        {
                          '--w': `${Math.min(bar.pct, 100)}%`,
                          transitionDelay: `${index * 90}ms`,
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-dashed border-line pt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-forest-700" />
                Sesuai standar
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-gold" />
                Di atas target
              </span>
              <span className="ml-auto text-forest-800">4 dari 5 sesuai</span>
            </div>

            <div className="absolute -top-4 right-5 flex -rotate-3 items-center gap-1.5 rounded-full bg-gold px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-forest-900 shadow-[0_12px_24px_-14px_rgba(7,46,33,0.6)]">
              <Check width={13} height={13} />
              5 pilar terukur
            </div>
          </div>

          <p className="mt-4 text-center text-[10.5px] leading-relaxed text-muted/70">
            *Contoh tampilan. Angka mengikuti target AKG kelompok usia.
          </p>
        </div>
      </div>
    </section>
  )
}
