import type { ReactNode } from 'react'
import { ArrowUpRight, Eyebrow, Layers, Search, ShieldCheck } from '../components'

function PhonePeek({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={`absolute rounded-[1.8rem] bg-[#0a2a1e] p-[5px] shadow-[0_30px_55px_-25px_rgba(7,46,33,0.55)] ${className}`}
    >
      <div className="overflow-hidden rounded-[1.45rem] bg-cream">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full" />
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  tag,
  title,
  copy,
  img,
  alt,
  chip,
  className = '',
}: {
  icon: ReactNode
  tag: string
  title: string
  copy: string
  img: string
  alt: string
  chip: string
  className?: string
}) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-42px_rgba(7,46,33,0.4)] ${className}`}
    >
      <div className="p-7 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-2 text-forest-700">
            {icon}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted/70">{tag}</span>
        </div>
        <h3 className="mt-6 text-[21px] font-extrabold leading-tight tracking-[-0.03em] text-forest-900">
          {title}
        </h3>
        <p className="mt-2.5 max-w-[38ch] text-[14px] leading-[1.7] text-muted">{copy}</p>
      </div>

      <div className="relative mt-auto h-[300px] overflow-hidden border-t border-line bg-sage-2">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(15,42,31,0.18)_1px,transparent_1px)] [background-size:18px_18px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-2xl"
        />
        <PhonePeek
          src={img}
          alt={alt}
          className="left-1/2 top-9 w-[62%] max-w-[262px] -translate-x-1/2 -rotate-2 transition-transform duration-700 group-hover:-translate-y-2"
        />
        <span className="absolute bottom-5 left-5 z-10 flex items-center gap-1.5 rounded-full border border-line bg-paper/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-forest-800 shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
          {chip}
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-14 bg-gradient-to-t from-sage-2 to-transparent"
        />
      </div>
    </article>
  )
}

export default function Features() {
  return (
    <section className="border-y border-line bg-cream-2 py-24 sm:py-32" id="fitur">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow num="04">Fitur</Eyebrow>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-forest-900">
              Bukan sekadar scan.
              <br />
              Ini <span className="font-serif font-normal italic text-forest-700">jejak audit</span>.
            </h2>
          </div>
          <p className="max-w-[22rem] text-[14px] leading-[1.7] text-muted">
            Dari pemindaian mentah sampai berita acara terkunci — setiap langkah meninggalkan bukti yang
            bisa ditelusuri.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-12">
          <FeatureCard
            className="md:col-span-7"
            icon={<Layers />}
            tag="Deteksi"
            title="Deteksi yang bisa dikoreksi"
            copy="Setiap bahan punya estimasi berat dan tingkat keyakinan. Petugas dapat meninjau dan mengoreksi sebelum hasil dihitung."
            img="/designs/komponen.webp"
            alt="Daftar komponen makanan dengan estimasi berat dan aksi koreksi"
            chip="5 komponen terdeteksi"
          />

          <FeatureCard
            className="md:col-span-5"
            icon={<ShieldCheck />}
            tag="Verifikasi"
            title="Berita acara terkunci"
            copy="Hasil akhir disegel bersama ringkasan batch, verifikator, dan komposisi porsi — siap dipertanggungjawabkan."
            img="/designs/kunci.webp"
            alt="Layar konfirmasi penguncian berita acara dengan checklist verifikasi"
            chip="Terkunci & bertanda tangan"
          />

          <article className="group grid overflow-hidden rounded-3xl border border-line bg-paper transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-42px_rgba(7,46,33,0.4)] md:col-span-12 md:grid-cols-[1fr_1.08fr]">
            <div className="order-2 flex flex-col justify-center p-7 sm:p-10 md:order-1">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-2 text-forest-700">
                  <Search />
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted/70">
                  Riwayat
                </span>
              </div>
              <h3 className="mt-6 text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-forest-900">
                Riwayat yang bisa dicari
              </h3>
              <p className="mt-2.5 max-w-[40ch] text-[14px] leading-[1.7] text-muted">
                Telusuri sesi berdasarkan tanggal, batch, atau status kepatuhan. Setiap temuan punya
                konteks dan jejak — bukan sekadar angka di spreadsheet.
              </p>
              <a
                href="#cara-kerja"
                className="mt-7 inline-flex items-center gap-2 text-[12.5px] font-bold text-forest-800 transition-colors hover:text-gold-deep"
              >
                Lihat alur audit
                <ArrowUpRight />
              </a>
            </div>

            <div className="relative order-1 h-[300px] overflow-hidden border-b border-line bg-sage-2 md:order-2 md:h-[380px] md:border-b-0 md:border-l">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(15,42,31,0.18)_1px,transparent_1px)] [background-size:18px_18px]"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-gold/20 blur-3xl"
              />
              <PhonePeek
                src="/designs/riwayat.webp"
                alt="Riwayat audit dengan filter tanggal, batch, dan status kepatuhan"
                className="left-[5%] top-10 w-[44%] max-w-[200px] -rotate-3 transition-transform duration-700 group-hover:-translate-y-2"
              />
              <PhonePeek
                src="/designs/analisis.webp"
                alt="Analisis lima pilar nutrisi pada satu sesi pemeriksaan"
                className="right-[5%] top-20 w-[44%] max-w-[200px] rotate-3 transition-transform duration-700 group-hover:-translate-y-1"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-16 bg-gradient-to-t from-sage-2 to-transparent"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
