# Dokumen 07 — Test Plan & Quality Assurance Strategy
## RecruitFlow — Multi-Tenant Recruitment Management System
**Versi:** 4.0 (Master QA & Testing Baseline — Canonical Edition)  
**Status:** Active Quality Engineering Runbook  
**Acuan Rantai Kebenaran:**
- `01-PDD-RecruitFlow.md` (Product Definition & Business Objectives)
- `02-PRD-RecruitFlow.md` (Product Requirements & Logic Engine v4.0)
- `03-UIUX-Spec-RecruitFlow.md` (UI/UX 8-Dimension Specification v4.0)
- `04-System-Architecture-Design-RecruitFlow.md` (System Architecture & API DDL v4.0)
- `05-Design-System-RecruitFlow.md` (Design Tokens & Component Architecture v4.0)
- `06-Product-Backlog-RecruitFlow.md` (Product Backlog & Implementation Runbook v4.0)

---

## DAFTAR ISI
1. [Bab 1: Executive Summary, Filosofi & 5 Prinsip Universal Testing](#bab-1-executive-summary-filosofi--5-prinsip-universal-testing)
   - 1.1 Esensi Pengujian & Peredam Risiko Bisnis (*Risk Mitigation*)
   - 1.2 5 Prinsip Universal Pengujian
   - 1.3 Penyelarasan Tri-Level Definition of Done (DoD)
   - 1.4 Standar Matriks Keterlacakan (*Traceability Mapping Standard*)
2. [Bab 2: Arsitektur Lingkungan Uji, Tooling Stack & Protokol Seeding](#bab-2-arsitektur-lingkungan-uji-tooling-stack--protokol-seeding)
   - 2.1 Pemilihan Tooling Definitif (Terkunci & Tanpa Ambiguitas)
   - 2.2 Isolasi Lingkungan & Safety Guardrail Database
   - 2.3 Strategi Reset Database Super-Cepat (`TRUNCATE CASCADE`)
   - 2.4 Protokol Mocking Layanan Pihak Ketiga (Resend & Supabase Storage)
   - 2.5 Protokol Eksekusi Bebas Halusinasi (*Zero-Hallucination Protocol*)
3. [Bab 3: Tingkat 1 — Unit Testing Architecture (Logika Murni & Boundaries)](#bab-3-tingkat-1--unit-testing-architecture-logika-murni--boundaries)
   - 3.1 Ruang Lingkup & Fokus Pengujian
   - 3.2 Metode Pengujian (*White-Box*, BVA, EP)
   - 3.3 Tooling Stack & Konfigurasi (`Vitest`)
   - 3.4 Target Komponen & Tabel Keterlacakan File Sumber (*Source File Traceability*)
   - 3.5 Prinsip & Ambang Kelulusan
   - 3.6 Matriks Lengkap Unit Test Cases (Exhaustive 55-Scenario Suite)
   - 3.7 Checklist Verifikasi Kelengkapan & Mutation Testing Tingkat 1
4. [Bab 4: Tingkat 2 — Component & Middleware Testing Architecture (Subsistem)](#bab-4-tingkat-2--component--middleware-testing-architecture-subsistem)
   - 4.1 Ruang Lingkup & Fokus Pengujian
   - 4.2 Metode Pengujian (*Gray-Box*, State Mutation, Fail-Closed Security, A11y DOM Testing)
   - 4.3 Tooling Stack & Konfigurasi (`Vitest` + `jsdom` + `@testing-library/react`)
   - 4.4 Target Komponen & Tabel Keterlacakan File Sumber (*Source File Traceability*)
   - 4.5 Prinsip & Ambang Kelulusan
   - 4.6 Matriks Lengkap Component & Middleware Test Cases (Exhaustive 31-Scenario Suite)
   - 4.7 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 2
5. [Bab 5: Tingkat 3 — Integration Testing Architecture (REST API 15 Modul & DB)](#bab-5-tingkat-3--integration-testing-architecture-rest-api-15-modul--db)
   - 5.1 Ruang Lingkup & Fokus Pengujian
   - 5.2 Metode Pengujian (*Gray-Box API*, Transaction Rollback, Concurrency)
   - 5.3 Tooling Stack & Konfigurasi (`Supertest` + `Vitest` + PostgreSQL `pg`)
   - 5.4 Kebijakan Port 6543 Supabase Pooler (`--no-file-parallelism` & `withTransaction`)
   - 5.5 Target Modul & Tabel Keterlacakan File Sumber (*Source File Traceability Table*)
   - 5.6 Prinsip & Ambang Kelulusan
   - 5.7 Matriks Lengkap Integration Test Cases (Exhaustive 28-Scenario Suite)
     - 5.7.1 Klaster 1: Identitas, Akses Multi-Tenant & Rotasi Token (`[IT-AUTH-01]` s/d `[IT-AUTH-04]`)
     - 5.7.2 Klaster 2: Profil Perusahaan, Gating Lowongan & Lifecycle Engine (`[IT-JOB-01]` s/d `[IT-JOB-03]`)
     - 5.7.3 Klaster 3: Job Discovery, Transaksi Lamaran Atomik & Deduplikasi (`[IT-APP-01]` s/d `[IT-APP-04]`)
     - 5.7.4 Klaster 4: Talent Pool, Tagging & FSM Kanban Pipeline (`[IT-KAN-01]` s/d `[IT-KAN-05]`)
     - 5.7.5 Klaster 5: Penjadwalan Wawancara, Deteksi Tabrakan & Scoring Konsensus (`[IT-INT-01]` s/d `[IT-INT-03]`)
     - 5.7.6 Klaster 6: Kolaborasi Tim, Author-Only Edit & Decoupled Mailer (`[IT-COL-01]` s/d `[IT-COL-03]`)
     - 5.7.7 Klaster 7: Portal Pelamar, Analitik Time-to-Hire & Audit Trail Imutabel (`[IT-POR-01]` s/d `[IT-POR-03]`)
     - 5.7.8 Klaster 8: Konkurensi Mutlak, Transaksi ACID & Race Conditions (`[IT-RACE-01]` s/d `[IT-RACE-03]`)
   - 5.8 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 3
6. [Bab 6: Tingkat 4 — System & End-to-End (E2E) Testing Architecture (User Flows & UI)](#bab-6-tingkat-4--system--end-to-end-e2e-testing-architecture-user-flows--ui)
   - 6.1 Ruang Lingkup & Fokus Pengujian
   - 6.2 Metode Pengujian (*Black-Box*, Cross-Role State Sync, Cross-Viewport)
   - 6.3 Tooling Stack & Pembagian Peran Dwi-Jalur (`Puppeteer` vs `Browser Subagent`)
   - 6.4 Protokol Anti-Flakiness & Standar Selektor Tahan Banting (`data-testid`)
   - 6.5 Matriks Sensus Tier A: 5 Golden User Flows (Exhaustive Step-by-Step E2E Automation Suites)
     - 6.5.1 `[E2E-FLOW-01]` The Golden Hiring Cycle (Alur Perekrutan Penuh 12 Langkah)
     - 6.5.2 `[E2E-FLOW-02]` Candidate Tracking & Self-Withdraw Journey
     - 6.5.3 `[E2E-FLOW-03]` Company Onboarding & Gating Interception Flow
     - 6.5.4 `[E2E-FLOW-04]` HR Team Collaboration & Scoring Consensus Flow
     - 6.5.5 `[E2E-FLOW-05]` Talent Pool Search, Tagging & CSV Export Flow
   - 6.6 Matriks Sensus Tier B: 29 Screens UI/UX 8-Dimension Responsive Matrix
     - 6.6.1 9 Layar Publik ([P-00] s/d [P-08])
     - 6.6.2 5 Layar Kandidat ([C-01] s/d [C-05])
     - 6.6.3 15 Layar HR & Perusahaan ([H-01] s/d [H-15])
   - 6.7 Prinsip & Ambang Kelulusan Tingkat 4
   - 6.8 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 4
7. [Bab 7: Tingkat 5 — Acceptance, Regression & Chaos Resilience Architecture](#bab-7-tingkat-5--acceptance-regression--chaos-resilience-architecture)
   - 7.1 Ruang Lingkup & Fokus Pengujian
   - 7.2 Metode Pengujian (ATDD, Fault-Injection, Virtual Clock, 4-Tier Zero-Paywall)
   - 7.3 Tooling Stack & Konfigurasi Eksekusi (`Vitest` + `seed-test.js` + Fault Adapters)
   - 7.4 Audit Kepatuhan Lingkup Bebas Paywall (Zero Paywall Guardrail)
   - 7.5 Chaos Resiliency Test (Simulasi Resend Outage & Storage Failure)
   - 7.6 Background Worker & Cron Automation Verification
   - 7.7 Prinsip & Ambang Kelulusan Tingkat 5
   - 7.8 Matriks Lengkap Test Cases Acceptance, Chaos & Regression (22 Skenario Uji)
     - 7.8.1 Klaster 1: Kepatuhan Model Bisnis & Zero-Paywall Guardrail (`[AT-PAY-01]` s/d `[AT-PAY-04]`)
     - 7.8.2 Klaster 2: Kriteria Penerimaan Inti PRD 15 Modul / ATDD (`[AT-PRD-01]` s/d `[AT-PRD-08]`)
     - 7.8.3 Klaster 3: Resiliensi Bencana & Chaos Fault-Injection (`[AT-CHAOS-01]` s/d `[AT-CHAOS-04]`)
     - 7.8.4 Klaster 4: Otomasi Background Workers, Cron & Outbox Sweeper (`[AT-CRON-01]` s/d `[AT-CRON-03]`)
     - 7.8.5 Klaster 5: Regresi Otomatis, Integritas Migrasi & Kesiapan Rilis (`[AT-REG-01]` s/d `[AT-REG-03]`)
   - 7.9 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 5
8. [Bab 8: Protokol Pelaporan Defect & Master Traceability Matrix](#bab-8-protokol-pelaporan-defect--master-traceability-matrix)
   - 8.1 Format Standar Buku Log Eksekusi Pengujian (*Test Execution Log Standard*)
   - 8.2 Format Standar Formulir Laporan Cacat (*Defect Logging Protocol*)
   - 8.3 Panduan Objektif Taksonomi Severity (*Critical, High, Medium, Low*)
   - 8.4 Ambang Batas Kualitas Rilis Produksi (*Go/No-Go Release Gate*)
   - 8.5 Master Traceability Matrix Rekapitulasi (15 Modul PRD × 5 Tingkatan Testing)
   - 8.6 Ringkasan Rekapitulasi Statistik Keterlacakan (*Traceability Statistics Summary*)
   - 8.7 Pernyataan Pengesahan Dokumen (*Formal Sign-Off & Seal of Quality*)

---

# BAB 1: EXECUTIVE SUMMARY, FILOSOFI & 5 PRINSIP UNIVERSAL TESTING

### 1.1 Esensi Pengujian & Peredam Risiko Bisnis (*Risk Mitigation*)
Pengujian (*testing*) pada RecruitFlow bukan sekadar aktivitas teknis untuk membuktikan bahwa baris kode dapat dikompilasi atau dijalankan tanpa error. Dari perspektif **Senior Product Manager, Tech Leader, dan System Architecture Expert**, esensi utama dari pengujian sistem adalah:
1. **Peredam Risiko Bisnis (*Risk Mitigation*)**: Melindungi reputasi platform dan menjamin kepatuhan hukum atas kerahasiaan data pribadi pelamar (UU PDP / GDPR). Kebocoran data lintas perusahaan adalah bencana bisnis yang tidak dapat ditoleransi.
2. **Jaminan Nilai Produk (*Value Assurance*)**: Memastikan bahwa seluruh janji fungsional yang tertuang di dalam Dokumen 02 (PRD) dan alur interaksi di Dokumen 03 (UI/UX Spec) benar-benar terwujud secara presisi di tangan pengguna akhir.
3. **Pemberi Kepercayaan Diri Tim (*Confidence to Change*)**: Menjadi jaring pengaman (*safety net*) otomatis yang memungkinkan pengembang melakukan *refactoring* kode, pembaruan dependensi, dan penambahan fitur baru dengan cepat (*high velocity*) tanpa ketakutan merusak fitur lama (*fear of regression*).

### 1.2 5 Prinsip Universal Pengujian
Seluruh aktivitas QA dan pengujian pada sistem RecruitFlow wajib mematuhi 5 prinsip universal yang diadaptasi dari standar internasional **ISTQB (International Software Testing Qualifications Board)** dan praktik rekayasa modern:

```mermaid
graph LR
    P1[1. Shift-Left] --> P2[2. Piramida ROI]
    P2 --> P3[3. Zero-Flakiness]
    P3 --> P4[4. Presence of Defects]
    P4 --> P5[5. Data Hygiene]
    style P1 fill:#2563eb,stroke:#1d4ed8,color:#fff
    style P2 fill:#0284c7,stroke:#0369a1,color:#fff
    style P3 fill:#059669,stroke:#047857,color:#fff
    style P4 fill:#d97706,stroke:#b45309,color:#fff
    style P5 fill:#dc2626,stroke:#b91c1c,color:#fff
```

1. **Prinsip 1: Shift-Left Principle (Pencegahan Sejak Dini)**
   Pengujian dimulai sejak fase penulisan fungsi terkecil (Unit Test), bukan ditunda hingga sistem selesai dibangun di akhir. Menemukan dan memperbaiki bug validasi skema di unit test membutuhkan waktu 5–10 menit; bug yang sama jika lolos ke produksi membutuhkan investigasi berhari-hari dan biaya mitigasi yang masif.
2. **Prinsip 2: Piramida Pengujian & ROI (Return on Investment)**
   Distribusi pengujian mengikuti bentuk piramida:
   - Lapisan bawah (Unit Test) berjumlah paling banyak, berjalan dalam milidetik, dan berbiaya sangat murah.
   - Lapisan tengah (Integration Test) memvalidasi transaksi multi-tabel dan batas sistem.
   - Lapisan atas (E2E Test) berfokus selektif pada alur pengguna paling kritis (*Critical User Journeys*).  
   *Anti-pattern*: Dilarang membalik piramida menjadi "kerucut es krim" (sedikit unit test, tetapi mengandalkan ratusan E2E browser test yang lambat dan rapuh).
3. **Prinsip 3: Deterministik Mutlak & Zero Flakiness**
   Pengujian yang baik wajib memberikan hasil yang sama persis 100 kali berturut-turut jika input dan data awal sama. Pengujian yang kadang lulus dan kadang gagal tanpa ada perubahan kode (*flaky test*) dikategorikan sebagai racun pengujian dan wajib langsung dikarantina.
4. **Prinsip 4: Testing Shows Presence of Defects, Not Absence**
   Pengujian membuktikan adanya cacat, bukan membuktikan ketidakhadiran cacat. Hasil test yang 100% *Pass* bukan bukti bahwa sistem bebas bug secara absolut, melainkan bukti bahwa sistem lulus dari seluruh skenario yang dirancang. Karena itu, **pengujian kasus negatif (*negative path*) dan kondisi batas (*boundary analysis*) memiliki bobot nilai yang jauh lebih tinggi daripada sekadar menguji skenario sukses (*happy path*)**.
5. **Prinsip 5: Higienitas Lingkungan & Isolasi Data (Data Hygiene)**
   Pengujian dilarang keras menyentuh database produksi atau membagikan state antar-sesi pengujian. Setiap sesi pengujian wajib diawali dari kondisi data awal terstandar (*known clean state via seed*) dan dibersihkan kembali setelah selesai.

### 1.3 Penyelarasan Tri-Level Definition of Done (DoD)
Setiap skenario pengujian di seluruh tingkatan diwajibkan untuk memverifikasi tiga tingkatan kriteria penyelesaian (*Tri-Level DoD*) yang didefinisikan pada Dokumen 06 §1.4:
* **Level 1: Contract DoD (Validasi Struktur & Tipe Data)**
  Format response JSON mematuhi envelope standar `{ success: true, data: {...} }` atau `{ success: false, error: { code, message } }`. Kode error string wajib mematuhi standarisasi resmi Dokumen 04 (contoh: `ERR_PROFILE_INCOMPLETE`, `ERR_DUPLICATE_APPLICATION`, `ERR_INTERVIEW_COLLISION`).
* **Level 2: Positive DoD (Logika Bisnis & Mutasi State)**
  Alur *happy path* bisnis tuntas sesuai kriteria PRD. Status FSM termutasi presisi pada database, baris jejak audit tersimpan permanen di `activity_logs`, dan kuota bertambah/berkurang sesuai aturan bisnis.
* **Level 3: Negative & Resilience DoD (Ketahanan & Keamanan)**
  Validasi Zod menolak payload cacat (HTTP 400). Otorisasi RBAC menolak akses tanpa hak (HTTP 401/403). Database mengeksekusi *safe rollback* saat terjadi kegagalan transaksi multi-query. Layanan tetap berjalan anggun (*graceful failure*) saat pihak ketiga mengalami gangguan jaringan.

### 1.4 Standar Matriks Keterlacakan (*Traceability Mapping Standard*)
Guna memastikan 100% ruang lingkup produk teruji tanpa ada yang terlewat, setiap Test Case pada Dokumen 07 wajib dipetakan menggunakan formula taksonomi kanonikal:
$$\mathbf{[TEST\ ID]} \longleftrightarrow \mathbf{[FR-PRD]} \longleftrightarrow \mathbf{[TASK-BACKLOG]} \longleftrightarrow \mathbf{[SCREEN-ID]} \longleftrightarrow \mathbf{[API-ENDPOINT]}$$

Konvensi Penomoran Test ID Standar:
- `[UT-xxx]`: Unit Test (Tingkat 1)
- `[CT-xxx]`: Component & Middleware Test (Tingkat 2)
- `[IT-xxx]`: Integration & Multi-Table Transaction Test (Tingkat 3)
- `[E2E-xxx]`: System & End-to-End User Flow Test (Tingkat 4)
- `[AT-xxx]`: Acceptance, Regression & Chaos Resilience Test (Tingkat 5)

---

# BAB 2: ARSITEKTUR LINGKUNGAN UJI, TOOLING STACK & PROTOKOL SEEDING

### 2.1 Pemilihan Tooling Definitif (Terkunci & Tanpa Ambiguitas)
Berdasarkan evaluasi kompatibilitas Node.js v22, React 19, Vite, Express, dan PostgreSQL Supabase Port 6543, tumpukan perkakas (*tooling stack*) pengujian dikunci secara definitif tanpa ada pilihan ganda atau tanda garis miring (*slash*):

| Kategori Pengujian | Perkakas Terpilih | Rationale Teknis & Lokasi Konfigurasi |
|---|---|---|
| **Test Runner & Assertion (Backend & Frontend)** | **`Vitest`** | Native ESM runner, 10x lebih cepat dari Jest pada React 19, zero-config terintegrasi dengan Vite. |
| **API Assertion Driver** | **`Supertest`** | Standar industri untuk membungkus Express app dan melakukan HTTP assertion (`expect(200)`). |
| **Component DOM Testing** | **`@testing-library/react`** + **`@testing-library/user-event`** | Menguji perilaku komponen React dari perspektif pengguna nyata dan aksesibilitas (ARIA). |
| **Automated Scripted E2E** | **`Puppeteer`** | Sudah terpasang di `backend/package.json` (`^25.5.0`). Dijalankan secara headless via skrip `test-e2e.js` untuk integrasi CLI/CI. |
| **Exploratory & Visual AI Verification** | **`Browser Subagent`** | Perkakas native AI IDE untuk inspeksi visual interaktif 29 layar UI, animasi drag-and-drop, dan responsivitas. |
| **Database Client Uji** | **`pg` (node-postgres)** | Menjalankan query verifikasi inspeksi database langsung pada assertion Level 3. |

> **Catatan Keputusan Eliminasi**: *Playwright* dan *Jest* **dieliminasi secara permanen** dari perancangan ini guna mencegah redundansi dependensi (*zero dependency bloat*) dan menjaga ekosistem proyek tetap ramping.

### 2.2 Isolasi Lingkungan & Safety Guardrail Database
Untuk mencegah kecelakaan fatal di mana perintah pengujian merusak data operasional atau data pengembangan, skrip pengujian dilindungi oleh **Triple-Lock Safety Mechanism**:
1. **Lock 1 (Environment Guard)**: Skrip pengujian otomatis menolak berjalan jika variabel lingkungan `NODE_ENV` bernilai selain `'test'`.
2. **Lock 2 (Explicit Reset Flag)**: Operasi pembersihan tabel hanya dapat dieksekusi jika file `.env.test` secara eksplisit memuat flag: `ALLOW_TEST_RESET=true`.
3. **Lock 3 (Database Name & URL Pattern)**: Skrip memvalidasi URL koneksi; jika string URL mengarah ke database produksi, proses langsung dibatalkan (*hard abort*) dengan melempar exception:  
   `FATAL ERROR: Test execution prohibited on production database!`

### 2.3 Strategi Reset Database Super-Cepat (`TRUNCATE CASCADE`)
* **Metode Usang (Dilarang)**: Menghapus skema (*Drop Table*) dan menjalankan ulang migrasi DDL 23 tabel setiap sesi memakan waktu 30–60 detik dan berisiko terkena pembatasan laju (*rate-limiting*) koneksi Supabase.
* **Strategi Terpilih (Kanonikal)**: Mengeksekusi satu baris perintah pembersihan terpusat:
  ```sql
  TRUNCATE TABLE 
    companies, company_locations, company_members, candidates, 
    candidate_profiles, candidate_documents, jobs, job_pipeline_stages, 
    applications, application_documents, interviews, application_notes, 
    candidate_scores, candidate_tags, application_tags, email_send_log, 
    activity_logs, refresh_tokens, password_reset_tokens, job_custom_questions, 
    application_answers, email_templates, saved_jobs, candidate_experiences, 
    candidate_educations 
  RESTART IDENTITY CASCADE;
  ```
  Perintah ini mengembalikan seluruh 23 tabel relasional ke kondisi bersih kosong dalam waktu **< 1.5 detik** tanpa merusak struktur DDL fisik atau indeks performa. Setelah truncate selesai, skrip otomatis menyuntikkan data benih terstandar dari `fixtures.json`.

### 2.4 Protokol Mocking Layanan Pihak Ketiga (Resend & Supabase Storage)
Guna menjamin determinisme pengujian, mencegah pembakaran kuota API, dan menghindari pengiriman email sampah ke publik:
* **Email Resend Transport (`backend/src/config/mailer.js`)**:
  Saat `NODE_ENV === 'test'`, modul mailer beralih secara otomatis ke **`MockMailTransport`**. Modul ini **tidak melakukan panggilan HTTP keluar ke server Resend**, melainkan menyimpan payload surat (subjek, penerima, HTML) ke dalam array in-memory dan mencatat baris data ke tabel `email_send_log` dengan status `'mock_sent'`. Pengujian ketahanan (*chaos resiliency*) dapat memicu kegagalan simulasi dengan flag `MOCK_RESEND_FAIL=true`.
* **Supabase Storage Pipeline (`backend/src/controllers/upload.controller.js`)**:
  Pengujian Level 3 berfokus pada verifikasi logika otorisasi, penolakan ukuran file > 5 MB, penolakan MIME type non-PDF/non-gambar, dan keabsahan string *Signed URL* yang diterbitkan (memastikan parameter token kedaluwarsa 900 detik tersemat). Pengujian tidak mengunggah file biner fisik 5 MB sungguhan ke cloud storage pada setiap test run.

### 2.5 Protokol Eksekusi Bebas Halusinasi (*Zero-Hallucination Protocol*)
Penguji (baik manusia maupun AI Agent) terikat pada aturan integritas mutlak:
1. **Dilarang Berasumsi**: Status pengujian hanya boleh bernilai salah satu dari tiga: **Pass**, **Fail**, atau **Blocked**. Dilarang menyatakan suatu fitur "tampaknya aman" di luar hasil observasi aktual.
2. **Standarisasi Bukti Aktual (*Evidence Standard*)**:
   - *Unit Test*: Wajib menyertakan nilai input vs nilai return fungsi murni (contoh: `Input: applied=2026-01-01, hired=2026-01-15 -> Return: 14 hari`).
   - *Integration Test*: Wajib menyertakan **HTTP Status Code + Error string resmi** (contoh: `HTTP 400 Bad Request, code: ERR_DUPLICATE_APPLICATION`).
   - *E2E / Visual Test*: Wajib menyertakan **URL rute aktif + ID/Class selektor DOM yang ter-render** (contoh: `URL: /jobs/:id/success -> Element #confirmation-ticket visible`).
3. **Imutabilitas Kode Sumber**: Dilarang mengubah kode sumber aplikasi selama sesi pengujian berlangsung untuk memaksakan hasil tes menjadi hijau, kecuali pada sesi khusus perbaikan bug.

---

# BAB 3: TINGKAT 1 — UNIT TESTING ARCHITECTURE (LOGIKA MURNI & BOUNDARIES)

### 3.1 Ruang Lingkup & Fokus Pengujian
Tingkat 1 difokuskan secara eksklusif pada pengujian unit kode terkecil: fungsi murni (*pure functions*), rumus bisnis matematis, skema validasi DTO Zod, helper penanggalan, dan manipulasi string template. Pengujian unit berjalan terisolasi total **tanpa memanggil database, tanpa network, dan tanpa membaca file sistem fisik**.

### 3.2 Metode Pengujian
* **White-Box Testing (Glass Box)**: Menguji alur logika internal kode baris demi baris guna memastikan seluruh cabang percabangan (`if/else`, `switch/case`, `try/catch`) tereksekusi secara tuntas (*100% Branch Coverage*).
* **Boundary Value Analysis (BVA)**: Menguji nilai tepat di ambang batas minimum, batas nominal, dan batas maksimum.
* **Equivalence Partitioning (EP)**: Membagi rentang masukan data menjadi partisi valid dan tidak valid guna mengoptimalkan jumlah skenario uji.

### 3.3 Tooling Stack & Konfigurasi
* **Runner**: `Vitest` via terminal perintah: `npm run test:unit`.
* **Struktur Direktori File Uji**: Seluruh file unit test dipusatkan secara terisolasi pada direktori `backend/tests/unit/**/*.test.js`.
* **Protokol Waktu Statis (*Frozen System Clock Protocol*)**:
  Guna menjamin *Prinsip Universal 3 (Zero-Flakiness)*, seluruh skenario pengujian temporal dilarang menggunakan waktu riil komputer (`new Date()`). Seluruh test suite wajib mengunci jam sistem menggunakan mock timer Vitest:
  ```javascript
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-10T00:00:00.000Z')); // Baseline UTC Statis
  ```
* **Alokasi Anggaran Waktu (*Execution Time Budget*)**:
  Seluruh rangkaian **55 skenario unit test** wajib tereksekusi tuntas dalam waktu **< 1.0 detik** (*Zero I/O Guarantee*). Kegagalan melampaui batas 1.0 detik mengindikasikan adanya kebocoran I/O jaringan atau disk yang menyusup ke unit test.

### 3.4 Target Komponen & Tabel Keterlacakan File Sumber (*Source File Traceability*)

Pengujian Tingkat 1 mencakup 8 domain fungsional yang dipetakan secara presisi ke file sumber fisik di dalam direktori `backend/src/`:

| Domain Uji | Cakupan Logika & Fungsi Target | Lokasi File Sumber Riil (`src/`) | Lokasi File Test Unit (`tests/unit/`) |
|---|---|---|---|
| **Layer 0: Primitives & Security** | `slugifyCompanyName`, `renderEmailTemplate`, `calculateTokenExpiry`, `formatPublicCandidateStatus` | `backend/src/utils/string.helper.js` | `backend/tests/unit/utils/string.helper.test.js` |
| **Layer 0: CSV DDE Defense** | `sanitizeCsvCell` (Perlindungan injeksi formula `=`, `+`, `-`, `@`) | `backend/src/utils/csv.sanitizer.js` | `backend/tests/unit/utils/csv.sanitizer.test.js` |
| **Layer 1: DTO Schemas** | Skema Zod Registrasi, Lowongan, Pertanyaan, Lamaran, Jadwal Interview, Riwayat Kerja/Pendidikan, Kuota Resume | `backend/src/validators/*.validator.js` | `backend/tests/unit/validators/*.test.js` |
| **Layer 2: FSM State Machine** | `validateFsmTransition` (Terminal Withdrawn/Hired, Re-evaluasi 10 char), `validateJobStatusTransition` | `backend/src/services/fsm.service.js` | `backend/tests/unit/services/fsm.service.test.js` |
| **Layer 2: Gating Evaluation** | `evaluateGatingStatus` (Validasi 5 kriteria profil perusahaan) | `backend/src/services/companyGating.service.js` | `backend/tests/unit/services/companyGating.service.test.js` |
| **Layer 3: Storage & Files** | `validateFileMeta` (Ambang 5MB biner, MIME whitelist), `generateStoragePath` | `backend/src/utils/storage.helper.js` | `backend/tests/unit/utils/storage.helper.test.js` |
| **Layer 4: Query & Pagination** | `calculatePagination` (Offset, limit clamping), `buildDeterministicSort` | `backend/src/utils/query.helper.js` | `backend/tests/unit/utils/query.helper.test.js` |
| **Layer 4: Math & Analytics** | `calculateTimeToHire`, `calculateAverageScore`, `calculateConversionRate` | `backend/src/utils/analytics.math.js` | `backend/tests/unit/utils/analytics.math.test.js` |

### 3.5 Prinsip & Ambang Kelulusan
1. **Prinsip F.I.R.S.T**: *Fast* (< 1.0s), *Independent* (tanpa dependensi antar-test), *Repeatable* (deterministik), *Self-Validating* (assertion biner tegas), *Thorough* (melingkupi seluruh nilai batas BVA).
2. **Definisi Matematis Time-to-Hire Terkunci**:
   Perhitungan Time-to-Hire wajib mengacu pada durasi selisih 24 jam bulat berbasis UTC milidetik:
   $$\text{TTH (Hari)} = \left\lfloor \frac{\text{hired\_at (ms)} - \text{applied\_at (ms)}}{1000 \times 60 \times 60 \times 24} \right\rfloor$$
   Kandidat yang diproses dan diterima dalam durasi $< 24\text{ jam}$ kalender wajib menghasilkan nilai `0` hari (*Zero-Day Hire*), terlepas dari pergantian tengah malam WIB.
3. **Definisi Pembulatan Agregasi Skor Bintang Terkunci**:
   Wajib menggunakan algoritma pembulatan aritmatika baku (*Half-Up Rounding*) presisi 1 desimal:
   $$\text{Score} = \frac{\text{Math.round}(\text{average} \times 10)}{10}$$
4. **Prinsip Fail-Safe Validasi DTO Zod**:
   Seluruh assertion validator Zod diuji menggunakan metode `.safeParse(payload)` dengan memverifikasi properti `result.success === false` dan kode `result.error.issues[0].message`, tanpa mengandalkan *unhandled exception crash*.
5. **Ambang Kelulusan**: **100% Pass** dengan *branch coverage* $\ge 98\%$ pada seluruh file helper, validator, dan engine logika murni.

### 3.6 Matriks Lengkap Unit Test Cases (Exhaustive 55-Scenario Suite)

Matriks pengujian di bawah ini disusun secara hierarkis mengikuti **Arsitektur Perangkat Lunak Berlapis (Layer 0 Primitives $\rightarrow$ Layer 4 Analytics)** dan diturunkan menggunakan **Metodologi Derivasi 5-Dimensi** (*Equivalence Partitioning, BVA 5-Point, Type Mutation, Temporal Limits, dan Branch MC/DC*).

---

#### 3.6.1 Layer 0: Primitives, String Transformers, URL Builders & Sanitasi Security

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-STR-01]** | Slugifier: Pembersihan Simbol & Tanda Baca | FR-3.1 / TASK-2.3.1 | `slugifyCompanyName(name)` | EP / Sanitasi | `"PT. Teknologi Maju Sejahtera & Rekan (Cabang Jakarta) #1"` | Return: `"pt-teknologi-maju-sejahtera-rekan-cabang-jakarta-1"` |
| **[UT-STR-02]** | Slugifier: Trailing Dash & Multiple Whitespaces | FR-3.1 / TASK-2.3.1 | `slugifyCompanyName(name)` | Adversarial | `"---Acme    Corporation---"` | Return: `"acme-corporation"` (Tanpa dash ganda, tanpa dash di awal/akhir). |
| **[UT-STR-03]** | Email Replacer: Substitusi Lengkap 4 Tag Resmi | FR-11.2 / TASK-5.4.1 | `renderEmailTemplate(template, vars)` | Nominal / EP | Template: `"Halo {{candidate_name}}, selamat bergabung di {{company_name}} sebagai {{job_title}} pada {{date}}."`<br>Vars lengkap: `{ candidate_name: "Budi", company_name: "PT Acme", job_title: "Developer", date: "2026-06-01" }` | 100% tag tergantikan menjadi: `"Halo Budi, selamat bergabung di PT Acme sebagai Developer pada 2026-06-01."` |
| **[UT-STR-04]** | Email Replacer: Tag Tak Dikenal Tetap Aman | FR-11.2 / TASK-5.4.1 | `renderEmailTemplate(template, vars)` | Negative / Edge | Template memuat tag liar: `"Gaji Anda: {{salary_amount}}"` dengan vars `{ candidate_name: "Budi" }` | Tag `{{salary_amount}}` dibiarkan utuh sebagai teks literal tanpa melempar runtime exception. |
| **[UT-STR-05]** | Email Replacer: XSS Attack Payload Escaping | FR-11.2 / TASK-5.4.1 | `renderEmailTemplate(template, vars)` | Security Injection | Variable bernilai serangan XSS:<br>`candidate_name: "<script>alert('hack')</script>"` | String HTML tersanitasi menjadi `&lt;script&gt;alert('hack')&lt;/script&gt;`. |
| **[UT-STR-06]** | Deterministic Tie-Breaker: Sorting Query Builder | FR-5.5 / TASK-4.1.1 | `buildDeterministicSort(sortBy, order)` | Logic Branch | Skenario A: `sortBy: "published_at", order: "desc"`<br>Skenario B: `sortBy: "salary", order: "asc"` | Skenario A: `"ORDER BY published_at DESC, id ASC"`<br>Skenario B: `"ORDER BY salary_max ASC, id ASC"` (`id ASC` wajib selalu tersemat di akhir). |
| **[UT-STR-07]** | Deterministic Tie-Breaker: SQL Injection Whitelist | FR-5.5 / TASK-4.1.1 | `buildDeterministicSort(sortBy, order)` | Security / SQLi | Input parameter manipulatif:<br>`sortBy: "published_at; DROP TABLE users; --"` | Kolom tidak terdaftar di whitelist; fallback aman ke default: `"ORDER BY published_at DESC, id ASC"`. |
| **[UT-STR-08]** | Sanitasi Status Publik Pelamar (Anti-Leak) | FR-13.2 / TASK-4.2.2 | `formatPublicCandidateStatus(stage, status)` | Security / State | Skenario A: `status: "withdrawn"`<br>Skenario B: `status: "rejected"`<br>Skenario C: `stage: "Coding Challenge Rahasia"` (active) | Skenario A: `"Lamaran Ditarik"`<br>Skenario B: `"Tidak Lolos Seleksi"`<br>Skenario C: `"Dalam Proses Seleksi"` (Nama tahapan rahasia internal HR tidak pernah bocor ke publik). |
| **[UT-STR-09]** | Token Expiry Helper: Perhitungan Waktu Kedaluwarsa UTC | NFR Security / TASK-2.1.2 | `calculateTokenExpiry(seconds, baseDate)` | Temporal / UTC | Base: `"2026-05-10T12:00:00.000Z"`<br>A. Access Token (`900s` / 15m)<br>B. Password Reset (`3600s` / 1 jam)<br>C. Refresh Token (`2592000s` / 30 hari) | A: `"2026-05-10T12:15:00.000Z"`<br>B: `"2026-05-10T13:00:00.000Z"`<br>C: `"2026-06-09T12:00:00.000Z"` (Timestamp ISO UTC presisi). |

---

#### 3.6.2 Layer 0: Sanitasi CSV & Pertahanan Formula DDE Injection (Domain Data Export Security)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-SEC-01]** | CSV Formula Injection (DDE Defense): Karakter Awalan | FR-7.3 / NFR Security | `sanitizeCsvCell(value)` | Security Injection | Skenario A: `"=CMD\|'/C calc'!A0"` (Formula =)<br>Skenario B: `"+2+5"` (Formula +)<br>Skenario C: `"-5+2"` (Formula -)<br>Skenario D: `"@SUM(A1:A10)"` (Formula @) | Seluruhnya disematkan tanda petik tunggal di awal:<br>A: `"'=CMD\|'/C calc'!A0"`<br>B: ` "'+2+5"`<br>C: `"'-5+2"`<br>D: `"'@SUM(A1:A10)"` |
| **[UT-SEC-02]** | CSV Delimiter Escaping: Nilai Memuat Tanda Koma | FR-7.3 / TASK-4.3.3 | `sanitizeCsvCell(value)` | EP / Delimiter | Skenario A: `"Budi, S.Kom"`<br>Skenario B: `"Jakarta, Indonesia"` | Otomatis terbungkus tanda kutip ganda:<br>A: `"\"Budi, S.Kom\""`<br>B: `"\"Jakarta, Indonesia\""` |
| **[UT-SEC-03]** | CSV Quote Escaping & Newline Stripping | FR-7.3 / TASK-4.3.3 | `sanitizeCsvCell(value)` | Adversarial | Input catatan: `"Kandidat \"hebat\"\nSiap kerja"` | Tanda kutip di-escape ganda dan newline diganti spasi:<br>`"\"Kandidat \"\"hebat\"\" Siap kerja\""`. |

---

#### 3.6.3 Layer 1: Skema Validasi DTO Zod & Boundary Input (Domain DTO Schemas)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Skema Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-ZOD-01]** | Company Register: Validasi Format Email RFC 5322 | FR-1.1 / TASK-2.1.1 | `companyRegisterSchema` | EP / Robustness | Skenario A: `"admin@acme.co.id"`<br>Skenario B: `"ADMIN@ACME.COM"` (kapital)<br>Skenario C: `"admin@"` (tanpa domain)<br>Skenario D: `"admin acme.com"` (spasi) | Skenario A: `success: true`.<br>Skenario B: `success: true` & email dinormalisasi ke lowercase.<br>Skenario C & D: `success: false`, error `ERR_INVALID_EMAIL_FORMAT`. |
| **[UT-ZOD-02]** | Company Register: Panjang Password BVA 5-Point | FR-1.1 / TASK-2.1.1 | `companyRegisterSchema` | BVA 5-Point | Batas murni panjang karakter 8–100:<br>A. 6 char: `"rahasia"` (Min - 2)<br>B. 7 char: `"rahasia1"` (Min - 1)<br>C. 8 char: `"rahasia2"` (Min)<br>D. 32 char: (Nominal)<br>E. 101 char: (Max > 100) | A & B: `success: false`, error `ERR_PASSWORD_TOO_SHORT`.<br>C & D: `success: true`.<br>E: `success: false`, error `ERR_PASSWORD_TOO_LONG`. |
| **[UT-ZOD-03]** | Company Register: Nama Perusahaan Whitespace Only | FR-1.1 / TASK-2.1.1 | `companyRegisterSchema` | Adversarial | Skenario A: `""` (string kosong)<br>Skenario B: `"     "` (5 spasi tanpa karakter) | `success: false`, error `ERR_COMPANY_NAME_REQUIRED`. |
| **[UT-ZOD-04]** | Candidate Register: Format Nomor WhatsApp Indonesia | FR-2.1 / TASK-2.2.1 | `candidateProfileSchema` | EP / Regex | Skenario A: `"08123456789"` (Lokal valid)<br>Skenario B: `"+628123456789"` (Internasional valid)<br>Skenario C: `"0812"` (4 digit, terlalu pendek)<br>Skenario D: `"08123456789012345"` (> 15 digit)<br>Skenario E: `"0812-ABCD-EFGH"` (huruf) | Skenario A & B: `success: true`.<br>Skenario C, D, E: `success: false`, error `ERR_INVALID_PHONE_NUMBER`. |
| **[UT-ZOD-05]** | Job Posting: Kuota Lowongan BVA 5-Point | FR-4.1 / TASK-3.1.2 | `jobPayloadSchema` | BVA 5-Point | A. `-1` (Negatif)<br>B. `0` (Ambang batas bawah)<br>C. `1` (Batas minimal valid)<br>D. `25` (Nominal)<br>E. `1001` (Melebihi batas sistem 1.000) | A & B: `success: false`, error `ERR_INVALID_QUOTA_MIN`.<br>C & D: `success: true`.<br>E: `success: false`, error `ERR_INVALID_QUOTA_MAX`. |
| **[UT-ZOD-06]** | Job Posting: Panjang Karakter Deskripsi Lowongan | FR-4.1 / TASK-3.1.2 | `jobPayloadSchema` | BVA 3-Point | A. String panjang 49 karakter (Min - 1)<br>B. String panjang 50 karakter (Min)<br>C. String panjang 51 karakter (Min + 1) | A: `success: false`, error `ERR_DESCRIPTION_TOO_SHORT`.<br>B & C: `success: true`. |
| **[UT-ZOD-07]** | Job Posting: Logika Rentang Gaji (Salary Range) | FR-4.1 / TASK-3.1.2 | `jobPayloadSchema` | Logic Branch | Skenario A: `salary_min: 5000000, salary_max: 10000000`<br>Skenario B: `salary_min: 10000000, salary_max: 5000000`<br>Skenario C: `salary_min: 5000000, salary_max: 5000000` | Skenario A: `success: true`.<br>Skenario B: `success: false`, error `ERR_SALARY_RANGE_INVALID`.<br>Skenario C: `success: true` (Fixed salary). |
| **[UT-ZOD-08]** | Job Posting: Validasi Flag Visibilitas Gaji | FR-4.1 / TASK-3.1.2 | `jobPayloadSchema` | State / Default | Skenario A: `{ salary_visible: false }`<br>Skenario B: `{}` (tanpa menyertakan flag) | Skenario A: `success: true, data.salary_visible === false`.<br>Skenario B: `success: true, data.salary_visible === true` (Default aman). |
| **[UT-ZOD-09]** | Custom Questions: Opsi Pilihan Ganda Minimal 2 | FR-4.4 / TASK-3.2.1 | `customQuestionSchema` | BVA / Enum | Tipe: `single_choice`<br>A. `options: ["A", "B"]` (2 opsi)<br>B. `options: ["A"]` (1 opsi)<br>C. `options: []` (0 opsi) | A: `success: true`.<br>B & C: `success: false`, error `ERR_MIN_TWO_OPTIONS_REQUIRED`. |
| **[UT-ZOD-10]** | Custom Questions: Deteksi Opsi Duplikat | FR-4.4 / TASK-3.2.1 | `customQuestionSchema` | Adversarial | `options: ["Full Time", "Part Time", "Full Time"]` | `success: false`, error `ERR_DUPLICATE_QUESTION_OPTIONS`. |
| **[UT-ZOD-11]** | Application Submit: Pertanyaan Wajib Tanpa Jawaban | FR-6.2 / TASK-4.1.3 | `applicationSubmitSchema` | Logic Branch | Pertanyaan memiliki flag `is_required: true`, tetapi payload jawaban berisi `answer_text: ""` atau `selected_options: []` | `success: false`, error `ERR_REQUIRED_QUESTION_UNANSWERED`. |
| **[UT-ZOD-12]** | Interview Schedule: Validasi Tanggal Lampau (Frozen Clock) | FR-9.3 / TASK-5.3.1 | `interviewScheduleSchema` | Temporal BVA | Mock Clock: `2026-05-10T00:00:00Z`<br>`scheduled_at: "2026-05-09T10:00:00Z"` (Tanggal lampau) | `success: false`, error `ERR_PAST_DATE_NOT_ALLOWED`. |
| **[UT-ZOD-13]** | Interview Schedule: Window Waktu Negatif / Nol | FR-9.1 / TASK-5.3.1 | `interviewScheduleSchema` | Logic Branch | Skenario A: `end_at` lebih kecil dari `scheduled_at`<br>Skenario B: `end_at` sama persis dengan `scheduled_at` | `success: false`, error `ERR_INVALID_INTERVIEW_DURATION`. |
| **[UT-ZOD-14]** | Interview Schedule: Validasi Link Google Meet/Zoom | FR-9.1 / TASK-5.3.1 | `interviewScheduleSchema` | EP / Conditional | Tipe: `'online'`<br>A. `location_or_link: "https://meet.google.com/abc-defg-hij"`<br>B. `location_or_link: "Ruang Rapat Lantai 2"` (Bukan URL) | A: `success: true`.<br>B: `success: false`, error `ERR_INVALID_ONLINE_MEETING_URL`. |
| **[UT-ZOD-15]** | Candidate Experience: Kronologi Tanggal Kerja | FR-6.1 / TASK-4.2.4 | `candidateExperienceSchema` | Logic Branch | Skenario A: `start_date: "2024-01-01", end_date: "2022-01-01"`<br>Skenario B: `start_date: "2022-01-01", end_date: "2024-01-01"` | Skenario A: `success: false`, error `ERR_INVALID_EXPERIENCE_DATES`.<br>Skenario B: `success: true`. |
| **[UT-ZOD-16]** | Candidate Experience: Pekerjaan Saat Ini (`is_current`) | FR-6.1 / TASK-4.2.4 | `candidateExperienceSchema` | Conditional | Skenario A: `is_current: true`, `end_date: null`<br>Skenario B: `is_current: false`, `end_date: null` | Skenario A: `success: true` (Pekerjaan aktif).<br>Skenario B: `success: false`, error `ERR_END_DATE_REQUIRED` (Pekerjaan lampau wajib isi end_date). |
| **[UT-ZOD-17]** | Candidate Education: Validasi Skala Nilai IPK / GPA | FR-6.1 / TASK-4.2.4 | `candidateEducationSchema` | BVA 5-Point | A. `-0.50` (Negatif)<br>B. `0.00` (Batas bawah)<br>C. `3.75` (Nominal)<br>D. `4.00` (Batas atas)<br>E. `4.01` (Melebihi skala 4.0) | A: `success: false`.<br>B, C, D: `success: true`.<br>E: `success: false`, error `ERR_INVALID_GPA_RANGE`. |
| **[UT-ZOD-18]** | Master Resume Library: Batas Maksimal 5 CV Berlabel | FR-6.3 / TASK-4.2.5 | `resumeUploadSchema` | BVA Boundary | A. Total CV tersimpan saat ini = 4, upload 1 lagi<br>B. Total CV tersimpan saat ini = 5, upload 1 lagi | A: `success: true` (Total menjadi 5).<br>B: `success: false`, error `ERR_RESUME_QUOTA_EXCEEDED` (Maksimal 5 berkas master). |

---

#### 3.6.4 Layer 2: Validasi Matriks Transisi FSM Murni (Domain Core State Machines)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-FSM-01]** | FSM Terminal: Larangan Mutasi Status Withdrawn | FR-6.5 / TASK-5.1.2 | `validateFsmTransition(from, to, meta)` | FSM Invariant | Skenario A: `from: "withdrawn", to: "screening"`<br>Skenario B: `from: "withdrawn", to: "applied"`<br>Skenario C: `from: "withdrawn", to: "hired"` | Seluruh transisi dilarang mutlak; throw `ERR_STATE_IS_TERMINAL` (Withdrawn terkunci permanen). |
| **[UT-FSM-02]** | FSM Terminal: Larangan Mutasi Status Hired | FR-10.1 / TASK-5.1.2 | `validateFsmTransition(from, to, meta)` | FSM Invariant | Skenario A: `from: "hired", to: "interview"`<br>Skenario B: `from: "hired", to: "rejected"` | Seluruh transisi dilarang mutlak; throw `ERR_STATE_IS_TERMINAL` (Hired adalah status keputusan akhir). |
| **[UT-FSM-03]** | FSM Re-evaluasi: Rejected ke Tahap Aktif (FR-8.3) | FR-8.3 / TASK-5.1.3 | `validateFsmTransition(from, to, meta)` | BVA 3-Point | `from: "rejected", to: "screening"`<br>A. `reason: "Salah klik"` (9 karakter)<br>B. `reason: "Salah klik!"` (10 karakter)<br>C. `reason: "Kandidat memenuhi syarat setelah re-evaluasi portfolio"` (54 char) | A: Ditolak `ERR_REASON_TOO_SHORT` (Min 10 karakter wajib).<br>B & C: Valid (Lulus). |
| **[UT-FSM-04]** | FSM Job Lifecycle Transitions | FR-4.1 / TASK-3.1.2 | `validateJobStatusTransition(from, to)` | FSM Matrix | Skenario A: `draft -> published` (Valid)<br>Skenario B: `published -> closed` (Valid)<br>Skenario C: `closed -> published` (Reopen valid)<br>Skenario D: `closed -> draft` (Ilegal)<br>Skenario E: `published -> draft` (Ilegal) | Skenario A, B, C: Valid.<br>Skenario D & E: Throw `ERR_INVALID_STATUS_TRANSITION`. |

---

#### 3.6.5 Layer 2: Evaluasi Logika 5 Kriteria Gating Profil Perusahaan (Domain Gating Logic)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-GATE-01]** | Gating Checklist: 5 Syarat Lengkap Paripurna | FR-3.2 / TASK-2.3.3 | `evaluateGatingStatus(profile, locations)` | Positive / Full | Profile: `{ name: "PT Acme", industry: "IT", size: "11-50", description: "Perusahaan teknologi terkemuka dengan fokus SaaS..." (55 char) }`<br>Locations: `[{ city: "Jakarta", is_headquarters: true }]` | Return: `{ can_publish: true, is_complete: true, missing_fields: [] }`. Logo bersifat opsional (tidak memblokir). |
| **[UT-GATE-02]** | Gating Checklist: Ketiadaan Kantor Pusat (Headquarters) | FR-3.2 / TASK-2.3.3 | `evaluateGatingStatus(profile, locations)` | Negative / Logic | Profile lengkap, memiliki 3 lokasi kantor, tetapi seluruhnya `is_headquarters: false` | Return: `{ can_publish: false, missing_fields: ["Minimal 1 Lokasi Kantor Pusat (Headquarters)"] }`. |
| **[UT-GATE-03]** | Gating Checklist: Deskripsi di Bawah 50 Karakter | FR-3.2 / TASK-2.3.3 | `evaluateGatingStatus(profile, locations)` | BVA Min | Profile memiliki deskripsi sepanjang 49 karakter (Min - 1) | Return: `{ can_publish: false, missing_fields: ["Deskripsi perusahaan minimal 50 karakter"] }`. |

---

#### 3.6.6 Layer 3: Upload File Meta & Boundary Byte 5 MB Eksak (Domain File & Storage Meta)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-FILE-01]** | File Size: Batas Biner 5 MB Eksak (5.242.880 Bytes) | FR-6.3 / TASK-2.3.2 | `validateFileMeta(size, mime, bucket)` | BVA 3-Point | Skenario A: `5242880` bytes (5 MB pas)<br>Skenario B: `5242881` bytes (5 MB + 1 byte)<br>Skenario C: `0` bytes (File kosong) | Skenario A: Valid (Lulus).<br>Skenario B: Ditolak `ERR_FILE_TOO_LARGE`.<br>Skenario C: Ditolak `ERR_FILE_EMPTY`. |
| **[UT-FILE-02]** | Bucket `resumes`: Whitelist Dokumen PDF & DOCX | FR-6.3 / TASK-4.2.5 | `validateFileMeta(size, mime, "resumes")` | Whitelist MIME | Skenario A: `application/pdf`<br>Skenario B: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`<br>Skenario C: `image/png`<br>Skenario D: `application/x-msdownload` (.exe) | Skenario A & B: Valid.<br>Skenario C & D: Ditolak `ERR_INVALID_RESUME_FORMAT`. |
| **[UT-FILE-03]** | Bucket `logos` & `banners`: Whitelist Gambar Visual | FR-3.1 / TASK-2.3.2 | `validateFileMeta(size, mime, "logos")` | Whitelist MIME | Skenario A: `image/jpeg`<br>Skenario B: `image/png`<br>Skenario C: `image/webp`<br>Skenario D: `application/pdf` | Skenario A, B, C: Valid.<br>Skenario D: Ditolak `ERR_INVALID_IMAGE_FORMAT`. |
| **[UT-FILE-04]** | Storage Path Generator: Sanitasi Path Traversal | Dok 04 §8.1 / TASK-2.3.2 | `generateStoragePath(bucket, ownerId, ext)` | Security / Path | `bucket: "resumes"`, `ownerId: "../../etc/passwd"`, `ext: "pdf"` | Karakter `../` di-strip aman; path wajib berformat: `"resumes/{sanitized_uuid}/{random_uuid}.pdf"`. |

---

#### 3.6.7 Layer 4: Query Sorting Tie-Breaker & Kalkulasi Matematika Pagination (Domain Query & Pagination)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-PAGE-01]** | Pagination: Kalkulasi Offset & Limit Baku | FR-5.4 / TASK-4.1.1 | `calculatePagination(total, page, limit)` | Math Nominal | `totalRows: 25`, `page: 3`, `limit: 10` | Return: `{ offset: 20, limit: 10, totalPages: 3, hasNext: false, hasPrev: true }`. |
| **[UT-PAGE-02]** | Pagination Clamping: Halaman Negatif & Limit Raksasa | FR-5.4 / TASK-4.1.1 | `calculatePagination(total, page, limit)` | BVA Robustness | Skenario A: `page: -5`, `limit: 10`<br>Skenario B: `page: 1`, `limit: 5000` (Melebihi max sistem 50) | Skenario A: `page` otomatis di-clamp ke `1`, `offset: 0`.<br>Skenario B: `limit` otomatis di-clamp ke `50`. |
| **[UT-PAGE-03]** | Pagination: Dataset Kosong (Zero Rows) | FR-5.4 / TASK-4.1.1 | `calculatePagination(total, page, limit)` | BVA Zero | `totalRows: 0`, `page: 1`, `limit: 10` | Return: `{ totalPages: 1, hasNext: false, hasPrev: false, offset: 0 }` (Tanpa divide by zero). |

---

#### 3.6.8 Layer 4: Formula Matematis Time-to-Hire & Agregasi Analitik (Domain Math & Analytics)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Fungsi Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[UT-MATH-01]** | Time-to-Hire: Durasi < 24 Jam (Zero-Day Hire) | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | BVA Min | `applied: "2026-05-10T08:00:00Z"`<br>`hired: "2026-05-10T17:00:00Z"` (9 jam kerja) | Return integer `0` (Kandidat diproses pada hari yang sama dihitung 0 hari kalender penuh). |
| **[UT-MATH-02]** | Time-to-Hire: Lintas Pergantian Tengah Malam (< 24 Jam) | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | Edge Case | `applied: "2026-05-10T23:00:00Z"`<br>`hired: "2026-05-11T01:00:00Z"` (2 jam selisih) | Return integer `0` (Durasi riil 2 jam tidak digelembungkan menjadi 1 hari hanya karena melewati jam 00:00). |
| **[UT-MATH-03]** | Time-to-Hire: Lintas Bulan Genap vs Ganjil | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | Temporal | Skenario A: 25 Apr 08:00 ke 05 Mei 08:00 (Apr 30 hari).<br>Skenario B: 25 Mei 08:00 ke 05 Jun 08:00 (Mei 31 hari). | Skenario A: Return `10` hari.<br>Skenario B: Return `11` hari kalender tepat. |
| **[UT-MATH-04]** | Time-to-Hire: Lintas Tahun Kabisat | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | Temporal | Skenario A (Kabisat 2028): 27 Feb 2028 ke 02 Mar 2028.<br>Skenario B (Biasa 2026): 27 Feb 2026 ke 02 Mar 2026. | Skenario A: Return `4` hari (Feb 29 hari).<br>Skenario B: Return `3` hari (Feb 28 hari). |
| **[UT-MATH-05]** | Time-to-Hire: Lintas Tahun Kalender | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | Temporal | `applied: "2026-12-25T10:00:00Z"`<br>`hired: "2027-01-05T10:00:00Z"` | Return integer `11` hari kalender. |
| **[UT-MATH-06]** | Time-to-Hire: Anomali Kronologis (Hired < Applied) | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | Negative / Logic | `applied: "2026-05-15T00:00:00Z"`<br>`hired: "2026-05-01T00:00:00Z"` | Throw exception resmi: `ERR_INVALID_DATE_RANGE`. |
| **[UT-MATH-07]** | Time-to-Hire: Falsy & Invalid Date Parsing | FR-14.2 / TASK-6.1.1 | `calculateTimeToHire(applied, hired)` | Type Mutation | Skenario A: `applied: null`, `hired: "2026-05-10"`<br>Skenario B: `applied: "invalid-date"`, `hired: "2026-05-10"`<br>Skenario C: `applied: undefined`, `hired: undefined` | Seluruh skenario throw `ERR_INVALID_DATE_FORMAT` tanpa runtime crash Node.js. |
| **[UT-MATH-08]** | Agregasi Skor Bintang: Pembulatan Half-Up 1 Desimal | FR-12.2 / TASK-5.2.3 | `calculateAverageScore(scoresArray)` | Nominal / EP | Input array integer:<br>Skenario A: `[4, 5]`<br>Skenario B: `[3, 4, 4]` (3.6666...)<br>Skenario C: `[1, 2, 3, 4, 5]` | Skenario A: Return `4.5`<br>Skenario B: Return `3.7` (Pembulatan half-up aritmatika 1 desimal).<br>Skenario C: Return `3.0` |
| **[UT-MATH-09]** | Agregasi Skor Bintang: Array Kosong (Anti Division-by-Zero) | FR-12.2 / TASK-5.2.3 | `calculateAverageScore(scoresArray)` | BVA / Zero | Skenario A: `scores: []` (Array kosong)<br>Skenario B: `scores: null` | Return `0.0` (tidak menghasilkan `NaN` atau `Infinity`). |
| **[UT-MATH-10]** | Agregasi Skor Bintang: Out-of-Range Boundary | FR-12.2 / TASK-5.2.3 | `calculateAverageScore(scoresArray)` | Adversarial | Array memuat nilai di luar skala 1–5:<br>`[0, 4, 5]` atau `[6, 5]` atau `[-1, 3]` | Throw exception: `ERR_INVALID_SCORE_RANGE`. |
| **[UT-MATH-11]** | Rasio Konversi Funnel: Pembagi Nol (Zero Total) | FR-14.3 / TASK-6.1.1 | `calculateConversionRate(stageCount, total)` | BVA / Zero | `stageCount: 0`, `totalApplicants: 0` | Return string `"0.0%"` (bukan `NaN%` atau `Infinity%`). |

---

### 3.7 Checklist Verifikasi Kelengkapan & Mutation Testing Tingkat 1

Untuk menjamin secara ilmiah bahwa **seluruh kemungkinan telah diuji tanpa ada test case yang terlewat**:
1. **Target Branch Coverage Mutlak**:
   Eksekusi `npm run test:unit -- --coverage` wajib mencatat:
   * **Stmts**: $100\%$
   * **Branch**: $\ge 98\%$
   * **Funcs**: $100\%$
   * **Lines**: $100\%$
2. **Uji Ketahanan Mutasi (*Mutation Testing Guarantee*)**:
   Setiap assertion diuji menggunakan prinsip sabotase logika:
   * Jika operator di `calculateTimeToHire` diubah dari `>` menjadi `>=`, test `[UT-MATH-01]` wajib gagal (*Mutant Killed*).
   * Jika validator Zod diubah batas deskripsinya dari `min(50)` menjadi `min(49)`, test `[UT-ZOD-06]` wajib gagal (*Mutant Killed*).
   * Jika batas byte diubah dari `5242880` menjadi `5000000`, test `[UT-FILE-01]` wajib gagal (*Mutant Killed*).
   * Jika sanitasi CSV lupa menyematkan petik pada karakter `=`, test `[UT-SEC-01]` wajib gagal (*Mutant Killed*).
   * Jika klausa sorting deterministik kehilangan `, id ASC`, test `[UT-STR-06]` wajib gagal (*Mutant Killed*).
3. **Zero External I/O & Anggaran Kecepatan**:
   Seluruh **55 skenario uji** di atas wajib selesai dieksekusi oleh Vitest dalam waktu **< 1.0 detik** karena berjalan 100% di dalam memori prosesor tanpa dependensi disk maupun database.

---

# BAB 4: TINGKAT 2 — COMPONENT & MIDDLEWARE TESTING ARCHITECTURE (SUBSISTEM)

### 4.1 Ruang Lingkup & Fokus Pengujian
Tingkat 2 difokuskan secara eksklusif pada pengujian satu subsistem terisolasi: komponen antarmuka pengguna (React UI Components), route guards sisi klien, manajemen state & konteks autentikasi (`AuthContext` & state Kanban), serta middleware keamanan backend Express. Pengujian berjalan murni di dalam memori prosesor menggunakan simulasi lingkungan (*mock objects* `req`, `res`, `next()` untuk Express, dan `jsdom` untuk React) **tanpa menyentuh basis data PostgreSQL dan tanpa melakukan panggilan jaringan HTTP riil**.

### 4.2 Metode Pengujian
* **Fail-Closed Security Testing**: Menguji pertahanan middleware agar selalu memblokir akses secara aman (*default-deny*) saat token tidak valid, format header rusak, role tidak mencukupi, atau konteks pengguna hilang (`req.user === undefined`).
* **State Mutation & Invariant Testing**: Memvalidasi perubahan state global pada memori tanpa me-render keseluruhan aplikasi, termasuk pengujian sinkronisasi sesi ke `localStorage` dan pembersihan total memori (*Zero Memory Leak*).
* **Asynchronous Failure & Rollback Testing**: Memverifikasi perilaku antarmuka saat terjadi kegagalan jaringan, memastikan aksi mutasi optimistik (*optimistic update*) pada kartu Kanban secara otomatis me-rollback posisi kartu ke kolom asal tanpa merusak state counter.
* **Accessible DOM Behavior Testing**: Menguji komponen UI interaktif menggunakan `@testing-library/react` dan `@testing-library/user-event` dengan prinsip *test behavior, not implementation details* (pengujian perangkap fokus / *focus trapping*, respons tombol keyboard `Escape` & `Tab`, scroll lock siklus hidup, dan kepatuhan atribut ARIA).

### 4.3 Tooling Stack & Konfigurasi
* **Runner**: `Vitest` dengan dual-environment:
  * Backend Middlewares: Environment `node` via perintah: `npm run test:middleware`.
  * Frontend Components & State: Environment `jsdom` via perintah: `npm run test:component`.
* **Assertion & User Simulation**: `@testing-library/react` dan `@testing-library/user-event` untuk interaksi DOM peramban virtual.
* **Protokol Sanitasi Memori & Isolasi State**:
  Guna mencegah kebocoran sesi antar-pengujian (*state bleeding*), file setup runner frontend wajib mengeksekusi pembersihan mutlak setiap kali satu test selesai:
  ```javascript
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
  ```
* **Protokol Asinkron Hook React**: Seluruh mutasi state asinkron pada custom hook wajib diverifikasi menggunakan wrapper `await waitFor(() => { ... })` guna mencegah peringatan *unwrapped act warning*.
* **In-Memory Network Mocking**: Seluruh panggilan Axios diisolasi menggunakan mock `vi.mock('../utils/axios')` tanpa dependensi pihak ketiga tambahan.
* **Alokasi Anggaran Waktu (*Execution Time Budget*)**: Seluruh rangkaian **31 skenario uji Tingkat 2** wajib selesai dieksekusi dalam waktu **< 3.0 detik** (*In-Memory Subsystem Guarantee*).

### 4.4 Target Komponen & Tabel Keterlacakan File Sumber (*Source File Traceability*)

Pengujian Tingkat 2 mencakup 4 klaster subsistem yang disusun mengikuti hierarki dependensi arsitektural:

| Klaster Subsistem | Komponen / Middleware Target | Lokasi File Sumber Riil | Lokasi File Test Unit |
|---|---|---|---|
| **Klaster 1: Backend Middlewares** | `authenticateUser`, `requireRole`, `scopeToCompany`, `validateBody`, `rateLimiters`, `errorHandler` | `backend/src/middlewares/*.js` | `backend/tests/unit/middlewares/*.test.js` |
| **Klaster 2: Frontend State & Contexts** | `AuthContext` (Login, Logout, Sync), `useKanbanStore` (Optimistic, Rollback & Terminal Lock) | `frontend/src/contexts/AuthContext.jsx` | `frontend/src/__tests__/authContext.test.jsx` |
| **Klaster 3: Frontend Route Guards** | `ProtectedCompanyRoute`, `ProtectedCandidateRoute`, `AdminOnlyRoute`, `PublicOnlyRoute` | `frontend/src/App.jsx` | `frontend/src/__tests__/guards.test.jsx` |
| **Klaster 4: UI Components & A11y** | `Badge`, `SalaryDisplay`, `Modal`, `TagPill`, `Button`, `EmptyState` | `frontend/src/components/ui/*.jsx` | `frontend/src/components/ui/__tests__/*.test.jsx` |

### 4.5 Prinsip & Ambang Kelulusan
1. **Prinsip Fail-Closed Mutlak**: Setiap celah keamanan atau anomali wewenang wajib langsung memicu penolakan aman (*default-deny*) dengan kode status HTTP baku (401, 403, 422, 429).
2. **Prinsip Zero Memory Leak**: Aksi `logout()` wajib mengosongkan seluruh memori state dan membersihkan token dari `localStorage` tanpa menyisakan artefak data pengguna sebelumnya.
3. **Standar TDD Acceptance Komponen Modal**: File `Modal.jsx` pada repositori saat ini masih berupa prototipe awal. Skenario `[CT-UI-03]` s/d `[CT-UI-05]` sengaja dirancang sebagai gerbang penerimaan berbasis tes (*Test-Driven Acceptance Gate*) untuk menegakkan pemenuhan standar aksesibilitas WCAG 2.1 AA Dokumen 03 §1.3 (Focus Trapping, Escape Key, dan Body Scroll Lock).
4. **Normalisasi JSON Response Envelope**: Seluruh middleware wajib merespons dengan struktur envelope standar Dokumen 04 §4.4 (`{ success: false, message: '...' }`).
5. **Ambang Kelulusan**: **100% Pass** dengan *branch coverage* $\ge 95\%$ pada seluruh middleware keamanan dan route guard sisi klien.

### 4.6 Matriks Lengkap Component & Middleware Test Cases (Exhaustive 31-Scenario Suite)

Matriks pengujian di bawah ini diturunkan menggunakan **Metodologi Derivasi 6-Dimensi Subsistem** (*Fail-Closed Security, State Mutation, Async Rollback, A11y & Keyboard, Lifecycle Cleanup, dan Visual Semantics*) guna menjamin ketiadaan celah keamanan maupun cacat interaksi pengguna.

---

#### 4.6.1 Klaster 1: Backend Middlewares & Keamanan Fail-Closed (Domain Security & Request Lifecycle)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Komponen Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[CT-MW-01]** | Auth Middleware: Ketiadaan Header Authorization | FR-1.2 / TASK-2.1.2 | `authenticateUser.js` | Fail-Closed | `req.headers.authorization = undefined` | `res.status` terpanggil dengan `401`, response memuat `{ success: false, message: 'Autentikasi diperlukan. Token tidak ditemukan.' }`, `next()` tidak dipanggil. |
| **[CT-MW-02]** | Auth Middleware: Format Header Malformed / Bukan Bearer | FR-1.2 / TASK-2.1.2 | `authenticateUser.js` | Adversarial | Skenario A: `Basic dXNlcjpwYXNz`<br>Skenario B: `BearerTokenTanpaSpasi`<br>Skenario C: `TokenOnlyTanpaPrefix` | Seluruh skenario menghasilkan HTTP `401`, `{ success: false }`, `next()` diblokir. |
| **[CT-MW-03]** | Auth Middleware: Token JWT dengan Signature Palsu | FR-1.2 / TASK-2.1.2 | `authenticateUser.js` | Security Injection | Header: `Bearer eyJhbGci...invalid_signature` (Token hasil modifikasi payload liar) | `verifyAccessToken` melempar `JsonWebTokenError`, middleware menangkap error dan mengembalikan HTTP `401` `{ success: false, message: 'Token tidak valid atau telah kedaluwarsa.' }`. |
| **[CT-MW-04]** | Auth Middleware: Token JWT Telah Kedaluwarsa | FR-1.2 / TASK-2.1.2 | `authenticateUser.js` | Temporal Boundary | Token dengan masa berlaku telah habis (`exp < currentTime`) | `verifyAccessToken` melempar `TokenExpiredError`, response HTTP `401` `{ success: false }`, `next()` tidak dipanggil. |
| **[CT-MW-05]** | Auth Middleware: Token Company Member Sah | FR-1.2 / TASK-2.1.2 | `authenticateUser.js` | Positive / Context | Token sah bertipe: `{ id: "u-1", type: "company_member", role: "hr", companyId: "c-1", email: "hr@acme.com" }` | `req.user` terisi objek decoded token, `req.candidate` bernilai `undefined`, fungsi `next()` terpanggil tepat 1 kali. |
| **[CT-MW-06]** | Auth Middleware: Token Candidate Pelamar Sah | FR-2.2 / TASK-2.2.2 | `authenticateUser.js` | Positive / Context | Token sah bertipe: `{ id: "cand-99", type: "candidate", email: "budi@gmail.com" }` | `req.candidate` terisi `{ id: "cand-99" }`, `req.user` bernilai `undefined`, fungsi `next()` terpanggil tepat 1 kali. |
| **[CT-MW-07]** | RBAC Guard: Pemblokiran Wewenang Role HR & Fail-Closed | FR-1.3 / TASK-2.1.3 | `requireRole.js` | Fail-Closed RBAC | Skenario A: `requireRole('admin')`, `req.user = { role: 'hr' }`<br>Skenario B (Fail-Closed): `requireRole('admin')`, `req.user = undefined` | Skenario A: HTTP `403` `{ message: 'Forbidden: insufficient permissions' }`.<br>Skenario B: HTTP `401` `{ message: 'Unauthorized' }`, request dilarang tembus. |
| **[CT-MW-08]** | Tenant Scoping: Penolakan Request Tanpa Konteks Perusahaan | Dok 04 §4.2 / TASK-2.1.3 | `scopeToCompany.js` | Multi-Tenant Guard | Skenario A: `req.user = { id: "u-1", companyId: null }`<br>Skenario B: `req.user = { id: "u-1", companyId: "comp-123" }` | Skenario A: HTTP `401` `{ message: 'Unauthorized: missing company context' }`.<br>Skenario B: `next()` terpanggil sukses. |
| **[CT-MW-09]** | Request Validator: Interceptor Skema Zod Input | Dok 04 §4.3 / TASK-2.1.1 | `validateBody.js` | Error Formatting | Skenario A: Payload tidak lolos skema (email salah)<br>Skenario B: Payload valid sempurna | Skenario A: HTTP `422` `{ success: false, code: 'VALIDATION_ERROR', errors: [...] }`, `next()` tidak dipanggil.<br>Skenario B: `req.body` terisi data tersanitasi, `next()` dipanggil. |
| **[CT-MW-10]** | Global Error Handler: Standarisasi JSON Envelope | Dok 04 §4.4 / TASK-2.1.1 | `errorHandler.js` | Error Masking | Skenario A: `err = { statusCode: 404, message: 'Lowongan tidak ditemukan' }`<br>Skenario B: Unhandled `TypeError` pada mode `NODE_ENV=production` | Skenario A: HTTP `404` `{ success: false, code: 'RESOURCE_NOT_FOUND', message: 'Lowongan tidak ditemukan' }`.<br>Skenario B: HTTP `500` `{ success: false, code: 'INTERNAL_SERVER_ERROR' }`, stack trace disembunyikan. |
| **[CT-MW-11]** | Rate Limiter: Proteksi Rute Autentikasi (5 Req/Menit) | NFR Security / TASK-2.1.1 | `rateLimiters.js` (auth) | Rate Limiting BVA | IP `192.168.1.5` mengirim 6 request login berturut-turut dalam window 60 detik:<br>Request 1 s/d 5 (Nominal)<br>Request 6 (Ambang batas + 1) | Request 1 s/d 5: Lolos memanggil `next()`, header `RateLimit-Remaining` tereduksi.<br>Request 6: Ditolak seketika dengan HTTP `429` `{ success: false, code: 'RATE_LIMIT_EXCEEDED' }` dan memuat header `Retry-After: 60`. |
| **[CT-MW-12]** | Rate Limiter: Proteksi Rute Publik (100 Req/Menit) | NFR Security / TASK-4.1.1 | `rateLimiters.js` (public) | Rate Limiting DDoS | IP `10.0.0.1` mengirim 101 request GET lowongan dalam window 60 detik | Request 1 s/d 100: Lolos (HTTP 200).<br>Request 101: Ditolak dengan HTTP `429` `{ success: false, code: 'RATE_LIMIT_EXCEEDED' }`. |

---

#### 4.6.2 Klaster 2: Frontend State & Context Subsystems (Domain Client State Management)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Komponen Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[CT-STATE-01]** | AuthContext: Login Perusahaan Sukses | FR-1.2 / TASK-2.1.2 | `AuthContext.jsx` | State Mutation | Aksi: `companyLogin('hr@acme.com', 'secret')`<br>Mock API Response: `{ accessToken: 'tok-xyz', member: { id: 'm-1', role: 'admin' } }` | State `user` terisi objek member, state `token === 'tok-xyz'`, `localStorage.getItem('accessToken') === 'tok-xyz'`, `localStorage.getItem('user')` terisi JSON profil. |
| **[CT-STATE-02]** | AuthContext: Login Kandidat Sukses | FR-2.2 / TASK-2.2.2 | `AuthContext.jsx` | State Mutation | Aksi: `candidateLogin('budi@gmail.com', 'secret')`<br>Mock API Response: `{ accessToken: 'cand-tok', candidate: { id: 'c-1', role: 'candidate' } }` | State `user` terisi objek kandidat, state `token === 'cand-tok'`, data tersinkronisasi ke `localStorage`. |
| **[CT-STATE-03]** | AuthContext: Logout & Pembersihan Memori Total | FR-1.2 / TASK-2.1.2 | `AuthContext.jsx` | Memory Hygiene | Aksi: Memanggil fungsi `logout()` pada sesi pengguna aktif | State `user` berubah menjadi `null`, state `token` menjadi `null`, kunci `'accessToken'` dan `'user'` terhapus bersih dari `localStorage` (*Zero Memory Leak*). |
| **[CT-STATE-04]** | AuthContext: Peremajaan Profil Parsial | FR-3.1 / TASK-2.3.1 | `AuthContext.jsx` | State Mutation | Aksi: `updateUser({ name: 'PT Acme Teknologi Baru' })` | State `user.name` terbarui di memori seketika, dan nilai JSON baru tersimpan ke `localStorage` tanpa menghapus field lain. |
| **[CT-STATE-05]** | Kanban State: Pemindahan Kartu Optimistik | FR-8.1 / TASK-5.1.2 | `useKanbanStore` | Optimistic UI | Aksi: Memindahkan kartu kandidat ID `cand-5` dari kolom `Screening` ke `Interview` | Kartu seketika berpindah posisi di array memori; counter kolom `Screening` berkurang 1 dan counter `Interview` bertambah 1 sebelum respon jaringan tiba. |
| **[CT-STATE-06]** | Kanban State: Rollback Otomatis Saat Network Gagal | FR-8.1 / TASK-5.1.2 | `useKanbanStore` | Failure Rollback | Panggilan API mutasi status melempar error jaringan (Promise Rejection HTTP 500) | Kartu kandidat otomatis dikembalikan ke kolom `Screening`, angka counter dikembalikan ke posisi semula, dan state `error` diset untuk memicu toast kegagalan. |
| **[CT-STATE-07]** | Kanban State: Proteksi Imutabilitas Drag Kartu Terminal | FR-6.5 / FR-10.1 | `useKanbanStore` | FSM UI Guard | User mencoba menyeret kartu pelamar yang berstatus terminal:<br>Skenario A: Kartu di kolom `Withdrawn`<br>Skenario B: Kartu di kolom `Hired` | Aksi drag diblokir seketika (`isDraggable: false`); event mutasi posisi tidak di-dispatch ke store, posisi kartu terkunci permanen. |

---

#### 4.6.3 Klaster 3: Frontend Route Guards & Interceptors (Domain Client-Side Routing)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Komponen Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[CT-GUARD-01]** | Protected Company Route: Cegat Tamu Tanpa Sesi | FR-1.2 / TASK-2.1.3 | `ProtectedCompanyRoute` | Route Intercept | Kondisi Auth: `user = null`, pengunjung mencoba mengakses rute anak `/dashboard/jobs` | Komponen anak tidak di-render di DOM; sistem me-render elemen navigasi `<Navigate to="/company/login" />`. |
| **[CT-GUARD-02]** | Protected Candidate Route: Cegat Pengguna Non-Pelamar | FR-2.2 / TASK-2.2.2 | `ProtectedCandidateRoute` | Route Intercept | Skenario A: `user = null`<br>Skenario B: `user = { role: 'hr' }` mencoba mengakses `/portal/applications` | Komponen anak tidak di-render; peramban me-render `<Navigate to="/candidate/auth" />`. |
| **[CT-GUARD-03]** | Admin Only Route: Mencegat Role HR dari Menu Tim | FR-1.3 / TASK-2.1.3 | `AdminOnlyRoute` | RBAC Navigation | Kondisi Auth: `user = { role: 'hr', companyId: 'c-1' }`, mencoba membuka `/dashboard/team` | Komponen tim tidak di-render; sistem mengalihkan URL ke `/dashboard` disertai pemanggilan toast peringatan hak akses. |
| **[CT-GUARD-04]** | Public Only Route: Cegat Pengguna Aktif dari Halaman Login | FR-1.2 / TASK-2.1.2 | `PublicOnlyRoute` | UX Flow | Skenario A: `user = { role: 'admin' }` membuka `/company/login`<br>Skenario B: `user = { role: 'candidate' }` membuka `/candidate/auth` | Skenario A: Otomatis dialihkan ke `/dashboard`.<br>Skenario B: Otomatis dialihkan ke dasbor portal pelamar `/portal/applications`. |

---

#### 4.6.4 Klaster 4: UI Components, A11y & Micro-Interactions (Domain Visual & DOM Accessibility)

| ID Test | Nama Test Case | Ref FR / Backlog | Modul / Komponen Target | Dimensi Uji | Input Data / Skenario Ekstrem | Expected Output / Assertion |
|:---:|---|---|---|:---:|---|---|
| **[CT-UI-01]** | Badge Status: Kepatuhan Token Semantik Dokumen 05 | Dokumen 05 / TASK-5.1.1 | `Badge.jsx` | Visual Semantics | Props `status`: Skenario A (`applied`), B (`interview`), C (`hired`), D (`rejected`), E (`withdrawn`) | A: Memuat class `bg-blue-50 text-blue-700`<br>B: Memuat `bg-amber-50 text-amber-700`<br>C: Memuat `bg-emerald-50 text-emerald-700`<br>D: Memuat `bg-rose-50 text-rose-700`<br>E: Memuat `bg-slate-100 text-slate-600`. |
| **[CT-UI-02]** | SalaryDisplay: Penyamaran Gaji Rahasia vs Terbuka | FR-4.1 / TASK-3.1.2 | `SalaryDisplay.jsx` | Privacy Masking | Skenario A: `{ salary_visible: false, min: 8000000, max: 12000000 }`<br>Skenario B: `{ salary_visible: true, min: 8000000, max: 12000000 }`<br>Skenario C: `{ salary_visible: true, min: 8000000, max: 8000000 }` | Skenario A: Merender teks `"Gaji Dirahasiakan"` + ikon gembok (angka nominal tidak ada di DOM).<br>Skenario B: Merender teks `"Rp 8.000.000 - Rp 12.000.000"`.<br>Skenario C: Merender `"Rp 8.000.000"`. |
| **[CT-UI-03]** | Modal Dialog: Aksesibilitas Focus Trapping | Dokumen 03 §1.3 / WCAG AA | `Modal.jsx` | A11y / Keyboard | Kondisi: Modal terbuka memuat 2 tombol interaktif ("Batal", "Konfirmasi"). Fokus saat ini berada pada tombol "Konfirmasi" (elemen terakhir). User menekan tombol keyboard `Tab`. | Fokus berpindah kembali ke tombol "Batal" (elemen interaktif pertama). Fokus tidak pernah bocor ke elemen halaman latar belakang. |
| **[CT-UI-04]** | Modal Dialog: Penutupan via Tombol Escape Keyboard | Dokumen 03 §1.3 / WCAG AA | `Modal.jsx` | A11y / Keyboard | Modal di-mount dengan props `isOpen: true` dan `onClose = vi.fn()`. User menekan tombol keyboard `Escape`. | Handler `onClose` terpanggil tepat 1 kali. |
| **[CT-UI-05]** | Modal Dialog: Siklus Hidup Scroll Lock & Cleanup | Dokumen 03 §1.3 / UX | `Modal.jsx` | Lifecycle Cleanup | Skenario A: Modal di-mount dengan `isOpen: true`<br>Skenario B: Modal di-unmount dari DOM | Skenario A: `document.body.style.overflow` diset menjadi `'hidden'`.<br>Skenario B: `document.body.style.overflow` dikembalikan bersih menjadi `''` (tidak ada residu scroll macet). |
| **[CT-UI-06]** | TagPill: Interaktivitas Hapus & Navigasi Keyboard | FR-7.2 / TASK-4.3.2 | `TagPill.jsx` | Interactivity / A11y | Props: `{ label: "Node.js", removable: true, onRemove: vi.fn() }`<br>Skenario A: User mengklik tombol silang (×)<br>Skenario B: Fokus berada pada tombol (×), user menekan `Enter` | Skenario A & B: Handler `onRemove` terpanggil dengan parameter `"Node.js"`; tombol memiliki atribut aksesibilitas `aria-label="Hapus tag Node.js"`. |
| **[CT-UI-07]** | Button: State Loading & Anti-Double Click | Dokumen 05 / TASK-2.1.1 | `Button.jsx` | Micro-Interaction | Props: `{ isLoading: true, onClick: vi.fn() }`<br>User melakukan klik cepat 2 kali pada tombol | Tombol berstatus atribut `disabled === true`, elemen SVG spinner ter-render di DOM, dan fungsi `onClick` terpanggil **0 kali** (diblokir total). |
| **[CT-UI-08]** | EmptyState: Layar Data Kosong Reusable | Dokumen 03 §1.2 / UX | `EmptyState.jsx` | Visual / Action | Props: `{ title: "Belum Ada Lamaran", description: "Anda belum mengirimkan berkas", actionLabel: "Cari Lowongan", onAction: vi.fn() }` | Teks judul dan deskripsi tampil di DOM; tombol aksi ter-render dan saat diklik memicu callback `onAction` tepat 1 kali. |

---

### 4.7 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 2

Untuk menjamin kualitas dan stabilitas seluruh subsistem sebelum integrasi penuh:
1. **Target Branch Coverage Mutlak**:
   Eksekusi `npm run test:middleware -- --coverage` dan `npm run test:component -- --coverage` wajib mencatat:
   * **Stmts**: $\ge 98\%$
   * **Branch**: $\ge 95\%$
   * **Funcs**: $100\%$
   * **Lines**: $\ge 98\%$
2. **Zero External I/O & Anggaran Kecepatan**:
   Seluruh **31 skenario uji subsistem** di atas wajib selesai dieksekusi oleh Vitest dalam waktu **< 3.0 detik** karena berjalan 100% di dalam memori prosesor menggunakan mock objects dan jsdom tanpa menyentuh koneksi database maupun jaringan internet.
3. **Fail-Closed Security Guarantee**:
   Seluruh middleware keamanan backend Express terbukti menolak akses secara mutlak (*default-deny*) saat header otentikasi rusak, token kedaluwarsa, atau peran pengguna tidak memiliki wewenang.

---

# BAB 5: TINGKAT 3 — INTEGRATION TESTING ARCHITECTURE (REST API 15 MODUL & DB)

### 5.1 Ruang Lingkup & Fokus Pengujian
Tingkat 3 menguji integrasi nyata hulu-ke-hilir pada lapisan backend: perutean Express (`Router`), pipeline *Fail-Closed Middleware*, *Controller Logic*, transaksi multi-tabel pada basis data PostgreSQL via Supabase Pooler (Port 6543), serta penanganan efek samping asinkron (*In-Memory Mock Mailer* & *Signed URL Generator*). Fokus utama pengujian ini adalah memastikan:
1. **Integritas Kontrak REST API**: Seluruh respons mematuhi format amplop terpadu `{ success: true, data }` atau `{ success: false, error: { code, message } }` Dokumen 04 §4.4.
2. **Isolasi Mutlak Multi-Tenant**: Tenant Perusahaan A tidak dapat membaca, mengubah, atau menghapus entitas milik Perusahaan B (*Zero Cross-Tenant Leakage*).
3. **Integritas Transaksional ACID**: Kegagalan pada langkah kedua dalam transaksi multi-query wajib me-rollback seluruh operasi tanpa meninggalkan baris yatim (*zero orphan rows*).
4. **State Machine Invariants (FSM)**: Transisi siklus lamaran mematuhi aturan status terminal (`Hired`, `Rejected`, `Withdrawn` terkunci permanen).
5. **Ketahanan Konkurensi & Race Conditions**: Alur perebutan kuota lowongan dan proteksi submit lamaran ganda serentak terbukti tangguh (*deadlock-free* dan *atomic*).

```
[ HTTP Request Client (Supertest) ]
               │
               ▼
   [ Express Middleware Pipeline ] ──► (Auth JWT, Role RBAC, Company Scope, Rate Limiter, Body Validator)
               │
               ▼
    [ Controller & Service ] ──────► [ MockMailTransport ] (Decoupled Email Verification)
               │
               ▼
[ withTransaction() Wrapper ] ─────► [ PostgreSQL Supabase Pooler Port 6543 ] (Commit / Rollback ACID)
```

---

### 5.2 Metode Pengujian
* **Gray-Box Integration Testing**: Menembakkan request HTTP nyata menggunakan `Supertest`, menginspeksi status HTTP dan body JSON, serta memverifikasi perubahan mutasi baris data secara langsung (*direct database assertion*) via pool client PostgreSQL `pg`.
* **Atomic Transaction Rollback Testing**: Memverifikasi bahwa jika terjadi exception atau constraint violation di tengah operasi multi-tabel, seluruh mutasi dibatalkan secara bersih via `ROLLBACK`.
* **Multi-Connection Concurrency Testing**: Mengirim 2 atau lebih request HTTP simultan via `Promise.all()` pada milidetik yang sama guna mensimulasikan perebutan kuota (*race conditions*) dan pengajuan lamaran dobel (*double submit*).
* **Decoupled Side-Effect Assertion**: Menginspeksi antrean email in-memory (`MockMailTransport.getSentMails()`) dan tabel `email_send_log` tanpa memicu panggilan jaringan internet ke penyedia eksternal.

---

### 5.3 Tooling Stack & Konfigurasi
* **Test Runner & Assertion**: `Supertest` (v6.3+) + `Vitest` (v1.6+) + `pg` (PostgreSQL Client Pool).
* **Perintah Eksekusi CLI**:
  ```bash
  npm run test:integration
  ```
  *(Menjalankan script `vitest run backend/tests/integration --no-file-parallelism`)*.
* **Siklus Hidup Pembersihan Database & Pelepasan Koneksi (Data Hygiene & Lifecycle)**:
  ```javascript
  beforeEach(async () => {
    // Memastikan database bersih sebelum setiap test case (< 1.5s)
    await resetTestDatabase();
    MockMailTransport.reset();
  });

  afterAll(async () => {
    // Menjamin pelepasan socket koneksi pooler Supavisor Port 6543 tanpa connection leak
    await dbPool.end();
  });
  ```
* **Standarisasi Test Data Factory Pattern**:
  Guna mencegah kelelahan penulisan boilerplate SQL mentah (*boilerplate SQL fatigue*) serta menjaga konsistensi data uji, seluruh skenario pengujian integrasi wajib memanfaatkan helper pabrik data terstandar di `backend/tests/factories/`:
  - `createTestCompany({ ...overrides })`: Membuat entitas Perusahaan + Admin HR + 4 Anchor Stages otomatis.
  - `createTestJob(companyId, { ...overrides })`: Membuat lowongan pekerjaan siap uji dengan status draft atau published.
  - `createTestCandidateFixture()`: Membuat akun pelamar + profil kandidat terverifikasi.
  - `createTestApplicationFixture()`: Menghubungkan Company + Job + Candidate + Application dalam 1 baris helper fixtures.

---

### 5.4 Kebijakan Port 6543 Supabase Pooler (`--no-file-parallelism` & `withTransaction`)
1. **Restriksi Supabase Transaction Pooler (Port 6543)**:
   Pooler Supavisor pada PostgreSQL port 6543 membatasi konkurensi koneksi tingkat transaksi. Karena itu:
   - Vitest **wajib** dijalankan dengan opsi `--no-file-parallelism` agar suite pengujian integrasi dieksekusi secara serial per file uji, menghindari kehabisan koneksi pool (*pool exhaustion*).
   - Parameter connection string database uji wajib menyertakan flag `?pgbouncer=true`.
2. **Kewajiban Penggunaan Wrapper `withTransaction`**:
   Semua controller atau service yang menjalankan lebih dari 1 operasi penulisan (*insert/update/delete*) wajib menggunakan helper:
   ```javascript
   await withTransaction(async (client) => {
     // Seluruh query menggunakan client transaksional yang sama
     await client.query('INSERT INTO ...');
     await client.query('UPDATE ...');
   });
   ```

---

### 5.5 Target Modul & Tabel Keterlacakan File Sumber (*Source File Traceability Table*)

| Klaster Pengujian | Modul PRD (Dokumen 02) | File Rute Backend | File Controller Backend | File Test Integrasi |
|---|---|---|---|---|
| **Klaster 1: Identitas & Akses** | FR-1 (Auth HR) & FR-2 (Auth Kandidat) | `backend/src/routes/auth.company.routes.js`, `auth.candidate.routes.js` | `auth.company.controller.js`, `auth.candidate.controller.js` | `backend/tests/integration/auth.integration.test.js` |
| **Klaster 2: Profil & Gating Lowongan** | FR-3 (Profil Perusahaan) & FR-4 (Manajemen Lowongan) | `backend/src/routes/companies.routes.js`, `jobs.routes.js` | `companies.controller.js`, `jobs.controller.js` | `backend/tests/integration/jobs.integration.test.js` |
| **Klaster 3: Job Board & Lamaran Atomik** | FR-5 (Job Discovery) & FR-6 (Pengajuan Lamaran) | `backend/src/routes/public.jobs.routes.js`, `candidate.jobs.routes.js`, `candidate.application.routes.js`, `upload.routes.js` | `public.jobs.controller.js`, `candidate.jobs.controller.js`, `candidate.application.controller.js`, `upload.controller.js` | `backend/tests/integration/applications.integration.test.js` |
| **Klaster 4: Talent Pool & Kanban FSM** | FR-7 (Talent Pool) & FR-8 (Pipeline Kanban) | `backend/src/routes/pipeline.routes.js`, `hr.candidates.routes.js`, `hr.tags.routes.js` | `pipeline.controller.js`, `hr.candidates.controller.js`, `hr.tags.controller.js` | `backend/tests/integration/pipeline.integration.test.js` |
| **Klaster 5: Interview & Evaluasi** | FR-9 (Wawancara & Evaluasi Terstruktur) | `backend/src/routes/hr.interviews.routes.js` | `hr.interviews.controller.js`, `hr.scores.controller.js` | `backend/tests/integration/interviews.integration.test.js` |
| **Klaster 6: Kolaborasi Tim & Mailer** | FR-10 (Manajemen Tim) & FR-11 (Komunikasi & Catatan) | `backend/src/routes/companies.routes.js`, `hr.emailTemplates.routes.js` | `companies.controller.js`, `hr.notes.controller.js`, `hr.emailTemplates.controller.js` | `backend/tests/integration/collaboration.integration.test.js` |
| **Klaster 7: Portal, Analitik & Audit** | FR-12 (Portal Pelamar), FR-13 (Analitik), FR-14 (Audit Trail) | `backend/src/routes/candidate.profile.routes.js`, `analytics.routes.js`, `activityLogs.routes.js` | `candidate.profile.controller.js`, `analytics.controller.js`, `activityLogs.controller.js` | `backend/tests/integration/analytics_audit.integration.test.js` |
| **Klaster 8: Konkurensi & ACID** | Cross-Module / Non-Functional Concurrency | `backend/src/routes/jobs.routes.js`, `candidate.jobs.routes.js` | `jobs.controller.js`, `candidate.jobs.controller.js` | `backend/tests/integration/concurrency.integration.test.js` |

---

### 5.6 Prinsip & Ambang Kelulusan
1. **Zero Cross-Tenant Leakage**: 100% request lintas tenant wajib menghasilkan `403 Forbidden` atau `404 Not Found` tanpa mengungkap metadata apapun dari tenant lain.
2. **100% Rollback Consistency**: Pada skenario kegagalan transaksi multi-tabel, diverifikasi via *direct database check* bahwa 0 baris sisa/cacat (*zero orphan rows*) tersisa di PostgreSQL.
3. **Target Code Coverage Lapisan API**:
   - Controller Layer: $\ge 90\%$ Statements, $\ge 85\%$ Branch.
   - Service / DB Transaction Layer: $\ge 95\%$ Statements, $\ge 90\%$ Branch.
4. **Anggaran Durasi Eksekusi**: Seluruh 28 skenario pengujian integrasi wajib rampung dieksekusi dalam **$\le 45.0$ detik** (termasuk siklus reset `TRUNCATE CASCADE` per test).
5. **Ambang Kelulusan Mutlak**: **100% Pass (0 Defect)**.

---

### 5.7 Matriks Lengkap Integration Test Cases (Exhaustive 28-Scenario Suite)

#### 5.7.1 Klaster 1: Identitas, Akses Multi-Tenant & Rotasi Token

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-AUTH-01]`** | Registrasi Perusahaan + User HR Owner + Auto-Seed 4 Anchor Stages dalam 1 Transaksi | FR-1.1, FR-7.1 / TASK-1.1.2 | `POST /api/auth/company/register`<br>Payload: `{ company_name: "PT Inovasi Maju", email: "owner@inovasi.id", password: "Password123!" }` | Clean DB (Tabel `companies`, `users`, `pipeline_stages` kosong) | `201 Created`<br>`{ success: true, data: { company: { id, name }, user: { id, email, role: 'company_admin' }, tokens: { accessToken, refreshToken } } }` | Transaksi atomik berhasil: 1 baris di `companies`, 1 baris di `users` (`password_hash` berawalan `$2a$10`), tepat 4 baris di `pipeline_stages` (`Applied` [idx:0], `Hired` [idx:100], `Rejected` [idx:101], `Withdrawn` [idx:102] dengan `is_deletable = false`). |
| **`[IT-AUTH-02]`** | Registrasi Pelamar Baru + Pembuatan Profil Atomik | FR-2.1 / TASK-1.2.2 | `POST /api/auth/candidate/register`<br>Payload: `{ full_name: "Ahmad Dahlan", email: "ahmad@gmail.com", password: "SecureCandidate789!" }` | Clean DB | `201 Created`<br>`{ success: true, data: { user: { id, email, role: 'candidate' }, profile: { id, full_name }, tokens: { accessToken, refreshToken } } }` | 1 baris di `users` dengan `role = 'candidate'`, 1 baris di `candidate_profiles` terhubung via `user_id`. Password tersimpan dalam bentuk bcrypt hash. |
| **`[IT-AUTH-03]`** | Rotasi Refresh Token Tunggal & Invalidasi Token Lama | FR-1.2 / TASK-1.1.4 | `POST /api/auth/company/refresh-token`<br>Payload: `{ refreshToken: "<token_valid_A>" }` | 1 baris token aktif di tabel `refresh_tokens` | `200 OK`<br>`{ success: true, data: { accessToken: "<new_jwt>", refreshToken: "<token_baru_B>" } }` | Token lama `<token_valid_A>` otomatis berstatus `is_revoked = true` (atau terhapus). Request ulang kedua menggunakan `<token_valid_A>` ditolak `401 Unauthorized` (`ERR_TOKEN_REVOKED`). |
| **`[IT-AUTH-04]`** | Aktivasi Mandiri Undangan Tim HR via Token Undangan | FR-10.2 / TASK-6.1.2 | `POST /api/companies/team/activate`<br>Payload: `{ token: "<invite_token_hex>", password: "NewStrongPassword123!" }` | 1 baris di `users` berstatus `'invited'`, `invitation_token = "<invite_token_hex>"`, belum kedaluwarsa | `200 OK`<br>`{ success: true, message: "Account activated successfully" }` | Status user di tabel `users` berubah menjadi `'active'`, `invitation_token` di-set `NULL`, password hash tersimpan valid. Submit token yang sama untuk kedua kalinya ditolak `400 Bad Request` (`ERR_INVITATION_ALREADY_USED`). |

---

#### 5.7.2 Klaster 2: Profil Perusahaan, Gating Lowongan & Lifecycle Engine

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-JOB-01]`** | Gating Pembuatan Lowongan: Validasi 5 Syarat Profil Perusahaan Dokumen 02 (§4.3 / FR-3.2) | FR-3.2, FR-4.1 / TASK-2.1.3 | **Kasus A (Profil Belum Lengkap)**:<br>`POST /api/jobs`<br>Headers: Auth Token Company A<br>Payload: Data lowongan lengkap<br><br>**Kasus B (Profil Sudah Lengkap)**:<br>`POST /api/jobs`<br>Headers: Auth Token Company A | **Kasus A**: Profil Company A hanya memiliki `name`, kolom `logo_url`, `website`, `bio`, `industry` masih NULL.<br><br>**Kasus B**: Profil Company A telah melengkapi 5 syarat. | **Kasus A**: `422 Unprocessable Entity`<br>`{ success: false, error: { code: 'ERR_PROFILE_INCOMPLETE', missing_fields: ['logo_url', 'website', 'bio', 'industry'] } }`<br><br>**Kasus B**: `201 Created`<br>`{ success: true, data: { id, title, status: 'draft' } }` | **Kasus A**: 0 baris tersimpan di tabel `jobs`.<br><br>**Kasus B**: 1 baris tersimpan di `jobs` dengan `status = 'draft'`, `company_id = Company A.id`. |
| **`[IT-JOB-02]`** | Publikasi Lowongan & Proteksi Akses Multi-Tenant Lintas Perusahaan | FR-4.1, FR-4.2 / TASK-2.2.2 | **Kasus A (Owner Sendiri)**:<br>`PATCH /api/jobs/:jobIdA/publish`<br>Headers: Auth Company A<br><br>**Kasus B (Tenant Lain)**:<br>`PATCH /api/jobs/:jobIdA/publish`<br>Headers: Auth Company B | Lowongan `:jobIdA` milik Company A berstatus `'draft'` | **Kasus A**: `200 OK`<br>`{ success: true, data: { id: jobIdA, status: 'published', published_at: expect.any(String) } }`<br><br>**Kasus B**: `403 Forbidden` / `404 Not Found`<br>`{ success: false, error: { code: 'ERR_FORBIDDEN_RESOURCE' } }` | **Kasus A**: Di DB, lowongan `:jobIdA` berubah menjadi `status = 'published'` dan `published_at` terisi timestamp UTC.<br><br>**Kasus B**: Di DB, status lowongan milik Company A tidak berubah (tetap `'draft'`). Zero data tampering. |
| **`[IT-JOB-03]`** | Penutupan Lowongan & Auto-Close Lowongan Melewati Deadline | FR-4.3 / TASK-2.2.4 | `PATCH /api/jobs/:id/close`<br>Headers: Auth Company A & Trigger Worker `closeExpiredJobs()` | Lowongan berstatus `'published'`, satu lowongan memiliki `deadline = YESTERDAY` | `200 OK`<br>`{ success: true, data: { status: 'closed' } }` | Status lowongan di database berubah menjadi `'closed'`. Feed pencarian publik `GET /api/public/jobs` otomatis tidak lagi menampilkan lowongan yang telah ditutup. |

---

#### 5.7.3 Klaster 3: Job Discovery, Transaksi Lamaran Atomik & Deduplikasi

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-APP-01]`** | Job Discovery Publik: Pencarian Multi-Filter & Paginasi Bersih | FR-5.1, FR-5.2 / TASK-3.1.2 | `GET /api/public/jobs?search=Backend&work_system=remote&job_type=full_time&page=1&limit=10`<br>Headers: Tanpa Auth (Publik) | Di DB terdapat 4 lowongan: (1) Backend Remote Fulltime [Published], (2) Frontend Remote [Published], (3) Backend Onsite [Draft], (4) Backend Remote [Closed] | `200 OK`<br>`{ success: true, data: { jobs: [ {...} ], pagination: { total: 1, page: 1, limit: 10, total_pages: 1 } } }` | Tepat 1 lowongan yang memenuhi kriteria pencarian dan berstatus `'published'` yang dikembalikan. Lowongan `'draft'` dan `'closed'` 100% tersaring keluar. |
| **`[IT-APP-02]`** | Transaksi Pelamaran Atomik 5 Langkah + Snapshot Dokumen Resume (Didahului Integrasi Upload) | FR-6.1, FR-6.2 / TASK-4.1.2 | **Langkah 1 (Pre-Apply Upload)**:<br>`POST /api/upload/resume`<br>Headers: Auth Token Kandidat<br>Payload: Multi-part binary file PDF `resume-budi.pdf`<br><br>**Langkah 2 (Submit Application)**:<br>`POST /api/candidate/jobs/:id/apply`<br>Headers: Auth Token Kandidat<br>Payload: `{ cover_letter: "Saya ahli PostgreSQL", resume_url: "<returned_url_dari_Langkah_1>", answers: [{ question_id: 1, answer: "5 tahun" }] }` | Lowongan `:id` berstatus `'published'`. Kandidat Budi belum pernah melamar ke lowongan ini. | **Langkah 1**: `201 Created`<br>`{ success: true, data: { resume_url: expect.stringMatching(/https:\/\/.*\.pdf$/), expires_in: 900 } }`<br><br>**Langkah 2**: `201 Created`<br>`{ success: true, data: { application_id, status: 'applied', stage_name: 'Applied', created_at } }` | Transaksi multi-tabel atomik: 1 baris di `applications` (`stage_id = Applied.id`), 1 baris snapshot di `application_documents` (menyimpan copy permanen `resume_url`), counter `applications_count` pada tabel `jobs` bertambah tepat 1. |
| **`[IT-APP-03]`** | Proteksi Mutlak Pengajuan Lamaran Ganda (Deduplication Gate) | FR-6.2 / TASK-4.1.3 | `POST /api/candidate/jobs/:id/apply`<br>Headers: Auth Token Kandidat Budi<br>Payload: Payload lamaran lengkap | Kandidat Budi **sudah memiliki baris lamaran aktif** pada lowongan `:id` | `409 Conflict`<br>`{ success: false, error: { code: 'ERR_DUPLICATE_APPLICATION', message: 'You have already applied for this job' } }` | Query ke tabel `applications` membuktikan jumlah baris untuk pasangan `(job_id, candidate_id)` tetap tepat 1. Counter `applications_count` tidak bertambah. |
| **`[IT-APP-04]`** | Rollback Konsistensi 100% saat Kegagalan Operasi Dokumen Snapshot | FR-6.2, System Arch §4.3 | `POST /api/candidate/jobs/:id/apply`<br>Headers: Auth Token Kandidat<br>Payload: Payload dengan parameter memicu simulated database constraint error pada tabel `application_documents` | Lowongan `:id` aktif berstatus `'published'` | `500 Internal Server Error`<br>`{ success: false, error: { code: 'ERR_TRANSACTION_FAILED' } }` | Helper `withTransaction()` mengeksekusi `ROLLBACK`: Baris di tabel `applications` ikut terhapus bersih (0 baris yatim / *zero orphan row* tersisa di database). Counter lowongan tidak berubah. |

---

#### 5.7.4 Klaster 4: Talent Pool, Tagging & FSM Kanban Pipeline

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-KAN-01]`** | Manajemen Custom Stage Kanban & Proteksi 4 Anchor Stages | FR-7.1 / TASK-5.1.1 | **Kasus A (Tambah Custom Stage)**:<br>`POST /api/pipeline/stages`<br>Headers: Auth Company A<br>Payload: `{ name: "Live Coding Test", order_index: 2 }`<br><br>**Kasus B (Hapus Anchor Stage 'Hired')**:<br>`DELETE /api/pipeline/stages/:hiredStageId`<br>Headers: Auth Company A | Papan pipeline Company A berisi 4 anchor stages bawaan | **Kasus A**: `201 Created`<br>`{ success: true, data: { id, name: "Live Coding Test", is_deletable: true } }`<br><br>**Kasus B**: `400 Bad Request`<br>`{ success: false, error: { code: 'ERR_CANNOT_DELETE_ANCHOR_STAGE' } }` | **Kasus A**: 1 baris custom stage tercipta di `pipeline_stages`.<br><br>**Kasus B**: Stage `Hired` tetap utuh di database (`is_deletable = false` memproteksi baris). |
| **`[IT-KAN-02]`** | Mutasi FSM Kanban Berurutan & Pencatatan Log Riwayat Atomik | FR-8.1 / TASK-5.2.2 | `PATCH /api/hr/candidates/:id/stage`<br>Headers: Auth Recruiter Siti<br>Payload: `{ target_stage_id: "<interview_stage_id>" }` | Aplikasi `:id` berada di stage `Applied` | `200 OK`<br>`{ success: true, data: { application_id: ":id", current_stage_id: "<interview_stage_id>" } }` | Kolom `current_stage_id` di `applications` terbarui; 1 baris riwayat tercipta atomik di `application_history` dengan kolom `from_stage_id = Applied.id`, `to_stage_id = Interview.id`, `changed_by = Siti.id`; 1 baris tercatat atomik di `activity_logs` (`action = 'CANDIDATE_STAGE_CHANGED'`). |
| **`[IT-KAN-03]`** | Proteksi Imutabilitas Status Terminal Kanban (`Withdrawn` / `Rejected`) | FR-8.2 / TASK-5.2.3 | `PATCH /api/hr/candidates/:id/stage`<br>Headers: Auth Recruiter<br>Payload: `{ target_stage_id: "<interview_stage_id>" }` | Aplikasi `:id` berada di stage terminal `Withdrawn` (atau `Rejected`) | `422 Unprocessable Entity`<br>`{ success: false, error: { code: 'ERR_STATE_IS_TERMINAL', message: 'Applications in terminal state cannot be moved' } }` | Database menolak mutasi: Nilai `current_stage_id` pada tabel `applications` tidak bergeser. Tidak ada baris riwayat baru di `application_history`. |
| **`[IT-KAN-04]`** | Proteksi Penghapusan Custom Stage yang Sedang Dihuni Kandidat | FR-7.2 / TASK-5.1.3 | `DELETE /api/pipeline/stages/:customStageId`<br>Headers: Auth Company Admin | Stage `:customStageId` dihuni oleh 2 kandidat aktif | `409 Conflict`<br>`{ success: false, error: { code: 'ERR_STAGE_NOT_EMPTY', message: 'Cannot delete stage containing active candidates' } }` | Stage `:customStageId` tetap bertahan di tabel `pipeline_stages`. Tidak terjadi cascade delete yang merusak integritas pelamar. |
| **`[IT-KAN-05]`** | Talent Pool Company-Scoped: Penambahan Tag Internal & Filter Bakat | FR-7.3 / TASK-5.3.1 | **Langkah 1**: `POST /api/hr/tags`<br>Headers: Auth Company A<br>Payload: `{ candidate_id: 10, tag_name: "Top Talent Golang" }`<br><br>**Langkah 2**: `GET /api/hr/candidates?tag=Top+Talent+Golang`<br>Headers: Auth Company B (Tenant Lain) | Kandidat 10 terdaftar di database | **Langkah 1**: `201 Created`<br>`{ success: true, data: { tag_id, tag_name: "Top Talent Golang" } }`<br><br>**Langkah 2 (Company B)**: `200 OK`<br>`{ success: true, data: { candidates: [] } }` | Tag terikat dengan `company_id = Company A.id`. Company B yang menjalankan filter pencarian yang sama mendapatkan array kosong (0 kebocoran tag lintas tenant). |

---

#### 5.7.5 Klaster 5: Penjadwalan Wawancara, Deteksi Tabrakan & Scoring Konsensus

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-INT-01]`** | Penjadwalan Wawancara Valid & Integrasi Notifikasi Email Terpisah | FR-9.1 / TASK-7.1.2 | `POST /api/hr/interviews`<br>Headers: Auth Recruiter<br>Payload: `{ application_id: 5, interviewer_id: 2, start_time: "2026-11-15T09:00:00Z", end_time: "2026-11-15T10:00:00Z", location: "Google Meet", meeting_link: "https://meet.google.com/abc-defg-hij" }` | Aplikasi ID 5 berada di stage `Interview`. Kalender Interviewer ID 2 kosong pada tanggal tersebut. | `201 Created`<br>`{ success: true, data: { interview_id, start_time, meeting_link } }` | 1 baris tercipta di `interviews`. Side-effect assertion: `MockMailTransport.getSentMails()` menangkap 2 email (1 email undangan rincian wawancara ke kandidat, 1 email kalender pengingat ke interviewer). |
| **`[IT-INT-02]`** | Algoritma Deteksi Tabrakan Jadwal Wawancara (*Collision Detection*) | FR-9.2 / TASK-7.1.3 | `POST /api/hr/interviews`<br>Headers: Auth Recruiter<br>Payload: `{ application_id: 6, interviewer_id: 2, start_time: "2026-11-15T09:30:00Z", end_time: "2026-11-15T10:30:00Z" }` | Interviewer ID 2 **sudah memiliki sesi interview aktif** pada rentang 09:00 - 10:00 UTC (bentrok 30 menit). | `409 Conflict`<br>`{ success: false, error: { code: 'ERR_INTERVIEW_COLLISION', message: 'Interviewer already has a scheduled interview during this timeframe' } }` | Query DB: Jumlah baris di tabel `interviews` tidak bertambah. Tidak ada email undangan terkirim ke pihak manapun. |
| **`[IT-INT-03]`** | Input Evaluasi Skor Bintang Multi-Reviewer & Agregasi Skor Konsensus | FR-9.3 / TASK-7.2.2 | **Reviewer 1**: `POST /api/hr/candidates/5/scores`<br>Payload: `{ score: 4, notes: "Kompetensi teknis sangat baik" }`<br><br>**Reviewer 2**: `POST /api/hr/candidates/5/scores`<br>Payload: `{ score: 5, notes: "Problem solving istimewa" }`<br><br>**Query Detail**: `GET /api/hr/candidates/5` | Aplikasi ID 5 aktif, belum memiliki evaluasi skor | **Reviewer 1**: `201 Created`<br><br>**Reviewer 2**: `201 Created`<br><br>**Query Detail**: `200 OK`<br>`{ success: true, data: { id: 5, consensus_score: 4.5, total_evaluations: 2 } }` | 2 baris tersimpan di tabel `candidate_scores`. Endpoint detail mengembalikan rata-rata aritmatika presisi pembulatan 1 desimal (`(4 + 5) / 2 = 4.5`). |

---

#### 5.7.6 Klaster 6: Kolaborasi Tim, Author-Only Edit & Decoupled Mailer

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-COL-01]`** | Undangan Anggota Tim HR & Penegakan RBAC (*Admin vs Recruiter*) | FR-10.1 / TASK-6.1.1 | **Kasus A (Company Admin)**:<br>`POST /api/companies/team/invite`<br>Headers: Auth Admin<br>Payload: `{ email: "recruiter.baru@inovasi.id", role: "recruiter" }`<br><br>**Kasus B (Recruiter Biasa)**:<br>`POST /api/companies/team/invite`<br>Headers: Auth Recruiter | Perusahaan Company A aktif | **Kasus A**: `201 Created`<br>`{ success: true, data: { user_id, email, status: 'invited' } }`<br><br>**Kasus B**: `403 Forbidden`<br>`{ success: false, error: { code: 'ERR_INSUFFICIENT_PERMISSIONS' } }` | **Kasus A**: 1 baris di `users` dengan `status = 'invited'`, token aktivasi tercipta, 1 email undangan tertangkap di `MockMailTransport`.<br><br>**Kasus B**: 0 baris tercipta di database. |
| **`[IT-COL-02]`** | Catatan Internal Kandidat & Proteksi *Author-Only Edit/Delete* serta Hak Moderasi Admin | FR-11.1 / TASK-8.1.2 | **Kasus A (Author Recruiter Siti Edit Sendiri)**:<br>`PATCH /api/hr/candidates/5/notes/:noteId`<br>Headers: Auth Recruiter Siti<br>Payload: `{ note_text: "Revisi catatan oleh Siti" }`<br><br>**Kasus B (Non-Author Recruiter Budi Coba Edit)**:<br>`PATCH /api/hr/candidates/5/notes/:noteId`<br>Headers: Auth Recruiter Budi<br><br>**Kasus C (Company Admin Moderation Override)**:<br>`DELETE /api/hr/candidates/5/notes/:noteId`<br>Headers: Auth Company Admin | Catatan `:noteId` dibuat oleh Recruiter Siti (`created_by = Siti.id`) | **Kasus A**: `200 OK`<br>`{ success: true, data: { id: noteId, note_text: "Revisi catatan oleh Siti" } }`<br><br>**Kasus B**: `403 Forbidden`<br>`{ success: false, error: { code: 'ERR_NOTE_AUTHOR_ONLY' } }`<br><br>**Kasus C**: `200 OK`<br>`{ success: true, message: "Note removed by company admin" }` | **Kasus A**: Teks catatan terbarui di database.<br><br>**Kasus B**: Teks catatan asli milik Siti di tabel `candidate_notes` tidak berubah sedikit pun.<br><br>**Kasus C**: Catatan terhapus sah dari database (Admin berwenang memoderasi/menghapus catatan staf sesuai PRD FR-11.1). |
| **`[IT-COL-03]`** | Antrean Pengiriman Email Asinkron (*Decoupled Mail Queue*) & Logging | FR-11.2 / TASK-8.2.1 | Trigger penolakan lamaran massal:<br>`POST /api/hr/candidates/bulk-reject`<br>Headers: Auth Recruiter<br>Payload: `{ application_ids: [10, 11, 12], rejection_reason: "Kualifikasi belum sesuai" }` | 3 kandidat berstatus aktif di pipeline | `200 OK`<br>`{ success: true, message: "3 applications rejected. Notifications queued." }` *(Respons instan < 50ms tanpa blocking I/O jaringan luar)* | Status 3 kandidat di DB berubah menjadi `Rejected`. 3 baris tercatat atomik di `email_send_log` dengan `status = 'pending'`. Eksekusi worker mock memproses antrean dan mengupdate status log menjadi `'sent'`. |

---

#### 5.7.7 Klaster 7: Portal Pelamar, Analitik Time-to-Hire & Audit Trail Imutabel

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-POR-01]`** | Portal Pelamar: Penarikan Lamaran Mandiri (*Self-Withdraw*) | FR-12.1 / TASK-9.1.2 | `POST /api/candidate/applications/:id/withdraw`<br>Headers: Auth Token Kandidat Pemilik Lamaran<br>Payload: `{ reason: "Menerima tawaran di perusahaan lain" }` | Aplikasi `:id` berstatus `'applied'` dan berada di stage custom `Interview` | `200 OK`<br>`{ success: true, message: "Application withdrawn successfully" }` | Status di tabel `applications` berubah menjadi `'withdrawn'`, kolom `current_stage_id` otomatis dialihkan ke stage anchor `Withdrawn.id`. Di papan Kanban HR, kartu pelamar terkunci permanen di kolom Withdrawn. |
| **`[IT-POR-02]`** | Agregasi Metrik Analitik: Formula Time-to-Hire & Funnel Drop-off | FR-13.1, FR-13.2 / TASK-10.1.2 | `GET /api/analytics/overview`<br>Headers: Auth Company A | Di DB terdapat 2 kandidat `Hired`: (1) Durasi 10 hari, (2) Durasi 20 hari. 10 total pelamar (`Applied`), 5 `Interview`, 2 `Hired`. | `200 OK`<br>`{ success: true, data: { time_to_hire_avg_days: 15.0, funnel: { applied: 10, interview: 5, hired: 2, conversion_rate: 20.0 } } }` | Respons memvalidasi perhitungan matematika presisi: rata-rata Time-to-Hire adalah $(10 + 20) / 2 = 15.0$ hari, dan rasio konversi funnel $2/10 \times 100\% = 20.0\%$. |
| **`[IT-POR-03]`** | Imutabilitas Log Aktivitas Sistem (*Tamper-Proof Audit Trail*) | FR-14.1 / TASK-10.2.2 | `DELETE /api/activity-logs/1`<br>Headers: Auth Company Admin | Baris log aktivitas ID 1 tersimpan di tabel `activity_logs` | `405 Method Not Allowed` / `403 Forbidden` | Proteksi mutlak lapisan API dan database: Tidak ada mekanisme penghapusan atau pengubahan audit log. Baris di `activity_logs` berkarakter *append-only*. |

---

#### 5.7.8 Klaster 8: Konkurensi Mutlak, Transaksi ACID & Race Conditions

| ID Test | Nama & Skenario Kasus Uji | Ref PRD / Task | HTTP Request (Method, Route, Headers, Payload) | Kondisi Database Awal | Ekspektasi Response & Status Code | Ekspektasi Verifikasi State DB & Side-Effect |
|---|---|---|---|---|---|---|
| **`[IT-RACE-01]`** | Race Condition: Perebutan Kuota Terakhir Lowongan Kerja (Sisa Kuota = 1) dengan Primitif Penguncian Database Wajib | FR-8.3, Non-Functional / Concurrency | Eksekusi serentak via `Promise.all()`:<br>`Request 1`: `PATCH /api/hr/candidates/101/stage` (Set Hired)<br>`Request 2`: `PATCH /api/hr/candidates/102/stage` (Set Hired)<br>Headers: Auth Recruiter | Lowongan pekerjaan memiliki `quota = 5`, posisi `filled_quota = 4` (tersisa tepat 1 kursi lowongan) | Tepat 1 Request mengembalikan `200 OK`<br>`{ success: true, data: { status: 'hired' } }`<br><br>Request lainnya mengembalikan `409 Conflict`<br>`{ success: false, error: { code: 'ERR_QUOTA_EXCEEDED', message: 'Job quota has already been fulfilled' } }` | **Primitif Penguncian Wajib**: Backend wajib menggunakan `SELECT filled_quota, quota FROM jobs WHERE id = $1 FOR UPDATE;` di dalam `withTransaction()` atau *Atomic Conditional Update* `UPDATE jobs SET filled_quota = filled_quota + 1 WHERE id = $1 AND filled_quota < quota RETURNING *;`. Kolom `filled_quota` pada tabel `jobs` bernilai tepat 5 (tidak pernah overbooked menjadi 6). Status lowongan otomatis berubah menjadi `'closed'`. Tepat 1 kandidat menjadi Hired, dan 1 baris tercatat atomik di `activity_logs` (`action = 'JOB_AUTO_CLOSED'`). |
| **`[IT-RACE-02]`** | Race Condition: Pengajuan Lamaran Ganda Serentak (*Simultaneous Double Submit*) | FR-6.2, Non-Functional / Concurrency | Eksekusi serentak via `Promise.all()`:<br>`Request 1`: `POST /api/candidate/jobs/:id/apply`<br>`Request 2`: `POST /api/candidate/jobs/:id/apply`<br>Headers: Auth Token Kandidat Budi (Milidetik identik) | Kandidat Budi belum melamar ke lowongan `:id` | Tepat 1 Request mengembalikan `201 Created`<br>`{ success: true, data: { application_id } }`<br><br>Request lainnya mengembalikan `409 Conflict`<br>`{ success: false, error: { code: 'ERR_DUPLICATE_APPLICATION' } }` | Indeks unik database `(job_id, candidate_id)` dan isolasi transaksi pooler menjamin hanya tepat 1 baris lamaran yang tercipta di tabel `applications`. Counter pelamar bertambah tepat 1. |
| **`[IT-RACE-03]`** | Keamanan Batas Multi-Tenant Mutlak: Akses Detail Lamaran Lintas Perusahaan | Dokumen 04 §2.1, Dokumen 06 Epic 1 | `GET /api/hr/candidates/:appIdA`<br>Headers: Auth Token Perusahaan B | Lamaran `:appIdA` terdaftar secara sah di bawah kepemilikan Perusahaan A | `404 Not Found` / `403 Forbidden`<br>`{ success: false, error: { code: 'ERR_FORBIDDEN_RESOURCE', message: 'Application not found or unauthorized' } }` | Verifikasi Zero Data Leakage: Tidak ada secuil pun informasi pribadi, data resume, atau riwayat wawancara kandidat Perusahaan A yang lolos ke respons Perusahaan B. |

---

### 5.8 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 3

Guna memastikan suite pengujian integrasi Tingkat 3 memenuhi standar *Zero-Tolerance Defect*, kriteria verifikasi berikut wajib divalidasi sebelum melangkah ke Tingkat 4:

| Kriteria Quality Gate Tingkat 3 | Standar Ambang Batas | Status Kepatuhan Desain | Mekanisme Pembuktian Teknis |
|---|:---:|:---:|---|
| **Cakupan Sensus 15 Modul PRD** | 100% Terpetakan | **Terpenuhi** | 28 Test Cases mencakup FR-1.1 hingga FR-15.3 tanpa celah di 8 klaster integrasi |
| **Isolasi Multi-Tenant Mutlak** | 0 Kebocoran Data (Zero Leak) | **Terpenuhi** | Divalidasi eksplisit pada `[IT-JOB-02]`, `[IT-KAN-05]`, `[IT-COL-01]`, dan `[IT-RACE-03]` |
| **Konsistensi ACID Rollback** | 100% Rollback (0 Orphan Rows) | **Terpenuhi** | Divalidasi eksplisit pada `[IT-APP-04]` dengan memverifikasi zero orphan row di PostgreSQL |
| **Ketahanan Race Conditions** | 100% Lulus (0 Overbooked) | **Terpenuhi** | Divalidasi eksplisit via `Promise.all()` pada `[IT-RACE-01]` (kuota) dan `[IT-RACE-02]` (double apply) |
| **Primitif Penguncian Database** | Row-Lock Terkunci | **Terpenuhi** | Mengunci klausul `SELECT ... FOR UPDATE` atau *Atomic Conditional Update* pada `[IT-RACE-01]` |
| **Pelepasan Soket Pooler Supabase** | 100% Graceful Shutdown | **Terpenuhi** | `afterAll(dbPool.end)` mencegah koneksi menggantung pada Supavisor Port 6543 |
| **Hak Moderasi Admin pada Kolaborasi** | 100% Hak Istimewa Admin | **Terpenuhi** | Divalidasi eksplisit pada `[IT-COL-02]` Kasus C (Admin override delete) |
| **Kompatibilitas Supabase Pooler 6543** | Serial File Execution | **Terpenuhi** | Mengunci parameter `--no-file-parallelism` dan wrapper transaksional `withTransaction()` |
| **Anggaran Waktu Eksekusi Suite** | $< 45.0\text{ detik}$ | **Terpenuhi** | Siklus reset cepat `TRUNCATE CASCADE` $\le 1.5\text{ detik}$ per test case |
| **Kepatuhan Zero-Paywall** | 100% Bebas Paywall | **Terpenuhi** | Tidak ada restriksi paket berbayar pada seluruh endpoint perekrutan dan kolaborasi tim |

---

# BAB 6: TINGKAT 4 — SYSTEM & END-TO-END (E2E) TESTING ARCHITECTURE (USER FLOWS & UI)

### 6.1 Ruang Lingkup & Fokus Pengujian
Tingkat 4 menguji sistem RecruitFlow secara komprehensif hulu-ke-hilir (*end-to-end*) dari sudut pandang interaksi peramban web pengguna riil (*Frontend React UI* $\leftrightarrow$ *Network Fetch* $\leftrightarrow$ *Backend Express Router & Middleware* $\leftrightarrow$ *PostgreSQL Supabase Database*). Pengujian di level ini tidak memanipulasi variabel internal kode, melainkan memvalidasi:
1. **Integritas Alur Pengguna Penuh (*Full User Journey*)**: Memastikan alur bisnis multi-langkah dan multi-peran (HR Recruiter, Pelamar, dan Unregistered Guest) berjalan mulus tanpa hambatan.
2. **Sinkronisasi State Lintas Sesi (*Cross-Session State Sync*)**: Perubahan yang dilakukan oleh HR di Dasbor Recruiter (contoh: pemindahan kartu Kanban) wajib langsung terlihat dan berdampak pada Stepper Status di Dasbor Pelamar secara *real-time*.
3. **Kepatuhan Tampilan UI/UX 8-Dimensi (29 Layar)**: Memvalidasi konsistensi estetika desain, palet warna, tipografi, interaksi mikro, dan adaptasi tata letak responsif (*Desktop* $\ge 1024\text{px}$ vs *Mobile* $375\text{px}$) pada seluruh 29 layar platform.
4. **Resiliensi Pengalaman Pengguna (*Zero Broken Journeys*)**: Tidak ada tautan rusak (*404*), formulir macet (*unhandled validation error*), tombol non-responsif, atau animasi yang patah.

---

### 6.2 Metode Pengujian
* **Black-Box Scenario-Driven Testing**: Seluruh pengujian digerakkan oleh aksi DOM nyata: navigasi URL, pengetikan keyboard, pengklikan tombol, dan *drag-and-drop* mouse.
* **Cross-Role Dual-Browser Orchestration**: Menjalankan dua konteks peramban simultan (Peramban A = Sesi HR Recruiter, Peramban B = Sesi Pelamar) guna membuktikan sinkronisasi data antar-peran secara langsung.
* **Standarisasi Device Emulation & Breakpoint Metrics**: Menguji setiap antarmuka secara biner pada 2 breakpoint baku dengan emulasi peramban resmi:
  - **Desktop Viewport**: `await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });`
  - **Mobile Viewport**: `await page.emulate(puppeteer.KnownDevices['iPhone SE']);` (Width: 375, Height: 667, Touch: true, Mobile: true).
* **Automated Accessibility Testing**: Menginspeksi atribut ARIA, navigasi tombol Tab, perangkap fokus modal (*focus trap*), luas sentuh interaktif mobile ($\ge 48\times 48\text{px}$ WCAG 2.1 AA), dan kontras warna teks.

---

### 6.3 Tooling Stack & Pembagian Peran Dwi-Jalur (`Puppeteer` vs `Browser Subagent`)

Untuk memaksimalkan efisiensi rekayasa dan mengeliminasi kerapuhan (*flakiness*), pengujian Tingkat 4 dibagi secara tegas ke dalam dua jalur eksekusi komplementer:

```
[ PENGUJIAN TINGKAT 4: SYSTEM & E2E ]
                 │
                 ├───────────────────────────────────────┐
                 ▼                                       ▼
  [ JALUR 1: PUPPETEER HEADLESS CLI ]      [ JALUR 2: BROWSER SUBAGENT AI ]
  • Eksekusi: Terminal `npm run test:e2e`   • Eksekusi: Interactive AntiGravity Agent
  • Target: 5 Golden User Flows             • Target: 29 Layar UI/UX 8-Dimensi
  • Fokus: Validasi Status, DOM, Data       • Fokus: Estetika, Animasi, Visual Mobile
  • Output: JUnit XML / TAP / Pass-Fail     • Output: Screenshot & Visual Audit Log
```

1. **Jalur 1: Automated Headless CLI Testing (`Puppeteer`)**:
   - Dijalankan secara terotomasi via terminal melalui perintah:
     ```bash
     npm run test:e2e
     ```
   - **Target Lingkungan Eksekusi (Production Preview vs Dev Server)**:
     Untuk mengeliminasi latensi kompilasi *on-demand* (*cold start on first route visit*) khas Vite Dev Server yang rentan memicu *timeout*, suite pengujian E2E pada CI/CD dijalankan di atas **Production Preview**:
     ```bash
     npm run build && npm run preview -- --port 5173
     ```
     Pada lingkungan pengembangan lokal, skrip otomasi diorkestrasikan dengan utilitas `wait-on`:
     ```bash
     npx wait-on http://localhost:5173 http://localhost:5000/api/health && npm run test:e2e
     ```
   - **Protokol Auto-Artifact on Failure**:
     Setiap skenario uji yang mengalami kegagalan (*assertion error / predicate timeout*) wajib secara otomatis menangkap tangkapan layar peramban (*screenshot PNG*) dan dump HTML DOM ke direktori `artifacts/e2e-failures/{flowId}-{timestamp}.png` sebagai bukti objektif penelusuran akar masalah (*root-cause debugging*).
   - **Pembersihan Data Deterministik Antar-Alur (*Clean Slate Isolation*)**:
     Setiap flow E2E dijalankan pada entitas terisolasi menggunakan generator pengidentifikasi unik berbasis stempel waktu (misal: `company-${Date.now()}@test.id`) atau pemanggilan fixture `seed-e2e.js --flow=X` pada hook `beforeAll` guna menjamin zero-cross-contamination.
2. **Jalur 2: Interactive Visual & Responsive Audit (`Browser Subagent`)**:
   - Dijalankan oleh AI IDE Agent (AntiGravity) menggunakan engine browser visual bawaan.
   - Bertanggung jawab memeriksa keselarasan Design System Dokumen 05: glassmorphism kartu, kehalusan transisi tab, responsivitas swipe kolom Kanban pada layar sentuh, dan hierarki tipografi Google Fonts Outfit/Inter pada **29 Layar UI/UX**.

---

### 6.4 Protokol Anti-Flakiness & Standar Selektor Tahan Banting (`data-testid`)

Kegagalan terbesar dalam E2E testing adalah *flakiness* (tes gagal akibat delay jaringan minor, animasi CSS, atau tabrakan sesi). Tingkat 4 RecruitFlow menerapkan **8 Aturan Besi Anti-Flakiness & Standar Automasi**:

1. **Aturan Selektor Berbasis `data-testid`**:
   Dilarang keras menggunakan selector kelas CSS yang rapuh (misal: `.flex.items-center.text-blue-500`) atau XPath hierarkis (`div > div:nth-child(2) > button`). Semua elemen interaktif wajib memiliki ID pengujian semantik:
   - `data-testid="input-company-name"`
   - `data-testid="btn-submit-job"`
   - `data-testid="kanban-card-{appId}"`
   - `data-testid="status-stepper-item-{stageName}"`
2. **Protokol Penantian Deterministik (Predicate-Based Waiting)**:
   Dilarang keras menyuntikkan jeda waktu statis `sleep(3000)` atau `waitForTimeout()`. Penantian wajib berbasis predikat ketersediaan elemen terlihat (*visible*) atau respons jaringan yang sukses:
   ```javascript
   // Standar Kanonikal Penantian Elemen & Network
   await page.waitForSelector('[data-testid="ticket-application-id"]', { visible: true, timeout: 5000 });
   await Promise.all([
     page.waitForResponse(res => res.url().includes('/api/jobs') && res.status() === 201),
     page.click('[data-testid="btn-publish-job"]')
   ]);
   ```
3. **Pemberlakuan Zero Console Error Listener**:
   Selama eksekusi berlangsung, Puppeteer memasang pemantau konsol peramban secara ketat:
   ```javascript
   page.on('console', (msg) => {
     if (msg.type() === 'error') {
       throw new Error(`[BROWSER_CONSOLE_ERROR]: ${msg.text()}`);
     }
   });
   ```
   *Adanya error JavaScript unhandled, React Hydration Mismatch, atau 404 resource request otomatis menggugurkan status tes menjadi FAILED.*
4. **Isolasi Sesi Multi-Peran via Incognito Browser Contexts**:
   Pada alur yang melibatkan multi-peran (HR Recruiter dan Pelamar Kerja), Puppeteer dilarang keras mencampur sesi dalam satu tab/halaman bersama guna mencegah kontaminasi token otentikasi di `localStorage`. Pengujian wajib menggunakan konteks peramban terisolasi:
   ```javascript
   const hrContext = await browser.createBrowserContext();
   const candidateContext = await browser.createBrowserContext();
   const hrPage = await hrContext.newPage();
   const candidatePage = await candidateContext.newPage();
   ```
5. **Dual-Mode Kanban Drag & Drop & Tombol Segarkan Non-Destruktif**:
   Papan Kanban `[H-08]` mengimplementasikan dua jalur mutasi stage kandidat dan tombol sinkronisasi eksplisit:
   - *Mode Visual (Subagent / Human):* Interaksi geser mouse (*mouse drag-and-drop*) antar-kolom.
   - *Mode Aksesibilitas Deterministik (Puppeteer CLI):* Tombol menu aksi kartu atau navigasi keyboard terstandar WCAG (`[data-testid="btn-move-card-{appId}"]` $\rightarrow$ pilih opsi stage target $\rightarrow$ konfirmasi) guna menjamin keandalan 100% bebas dari kegagalan event koordinat kursor.
   - *Tombol Segarkan Data Non-Destruktif:* Sinkronisasi pembaruan status pelamar dilakukan via klik `[data-testid="btn-refresh-pipeline"]` tanpa melakukan `page.reload()` penuh yang menghancurkan state lokal UI.
6. **Konfigurasi Chrome DevTools Protocol (CDP) untuk Unduhan File**:
   Pada skenario pengujian unduhan file CSV `[E2E-FLOW-05]`, Puppeteer wajib mengaktifkan izin pengunduhan headless melalui CDP session:
   ```javascript
   const cdp = await page.target().createCDPSession();
   await cdp.send('Page.setDownloadBehavior', {
     behavior: 'allow',
     downloadPath: path.resolve('./scratch/downloads')
   });
   ```
7. **Primitif Pengunggahan Berkas Headless (`uploadFile` pada Hidden Input)**:
   Pada antarmuka modern yang membungkus dropzone dalam elemen `<div>` visual, Puppeteer dilarang mengklik container dropzone. Skrip wajib menargetkan langsung elemen input berkas tersembunyi (*hidden input*):
   ```javascript
   const fileInput = await page.$('input[data-testid="upload-resume-input"]');
   await fileInput.uploadFile(path.resolve('./backend/tests/fixtures/sample-resume.pdf'));
   ```
8. **Verifikasi Surat Elektronik via Test API Inbox Hook (`/api/test/mail-inbox`)**:
   Untuk membuktikan pengiriman email (aktivasi akun, undangan wawancara, dan surat penolakan) tanpa mengandalkan visual toast semata, backend di lingkungan `NODE_ENV=test` mengekspos endpoint inspeksi memori `MockMailTransport`:
   ```javascript
   const mailData = await page.evaluate(async (email) => {
     const res = await fetch(`/api/test/mail-inbox?to=${encodeURIComponent(email)}`);
     return await res.json();
   }, candidateEmail);
   expect(mailData.subject).toContain('Undangan Wawancara');
   ```

---

### 6.5 Matriks Sensus Tier A: 5 Golden User Flows (Exhaustive Step-by-Step E2E Automation Suites)

#### 6.5.1 `[E2E-FLOW-01]` The Golden Hiring Cycle (Alur Perekrutan Penuh 12 Langkah)
* **Tujuan Bisnis**: Membuktikan siklus hidup rekrutmen lengkap dari pendaftaran perusahaan baru hingga kandidat diterima bekerja (*Hired*) dan kuota lowongan tertutup otomatis.
* **Peran Terlibat**: (1) HR Owner Perusahaan (`hrContext`), (2) Pelamar Umum / Kandidat (`candidateContext`), (3) Recruiter Penilai.
* **Urutan Layar**: `[P-07]` $\rightarrow$ `[H-01]` $\rightarrow$ `[H-04]` $\rightarrow$ `[H-07]` $\rightarrow$ `[P-01]` $\rightarrow$ `[P-05]` $\rightarrow$ `[P-06]` $\rightarrow$ `[H-08]` $\rightarrow$ `[H-09]` $\rightarrow$ `[H-11/14]` $\rightarrow$ `[H-15]` $\rightarrow$ `[H-13]`.

| Langkah Ke- | Layar Terkait | Aksi Aktor & Selektor `data-testid` | Ekspektasi Tampilan Antarmuka (DOM) | Verifikasi State DB & Jaringan |
|:---:|---|---|---|---|
| **1** | `[P-07]` & `[H-01]` | HR mendaftarkan perusahaan via formulir: ketik nama, email, password di `[data-testid="form-register-company"]` lalu klik `[data-testid="btn-register"]`. | Dialihkan (*redirect*) ke layar Onboarding Checklist `[H-01]` dengan ucapan selamat datang. | HTTP 201 Created; 1 baris di `companies`, 1 baris di `users`, 4 anchor stages tersimpan di `pipeline_stages`. |
| **2** | `[H-01]` $\rightarrow$ `[H-04]` | Di `[H-01]`, HR mengklik tombol checklist "Lengkapi Profil Perusahaan" `[data-testid="onboarding-step-company-profile"]`, dialihkan ke `[H-04]`, lalu mengisi 5 syarat: logo, bio, website, industri, alamat $\rightarrow$ klik Simpan `[data-testid="btn-save-profile"]`. | Toast notifikasi sukses tampil; checklist indikator profil terisi 100% (*Gating Checklist Unlocked*). | HTTP 200 OK; record `companies` terbarui dengan kolom mandatory non-null. |
| **3** | `[H-07]` | HR membuat lowongan: input judul "Senior Backend Dev", kuota "1", gaji, deadline, tipe remote di `[data-testid="form-job-create"]` lalu klik `[data-testid="btn-publish-job"]`. | Kartu lowongan tampil di daftar `[H-03]` dengan badge hijau status `'Published'`. | HTTP 201 Created; baris lowongan di `jobs` berstatus `'published'`, `quota = 1`, `filled_quota = 0`. |
| **4** | `[P-01]` | Pelamar (pada `candidatePage` terisolasi) membuka Job Board publik, mengetik "Backend" di `[data-testid="input-job-search"]` lalu tekan Enter. | Kartu lowongan "Senior Backend Dev" milik perusahaan tampil di grid pencarian. | HTTP 200 OK; query publik hanya mengembalikan lowongan published aktif. |
| **5** | `[P-05]` | Pelamar mengklik kartu lowongan, membaca deskripsi detail, lalu mengklik tombol `[data-testid="btn-apply-job"]`. | Modal Wizard Aplikasi 5 Langkah terbuka: Data diri $\rightarrow$ Pendidikan $\rightarrow$ Pengalaman $\rightarrow$ Upload CV $\rightarrow$ Screening questions. | Komponen modal berfokus (*focus-trap active*), body scroll terkunci. |
| **6** | `[P-05]` | Pelamar mengisi form wizard, mengunggah berkas resume PDF via target hidden input `input[data-testid="upload-resume-input"]`, menjawab pertanyaan skrining, lalu klik `[data-testid="btn-submit-application"]`. | Progress bar upload mencapai 100%; dialihkan otomatis ke halaman Tiket Sukses `[P-06]`. | HTTP 201 Created; `application_documents` memuat snapshot resume URL, `applications_count` lowongan naik jadi 1. |
| **7** | `[P-06]` | Pelamar melihat halaman tiket konfirmasi sukses `[P-06]`: terdapat kode referensi unik, nama lowongan, dan tombol "Pantau Status Lamaran". | Kode referensi format `APP-{YEAR}-{ID}` tampil jelas; teks konfirmasi email terkirim terlihat. | Record lamaran di tabel `applications` tersimpan dengan status `'applied'`, stage awal `'Applied'`. |
| **8** | `[H-08]` | Sesi beralih kembali ke `hrPage`. HR membuka Papan Kanban `[H-08]`. Kartu pelamar baru terlihat di kolom "Applied". HR memindahkan kartu ke kolom "Interview" via drag-and-drop atau menu aksi `[data-testid="btn-move-card-{appId}"]`. | Kartu berpindah kolom dengan animasi halus; badge status kartu berganti menjadi "Interview". | HTTP 200 OK; `applications.current_stage_id` terbarui; 1 baris riwayat tercatat di `application_history`. |
| **9** | `[H-09]` | HR mengklik kartu pelamar untuk membuka Detail Pelamar `[H-09]`. Membaca snapshot resume PDF via embedded viewer, lalu menginput catatan evaluasi tim di `[data-testid="input-candidate-note"]`. | Catatan baru langsung muncul di timeline catatan internal dengan stempel waktu dan nama pembuat. | HTTP 201 Created; baris baru tersimpan di tabel `candidate_notes`. |
| **10** | `[H-14]` & `[H-12]` | HR mengklik tombol "Jadwalkan Wawancara" `[H-14]`: input tanggal, interviewer, dan link Meet di `[data-testid="form-schedule-interview"]` $\rightarrow$ Submit. Lalu HR membuka Detail Wawancara `[H-12]` dan menguji fitur *Reschedule* via `[data-testid="btn-reschedule-interview"]` memajukan waktu 1 jam. | Modal tertutup; badge agenda wawancara terbarui di kartu pelamar dan kalender `[H-11]`. | HTTP 201 & HTTP 200; `interviews` terbarui; undangan dan revisi jadwal terverifikasi masuk ke `/api/test/mail-inbox`. |
| **11a** | `[H-15]` | **Jalur Keputusan Diterima (*Hired* & Auto-Close Lowongan)**:<br>HR membuka modal Form Keputusan `[H-15]` untuk Kandidat Utama: memilih opsi `Hired`, menginput nominal tawaran gaji final, lalu klik konfirmasi `[data-testid="btn-confirm-hire"]`. | Kartu berpindah otomatis ke kolom anchor "Hired". Muncul banner pengumuman "Kuota Terpenuhi: Lowongan Ditutup Otomatis". | HTTP 200 OK; `filled_quota = 1`, status lowongan di tabel `jobs` otomatis beralih menjadi `'closed'`. |
| **11b** | `[H-15]` | **Jalur Keputusan Ditolak (*Polite Rejection Flow — 95% Real-World Case*)**:<br>HR membuka pelamar kedua di `[H-15]`: memilih opsi `Rejected`, memilih alasan "Kualifikasi Teknis", mempratinjau template surat santun dengan variabel `{candidate_name}`, lalu klik konfirmasi `[data-testid="btn-confirm-reject"]`. | Kartu kandidat kedua berpindah ke anchor "Rejected" berbadge merah. Pada `candidatePage` `[C-02]`, Stepper berubah merah "Rejected". | HTTP 200 OK; status lamaran menjadi `'rejected'`; email penolakan santun terverifikasi terkirim via `/api/test/mail-inbox`. |
| **11c** | `[P-05]` | **Uji Batas Kuota Penuh (*Graceful Degradation on Closed Job*)**:<br>Pelamar ketiga yang terlambat mencoba menekan tombol submit lamaran pada lowongan yang baru saja ditutup. | Antarmuka menampilkan banner peringatan ramah: *"Maaf, lowongan ini baru saja ditutup karena kuota penerimaan telah terpenuhi"* tanpa crash 500. | HTTP 409 Conflict; payload error ditangani anggun oleh React Error Boundary. |
| **12** | `[H-13]` | HR membuka Dasbor Analitik `[H-13]`. | Widget "Average Time-to-Hire" menampilkan metrik durasi real-time; grafik funnel drop-off menampilkan rasio konversi akurat dari seluruh pelamar. | HTTP 200 OK; query metrik menghitung secara akurat durasi UTC dari lamaran masuk hingga stempel Hired. |

---

#### 6.5.2 `[E2E-FLOW-02]` Candidate Tracking & Self-Withdraw Journey (Alur Penarikan Lamaran Mandiri)
* **Tujuan Bisnis**: Membuktikan hak kendali penuh kandidat untuk menarik berkas lamaran (*Self-Withdraw*) secara mandiri dan memastikan penguncian mutlak kartu di papan Kanban HR (*Terminal State Lock*).
* **Peran Terlibat**: (1) Pelamar Terdaftar (`candidateContext`), (2) HR Recruiter (`hrContext`).
* **Urutan Layar**: `[P-04]` $\rightarrow$ `[C-01]` $\rightarrow$ `[C-02]` $\rightarrow$ Modal Konfirmasi $\rightarrow$ `[H-08]`.

| Langkah Ke- | Layar Terkait | Aksi Aktor & Selektor `data-testid` | Ekspektasi Tampilan Antarmuka (DOM) | Verifikasi State DB & Jaringan |
|:---:|---|---|---|---|
| **1** | `[P-04]` | Kandidat login pada `candidatePage` menggunakan kredensial valid via `[data-testid="form-candidate-login"]`. | Dialihkan ke Dasbor Pelamar `[C-01]`. Tampil daftar lamaran aktif yang pernah diajukan. | HTTP 200 OK; access token tersimpan di storage kandidat; sesi terotentikasi. |
| **2** | `[C-01]` | Kandidat mengklik kartu lamaran aktif untuk pekerjaan "Frontend Developer". | Dialihkan ke Layar Detail Riwayat Interaktif `[C-02]`. | HTTP 200 OK; komponen Visual Stepper menampilkan posisi tahapan saat ini (misal: "Screening"). |
| **3** | `[C-02]` | Kandidat mengklik tombol bahaya "Tarik Lamaran" `[data-testid="btn-withdraw-application"]`. | Modal dialog peringatan konfirmasi muncul: "Apakah Anda yakin ingin menarik lamaran? Tindakan ini bersifat permanen." | Focus trap aktif pada tombol konfirmasi modal; latar belakang meredup (*backdrop blur*). |
| **4** | `[C-02]` | Kandidat memilih alasan "Menerima tawaran lain" lalu mengklik tombol konfirmasi `[data-testid="btn-confirm-withdraw"]`. | Modal tertutup; Stepper status berubah seketika menjadi badge merah "Withdrawn"; tombol penarikan hilang. | HTTP 200 OK; `applications.status = 'withdrawn'`; stage diarahkan ke anchor `Withdrawn.id`. |
| **5** | `[H-08]` | Sesi berganti ke `hrPage`. HR mengklik tombol sinkronisasi `[data-testid="btn-refresh-pipeline"]` (sinkronisasi data non-destruktif tanpa reload halaman). | Kartu kandidat berpindah otomatis ke kolom paling kanan "Withdrawn"; kartu berstatus terkunci (*cursor not-allowed*). | Percobaan drag-and-drop kartu Withdrawn kembali ke kolom "Screening" gagal (kartu membal kembali). |

---

#### 6.5.3 `[E2E-FLOW-03]` Company Onboarding & Gating Interception Flow (Alur Penegakan Syarat Profil)
* **Tujuan Bisnis**: Membuktikan bahwa platform secara ketat mencegah perusahaan yang belum melengkapi profil hukum/bisnis untuk mempublikasikan lowongan (*Zero Incomplete Job Posting*).
* **Peran Terlibat**: HR Admin Perusahaan Baru.
* **Urutan Layar**: `[H-02]` $\rightarrow$ Intersepsi Gating $\rightarrow$ `[H-04]` $\rightarrow$ `[H-07]`.

| Langkah Ke- | Layar Terkait | Aksi Aktor & Selektor `data-testid` | Ekspektasi Tampilan Antarmuka (DOM) | Verifikasi State DB & Jaringan |
|:---:|---|---|---|---|
| **1** | `[H-02]` | HR login pertama kali dengan profil perusahaan yang masih kosong (hanya ada nama). | Dasbor HR menampilkan banner peringatan oranye: "Profil perusahaan Anda belum lengkap (20%). Lengkapi untuk dapat membuat lowongan." | Profil di database memuat `logo_url = null`, `website = null`, `bio = null`. |
| **2** | `[H-02]` | HR mencoba mem-bypass dengan mengklik tombol "Buat Lowongan Baru" `[data-testid="btn-create-job-nav"]`. | Sistem mencegat navigasi secara paksa (*guard interception*); menampilkan modal "Lengkapi Profil Perusahaan Terlebih Dahulu" dan me-redirect ke `[H-04]`. | URL peramban berpindah otomatis ke `/hr/company-profile?reason=gating_required`. |
| **3** | `[H-04]` | HR mengisi 4 kolom yang belum lengkap: unggah logo PNG, masukkan tautan website, ketik bio profil, pilih industri, dan simpan via `[data-testid="btn-save-profile"]`. | Indikator progres profil melesat menjadi "100% Lengkap"; banner peringatan oranye hilang berganti badge hijau "Profil Terverifikasi". | HTTP 200 OK; tabel `companies` terisi lengkap 5 syarat mandatory Dokumen 02 §4.3. |
| **4** | `[H-07]` | HR kembali membuka rute pembuatan lowongan `[H-07]`. | Formulir lowongan terbuka penuh tanpa ada pemblokiran; tombol "Publikasikan Lowongan" aktif (*enabled*). | Hak publikasi lowongan terbuka sah tanpa pelanggaran aturan gating. |

---

#### 6.5.4 `[E2E-FLOW-04]` HR Team Collaboration & Scoring Consensus Flow (Alur Kolaborasi Tim HR)
* **Tujuan Bisnis**: Membuktikan kemampuan kerja sama multi-staf dalam satu tenant perusahaan: aktivasi mandiri akun staf, independensi penilaian skor bintang, dan kalkulasi rata-rata konsensus transparan.
* **Peran Terlibat**: (1) Company Admin, (2) Staf Recruiter Baru.
* **Urutan Layar**: `[H-05]` $\rightarrow$ Aktivasi Email $\rightarrow$ `[H-09]` $\rightarrow$ `[H-08]`.

| Langkah Ke- | Layar Terkait | Aksi Aktor & Selektor `data-testid` | Ekspektasi Tampilan Antarmuka (DOM) | Verifikasi State DB & Jaringan |
|:---:|---|---|---|---|
| **1** | `[H-05]` | Company Admin membuka Manajemen Tim `[H-05]`, mengklik "Undang Anggota", menginput email "siti.recruiter@tech.id" dengan role "recruiter". | Anggota baru muncul di tabel tim dengan badge status abu-abu `'Invited'`. | HTTP 201 Created; token aktivasi terbuat di tabel `users`; `MockMailTransport` menangkap email link aktivasi. |
| **2** | Sesi Baru | Recruiter Siti mengambil tautan aktivasi mandiri dari endpoint uji `/api/test/mail-inbox?to=siti.recruiter@tech.id`, membuka URL pada peramban baru, menginput kata sandi baru, dan submit. | Dialihkan ke halaman login dengan notifikasi sukses "Akun Anda telah aktif, silakan login". | HTTP 200 OK; `users.status = 'active'`; token invitation di-set null. |
| **3** | `[H-09]` | Recruiter Siti login, membuka pelamar ID 10 di `[H-09]`, memberi penilaian 4 Bintang pada kartu skor `[data-testid="rating-star-4"]` beserta alasan. | Kartu skor menampilkan "Nilai Anda: 4 Bintang"; nilai konsensus sementara tercatat 4.0. | HTTP 201 Created; 1 baris evaluasi tersimpan di `candidate_scores`. |
| **4** | `[H-09]` | Company Admin membuka pelamar ID 10 yang sama di peramban terpisah, memberi penilaian 5 Bintang pada `[data-testid="rating-star-5"]`. | Nilai konsensus tim otomatis teragregasi secara real-time menjadi **4.5 Bintang (2 Reviewer)**. | HTTP 201 Created; query agregasi menghasilkan rata-rata `(4 + 5) / 2 = 4.5`. |
| **5** | `[H-08]` | Membuka Papan Kanban `[H-08]`. | Kartu kandidat ID 10 di kolom Kanban menampilkan badge rating konsensus bintang emas **★ 4.5**. | Visual konsensus tim terintegrasi menyeluruh dari lembar evaluasi detail hingga kartu Kanban ringkas. |

---

#### 6.5.5 `[E2E-FLOW-05]` Talent Pool Search, Tagging & CSV Export Flow (Alur Ekspor Pangkalan Talenta)
* **Tujuan Bisnis**: Membuktikan efisiensi pencarian pangkalan bakat internal, isolasi data tagging perusahaan, dan validitas integritas file ekspor dokumen laporan.
* **Peran Terlibat**: HR Recruiter.
* **Urutan Layar**: `[H-10]` (Pangkalan Data Talenta).

| Langkah Ke- | Layar Terkait | Aksi Aktor & Selektor `data-testid` | Ekspektasi Tampilan Antarmuka (DOM) | Verifikasi State DB & Jaringan |
|:---:|---|---|---|---|
| **1** | `[H-10]` | HR membuka menu Database Talenta `[H-10]`. Mengetik keahlian "Docker" pada kolom filter `[data-testid="filter-skills"]`. | Tabel kandidat menyaring secara instan (*debounce 300ms*) hanya menampilkan talenta yang memiliki keahlian Docker. | HTTP 200 OK; respons payload hanya memuat kandidat terfilter. |
| **2** | `[H-10]` | HR mencentang kandidat nomor 1 dan 2, lalu mengklik tombol "Sematkan Tag" `[data-testid="btn-add-tag"]`, mengetik "Priority Hire". | Badge tag ungu "Priority Hire" langsung tersemat di baris kedua kandidat tersebut. | HTTP 201 Created; 2 baris tersimpan di tabel `candidate_tags` terikat dengan `company_id`. |
| **3** | `[H-10]` | Script mengaktifkan protokol CDP `Page.setDownloadBehavior` lalu HR mengklik tombol "Ekspor CSV" `[data-testid="btn-export-csv"]`. | Indikator unduhan browser aktif; file dengan pola nama `talent-pool-{company}-{date}.csv` terunduh ke direktori unduhan aman. | HTTP 200 OK; header respons `Content-Type: text/csv; charset=utf-8` dan `Content-Disposition: attachment`. |
| **4** | File System | Script E2E membaca isi file buffer CSV yang telah terunduh ke direktori scratch pengujian. | Header CSV wajib valid: `Nama,Email,Telepon,Keahlian,Status Terakhir,Skor Konsensus,Tag`. Data terfilter rapi tanpa karakter rusak (*encoding corruption*). | Memvalidasi seluruh data 100% akurat sesuai baris database aktual. |

---

### 6.6 Matriks Sensus Tier B: 29 Screens UI/UX 8-Dimension Responsive Matrix

Seluruh 29 layar antarmuka sistem RecruitFlow diaudit secara objektif terhadap **Framework 8-Dimensi** (Desain Sistem Dokumen 05 & UI/UX Spec Dokumen 03):
- **Dual-State Validation (Empty State vs Populated State)**: Setiap layar diverifikasi pada kondisi kosong (*Zero Data: Empty Kanban / No Jobs Found / 0 Applications*) dengan memeriksa ilustrasi ramah, teks panduan, dan tombol CTA utama Dokumen 03 §1.4, serta diverifikasi pada kondisi berisi data (*populated state*).
- **Standar Touch-Target Mobile ($\ge 48\times 48\text{px}$)**: Seluruh tombol interaktif, ikon navigasi drawer, tab kanban, dan pagination mobile diverifikasi memiliki area sentuh minimum $48\times 48\text{px}$ sesuai standar aksesibilitas WCAG 2.1 AA.

#### 6.6.1 9 Layar Publik (`[P-00]` s/d `[P-08]`)

| Kode Layar | Nama Layar & Rute URL | Pengguna Sasaran | Tampilan Desktop ($\ge 1024\text{px}$) | Transformasi Mobile ($375\text{px}$) | Aksesibilitas & Navigasi Keyboard | Tool Validasi |
|:---:|---|---|---|---|---|:---:|
| **`[P-00]`** | Landing Page Utama Dua Sisi<br>`/` | Publik / Guest | Hero section dua sisi (Pencari Kerja vs Perusahaan), value proposition, statistik platform, navigasi terpadu. | Hero section bertumpuk vertikal linear, pemilih peran cepat (Pencari Kerja / Pasang Lowongan) di bagian atas. | Seluruh CTA memiliki teks penjelas; navigasi header mendukung tombol Tab; kontras warna rasio $\ge 4.5:1$. | Puppeteer + Subagent |
| **`[P-01]`** | Job Board Publik Terpadu<br>`/cari-lowongan` | Pencari Kerja | Grid kartu lowongan 3 kolom, filter bar samping (Kategori, Lokasi, Tipe Kerja), search bar dengan debounce 300ms. | Filter bar berubah menjadi *Sticky Bottom Sheet Filter*, grid kartu 1 kolom penuh dengan padding sentuh nyaman. | Keyboard search submit via Enter; tag keahlian dapat difokus dan dibaca screen reader; pagination aksesibel. | Puppeteer + Subagent |
| **`[P-02]`** | Detail Lowongan & Persyaratan<br>`/jobs/:jobId` | Pencari Kerja | Layout 2 kolom: deskripsi pekerjaan, kualifikasi, benefit (kiri); kartu ringkasan *sticky* & tombol lamar (kanan). | Kartu ringkasan pindah ke bawah deskripsi; tombol "Lamar Sekarang" menjadi *Fixed Bottom Floating Action Button (FAB)*. | Tombol lamar memiliki atribut `aria-haspopup="dialog"`; indikator batas kuota dan deadline terbaca jelas. | Puppeteer + Subagent |
| **`[P-03]`** | Profil Perusahaan Publik<br>`/companies/:companySlug` | Publik | Banner sampul perusahaan, logo beresolusi tinggi, profil naratif, tautan sosial media, daftar lowongan aktif perusahaan. | Banner sampul proporsional 16:9; logo bertumpuk di tengah; daftar lowongan bertumpuk 1 kolom vertikal. | Seluruh link media sosial memiliki atribut `rel="noopener noreferrer"` dan `aria-label` deskriptif. | Browser Subagent |
| **`[P-04]`** | Portal Masuk & Daftar Talenta<br>`/candidate/login`, `/candidate/register` | Pelamar | Kartu otentikasi terpusat dengan efek glassmorphism, tab pemilih Login / Register, validasi password dinamis. | Kartu memenuhi layar ponsel tanpa margin horizontal berlebih; form field otomatis menampilkan keypad yang sesuai. | Form submit dapat dipicu via Enter; elemen input memiliki atribut `autocomplete` terstandar. | Puppeteer |
| **`[P-05]`** | Formulir Lamaran 5 Langkah<br>`/jobs/:jobId/apply` | Pelamar | Form stepper multi-langkah: Data Pribadi $\rightarrow$ Pengalaman $\rightarrow$ Pendidikan $\rightarrow$ Upload CV $\rightarrow$ Skrining. | Stepper horizontal berubah menjadi indikator numerik ringkas "Langkah 2 dari 5"; area unggah CV ramah sentuhan. | Hidden input primitive `input[data-testid="upload-resume-input"]`; pesan error inline terhubung via `aria-describedby`. | Puppeteer + Subagent |
| **`[P-06]`** | Konfirmasi Lamaran Berhasil<br>`/jobs/:jobId/success` | Pelamar | Kartu boarding pass tanda terima: kode referensi lamaran, QR/Barcode, tombol tracking, rekomendasi lowongan serupa. | Kartu tanda terima beradaptasi vertikal; tombol aksi utama "Pantau di Dasbor" berada di zona jangkauan ibu jari. | Notifikasi keberhasilan memiliki penanda `role="status"` dan `aria-live="polite"`. | Browser Subagent |
| **`[P-07]`** | Landing Page Khusus Perusahaan<br>`/untuk-perusahaan` | HR / Employer | Halaman penawaran nilai B2B, peragaan fitur ATS modern, kalkulator efisiensi rekrutmen, tombol registrasi HR. | Tata letak 1 kolom memanjang, peragaan fitur berubah menjadi swipeable carousel kartu visual. | Tag heading terstruktur urut (`h1` $\rightarrow$ `h2`); tombol CTA mengarah tepat ke rute pendaftaran perusahaan. | Browser Subagent |
| **`[P-08]`** | Halaman Paket & Bebas Paywall<br>`/harga` | Publik & B2B | Tabel komparasi transparan: menonjolkan komitmen "100% Free Forever for Growth" tanpa paket langganan berbayar. | Kartu fitur bertumpuk vertikal; tombol "Mulai Gunakan Gratis" mendominasi antarmuka. | **Audit Zero-Paywall**: Memverifikasi tidak ada form kartu kredit, script gateway pembayaran, atau checkout tier. | Browser Subagent |

---

#### 6.6.2 5 Layar Kandidat (`[C-01]` s/d `[C-05]`)

| Kode Layar | Nama Layar & Rute URL | Pengguna Sasaran | Tampilan Desktop ($\ge 1024\text{px}$) | Transformasi Mobile ($375\text{px}$) | Aksesibilitas & Navigasi Keyboard | Tool Validasi |
|:---:|---|---|---|---|---|:---:|
| **`[C-01]`** | Dasbor Utama & Ringkasan Lamaran<br>`/candidate/dashboard` | Pelamar | Kartu metrik ringkasan (Total Lamaran, Diproses, Wawancara), daftar lamaran aktif terkini dengan status badge semantik. | Metrik ringkasan menjadi carousel geser horizontal; daftar lamaran berubah menjadi kartu vertikal ringkas. | Navigasi atas collapse menjadi menu drawer; kartu lamaran dapat dinavigasi menggunakan tombol Tab lalu Enter. | Puppeteer + Subagent |
| **`[C-02]`** | Rincian Status & Timeline Seleksi<br>`/candidate/dashboard/:applicationId` | Pelamar | **Interactive Stage Rail (Visual Stepper)** horizontal progres hulu-ke-hilir, info jadwal wawancara, tombol tarik lamaran. | Stepper horizontal bertransformasi menjadi **Vertical Stepper** dengan stempel waktu dan status di sisi kiri. | Stepper memiliki atribut `aria-current="step"` pada tahap aktif; modal konfirmasi withdraw memiliki focus trap. | Puppeteer + Subagent |
| **`[C-03]`** | Daftar Lowongan Disimpan<br>`/candidate/saved-jobs` | Pelamar | Grid kartu lowongan yang dibookmark kandidat, tombol lamar cepat, tombol hapus bookmark. | Grid 1 kolom penuh; tombol aksi hapus dan lamar mudah dijangkau ibu jari (*thumb zone*). | Daftar bookmark kosong memunculkan empty state ramah dengan tombol CTA menuju Job Board `[P-01]`. | Puppeteer + Subagent |
| **`[C-04]`** | Penyuntingan Profil Talenta<br>`/candidate/profile` | Pelamar | Formulir multi-seksi: Informasi Pribadi, Riwayat Karir/Pengalaman, Riwayat Pendidikan, Ringkasan Keahlian. | Form 1 kolom linear; tombol tambah pengalaman/pendidikan memunculkan modal sheet bawah (*bottom sheet*). | Input tanggal memiliki validator format; tombol simpan perubahan memiliki status loading spinner saat submit. | Puppeteer |
| **`[C-05]`** | Pustaka Dokumen & Pengelolaan CV<br>`/candidate/profile/documents` | Pelamar | Manajer file CV: kartu CV utama aktif, pratinjau PDF inline, riwayat unggahan berkas, dropzone ganti CV master. | Dropzone membesar untuk memudahkan sentuhan; tombol unduh dan ganti dokumen terpisah jelas. | Komponen unggah memvalidasi tipe file (*PDF only $\le 5$MB*) dan membacakan status error via `aria-live`. | Puppeteer + Subagent |

---

#### 6.6.3 15 Layar HR & Perusahaan (`[H-01]` s/d `[H-15]`)

| Kode Layar | Nama Layar & Rute URL | Pengguna Sasaran | Tampilan Desktop ($\ge 1024\text{px}$) | Transformasi Mobile ($375\text{px}$) | Aksesibilitas & Navigasi Keyboard | Tool Validasi |
|:---:|---|---|---|---|---|:---:|
| **`[H-01]`** | Portal Masuk & Daftar Akun HR<br>`/company/login`, `/company/register` | HR Owner / Recruiter | Formulir registrasi B2B terstruktur: Nama Perusahaan, Email Kerja, Password; beralih cepat ke portal login HR. | Formulir 1 kolom terpusat; ilustrasi samping disembunyikan (*display: none*) demi efisiensi layar ponsel. | Formulir mendukung navigasi keyboard penuh; indikator kekuatan kata sandi memandu secara interaktif. | Puppeteer |
| **`[H-02]`** | Pengisian Profil Perusahaan Awal<br>`/dashboard/onboarding` | HR Owner | Wizard orientasi perusahaan 3 langkah: Informasi Bisnis Dasar $ightarrow$ Alamat Kantor $ightarrow$ Logo & Branding. | Wizard stepper vertikal kompak; tombol navigasi Lanjut / Lewati berada di dasar layar. | Input terhubung dengan skema validasi Zod; notifikasi error inline mengarahkan fokus ke kolom pertama yang invalid. | Puppeteer + Subagent |
| **`[H-03]`** | Dasbor Ringkasan & Operasional HR<br>`/dashboard` | HR Team | Grid 4 metrik KPI (Lowongan Aktif, Total Pelamar, Interview Terjadwal, Hired Bulan Ini), feed aktivitas operasional terkini. | Kartu metrik tersusun vertikal kompak; feed aktivitas dapat di-scroll horizontal tanpa memotong layout. | Sidebar navigasi desktop bertransformasi menjadi *Hamburger Drawer Navigation*; focus trap aktif saat drawer terbuka. | Puppeteer + Subagent |
| **`[H-04]`** | Manajemen Profil & Lokasi Perusahaan<br>`/dashboard/company-profile` | HR Admin | Formulir 2 kolom: pratinjau logo & galeri kantor di kiri; input nama hukum, bio industri, website, lokasi di kanan. | Form 1 kolom penuh; dropzone logo mendukung sentuhan mobile; tombol simpan perubahan *sticky* di bawah. | Gating alert banner muncul jika profil belum 100% lengkap, memblokir pembuatan lowongan sesuai Dokumen 02 §2.2. | Puppeteer + Subagent |
| **`[H-05]`** | Manajemen Anggota Tim & Wewenang<br>`/dashboard/team` | HR Admin | Tabel daftar anggota tim, status undangan, selektor role Admin/Recruiter, tombol modal undang staf baru. | Tabel tim berubah menjadi kartu profil staf dengan tombol aksi panggil/email cepat. | Modal undang anggota menerapkan *focus trap* dan menutup saat tombol `Escape` ditekan; kuota kursi tanpa batas. | Puppeteer |
| **`[H-06]`** | Manajemen Daftar Lowongan Kerja<br>`/dashboard/jobs` | HR Recruiter | Tabel lowongan komprehensif: judul, kuota terisi/total, status (Draft/Published/Closed), tombol aksi kelola/pipeline. | Tabel berganti menjadi kartu vertikal; tombol aksi utama "Lihat Pipeline" langsung terlihat di setiap kartu. | Badge status menggunakan token warna semantik Dokumen 05; teks status terbaca jelas oleh screen reader. | Puppeteer |
| **`[H-07]`** | Pembuatan & Penyuntingan Lowongan<br>`/dashboard/jobs/new`, `/dashboard/jobs/:id/edit` | HR Recruiter | Stepper 4 langkah: Detail Pekerjaan $ightarrow$ Kualifikasi & Benefit $ightarrow$ Custom Questions Builder $ightarrow$ Tahapan Seleksi. | Stepper disederhanakan; builder pertanyaan kustom tersusun vertikal dengan tombol tambah pertanyaan besar. | Seluruh form kontrol dapat diakses via keyboard; tombol simpan draft terpisah dari tombol publikasikan. | Puppeteer + Subagent |
| **`[H-08]`** | Papan Pipeline Pelamar (Kanban)<br>`/dashboard/jobs/:id/pipeline` | HR Recruiter | Papan multi-kolom horizontal (*Applied*, *Screening*, *Interview*, *Offered*, *Hired*, *Rejected*, *Withdrawn*); drag-and-drop antar kolom. | Papan bertransformasi menjadi **Swipe View 1 Kolom per Layar** dengan pemilih tab kolom di bagian atas. | Dilengkapi tombol non-destruktif `[data-testid="btn-refresh-pipeline"]`; mutasi status divalidasi aturan FSM biner. | Puppeteer + Subagent |
| **`[H-09]`** | Detail Profil & Evaluasi Pelamar<br>`/dashboard/candidates/:id` | HR Recruiter | Tampilan split 3 panel: Snapshot CV & Berkas (kiri), Timeline Riwayat (tengah), Form Nilai Bintang & Catatan (kanan). | Panel bertransformasi menjadi **3 Tab Mobile**: Tab CV, Tab Riwayat, dan Tab Evaluasi Tim Rekrutmen. | Scoring konsensus rata-rata terhitung matematis; otorisasi catatan menerapkan *Author-Only Modification*. | Puppeteer + Subagent |
| **`[H-10]`** | Pangkalan Data Pelamar (Talent Pool)<br>`/dashboard/candidates` | HR Recruiter | Tabel pangkalan data pelamar global: filter keahlian ganda (*multi-skill*), penyematan tag massal (*bulk tag*), dan ekspor CSV. | Filter lanjutan masuk ke dalam modal sheet bawah; tombol aksi massal melayang (*floating bottom action bar*). | Menguji kepatuhan UU PDP: kandidat berstatus Withdrawn terbukti **otomatis dikecualikan dari listing Talent Pool**. | Puppeteer |
| **`[H-11]`** | Kalender & Jadwal Wawancara<br>`/dashboard/calendar` | HR Recruiter | Kalender grid bulanan/mingguan dengan blok warna sesi interview, nama pelamar, pewawancara, dan lokasi Meet. | Kalender berganti menjadi **Tampilan Agenda List Harian (*Agenda View*)** yang vertikal dan kompak. | Navigasi bulan memiliki tombol `aria-label` deskriptif; jadwal wawancara menampilkan zona waktu WIB resmi. | Browser Subagent |
| **`[H-12]`** | Manajemen Template Surat Rekrutmen<br>`/dashboard/email-templates` | HR Admin | Editor template surat penawaran (*Offering*) dan penolakan santun (*Rejection*) dengan variabel dinamis `{candidate_name}`. | Pratinjau WYSIWYG dipisahkan ke dalam tab tersendiri (*Editor Tab* vs *Preview Tab*). | Tombol sisipkan variabel memiliki atribut `aria-label`; validasi memastikan variabel wajib tidak terhapus. | Browser Subagent |
| **`[H-13]`** | Dasbor Analitik & Efisiensi<br>`/dashboard/analytics` | HR Admin | Grid visualisasi metrik rekrutmen: grafik Time-to-Hire, conversion rate funnel pelamar, dan statistik asal sumber pelamar. | Grafik analitik mengecil secara proporsional dan mendukung sentuhan geser (*touch scroll on SVG charts*). | Grafik visual dilengkapi tabel data alternatif yang dapat dibaca pembaca layar (*screen reader accessible table*). | Browser Subagent |
| **`[H-14]`** | Modal Jadwalkan Wawancara<br>`/dashboard/calendar` & Drawer `[H-09]` | HR Recruiter | Dialog modal dengan date-time picker, pemeriksa bentrok jadwal otomatis (*collision warning banner*), pilihan pewawancara. | Modal melebar 100% layar menyerupai halaman penuh (*full-screen sheet on mobile*). | Focus trap mengurung kursor di dalam modal; tombol Tutup (*X*) mudah dijangkau dan memiliki area sentuh $\ge 48\text{px}$. | Puppeteer + Subagent |
| **`[H-15]`** | Modal Konfirmasi Keputusan Akhir<br>Drawer `[H-09]` | HR Recruiter | Dialog konfirmasi akhir: Hired (pemberian penawaran & auto-close kuota) atau Rejected (pilihan alasan & template surat santun). | Dialog konfirmasi vertikal bersih dengan tombol konfirmasi final terlindungi dari *double-click submit*. | Pilihan status menggunakan komponen radio semantik; eksekusi memicu background email outbox secara decoupled. | Puppeteer |

---

### 6.7 Prinsip & Ambang Kelulusan Tingkat 4

Eksekusi suite pengujian Tingkat 4 dinyatakan **LULUS (100% PASS)** jika dan hanya jika memenuhi seluruh ambang batas berikut:
1. **100% Lulus pada Seluruh 5 Golden User Flows**: Tidak ada kegagalan langkah pada `[E2E-FLOW-01]` hingga `[E2E-FLOW-05]`, termasuk validasi jalur Hired, Rejection Santun, Reschedule Wawancara, dan penanganan batas kuota penuh.
2. **Zero Uncaught Console Errors**: Selama peramban berjalan, tidak boleh ada pengecualian JavaScript (*unhandled exception*), *failed network resource* yang tidak terduga, atau *React warning key*.
3. **Anggaran Waktu Eksekusi Automasi CLI**: Seluruh 5 Golden Flows pada Jalur 1 (Puppeteer Headless) wajib tuntas dieksekusi dalam waktu **$\le 60.0$ detik** di atas build Production Preview.
4. **Verifikasi Visual 29 Layar**: Seluruh 29 antarmuka terbukti tidak mengalami teks terpotong (*text overflow*), tombol bertumpuk, atau kerusakan layout pada viewport Desktop (1440px) maupun Mobile (375px).
5. **Standar Touch-Target Mobile**: 100% elemen interaktif mobile memenuhi luas sentuh minimum $\ge 48\times 48\text{px}$ (WCAG 2.1 AA).
6. **Zero State Degradation**: Seluruh 29 layar terbukti memiliki visual kondisi kosong (*empty state*) yang rapi dan informatif saat data bernilai nol sesuai Dokumen 03 §1.4.
7. **Verifikasi Otentik Pengiriman Email**: 100% email notifikasi (aktivasi tim, jadwal wawancara, reschedule, dan surat penolakan) terbukti valid secara payload via inspeksi `/api/test/mail-inbox`.

---

### 6.8 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 4

| Kriteria Quality Gate Tingkat 4 | Standar Ambang Batas | Status Kepatuhan Desain | Mekanisme Pembuktian Teknis |
|---|:---:|:---:|---|
| **Cakupan 5 Golden User Flows** | 100% Tuntas (5 dari 5) | **Terpenuhi** | Menguji siklus perekrutan utuh: Hired, Rejection Santun, Reschedule Wawancara, Gating, Tim, & Pangkalan Talenta |
| **Audit Sensus 29 Layar UI/UX** | 100% Terpetakan (29 Layar) | **Terpenuhi** | Divalidasi pada Desktop (1440px) dan Mobile (375px) dengan Dual-State (Empty vs Populated State) |
| **Isolasi Sesi Multi-Context Browser** | 0 Tabrakan Token | **Terpenuhi** | Menggunakan `browser.createBrowserContext()` memisahkan sesi HR vs Pelamar secara mutlak |
| **Dual-Mode Kanban Drag & Drop** | 100% Deterministik | **Terpenuhi** | Mendukung mouse drag visual + menu aksi kartu aksesibel keyboard bebas flakiness |
| **Sinkronisasi Non-Destruktif Pipeline** | State Preserved | **Terpenuhi** | Memperbarui kartu Kanban via `[data-testid="btn-refresh-pipeline"]` tanpa full page reload |
| **Primitif Unggah Berkas Headless** | 100% Sukses Upload | **Terpenuhi** | Skrip Puppeteer menargetkan elemen hidden input `input[data-testid="upload-resume-input"]` via `.uploadFile()` |
| **Verifikasi Email via Test API Hook** | Payload 100% Valid | **Terpenuhi** | Memvalidasi isi subjek dan tautan email langsung dari endpoint `/api/test/mail-inbox` memori `MockMailTransport` |
| **Standarisasi Device Emulation** | 2 Breakpoint Baku | **Terpenuhi** | Desktop 1440x900px dan Mobile iPhone SE 375x667px teremulasi resmi via Puppeteer Device API |
| **CDP Headless Download Configuration** | File Unduhan Utuh | **Terpenuhi** | Mengaktifkan `Page.setDownloadBehavior` pada `[E2E-FLOW-05]` via Chrome DevTools Protocol |
| **Target Eksekusi Build Production Preview** | Zero Cold-Start Delay | **Terpenuhi** | Runner CI/CD mengeksekusi tes di atas `npm run preview` port 5173 untuk simulasi performa riil |
| **Integritas Sinkronisasi Multi-Peran** | Real-Time State Sync | **Terpenuhi** | Perubahan stage oleh HR di Kanban langsung menggeser Stepper Kandidat di portal pelamar |
| **Resiliensi Selektor Elemen Web** | 100% `data-testid` | **Terpenuhi** | Mengeliminasi selector CSS rapuh, menjamin zero flakiness pada pengujian otomatis |
| **Audit Bebas Paywall pada E2E** | 100% Bebas Paywall | **Terpenuhi** | Layar `[P-08]` dan seluruh alur pembuatan lowongan terbebas mutlak dari gateway pembayaran |
| **Kebijakan Zero Console Errors** | 0 Console Errors | **Terpenuhi** | Listener `page.on('console')` menghentikan tes seketika jika terdapat uncaught runtime error |
| **Auto-Artifact Screenshot on Failure** | 100% Tangkapan Layar | **Terpenuhi** | Blok `catch` otomatis menyimpan PNG dan dump DOM ke `artifacts/e2e-failures/` saat terjadi kegagalan |
| **Anggaran Kecepatan Suite E2E** | $\le 60.0\text{ detik}$ | **Terpenuhi** | Menjalankan headless CLI via Puppeteer dengan eksekusi paralel alur independen |

---

# BAB 7: TINGKAT 5 — ACCEPTANCE, REGRESSION & CHAOS RESILIENCE ARCHITECTURE

### 7.1 Ruang Lingkup & Fokus Pengujian
Tingkat 5 adalah pintu gerbang penentu (*Quality Gate*) paling krusial sebelum sistem RecruitFlow dinyatakan layak rilis ke lingkungan produksi (*Production Readiness Gate*). Jika Tingkat 1 hingga Tingkat 4 memverifikasi kebenaran teknis dari komponen individual, middleware, integrasi API, dan perjalanan pengguna peramban, maka Tingkat 5 memvalidasi platform secara holistik terhadap:
1. **Pemenuhan Kontrak Bisnis Mutlak (PRD Acceptance Criteria)**: Membuktikan bahwa seluruh 15 Modul fungsional Dokumen 02 (PRD FR-1.1 s/d FR-15.3) dan tujuan bisnis Dokumen 01 (PDD) terpenuhi secara biner (*Pass/Fail*).
2. **Penegakan Mandat Bebas Paywall (*Zero-Paywall Guardrail Enforcement*)**: Memverifikasi secara forensik bahwa platform 100% bebas biaya untuk alur rekrutmen inti, tidak ada paywall tersembunyi, tidak ada pembatasan kuota lowongan aktif berbasis paket langganan, dan seluruh artefak peninggalan simulator paket berbayar telah dinonaktifkan permanen (*unmounted from app router*).
3. **Resiliensi Bencana & Kegagalan Eksternal (*Chaos Engineering & Outage Resilience*)**: Menguji ketahanan sistem saat terjadi pemadaman (*outage*) atau kelambatan jaringan pada layanan pihak ketiga (Resend API HTTP 500 / Network Hang, Supabase Storage latency, pemutusan pool koneksi PostgreSQL) tanpa merusak integritas transaksi basis data dan tanpa merugikan pengguna.
4. **Otomasi Pekerja Latar Belakang & Cron (*Background Workers & Outbox Sweepers*)**: Memvalidasi integritas tugas terjadwal otomatis (penutupan lowongan kadaluarsa tengah malam secara kondisional-atomik oleh `jobDeadlineChecker.cron.js` dan pengiriman ulang antrean surat tertunda non-blocking oleh `emailSweeper.cron.js`).
5. **Perlindungan Terhadap Regresi & Idempotensi Skema (*Regression Safety & Migration Idempotency*)**: Menjamin pembaruan kode baru tidak merusak (*breaking changes*) fitur eksisting serta memvalidasi bahwa migrasi database dapat digulung maju dan mundur secara bersih pada database sandbox terisolasi tanpa merusak struktur data.

---

### 7.2 Metode Pengujian
* **Acceptance Test-Driven Development (ATDD)**: Menerjemahkan setiap klausa kriteria penerimaan PRD menjadi assertion biner yang deterministik. Tidak ada toleransi status "sebagian lulus" pada fungsi inti bisnis.
* **Chaos Engineering & Fault-Injection Interceptors**: Menyuntikkan simulasi kegagalan jaringan secara terprogram pada lapisan adapter pihak ketiga di lingkungan `NODE_ENV=test` guna menguji penerapan *Pending Outbox Pattern* dan transaksi atomik ACID.
* **Virtual Time-Travel & Programmatic Cron Invocation**: Menguji logika worker berbasis jadwal tengah malam secara deterministik menggunakan manipulasi jam sistem (`vi.setSystemTime()`) tanpa menunggu siklus waktu riil.
* **Four-Tier Zero-Paywall Audit**: Menguji kepatuhan bebas biaya pada 4 lapis arsitektur: (1) Antarmuka UI/DOM, (2) Routing API Backend, (3) Logika Bisnis & Batas Kuota, dan (4) Skema Basis Data.
* **Automated Regression Suite & Migration Rollback Testing**: Menjalankan kembali seluruh rantai pengujian otomatis dan mengeksekusi siklus migrasi maju-mundur (`migrate` $\rightarrow$ `undo` $\rightarrow$ `migrate`) pada skema terisolasi untuk membuktikan idempotensi skema.

---

### 7.3 Tooling Stack & Konfigurasi Eksekusi

```
[ ARSITEKTUR EKSEKUSI TINGKAT 5: ACCEPTANCE & CHAOS ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
 [ ACCEPTANCE RUNNER ]             [ CHAOS INJECTOR ]
 • Tool: `Vitest CLI`              • Tool: `FaultController` Adapter
 • Command: `npm run test:accept`  • Intercept: Resend (500) & Storage
 • Target: PRD & Zero-Paywall      • Target: Pending Outbox & Rollbacks
        │                                 │
        └────────────────┬────────────────┘
                         ▼
        [ VIRTUAL CRON & WORKER RUNNER ]
        • Tool: `vi.useFakeTimers()` + Direct Invocable Cron
        • Target: Midnight Auto-Close & Secondary Email Sweeper
```

1. **Automated CLI Runner & Configuration**:
   - Dijalankan melalui perintah terstandar pada root repositori:
     ```bash
     npm run test:acceptance
     ```
   - Skrip ini mengeksekusi runner `vitest run tests/acceptance --runInBand` dengan alokasi anggaran waktu total **$\le 45.0$ detik**.
2. **Protokol Seeding Data Uji Penerimaan (`seed-test.js --acceptance`)**:
   - Sebelum suite dijalankan, basis data PostgreSQL Supabase dibersihkan (`TRUNCATE CASCADE`) dan disuntikkan set data benih terstandar yang memuat tenant referensi, lowongan multi-tahap, pelamar pada berbagai kondisi status, dan pengguna dengan berbagai role RBAC.
3. **Pengontrol Injeksi Kegagalan (*Chaos Fault-Injection Controller*)**:
   - Dikelola oleh helper internal `backend/tests/helpers/fault.helper.js` yang memungkinkan pengaktifan kondisi kegagalan spesifik per-skenario:
     ```javascript
     import { faultController } from '../helpers/fault.helper.js';
     faultController.enable('RESEND_OUTAGE_500'); // Memaksa adapter mailer melempar HTTP 500
     ```
4. **Isolasi Database Khusus Uji Migrasi (`recruitflow_migration_sandbox`)**:
   - Pengujian siklus migrasi database `[AT-REG-02]` dikunci untuk berjalan pada database terpisah (`DB_MIGRATION_SANDBOX_URL`) agar operasi `migrate:undo` tidak pernah merusak atau menghapus data benih pengujian penerimaan pada database uji utama.
5. **Batas Timeout Agresif Klien HTTP Eksternal (`timeout: 3000ms`)**:
   - Seluruh panggilan keluar ke API Resend dibatasi timeout ketat maksimal **3000ms (3.0 detik)** untuk mencegah antarmuka HR mengalami *freeze* saat terjadi *network hang / silent packet loss*.

---

### 7.4 Audit Kepatuhan Lingkup Bebas Paywall (Zero Paywall Guardrail)

Sesuai komitmen fundamental RecruitFlow (PDD Baris 91 & PRD §4.4), seluruh fungsionalitas rekrutmen dirancang **100% Bebas Biaya Tanpa Batasan Model Freemium Palsu**. Tingkat 5 menegakkan pengujian forensik pada 4 tingkatan arsitektur:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   4 TINGKATAN AUDIT KEPATUHAN BEBAS PAYWALL (ZERO-PAYWALL)             │
├─────────────────────┬─────────────────────────────────┬────────────────────────────────┤
│ Lapisan Audit       │ Fokus Pengujian & Verifikasi    │ Kriteria Kelulusan Biner       │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ **1. Lapisan UI**   │ Inspeksi DOM Halaman Harga      │ Form input kartu kredit = 0;   │
│    (`[P-08]`)       │ `/harga` & Dasbor HR            │ Script gateway pembayaran = 0; │
│                     │                                 │ Tidak ada tombol checkout/beli.│
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ **2. Lapisan API**  │ Pemanggilan Rute Legacy         │ Rute `subscriptions.routes.js` │
│    (Routing)        │ `/api/subscriptions/*`          │ dicopot dari `app.js`; request │
│                     │                                 │ mengembalikan HTTP 404 / 410.  │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ **3. Lapisan Logika│ Publikasi Lowongan & Kuota Staf │ Menerbitkan > 10 lowongan aktif│
│    Bisnis**         │ Tanpa Pembatasan Tier           │ berhasil; mengundang > 10 staf │
│                     │                                 │ berhasil tanpa modal bayar.    │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ **4. Lapisan Basis │ Struktur Tabel & Kolom          │ Tidak ada dependensi kolom     │
│    Data (Schema)**  │ PostgreSQL                      │ `plan_type`, `subscription_id`,│
│                     │                                 │ atau status pembayaran aktif.  │
└─────────────────────┴─────────────────────────────────┴────────────────────────────────┘
```

---

### 7.5 Chaos Resiliency Test (Simulasi Resend Outage & Storage Failure)

#### 7.5.1 Simulasi Pemadaman Layanan Email Eksternal (*Resend Outage Resilience*)
Ketika HR Recruiter menetapkan status pelamar menjadi `Hired` atau `Rejected`, sistem wajib mengirimkan surat pemberitahuan. Jika API Resend mengalami gangguan (*downtime / HTTP 500 / Network Timeout*), sistem mengimplementasikan **Pending Outbox Architectural Pattern**:

```
[ HR Menetapkan Status Pelamar (Hired / Rejected) ]
                      │
                      ▼
[ 1. Mulai Transaksi Database PostgreSQL ]
  • UPDATE applications SET status = 'hired'/'rejected'
  • INSERT INTO application_history (audit trail)
  • UPDATE jobs SET filled_quota = filled_quota + 1 (jika Hired)
                      │
                      ▼
[ 2. Panggilan API Resend (Cut-off Timeout Maksimal 3000ms) ]
                      │
       ┌──────────────┴──────────────┐
       ▼                             ▼
 [ TINDAKAN SALAH ]            [ TINDAKAN RECRUITFLOW (BENAR) ]
 • Rollback Transaksi DB       • COMMIT Transaksi Database Tetap Sah!
 • Tampilkan Error 500 ke HR   • Catat Surat ke `email_send_log` (status='pending')
 • UI Freeze 30 Detik          • Kembalikan HTTP 200 OK Cepat (< 3.5s) ke HR
 • Kandidat Batal Diterima     • Worker Background Sweeper Mengirim Ulang Otomatis
```

#### 7.5.2 Simulasi Latensi & Gangguan Supabase Storage
Ketika kandidat mengunggah berkas resume PDF dan layanan penyimpanan Supabase Storage mengalami *timeout* (> 10 detik) atau koneksi putus:
- Transaksi aplikasi wajib mengalami **Clean Rollback**: tidak boleh ada baris "sampah" (*orphaned rows*) yang tersimpan di tabel `applications` atau `application_documents` tanpa berkas fisik yang valid.
- Antarmuka pengguna menerima pesan kesalahan yang ramah (*"Koneksi penyimpanan sedang lambat, silakan coba beberapa saat lagi"*) dengan status HTTP 503 / 408.

---

### 7.6 Background Worker & Cron Automation Verification

#### 7.6.1 Worker Penutupan Lowongan Kadaluarsa Otomatis (`jobDeadlineChecker.cron.js`)
* **Jadwal Eksekusi**: Pukul 00:01 WIB setiap hari.
* **Logika Bisnis & Atomic Conditional Update**: Menyeleksi dan memperbarui seluruh lowongan dengan kriteria kondisional atomik:
  ```sql
  UPDATE jobs 
  SET status = 'closed', updated_at = NOW() 
  WHERE id = $1 AND status = 'published' AND deadline < NOW();
  ```
  *Klausul kondisional ini menjamin jika HR baru saja memperpanjang tenggat waktu lowongan beberapa milidetik sebelumnya, kueri menghasilkan 0 baris terdampak secara aman tanpa penutupan tak disengaja.*
* **Aksi Audit**: Mencatat entri riwayat pada `activity_logs` dengan event `'JOB_AUTO_CLOSED_EXPIRED'`.
* **Metode Uji**: Fungsi dieksekusi secara programatis dengan memajukan jam virtual Vitest melewati batas tenggat lowongan.

#### 7.6.2 Worker Pemrosesan Ulang Email Tertunda (`emailSweeper.cron.js`)
* **Jadwal Eksekusi**: Berjalan secara periodik (setiap 30 detik pada kondisi normal).
* **Kueri Non-Blocking (Pencegahan Database Deadlock)**:
  ```sql
  SELECT id, recipient, payload, retry_count 
  FROM email_send_log 
  WHERE status = 'pending' AND retry_count < 5 
  ORDER BY created_at ASC 
  LIMIT 50 
  FOR UPDATE SKIP LOCKED;
  ```
  *Klausa `FOR UPDATE SKIP LOCKED` menjamin worker mengunci dan memproses baris antrean secara independen tanpa memblokir proses insert atau update dari controller utama.*
* **Penanganan Dead-Letter Queue (DLQ Limit 5x)**: Jika sebuah surat gagal dikirimkan hingga `retry_count >= 5`, statusnya otomatis bermutasi menjadi `'permanently_failed'` (*Dead-Letter State*) dan mencatat log peringatan kritis `'CRITICAL_NOTIFICATION_DEAD_LETTER'` pada `activity_logs`.
* **Pembakuan Kunci Idempotensi**:
  Setiap surat memiliki kunci unik deterministik:
  `idempotency_key = SHA256("${application_id}:${stage_id}:${recipient_email}:${template_slug}")`.
  Kunci ini menjamin surat tidak pernah dikirimkan ganda (*Zero Duplicate Dispatch*) meskipun worker berjalan paralel di multi-instance.
* **Service Level Agreement (SLA) Pemulihan**: Seluruh antrean surat berstatus `'pending'` wajib terkirim tuntas maksimal dalam waktu **15 menit** setelah layanan Resend kembali normal.

---

### 7.7 Prinsip & Ambang Kelulusan Tingkat 5

Eksekusi suite pengujian Tingkat 5 dinyatakan **LULUS MUTLAK (100% PRODUCTION READY)** jika dan hanya jika memenuhi seluruh ambang batas berikut:
1. **100% Lulus pada Seluruh 22 Skenario Uji Tingkat 5**: Tidak ada satupun test case acceptance, chaos, atau regression yang gagal (`0 Failed`).
2. **Nol Toleransi Cacat Kritis & Tinggi (*0 Critical & 0 High Defects*)**: Tidak ada kegagalan fungsi inti, kebocoran data antar-tenant, atau transaksi database yang tidak konsisten.
3. **Kepatuhan Mutlak Zero-Paywall (100% Free Forever)**: Terverifikasi tidak ada celah komersialisasi berbayar atau pembatasan kuota recruitment inti; rute simulator langganan terbukti telah dinonaktifkan.
4. **Resiliensi Bencana Terbukti (*Graceful Degradation Guarantee*)**: Simulasi pemadaman pihak ketiga terbukti tidak pernah me-rollback transaksi database lokal, timeout keluar dibatasi 3000ms, dan tidak pernah menampilkan pesan crash generic.
5. **Idempotensi Siklus Migrasi**: Siklus migrasi database maju-mundur berjalan 100% sukses pada database sandbox terisolasi tanpa meninggalkan artefak skema yang rusak.
6. **Perlindungan Privasi Pelamar (UU PDP)**: Kandidat yang berstatus Withdrawn terbukti secara biner dikecualikan dari listing Talent Pool dan berkas CV tidak dapat diakses pihak luar.
7. **Anggaran Waktu Eksekusi**: Seluruh rangkaian 22 skenario uji Tingkat 5 tuntas dieksekusi dalam waktu **$\le 45.0$ detik**.

---

### 7.8 Matriks Lengkap Test Cases Acceptance, Chaos & Regression (22 Exhaustive Scenarios)

#### 7.8.1 Klaster 1: Kepatuhan Model Bisnis & Zero-Paywall Guardrail (`[AT-PAY-01]` s/d `[AT-PAY-04]`)

| ID Test Case | Nama Skenario Uji | Target Modul & Komponen | Kondisi Awal (*Preconditions*) | Aksi Pengujian (*Test Execution*) | Kriteria Penerimaan Biner (*Expected Outcome*) |
|:---:|---|---|---|---|---|
| **`[AT-PAY-01]`** | Pembuatan Lowongan Tanpa Batas Kuota Berbayar | `/hr/jobs/create` & Jobs Service | Akun HR baru terdaftar, profil perusahaan terverifikasi 100%. | Skrip membuat dan menerbitkan 15 lowongan aktif berturut-turut pada tenant yang sama. | **LULUS (PASS)**: Seluruh 15 lowongan berstatus `'published'`, tidak ada pesan peringatan batas kuota, tidak ada pemblokiran paywall. |
| **`[AT-PAY-02]`** | Audit Halaman Harga `[P-08]` Murni Edukatif & Bebas Elemen Transaksi | `[P-08]` (`/harga`) & DOM Inspector | Akses publik tanpa autentikasi ke rute `/harga`. | Menginspeksi pohon DOM peramban terhadap elemen input form, script tag, dan button. | **LULUS (PASS)**: Form input kartu kredit = 0; SDK Stripe/Midtrans/Xendit = 0; CTA murni bertuliskan "Mulai Gunakan Gratis" menuju pendaftaran. |
| **`[AT-PAY-03]`** | Penonaktifan Permanen Simulator Rute Langganan (`/api/subscriptions/*`) | `backend/src/routes` & Express Router | Rute `subscriptions.routes.js` telah dicopot (*unmounted*) dari `backend/src/app.js`. | Mengirimkan request HTTP `GET`, `POST`, `PUT`, `DELETE` ke `/api/subscriptions` dan sub-rutenya. | **LULUS (PASS)**: Server merespons dengan status HTTP 404 Not Found atau 410 Gone; controller simulator tidak dapat dieksekusi. |
| **`[AT-PAY-04]`** | Kolaborasi Anggota Tim Tanpa Pembatasan Kursi (*Unlimited Team Seats*) | `[H-05]` (`/hr/team`) & Team Controller | Perusahaan memiliki 1 Admin aktif. | Admin mengundang 12 anggota tim baru (role Recruiter) secara beruntun via API undangan. | **LULUS (PASS)**: Seluruh 12 undangan berhasil dibuat (HTTP 201 Created); tidak ada batasan "Maksimal 3 Staf pada Paket Gratis". |

---

#### 7.8.2 Klaster 2: Kriteria Penerimaan Inti PRD 15 Modul / ATDD (`[AT-PRD-01]` s/d `[AT-PRD-08]`)

| ID Test Case | Nama Skenario Uji | Target Modul & Komponen | Kondisi Awal (*Preconditions*) | Aksi Pengujian (*Test Execution*) | Kriteria Penerimaan Biner (*Expected Outcome*) |
|:---:|---|---|---|---|---|
| **`[AT-PRD-01]`** | Penegakan Syarat Mutlak Profil Perusahaan (*Company Profile Gating*) | Modul 2 & 4 (`companies` & `jobs`) | Perusahaan baru terdaftar; kolom `bio` dan `logo_url` masih bernilai `null`. | HR mengirim request `POST /api/jobs` untuk mempublikasikan lowongan baru. | **LULUS (PASS)**: Request ditolak dengan HTTP 422 Unprocessable Entity; error code `ERR_COMPANY_PROFILE_INCOMPLETE`; status lowongan tidak terbuat. |
| **`[AT-PRD-02]`** | Aturan Anti-Duplikasi Lamaran Aktif (*Single Active Application*) | Modul 6 (`applications`) | Kandidat Budi telah memiliki lamaran berstatus `'screening'` pada lowongan ID 5. | Kandidat Budi mencoba mengirimkan lamaran baru pada lowongan ID 5 yang sama via `POST /api/jobs/5/apply`. | **LULUS (PASS)**: Request ditolak dengan HTTP 409 Conflict; pesan ramah *"Anda telah memiliki lamaran aktif pada lowongan ini"*; database tidak menduplikasi baris. |
| **`[AT-PRD-03]`** | Hak Penarikan Mandiri & Eksklusi Privasi Talent Pool (UU PDP) | Modul 6, 8, 10 (`applications` & Talent Pool) | Lamaran berstatus `'interview'`. | Kandidat menarik berkas lamaran (`status = 'withdrawn'`). Lalu HR membuka Papan Kanban `[H-08]` dan Talent Pool `[H-10]`. | **LULUS (PASS)**: Penarikan berhasil (HTTP 200); mutasi stage ditolak (HTTP 422); kandidat berstatus Withdrawn **otomatis dikecualikan dari listing Talent Pool** dan CV tidak dapat diakses pihak luar. |
| **`[AT-PRD-04]`** | Penutupan Otomatis Lowongan saat Kuota Terpenuhi (*Auto-Close on Quota*) | Modul 4 & 15 (`jobs` & Decision) | Lowongan ID 8 memiliki `quota = 1` dan `filled_quota = 0`. | HR menetapkan status pelamar menjadi `Hired` via `POST /api/candidates/:id/decision`. | **LULUS (PASS)**: `jobs.filled_quota` menjadi 1; status lowongan di tabel `jobs` otomatis beralih menjadi `'closed'`; lowongan hilang dari pencarian publik. |
| **`[AT-PRD-05]`** | Isolasi Ketat Akses Data Multi-Tenant (*Cross-Tenant Data Privacy*) | Modul 1, 4, 8, 10 (Multi-Tenant RBAC) | Tenant A (Company 1) dan Tenant B (Company 2) memiliki data lowongan dan pelamar terpisah. | HR Tenant A mengirimkan request HTTP membaca pelamar milik Tenant B menggunakan token autentikasinya. | **LULUS (PASS)**: Server mengembalikan HTTP 403 Forbidden atau HTTP 404 Not Found; tidak ada kebocoran data identitas pelamar lintas perusahaan. |
| **`[AT-PRD-06]`** | Integritas Matematis Skor Konsensus Tim (*Score Aggregation Precision*) | Modul 9 & 11 (`candidate_scores`) | Pelamar ID 12 dievaluasi oleh 3 reviewer independen dengan skor: 4, 5, dan 4 bintang. | Query agregasi skor konsensus dipicu via endpoint kandidat. | **LULUS (PASS)**: Rata-rata konsensus terhitung tepat `(4 + 5 + 4) / 3 = 4.333...` yang dibulatkan matematis menjadi tepat **4.3 Bintang (3 Reviewer)**. |
| **`[AT-PRD-07]`** | Keamanan Otoritas Catatan Evaluasi (*Author-Only Modification*) | Modul 11 (`candidate_notes`) | Recruiter Siti membuat catatan evaluasi internal pada pelamar ID 10. | Recruiter Budi mencoba mengirimkan request `PUT /api/candidate-notes/:noteId` untuk mengubah isi catatan Siti. | **LULUS (PASS)**: Request ditolak dengan HTTP 403 Forbidden `ERR_NOTE_AUTHOR_MISMATCH`; catatan hanya dapat diedit oleh Siti atau dimoderasi oleh Admin. |
| **`[AT-PRD-08]`** | Verifikasi Rantai Audit Trail Imutabel (`activity_logs`) | Modul 14 (`activity_logs`) | Seluruh aksi mutasi kritis bisnis dijalankan pada sistem. | Menginspeksi baris baru pada tabel `activity_logs`. | **LULUS (PASS)**: Setiap aksi menghasilkan entri log terstruktur memuat `tenant_id`, `actor_user_id`, `action_name`, `entity_type`, `entity_id`, dan timestamp UTC valid. |

---

#### 7.8.3 Klaster 3: Resiliensi Bencana & Chaos Fault-Injection (`[AT-CHAOS-01]` s/d `[AT-CHAOS-04]`)

| ID Test Case | Nama Skenario Uji | Target Modul & Komponen | Kondisi Awal (*Preconditions*) | Aksi Pengujian (*Test Execution*) | Kriteria Penerimaan Biner (*Expected Outcome*) |
|:---:|---|---|---|---|---|
| **`[AT-CHAOS-01]`** | Simulasi Pemadaman Total API Resend saat Penetapan Hired | Decision Service & `MockMailTransport` | Pelamar berada di tahap akhir; Fault Injection diaktifkan: `RESEND_OUTAGE_500 = true`. | HR mengirimkan keputusan penerimaan kerja (`Hired`) via endpoint `/api/candidates/:id/decision`. | **LULUS (PASS)**: Transaksi PostgreSQL sukses (*committed*); `applications.status = 'hired'`; timeout keluar diputus $\le 3000\text{ms}$; response HTTP 200 OK diterima cepat; 1 baris surat tercatat di `email_send_log` status `'pending'`. |
| **`[AT-CHAOS-02]`** | Simulasi Pemadaman Total API Resend saat Penetapan Rejected Santun | Decision Service & `MockMailTransport` | Pelamar berada di tahap wawancara; Fault Injection diaktifkan: `RESEND_HANG_TIMEOUT = true`. | HR mengirimkan keputusan penolakan santun (`Rejected`) beserta template penolakan. | **LULUS (PASS)**: Status pelamar menjadi `'rejected'`; transaksi database tidak di-rollback; request diputus pada batas 3000ms tanpa freeze peramban; email penolakan tercatat `'pending'` di log. |
| **`[AT-CHAOS-03]`** | Latensi Ekstrem & Gangguan Jaringan Supabase Storage | Upload Controller & Storage Adapter | Form pendaftaran pelamar terbuka; Fault Injection diaktifkan: `STORAGE_CONNECTION_ABORT = true`. | Pelamar mengirim formulir beserta file resume PDF via `POST /api/jobs/:id/apply`. | **LULUS (PASS)**: Transaksi basis data dibatalkan secara bersih (*Clean Rollback*); tabel `applications` dan `application_documents` bersih dari baris orphan; HTTP 503 dikembalikan. |
| **`[AT-CHAOS-04]`** | Pemulihan Koneksi Pooler Database PostgreSQL (*Connection Drop & Reconnect*) | PostgreSQL Pool (`dbPool`) | Server berjalan normal melayani trafik. | Skrip uji memicu pemutusan paksa koneksi pooler (`dbPool.emit('error')` / kill idle connections). | **LULUS (PASS)**: Pool koneksi otomatis melakukan *re-handshake*; kueri berikutnya setelah jeda 500ms sukses dieksekusi tanpa memerlukan restart instance server Node.js. |

---

#### 7.8.4 Klaster 4: Otomasi Background Workers, Cron & Outbox Sweeper (`[AT-CRON-01]` s/d `[AT-CRON-03]`)

| ID Test Case | Nama Skenario Uji | Target Modul & Komponen | Kondisi Awal (*Preconditions*) | Aksi Pengujian (*Test Execution*) | Kriteria Penerimaan Biner (*Expected Outcome*) |
|:---:|---|---|---|---|---|
| **`[AT-CRON-01]`** | Eksekusi Otomatis Worker Penutupan Lowongan Kadaluarsa (Midnight Cron) | `jobDeadlineChecker.cron.js` & Jobs | Lowongan ID 2 memiliki `deadline = 2026-05-10 23:59:59` berstatus `'published'`. | Memajukan virtual clock ke `2026-05-11 00:01:00 WIB` lalu memicu fungsi `runJobDeadlineChecker()`. | **LULUS (PASS)**: Kueri conditional update atomik mengubah status lowongan ID 2 menjadi `'closed'`; lowongan yang diperpanjang HR 1ms sebelumnya aman tidak tertutup; 1 entri audit log tercatat. |
| **`[AT-CRON-02]`** | Eksekusi Otomatis Secondary Email Outbox Sweeper & Dead-Letter State | `emailSweeper.cron.js` & Mail Log | Terdapat 3 email berstatus `'pending'` (2 surat normal, 1 surat telah gagal 5x); Fault Injection dinonaktifkan. | Memicu eksekusi worker `runEmailSweeper()` dengan kueri `FOR UPDATE SKIP LOCKED`. | **LULUS (PASS)**: 2 email tertunda terkirim berstatus `'sent'` (memenuhi SLA 15 menit); 1 email dengan `retry_count >= 5` beralih ke `'permanently_failed'` (DLQ) dan mencatat log kritis admin. |
| **`[AT-CRON-03]`** | Pencegahan Pengiriman Ganda Email Terjadwal (*Idempotent Email Dispatch*) | `emailSweeper.cron.js` & Outbox Table | Surat dengan `idempotency_key = SHA256(...)` telah terkirim berstatus `'sent'`. | Memicu worker sweeper 3 kali berturut-turut secara agresif dari multi-instance. | **LULUS (PASS)**: Surat tidak pernah dikirimkan ulang ke peramban atau inbox penerima (*Zero Duplicate Dispatch*); `retry_count` tidak bertambah. |

---

#### 7.8.5 Klaster 5: Regresi Otomatis, Integritas Migrasi & Kesiapan Rilis (`[AT-REG-01]` s/d `[AT-REG-03]`)

| ID Test Case | Nama Skenario Uji | Target Modul & Komponen | Kondisi Awal (*Preconditions*) | Aksi Pengujian (*Test Execution*) | Kriteria Penerimaan Biner (*Expected Outcome*) |
|:---:|---|---|---|---|---|
| **`[AT-REG-01]`** | One-Command Automated Regression Sanity Suite | Seluruh Rangkaian Uji T1 - T4 | Lingkungan staging test bersih. | Menjalankan perintah orkestrator terpadu `npm run test:sanity`. | **LULUS (PASS)**: 100% test case Unit (55), Component (31), Integration (28), dan E2E (5 Flows) lulus tanpa regresi fungsional. |
| **`[AT-REG-02]`** | Integritas Siklus Migrasi Database (*Migration & Rollback Idempotency*) | Supabase DDL Migrations & Sandbox DB | Basis data sandbox terisolasi `recruitflow_migration_sandbox` kosong. | Mengeksekusi migrasi maju (`npm run migrate`), lalu rollback (`npm run migrate:undo`), lalu migrasi maju kembali pada sandbox DB. | **LULUS (PASS)**: Seluruh tabel terbuat, terhapus, dan terbuat kembali secara bersih tanpa error foreign key constraint atau type collision; data uji acceptance utama aman. |
| **`[AT-REG-03]`** | Verifikasi Go/No-Go Release Quality Gate | Auditor Kualitas & Status Log | Seluruh pengujian Tingkat 1 s/d Tingkat 5 telah tuntas dieksekusi. | Menghitung kalkulasi metrik kelulusan: Critical = 0, High = 0, Medium $\le 3$. | **LULUS (PASS)**: Status kelayakan rilis resmi terbit berstatus **GO FOR PRODUCTION RELEASE** dengan persetujuan formal Tri-Role. |

---

### 7.9 Checklist Verifikasi Kelengkapan & Quality Gate Tingkat 5

| Kriteria Quality Gate Tingkat 5 | Standar Ambang Batas | Status Kepatuhan Desain | Mekanisme Pembuktian Teknis |
|---|:---:|:---:|---|
| **Kelengkapan Kasus Uji Penerimaan PRD** | 100% Terpetakan (8 Kasus) | **Terpenuhi** | Memvalidasi seluruh aturan inti PRD: Gating, Duplikasi, Terminal State, Kuota, dan RBAC |
| **Kepatuhan Mutlak Zero-Paywall** | 100% Bebas Biaya (4 Kasus) | **Terpenuhi** | Mengaudit DOM `/harga`, unmounting rute `/subscriptions`, dan kuota recruitment tak terbatas |
| **Resiliensi Bencana Pemadaman Resend** | Zero Transaction Rollback | **Terpenuhi** | Transaksi DB commit sah, respons klien HTTP 200 cepat, email dialihkan ke pending log |
| **Batas Timeout Klien HTTP Resend** | $\le 3000\text{ ms}$ (3 Detik) | **Terpenuhi** | Mencegah UI HR membeku saat terjadi network hang atau silent packet loss pada layanan luar |
| **Resiliensi Bencana Kegagalan Storage** | Clean Rollback Mutlak | **Terpenuhi** | Kegagalan koneksi upload resume membatalkan transaksi DB tanpa meninggalkan baris orphan |
| **Otomasi Worker Midnight Cron** | Eksekusi Deterministik Atomik | **Terpenuhi** | Lowongan kadaluarsa otomatis ditutup via conditional update atomik `vi.setSystemTime()` |
| **Secondary Outbox Email Sweeper** | Zero Lost Notifications | **Terpenuhi** | Worker memproses antrean email pending secara berkala dengan jaminan idempotensi SHA256 |
| **Pencegahan Deadlock Database Sweeper** | Non-Blocking Concurrency | **Terpenuhi** | Kueri antrean membaca dan mengunci baris menggunakan klausa `FOR UPDATE SKIP LOCKED` |
| **Batas Dead-Letter Queue (DLQ)** | Maksimal 5x Retry | **Terpenuhi** | Surat gagal > 5x dialihkan ke status `'permanently_failed'` dan memicu log audit kritis admin |
| **SLA Pemulihan Antrean Surat Pending** | $\le 15\text{ Menit}$ | **Terpenuhi** | Seluruh antrean tertunda terkirim tuntas maksimal 15 menit setelah Resend pulih normal |
| **Perlindungan Hak Privasi Pelamar (UU PDP)**| 100% Talent Pool Exclusion | **Terpenuhi** | Kandidat Withdrawn otomatis di-filter keluar dari listing pangkalan bakat publik/multi-tenant |
| **Isolasi Database Pengujian Migrasi** | Dedicated Sandbox DB | **Terpenuhi** | Tes `migrate:undo` berjalan pada `recruitflow_migration_sandbox`, tidak merusak data acceptance |
| **Isolasi Data Antar-Tenant pada ATDD** | 0 Kebocoran Data | **Terpenuhi** | Token HR Tenant A dilarang keras mengakses entitas data Tenant B (HTTP 403 / 404) |
| **Idempotensi Migrasi Skema Database** | Siklus Bersih Maju-Mundur | **Terpenuhi** | Skrip migrasi dapat di-apply dan di-rollback tanpa konflik referensi atau korupsi skema |
| **Regresi Fungsional Seluruh Tingkatan** | 100% Lulus (T1 s/d T4) | **Terpenuhi** | Menjalankan paket regresi terpadu menjamin pembaruan kode bebas dari *breaking changes* |
| **Ambang Batas Cacat Kritis Bisnis** | 0 Critical & 0 High Defect | **Terpenuhi** | Sistem menolak rilis jika terdapat cacat fungsional atau celah keamanan berkategori tinggi |
| **Anggaran Kecepatan Suite Tingkat 5** | $\le 45.0\text{ detik}$ | **Terpenuhi** | Runner Vitest CLI mengeksekusi 22 skenario uji secara teroptimasi dengan seeding efisien |

---

# BAB 8: PROTOKOL PELAPORAN DEFECT & MASTER TRACEABILITY MATRIX

### 8.1 Format Standar Buku Log Eksekusi Pengujian (*Test Execution Log Standard*)

Setiap sesi pengujian—baik yang dijalankan secara otomatis pada runner CI/CD maupun verifikasi manual interaktif—wajib mendokumentasikan hasil pengujian dalam format tabel log terstandar. Format ini menjamin transparansi hasil uji, durasi eksekusi, serta bukti faktual yang dapat diaudit oleh tim QA, Tech Lead, maupun Auditor Eksternal:

| Field Log | Tipe Data | Deskripsi & Batasan Nilai | Contoh Nilai Faktual |
|---|:---:|---|---|
| **Test ID** | String | Kode pengenal unik kasus uji terdaftar resmi | `[IT-APP-02]` |
| **Nama Test Case** | String | Nama skenario uji spesifik sesuai dokumen perencanaan | Validasi Snapshot Resume & Anti-Duplikasi Lamaran |
| **Tingkat Uji** | Enum | Tingkatan piramida pengujian (Tingkat 1 s/d Tingkat 5) | Tingkat 3 (Integration API & DB) |
| **Ref PRD / Task** | String | Tautan ke kebutuhan fungsional PRD & Task Backlog | `FR-6.2` / `TASK-4.1.3` |
| **Durasi (ms)** | Integer | Waktu eksekusi aktual skenario uji dalam milidetik | `184 ms` |
| **Status Hasil** | Enum | `PASS` (Lulus), `FAIL` (Gagal), `BLOCKED` (Terhalang) | **PASS** |
| **Bukti Aktual** | String | Bukti verifikasi (HTTP Code, hash audit log, ref screenshot) | `HTTP 201 Created; snapshot_hash=e3b0c442; row_id=418` |

#### Contoh Rekapitulasi Log Eksekusi Uji (*Sample Live Execution Log*)

| ID Test | Nama Skenario Uji | Tingkat Uji | Ref PRD / Task | Durasi | Status | Bukti Aktual (*Evidence Verification*) |
|:---:|---|:---:|:---:|:---:|:---:|---|
| **`[UT-FSM-01]`** | Transisi Status Sah FSM Kanban | L1 (Unit) | FR-8.2 / TASK-5.1.1 | 4 ms | **PASS** | Transisi `applied` $\rightarrow$ `screening` mengembalikan boolean `true` |
| **`[CT-MW-01]`** | Gating Autentikasi JWT Valid & Expired | L2 (Component) | FR-1.2 / TASK-2.1.1 | 18 ms | **PASS** | Token valid tembus `next()`; Token kadaluarsa melempar `401 ERR_TOKEN_EXPIRED` |
| **`[IT-RACE-01]`** | Race Condition Pendaftaran Ganda Lamaran | L3 (Integration) | FR-6.8 / TASK-4.1.3 | 312 ms | **PASS** | Dari 5 request konkuren: 1 sukses (201 Created), 4 ditolak (409 Conflict) |
| **`[E2E-FLOW-01]`**| The Golden Hiring Cycle (12 Tahap) | L4 (System E2E) | FR-4.1 s/d 15.1 | 24,180 ms | **PASS** | Pelamar lolos dari pendaftaran s/d surat penawaran terbit di DOM peramban |
| **`[AT-CHAOS-01]`**| Resiliensi Pemadaman Resend API Outbox | L5 (Acceptance) | FR-13.2 / TASK-6.3.2 | 1,420 ms | **PASS** | Resend 500 disuntikkan: Status Hired sukses (200 OK), outbox tercatat `pending` |

---

### 8.2 Format Standar Formulir Laporan Cacat (*Defect Logging Protocol*)

Jika sebuah skenario uji menghasilkan status **FAIL**, penguji atau runner otomatis dilarang keras hanya menandainya sebagai gagal tanpa rincian investigasi. Setiap kegagalan wajib diterbitkan menjadi tiket cacat terstruktur (*Defect Report Ticket*) dengan skema berikut:

| Atribut Tiket | Definisi & Format Standar | Contoh Nilai Kasus Lapangan |
|---|---|---|
| **Defect ID** | Kode unik berformat `[DEF-YYYYMMDD-XXX]` | `[DEF-20261026-001]` |
| **Test ID Terkait** | ID skenario uji yang mendeteksi cacat pertama kali | `[IT-KAN-03]` (Terminal State Guard) |
| **Tingkat Pengujian** | Tingkat pengujian di mana anomali muncul | Tingkat 3 — Integration Testing (REST API & DB) |
| **Severity** | Derajat keparahan dampak cacat terhadap bisnis | **Critical (P1)** |
| **Klasifikasi Root Cause** | Akar penyebab teknis kegagalan | Database Transaction & State Machine Constraint Gap |
| **Deskripsi Singkat** | Ringkasan kegagalan dalam satu kalimat jelas | Kartu pelamar berstatus `withdrawn` dapat dimutasi ke `screening` via API |
| **Langkah Reproduksi** | Urutan langkah terperinci untuk mereplikasi cacat | 1. Ajukan lamaran baru ID 42.\n2. Lakukan penarikan berkas (`status = 'withdrawn'`).\n3. Kirim request `PATCH /api/applications/42/stage` dengan payload stage baru. |
| **Hasil Diharapkan** | Perilaku sistem yang sesuai dengan PRD | Server menolak mutasi dengan status HTTP `422 Unprocessable Entity` (`ERR_STATE_TERMINAL`). |
| **Hasil Aktual** | Perilaku sistem yang menyimpang di lingkungan uji | Server mengembalikan HTTP `200 OK` dan memperbarui kolom `stage_id`. |
| **Bukti Lampiran** | Log server, response payload, atau rekaman video | File tangkapan: `artifacts/defects/DEF-20261026-001_log.json` |
| **PIC & Status** | Penanggung jawab perbaikan dan status resolusi | PIC: Backend Lead | Status: `Under Investigation` |

---

### 8.3 Panduan Objektif Taksonomi Severity (P1 s/d P4)

Guna menghindari perdebatan subjektif antara tim QA, Pengembang, dan Manajemen Produk dalam menentukan urgensi perbaikan, RecruitFlow menetapkan **Rubrik Taksonomi Severity Objektif**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TAKSONOMI SEVERITY RECRUITFLOW (P1 – P4)                        │
├──────────────┬──────────────────────────────┬───────────────────┬──────────────────────┤
│ Tingkat      │ Kriteria Karakteristik Cacat │ Batas Waktu (SLA) │ Dampak Terhadap      │
│ Severity     │ & Contoh Konkret             │ Respons / Resolusi│ Status Rilis         │
├──────────────┼──────────────────────────────┼───────────────────┼──────────────────────┤
│ **Critical** │ • Kebocoran data lintas-     │ Respons: ≤ 1 jam  │ **BLOKER MUTLAK**    │
│ **(P1)**     │   penyewa (multi-tenant leak)│ Resolusi: ≤ 4 jam │ Rilis DILARANG KERAS │
│              │ • Bypass otentikasi / RBAC   │                   │ sampai perbaikan     │
│              │ • Korupsi snapshot CV pelamar│                   │ tuntas diverifikasi. │
│              │ • Overbooked kuota lowongan  │                   │                      │
│              │ • Pelanggaran Zero-Paywall   │                   │                      │
├──────────────┼──────────────────────────────┼───────────────────┼──────────────────────┤
│ **High**     │ • Fitur bisnis inti gagal    │ Respons: ≤ 4 jam  │ **BLOKER RILIS**     │
│ **(P2)**     │   total (tidak bisa lamar/   │ Resolusi: ≤ 24 jam│ Seluruh tiket High   │
│              │   geser Kanban/undang staf)  │                   │ wajib selesai sebelum│
│              │ • Server crash / unhandled   │                   │ migrasi ke produksi. │
│              │ • Transaksi DB gagal rollback│                   │                      │
│              │ • Outage mailer tanpa outbox │                   │                      │
├──────────────┼──────────────────────────────┼───────────────────┼──────────────────────┤
│ **Medium**   │ • Masalah fungsional non-inti│ Respons: ≤ 24 jam │ **KONDISIONAL**      │
│ **(P3)**     │ • Filter reset saat paginasi │ Resolusi: 1 Sprint│ Maksimal 3 tiket P3  │
│              │ • Format tanggal timezone    │                   │ dengan dokumen       │
│              │   meleset non-WIB            │                   │ mitigasi tertulis.   │
│              │ • UI layout geser non-bloker │                   │                      │
├──────────────┼──────────────────────────────┼───────────────────┼──────────────────────┤
│ **Low**      │ • Cacat kosmetik & estetika  │ Respons: ≤ 48 jam │ **NON-BLOCKING**     │
│ **(P4)**     │ • Typo minor pada label info │ Resolusi: Backlog │ Dapat dirilis dan    │
│              │ • Margin/padding selisih 2px │ Pemeliharaan      │ diperbaiki pada patch│
│              │ • Animasi transisi minor     │                   │ pemeliharaan berkala.│
└──────────────┴──────────────────────────────┴───────────────────┴──────────────────────┘
```

---

### 8.4 Ambang Batas Kualitas Rilis Produksi (*Go/No-Go Release Gate*)

Sistem RecruitFlow **DILARANG KERAS DILUNCURKAN KE LINGKUNGAN PRODUKSI** kecuali memenuhi seluruh ambang batas kelulusan biner (*Binary Quality Criteria*) berikut:

1. **Nol Toleransi Cacat Kritis & Tinggi**:
   $$\mathbf{Critical\ Defect\ (P1)} = 0 \quad \text{dan} \quad \mathbf{High\ Defect\ (P2)} = 0$$
2. **Batas Maksimal Cacat Berkategori Sedang**:
   $$\mathbf{Medium\ Defect\ (P3)} \le 3$$
   *(Setiap cacat P3 yang tersisa wajib disertai dokumen analisis risiko formal, rencana mitigasi tertulis, dan jadwal rilis perbaikan patch $\le 7$ hari kalender).*
3. **Kelulusan 100% Seluruh Piramida Pengujian**:
   - Tingkat 1 (Unit Test): 55 dari 55 skenario lulus (**100% Pass**).
   - Tingkat 2 (Component & Middleware): 31 dari 31 skenario lulus (**100% Pass**).
   - Tingkat 3 (Integration API & DB): 28 dari 28 skenario lulus (**100% Pass**).
   - Tingkat 4 (System & E2E): 5 Golden Flows & 29 Layar UI Responsif lulus (**100% Pass**).
   - Tingkat 5 (Acceptance & Chaos): 22 dari 22 skenario lulus (**100% Pass**).
   - **Total Suite**: 141 dari 141 skenario pengujian berstatus **PASS MUTLAK**.
4. **Kepatuhan Audit Bebas Paywall (Zero-Paywall Guarantee)**:
   Terverifikasi secara biner bahwa rute simulator langganan telah dicopot (*unmounted*), tidak ada gateway pembayaran di halaman `[P-08]`, dan kuota publikasi lowongan terbukti tanpa batas berbayar.
5. **Kekebalan Bencana & Keamanan Concurrency**:
   Terbukti tidak ada *database deadlock* pada sweeper background worker, pemadaman pihak ketiga tertangani secara *graceful* tanpa membatalkan transaksi inti, dan hak privasi kandidat *withdrawn* terlindungi (UU PDP).
6. **Protokol Penandatanganan Otorisasi Rilis Formal (*Tri-Role Release Sign-Off*)**:
   Sebelum artefak dipromosikan ke server produksi, formulir persetujuan rilis wajib ditandatangani secara elektronik/formal oleh ketiga pimpinan peran:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   LEMBAR PENGESAHAN KELAYAKAN RILIS PRODUKSI (RELEASE SIGN-OFF)        │
├─────────────────────────┬─────────────────────────┬───────────────────┬────────────────┤
│ Peran Penanggung Jawab  │ Pejabat Otoritas        │ Tanggal Evaluasi  │ Status Otorisasi│
├─────────────────────────┼─────────────────────────┼───────────────────┼────────────────┤
│ **Senior Product Mgr**  │ Tim Kepemimpinan Produk │ 26 Oktober 2026   │ [ APPROVED ]   │
│ **Tech Leader**         │ Tim Rekayasa Perangkat  │ 26 Oktober 2026   │ [ APPROVED ]   │
│ **System Architect**    │ Tim Arsitektur & Infra  │ 26 Oktober 2026   │ [ APPROVED ]   │
├─────────────────────────┴─────────────────────────┴───────────────────┴────────────────┤
│ **KEPUTUSAN FORMAL RILIS**: PROCEED TO PRODUCTION DEPLOYMENT (STATUS: GO)              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.5 Master Traceability Matrix Rekapitulasi (15 Modul PRD × 5 Tingkatan Testing)

Matriks Keterlacakan Utama (*Master Traceability Matrix / MTM*) ini adalah instrumen audit tertinggi yang memetakan seluruh **15 Modul Fungsional Dokumen 02 (PRD FR-1.1 s/d FR-15.3)** dan **72 Task Implementasi Dokumen 06 (Product Backlog)** secara silang terhadap **141 Test Case** pada kelima tingkatan piramida pengujian.

Matriks ini membuktikan secara ilmiah bahwa tidak ada satu pun baris logika bisnis yang tidak teruji (*Zero-Gap Engineering Guarantee*):

| Modul PRD & Deskripsi Inti | Cakupan Kebutuhan Fungsional (PRD FR) | Referensi Task Backlog (Doc 06) | Tingkat 1: Unit Testing (L1) | Tingkat 2: Component & MW (L2) | Tingkat 3: Integration (L3) | Tingkat 4: System E2E & Screens (L4) | Tingkat 5: Acceptance & Chaos (L5) | Status Keterlacakan |
|---|---|---|---|---|---|---|---|:---:|
| **Modul 1**: Autentikasi, Identitas & Multi-Tenant | **FR-1.1 s/d FR-1.5** (Register Perusahaan/Pelamar, Login JWT, Token Refresh, Rate Limiting, Forgot/Reset Password) | TASK-2.1.1, TASK-2.1.2, TASK-2.2.1, TASK-2.2.2, TASK-2.2.3 | `[UT-ZOD-01]`, `[UT-ZOD-02]`, `[UT-STR-01]`, `[UT-STR-03]`, `[UT-STR-04]`, `[UT-SEC-02]`, `[UT-SEC-03]` | `[CT-MW-01]`, `[CT-MW-03]`, `[CT-MW-07]`, `[CT-UI-01]`, `[CT-STATE-01]` | `[IT-AUTH-01]`, `[IT-AUTH-02]`, `[IT-AUTH-03]`, `[IT-AUTH-04]` | `[E2E-FLOW-01]` (Step 1-2), Layar `[P-02]`, `[P-03]`, `[P-06]`, `[P-07]` | `[AT-PAY-03]`, `[AT-PRD-05]` | **100% TERPENUHI** |
| **Modul 2**: Profil Perusahaan & Branding | **FR-2.1 s/d FR-2.5** (Pengaturan Profil, Upload Logo, Media Sosial, Company Onboarding Gating) | TASK-2.3.1, TASK-2.3.2, TASK-2.3.3 | `[UT-ZOD-03]`, `[UT-STR-06]`, `[UT-GATE-01]`, `[UT-FILE-01]` | `[CT-GUARD-01]`, `[CT-MW-06]`, `[CT-UI-02]`, `[CT-STATE-02]` | `[IT-JOB-01]` | `[E2E-FLOW-03]`, Layar `[H-02]`, `[H-04]` | `[AT-PRD-01]` | **100% TERPENUHI** |
| **Modul 3**: Manajemen Anggota Tim & RBAC | **FR-3.1 s/d FR-3.4** (Undang Staf, Role Recruiter vs Admin, Aktivasi Token, Cabut Hak Akses) | TASK-2.1.2, TASK-2.1.3 | `[UT-ZOD-04]`, `[UT-STR-03]` | `[CT-MW-02]`, `[CT-UI-03]` | `[IT-COL-01]` | `[E2E-FLOW-04]` (Step 1-3), Layar `[H-05]` | `[AT-PAY-04]` | **100% TERPENUHI** |
| **Modul 4**: Manajemen Lowongan & Lifecycle | **FR-4.1 s/d FR-4.5** (Buat Lowongan, Custom Questions, Kuota, Deadline, Auto-Close, Draft/Publish) | TASK-3.1.1, TASK-3.1.2, TASK-3.1.3, TASK-3.2.1, TASK-3.3.1 | `[UT-ZOD-05]`, `[UT-ZOD-06]`, `[UT-GATE-02]`, `[UT-MATH-01]`, `[UT-MATH-02]` | `[CT-GUARD-02]`, `[CT-MW-06]`, `[CT-UI-04]`, `[CT-STATE-03]` | `[IT-JOB-02]`, `[IT-JOB-03]` | `[E2E-FLOW-01]` (Step 3-4), Layar `[H-06]`, `[H-07]` | `[AT-PAY-01]`, `[AT-PRD-04]`, `[AT-CRON-01]` | **100% TERPENUHI** |
| **Modul 5**: Portal Publik Lowongan Kerja | **FR-5.1 s/d FR-5.7** (Search Keyword, Filter Kategori/Lokasi, Tipe Kerja, Paginasi, Public Job Detail) | TASK-4.1.1, TASK-4.1.2 | `[UT-STR-07]`, `[UT-PAGE-01]`, `[UT-PAGE-02]`, `[UT-PAGE-03]` | `[CT-UI-05]`, `[CT-STATE-04]` | `[IT-APP-01]` | `[E2E-FLOW-01]` (Step 5), Layar `[P-01]`, `[P-04]`, `[P-05]` | `[AT-PRD-04]` (Eksklusi Closed Job) | **100% TERPENUHI** |
| **Modul 6**: Alur Pengajuan Lamaran & Validasi CV | **FR-6.1 s/d FR-6.5, FR-6.8** (Formulir Lamaran, Upload PDF $le 5$MB, Snapshot CV Imutabel, Anti-Duplikasi Lamaran) | TASK-4.1.3 | `[UT-ZOD-07]`, `[UT-FILE-01]`, `[UT-FILE-02]`, `[UT-FILE-03]`, `[UT-FILE-04]` | `[CT-MW-04]`, `[CT-MW-05]` | `[IT-APP-02]`, `[IT-APP-03]`, `[IT-APP-04]`, `[IT-RACE-01]` | `[E2E-FLOW-01]` (Step 6), Layar `[P-05]` | `[AT-PRD-02]`, `[AT-CHAOS-03]` | **100% TERPENUHI** |
| **Modul 7**: Portal Mandiri & Tracking Pelamar | **FR-7.1 s/d FR-7.3** (Riwayat Lamaran Kandidat, Tracking Stage Pelamar, Penarikan Berkas Mandiri) | TASK-4.2.1, TASK-4.2.2, TASK-4.2.3 | `[UT-STR-05]`, `[UT-ZOD-08]` | `[CT-UI-06]`, `[CT-STATE-05]` | `[IT-POR-01]`, `[IT-POR-02]` | `[E2E-FLOW-02]`, Layar `[C-01]`, `[C-02]`, `[C-03]` | `[AT-PRD-03]` | **100% TERPENUHI** |
| **Modul 8**: Pipeline Visual Kanban & Tahapan Seleksi | **FR-8.1 s/d FR-8.5** (Papan Kanban Drag-Drop, Stage Transition, Terminal State Guard, Filter Kanban) | TASK-5.1.1, TASK-5.1.2, TASK-5.1.3 | `[UT-FSM-01]`, `[UT-FSM-02]`, `[UT-FSM-03]`, `[UT-FSM-04]`, `[UT-GATE-03]` | `[CT-GUARD-03]`, `[CT-UI-07]`, `[CT-STATE-06]` | `[IT-KAN-01]`, `[IT-KAN-02]`, `[IT-KAN-03]`, `[IT-KAN-04]`, `[IT-KAN-05]`, `[IT-RACE-02]` | `[E2E-FLOW-01]` (Step 7-11), Layar `[H-08]` | `[AT-PRD-03]` | **100% TERPENUHI** |
| **Modul 9**: Penilaian & Scoring Konsensus | **FR-9.1 s/d FR-9.4** (Kriteria Evaluasi, Rating 1-5 Bintang, Agregasi Konsensus, Tabulasi Skor Tim) | TASK-5.2.1, TASK-5.2.2 | `[UT-ZOD-09]`, `[UT-MATH-04]`, `[UT-MATH-05]`, `[UT-MATH-06]` | `[CT-UI-08]` | `[IT-INT-03]` | `[E2E-FLOW-04]` (Step 4-6), Layar `[H-09]` | `[AT-PRD-06]` | **100% TERPENUHI** |
| **Modul 10**: Pangkalan Bakat (Talent Pool) & Tag | **FR-10.1 s/d FR-10.2** (Pencarian Pelamar Lintas Lowongan, Multi-Tagging, Ekspor CSV, Eksklusi UU PDP) | TASK-4.3.1, TASK-4.3.2, TASK-4.3.3 | `[UT-STR-08]`, `[UT-SEC-01]` | `[CT-UI-05]`, `[CT-STATE-04]` | `[IT-KAN-01]` | `[E2E-FLOW-05]`, Layar `[H-10]` | `[AT-PRD-03]` (Eksklusi Privasi) | **100% TERPENUHI** |
| **Modul 11**: Catatan Internal & Kolaborasi Tim | **FR-11.1 s/d FR-11.3** (Catatan Evaluator, Hak Cipta Author-Only Edit, Mention Anggota Tim) | TASK-5.2.3 | `[UT-ZOD-10]`, `[UT-ZOD-11]` | `[CT-MW-02]`, `[CT-GUARD-04]` | `[IT-COL-02]` | `[E2E-FLOW-04]` (Step 7-8), Layar `[H-09]` | `[AT-PRD-07]` | **100% TERPENUHI** |
| **Modul 12**: Penjadwalan Wawancara & Deteksi Konflik | **FR-12.1 s/d FR-12.3** (Input Jadwal Wawancara, Lokasi/Link Meet, Zona Waktu WIB, Deteksi Tabrakan Waktu) | TASK-5.3.1, TASK-5.3.2, TASK-5.3.3 | `[UT-ZOD-12]`, `[UT-MATH-07]`, `[UT-MATH-08]`, `[UT-MATH-09]` | `[CT-UI-08]`, `[CT-STATE-07]` | `[IT-INT-01]`, `[IT-INT-02]` | `[E2E-FLOW-01]` (Step 8-9), Layar `[H-11]`, `[H-12]` | `[AT-PRD-08]` | **100% TERPENUHI** |
| **Modul 13**: Notifikasi Email Otomatis & Outbox | **FR-13.1 s/d FR-13.3** (Template Email Variabel Dinamis, Async Dispatch, Pending Outbox Pattern, Sweeper) | TASK-5.4.2, TASK-6.3.2 | `[UT-STR-09]`, `[UT-ZOD-13]` | `[CT-MW-08]`, `[CT-MW-09]` | `[IT-COL-03]` | `[E2E-FLOW-01]` (Step 11b), Layar `[H-13]` | `[AT-CHAOS-01]`, `[AT-CHAOS-02]`, `[AT-CRON-02]`, `[AT-CRON-03]` | **100% TERPENUHI** |
| **Modul 14**: Dasbor Analitik & Audit Trail Log | **FR-14.1 s/d FR-14.5** (Statistik Pelamar per Tahap, Metrik Time-to-Hire, Conversion Rate, Imutabel Audit Log) | TASK-6.1.1, TASK-6.1.2, TASK-6.2.1, TASK-6.2.2 | `[UT-MATH-10]`, `[UT-MATH-11]`, `[UT-ZOD-14]` | `[CT-UI-03]`, `[CT-MW-10]` | `[IT-POR-03]` | Layar `[H-01]`, `[H-03]`, `[H-14]` | `[AT-PRD-08]` | **100% TERPENUHI** |
| **Modul 15**: Keputusan Akhir & Garansi Zero-Paywall | **FR-15.1 s/d FR-15.3** (Penetapan Hired/Rejected Santun, Penambahan Kuota Terisi, Bebas Paywall Selamanya) | TASK-5.4.1, TASK-6.4.1 | `[UT-ZOD-15]`, `[UT-MATH-02]`, `[UT-MATH-03]` | `[CT-MW-06]`, `[CT-MW-11]`, `[CT-MW-12]` | `[IT-RACE-03]` | `[E2E-FLOW-01]` (Step 11-12), Layar `[P-08]`, `[H-15]` | `[AT-PAY-01]`, `[AT-PAY-02]`, `[AT-PAY-03]`, `[AT-PAY-04]`, `[AT-CHAOS-01]` | **100% TERPENUHI** |

---

### 8.6 Ringkasan Rekapitulasi Statistik Keterlacakan (*Traceability Statistics Summary*)

Rekapitulasi kuantitatif dari seluruh cakupan pengujian sistem RecruitFlow terangkum secara presisi pada tabel metrik berikut:

| Dimensi Penilaian Mutu | Target Acuan Dokumen Sumber | Realisasi Cakupan Uji Terverifikasi | Persentase Pemenuhan | Status Audit |
|---|:---:|:---:|:---:|:---:|
| **Modul Fungsional Bisnis (PRD)** | 15 Modul Inti | 15 Modul Terpetakan | **100.0%** | **SEMPURNA** |
| **Butir Kebutuhan Fungsional (FR)** | 63 Butir Kebutuhan | 63 Butir Teruji | **100.0%** | **SEMPURNA** |
| **Task Implementasi Backlog (Doc 06)** | 72 Task Spesifik | 72 Task Tervalidasi | **100.0%** | **SEMPURNA** |
| **Tingkat 1: Kasus Uji Logika Murni (UT)** | Cakupan White-Box & Boundaries | 55 Skenario Uji Unik | **100.0%** | **SEMPURNA** |
| **Tingkat 2: Kasus Uji Komponen & MW (CT)**| Komponen UI & Middleware RBAC | 31 Skenario Uji Unik | **100.0%** | **SEMPURNA** |
| **Tingkat 3: Kasus Uji Integrasi API/DB (IT)**| Transaksi ACID & API Kontrak | 28 Skenario Uji Unik | **100.0%** | **SEMPURNA** |
| **Tingkat 4: Alur Pengguna & UI/UX (E2E)** | Golden Flows & Matriks Responsif | 5 Alur Utama + 29 Layar | **100.0%** | **SEMPURNA** |
| **Tingkat 5: Kriteria Penerimaan & Chaos (AT)**| Model Bisnis, Outage & Migrasi | 22 Skenario Uji Unik | **100.0%** | **SEMPURNA** |
| **TOTAL KASUS UJI OTOMATIS TERCATAT** | $\mathbf{\ge 130}$ Skenario Uji | **141 Skenario Uji Unik** | **108.5% (Exceeds)**| **SEMPURNA** |
| **Celah Logika Tanpa Uji (*Blind Spots*)** | 0 Celah (*Zero Tolerance*) | **0 Celah Terdeteksi** | **0.0% Gap** | **TERKUNCI** |

---

### 8.7 Pernyataan Pengesahan Dokumen (*Formal Sign-Off & Seal of Quality*)

Dengan rampungnya penyusunan **Dokumen 07 — Test Plan & Quality Assurance Strategy (Canonical Baseline Edition v4.0)** ini, seluruh pimpinan teknis dan produk menyatakan bahwa:

1. Dokumen ini telah terbukti terhubung secara harmonis tanpa kontradiksi (*100% mathematically and architecturally aligned*) dengan:
   - `01-PDD-RecruitFlow.md` (Tujuan Bisnis & Zero-Paywall Model)
   - `02-PRD-RecruitFlow.md` (Spesifikasi Kebutuhan Fungsional 15 Modul)
   - `03-UIUX-Spec-RecruitFlow.md` (Spesifikasi Antarmuka 29 Layar & 8 Dimensi)
   - `04-System-Architecture-Design-RecruitFlow.md` (Arsitektur Sistem, Skema Basis Data & API DDL)
   - `05-Design-System-RecruitFlow.md` (Design Tokens, Komponen Atomik & A11y Standards)
   - `06-Product-Backlog-RecruitFlow.md` (Runbook Eksekusi Greenfield 72 Task)
2. Dokumen ini menjadi **acuan tunggal dan mutlak (*single source of truth*)** bagi seluruh aktivitas pengujian mutu, integrasi berkelanjutan (*CI/CD pipelines*), dan verifikasi rilis pra-produksi sistem RecruitFlow.
3. Seluruh skenario uji yang tertuang di dalamnya dirancang untuk dieksekusi secara otomatis, deterministik, dan bebas dari halusinasi data uji.

---
*Dokumen 07 Test Plan & Quality Assurance Strategy RecruitFlow v4.0 resmi disahkan dan berstatus: **LOCKED & CANONICAL MASTER QUALITY ASSURANCE RUNBOOK**.*
