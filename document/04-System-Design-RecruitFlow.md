# System Design Document
## RecruitFlow — Recruitment Management System

*Dokumen ini merupakan turunan dari PRD & UI/UX Spec, menjadi acuan teknis untuk implementasi. Keputusan arsitektur: Custom Authentication di Express (bcrypt + JWT), Supabase digunakan murni sebagai Postgres Database terkelola + Object Storage.*

---

## 1. Software Architecture

### 1.1 Gambaran Umum

```
┌─────────────────────┐        HTTPS / JSON (Axios)        ┌──────────────────────┐
│   Frontend (React)   │ ─────────────────────────────────> │   Backend (Express)   │
│  Vite + Tailwind +    │ <───────────────────────────────── │   RESTful API          │
│  Aceternity UI         │                                    │                        │
│  Hosting: Vercel        │                                    │  Hosting: Railway       │
└─────────────────────────┘                                    └───────────┬────────────┘
                                                                             │
                                              ┌──────────────────────────────┼───────────────────────────┐
                                              │                              │                            │
                                     Postgres (via pg / supabase-js   Supabase Storage         Email Service (pihak ketiga,
                                     dgn service role, server-side)   (CV, logo, foto)          mis. Resend) — hanya utk
                                              │                              │                  offer/reject/reset password
                                              v                              v
                                    ┌───────────────────┐          ┌───────────────────┐
                                    │  Supabase Postgres  │          │  Supabase Storage   │
                                    │  (Database murni)    │          │  (Object Storage)     │
                                    └───────────────────┘          └───────────────────┘
```

**Prinsip kunci:**
- Frontend **tidak pernah** bicara langsung ke Supabase untuk data bisnis — semua lewat Express API. Ini menjaga RESTful API sebagai satu-satunya pintu masuk logika bisnis (validasi, otorisasi, aturan tenant).
- Frontend **boleh** upload file langsung ke Supabase Storage menggunakan **signed URL** yang diterbitkan oleh Express (lihat bagian 6.3) — supaya file besar (CV, dsb.) tidak membebani server Express/Railway.
- Supabase hanya berperan sebagai *managed Postgres* + *object storage*, bukan sebagai Auth provider (sesuai keputusan Custom Auth).

### 1.2 Pola Arsitektur Backend

Backend menggunakan pola berlapis (layered architecture):

```
Route → Controller → Service → Repository → Database
                 ↑
            Middleware (auth, tenant-scope, validate, rate-limit)
```

- **Route**: definisi endpoint & method HTTP.
- **Controller**: menerima request, memanggil service, membentuk response. Tidak ada logika bisnis di sini.
- **Service**: seluruh logika bisnis (mis. validasi kuota lowongan, aturan pipeline anchor, dsb).
- **Repository**: satu-satunya lapisan yang menyentuh query database.
- **Middleware**: `authenticateCompany` / `authenticateCandidate` (verifikasi JWT), `requireRole('admin')`, `scopeToCompany` (menyisipkan `company_id` dari token ke context request), `validateBody` (Zod schema), `rateLimiter` (endpoint publik).

### 1.3 Strategi Multi-Tenant

Pendekatan: **shared database, shared schema, kolom `company_id`** pada seluruh tabel yang scoped ke perusahaan (jobs, applications view, candidate_tags, notes, dll).

- Isolasi tenant ditegakkan di **lapisan aplikasi**: setiap query pada Repository yang menyentuh data perusahaan **wajib** menyertakan filter `company_id` yang diambil dari token pengguna yang sedang login (bukan dari parameter request, untuk mencegah manipulasi).
- Karena Auth bersifat custom (bukan Supabase Auth), Row-Level Security (RLS) bawaan Supabase tidak otomatis dapat memanfaatkan `auth.uid()`. RLS tetap **direkomendasikan sebagai lapisan pertahanan kedua** menggunakan koneksi database dengan role terbatas per tenant konteks (opsional, dapat ditambahkan pasca-MVP); untuk MVP, isolasi cukup ditegakkan konsisten di Repository layer dengan pola yang seragam (mis. base repository yang selalu mewajibkan `company_id`).
- Tabel kandidat (`candidates`, `candidate_profiles`, dst.) **tidak** memiliki `company_id` karena bersifat global lintas perusahaan (sesuai PRD NFR Isolasi Data Kandidat) — perusahaan hanya mengakses data kandidat **melalui relasi `applications`** yang menunjuk ke `job_id` milik perusahaan mereka.

