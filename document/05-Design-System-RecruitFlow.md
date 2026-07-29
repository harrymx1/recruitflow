# Design.md — Design System
## RecruitFlow — Recruitment Management System

*Versi 2 — disempurnakan dengan skala warna siap-pakai untuk Tailwind, sistem ikon, logo/brand mark, token elevation & radius, komponen tambahan, panduan data visualization, gaya ilustrasi, dan checklist aksesibilitas.*

*Dokumen ini menjadi acuan visual untuk pembuatan `tailwind.config.js` dan mockup HTML setiap layar pada tahap berikutnya.*

---

## 0. Arah Desain & Rasional

RecruitFlow melayani dua audiens dengan kebutuhan visual berbeda dalam satu produk:
- **Sisi Perusahaan/HR** — alat kerja harian yang padat data (kanban, tabel, form panjang). Butuh: sobriety, kejelasan, densitas informasi tinggi, minim gangguan visual.
- **Sisi Kandidat/Publik** — job board & halaman perusahaan yang harus terasa mengundang, terpercaya, dan manusiawi. Butuh: kehangatan, kepercayaan, sedikit editorial.

**Elemen penyatu (signature)**: seluruh alur rekrutmen pada dasarnya adalah sebuah **rangkaian tahap** (Applied → Screening → Interview → Offer → Hired). Ini dijadikan **motif visual utama**: *"Stage Rail"* — rangkaian titik/node terhubung garis, dengan satu node aktif yang menyala. Dipakai secara **fungsional** (timeline status, header kanban) sekaligus jadi elemen ambient pembeda — karena elemen ini benar-benar merepresentasikan inti produk, bukan dekorasi kosong.

Palet & tipografi sengaja **menghindari** kombinasi "krem + serif kontras tinggi + aksen terracotta" dan "gelap pekat + neon tunggal" yang jadi default umum desain AI — RecruitFlow memakai kanvas dingin netral dengan aksen amber-emas yang lebih jenuh & spesifik, dipadu teal pelabuhan sebagai aksen kedua, serta satu keluarga tipografi (Poppins) yang hierarkinya dibangun lewat berat huruf & italic yang disiplin, bukan lewat pergantian font.

---

## 1. Color Palette

### 1.1 Warna Inti (Brand) — Base Value

| Nama Token | Hex | Penggunaan |
|---|---|---|
| `ink` | `#16233F` | Teks utama, sidebar dashboard, headline di atas latar terang |
| `canvas` | `#F5F6F2` | Latar belakang default (kanvas dingin netral, bukan krem) |
| `amber-signal` | `#E8A23D` | Aksen utama/CTA primer, node aktif Stage Rail |
| `harbor-teal` | `#1F6F78` | Aksen sekunder, tautan, state aktif navigasi |
| `moss` | `#3F7D5C` | Status positif (Hired/sukses) |
| `coral` | `#D8543F` | Status negatif (Rejected/error) |

### 1.2 Skala Warna Siap Tailwind

*Nilai berikut siap dimasukkan ke `theme.extend.colors` pada `tailwind.config.js` (bagian 100/300/500/600/700/900 — shade lain dapat diinterpolasi otomatis oleh tooling jika dibutuhkan lebih granular).*

| Token | 100 (tint terang) | 300 | 500 (base) | 600 (hover/active) | 700 (teks di atas terang) | 900 (paling gelap) |
|---|---|---|---|---|---|---|
| `amber` | `#FBEAD0` | `#F1C179` | `#E8A23D` | `#C98429` | `#A66A1E` | `#5F3A0F` |
| `teal` | `#D8EEF0` | `#7EC1C7` | `#1F6F78` | `#195A61` | `#14454A` | `#0A2528` |
| `ink` | `#DDE1EA` | `#8D97AC` | `#3D4A66` | — | `#16233F` (base=700) | `#0B111F` |
| `moss` | `#DCEEE4` | `#8FC2AA` | `#3F7D5C` | `#336549` | `#294F3A` | `#142719` |
| `coral` | `#FADFDA` | `#EC9C8C` | `#D8543F` | `#B33F2C` | `#8C3122` | `#4A1A12` |
| `canvas` | `#FFFFFF` (surface/kartu) | — | `#F5F6F2` (base) | — | `#E7E9E4` (border di atas canvas) | — |

