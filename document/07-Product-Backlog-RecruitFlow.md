# Product Backlog Lengkap
## RecruitFlow — Recruitment Management System

*Dokumen ini melengkapi bagian 7 (Product Backlog) pada System Design, yang sebelumnya hanya memuat tabel Epic dan 2 contoh breakdown. Di sini seluruh 15 Epic dipecah lengkap: Feature → Story → Task → Priority → Estimasi (Story Points, skala Fibonacci).*

*Story mengacu ke User Story (US-x.x) yang sudah ada di PRD bila tersedia; story tambahan yang belum ada di PRD diberi label baru namun tetap konsisten dengan Functional Requirement terkait.*

---

## Ringkasan Epic

| Epic | Prioritas | Estimasi (SP) |
|---|---|---|
| E1. Workspace & Auth Perusahaan | P0 | 8 |
| E2. Candidate Authentication | P0 | 5 |
| E3. Company Profile | P0 | 8 |
| E4. Job Posting | P0 | 13 |
| E5. Public Job Board | P0 | 13 |
| E6. Candidate Profile & Application | P0 | 13 |
| E7. Candidate Management (HR View) | P1 | 5 |
| E8. Pipeline (Kanban) | P0 | 8 |
| E9. Interview & Schedule | P1 | 8 |
| E10. Decision (Offer/Reject/Withdrawn) | P1 | 8 |
| E11. Email Template | P1 | 5 |
| E12. Notes & Scoring | P1 | 5 |
| E13. Candidate Tracking Portal | P0 | 8 |
| E14. Analytics Dashboard | P2 | 8 |
| E15. Activity Log | P2 | 3 |
| **Total** | | **~121 SP** |

---

## E1. Workspace & Auth Perusahaan (P0 — 8 SP)

**Feature: Registrasi & Sesi Perusahaan**

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-1.1 Registrasi perusahaan | Endpoint `POST /api/auth/company/register` + validasi email unik | P0 | 2 |
| | Buat tabel `companies` & `company_members` + hashing password (bcrypt) | P0 | 1 |
| | Frontend: form registrasi (H-01) | P0 | 2 |
| US-1.3 Login HR/Admin | Endpoint `POST /api/auth/company/login` + issue access/refresh token | P0 | 2 |
| | Frontend: form login (H-02) | P0 | 1 |
| US-1.4 Reset password | Endpoint forgot/reset password + tabel `password_reset_tokens` + kirim email | P1 | 2 |

**Feature: Manajemen Tim**

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-1.2 Undang anggota tim | Endpoint invite + assign role (admin/hr) | P0 | 2 |
| | Frontend: tabel anggota + modal undang (H-05) | P1 | 2 |
| US-1.5 Nonaktifkan/aktifkan anggota (Admin) | Endpoint `PATCH /team/:memberId` + middleware `requireRole('admin')` | P1 | 1 |

---

## E2. Candidate Authentication (P0 — 5 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-2.1 Registrasi & login satu akun lintas perusahaan | Tabel `candidates` (global, tanpa company_id) | P0 | 1 |
| | Endpoint register/login kandidat + JWT bertipe `candidate` | P0 | 2 |
| | Frontend: form gabungan Masuk/Daftar (P-04) | P0 | 1 |
| Reset password kandidat | Endpoint forgot/reset password kandidat (reuse pola dari E1) | P1 | 1 |

---

## E3. Company Profile (P0 — 8 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-3.1 Lengkapi profil perusahaan | Tabel `companies` field lengkap (industri, ukuran, tahun berdiri, dsb) + `company_locations` | P0 | 2 |
| | Endpoint `GET/PUT /dashboard/company` | P0 | 2 |
| | Frontend: form profil multi-section (H-04) | P0 | 3 |
| Validasi kelengkapan sebelum publish (FR-3.2) | Service `isCompanyProfileComplete()` dipakai saat validasi publish job | P0 | 1 |
| Halaman publik perusahaan | Endpoint `GET /companies/:slug` + frontend (P-03) | P0 | (termasuk di atas) |

---

## E4. Job Posting (P0 — 13 SP)

*(Lihat contoh detail lengkap di System Design §7.2 — direplikasi di sini sebagai referensi utuh)*

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-4.1 Form job posting lengkap | Skema tabel `jobs`, `job_custom_questions`, `job_pipeline_stages` | P0 | 3 |
| | Endpoint CRUD `/dashboard/jobs` | P0 | 5 |
| | Endpoint custom questions CRUD | P0 | 3 |
| | Endpoint pipeline-stages CRUD + validasi anchor | P0 | 5 |
| | Frontend: form multi-section + builder custom question + builder pipeline (H-07) | P0 | 8 |
| US-4.2 Auto-close kuota/deadline | Service `checkAndCloseJob` dipanggil saat kandidat Hired | P0 | 3 |
| | Cron harian cek deadline lewat → set Closed | P1 | 3 |
| Daftar lowongan | Endpoint list + frontend tabel (H-06) | P0 | 3 |

