# UI/UX Specification & Flow Document
## RecruitFlow — Recruitment Management System

*Dokumen ini merupakan turunan dari PRD dan menjadi acuan untuk tahap Design System (Design.md) dan pembuatan mockup halaman.*

---

## 1. User Flow

Sistem memiliki tiga kelompok pengguna dengan flow terpisah: **Kandidat (publik)**, **HR/Recruiter**, dan **Admin** (Admin memiliki semua akses HR ditambah manajemen tim & profil perusahaan).

### 1.1 Flow Kandidat — Menemukan & Melamar Pekerjaan

```
[Landing / Job Board]
   |
   |-- Search & Filter & Sort (tanpa login, bisa browse bebas)
   v
[Job Detail Page]
   |
   |-- Belum login? --> [Register/Login Kandidat] --> kembali ke Job Detail
   |
   v
[Form Aplikasi]
   |-- Isi/lengkapi profil (jika belum ada)
   |-- Pilih CV dari koleksi ATAU upload CV khusus lowongan ini
   |-- Isi cover letter (opsional)
   |-- Jawab custom questions dari HR (jika ada)
   |-- Isi "dari mana tahu lowongan ini" (opsional)
   v
[Konfirmasi Lamaran Terkirim]
   v
[Candidate Dashboard] --> lihat status real-time seluruh lamaran
   |
   |-- Status berubah (Screening/Interview/Offer/Hired/Rejected) --> notifikasi in-app
   |-- Interview dijadwalkan --> detail muncul di dashboard
   |-- Kandidat bisa: Withdraw lamaran aktif kapan saja
   |-- Kandidat bisa: buka [Lowongan Tersimpan] untuk melamar dari bookmark
```

### 1.2 Flow Kandidat — Membangun Profil (independen, bisa dilakukan sebelum melamar)

```
[Register Kandidat] --> [Lengkapi Profil]
   |-- Data pribadi
   |-- Pengalaman kerja (tambah multi entri)
   |-- Pendidikan (tambah multi entri)
   |-- Skills (tag)
   |-- Sertifikasi (opsional)
   |-- Tautan (LinkedIn, portofolio, dll)
   |-- Upload koleksi CV/dokumen (beri label masing-masing)
   |-- Preferensi (ekspektasi gaji, notice period)
   v
[Profil Siap Dipakai untuk Melamar]
```

### 1.3 Flow HR/Admin — Setup Awal Workspace

```
[Register Perusahaan] --> Admin otomatis aktif
   v
[Lengkapi Company Profile] (wajib sebelum bisa publish lowongan)
   |-- Logo, deskripsi, industri, lokasi, benefit, dll
   v
[Undang Anggota Tim HR] (opsional, kapan saja)
   v
[Dashboard Utama Siap Digunakan]
```

### 1.4 Flow HR — Membuat Lowongan & Mengelola Kandidat (alur inti)

```
[Dashboard] --> [Buat Lowongan Baru]
   |-- Isi detail lengkap (jenis kerja, lokasi, kuota, requirement, dll)
   |-- Tambahkan custom questions (opsional)
   |-- Atur pipeline (pakai default atau kustomisasi tahap)
   |-- Simpan sebagai Draft ATAU langsung Publish
   v
[Lowongan Tayang di Public Job Board]
   |
   v
[Kandidat Melamar] --> otomatis masuk kolom "Applied" di Pipeline
   v
[HR Buka Pipeline Board Lowongan Ini]
   |-- Review profil kandidat (klik kartu --> Candidate Detail)
   |-- Beri tag / catatan
   |-- Drag kandidat ke "Screening"
   v
[HR Jadwalkan Interview]
   |-- Isi tanggal, waktu, pewawancara
   |-- (Reschedule/cancel jika perlu)
   v
[Interview Selesai] --> HR isi skor & catatan evaluasi
   v
[HR Pindahkan ke "Offer" atau langsung ubah status]
   |
   |-- Hired --> (opsional) kirim surat offer resmi --> kuota otomatis berkurang
   |-- Rejected --> (opsional) kirim email penolakan resmi
   |
   v
[Lowongan otomatis Closed jika kuota penuh / deadline lewat]
```

### 1.5 Flow HR — Melihat Analitik

```
[Dashboard] --> [Analytics]
   |-- Pilih rentang waktu / lowongan tertentu
   v
[Lihat funnel, time-to-hire, sumber kandidat]
```