*Catatan: `ink` base brand (`#16233F`) diposisikan sebagai shade **700**, bukan 900 — karena teks utama sehari-hari memakai shade ini, bukan yang paling gelap.*

### 1.3 Warna Status Pipeline

| Status | Token | Latar Badge | Teks Badge |
|---|---|---|---|
| Applied | `slate-500` (`#64748B`, Tailwind default) | `slate-100` | `slate-600` |
| Tahap tengah kustom | `teal` | `teal-100` | `teal-700` |
| Interview | `amber` (shade muda) | `amber-100` | `amber-700` |
| Offer | `amber` (shade tua) | `amber-300`/40% | `amber-700` |
| Hired | `moss` | `moss-100` | `moss-700` |
| Rejected | `coral` | `coral-100` | `coral-700` |
| Withdrawn | abu netral | `gray-100` | `gray-500` |

### 1.4 Aturan Pemakaian & Aksesibilitas Warna

- `amber-500` **tidak boleh** dipakai sebagai warna teks di atas latar terang (kontras tidak cukup) — gunakan `amber-700` untuk teks, atau `amber-500` hanya untuk latar/ikon/border.
- `coral-500` dan `moss-500` untuk **teks** (mis. pesan error, label sukses) sebaiknya memakai shade **600/700** agar kontras aman di atas latar putih/canvas; shade 500 tetap boleh dipakai untuk badge/latar/ikon.
- `harbor-teal-700` (`#14454A`) aman dipakai sebagai warna tautan/teks di atas latar terang.
- Skala gray bawaan Tailwind (`gray-50`…`gray-900`) dipakai untuk border, teks sekunder, dan latar kartu dashboard — jangan pakai `ink` untuk teks sekunder (terlalu berat), cukup `gray-500`/`gray-600`.
- Warna status **hanya** dipakai untuk badge/indikator status, tidak dipakai dekoratif di tempat lain, agar maknanya tetap konsisten dan cepat dikenali.

---

## 2. Typography

### 2.1 Font Families

| Peran | Font | Alasan |
|---|---|---|
| **Utama** (display, heading, body, UI — seluruh teks di produk) | **Poppins** | Geometric sans yang hangat & modern, sangat legible di kepadatan data tinggi maupun headline besar; satu keluarga font menyederhanakan konsistensi lintas dashboard & area publik |
| **Utility/Mono** (timestamp, ID lamaran, skor, activity log — data presisi) | **JetBrains Mono** | Dipilih agar berdampingan bersih dengan Poppins tanpa berebut karakter geometris — memberi sinyal visual jelas "ini data", bukan sekadar body text yang dikecilkan |

*Fallback stack:* `Poppins, system-ui, sans-serif` / `'JetBrains Mono', ui-monospace, monospace`.

**Menjaga hierarki tanpa dua keluarga font display:**
- **Headline publik** (hero Job Board, judul Company Profile): Poppins **SemiBold/Bold** (600/700) di ukuran besar dengan letter-spacing sedikit lebih rapat (`-0.02em`) — supaya terasa disengaja/premium, bukan sekadar body text yang diperbesar.
- **Wordmark/logo** ("RecruitFlow"): Poppins **Medium Italic** — satu-satunya tempat italic dipakai, sengaja dijaga eksklusif untuk identitas brand agar tetap terasa istimewa dan tidak "tercampur" ke body copy biasa.
- **Judul dashboard**: Poppins SemiBold (600), tegak (bukan italic), sentence case — menjaga sisi HR tetap terasa seperti alat kerja.

### 2.2 Skala Tipe

| Token | Ukuran | Line-height | Letter-spacing | Pemakaian |
|---|---|---|---|---|
| `display-xl` | 52px (mobile 34px) | 1.1 | -0.02em | Hero Job Board (Poppins Bold) |
| `display-lg` | 38px (mobile 26px) | 1.15 | -0.02em | Judul halaman publik (Poppins SemiBold) |
| `heading-lg` | 26px | 1.25 | -0.01em | Judul section dashboard (Poppins SemiBold) |
| `heading-md` | 19px | 1.3 | normal | Judul kartu, judul modal (Poppins SemiBold) |
| `body-lg` | 16px | 1.65 | normal | Body copy publik (Poppins Regular) |
| `body-md` | 14px | 1.55 | normal | Body UI dashboard (Poppins Regular, default) |
| `body-sm` | 13px | 1.45 | 0.01em | Label, caption, metadata (Poppins Medium utk label) |
| `mono-sm` | 12.5px | 1.4 | normal | Timestamp, ID, activity log (JetBrains Mono) |