---

## E5. Public Job Board (P0 — 13 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-5.1 Search & filter kombinasi | Endpoint `GET /job-board` dengan query filter multi-select | P0 | 5 |
| | Frontend: panel filter chip (P-01) | P0 | 3 |
| US-5.2 Sort berprioritas berjenjang | Util `sortPriority.js` (bangun ORDER BY dari array prioritas) | P0 | 3 |
| | Frontend: UI drag-reorder daftar prioritas sort | P0 | 5 |
| US-5.3 Bookmark lowongan | Tabel `saved_jobs` + endpoint CRUD | P0 | 2 |
| | Frontend: tombol simpan di job card & Job Detail (P-01, P-02) | P0 | 2 |
| Job Detail publik | Endpoint `GET /job-board/:jobId` + frontend (P-02) | P0 | 3 |

---

## E6. Candidate Profile & Application (P0 — 13 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-6.1 Profil lengkap reusable | Tabel `candidate_profiles`, `candidate_experiences`, `candidate_educations`, `candidate_skills`, `candidate_certifications`, `candidate_links` | P0 | 5 |
| | Endpoint CRUD tiap entitas | P0 | 5 |
| | Frontend: form profil multi-section (C-04) | P0 | 5 |
| US-6.3 Koleksi CV berlabel + dokumen per-lamaran | Tabel `candidate_documents`, `application_documents` (snapshot) | P0 | 3 |
| | Endpoint signed-URL upload (`/uploads/signed-url`) | P0 | 3 |
| | Frontend: Dokumen Saya (C-05) + step pilih dokumen di form aplikasi (P-05) | P0 | 5 |
| US-6.2 Kirim lamaran (custom questions, cover letter, sumber info) | Tabel `applications`, `application_answers` | P0 | 3 |
| | Endpoint `POST /job-board/:jobId/apply` | P0 | 5 |
| | Frontend: form aplikasi 5-step (P-05), halaman konfirmasi (P-06) | P0 | 5 |
| US-6.9 Cegah lamaran ganda | Partial unique index `(job_id, candidate_id) WHERE status='active'` | P0 | 1 |
| US-6.10 Withdraw lamaran | Endpoint `POST /applications/:id/withdraw` + validasi status aktif | P0 | 2 |

---

## E7. Candidate Management — HR View (P1 — 5 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-7.1 Search/filter kandidat (scoped ke perusahaan) | Endpoint `GET /dashboard/candidates` join lewat `applications` | P1 | 3 |
| | Frontend: tabel + filter chip (H-10) | P1 | 2 |
| Tagging kandidat | Tabel `candidate_tags` (company-scoped) + endpoint CRUD | P1 | 2 |
| | Frontend: tag di header Candidate Detail (H-09) | P1 | (termasuk di atas) |

---

## E8. Pipeline / Kanban (P0 — 8 SP)

*(Lihat juga contoh detail di System Design §7.2)*

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-8.1 Drag-drop antar tahap | Endpoint `PATCH /applications/:id/stage` + validasi tahap valid | P0 | 3 |
| | Frontend: kanban board (drag + dropdown alternatif) (H-08) | P0 | 8 |
| | Trigger activity log tiap perpindahan | P0 | 2 |
| US-8.2 Kustomisasi tahap pipeline | Validasi anchor tidak bisa dihapus/rename | P0 | 2 |
| | Frontend: UI kelola tahap saat create/edit job (bagian dari H-07) | P0 | (lihat E4) |
| Kolom Rejected/Withdrawn terpisah | Frontend: panel collapsible (H-08) | P0 | 2 |

---

## E9. Interview & Schedule (P1 — 8 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-9.1 Jadwalkan interview | Tabel `interviews` + endpoint `POST /applications/:id/interviews` | P1 | 3 |
| | Frontend: Modal Jadwalkan (H-14, tertanam di H-09) | P1 | 3 |
| | Update status lamaran otomatis ke Candidate Tracking Portal | P0 | 2 |
| US-9.2 Reschedule/cancel interview | Endpoint `PUT/DELETE /interviews/:interviewId` | P1 | 2 |
| Kalender interview | Endpoint list interview per rentang tanggal + frontend grid bulanan/mingguan (H-11) | P1 | 5 |

---

## E10. Decision — Offer/Reject/Withdrawn (P1 — 8 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-10.1 Ubah status Hired/Rejected + kirim email opsional | Endpoint `PATCH /applications/:id/decision` | P1 | 3 |
| | Endpoint kirim email offer/reject (integrasi layanan pihak ketiga) + tabel `email_send_log` | P1 | 3 |
| | Frontend: Modal Decision dengan toggle & preview (H-15, tertanam di H-09) | P1 | 5 |
| Update kuota otomatis saat Hired | Service update `filled_count` pada job terkait | P0 | 1 |
| Status Withdrawn hanya dari aksi kandidat | Validasi di service — tolak request HR mengubah status jadi Withdrawn | P0 | 1 |

