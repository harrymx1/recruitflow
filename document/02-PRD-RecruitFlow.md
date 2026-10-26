# Product Requirements Document (PRD)
## RecruitFlow — Recruitment Management System

*Dokumen ini merupakan turunan dari Product Definition Document (PDD) dan menjadi acuan detail fitur untuk tahap UI/UX Specification, System Design, serta Perancangan Test Plan.*

*Versi 4.0 — Disempurnakan secara komprehensif untuk mengeliminasi ambiguitas teknis dan operasional: (1) Spesifikasi field wajib kelengkapan profil perusahaan (FR-3.2), (2) Integritas snapshot dokumen lamaran & aturan re-apply, (3) State machine & aturan transisi pipeline Kanban (proteksi Withdrawn vs Re-evaluation Rejected), (4) Rumus matematis Time-to-Hire, (5) Decoupled email transaction pada Decision, (6) Penegasan isolasi multi-tenant pada Tag & Catatan, (7) Spesifikasi teknis Ekspor CSV & keamanan berkas.*

---

## 1. Daftar Fitur (Feature List)

| No | Modul | Fitur Utama |
|---|---|---|
| 1 | Workspace & Auth (Perusahaan) | Registrasi perusahaan, sesi aman, manajemen anggota tim & hak akses berbasis peran (Admin/HR) |
| 2 | Candidate Authentication | Registrasi & login akun kandidat global lintas perusahaan |
| 3 | Company Profile | Profil perusahaan komprehensif, validasi kelengkapan minimum sebelum publish |
| 4 | Job Posting | CRUD lowongan kerja, custom questions, pipeline kustom, kuota posisi, auto-close & reopen |
| 5 | Public Job Board | Job board publik lintas perusahaan, search, multi-filter, sort berprioritas berjenjang, bookmark |
| 6 | Candidate Profile & Application | Profil lengkap reusable, koleksi CV berlabel, snapshot dokumen lamaran, pencegahan lamaran ganda, withdraw |
| 7 | Candidate Management (HR View) | Database kandidat scoped-company, pencarian, filter, tagging internal terisolasi |
| 8 | Pipeline (Kanban) | Kanban board dinamis per lowongan, anchor stages terlindungi, activity logging otomatis |
| 9 | Interview & Schedule | Penjadwalan interview (ISO 8601 + Timezone), agenda kalender (grid bulanan/mingguan), reschedule, pembatalan |
| 10 | Decision (Offer/Reject/Withdrawn) | Hasil akhir, decoupled email dispatch, kuota auto-increment atomik, audit log |
| 11 | Email Template | Template kustom Offer & Reject dengan variabel dinamis |
| 12 | Notes & Scoring | Catatan evaluasi internal (audit trail), skor individual 1–5, agregasi rata-rata otomatis |
| 13 | Candidate Tracking Portal | Pemantauan status lamaran real-time, perlindungan data internal HR, withdraw mandiri |
| 14 | Analytics Dashboard | Funnel conversion, rata-rata time-to-hire matematis, distribusi sumber pelamar, pemisahan metrik drop-off |
| 15 | Activity Log | Audit trail kronologis per lamaran (aktor, waktu, jenis aksi, deskripsi) |

---

## 2. Functional Requirements & User Stories

### 2.1 Modul: Workspace & Authentication (Perusahaan)

**FR-1.1** Sistem mendukung multi-tenant, di mana setiap perusahaan memiliki workspace terisolasi secara mutlak (data perusahaan A tidak dapat dilihat atau diakses oleh perusahaan B).  
**FR-1.2** Sistem menyediakan dua peran pengguna internal dengan batasan wewenang jelas:
- **Admin**: Pemilik/penanggung jawab workspace. Memiliki hak penuh atas konfigurasi perusahaan, billing/profil, mengundang/menonaktifkan anggota tim, serta seluruh operasional rekrutmen.
- **HR/Recruiter**: Menjalankan operasional rekrutmen harian (membuat/mengelola lowongan, memproses pipeline pelamar, menjadwalkan interview, memberi catatan/skor). **Tidak memiliki hak** mengelola anggota tim atau mengubah konfigurasi inti perusahaan.  
**FR-1.3** Admin dapat mengundang anggota tim baru melalui email dan menetapkan perannya.  
**FR-1.4** Admin dapat menonaktifkan (`is_active = false`) anggota tim kapan saja. Anggota tim yang dinonaktifkan **segera dibatalkan sesinya** dan ditolak saat mengakses endpoint API berikutnya.  
**FR-1.5** Sistem menggunakan autentikasi berbasis email unik & password ter-hash (bcrypt), dengan penerbitan Access Token (durasi pendek) dan Refresh Token (disimpan di HttpOnly Secure Cookie).