- Berat Poppins yang dipakai: 400 (body), 500 (label/emphasis ringan/medium italic khusus logo), 600 (heading/tombol/headline publik), 700 (hero headline & angka besar Analytics — dipakai jarang & sengaja).
- Line-height sedikit lebih longgar dibanding sistem sebelumnya karena Poppins (geometric, x-height besar) butuh nafas lebih di body text supaya tidak terasa padat/berat saat dibaca panjang.

---

## 3. Iconography

- **Pustaka**: `lucide-react` — set ikon berbasis stroke, konsisten dengan ekosistem React/Tailwind yang dipakai, cakupan luas untuk kebutuhan HR software (kalender, dokumen, tag, filter, dll).
- **Stroke width**: seragam **1.75px** di seluruh produk (jangan campur bobot stroke berbeda dalam satu layar).
- **Ukuran**: `16px` (inline dengan teks/label kecil), `20px` (default ikon UI — tombol, nav, tabel), `24px` (judul section, empty state ringan), `48px+` (ilustrasi empty state).
- **Warna**: ikon memakai `currentColor` (mengikuti warna teks di sekitarnya). Ikon status memakai warna status (bagian 1.3); ikon navigasi netral (`gray-500`/`ink`) atau `harbor-teal` saat aktif.

---

## 4. Logo & Brand Mark

- **Wordmark**: teks "RecruitFlow" memakai Poppins Medium Italic, warna `ink-700` (atau putih di atas latar gelap seperti sidebar/footer).
- **Icon mark**: tiga titik terhubung garis membentuk lengkung naik halus — turunan langsung dari motif Stage Rail. Dua titik penuh warna `teal-500`, satu titik (paling kanan/depan) warna `amber-500` — merepresentasikan "selalu ada progres yang sedang berjalan".
- **Lockup**: icon mark di kiri, jarak `8px`, lalu wordmark. Area bersih minimum di sekeliling logo = tinggi icon mark itu sendiri.
- **Larangan**: jangan meregangkan/memutar logo, jangan mengganti warna di luar palet, jangan menambahkan drop shadow pada logo.
- Icon mark dipakai juga sebagai favicon dan bentuk dasar loading spinner (3 titik yang menyala bergantian).

---

## 5. Elevation & Radius

### 5.1 Border Radius

| Token | Nilai | Pemakaian |
|---|---|---|
| `radius-sm` | 6px | Chip, badge kecil, input di tabel padat |
| `radius-md` | 8px | Tombol, input, field form (default) |
| `radius-lg` | 12px | Kartu, kolom kanban |
| `radius-xl` | 16px | Modal, panel besar |
| `radius-full` | 9999px | Pill/badge status, avatar |

### 5.2 Shadow (memakai rgba dari `ink`, bukan hitam murni — kesan lebih hangat & konsisten brand)

| Token | Nilai | Pemakaian |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(22,35,63,0.04)` | Batas halus kartu default |
| `shadow-sm` | `0 2px 6px rgba(22,35,63,0.06)` | Kartu dashboard, dropdown |
| `shadow-md` | `0 6px 16px rgba(22,35,63,0.10)` | Hover kartu, popover |
| `shadow-lg` | `0 12px 32px rgba(22,35,63,0.16)` | Modal, kartu kanban saat drag |

---

## 6. Signature Element — The Stage Rail

```
 ●━━━━━━●━━━━━━◉━━━━━━○━━━━━━○
Applied Screening Interview Offer Hired
 (done)  (done)   (aktif)  (belum) (belum)
