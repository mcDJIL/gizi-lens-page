# GiziLens — Landing Page

Halaman etalase untuk **GiziLens**, aplikasi audit gizi ompreng MBG (Makan Bergizi Gratis). Halaman ini dipakai di booth untuk menarik pengunjung, menjelaskan alur pemeriksaan, dan mengarahkan mereka mencoba demo interaktif.

> Lihat ompreng. Baca gizinya.

## Tentang halaman ini

Landing page satu halaman, berbahasa Indonesia, dengan tampilan editorial yang mengikuti identitas aplikasi: hijau hutan, krem, emas, dan tipografi Plus Jakarta Sans dengan aksen Instrument Serif. Semua visual memakai screenshot asli aplikasi, bukan ilustrasi stok.

Alur konten:

1. **Hero** — nilai utama, CTA demo, pratinjau dasbor.
2. **Ticker** — ringkasan kemampuan yang berjalan.
3. **Masalah** — kenapa audit manual perlu alat ukur.
4. **Cara kerja** — empat langkah interaktif dengan pratinjau layar.
5. **Standar** — lima pilar gizi dengan bar perbandingan AKG.
6. **Fitur** — deteksi komponen, berita acara terkunci, riwayat audit.
7. **Booth** — ajakan mampir dan mencoba demo.

## Teknologi

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** lewat `@tailwindcss/vite` (tanpa `tailwind.config`)
- Font di-self-host, gambar mockup dalam format WebP
- Tanpa library animasi tambahan — IntersectionObserver + CSS

## Menjalankan

Butuh Node.js 20.19+ (disarankan 22+).

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Perintah lain:

```bash
npm run build    # type-check + build produksi ke dist/
npm run preview  # pratinjau hasil build
npm run lint     # ESLint
```

## Struktur

```
public/
  designs/          # screenshot aplikasi (WebP, sudah dioptimasi)
  fonts/            # Plus Jakarta Sans + Instrument Serif (woff2)
  favicon.svg
src/
  App.tsx           # komposisi halaman
  Nav.tsx           # navigasi + menu mobile
  components.tsx    # logo, ikon, tombol, frame HP, reveal
  hooks.ts          # reveal, scroll progress, state nav
  index.css         # Tailwind, design token, keyframes, utilitas
  sections/
    Hero.tsx
    Ticker.tsx
    Problem.tsx
    Workflow.tsx    # langkah interaktif + auto-advance
    Pillars.tsx     # bar 5 pilar + stempel
    Features.tsx
    Booth.tsx
    Footer.tsx
```

Folder `assets/` di root berisi file desain asli (di-gitignore). Versi yang dipakai halaman ada di `public/designs/`.

## Design system

Token warna dan font didefinisikan di `src/index.css` lewat `@theme`, sehingga otomatis tersedia sebagai utility Tailwind (`bg-forest-900`, `text-gold`, `font-serif`, dan seterusnya).

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `forest-950 / 900 / 800` | `#04231a` → `#0b3a29` | latar gelap, tombol, teks |
| `cream / cream-2` | `#f6f2e4` / `#fbf8ee` | latar utama |
| `gold` | `#d6a23e` | aksen, stempel, CTA |
| `sage` | `#dde8d2` | bidang lembut, media |
| `ink / muted` | `#0f2a1f` / `#5a6a5e` | teks |

Font di-load dari `public/fonts` melalui `@font-face`, jadi tampilan tetap konsisten meski koneksi booth buruk.

## Interaksi

- **Reveal saat scroll** — `useReveal()` menambahkan `is-revealed` ke setiap `[data-reveal]`.
- **Cara kerja** — langkah bisa diklik; jika dibiarkan, alur berpindah otomatis tiap 7 detik. Timer emas menandai langkah aktif.
- **Marquee** — berhenti saat kursor di atasnya.
- **Menu mobile** — overlay penuh dengan scroll lock dan tombol Escape.
- **Progress bar** — indikator tipis di atas halaman, digerakkan variabel CSS `--scroll`.
- Semua animasi dinonaktifkan otomatis saat `prefers-reduced-motion: reduce`.

## Performa & aksesibilitas

- Mockup PNG dikonversi ke WebP: total turun dari ±2 MB menjadi ±516 KB.
- Gambar di bawah fold memakai `loading="lazy"`; gambar hero `eager`.
- Struktur semantik (`header`, `main`, `section`, `footer`), skip link, alt text, dan fokus yang terlihat.
- Diuji pada lebar 390, 1440, dan 1920 tanpa horizontal overflow.

## Deployment

Build menghasilkan situs statis di `dist/`:

```bash
npm run build
```

Upload isi `dist/` ke hosting statis (Vercel, Netlify, Cloudflare Pages, Nginx, dan sebagainya). Aset memakai path absolut (`/designs`, `/fonts`), jadi deploy di root domain. Jika perlu di sub-path, sesuaikan `base` di `vite.config.ts` dan path aset.

## Yang bisa disesuaikan

- **Nomor/lokasi booth** — tambahkan di seksi `Booth.tsx` saat sudah tersedia.
- **Link demo atau QR** — ganti `href="#cara-kerja"` pada tombol CTA dengan URL demo sebenarnya.
- **Kontak/tautan sosial** — tambahkan di `Footer.tsx` bila diperlukan.
- **Data contoh pada kartu standar** — ada di array `BARS` pada `Pillars.tsx`; sesuaikan dengan target AKG yang dipakai.
