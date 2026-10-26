# RecruitFlow — Indeks & Panduan Pemakaian Dokumen
*Dokumen ini merangkum seluruh deliverable perencanaan & desain, serta urutan pemakaiannya saat masuk ke tahap development.*

---

## 1. Ringkasan Proyek

**RecruitFlow** — Recruitment Management System multi-tenant: job board publik lintas perusahaan + sistem manajemen pipeline rekrutmen untuk tim HR.

**Tech Stack**: Express.js (REST API) · Supabase (Postgres + Storage) · React + Vite + Tailwind CSS + Aceternity UI · Axios · Deploy: Railway (backend) & Vercel (frontend).

---

## 2. Daftar Dokumen & Urutan Baca

| # | Dokumen | Isi Utama | Kapan Dipakai |
|---|---|---|---|
| 1 | `01-PDD-RecruitFlow.md` | Masalah, target user, visi, business goals, success metrics | Konteks & alasan di balik keputusan produk |
| 2 | `02-PRD-RecruitFlow.md` | 7 modul utama (26 FR), functional & non-functional requirements, state machine, acceptance criteria | **Acuan utama** logika bisnis & validasi |
| 3 | `03-UIUX-Spec-RecruitFlow.md` | User flow, information architecture, UX rules, spesifikasi 8-dimensi 29 layar lengkap | Acuan struktur halaman, interaksi, layout & API mapping |
| 4 | `04-System-Architecture-Design-RecruitFlow.md` | Arsitektur, struktur backend, 70 API endpoint, physical DDL, pooling Port 6543, Resend SDK mailer | **Acuan utama** setup sistem & implementasi backend |
| 5 | `05-Design-System-RecruitFlow.md` | Token warna FSM, tipografi, 24+ komponen UI, spacing, responsive breakpoint, animasi, Tailwind config | Acuan desain antarmuka & konsistensi UI |
| 6 | `06-Product-Backlog-RecruitFlow.md` | Breakdown lengkap Epic → Feature → Story → Task → Priority → Estimasi, saran pembagian sprint | Acuan perencanaan & pelacakan progres development |
| 7 | `07-Test-Plan-RecruitFlow.md` | Arsitektur 5 tingkatan testing, tooling Vitest/Supertest/Puppeteer, protokol seeding & defect governance | **Acuan utama** verifikasi mutu & kriteria kelayakan rilis |

**Urutan baca rantai kebenaran**: PDD (01) → PRD (02) → UI/UX Spec (03) → System Architecture (04) → Design System (05) → Product Backlog (06) → Test Plan (07).

---

## 3. Aset Siap Pakai

| Aset | Lokasi | Catatan |
|---|---|---|
| `tailwind.config.js` | root output | Salin langsung ke root project frontend (Vite). Perlu install `@tailwindcss/typography` (lihat komentar di file). |
| 24 mockup HTML | folder `screens/` | Referensi visual & struktur DOM per halaman — **bukan kode produksi**, perlu diterjemahkan ke komponen React saat development. |

### Peta Mockup ↔ Kode Screen (UI/UX Spec v4.0)