```

- Node selesai: lingkaran penuh `teal-500`.
- Node aktif: lingkaran `amber-500` dengan pulse halus (lihat bagian 12).
- Node belum tercapai: outline `ink-300`, garis penghubung `ink-100`.
- Status akhir negatif (Rejected/Withdrawn): digambar terpisah dari rail utama (garis putus-putus menyamping, warna status masing-masing) — supaya tidak terkesan "masih dalam proses maju".

*Catatan konsistensi: Stage Rail secara khusus memakai skala `ink` (bukan `gray` Tailwind generik) untuk elemen netralnya — karena elemen ini adalah signature brand, warnanya sengaja diambil dari keluarga warna brand sendiri (`ink`), bukan neutral generik yang dipakai komponen UI biasa (Table, Input, dsb. tetap memakai `gray` standar Tailwind seperti tertulis di masing-masing komponen §7).*

**Pemakaian:** fungsional (Candidate Tracking Portal, header kanban, funnel chart Analytics — lihat bagian 10) dan ambient (versi sangat samar di latar hero Job Board).

---

## 7. Components

### 7.1 Button
- **Primary**: latar `amber-500`, teks `ink-700`, radius `radius-md`, hover: `amber-600` + translate-y(-1px) + `shadow-sm`.
- **Secondary**: outline `teal-500`, teks `teal-700`, latar transparan → hover latar `teal-100`.
- **Ghost**: teks `ink-700`/`gray-600`, tanpa border — aksi tersier.
- **Destructive**: latar `coral-600`, teks putih.
- Tinggi minimum 40px (target sentuh mobile), padding `10px 18px`.

### 7.2 Badge/Status Pill
- Bentuk `radius-full`, padding `4px 10px`, teks `body-sm` semibold, warna mengikuti tabel 1.3.

### 7.3 Card
- `radius-lg`, border `1px solid gray-200`, `shadow-xs`, latar putih.
- Kartu kandidat kanban: avatar inisial, badge skor rata-rata (jika ada), indikator jadwal interview terdekat.

### 7.4 Input & Form
- Border `1px solid gray-300`, `radius-md`, padding `10px 12px`, fokus: ring `teal-500` 2px offset 1px.
- Error state: border `coral-600`, pesan error `body-sm` warna `coral-600` di bawah field.
- Step indicator form multi-step: varian linear sederhana dari Stage Rail (tanpa warna status, murni progres).

### 7.5 Kanban Board
- Kolom: latar `gray-50`, `radius-lg`, header menampilkan nama tahap + jumlah kartu.
- Kolom Rejected/Withdrawn: default collapsed (accordion), latar `gray-100`.
- Drag state: `shadow-lg` + scale 1.03 + rotate 1deg halus.

### 7.6 Navigasi
- **Sidebar dashboard**: latar `ink-700`, teks `gray-300`, item aktif: latar `teal-500/20`, teks putih, indikator garis kiri `amber-500` 3px.
- **Navbar publik**: latar putih/`canvas`, teks `ink-700`, sticky dengan `shadow-xs` saat sudah scroll.

### 7.7 Filter Chip & Sort Priority List
- Chip filter aktif: latar `teal-100`, border `teal-500`, teks `teal-700`, ikon "x" hapus.
- Daftar prioritas sort: list bernomor, handle drag (ikon grip) di kiri, badge angka bulat `amber-500`.

### 7.8 Modal & Toast
- Modal: `radius-xl`, `shadow-lg`, overlay `ink-700/60`.
- Toast: slide-in dari atas-kanan, ikon status (centang `moss-600` / silang `coral-600` / info `teal-600`), auto-dismiss 4 detik.

### 7.9 Table
- Header row: latar `gray-50`, teks `body-sm` semibold `gray-600`, sticky saat scroll vertikal.
- Row: border-bottom `1px solid gray-100` (tanpa garis vertikal, tanpa zebra stripe), hover latar `gray-50`.
- Kolom angka/skor: rata kanan, memakai `mono-sm`.

### 7.10 Tabs
- Gaya underline: tab aktif border-bottom 2px `amber-500`, teks `ink-700`; tab non-aktif teks `gray-500`.

### 7.11 Dropdown / Select / Multi-select Combobox
- Trigger memakai gaya Input (7.4) + chevron 16px di kanan.
- Panel dropdown: `shadow-md`, `radius-md`, latar putih, item hover `gray-50`.
- Multi-select: nilai terpilih ditampilkan sebagai chip inline (gaya sama dengan Filter Chip, 7.7).

### 7.12 Checkbox, Radio, Toggle
- Checkbox: `radius-sm`, checked → latar `teal-500`, centang putih.
- Radio: lingkaran, checked → titik `teal-500`.
- Toggle switch: track `gray-300` → `teal-500` saat aktif, thumb putih.

### 7.13 Tooltip
- Latar `ink-700`, teks putih `body-sm`, `radius-sm`, muncul setelah delay 400ms hover, ada anak panah kecil.

### 7.14 Avatar
- Bentuk lingkaran, fallback inisial nama dengan latar warna deterministik (rotasi dari `teal-500`/`moss-500`/`amber-600` berdasarkan hash nama), teks putih.
- Ukuran: 24 / 32 / 40 / 64px.

### 7.15 Pagination
- Tombol prev/next + nomor halaman, halaman aktif ditandai lingkaran latar `amber-500` teks `ink-700`.

### 7.16 File Upload Dropzone
- Border dashed `gray-300`, `radius-lg`, ikon upload 24px, saat drag-over: border `teal-500` + latar `teal-500/5`.

### 7.17 Rich Text Toolbar (Deskripsi Lowongan)
- Toolbar minimal (bold, italic, bullet list, numbered list, link), ikon 20px, latar `gray-50`, border-bottom `gray-200`.

### 7.18 Score/Rating Input (Candidate Scoring 1–5)
- Lima lingkaran/bintang; terisi = `amber-500`, kosong = `gray-300`; hover menampilkan preview nilai sebelum diklik.

### 7.19 Footer (Area Publik)
- **Latar `ink-700`** (bukan `canvas`/putih) — footer harus kontras jelas terhadap body, tidak boleh menyatu dengan background halaman. Ini juga menjadikan footer "brand anchor" yang konsisten memakai warna dasar logo/sidebar.
- Teks body memakai `ink-300` (bukan `gray`, agar tetap dalam keluarga warna `ink` yang sama, kontrasnya cukup di atas `ink-700`), judul kolom putih semibold, tautan hover → `amber-500`.
- Struktur: logo + tagline singkat (kolom pertama) diikuti 2–3 kolom tautan bertema, ditutup bar bawah tipis (`border-white/10`) berisi copyright.
- Baris copyright secara khusus memakai format Bahasa Inggris — `© [tahun] RecruitFlow. All rights reserved.` — mengikuti konvensi umum, sementara seluruh teks footer lainnya tetap Bahasa Indonesia.
- Footer **hanya** dipakai di area publik (Job Board, Job Detail, Company Profile, halaman marketing). Area dashboard HR **tidak** memakai footer ini — dashboard cukup diakhiri konten/tabel tanpa footer, agar ruang kerja tetap maksimal.
- **Pengecualian di area publik**: halaman autentikasi (Register/Login Perusahaan maupun Kandidat) juga **tidak** memakai footer — halaman konversi seperti ini butuh fokus tanpa distraksi tautan keluar.

### 7.20 Komponen Aceternity UI — Panduan Pemakaian
- **Area publik boleh lebih ekspresif**: *Background Beams*/*Spotlight* pada hero Job Board (tipis, tidak mendominasi), *Hover Border Gradient* pada CTA utama, *Text Reveal* untuk headline saat page-load.
- **Area dashboard harus tetap tenang**: hindari efek dekoratif berat (3D tilt, background beams) di halaman berdata padat. Yang boleh: transisi fade/slide halus, komponen *Sidebar*, tooltip micro-interaction.
- Signature Stage Rail dibangun **custom** (SVG + Framer Motion sederhana), bukan komponen Aceternity siap pakai, karena perlu presisi merepresentasikan data pipeline sebenarnya.

### 7.21 Calendar (Jadwal Interview)
- **Grid bulanan** (default view): sel hari berbentuk persegi, `radius-sm`, border `gray-100`. Hari ini ditandai outline `teal-500` 2px. Hari dengan jadwal interview menampilkan dot indikator `amber-500` di bawah angka tanggal + maksimum 2 preview jadwal ringkas (nama kandidat, jam) sebelum berlanjut "+N lainnya".
- **Grid mingguan** (opsional, untuk melihat detail jam): kolom per hari, baris per slot waktu; kartu jadwal di dalam grid memakai gaya Card (7.3) versi ringkas dengan warna aksen `amber-500` di border kiri (bukan latar penuh, agar tetap terbaca di grid padat).
- **Navigasi**: tombol prev/next bulan/minggu (ikon chevron 20px) + tombol "Hari Ini" (ghost button, 7.1) di kiri, toggle tampilan Bulanan/Mingguan (gaya Tabs, 7.10) di kanan.
- **Klik sel/jadwal**: membuka Modal (7.8) untuk lihat detail, reschedule, atau batalkan — memakai Modal Jadwalkan/Reschedule (H-14).
- **Interaksi drag-to-reschedule** (opsional, tahap lanjutan): jika diimplementasikan, gunakan pola visual yang sama dengan drag kanban (7.5) — scale ringan + shadow saat drag, snap saat drop — demi konsistensi bahasa interaksi drag di seluruh produk.
- Warna dasar grid tetap netral (`gray`/`white`); warna status (`moss`/`coral`/`gray`) **tidak** dipakai di kalender kecuali untuk menandai jadwal yang statusnya sudah "Completed"/"Cancelled" (lihat PRD FR-9.1), agar kalender tetap fokus sebagai alat penjadwalan, bukan dashboard status.

---

## 8. Spacing

- Basis grid **4px**, mengikuti skala default Tailwind — tidak perlu skala kustom.
- Section publik: padding vertikal `64px`–`96px` desktop (`py-16` s/d `py-24`), `40px` mobile (`py-10`).
- Dashboard: padding konten utama `24px` desktop (`p-6`), `16px` mobile (`p-4`); jarak antar kartu `16px` (`gap-4`).
- Form: jarak antar field `20px` (`space-y-5`), antar section form `40px`.
- **Container max-width**: area publik `1200px` (`max-w-[1200px] mx-auto`), area dashboard konten penuh mengikuti sisa lebar setelah sidebar (tanpa max-width tambahan, karena tabel/kanban butuh ruang).

---

## 9. Responsive Rules

Breakpoint default Tailwind: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`.