**User Story US-1.1**
> Sebagai pemilik perusahaan/HR Manager, saya ingin mendaftarkan perusahaan saya ke RecruitFlow, agar tim saya memiliki workspace resmi untuk mengelola proses rekrutmen terpusat.

*Acceptance Criteria:*
- Diberikan form registrasi (nama perusahaan, nama admin, email, password), ketika disubmit dengan data valid, maka record perusahaan dan akun Admin otomatis dibuat, token sesi diterbitkan, dan pengguna diarahkan ke alur melengkapi profil perusahaan.
- Ketika email yang dimasukkan sudah terdaftar di sistem, sistem mengembalikan status error 400 dengan pesan "Email sudah terdaftar".

**User Story US-1.2**
> Sebagai Admin, saya ingin mengundang recruiter ke workspace saya, agar beban kerja seleksi lowongan dapat dibagi bersama tim.

*Acceptance Criteria:*
- Diberikan form undang tim (nama, email, role: HR), ketika disubmit, maka akun anggota baru dibuat dengan status aktif.
- Anggota dengan role HR yang mencoba mengakses endpoint manajemen tim (`/api/dashboard/company/team`) menerima respon 403 Forbidden.

---

### 2.2 Modul: Candidate Authentication

Akun kandidat bersifat **global** — satu akun berlaku untuk melamar ke perusahaan manapun di platform, terpisah sepenuhnya dari sistem akun perusahaan.

**FR-2.1** Kandidat dapat mendaftar menggunakan nama lengkap, email unik, dan password.  
**FR-2.2** Untuk meminimalkan friksi pelamaran (*conversion rate* tinggi), akun kandidat yang baru mendaftar **langsung berstatus aktif** tanpa kewajiban verifikasi email di awal.  
**FR-2.3** Kandidat dapat login menggunakan kredensial email & password untuk mengakses portal pelamar dan profil reusable.  
**FR-2.4** Kandidat dapat melakukan reset password melalui tautan token berbatas waktu (kedaluwarsa dalam 1 jam) yang dikirimkan ke email terdaftar (pengecualian keamanan terhadap prinsip notifikasi PRD Bagian 3A).  
**FR-2.5** Satu akun kandidat menyimpan satu profil utama yang dapat dipakai berulang kali untuk melamar ke berbagai perusahaan tanpa pengisian ulang.

**User Story US-2.1**
> Sebagai pencari kerja, saya ingin membuat satu akun global yang dapat saya gunakan untuk melamar ke berbagai lowongan di banyak perusahaan, agar saya tidak perlu mengulang proses pendaftaran dari awal di setiap perusahaan yang berbeda.

*Acceptance Criteria:*
- Kandidat yang sudah terdaftar dapat langsung login dan melamar ke Lowongan Perusahaan A maupun Lowongan Perusahaan B menggunakan akun dan profil yang sama.

---

### 2.3 Modul: Company Profile & Syarat Kelengkapan

**FR-3.1** Perusahaan dapat melengkapi profil perusahaannya dengan:
- Logo & banner perusahaan
- Nama perusahaan & tagline singkat
- Industri/sektor bisnis
- Ukuran perusahaan (rentang karyawan: `1-10`, `11-50`, `51-200`, `201-500`, `500+`)
- Tahun berdiri & website resmi
- Lokasi kantor (dapat multi-cabang, minimal satu kantor ditandai sebagai `Headquarters`)
- Tautan media sosial (LinkedIn, Instagram, X/Twitter, Facebook)
- Deskripsi perusahaan (rich text)
- Benefit/fasilitas umum perusahaan (tagging/list)
- Galeri foto suasana kantor (opsional)

**FR-3.2 (Definisi Field Wajib Minimum Kelengkapan Profil):**  
Sistem memberlakukan validasi `is_profile_complete`. Profil perusahaan dinyatakan **LENGKAP** dan berhak mempublikasikan lowongan jika dan hanya jika seluruh kriteria berikut terpenuhi:
1. Nama Perusahaan terisi.
2. Industri terisi.
3. Ukuran Perusahaan terisi.
4. Minimal 1 Lokasi Kantor terdaftar dan ditandai sebagai Kantor Pusat (*Headquarters*).
5. Deskripsi Perusahaan terisi minimal 50 karakter.  
*Logo, banner, sosial media, dan galeri bersifat opsional dan tidak memblokir publikasi lowongan.*

