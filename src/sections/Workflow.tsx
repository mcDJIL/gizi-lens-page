import { useEffect, useState } from 'react'
import { Check, Eyebrow } from '../components'

const STEPS = [
  {
    n: '01',
    title: 'Data batch',
    copy: 'Pilih kelompok sasaran dan target AKG. Batch terkunci agar setiap sesi bisa dilacak sampai ke penerima manfaat.',
    meta: 'Batch · SPPG · target gizi',
    img: '/designs/batch.webp',
    alt: 'Formulir data batch operasional dengan target AKG dan unit SPPG terkunci',
  },
  {
    n: '02',
    title: 'Scan ompreng',
    copy: 'Foto baki dari atas. Pemeriksaan kualitas memastikan cahaya, fokus, dan bingkai siap dianalisis sebelum AI bekerja.',
    meta: 'Kamera · validasi foto',
    img: '/designs/scan.webp',
    alt: 'Layar kamera pemindaian ompreng dengan bingkai deteksi dan checklist kualitas foto',
  },
  {
    n: '03',
    title: 'Deteksi komponen',
    copy: 'AI memetakan setiap kompartemen, mengenali bahan, dan mengestimasi berat porsi — semuanya bisa dikoreksi petugas.',
    meta: 'Segmentasi · estimasi gramasi',
    img: '/designs/komponen.webp',
    alt: 'Hasil segmentasi AI pada lima kompartemen ompreng beserta daftar komponen terdeteksi',
  },
  {
    n: '04',
    title: 'Analisis & kunci',
    copy: 'Lima pilar gizi dibandingkan dengan AKG. Hasil akhir disimpan sebagai berita acara yang terkunci dan siap diaudit.',
    meta: '5 pilar · berita acara',
    img: '/designs/analisis.webp',
    alt: 'Analisis lima pilar nutrisi dengan progres target dan status kesesuaian standar',
  },
]

const AUTO_MS = 7000

export default function Workflow() {
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % STEPS.length)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [auto])

  const active = STEPS[step]

  return (
    <section className="relative overflow-hidden bg-forest-900 py-24 text-cream sm:py-32" id="cara-kerja">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-[-10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(214,162,62,0.16),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-16 select-none text-[clamp(9rem,24vw,22rem)] font-extrabold leading-none tracking-[-0.08em] text-cream/[0.035]"
      >
        04
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow num="02" light>
              Cara kerja
            </Eyebrow>
            <h2 className="mt-6 text-[clamp(2.1rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-cream">
              Empat langkah.
              <br />
              Satu baki.{' '}
              <span className="font-serif font-normal italic tracking-[-0.01em] text-gold">Selesai.</span>
            </h2>
          </div>
          <p className="flex max-w-[19rem] items-start gap-2.5 text-[12.5px] leading-relaxed text-cream/55">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 animate-pulse-soft rounded-full bg-gold" />
            Klik setiap langkah untuk melihat layarnya. Alur berjalan otomatis saat dibiarkan.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="border-t border-cream/15" aria-label="Langkah pemeriksaan">
            {STEPS.map((item, index) => {
              const isActive = index === step
              return (
                <button
                  key={item.n}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setStep(index)
                    setAuto(false)
                  }}
                  className="relative grid w-full grid-cols-[38px_1fr] gap-4 border-b border-cream/15 py-5 text-left transition-colors duration-300 hover:bg-cream/[0.025]"
                >
                  <span
                    className={`pt-1 text-[10.5px] font-bold tracking-[0.16em] transition-colors ${
                      isActive ? 'text-gold' : 'text-gold/50'
                    }`}
                  >
                    {item.n}
                  </span>
                  <span className="block">
                    <span
                      className={`flex items-center gap-2.5 text-[17.5px] font-bold tracking-[-0.02em] transition-colors ${
                        isActive ? 'text-cream' : 'text-cream/55'
                      }`}
                    >
                      {item.title}
                      {isActive && <Check className="text-gold" />}
                    </span>
                    <span
                      className={`mt-2 block text-[13.5px] leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-cream/70' : 'text-cream/40'
                      }`}
                    >
                      {item.copy}
                    </span>
                    <span
                      className={`mt-2.5 block text-[9.5px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                        isActive ? 'text-cream/40' : 'text-cream/25'
                      }`}
                    >
                      {item.meta}
                    </span>
                  </span>
                  {isActive && auto && (
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-cream/10">
                      <span key={step} className="step-timer block h-full w-full bg-gold" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-[268px] max-sm:w-[236px]">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"
              />
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[126%] w-[126%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cream/10"
              />
              <div
                aria-hidden="true"
                className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-forest-800 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gold"
              >
                Pratinjau layar
              </div>

              <div className="relative rounded-[2.2rem] bg-[#0a2a1e] p-[6px] shadow-[0_45px_90px_-35px_rgba(0,0,0,0.65),0_14px_30px_-14px_rgba(0,0,0,0.4)]">
                <div
                  className="relative overflow-hidden rounded-[1.8rem] bg-cream"
                  style={{ aspectRatio: '780 / 1700' }}
                >
                  {STEPS.map((item, index) => (
                    <img
                      key={item.n}
                      src={item.img}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                        index === step ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/45">
              <span className="text-gold">0{step + 1}</span> / 04
              <span className="h-px w-5 bg-cream/20" />
              {active.meta}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
