import { ArrowRight, Button, Check, Eyebrow, Logo } from '../components'

const PERKS = ['Demo 5 menit', 'Tanpa instalasi', 'Bisa pakai contoh baki']

export default function Booth() {
  return (
    <section className="relative overflow-hidden bg-forest-950 py-24 text-cream sm:py-32" id="booth">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 -top-64 h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle,rgba(214,162,62,0.3),transparent_62%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-[-30%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(42,117,84,0.28),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow num="05" light>
            Booth
          </Eyebrow>
          <h2 className="mt-6 text-[clamp(2.3rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-cream">
            Mampir.
            <br />
            Jepret. <span className="font-serif font-normal italic text-gold">Buktikan.</span>
          </h2>
          <p className="mt-6 max-w-[32rem] text-[15.5px] leading-[1.7] text-cream/60">
            Bawa satu ompreng — atau pakai contoh kami. Lihat sendiri bagaimana kamera, deteksi komponen,
            dan analisis AKG bekerja dalam satu tarikan napas.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#cara-kerja" variant="gold" arrow>
              Jalankan demo
            </Button>
            <Button href="#fitur" variant="ghost-light">
              Lihat alur audit
            </Button>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {PERKS.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cream/45"
              >
                <Check width={13} height={13} className="text-gold" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[400px] rotate-2" data-reveal>
          <div className="relative rounded-[20px] bg-cream p-7 text-forest-900 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between gap-4">
              <Logo className="origin-left scale-90" />
              <span className="rounded-full bg-gold px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-forest-900">
                Demo pass
              </span>
            </div>

            <div className="mt-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
                Sesi langsung di booth
              </p>
              <p className="mt-2 font-serif text-[40px] italic leading-[0.95] tracking-[-0.02em] text-forest-900">
                Satu ompreng,
                <br />
                lima pilar.
              </p>
              <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
                Scan · deteksi komponen · verifikasi AKG dalam satu alur.
              </p>
            </div>

            <div className="relative my-7 border-t border-dashed border-forest-900/25">
              <span
                aria-hidden="true"
                className="absolute -left-7 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-forest-950"
              />
              <span
                aria-hidden="true"
                className="absolute -right-7 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-forest-950"
              />
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-forest-900">
                  Berlaku selama sesi booth
                </p>
                <p className="mt-1 text-[10.5px] leading-snug text-muted">
                  Bawa baki sendiri, atau pakai contoh kami.
                </p>
              </div>
              <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-muted">
                No. 05
              </span>
            </div>

            <div
              aria-hidden="true"
              className="mt-6 h-10 w-full bg-[repeating-linear-gradient(90deg,#0f2a1f_0_2px,transparent_2px_5px,#0f2a1f_5px_6px,transparent_6px_9px)] opacity-70"
            />
            <p className="mt-2 flex justify-between text-[8px] font-semibold uppercase tracking-[0.2em] text-muted">
              <span>GiziLens</span>
              <span>MBG · SPPG · BGN</span>
            </p>
          </div>

          <div className="absolute -bottom-5 -right-3 flex -rotate-6 items-center gap-1.5 rounded-full border border-cream/20 bg-forest-800 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cream shadow-xl">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-gold" />
            Live demo
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-16 w-full max-w-[1240px] px-6 sm:px-8">
        <a
          href="#atas"
          className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cream/35 transition-colors hover:text-cream/70"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-cream/15 transition-transform group-hover:-translate-y-0.5">
            <ArrowRight className="-rotate-90" width={15} height={15} />
          </span>
          Kembali ke atas
        </a>
      </div>
    </section>
  )
}