**FR-3.3** Profil perusahaan yang belum memenuhi syarat kelengkapan FR-3.2 **dilarang mempublikasikan (*publish*) lowongan**. Tombol publish pada lowongan dinonaktifkan dengan tooltip/peringatan jelas yang mengarahkan HR untuk melengkapi profil terlebih dahulu.  
**FR-3.4** Profil perusahaan yang telah terisi dapat diakses publik (`/companies/:slug`) menampilkan informasi perusahaan dan daftar lowongan yang sedang aktif dibuka.

**User Story US-3.1**
> Sebagai Admin, saya ingin melengkapi identitas perusahaan saya, agar kandidat mendapatkan informasi yang kredibel dan meyakinkan sebelum memutuskan melamar.

*Acceptance Criteria:*
- Ketika profil perusahaan belum memiliki kantor pusat (HQ) atau deskripsi < 50 karakter, sistem menolak aksi publish lowongan dengan pesan "Lengkapi profil perusahaan Anda terlebih dahulu sebelum mempublikasikan lowongan".
- Ketika field wajib telah terpenuhi, status kelengkapan profil bernilai `true` dan lowongan dapat dipublish seketika.

---

### 2.4 Modul: Job Posting & Manajemen Kuota

**FR-4.1** HR/Admin dapat membuat dan menyunting lowongan kerja dengan spesifikasi terstruktur:
- Judul posisi & departemen
- Jenis pekerjaan: *Full-time, Part-time, Kontrak, Magang/Internship, Freelance*
- Pengaturan kerja: *On-site, Remote, Hybrid*
- Lokasi penempatan kantor (merujuk ke daftar lokasi perusahaan)
- Level pengalaman: *Entry-level, Mid-level, Senior, Lead/Managerial*
- Jumlah kuota/posisi yang dibuka (`positions_available`, integer positif >= 1)
- Rentang gaji minimum & maksimum (beserta opsi sembunyikan dari publik)
- Deskripsi pekerjaan, Tanggung Jawab (*responsibilities*), dan Kualifikasi (*requirements*) dalam format rich text
- Keahlian yang dibutuhkan (skill tags)
- Benefit spesifik posisi
- Batas akhir pelamaran (*deadline*, opsional dengan batas waktu pukul 23:59:59 WIB pada tanggal terpilih)
- **Pertanyaan seleksi kustom (Custom Questions)**: Tipe isian singkat, pilihan ganda (*multiple choice*), atau esai, dengan penanda wajib/opsional per pertanyaan.

**FR-4.2** Status Lowongan terdiri dari: **Draft**, **Published**, dan **Closed**. Hanya status *Published* yang tampil di Public Job Board.  
**FR-4.3 (Aturan Auto-Close Lowongan):**  
Sistem secara otomatis mengubah status lowongan menjadi **Closed** ketika:
1. Seluruh kuota telah terpenuhi (`filled_count >= positions_available`, saat kandidat terakhir berstatus *Hired*); ATAU
2. Tanggal deadline telah terlewati (dicek melalui *cron job* harian pukul 00:01 WIB).  
**FR-4.4 (Penanganan Pelamar Saat Lowongan Closed):**  
Ketika lowongan beralih ke status *Closed*, tombol "Lamar Sekarang" di portal publik dinonaktifkan. Namun, seluruh kandidat yang sudah melamar dan sedang berada di tahap aktif pipeline **tetap dapat diproses hingga tuntas oleh HR**.  
**FR-4.5 (Aturan Reopen Lowongan):**  
HR/Admin dapat membuka kembali (*reopen*) lowongan yang berstatus *Closed*.  
*Aturan integritas kuota:* Jika lowongan sebelumnya ditutup karena kuota penuh, HR **wajib menaikkan nilai `positions_available`** (kuota baru > kuota lama) sebelum sistem mengizinkan status beralih kembali ke *Published*.

**User Story US-4.1**
> Sebagai HR, saya ingin menentukan pertanyaan kustom pada lowongan kerja, agar saya dapat menyaring kualifikasi spesifik pelamar sejak awal proses tanpa form eksternal.