---

## 2. Information Architecture

### 2.1 Area Publik (tanpa login / akses umum)

```
/                              → Job Board (home)
/jobs/:jobId                   → Detail Lowongan
/companies/:companySlug        → Profil Perusahaan Publik
/candidate/register             → Registrasi Kandidat
/candidate/login                 → Login Kandidat
/candidate/forgot-password       → Lupa Password Kandidat
```

### 2.2 Area Kandidat (butuh login)

```
/candidate/dashboard             → Daftar status lamaran
/candidate/dashboard/:applicationId → Detail satu lamaran (status, jadwal interview, tombol withdraw)
/candidate/saved-jobs             → Lowongan tersimpan
/candidate/profile                → Edit profil lengkap
/candidate/profile/documents      → Kelola koleksi CV/dokumen
```

### 2.3 Area Perusahaan/HR (butuh login, role-aware)

```
/company/register                 → Registrasi perusahaan (Admin)
/company/login                    → Login HR/Admin
/company/forgot-password          → Lupa password HR/Admin

/dashboard                        → Ringkasan/analytics utama
/dashboard/company-profile        → Edit profil perusahaan
/dashboard/team                   → Manajemen anggota tim (Admin only)

/dashboard/jobs                   → Daftar semua lowongan
/dashboard/jobs/new               → Buat lowongan baru
/dashboard/jobs/:jobId/edit       → Edit lowongan
/dashboard/jobs/:jobId/pipeline   → Kanban pipeline kandidat lowongan ini

/dashboard/candidates             → Database kandidat (search/filter lintas lowongan)
/dashboard/candidates/:candidateId → Detail kandidat (profil, notes, skor, activity log)

/dashboard/calendar                → Kalender interview
/dashboard/email-templates         → Kelola template offer & reject
/dashboard/analytics                → Analitik detail (funnel, time-to-hire, sumber kandidat)
```

**Catatan navigasi:** area Kandidat dan area Perusahaan/HR menggunakan sistem autentikasi terpisah (lihat PRD Modul 2.1 & 2.2) dan tidak saling bisa diakses dengan akun yang sama.

---

## 3. UX Rules

### 3.1 Prinsip Umum
- **Mobile-first untuk area publik** (Job Board, Job Detail, Company Profile, form aplikasi) — mayoritas kandidat mengakses dari HP.
- **Desktop-first (dioptimalkan tablet ke atas) untuk area HR/Admin** — kanban pipeline dan tabel data lebih nyaman di layar lebar; tetap harus dapat digunakan di tablet.
- Setiap aksi yang mengubah data (drag pipeline, withdraw, publish, dsb.) memberi **feedback instan** (optimistic UI + toast konfirmasi), tidak boleh terasa "diam" setelah diklik.
- Setiap error validasi ditampilkan **inline di dekat field terkait**, bukan hanya alert generik di atas halaman.

### 3.2 Filter & Sort (Job Board)
- Filter multi-select ditampilkan sebagai chip/tag yang aktif, dapat dihapus satu per satu.
- Kriteria sort yang dipilih tampil sebagai **daftar berurutan** (mis. list bernomor 1, 2, 3) dengan handle drag untuk reorder, dan tombol hapus per item.
- Perubahan filter/sort langsung memperbarui hasil (tanpa perlu klik tombol "Terapkan" terpisah), namun tetap tercermin di URL agar dapat dibagikan.
- Jumlah hasil ditampilkan di atas daftar (mis. "128 lowongan ditemukan").

### 3.3 Pipeline (Kanban)
- Kolom pipeline mengikuti konfigurasi tahap masing-masing lowongan (default atau kustom).
- Kolom "Rejected" dan "Withdrawn" ditampilkan terpisah dari alur utama (mis. dikelompokkan di ujung kanan atau dapat disembunyikan/expand), agar alur aktif tidak visually penuh oleh kandidat yang sudah keluar dari proses.
- Kartu kandidat menampilkan minimal: nama, tag (jika ada), skor rata-rata (jika sudah dinilai), indikator jadwal interview terdekat.
- Withdrawn hanya muncul dari aksi kandidat — kartu yang berpindah ke kolom ini ditandai visual berbeda (mis. warna netral/abu-abu) agar HR paham ini bukan keputusan mereka.

