import { Button, Camera, Phone, Spark } from '../components'

const FACTS = [
  { value: '5', label: 'pilar gizi' },
  { value: '5', label: 'kompartemen' },
  { value: '±10%', label: 'toleransi AKG' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pb-12 pt-[124px] sm:pb-16 lg:pt-[148px]" id="atas">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,rgba(15,42,31,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,42,31,0.055)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_75%_65%_at_45%_35%,black,transparent_82%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-32 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(214,162,62,0.22),transparent_68%)] blur-2xl"
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-14 px-6 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6">
        <div className="max-w-[36rem]">
          <p className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Portal audit gizi MBG
            <span className="hidden h-px w-10 bg-line-strong sm:block" />
          </p>

          <h1 className="mt-6 text-[clamp(2.9rem,6vw,5.3rem)] font-extrabold leading-[0.96] tracking-[-0.05em] text-forest-900">
            Lihat ompreng.
            <br />
            Baca{' '}
            <span className="relative inline-block font-serif text-[1.06em] font-normal italic tracking-[-0.02em] text-forest-700">
              gizinya
              <svg
                className="squiggle absolute -bottom-2 left-0 h-3 w-full text-gold"
                viewBox="0 0 240 14"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 9.5C48 3.5 92 3.2 134 7c34 3 66 2.6 103-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-[34rem] text-[16.5px] leading-[1.7] text-muted sm:text-[17.5px]">
            GiziLens memindai baki MBG lewat kamera, mengenali setiap komponen, lalu mencocokkan lima
            pilar gizi dengan standar AKG. Satu foto — satu keputusan yang bisa diaudit.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#cara-kerja" arrow>
              Coba demo interaktif
            </Button>
            <Button href="#masalah" variant="ghost">
              Kenapa GiziLens
            </Button>
          </div>

          <dl className="mt-11 grid max-w-[430px] grid-cols-3 border-t border-line pt-6">
            {FACTS.map((fact) => (
              <div
                className="flex flex-col-reverse gap-1.5 border-l border-line pl-5 first:border-l-0 first:pl-0"
                key={fact.label}
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {fact.label}
                </dt>
                <dd className="text-[26px] font-extrabold leading-none tracking-[-0.04em] text-forest-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="relative mx-auto aspect-[1/1.26] w-full max-w-[560px] sm:aspect-[1/1.08] lg:max-w-none"
          aria-label="Pratinjau antarmuka aplikasi GiziLens"
        >
          <div
            aria-hidden="true"
            className="absolute right-[-1%] top-[1%] aspect-square w-[79%] rounded-full bg-[radial-gradient(circle_at_35%_28%,#f0d8a4,#d6a23e_52%,#bf8a2b)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.42)]"
          />
          <div
            aria-hidden="true"
            className="absolute -left-[7%] bottom-[4%] h-[48%] w-[50%] rounded-[46%_54%_60%_40%/55%_45%_55%_45%] bg-sage"
          />
          <div aria-hidden="true" className="absolute inset-[1%]">
            <span className="absolute left-0 top-0 h-7 w-7 border-l border-t border-gold/80" />
            <span className="absolute right-0 top-0 h-7 w-7 border-r border-t border-gold/80" />
            <span className="absolute bottom-0 left-0 h-7 w-7 border-b border-l border-gold/80" />
            <span className="absolute bottom-0 right-0 h-7 w-7 border-b border-r border-gold/80" />
          </div>

          <Phone
            src="/designs/komponen.webp"
            alt="Layar deteksi komponen: lima kompartemen ompreng dikenali AI"
            className="absolute left-[1%] top-[25%] z-10 w-[33%] rotate-[8deg] max-sm:hidden"
            priority
          />

          <Phone
            src="/designs/dashboard.webp"
            alt="Dasbor GiziLens: periksa ompreng, kepatuhan AKG, dan periode monitoring"
            className="absolute left-[30%] top-[2%] z-20 w-[46%] -rotate-6 max-sm:left-[23%] max-sm:w-[56%]"
            priority
          />

          <div className="absolute right-[1%] top-[2%] z-30 flex items-center gap-2 rounded-full border border-forest-900/10 bg-paper/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest-800 shadow-[0_12px_30px_-18px_rgba(7,46,33,0.55)] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-forest-500" />
            AI aktif
          </div>

          <div className="absolute bottom-[5%] left-[-5%] z-30 w-[58%] min-w-[215px] -rotate-2 rounded-2xl border border-line bg-paper p-4 shadow-[0_35px_70px_-35px_rgba(7,46,33,0.55)] max-sm:bottom-[2%] max-sm:left-[-1%] max-sm:w-[62%]">
            <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-[0.16em] text-muted">
              Hasil pemindaian
              <Spark className="text-gold" />
            </div>

            <div className="mt-3">
              <div className="flex items-baseline justify-between text-[11.5px] font-semibold text-ink/80">
                <span>Energi</span>
                <b className="text-[11px] tabular-nums text-forest-800">92%</b>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sage-2">
                <span className="block h-full rounded-full bg-forest-600" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="flex items-baseline justify-between text-[11.5px] font-semibold text-ink/80">
                <span>Protein</span>
                <b className="text-[11px] tabular-nums text-forest-800">96%</b>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sage-2">
                <span className="block h-full rounded-full bg-forest-600" style={{ width: '96%' }} />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="flex items-baseline justify-between text-[11.5px] font-semibold text-ink/80">
                <span>Lemak</span>
                <b className="text-[11px] tabular-nums text-gold-deep">113%</b>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sage-2">
                <span className="block h-full rounded-full bg-gold" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="mt-3.5 flex items-center gap-2 border-t border-line pt-3 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted">
              <Camera width={14} height={14} className="text-forest-600" />
              5 komponen · 0,8 dtk
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-[4%] right-[-3%] z-30 grid h-[104px] w-[104px] -rotate-6 place-items-center rounded-full bg-gold text-forest-900 shadow-[0_22px_44px_-22px_rgba(7,46,33,0.55)] max-sm:hidden"
          >
            <span className="grid h-[86px] w-[86px] place-items-center rounded-full border border-dashed border-forest-900/40 text-center text-[9px] font-extrabold uppercase leading-tight tracking-[0.12em]">
              <span>
                <b className="mb-0.5 block text-[20px] leading-none tracking-[-0.04em]">5/5</b>
                terverifikasi
              </span>
            </span>
          </div>
        </div>
      </div>

      <p className="relative mx-auto mt-10 flex w-full max-w-[1240px] items-center gap-3 px-6 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted/80 sm:px-8">
        <span className="text-gold" aria-hidden="true">
          ✳
        </span>
        Dirancang untuk ahli gizi lapangan, pengawas SPPG, dan auditor BGN.
      </p>
    </section>
  )
}