*Acceptance Criteria:*
- HR dapat menambahkan pertanyaan custom wajib dan opsional.
- Kandidat yang melamar tidak dapat melanjutkan ke step berikutnya jika pertanyaan wajib belum dijawab.

**User Story US-4.2**
> Sebagai HR, saya ingin sistem otomatis menutup lowongan saat kuota pelamar yang diterima sudah terpenuhi, agar perusahaan tidak kebanjiran lamaran baru untuk posisi yang sudah terisi.

*Acceptance Criteria:*
- Diberikan lowongan dengan kuota 2 posisi (`positions_available = 2`, `filled_count = 1`).
- Ketika HR menerima kandidat kedua menjadi "Hired", `filled_count` menjadi 2 dan status lowongan otomatis berubah menjadi "Closed".
- Lowongan tidak lagi muncul di Public Job Board publik.

---

### 2.5 Modul: Public Job Board & Sort Berprioritas

**FR-5.1** Halaman Job Board publik menampilkan seluruh lowongan berstatus *Published* lintas seluruh perusahaan terdaftar.  
**FR-5.2** Pencarian teks responsif mencocokkan kata kunci pada judul posisi, nama perusahaan, deskripsi, atau keahlian (skills).  
**FR-5.3** Filter multi-kategori dengan logika seleksi:
- Logika **OR** di dalam kategori yang sama (contoh: Full-time ATAU Kontrak).
- Logika **AND** antar kategori yang berbeda (contoh: Jakarta DAN Remote).  
**FR-5.4 (Sistem Sort Berprioritas Berjenjang):**  
Pengguna dapat memilih lebih dari satu kriteria pengurutan dan menentukan urutan prioritasnya (drag-reorder):
- *Paling Relevan* (skor pencocokan teks)
- *Terbaru* (tanggal publish)
- *Gaji Tertinggi*
- *Batas Waktu Terdekat* (deadline terdekat)
- *Kuota Terbanyak*  
**FR-5.5 (Deterministic Tie-Breaker):**  
Sistem mengurutkan hasil berdasarkan kriteria prioritas ke-1. Jika terdapat nilai yang sama (*tie*), sistem melanjutkan evaluasi ke prioritas ke-2, ke-3, dst. **Jika seluruh kriteria prioritas menghasilkan nilai seri, sistem secara deterministik menggunakan `published_at DESC` lalu `id ASC` sebagai fallback urutan terakhir.**  
**FR-5.6** Pengaturan filter dan sort wajib diserialisasi ke dalam query parameter URL (contoh: `?employment_type=full_time&sort=relevansi,terbaru`) agar halaman dapat dibagikan langsung.  
**FR-5.7** Kandidat yang sudah login dapat menyimpan (*bookmark*) lowongan untuk diakses kembali nanti dari portal kandidat.

---

### 2.6 Modul: Candidate Profile, Application, & Snapshot Integrity

**FR-6.1** Profil kandidat mencakup:
- Data Pribadi: Nama lengkap, email, nomor telepon/WhatsApp, domisili/lokasi kota, tanggal lahir (opsional), foto profil.
- Ringkasan profesional / bio.
- Riwayat Pengalaman Kerja (multi-entri: nama perusahaan, posisi, tanggal mulai/selesai, deskripsi, flag masih bekerja di sini).
- Riwayat Pendidikan (multi-entri: institusi, jenjang, jurusan, tahun kelulusan).
- Keahlian (*skills tag input*).
- Sertifikasi & Portofolio Tautan (LinkedIn, GitHub, Website).
- Koleksi Berkas CV/Resume berlabel (mis. "CV Software Engineer", "CV Project Manager").
- Ekspektasi gaji & ketersediaan mulai bekerja (*notice period*).

**FR-6.2 (Aturan Formulir Aplikasi 5-Step):**  
Pelamaran dilakukan melalui alur multi-step terstruktur:
1. *Step 1*: Konfirmasi/Review data profil dasar.
2. *Step 2*: Pemilihan berkas CV (bisa memilih dari koleksi profil ATAU upload dokumen baru khusus lamaran ini).
3. *Step 3*: Surat lamaran (*cover letter*, opsional) dan pengisian jawaban pertanyaan seleksi kustom dari HR.
4. *Step 4*: Pemilihan sumber informasi lowongan (*source*, opsional untuk analitik).
5. *Step 5*: Review menyeluruh dan pernyataan persetujuan submit.