### 3.4 Formulir Panjang (Job Posting, Profil Kandidat)
- Dipecah menjadi **beberapa langkah/section** dengan progress indicator, bukan satu form panjang tanpa jeda.
- Perubahan tersimpan otomatis sebagai draft (khususnya form job posting & profil kandidat) agar tidak hilang jika pengguna keluar di tengah jalan.

### 3.5 Status & Empty State
- Setiap status lamaran memakai label & warna konsisten di seluruh sistem (mis. Applied = biru netral, Interview = kuning/ungu, Hired = hijau, Rejected = merah muda, Withdrawn = abu-abu).
- Halaman dengan data kosong (belum ada lowongan, belum ada kandidat, dsb.) menampilkan ilustrasi/pesan + call-to-action yang jelas (mis. "Belum ada lowongan aktif — buat lowongan pertama Anda").

### 3.6 Kelengkapan Data
- Indikator progres kelengkapan profil (perusahaan maupun kandidat) ditampilkan sebagai progress bar/persentase, dengan daftar field yang belum terisi.
- Tombol "Publish" pada job posting dan aktivasi profil perusahaan dinonaktifkan (disabled, dengan tooltip alasan) selama syarat minimum belum terpenuhi.

### 3.7 Aksesibilitas Dasar
- Kontras warna teks-latar minimal memenuhi standar keterbacaan umum.
- Seluruh aksi penting (drag-and-drop pipeline, reorder sort) memiliki alternatif non-drag (mis. dropdown "Pindahkan ke tahap...", tombol naik/turun pada daftar prioritas sort) untuk pengguna yang kesulitan drag-and-drop.

---

## 4. Navigation

### 4.1 Area Publik
- **Top navbar**: Logo RecruitFlow · Cari Lowongan (aktif di Job Board) · Login/Register Kandidat (kanan atas) — konsisten di seluruh halaman publik.
- **Company Profile page**: navbar publik yang sama + tab internal (Tentang · Lowongan Aktif).

### 4.2 Area Kandidat
- **Top navbar (setelah login)**: Logo · Cari Lowongan · Lowongan Tersimpan · Dashboard Saya · Avatar/menu profil (dropdown: Edit Profil, Dokumen Saya, Logout).

### 4.3 Area HR/Admin
- **Sidebar kiri (persisten)**:
  - Dashboard (ringkasan analytics)
  - Lowongan
  - Kandidat
  - Kalender
  - Analitik
  - Template Email
  - Profil Perusahaan
  - Tim (khusus tampil untuk Admin)
- **Top bar**: nama workspace aktif, notifikasi in-app (bell icon), avatar/menu akun (Logout).
- Struktur sidebar tetap sama untuk Admin & HR/Recruiter; menu "Tim" disembunyikan untuk role HR/Recruiter biasa (role-based visibility, bukan halaman error).

---

## 5. Screen Specification

*Setiap entri berisi: Tujuan halaman, Komponen/section utama, Aksi utama. Detail visual (warna, tipografi, komponen presisi) mengacu ke Design.md pada tahap berikutnya.*

### 5.1 Area Publik

**[P-01] Job Board (Home)** — `/`
- Tujuan: titik masuk utama pencarian kerja lintas perusahaan.
- Komponen: search bar, panel filter (sidebar/collapsible di mobile), panel sort berprioritas, grid/list kartu lowongan (logo perusahaan, judul, lokasi, jenis kerja, jumlah pelamar/kuota), pagination/infinite scroll.
- Aksi utama: cari, filter, atur prioritas sort, klik kartu → Job Detail, bookmark langsung dari kartu (jika sudah login).

**[P-02] Job Detail** — `/jobs/:jobId`
- Tujuan: informasi lengkap satu lowongan + entry point melamar.
- Komponen: header (judul, perusahaan, lokasi, jenis kerja, kuota terisi/total), deskripsi, tanggung jawab, kualifikasi, benefit posisi, info perusahaan singkat (link ke Company Profile), tombol Lamar & Simpan.
- Aksi utama: klik "Lamar Sekarang" (redirect ke login jika belum, lalu ke Form Aplikasi), simpan lowongan.

**[P-03] Company Profile (Publik)** — `/companies/:companySlug`
- Tujuan: etalase perusahaan.
- Komponen: banner & logo, deskripsi, industri/ukuran/lokasi, benefit umum, galeri (opsional), daftar lowongan aktif dari perusahaan ini.
- Aksi utama: klik lowongan → Job Detail.