---

## E11. Email Template (P1 — 5 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-11.1 Sunting template offer & reject | Tabel `email_templates` (company-scoped, type: offer/reject) | P1 | 2 |
| | Endpoint `GET/PUT /email-templates/:type` | P1 | 2 |
| | Frontend: 2 editor dengan tab + preview + daftar variabel (H-12) | P1 | 3 |
| Render variabel dinamis | Util render `{{candidate_name}}`, `{{job_title}}`, `{{company_name}}` | P1 | 1 |

---

## E12. Notes & Scoring (P1 — 5 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-12.1 Tambah catatan per lamaran | Tabel `notes` + endpoint `POST /applications/:id/notes` | P1 | 2 |
| | Frontend: tab Notes & Skor (bagian dari H-09) | P1 | 2 |
| US-12.2 Skor individual + rata-rata | Tabel `candidate_scores` + endpoint + agregasi rata-rata di query | P1 | 3 |
| | Frontend: komponen Score Input (bintang 1–5) | P1 | 2 |

---

## E13. Candidate Tracking Portal (P0 — 8 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-13.1 Lihat status lamaran real-time (lintas perusahaan) | Endpoint `GET /candidates/me/applications` + `/applications/:id` | P0 | 3 |
| | Frontend: Dashboard Kandidat (C-01) + Detail Lamaran (C-02) dgn Stage Rail fungsional | P0 | 5 |
| Status disederhanakan (tanpa data internal HR) | Mapping status internal → label publik kandidat (mis. Interview → "Interview Dijadwalkan") | P0 | 2 |
| Daftar lowongan tersimpan | Frontend: Lowongan Tersimpan (C-03), reuse endpoint E5 | P0 | (lihat E5) |

---

## E14. Analytics Dashboard (P2 — 8 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| US-14.1 Funnel & ringkasan | Endpoint `GET /analytics/summary`, `/analytics/funnel` (Rejected/Withdrawn terpisah) | P2 | 3 |
| | Frontend: kartu ringkasan + funnel chart (H-03 ringkas, H-13 penuh) | P2 | 3 |
| Distribusi sumber kandidat | Endpoint `GET /analytics/source` (agregasi field `source` dari `applications`) | P2 | 2 |
| Tren time-to-hire & breakdown per lowongan | Query agregasi rata-rata durasi Applied→Hired per job | P2 | 3 |
| | Frontend: line chart + tabel breakdown (H-13) | P2 | 3 |

---

## E15. Activity Log (P2 — 3 SP)

| Story | Task | Prioritas | Est. |
|---|---|---|---|
| Catat aktivitas otomatis | Middleware/service `logActivity()` dipanggil di titik-titik kunci (ubah tahap, kirim email, catatan, withdraw, reschedule) | P2 | 2 |
| Tampilkan kronologis | Endpoint `GET /applications/:id/activity-log` + frontend tab Activity Log (bagian H-09) | P2 | 1 |

*Catatan: meskipun prioritas P2, implementasi `logActivity()` sebaiknya **dibangun paralel sejak Epic E8 (Pipeline)** — bukan ditunda ke akhir — supaya seluruh modul lain otomatis tercatat sejak awal tanpa perlu retrofit.*

---

## Saran Pembagian Sprint (2 Minggu per Sprint, Estimasi Kasar)

*Asumsi kapasitas figuratif ~20–25 SP/sprint untuk pengerjaan solo. Sesuaikan dengan kecepatan aktual setelah 1–2 sprint berjalan.*

| Sprint | Fokus | Epic Terlibat | Estimasi (SP) |
|---|---|---|---|
| 1 | Fondasi & Auth | E1, E2 | ~13 |
| 2 | Profil Perusahaan & Job Posting (bagian 1) | E3, E4 (mulai) | ~21 |
| 3 | Job Posting (lanjutan) & Pipeline | E4 (lanjutan), E8 | ~13 |
| 4 | Job Board & Profil Kandidat | E5, E6 (mulai) | ~21 |
| 5 | Aplikasi Kandidat & Tracking Portal | E6 (lanjutan), E13 | ~16 |
| 6 | Candidate Management & Interview | E7, E9 | ~13 |
| 7 | Notes/Scoring, Decision, Email Template | E12, E10, E11 | ~18 |
| 8 | Activity Log, Analytics, Polish | E15, E14 | ~11 |

*Team Management (bagian dari E1, dapat digeser fleksibel) dan penyempurnaan UI mengikuti Design.md dapat disisipkan di sprint manapun yang masih punya slack.*

---

*Dokumen ini melengkapi System Design bagian 7 (Product Backlog) sebagai acuan lengkap saat memulai development.*