**FR-6.3 (Integritas Snapshot Dokumen Lamaran):**  
Setiap lamaran yang berhasil dikirim **wajib menyimpan salinan referensi dokumen (snapshot) yang digunakan pada saat itu**. Jika di masa depan kandidat memperbarui profilnya atau menghapus berkas CV dari menu "Dokumen Saya", berkas CV yang sudah tersimpan pada lamaran lama **TIDAK BOLEH berubah, hilang, atau terhapus dari sisi HR**.  
**FR-6.4 (Aturan Pencegahan Lamaran Ganda vs Re-Apply):**  
- Sistem **mencegah** pengiriman lamaran ganda jika kandidat telah memiliki lamaran berstatus **`active`** pada lowongan yang sama.
- Kandidat **diizinkan melamar kembali (re-apply)** pada lowongan yang sama HANYA JIKA lamaran sebelumnya telah berstatus final (**`rejected`** atau **`withdrawn`**), dan lowongan tersebut saat ini masih berstatus *Published*.  
**FR-6.5 (Aturan Penarikan Lamaran / Withdraw):**  
- Kandidat berhak menarik (*withdraw*) lamarannya kapan saja selama status lamaran masih **`active`**.
- Status lamaran berubah menjadi **`withdrawn`**, tercatat otomatis di `activity_logs`.
- Status `withdrawn` bersifat permanen dari sisi interaksi HR (HR tidak dapat membatalkan keputusan kandidat yang menarik diri).

---

### 2.7 Modul: Candidate Management (HR View) & Isolasi Tagging

**FR-7.1** HR/Admin dapat melihat daftar seluruh pelamar yang pernah melamar ke perusahaannya, dilengkapi filter posisi lowongan, status pipeline, keahlian, dan tanggal melamar.  
**FR-7.2 (Isolasi Tagging Kandidat Multi-Tenant):**  
HR/Admin dapat membuat dan menyematkan tag kustom pada pelamar (contoh: "Top Talent", "Fast Learner", "Blacklist").  
*Aturan Isolasi:* Tag kandidat bersifat **spesifik per perusahaan (`company_scoped`)**. Perusahaan A **TIDAK DAPAT** melihat tag yang disematkan oleh Perusahaan B pada kandidat yang sama.  
**FR-7.3** HR/Admin hanya dapat melihat riwayat lamaran kandidat yang ditujukan ke **perusahaannya sendiri**. Riwayat pelamaran kandidat ke perusahaan lain di platform RecruitFlow terisolasi mutlak dan dilarang terekspos.

---

### 2.8 Modul: Pipeline Kanban & Aturan State Machine

**FR-8.1** Setiap lowongan memiliki papan Kanban pipeline dengan 4 tahapan jangkar (*anchor stages*) yang tidak dapat dihapus atau diganti nama:
1. **Applied** (Kolom awal, otomatis saat kandidat melamar).
2. **Hired** (Kolom akhir positif).
3. **Rejected** (Kolom akhir negatif dari sisi perusahaan).
4. **Withdrawn** (Kolom akhir dari sisi inisiatif kandidat).  
**FR-8.2** HR dapat mengustomisasi tahapan tengah di antara *Applied* dan *Hired* (contoh: menambah *Screening*, *Technical Test*, *HR Interview*, *User Interview*, *Offering*), serta mengubah urutan posisinya.  
**FR-8.3 (Aturan Transisi Status State Machine):**  
1. *From Active to Terminal*: Kartu pelamar dari tahap aktif manapun dapat dipindahkan ke *Hired* atau *Rejected*.
2. *Withdrawn Lock*: Kartu pelamar yang berstatus *Withdrawn* **terkunci permanen**. HR dilarang memindahkan kartu yang berstatus Withdrawn kembali ke kolom aktif.
3. *Re-Evaluation from Rejected*: Jika HR melakukan kesalahan klik, kartu dari kolom *Rejected* diizinkan untuk dipindahkan kembali ke tahap aktif, dengan kewajiban mencatat alasan pada `activity_logs`.  
**FR-8.4** Kolom *Rejected* dan *Withdrawn* ditampilkan terpisah (dapat di-collapse) di sisi kanan papan Kanban agar tidak mengganggu visibilitas alur aktif.  
**FR-8.5** Setiap perpindahan kartu antar tahap memicu pencatatan audit trail otomatis di `activity_logs`.