**[P-04] Register / Login Kandidat** — `/candidate/register`, `/candidate/login`
- Tujuan: autentikasi akun kandidat.
- Komponen: form email/password, link lupa password, link ke halaman satunya (register↔login).
- Aksi utama: submit form, redirect kembali ke halaman asal (mis. Job Detail) setelah berhasil.

**[P-05] Form Aplikasi** — bagian dari `/jobs/:jobId` (modal/step) atau route terpisah `/jobs/:jobId/apply`
- Tujuan: mengumpulkan seluruh data lamaran dalam satu alur.
- Komponen (multi-step): Step 1 Review Profil (edit cepat jika perlu) → Step 2 Pilih/Upload CV & dokumen → Step 3 Cover letter & custom questions dari HR → Step 4 Sumber info lowongan (opsional) → Step 5 Review & Kirim.
- Aksi utama: kirim lamaran; sistem mencegah submit ganda ke lowongan yang sama (menampilkan status lamaran existing jika ada).

**[P-06] Konfirmasi Lamaran Terkirim**
- Tujuan: kepastian bahwa lamaran berhasil masuk.
- Komponen: pesan sukses, ringkasan lowongan yang dilamar, tombol ke Dashboard Kandidat / kembali ke Job Board.

### 5.2 Area Kandidat

**[C-01] Candidate Dashboard** — `/candidate/dashboard`
- Tujuan: pusat pemantauan seluruh lamaran.
- Komponen: daftar kartu lamaran (judul lowongan, perusahaan, status badge, tanggal apply/terakhir update), filter status.
- Aksi utama: klik kartu → detail lamaran.

**[C-02] Detail Lamaran** — `/candidate/dashboard/:applicationId`
- Tujuan: status rinci satu lamaran + histori tahap.
- Komponen: timeline status (Applied → ... → hasil akhir), detail jadwal interview (jika ada), dokumen yang dipakai pada lamaran ini (snapshot).
- Aksi utama: tombol "Tarik Lamaran" (withdraw) — muncul hanya jika status masih aktif, dengan dialog konfirmasi.

**[C-03] Lowongan Tersimpan** — `/candidate/saved-jobs`
- Tujuan: daftar bookmark.
- Komponen: grid kartu lowongan tersimpan (sama seperti kartu di Job Board), indikator jika lowongan sudah closed/expired.
- Aksi utama: hapus bookmark, klik → Job Detail untuk melamar.

**[C-04] Edit Profil Kandidat** — `/candidate/profile`
- Tujuan: kelola seluruh data profil (lihat PRD FR-6.1).
- Komponen: section per kategori data (data pribadi, ringkasan, pengalaman kerja [repeatable], pendidikan [repeatable], skills [tag input], sertifikasi [repeatable], tautan, preferensi), progress kelengkapan profil.
- Aksi utama: simpan per section (auto-save).

**[C-05] Dokumen Saya** — `/candidate/profile/documents`
- Tujuan: kelola koleksi CV/dokumen berlabel.
- Komponen: daftar dokumen dengan label, tanggal upload, tombol unggah baru, rename label, hapus.
- Aksi utama: upload, beri/ubah label, hapus dokumen (dengan peringatan jika dokumen sedang dipakai di lamaran aktif).

### 5.3 Area Perusahaan/HR

**[H-01] Register Perusahaan** — `/company/register`
- Komponen: form nama perusahaan, nama Admin, email, password.
- Aksi utama: submit → langsung masuk ke alur Lengkapi Company Profile.

**[H-02] Login HR/Admin** — `/company/login`
- Komponen: form email/password, link lupa password.

**[H-03] Dashboard Utama** — `/dashboard`
- Tujuan: ringkasan cepat kondisi rekrutmen perusahaan.
- Komponen: kartu ringkasan (lowongan aktif, total kandidat, interview minggu ini), grafik funnel ringkas, daftar aktivitas terbaru.
- Aksi utama: shortcut ke "Buat Lowongan Baru".

**[H-04] Company Profile (Edit)** — `/dashboard/company-profile`
- Komponen: sama seperti field pada PRD FR-3.1, dengan indikator kelengkapan & preview tampilan publik.
- Aksi utama: simpan, lihat preview publik.

