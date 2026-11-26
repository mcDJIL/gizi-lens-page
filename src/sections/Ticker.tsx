const ITEMS = [
  'Scan ompreng',
  'Deteksi 5 kompartemen',
  'Hitung AKG',
  'Koreksi komponen',
  'Kunci berita acara',
  'Telusuri riwayat',
]

export default function Ticker() {
  return (
    <div
      className="ticker relative z-10 overflow-hidden border-y border-white/10 bg-forest-900 py-4 text-cream"
      aria-hidden="true"
    >
      <div className="flex w-max">
        <div className="ticker-track flex w-max">
          {[0, 1].map((group) => (
            <div className="flex shrink-0 items-center" key={group}>
              {ITEMS.map((item) => (
                <span
                  className="flex items-center gap-7 whitespace-nowrap pr-7 text-[10.5px] font-semibold uppercase tracking-[0.22em]"
                  key={`${group}-${item}`}
                >
                  {item}
                  <span className="text-[13px] text-gold">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