---

### 2.9 Modul: Penjadwalan Interview & Standarisasi Waktu

**FR-9.1** HR/Admin dapat membuat jadwal interview untuk kandidat di tahap aktif:
- Judul interview (contoh: "Wawancara Teknis Tahap 1")
- Waktu pelaksanaan: Tanggal dan Jam tersimpan dalam format **ISO 8601 UTC**, dan ditampilkan di antarmuka sesuai zona waktu lokal pengguna (WIB, WITA, WIT)
- Durasi wawancara (menit, default 60 menit)
- Metode pelaksanaan: *Online* (disertai link Google Meet/Zoom) atau *Offline* (disertai alamat lokasi dan ruangan)
- Nama pewawancara internal
- Catatan persiapan untuk kandidat  
**FR-9.2** Jadwal wawancara otomatis muncul pada **Kalender Interview** HR dalam mode tampilan **Grid Bulanan (Month View)** dan **Agenda Mingguan (Week View)**.  
**FR-9.3** Begitu interview dijadwalkan, detail waktu dan tautan/lokasi interview **langsung tampil di Candidate Tracking Portal** milik kandidat secara real-time.  
**FR-9.4** HR dapat mengubah jadwal (*reschedule*) atau membatalkan interview. Tanggal jadwal baru tidak boleh diatur di masa lalu (*past date validation*). Perubahan langsung diperbarui di portal kandidat dan dicatat di `activity_logs`.

---

### 2.10 Modul: Keputusan Akhir (Decision) & Decoupled Email Dispatch

**FR-10.1** HR/Admin menetapkan keputusan akhir lamaran melalui modal konfirmasi keputusan:
- Menjadi **Hired**: Memperbarui status lamaran, menambah kuota `filled_count`, dan memicu auto-close jika kuota terpenuhi (FR-4.3).
- Menjadi **Rejected**: Memperbarui status lamaran dan memindahkan kartu ke kolom penolakan.  
**FR-10.2 (Arsitektur Pengiriman Email Terpisah / Decoupled):**  
Saat mengambil keputusan Hired atau Rejected, HR dapat memilih opsi toggle: *"Kirim surat resmi via email?"*.  
*Aturan ketahanan sistem:*
1. Transaksi perubahan status lamaran di database **wajib berhasil terlebih dahulu**.
2. Pengiriman email melalui layanan pihak ketiga dijalankan secara asinkron/terpisah.
3. Jika pengiriman email gagal (misal koneksi timeout atau email provider error), **status lamaran kandidat TIDAK BOLEH di-rollback**. Sistem mencatat status pengiriman sebagai `failed` di `email_send_log` dan menampilkan tombol *"Kirim Ulang Email"* di antarmuka HR.

---

### 2.11 Modul: Email Templates & Variabel Dinamis

**FR-11.1** Sistem menyediakan dua template bawaan yang dapat disunting oleh HR per perusahaan:
1. *Template Surat Penawaran Kerja (Offer Letter)*.
2. *Template Surat Penolakan Resmi (Rejection Letter)*.  
**FR-11.2** Template mendukung penggantian otomatis variabel dinamis resmi:
- `{{candidate_name}}`: Nama lengkap pelamar
- `{{job_title}}`: Posisi lowongan yang dilamar
- `{{company_name}}`: Nama resmi perusahaan
- `{{date}}`: Tanggal penetapan surat keputusan  
**FR-11.3** Sesuai Prinsip Notifikasi PRD Bagian 3A, sistem **tidak menyediakan dan tidak mengirimkan email otomatis untuk perubahan tahap harian** (seperti pemindahan ke Screening atau penjadwalan interview) — seluruh alur tersebut mengandalkan visibilitas in-app portal.

---

### 2.12 Modul: Catatan Internal (Notes) & Skor Evaluasi

**FR-12.1** Tim HR/Admin dapat menambahkan catatan internal bebas pada profil pelamar.  
*Hak Akses Catatan:* Catatan bersifat audit trail. Anggota HR hanya dapat menyunting atau menghapus catatan yang ditulisnya sendiri. Admin memiliki hak moderasi untuk menghapus catatan anggota lain bila diperlukan.  
**FR-12.2** Setiap pewawancara/anggota tim dapat memberikan skor evaluasi mandiri dalam skala integer **1 hingga 5 bintang**.  
**FR-12.3** Sistem menampilkan rincian seluruh skor individual dari masing-masing penilai (disertai nama penilai dan waktu penilaian), serta menampilkan **nilai rata-rata tertimbang (*average score*)** secara otomatis sebagai ringkasan konsensus tim.