**[H-05] Manajemen Tim** — `/dashboard/team` *(khusus Admin)*
- Komponen: daftar anggota (nama, email, role, status aktif), form undang anggota baru.
- Aksi utama: undang, nonaktifkan/hapus anggota.

**[H-06] Daftar Lowongan** — `/dashboard/jobs`
- Komponen: tabel/list lowongan (judul, status, kuota terisi, jumlah pelamar, tanggal publish/deadline), filter status.
- Aksi utama: buat lowongan baru, klik lowongan → edit atau ke pipeline.

**[H-07] Buat/Edit Lowongan** — `/dashboard/jobs/new`, `/dashboard/jobs/:jobId/edit`
- Tujuan: form lengkap job posting (multi-section, lihat PRD FR-4.1).
- Komponen tambahan penting: builder custom questions (tambah/hapus pertanyaan, pilih tipe: pilihan ganda/isian singkat/esai), builder pipeline kustom (tampilkan default 5 tahap, izinkan tambah/hapus/rename tahap tengah, dengan Applied/Hired/Rejected/Withdrawn terkunci sebagai anchor — lihat UX Rule 3.6 untuk validasi publish).
- Aksi utama: simpan draft, publish.

**[H-08] Pipeline Board** — `/dashboard/jobs/:jobId/pipeline`
- Tujuan: kanban inti pengelolaan kandidat per lowongan.
- Komponen: kolom sesuai tahap lowongan ini, kartu kandidat (lihat UX Rule 3.3), kolom Rejected/Withdrawn terpisah/collapsible.
- Aksi utama: drag-and-drop kartu (+ alternatif dropdown "Pindahkan ke..."), klik kartu → Candidate Detail.

**[H-09] Candidate Detail (sisi HR)** — `/dashboard/candidates/:candidateId`
- Tujuan: satu tempat lengkap untuk mengevaluasi kandidat (memenuhi prinsip "tidak perlu kanal lain").
- Komponen (tab/section): Profil Lengkap (data pribadi, pengalaman, pendidikan, skill, sertifikasi, tautan), Dokumen Lamaran (CV & lampiran yang dipakai untuk lamaran ini), Jawaban Custom Questions, Notes & Skor (daftar catatan + skor individual + rata-rata), Jadwal Interview terkait, Activity Log, Tag.
- Aksi utama: tambah catatan, beri skor, tambah/hapus tag, ubah status (termasuk trigger Decision modal), jadwalkan interview.

**[H-10] Database Kandidat** — `/dashboard/candidates`
- Tujuan: pencarian kandidat lintas lowongan dalam satu perusahaan.
- Komponen: search bar, filter (skill, tag, status, lowongan), tabel/grid hasil.
- Aksi utama: klik kandidat → Candidate Detail.

**[H-11] Kalender Interview** — `/dashboard/calendar`
- Komponen: tampilan mingguan/bulanan, event = jadwal interview (klik untuk detail/reschedule/cancel).
- Aksi utama: buat jadwal baru dari kalender langsung, reschedule via drag atau form edit.

**[H-12] Template Email** — `/dashboard/email-templates`
- Komponen: dua editor template (Offer, Reject), daftar variabel dinamis yang tersedia, preview.
- Aksi utama: edit & simpan template.

**[H-13] Analitik** — `/dashboard/analytics`
- Komponen: filter rentang waktu/lowongan, funnel chart (dengan Rejected & Withdrawn terpisah), rata-rata time-to-hire, distribusi sumber kandidat, tabel breakdown per lowongan.

**[H-14 — Modal] Jadwalkan/Reschedule Interview**
- Muncul dari Pipeline Board / Candidate Detail / Kalender.
- Komponen: tanggal, waktu, jenis (online/offline + link/lokasi), pewawancara, catatan.

**[H-15 — Modal] Decision (Hired/Rejected)**
- Muncul dari Pipeline Board / Candidate Detail saat status diubah ke Hired atau Rejected.
- Komponen: konfirmasi perubahan status, toggle "Kirim email resmi sekarang?" (dengan preview template terisi variabel), opsi "Nanti saja" (status tetap berubah, email dapat dikirim kemudian dari Candidate Detail).

---

*Dokumen ini menjadi acuan untuk penyusunan Design System (Design.md) dan pembuatan mockup halaman pada tahap berikutnya.*
