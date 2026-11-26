import type { CSSProperties } from 'react'
import { ArrowUpRight, Camera, Eyebrow, Search, ShieldCheck } from '../components'

const ITEMS = [
  {
    title: 'Penilaian masih visual',
    copy: 'Porsi dan komposisi diperkirakan dari pandangan mata. Dua pengawas bisa menghasilkan dua kesimpulan berbeda untuk baki yang sama.',
  },
  {
    title: 'Rekap menumpuk di kertas',
    copy: 'Data batch, komponen, dan temuan tersebar. Menyusun laporan memakan waktu yang seharusnya dipakai untuk memperbaiki menu.',
  },
  {
    title: 'Bukti sulit ditelusuri',
    copy: 'Tanpa catatan yang terkunci, sulit membuktikan bahwa sebuah sesi benar-benar diperiksa dan sesuai standar gizi.',
  },
]

const AUDIENCE = [
  { icon: <Camera width={15} height={15} />, label: 'Ahli gizi lapangan' },
  { icon: <ShieldCheck width={15} height={15} />, label: 'Pengawas SPPG' },
  { icon: <Search width={15} height={15} />, label: 'Auditor BGN' },
]

export default function Problem() {
  return (
    <section className="relative py-24 sm:py-32" id="masalah">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="self-start lg:sticky lg:top-28">
            <Eyebrow num="01">Masalah</Eyebrow>

            <h2 className="mt-6 text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-forest-900">
              Menu bisa difoto.
              <br />
              Gizi tetap harus{' '}
              <span className="font-serif font-normal italic tracking-[-0.01em] text-forest-700">
                dibuktikan
              </span>
              .
            </h2>

            <p className="mt-6 max-w-[30rem] text-[15.5px] leading-[1.7] text-muted">
              Inspeksi baki MBG menuntut angka, bukan kesan. Tapi pencatatan manual membuat standar sulit
              dijaga konsisten — apalagi saat ribuan porsi harus diperiksa setiap hari.
            </p>

            <div className="mt-10 border-t border-line pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/80">
                Dirancang untuk
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {AUDIENCE.map((item) => (
                  <li
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-[12px] font-semibold text-ink/80"
                  >
                    <span className="text-forest-600">{item.icon}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ol className="border-t border-line">
            {ITEMS.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ '--d': `${index * 90}ms` } as CSSProperties}
                className="group grid grid-cols-[40px_1fr] items-start gap-4 border-b border-line py-7 transition-colors hover:bg-paper/70 sm:grid-cols-[56px_1fr_auto] sm:px-3"
              >
                <span className="pt-1.5 text-[11px] font-bold tracking-[0.14em] text-gold">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-0.02em] text-forest-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-[14.5px] leading-[1.7] text-muted">{item.copy}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 hidden h-9 w-9 place-items-center rounded-full border border-line-strong text-forest-700 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:grid"
                >
                  <ArrowUpRight />
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          className="mt-16 flex flex-col gap-6 border-y border-forest-900/15 py-10 sm:mt-20 sm:flex-row sm:items-center sm:justify-between"
          data-reveal
        >
          <p className="max-w-[52rem] text-[clamp(1.3rem,2.3vw,1.95rem)] font-medium leading-[1.35] tracking-[-0.025em] text-forest-900">
            GiziLens menyatukan <em className="font-serif italic text-gold-deep">kamera</em>,{' '}
            <em className="font-serif italic text-gold-deep">AI</em>, dan{' '}
            <em className="font-serif italic text-gold-deep">standar gizi</em> dalam satu alur yang bisa
            dipertanggungjawabkan.
          </p>
          <a
            href="#cara-kerja"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-forest-900/20 px-5 py-3 text-[13px] font-bold text-forest-900 transition hover:bg-forest-900 hover:text-cream sm:self-auto"
          >
            Lihat alurnya
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}
