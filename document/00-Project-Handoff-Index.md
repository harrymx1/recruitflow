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
| 2 | `02-PRD-RecruitFlow.md` | 15 modul fitur, functional & non-functional requirements, user stories, acceptance criteria | **Acuan utama** saat menulis logika bisnis & validasi |
| 3 | `03-UIUX-Spec-RecruitFlow.md` | User flow, information architecture, UX rules, navigation, 26 screen specification | Acuan struktur halaman & alur navigasi |
| 4 | `04-System-Design-RecruitFlow.md` | Arsitektur, struktur backend, API design, database design, auth, deployment, ringkasan product backlog | **Acuan utama** saat setup project & implementasi backend |
| 5 | `07-Product-Backlog-RecruitFlow.md` | Breakdown lengkap 15 Epic → Feature → Story → Task → Priority → Estimasi, saran pembagian sprint | Acuan perencanaan & pelacakan progres development |
| 6 | `05-Design-System-RecruitFlow.md` | Warna, tipografi, komponen, spacing, responsive, animasi | Acuan setiap kali membuat/menyunting tampilan |
| 7 | `06-Screen-Component-Tracker.md` | Checklist 26 screen × komponen dipakai, urutan batch pembuatan | Referensi silang mockup ↔ dokumen |

**Urutan baca yang disarankan**: PDD → PRD → System Design (bagian Database & API) sambil buka mockup terkait di UI/UX Spec, baru mulai coding modul per modul.

---

## 3. Aset Siap Pakai

| Aset | Lokasi | Catatan |
|---|---|---|
| `tailwind.config.js` | root output | Salin langsung ke root project frontend (Vite). Perlu install `@tailwindcss/typography` (lihat komentar di file). |
| 24 mockup HTML | folder `screens/` | Referensi visual & struktur DOM per halaman — **bukan kode produksi**, perlu diterjemahkan ke komponen React saat development. |

### Peta Mockup ↔ Kode Screen (UI/UX Spec)

| File | Kode Screen | Route yang Dituju (lihat System Design §2.2–2.3) |
|---|---|---|
| `job-board.html` | P-01 | `/` |
| `job-detail.html` | P-02 | `/jobs/:jobId` |
| `company-profile.html` | P-03 | `/companies/:companySlug` |
| `candidate-auth.html` | P-04 | `/candidate/register`, `/candidate/login` |
| `application-form.html` | P-05 | `/jobs/:jobId/apply` |
| `application-confirmation.html` | P-06 | — (state setelah submit) |
| `candidate-dashboard.html` | C-01 | `/candidate/dashboard` |
| `application-detail.html` | C-02 | `/candidate/dashboard/:applicationId` |
| `saved-jobs.html` | C-03 | `/candidate/saved-jobs` |
| `candidate-profile.html` | C-04 | `/candidate/profile` |
| `candidate-documents.html` | C-05 | `/candidate/profile/documents` |
| `company-register.html` | H-01 | `/company/register` |
| `company-login.html` | H-02 | `/company/login` |
| `hr-dashboard.html` | H-03 | `/dashboard` |
| `company-profile-edit.html` | H-04 | `/dashboard/company-profile` |
| `team-management.html` | H-05 | `/dashboard/team` |
| `job-listings.html` | H-06 | `/dashboard/jobs` |
| `job-form.html` | H-07 | `/dashboard/jobs/new`, `/dashboard/jobs/:jobId/edit` |
| `pipeline-board.html` | H-08 | `/dashboard/jobs/:jobId/pipeline` |
| `candidate-detail-hr.html` | H-09 (+ modal H-14, H-15) | `/dashboard/candidates/:candidateId` |
| `candidate-database.html` | H-10 | `/dashboard/candidates` |
| `interview-calendar.html` | H-11 | `/dashboard/calendar` |
| `email-templates.html` | H-12 | `/dashboard/email-templates` |
| `analytics.html` | H-13 | `/dashboard/analytics` |

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

- [ ] Buat project Supabase, catat `DATABASE_URL` & buat bucket Storage (`company-assets`, `candidate-documents`, `candidate-photos`) — lihat System Design §6.3.
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

---

*Selesai — dokumen ini menjadi titik referensi tunggal saat memulai development di AntiGravity AI IDE.*