| Elemen | Desktop (≥lg) | Tablet (md) | Mobile (<md) |
|---|---|---|---|
| Sidebar dashboard | Persisten, lebar 240px | Collapsible jadi ikon-only (64px) | Drawer overlay |
| Kanban board | Semua kolom terlihat, scroll horizontal jika >5 kolom | Scroll horizontal | Satu kolom penuh per swipe + indikator dot |
| Job Board filter panel | Sidebar tetap di kiri | Collapsible drawer dari kiri | Bottom sheet |
| Tabel (Database Kandidat) | Tabel penuh | Scroll horizontal | Berubah jadi kartu (1 kandidat = 1 kartu) |
| Form multi-step | Step indicator penuh label | Label disingkat | Hanya angka + progress bar tipis |
| Hero Job Board | 2 kolom (headline+search kiri, ilustrasi Stage Rail kanan) | 1 kolom, ilustrasi diperkecil | 1 kolom, ilustrasi disembunyikan |

---

## 10. Data Visualization (Analytics Dashboard)

- **Funnel chart**: bar horizontal per tahap, warna `teal-500` (gradasi opacity menurun mengikuti besar funnel). Rejected/Withdrawn ditampilkan sebagai anotasi kecil terpisah di samping (bar tipis `coral-500`/`gray-400`) — **tidak** menyatu ke alur funnel utama, konsisten dengan perlakuan status akhir negatif pada Stage Rail (bagian 6).
- **Time-to-hire trend**: line chart tunggal warna `amber-600`, dot marker di tiap titik data, gridline horizontal `gray-100` saja (tanpa gridline vertikal).
- **Distribusi sumber kandidat**: bar horizontal atau donut chart, rotasi warna `teal-500 → amber-500 → moss-500 → gray-400 → coral-500`, maksimum 5–6 kategori (kategori kecil digabung jadi "Lainnya").
- Tooltip chart memakai gaya Tooltip (7.13).
- Pustaka chart tidak diwajibkan oleh tech stack awal — direkomendasikan pustaka chart React ringan yang komposabel dengan Tailwind (mis. Recharts) saat implementasi.