| File / Mockup | Kode Screen | Nama Layar | Route yang Dituju |
|---|---|---|---|
| `landing.html` | **P-00** | Landing Page Utama Dua Sisi | `/` |
| `job-board.html` | **P-01** | Job Board Publik Terpadu | `/cari-lowongan` |
| `job-detail.html` | **P-02** | Detail Lowongan & Persyaratan | `/jobs/:jobId` |
| `company-profile.html` | **P-03** | Profil Perusahaan Publik | `/companies/:companySlug` |
| `candidate-auth.html` | **P-04** | Portal Masuk & Daftar Talenta | `/candidate/login`, `/candidate/register` |
| `application-form.html` | **P-05** | Formulir Lamaran Terstruktur 5 Langkah | `/jobs/:jobId/apply` |
| `application-confirmation.html` | **P-06** | Konfirmasi Lamaran Berhasil | `/jobs/:jobId/success` |
| `company-landing.html` | **P-07** | Landing Page Khusus Perusahaan | `/untuk-perusahaan` |
| `pricing.html` | **P-08** | Halaman Paket & Biaya Langganan | `/harga` |
| `candidate-dashboard.html` | **C-01** | Dasbor Utama & Ringkasan Lamaran | `/candidate/dashboard` |
| `application-detail.html` | **C-02** | Rincian Status Lamaran & Timeline Seleksi | `/candidate/dashboard/:applicationId` |
| `saved-jobs.html` | **C-03** | Daftar Lowongan Disimpan | `/candidate/saved-jobs` |
| `candidate-profile.html` | **C-04** | Penyuntingan Profil Talenta | `/candidate/profile` |
| `candidate-documents.html` | **C-05** | Pustaka Dokumen & Pengelolaan CV | `/candidate/profile/documents` |
| `company-auth.html` | **H-01** | Portal Masuk & Daftar Akun HR | `/company/login`, `/company/register` |
| `company-onboarding.html` | **H-02** | Pengisian Profil Perusahaan Awal | `/dashboard/onboarding` |
| `hr-dashboard.html` | **H-03** | Dasbor Ringkasan & Operasional HR | `/dashboard` |
| `company-profile-edit.html` | **H-04** | Manajemen Profil & Lokasi Perusahaan | `/dashboard/company-profile` |
| `team-management.html` | **H-05** | Manajemen Anggota Tim & Wewenang | `/dashboard/team` |
| `job-listings.html` | **H-06** | Manajemen Daftar Lowongan Kerja | `/dashboard/jobs` |
| `job-form.html` | **H-07** | Formulir Pembuatan & Penyuntingan Lowongan | `/dashboard/jobs/new`, `/dashboard/jobs/:jobId/edit` |
| `pipeline-board.html` | **H-08** | Papan Pipeline Pelamar Interaktif (Kanban) | `/dashboard/jobs/:jobId/pipeline` |
| `candidate-detail-hr.html` | **H-09** | Detail Profil & Rekam Jejak Pelamar | `/dashboard/candidates/:candidateId` |
| `candidate-database.html` | **H-10** | Pangkalan Data Seluruh Pelamar (Talent Pool) | `/dashboard/candidates` |
| `interview-calendar.html` | **H-11** | Kalender & Jadwal Wawancara Terpadu | `/dashboard/calendar` |
| `email-templates.html` | **H-12** | Manajemen Template Surat Keputusan Rekrutmen | `/dashboard/email-templates` |
| `analytics.html` | **H-13** | Dasbor Analitik & Efisiensi Rekrutmen | `/dashboard/analytics` |
| `interview-modal.html` | **H-14** | Modal Penjadwalan Wawancara & Deteksi Bentrok | Modal di `/dashboard/calendar` & `/dashboard/candidates/:id` |
| `decision-modal.html` | **H-15** | Modal Konfirmasi Keputusan Akhir (Offer/Reject)| Modal di `/dashboard/candidates/:id` |

---

## 4. Rekomendasi Urutan Development

Mengikuti System Design §7.3 (Sequencing), disesuaikan dengan modul PRD & Epic Product Backlog:

1. **Setup Fondasi** — inisialisasi project (Express + React/Vite), koneksi Supabase Postgres, migrasi skema tabel awal (bagian 4 System Design), setup CORS, env variables (bagian 6.2 System Design).
2. **E1–E2: Auth** — Custom Auth (bcrypt+JWT) untuk company & candidate (System Design §5). Screen: H-01, H-02, P-04.
3. **E3: Company Profile** — termasuk validasi kelengkapan (FR-3.2). Screen: H-04.
4. **E4 + E8: Job Posting & Pipeline** — termasuk builder custom questions & pipeline kustom. Screen: H-06, H-07, H-08.
5. **E5 + E6 + E13: Job Board, Aplikasi Kandidat, Tracking Portal** — Screen: P-01, P-02, P-03, P-05, P-06, C-01, C-02, C-03, C-04, C-05.
6. **E7, E9, E12, E10, E11: Operasional HR Lanjutan** — Candidate Management, Interview, Notes & Scoring, Decision, Email Template (sediakan template default lebih dulu sebelum E10). Screen: H-09, H-10, H-11, H-12.
7. **E15: Activity Log** — bangun paralel sejak tahap Pipeline agar semua modul tercatat sejak awal.
8. **E14: Analytics** — paling akhir. Screen: H-13.
9. **E administratif**: Team Management (H-05) — dapat dikerjakan kapan saja setelah Auth selesai, tidak bergantung modul lain.

---

## 5. Checklist Sebelum Mulai Coding

- [ ] Buat project Supabase, catat `DATABASE_URL` & buat 3 bucket Storage resmi: `logos` (Public), `banners` (Public), dan `resumes` (Private) — lihat Dokumen 04 §8.1.
- [ ] Siapkan layanan email pihak ketiga (untuk offer/reject/reset password saja — lihat prinsip notifikasi PRD §3A).
- [ ] Generate `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET` terpisah.
- [ ] Siapkan repo Railway (backend) & Vercel (frontend), catat domain masing-masing untuk `CORS_ORIGIN` & `VITE_API_BASE_URL`.
- [ ] Install `@tailwindcss/typography` di frontend (dibutuhkan untuk render deskripsi lowongan — lihat komentar `tailwind.config.js`).
- [ ] Import font **Poppins** & **JetBrains Mono** (Google Fonts, lihat Design.md §2.1).

---

## 6. Catatan Keputusan Kunci (Jangan Sampai Terlupa)

Ringkasan keputusan penting yang muncul sepanjang proses — supaya konsisten dijaga saat development:

- **Auth**: custom (bukan Supabase Auth) — dua tabel akun terpisah (`company_members` & `candidates`), dua middleware berbeda.
- **Notifikasi**: status lamaran real-time di sistem (Candidate Tracking Portal) adalah sumber kebenaran utama. Email **hanya** untuk hasil akhir (Hired/Rejected, opsional) + reset password. **Tidak ada** email rutin ke kandidat maupun ke HR.
- **Isolasi data kandidat**: akun kandidat bersifat global; satu perusahaan tidak boleh melihat riwayat lamaran kandidat ke perusahaan lain.
- **Status akhir**: tiga status terpisah — **Hired**, **Rejected** (aksi HR), **Withdrawn** (hanya aksi kandidat sendiri) — dianalisis terpisah di Analytics.
- **Pipeline**: tahap tengah dapat dikustomisasi per lowongan; tahap **Applied/Hired/Rejected/Withdrawn** selalu tetap (anchor), tidak bisa dihapus/diganti nama.
- **Dokumen kandidat**: koleksi CV berlabel + opsi upload khusus per lamaran; setiap lamaran menyimpan **snapshot** dokumen yang dipakai (tidak berubah meski dokumen di profil diganti kemudian).
- **Desain**: satu keluarga font (**Poppins**), italic eksklusif untuk logo/wordmark saja. Motif **Stage Rail** dipakai konsisten (fungsional di tracking/pipeline, ambient di hero publik). Footer gelap (`ink-700`) hanya di area publik non-auth.
- **Auto-close lowongan**: otomatis saat kuota penuh atau deadline lewat; HR bisa reopen manual.
- **Landing page**: `/` adalah halaman netral yang merepresentasikan **kandidat & perusahaan secara setara** (P-00), baru bercabang ke Job Board (`/cari-lowongan`) atau Landing Page Perusahaan (`/untuk-perusahaan`). Jangan perlakukan salah satu sisi sebagai "default/utama" — RecruitFlow adalah platform dua sisi yang saling bergantung.

---

*Selesai — dokumen ini menjadi titik referensi tunggal saat memulai fase development.*