---

## 2. Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # koneksi Postgres (Supabase connection string)
│   │   ├── storage.js            # klien Supabase Storage (service role)
│   │   ├── env.js                # loader & validator environment variables
│   │   └── mailer.js             # konfigurasi layanan email pihak ketiga
│   ├── routes/
│   │   ├── auth.company.routes.js
│   │   ├── auth.candidate.routes.js
│   │   ├── companies.routes.js
│   │   ├── jobs.routes.js
│   │   ├── jobBoard.routes.js     # endpoint publik (search/filter/sort)
│   │   ├── candidates.routes.js   # profil kandidat (sisi kandidat)
│   │   ├── applications.routes.js
│   │   ├── pipeline.routes.js
│   │   ├── interviews.routes.js
│   │   ├── decisions.routes.js
│   │   ├── emailTemplates.routes.js
│   │   ├── notes.routes.js
│   │   ├── analytics.routes.js
│   │   ├── activityLogs.routes.js
│   │   └── uploads.routes.js       # signed URL generator
│   ├── controllers/                # 1 file per resource, paralel dgn routes
│   ├── services/                   # 1 file per resource, logika bisnis
│   ├── repositories/                # 1 file per tabel/agregat, query DB
│   ├── middlewares/
│   │   ├── authenticateCompany.js
│   │   ├── authenticateCandidate.js
│   │   ├── requireRole.js
│   │   ├── scopeToCompany.js
│   │   ├── validateBody.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── validators/                  # skema Zod per endpoint
│   ├── utils/
│   │   ├── password.js              # wrapper bcrypt
│   │   ├── jwt.js                   # sign/verify access & refresh token
│   │   ├── slugify.js
│   │   ├── pagination.js
│   │   └── sortPriority.js          # util membangun ORDER BY dari sort berprioritas
│   ├── jobs-scheduler/
│   │   └── autoCloseJobPostings.js   # cron: tutup lowongan saat kuota penuh/deadline lewat
│   ├── app.js                        # setup express, middleware global, CORS
│   └── server.js                     # entry point
├── tests/
├── .env.example
└── package.json
```

---

## 3. API Design

*Ringkasan endpoint utama, dikelompokkan per modul PRD. `Auth` menunjukkan tipe akses: `Publik`, `Kandidat`, `Perusahaan:Any` (Admin/HR), `Perusahaan:Admin` (khusus Admin).*

### 3.1 Autentikasi

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | /api/auth/company/register | Publik | Registrasi perusahaan + akun Admin |
| POST | /api/auth/company/login | Publik | Login HR/Admin |
| POST | /api/auth/company/refresh | Publik (refresh token) | Perbarui access token |
| POST | /api/auth/company/logout | Perusahaan:Any | Revoke refresh token |
| POST | /api/auth/company/forgot-password | Publik | Kirim email reset password |
| POST | /api/auth/company/reset-password | Publik (token reset) | Set password baru |
| POST | /api/auth/candidate/register | Publik | Registrasi akun kandidat |
| POST | /api/auth/candidate/login | Publik | Login kandidat |
| POST | /api/auth/candidate/refresh | Publik (refresh token) | Perbarui access token |
| POST | /api/auth/candidate/forgot-password | Publik | Kirim email reset password |
| POST | /api/auth/candidate/reset-password | Publik (token reset) | Set password baru |

### 3.2 Company Profile & Tim (PRD Modul 2.3, 2.1)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | /api/dashboard/company | Perusahaan:Any | Ambil profil perusahaan sendiri |
| PUT | /api/dashboard/company | Perusahaan:Admin | Update profil perusahaan |
| GET | /api/companies/:slug | Publik | Profil perusahaan publik |
| GET | /api/dashboard/team | Perusahaan:Any | Daftar anggota tim |
| POST | /api/dashboard/team/invite | Perusahaan:Admin | Undang anggota HR baru |
| PATCH | /api/dashboard/team/:memberId | Perusahaan:Admin | Aktif/nonaktifkan anggota |

### 3.3 Job Posting & Job Board (PRD Modul 2.4, 2.5)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | /api/job-board | Publik | List lowongan + query: `q, location[], type[], arrangement[], level[], salaryMin, salaryMax, companySlug[], sort[]` (`sort` menerima array berurutan sesuai prioritas, mis. `sort=relevance,newest,quota_desc`) |
| GET | /api/job-board/:jobId | Publik | Detail lowongan publik |
| GET | /api/dashboard/jobs | Perusahaan:Any | List lowongan milik perusahaan |
| POST | /api/dashboard/jobs | Perusahaan:Any | Buat lowongan (draft) |
| GET | /api/dashboard/jobs/:jobId | Perusahaan:Any | Detail lowongan (sisi HR) |
| PUT | /api/dashboard/jobs/:jobId | Perusahaan:Any | Update lowongan |
| POST | /api/dashboard/jobs/:jobId/publish | Perusahaan:Any | Publish (validasi kelengkapan) |
| POST | /api/dashboard/jobs/:jobId/close | Perusahaan:Any | Tutup manual |
| POST | /api/dashboard/jobs/:jobId/reopen | Perusahaan:Any | Buka kembali |
| GET/PUT | /api/dashboard/jobs/:jobId/pipeline-stages | Perusahaan:Any | Lihat/atur tahap pipeline kustom |
| GET/POST | /api/dashboard/jobs/:jobId/custom-questions | Perusahaan:Any | Kelola pertanyaan seleksi |

### 3.4 Candidate Profile (PRD Modul 2.6)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET/PUT | /api/candidates/me/profile | Kandidat | Data pribadi & ringkasan |
| GET/POST/PUT/DELETE | /api/candidates/me/experiences | Kandidat | CRUD pengalaman kerja |
| GET/POST/PUT/DELETE | /api/candidates/me/educations | Kandidat | CRUD pendidikan |
| GET/PUT | /api/candidates/me/skills | Kandidat | Kelola skill tags |
| GET/POST/PUT/DELETE | /api/candidates/me/certifications | Kandidat | CRUD sertifikasi |
| GET/POST/PUT/DELETE | /api/candidates/me/links | Kandidat | CRUD tautan |
| GET/POST/DELETE | /api/candidates/me/documents | Kandidat | Kelola koleksi CV/dokumen berlabel |
| GET/POST/DELETE | /api/candidates/me/saved-jobs | Kandidat | Kelola bookmark lowongan |

### 3.5 Aplikasi Lamaran (PRD Modul 2.6, 2.13)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | /api/job-board/:jobId/apply | Kandidat | Kirim lamaran (cegah duplikat aktif — FR-6.9) |
| GET | /api/candidates/me/applications | Kandidat | Daftar seluruh lamaran (lintas perusahaan) |
| GET | /api/candidates/me/applications/:id | Kandidat | Detail satu lamaran + timeline status |
| POST | /api/candidates/me/applications/:id/withdraw | Kandidat | Tarik lamaran (FR-6.10) |

### 3.6 Pipeline & Candidate Management HR (PRD Modul 2.7, 2.8)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | /api/dashboard/jobs/:jobId/pipeline | Perusahaan:Any | Data kanban (kandidat per tahap) |
| PATCH | /api/dashboard/applications/:id/stage | Perusahaan:Any | Pindahkan kandidat antar tahap |
| GET | /api/dashboard/candidates | Perusahaan:Any | Search/filter database kandidat (scoped ke perusahaan via applications) |
| GET | /api/dashboard/candidates/:candidateId | Perusahaan:Any | Detail kandidat (scoped) |
| POST/DELETE | /api/dashboard/candidates/:candidateId/tags | Perusahaan:Any | Kelola tag |

### 3.7 Interview, Decision, Notes & Scoring (PRD Modul 2.9, 2.10, 2.12)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | /api/dashboard/applications/:id/interviews | Perusahaan:Any | Jadwalkan interview |
| PUT | /api/dashboard/interviews/:interviewId | Perusahaan:Any | Reschedule |
| DELETE | /api/dashboard/interviews/:interviewId | Perusahaan:Any | Batalkan |
| PATCH | /api/dashboard/applications/:id/decision | Perusahaan:Any | Set status Hired/Rejected |
| POST | /api/dashboard/applications/:id/send-offer-email | Perusahaan:Any | Kirim surat offer (opsional) |
| POST | /api/dashboard/applications/:id/send-reject-email | Perusahaan:Any | Kirim email penolakan (opsional) |
| POST | /api/dashboard/applications/:id/notes | Perusahaan:Any | Tambah catatan |
| POST | /api/dashboard/applications/:id/scores | Perusahaan:Any | Tambah skor |

### 3.8 Email Template, Analytics, Activity Log (PRD Modul 2.11, 2.14, 2.15)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET/PUT | /api/dashboard/email-templates/:type | Perusahaan:Any | `type` = offer / reject |
| GET | /api/dashboard/analytics/summary | Perusahaan:Any | Ringkasan dashboard |
| GET | /api/dashboard/analytics/funnel | Perusahaan:Any | Funnel per tahap |
| GET | /api/dashboard/analytics/source | Perusahaan:Any | Distribusi sumber kandidat |
| GET | /api/dashboard/applications/:id/activity-log | Perusahaan:Any | Riwayat aktivitas |

### 3.9 Upload File

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | /api/uploads/signed-url | Kandidat / Perusahaan:Any | Terbitkan signed URL Supabase Storage untuk upload langsung dari klien (lihat bagian 6.3) |

---

## 4. Database Design

*Skema disederhanakan ke level konseptual (tipe data & constraint detail disusun saat migrasi). PK = `id (uuid)` di setiap tabel kecuali disebutkan lain.*

### 4.1 Sisi Perusahaan

- **companies**: name, slug (unique), logo_url, banner_url, tagline, industry, size_range, founded_year, website, socials (jsonb), description, benefits (jsonb), is_profile_complete (bool), created_at
- **company_locations**: company_id (FK), city, province, country, is_headquarters (bool)
- **company_members**: company_id (FK), name, email (unique), password_hash, role (enum: admin, hr), is_active (bool), created_at

### 4.2 Sisi Kandidat (Global, tanpa company_id)

- **candidates**: email (unique), password_hash, created_at *(tabel akun/kredensial)*
- **candidate_profiles**: candidate_id (FK unique), full_name, phone, domicile, photo_url, dob, headline, expected_salary, notice_period, updated_at
- **candidate_experiences**: candidate_id (FK), company_name, position, start_date, end_date, description
- **candidate_educations**: candidate_id (FK), institution, degree, major, start_year, end_year
- **candidate_skills**: candidate_id (FK), skill_name
- **candidate_certifications**: candidate_id (FK), name, issuer, year
- **candidate_links**: candidate_id (FK), label, url
- **candidate_documents**: candidate_id (FK), label, file_url, file_type, uploaded_at
- **saved_jobs**: candidate_id (FK), job_id (FK), saved_at — unique(candidate_id, job_id)

### 4.3 Job Posting

- **jobs**: company_id (FK), title, department, employment_type (enum), work_arrangement (enum), location, experience_level (enum), min_education, quota (int), filled_count (int, default 0), salary_min, salary_max, salary_visible (bool), description, responsibilities (jsonb array), requirements (jsonb array), preferred_qualifications (jsonb array), skills (jsonb array), benefits_extra (jsonb), deadline (date, nullable), status (enum: draft, published, closed), published_at, created_at
- **job_custom_questions**: job_id (FK), question_text, type (enum: multiple_choice, short_text, essay), options (jsonb, nullable), order_index
- **job_pipeline_stages**: job_id (FK), name, order_index, anchor_type (enum: applied, hired, rejected, withdrawn, null untuk tahap kustom tengah)

### 4.4 Aplikasi Lamaran

- **applications**: job_id (FK), candidate_id (FK), current_stage_id (FK → job_pipeline_stages), status (enum: active, hired, rejected, withdrawn), cover_letter (text, nullable), source (enum, nullable), applied_at, updated_at
  — *Constraint:* partial unique index `(job_id, candidate_id) WHERE status = 'active'` untuk mencegah lamaran ganda aktif (FR-6.9), sambil tetap mengizinkan riwayat baru jika kandidat melamar ulang setelah withdrawn di masa lalu.
- **application_answers**: application_id (FK), question_id (FK → job_custom_questions), answer_text
- **application_documents**: application_id (FK), label, file_url *(snapshot dokumen yang dipakai saat lamaran ini — FR-6.7)*
- **interviews**: application_id (FK), scheduled_at, type (enum: online, offline), location_or_link, interviewers (jsonb array teks), notes, status (enum: scheduled, completed, cancelled), created_by (FK → company_members)
- **notes**: application_id (FK), author_id (FK → company_members), content, created_at *(catatan dilekatkan pada lamaran spesifik — lihat asumsi 4.6)*
- **candidate_scores**: application_id (FK), scorer_id (FK → company_members), score (int 1–5), created_at
- **candidate_tags**: company_id (FK), candidate_id (FK), tag_name, created_at — *company-scoped, agar tag milik satu perusahaan tidak terlihat perusahaan lain*
- **email_templates**: company_id (FK), type (enum: offer, reject), subject, body, updated_at
- **email_send_log**: application_id (FK), type (enum: offer, reject), status (enum: pending, sent, failed), sent_at
- **activity_logs**: application_id (FK), actor_type (enum: company_member, candidate, system), actor_id (nullable untuk system), action_type, description, created_at

### 4.5 Auth Pendukung

- **password_reset_tokens**: user_type (enum: company_member, candidate), user_id, token_hash, expires_at, used (bool)
- **refresh_tokens**: user_type (enum: company_member, candidate), user_id, token_hash, expires_at, revoked (bool)

### 4.6 Catatan Asumsi Desain Data

- **Notes** dilekatkan pada `application_id` (per lamaran), bukan pada kandidat secara umum — karena skenario paling umum adalah HR mencatat hasil evaluasi terkait lowongan tertentu. Jika ke depannya dibutuhkan catatan lintas-lamaran untuk kandidat yang sama, dapat ditambahkan tabel `candidate_notes` terpisah (company-scoped) pasca-MVP.
- **Skills** disimpan sebagai tabel terpisah (bukan array jsonb di kolom) agar mudah difilter/di-search di modul Candidate Management (FR-7.1).

---

## 5. Authentication

### 5.1 Alur Registrasi & Login

1. **Register**: password divalidasi (panjang minimum, kompleksitas dasar) → di-hash dengan **bcrypt** (cost factor 12) → disimpan di `company_members.password_hash` atau `candidates.password_hash`.
2. **Login**: password dicocokkan dengan `bcrypt.compare` → jika valid, terbitkan:
   - **Access Token** (JWT, umur pendek ±15 menit) — payload: `{ sub, type: 'company_member' | 'candidate', companyId (jika company), role (jika company) }`
   - **Refresh Token** (JWT, umur panjang ±30 hari) — disimpan hash-nya di tabel `refresh_tokens` agar dapat di-*revoke* (mis. saat logout atau dicurigai bocor).
3. Access token dikirim sebagai `Authorization: Bearer <token>` di setiap request; refresh token disimpan di **httpOnly cookie** (mencegah akses via JavaScript, mengurangi risiko XSS).

### 5.2 Middleware Otorisasi

- `authenticateCompany`: verifikasi access token bertipe `company_member`, lampirkan `req.user = { id, companyId, role }`.
- `authenticateCandidate`: verifikasi access token bertipe `candidate`, lampirkan `req.candidate = { id }`.
- `requireRole('admin')`: menolak akses jika `req.user.role !== 'admin'` (dipakai di endpoint Manajemen Tim & Company Profile).
- `scopeToCompany`: memastikan setiap query di Repository menyertakan `companyId = req.user.companyId` — mencegah HR perusahaan A mengakses data lowongan/kandidat milik perusahaan B meskipun tahu ID resource-nya (defense terhadap *insecure direct object reference*).

### 5.3 Reset Password

1. Kandidat/HR meminta reset → sistem membuat token acak, menyimpan **hash**-nya di `password_reset_tokens` dengan masa berlaku singkat (±1 jam).
2. Email berisi tautan reset dikirim via layanan pihak ketiga (Resend/Nodemailer) — ini pengecualian terhadap prinsip "tanpa email rutin" (PRD bagian 3A poin 4), karena menyangkut keamanan akun.
3. Saat submit password baru, token divalidasi (belum kedaluwarsa, belum dipakai) → password baru di-hash → token ditandai `used = true`.

### 5.4 Keamanan Tambahan

- Rate limiting ketat pada endpoint login & register (mis. maks. 5 percobaan/menit per IP) untuk mencegah brute force.
- Endpoint publik (`/api/job-board/*`, `/api/auth/*`) dilindungi rate limiter umum untuk mencegah abuse/spam (PRD NFR Keamanan).
- CORS dikonfigurasi hanya mengizinkan origin frontend (domain Vercel) di lingkungan produksi.

---

## 6. Deployment Architecture

### 6.1 Topologi

```
[Vercel]  — Frontend (React + Vite build, static + CDN)
     │  VITE_API_BASE_URL → menunjuk ke domain Railway
     v
[Railway] — Backend (Express.js, Node runtime)
     │  DATABASE_URL → koneksi ke Supabase Postgres
     │  SUPABASE_SERVICE_ROLE_KEY → akses Supabase Storage (server-side only)
     │  EMAIL_API_KEY → layanan email pihak ketiga
     v
[Supabase] — Postgres Database (managed) + Storage Buckets
```

### 6.2 Environment Variables (ringkas)

| Variabel | Lokasi | Keterangan |
|---|---|---|
| `VITE_API_BASE_URL` | Frontend (Vercel) | URL backend Railway |
| `DATABASE_URL` | Backend (Railway) | Connection string Supabase Postgres |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Backend (Railway) | Akses Supabase Storage (signed URL) — **tidak pernah** dikirim ke frontend |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Backend (Railway) | Signing key token (dipisah agar refresh token tidak bisa dipalsukan pakai secret access token) |
| `EMAIL_API_KEY` | Backend (Railway) | Layanan email pihak ketiga (offer/reject/reset password) |
| `CORS_ORIGIN` | Backend (Railway) | Domain frontend yang diizinkan |

### 6.3 Strategi Upload File (Signed URL)

Untuk menghindari file besar (CV, logo, foto) membebani bandwidth Railway:
1. Klien (frontend) meminta signed upload URL ke `POST /api/uploads/signed-url` (mengirim tipe file & konteks, mis. `candidate-document`).
2. Backend memvalidasi (tipe file diizinkan, ukuran maksimum, kepemilikan konteks — mis. kandidat hanya boleh minta URL untuk dirinya sendiri) → menerbitkan signed URL dari Supabase Storage menggunakan service role key.
3. Klien meng-upload file **langsung** ke Supabase Storage memakai signed URL tersebut.
4. Setelah sukses, klien memanggil endpoint terkait (mis. `POST /api/candidates/me/documents`) mengirimkan path/URL hasil upload untuk disimpan sebagai referensi di database.

### 6.4 CI/CD

- **Frontend**: auto-deploy ke Vercel setiap push ke branch `main` pada repo frontend.
- **Backend**: auto-deploy ke Railway setiap push ke branch `main` pada repo backend.
- **Database**: migrasi skema dikelola lewat migration tool (mis. `node-pg-migrate` atau Prisma Migrate) dijalankan manual/CI sebelum deploy backend baru yang membutuhkan perubahan skema.

---

## 7. Product Backlog

*Breakdown lengkap Epic → Feature → Story → Task → Priority → Estimasi untuk seluruh 15 Epic kini tersedia sebagai dokumen tersendiri: **`07-Product-Backlog-RecruitFlow.md`**. Bagian di bawah ini tetap menjadi ringkasan cepat.*

### 7.1 Struktur Epic

Setiap **Epic** dipetakan langsung dari modul PRD. Prioritas menggunakan skala **P0 (wajib untuk siklus inti MVP) / P1 (penting, menyusul) / P2 (penyempurnaan)**. Estimasi menggunakan **story points** (skala Fibonacci: 1, 2, 3, 5, 8, 13).

| Epic | Fitur Utama | Prioritas | Estimasi (SP) |
|---|---|---|---|
| E1. Workspace & Auth Perusahaan | Register, login, undang tim | P0 | 8 |
| E2. Candidate Authentication | Register, login, reset password kandidat | P0 | 5 |
| E3. Company Profile | Form profil, validasi kelengkapan, halaman publik | P0 | 8 |
| E4. Job Posting | Form lengkap, custom questions, pipeline kustom, auto-close | P0 | 13 |
| E5. Public Job Board | Search, filter majemuk, sort berprioritas, bookmark | P0 | 13 |
| E6. Candidate Profile & Application | Profil lengkap, koleksi dokumen, form lamaran, cegah duplikat, withdraw | P0 | 13 |
| E7. Candidate Management (HR View) | Search/filter kandidat, tagging | P1 | 5 |
| E8. Pipeline (Kanban) | Drag-drop, tahap kustom, kolom anchor | P0 | 8 |
| E9. Interview & Schedule | CRUD jadwal, reschedule, kalender | P1 | 8 |
| E10. Decision (Offer/Reject/Withdrawn) | Ubah status, kirim email opsional | P1 | 8 |
| E11. Email Template | Editor 2 template, variabel dinamis | P1 | 5 |
| E12. Notes & Scoring | Catatan, skor individual + rata-rata | P1 | 5 |
| E13. Candidate Tracking Portal | Dashboard status, timeline, saved jobs | P0 | 8 |
| E14. Analytics Dashboard | Funnel, time-to-hire, sumber kandidat | P2 | 8 |
| E15. Activity Log | Pencatatan & tampilan kronologis | P2 | 3 |

*Total estimasi kasar: ~120 SP — dapat dipecah menjadi beberapa sprint sesuai kapasitas pengerjaan.*

### 7.2 Contoh Breakdown Task (Pola untuk Diterapkan ke Seluruh Epic)

Agar konsisten, setiap Epic dipecah menjadi **Feature → Story (mengacu ke User Story PRD) → Task teknis**. Berikut contoh untuk dua Epic sebagai pola acuan:

**Epic E4 — Job Posting**

| Story | Task | Prioritas | Estimasi |
|---|---|---|---|
| US-4.1 (Form job posting lengkap) | Desain skema tabel `jobs`, `job_custom_questions`, `job_pipeline_stages` | P0 | 3 |
| | Endpoint CRUD `/api/dashboard/jobs` (create, update, get, list) | P0 | 5 |
| | Endpoint custom questions CRUD | P0 | 3 |
| | Endpoint pipeline-stages CRUD + validasi anchor tidak bisa dihapus | P0 | 5 |
| | Frontend: form multi-step job posting + builder custom question + builder pipeline | P0 | 8 |
| US-4.2 (Auto-close kuota/deadline) | Service `checkAndCloseJob` dipanggil saat status kandidat jadi Hired | P0 | 3 |
| | Cron job harian cek deadline lewat → set status Closed | P1 | 3 |

**Epic E8 — Pipeline (Kanban)**

| Story | Task | Prioritas | Estimasi |
|---|---|---|---|
| US-8.1 (Drag-drop antar tahap) | Endpoint `PATCH /api/dashboard/applications/:id/stage` + validasi tahap valid utk job ini | P0 | 3 |
| | Frontend: komponen kanban board (drag-and-drop + fallback dropdown, lihat UX Rule 3.3/3.7) | P0 | 8 |
| | Trigger activity log setiap perpindahan tahap | P0 | 2 |
| US-8.2 (Kustomisasi tahap) | Validasi: tahap anchor tidak bisa dihapus/rename | P0 | 2 |
| | Frontend: UI kelola tahap pipeline saat create/edit job | P0 | 5 |

*Pola di atas dapat direplikasi untuk Epic E1, E2, E3, E5, E6, E7, E9–E15 mengikuti daftar Functional Requirement & User Story yang sudah didefinisikan di PRD (bagian 2.1–2.15).*

### 7.3 Urutan Pengerjaan yang Disarankan (Sequencing)

Mengikuti dependensi teknis (bukan sekadar prioritas), urutan implementasi yang disarankan:

1. **Fondasi**: E1 (Auth Perusahaan) → E2 (Auth Kandidat) → E3 (Company Profile)
2. **Alur Inti Perusahaan**: E4 (Job Posting) → E8 (Pipeline, karena tahap pipeline didefinisikan saat job posting)
3. **Alur Inti Kandidat**: E5 (Job Board) → E6 (Profil & Lamaran, karena butuh job board utk konteks apply) → E13 (Tracking Portal)
4. **Operasional HR Lanjutan**: E7 (Candidate Management) → E9 (Interview) → E12 (Notes & Scoring) → E10 (Decision) → E11 (Email Template, dibutuhkan sebelum E10 dapat mengirim email — sediakan template default lebih dulu)
5. **Penyempurnaan**: E15 (Activity Log, sebaiknya dibangun paralel sejak E8 agar semua modul tercatat sejak awal) → E14 (Analytics, paling terakhir karena butuh data dari seluruh modul lain untuk diuji)

---

*Dokumen ini menjadi acuan untuk penyusunan Design System (Design.md) pada tahap berikutnya.*