---

## 11. Ilustrasi & Empty State

- Gaya: line-art sederhana, stroke tunggal 2px (senada dengan ikon), monokrom `ink-700`/`teal-500` dengan **satu** aksen `amber-500` sebagai titik fokus — hindari ilustrasi stok multi-warna ramai atau foto stok generik.
- Contoh: pipeline kosong → gambar garis kolom kanban kosong dengan outline kartu putus-putus.
- Setiap empty state disertai pesan singkat + call-to-action jelas (lihat UX Rule 3.5 pada UI/UX Spec).
- **Fotografi** (galeri/banner Company Profile): pakai foto asli perusahaan, beri perlakuan konsisten — desaturasi ringan (-10%) + overlay tint `ink-700` opacity 10% pada banner supaya teks di atasnya tetap terbaca. Hindari filter berat.

---

## 12. Animation Rules

**Prinsip umum**: motion memperjelas hierarki/hubungan, bukan hiasan. Durasi pendek (150–250ms) untuk interaksi UI, lebih panjang (400–700ms) hanya untuk momen page-load yang disengaja. Seluruh animasi **wajib** menghormati `prefers-reduced-motion` (fallback: fade instan tanpa transform).

| Momen | Efek | Durasi/Easing |
|---|---|---|
| Page-load Job Board (hero) | Headline & search fade-up staggered, Stage Rail ambient menyala node demi node | 500–700ms, `ease-out`, stagger 80ms |
| Hover tombol/kartu | Translate-y(-1 s/d -2px) + shadow membesar | 150ms `ease-out` |
| Node Stage Rail aktif | Pulse halus (scale 1→1.08→1) berulang lambat | 2s loop, `ease-in-out` |
| Drag kanban card | Scale 1.03, `shadow-lg`, rotate 1deg saat drag; snap smooth saat drop | 200ms `ease-out` |
| Toast masuk/keluar | Slide dari kanan-atas + fade | 200ms masuk, 150ms keluar |
| Modal | Fade overlay + scale 0.97→1 pada konten | 200ms `ease-out` |
| Hasil filter/sort job board berubah | Fade + sedikit slide-up pada list baru | 150ms |
| Loading data (skeleton) | Shimmer halus abu-abu (`gray-100` ↔ `gray-200`), **bukan** spinner berputar untuk konten list/tabel | 1.2s loop |
| Dashboard (umum) | Transisi tab/halaman: fade sederhana, **tanpa** slide/scale berlebihan | 150ms |

