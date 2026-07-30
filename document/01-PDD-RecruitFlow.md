# Product Definition Document (PDD)
## RecruitFlow — Recruitment Management System

---

## 1. Latar Belakang & Masalah yang Diselesaikan

Proses rekrutmen di banyak perusahaan kecil-menengah masih dilakukan secara terfragmentasi: lowongan diposting manual di berbagai platform, data kandidat tersebar di spreadsheet dan email, jadwal interview dikoordinasikan lewat chat pribadi, dan tidak ada visibilitas terpusat mengenai di tahap mana setiap kandidat berada dalam proses seleksi.

Akibatnya:
- **Waktu rekrutmen (time-to-hire) menjadi lama** karena koordinasi manual antar tim.
- **Kandidat kehilangan kejelasan status** lamaran mereka, yang berdampak pada pengalaman kandidat (candidate experience) dan citra perusahaan.
- **Tidak ada data historis terstruktur** untuk mengevaluasi efektivitas proses rekrutmen (mis. sumber kandidat terbaik, tahap mana yang paling banyak kehilangan kandidat, dsb).
- **Komunikasi dengan kandidat tidak konsisten**, karena bergantung pada template pribadi masing-masing recruiter.

RecruitFlow hadir sebagai platform terpusat yang menyatukan seluruh alur rekrutmen — mulai dari pembukaan lowongan, pelacakan kandidat, penjadwalan interview, hingga keputusan akhir (offer/reject) — dalam satu sistem yang bisa diakses oleh tim HR sekaligus kandidat.

---

## 2. Target Pengguna

RecruitFlow adalah platform **dua sisi (two-sided platform)** — nilai produk ini hanya terwujud jika **kedua sisi** aktif digunakan secara bersamaan. Job board tanpa kandidat yang mencari kerja tidak ada gunanya bagi perusahaan; sebaliknya, sistem pelacakan lamaran tanpa perusahaan yang membuka lowongan tidak ada gunanya bagi kandidat. Karena itu, kedua kelompok pengguna berikut diperlakukan **setara**, bukan sebagai utama dan tambahan.

### 2.1 Perusahaan / Tim HR (Internal)
- Perusahaan kecil-menengah yang belum memiliki sistem ATS (Applicant Tracking System) formal, masih mengandalkan spreadsheet/email.
- Berperan sebagai pengelola workspace perusahaan: membuka lowongan, mengelola kandidat, menjadwalkan interview, hingga membuat keputusan.
- Terdiri dari dua peran di dalam workspace:
  - **Admin** — mengelola workspace, pengguna, dan seluruh data rekrutmen perusahaan.
  - **HR/Recruiter** — menjalankan operasional rekrutmen sehari-hari (posting lowongan, mengelola pipeline, menjadwalkan interview, dsb).

### 2.2 Kandidat / Pencari Kerja (Eksternal, Publik)
- Pencari kerja yang menemukan lowongan lewat job board lintas perusahaan maupun halaman karier masing-masing perusahaan.
- Melamar langsung melalui portal tanpa perlu proses onboarding yang rumit, dan tanpa perlu kanal komunikasi tambahan (email/WA) untuk melengkapi lamaran.
- Dapat memantau status lamaran mereka secara real-time, ke perusahaan manapun di platform, lewat satu akun.

*Implikasi desain: halaman masuk (landing page) platform harus merepresentasikan **kedua** sisi ini secara setara, bukan memprioritaskan salah satu — lihat UI/UX Specification untuk detail alur masing-masing.*

---

## 3. Visi Produk

> Menjadi platform rekrutmen terpusat yang memudahkan perusahaan mengelola seluruh siklus hidup rekrutmen — dari pembukaan lowongan hingga onboarding kandidat terpilih — sekaligus memberikan pengalaman yang transparan dan profesional bagi kandidat.

RecruitFlow dirancang sebagai solusi **multi-tenant**, di mana setiap perusahaan memiliki workspace terisolasi dengan data, tim, dan halaman karier publik masing-masing — memungkinkan produk ini digunakan oleh banyak perusahaan sekaligus dalam satu platform.

---

## 4. Business Goals

1. **Efisiensi Operasional** — Mengurangi waktu yang dihabiskan tim HR untuk tugas administratif rekrutmen (koordinasi manual, pencarian data kandidat, penjadwalan) melalui satu sistem terpusat.
2. **Sentralisasi Data Kandidat** — Menghilangkan ketergantungan pada spreadsheet/email dengan menyediakan database kandidat yang terstruktur dan dapat dicari.
3. **Transparansi Proses** — Memberikan visibilitas status lamaran secara real-time kepada kandidat, meningkatkan candidate experience.
4. **Standardisasi Komunikasi** — Menyediakan template komunikasi yang konsisten (offer, reject, undangan interview) untuk menjaga citra profesional perusahaan.
5. **Skalabilitas Multi-Perusahaan** — Membangun arsitektur yang mendukung banyak perusahaan (tenant) menggunakan platform yang sama tanpa saling mengganggu data satu sama lain.
6. **Insight Berbasis Data** — Menyediakan analitik dasar mengenai performa proses rekrutmen (funnel, time-to-hire, sumber kandidat) untuk mendukung keputusan berbasis data.

---

## 5. Success Metrics

| Kategori | Metrik | Target Indikatif |
|---|---|---|
| Efisiensi Proses | Rata-rata time-to-hire (dari job posting hingga offer diterima) | Berkurang dibanding proses manual |
| Adopsi Fitur | Persentase lowongan yang menggunakan pipeline terstruktur (bukan status manual) | >90% job posting aktif |
| Engagement Kandidat | Persentase kandidat yang mengecek status lamaran via portal | Terukur sebagai indikator transparansi |
| Efektivitas Funnel | Conversion rate per tahap pipeline (Applied → Screening → Interview → Offer → Hired) | Teridentifikasi bottleneck per tahap |
| Kualitas Data | Persentase kandidat dengan data lengkap (CV, kontak, catatan interview) | >95% |
| Skalabilitas Sistem | Jumlah workspace (perusahaan) yang dapat berjalan simultan tanpa isolasi data bocor | 100% data terisolasi antar tenant |

---

## 6. Ruang Lingkup (High-Level)

**Termasuk dalam scope awal:**
- Multi-tenant workspace per perusahaan
- Manajemen lowongan kerja (job posting)
- Halaman karier publik per perusahaan
- Portal aplikasi & tracking status untuk kandidat
- Manajemen kandidat & pipeline rekrutmen (kanban-style)
- Penjadwalan interview & kalender
- Template email (offer, reject, undangan interview)
- Catatan (notes) internal per kandidat
- Dashboard analitik dasar
- Landing page & halaman harga (informasional, untuk kebutuhan pemasaran)

**Di luar scope awal (dapat menjadi pengembangan lanjutan):**
- Resume parsing otomatis
- Integrasi kalender eksternal (Google Calendar, dsb.)
- Sistem penggajian/payroll & onboarding karyawan penuh
- Aplikasi mobile native
- **Enforcement pembatasan fitur berdasarkan paket harga** (mis. batas jumlah lowongan aktif untuk paket gratis) beserta integrasi payment gateway — halaman harga pada versi ini murni informasional; seluruh fitur yang dijabarkan di PRD tetap tersedia penuh untuk workspace manapun.

---

*Dokumen ini menjadi acuan dasar untuk penyusunan Product Requirements Document (PRD) pada tahap berikutnya.*