---

### 2.13 Modul: Candidate Tracking Portal (Sumber Kebenaran Pelamar)

**FR-13.1** Portal kandidat (`/candidate/dashboard`) adalah sumber kebenaran utama (*single source of truth*) bagi pelamar untuk memantau status seluruh lamarannya lintas perusahaan.  
**FR-13.2 (Label Status Publik yang Disederhanakan):**  
Untuk melindungi kerahasiaan evaluasi internal tim HR, kandidat **dilarang melihat catatan internal, skor penilaian, atau nama kolom kustom internal**. Status yang ditampilkan ke kandidat disederhanakan menjadi:
- *"Lamaran Terkirim"* (saat berada di tahap Applied)
- *"Dalam Proses Seleksi"* (saat berada di tahap tengah seperti Screening/Test)
- *"Interview Dijadwalkan"* (saat jadwal interview aktif)
- *"Diterima / Penawaran"* (saat status Hired)
- *"Tidak Lolos Seleksi"* (saat status Rejected)
- *"Lamaran Ditarik"* (saat status Withdrawn)  
**FR-13.3** Kandidat dapat melihat arsip dokumen snapshot yang digunakannya saat melamar, serta dapat mengakses lowongan yang telah dibookmark.

---

### 2.14 Modul: Dashboard Analitik Rekrutmen

**FR-14.1** Dashboard menampilkan metrik ringkasan: jumlah lowongan aktif, jumlah pelamar baru minggu ini, dan jadwal interview aktif.  
**FR-14.2 (Rumus Baku Perhitungan Time-to-Hire):**  
Metrik Rata-rata *Time-to-Hire* (TTH) dihitung secara matematis menggunakan formula:
$$\text{TTH per Pelamar} = \text{Tanggal Keputusan Hired} - \text{Tanggal Lamaran Masuk (Applied At)}$$
Nilai rata-rata disajikan dalam satuan **hari kalender**, dapat difilter per rentang tanggal atau per lowongan kerja tertentu.  
**FR-14.3** Dashboard menampilkan grafik visual *Funnel Conversion Rate* antar tahapan seleksi.  
**FR-14.4** Dashboard memisahkan angka pelamar yang gugur karena **Ditolak Perusahaan (Rejected)** dan pelamar yang mengundurkan diri atas inisiatif sendiri **(Withdrawn)** sebagai dua metrik drop-off terpisah, agar evaluasi efektivitas funnel akurat.  
**FR-14.5** Dashboard menyajikan grafik distribusi sumber pelamar (*Candidate Source*) berdasarkan data pengisian di form aplikasi (FR-6.8).

---

### 2.15 Modul: Activity Log (Audit Trail)

**FR-15.1** Setiap peristiwa signifikan pada siklus lamaran wajib dicatat secara otomatis ke dalam `activity_logs`:
- Pengiriman lamaran pertama kali
- Perpindahan tahap seleksi (kolom asal → kolom tujuan)
- Penjadwalan, perubahan jadwal (*reschedule*), atau pembatalan interview
- Penambahan catatan internal atau skor evaluasi
- Pengambilan keputusan akhir (Hired / Rejected)
- Pengiriman surat penawaran atau surat penolakan via email
- Penarikan lamaran oleh kandidat (*Withdraw*)  
**FR-15.2** Setiap baris log bersifat permanen (*immutable*, tidak dapat disunting atau dihapus oleh siapapun) memuat: `application_id`, `actor_type` (`candidate`, `company_member`, `system`), `actor_id`, `action_type`, `description`, dan `timestamp`.  
**FR-15.3** Riwayat aktivitas disajikan secara kronologis menurun pada halaman detail pelamar sisi HR.

---

## 3A. Prinsip Notifikasi & Batasan Peran Email

1. **Sistem In-App Adalah Sumber Kebenaran Utama**: Pembaruan status lamaran wajib tercermin seketika (*real-time*) di Candidate Tracking Portal.
2. **Email Hanya untuk Formalitas Hasil Akhir & Keamanan Akun**:
   - Hasil akhir: Surat Penawaran (*Offer*) dan Surat Penolakan (*Reject*) formal.
   - Keamanan: Tautan Lupa/Reset Password.