**Larangan eksplisit**: tidak ada parallax berat, tidak ada bounce/spring berlebihan di dashboard, tidak ada auto-playing background video/animasi besar yang mengganggu fokus kerja HR.

---

## 13. Accessibility Checklist

- Kontras minimum: **4.5:1** untuk teks normal, **3:1** untuk teks besar (≥24px)/ikon fungsional.
- `amber-500` tidak pernah jadi warna teks berdiri sendiri di atas latar terang (lihat 1.4).
- Setiap elemen interaktif punya **focus ring terlihat** (`teal-500`, 2px, offset 1px) — termasuk saat navigasi keyboard.
- Setiap interaksi drag (kanban, reorder sort priority) punya **alternatif non-drag** yang bergaya konsisten (dropdown "Pindahkan ke...", tombol naik/turun).
- `prefers-reduced-motion` dihormati secara global (lihat bagian 12).
- Ukuran target sentuh minimum 40×40px di seluruh tombol/ikon interaktif pada mobile.

---

## 14. Di Luar Cakupan (Out of Scope)

- **Dark mode**: tidak termasuk MVP. Seluruh token warna dirancang untuk light mode saja. Jika dibutuhkan di masa depan, disarankan menambahkan set token `dark:` yang dirancang ulang secara sadar — bukan sekadar invert otomatis dari palet ini.
- **RTL/multi-bahasa visual**: di luar cakupan; asumsi tata letak LTR (Bahasa Indonesia), selaras dengan Batasan & Asumsi pada PRD.

---

*Dokumen ini menjadi acuan untuk pembuatan `tailwind.config.js` dan mockup HTML tiap layar pada tahap berikutnya.*