3. **Tanpa Email Rutin ke HR Maupun Kandidat**: Sistem tidak mengirim email untuk aktivitas harian seperti "Ada pelamar baru", "Kandidat dipindahkan ke Screening", atau "Interview dijadwalkan". Seluruh aktivitas tersebut dipantau langsung melalui dashboard dan kalender in-app.

---

## 3. Non-Functional Requirements (NFR)

| Kategori | Spesifikasi Kebutuhan Non-Fungsional |
|---|---|
| **Isolasi Multi-Tenant Mutlak** | Seluruh data operasional perusahaan (lowongan, lamaran, catatan, skor, template email, tag internal) wajib terisolasi 100% per `company_id`. Perusahaan manapun dilarang keras dapat melihat atau memodifikasi data milik perusahaan lain. |
| **Isolasi Riwayat Pelamar** | Perusahaan hanya memiliki izin membaca riwayat lamaran kandidat yang ditujukan ke perusahaannya sendiri. Riwayat pelamaran kandidat ke perusahaan lain di platform tidak boleh bocor dalam kondisi apapun. |
| **Portabilitas Data (Ekspor CSV)** | Sistem menyediakan fitur ekspor data kandidat ke berkas CSV terstruktur dari halaman Database Kandidat (`H-10`), dengan format kolom wajib: *Nama Lengkap, Email, Nomor Telepon, Posisi Lowongan, Tahap Terakhir, Status Lamaran, Tanggal Melamar, Rata-rata Skor Evaluasi*. |
| **Keamanan Berkas & Storage** | Endpoint upload berkas wajib dilindungi autentikasi JWT pengguna. Server wajib menerapkan validasi whitelist MIME-type (`application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `image/jpeg`, `image/png`, `image/webp`) dan batasan ukuran maksimum 5MB per berkas. Nama berkas dienkripsi dengan UUID unik untuk mencegah eksploitasi path traversal. |
| **Ketahanan Brute-Force & Anti-Spam** | Sistem menerapkan rate limiting berlapis: Endpoint autentikasi (Login/Register) dibatasi maksimal 10 request/menit/IP; Endpoint lupa password dibatasi maksimal 5 request/15 menit/IP; Endpoint submit lamaran dibatasi maksimal 20 lamaran/jam/IP. |
| **Performa Waktu Muat** | Waktu muat awal (*initial page load*) halaman Job Board dan Landing Page wajib < 2 detik pada koneksi internet reguler (Lighthouse Performance Score >= 85). |
| **Responsivitas Perangkat** | Area Publik (Job Board, Job Detail, Form Aplikasi) dan Portal Kandidat wajib responsif penuh di perangkat Mobile (*viewport width* 375px+). Area HR dirancang optimal untuk Desktop & Tablet (*viewport width* 768px+). |
| **Auditabilitas** | Seluruh aksi krusial tercatat permanen di `activity_logs` tanpa opsi penghapusan oleh pengguna. |

---

## 4. Batasan & Asumsi Produk (Scope Guardrails)

1. **Role Pengguna Internal**: Dibatasi hanya pada **Admin** dan **HR/Recruiter**. Tidak ada role pewawancara eksternal terpisah pada versi ini.
2. **Pewawancara Eksternal**: Dicatat sebagai data teks bebas (*free-text input*) pada form interview, bukan sebagai akun login sistem.
3. **Tanpa Modul Payroll / Pembayaran**: RecruitFlow versi ini murni berfokus pada siklus Applicant Tracking System (ATS), tanpa integrasi penggajian atau sistem pembayaran gaji.
4. **Halaman Harga Murni Informasional**: Halaman `/harga` menampilkan kartu paket *Starter, Growth, dan Enterprise* murni untuk kebutuhan pemasaran dan konversi B2B. **Tidak ada pembatasan fitur teknis (paywall enforcement) maupun integrasi payment gateway pada versi ini**. Seluruh fitur PRD terbuka penuh untuk seluruh perusahaan terdaftar.
5. **Algoritma Relevansi**: Pencocokan "Paling Relevan" menggunakan pencocokan teks pada judul, deskripsi, dan skills posisi — bukan model machine learning rekomendasi berbasis riwayat pengguna.

---

*Dokumen PRD Versi 4.0 ini adalah acuan resmi tertinggi untuk perancangan kontrak API, logika backend, antarmuka frontend, dan eksekusi skenario uji coba (Test Plan).*
