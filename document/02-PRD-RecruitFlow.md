# Product Requirements Document (PRD)
## RecruitFlow — Recruitment Management System

*Dokumen ini merupakan turunan dari Product Definition Document (PDD) dan menjadi acuan detail fitur untuk tahap UI/UX Specification & System Design.*

*Versi 3 — direvisi untuk mengakomodasi: (1) modul autentikasi kandidat tersendiri, (2) isolasi data lamaran lintas perusahaan, (3) pencegahan lamaran ganda & fitur withdraw, (4) status "Withdrawn" terpisah dari "Rejected", (5) pipeline yang dapat dikustomisasi per lowongan, (6) tracking sumber kandidat (opsional), (7) reschedule/cancel interview, (8) bookmark lowongan.*

---

## 1. Daftar Fitur (Feature List)

| No | Modul | Fitur |
|---|---|---|
| 1 | Workspace & Auth (Perusahaan) | Registrasi perusahaan, login, manajemen anggota tim (Admin/HR) |
| 2 | Candidate Authentication | Registrasi & login akun kandidat (berlaku lintas perusahaan) |
| 3 | Company Profile | Profil lengkap perusahaan yang tampil di halaman publik |
| 4 | Job Posting | CRUD lowongan dengan detail lengkap, kuota, pipeline kustom |
| 5 | Public Job Board | Halaman publik lintas perusahaan, search, filter majemuk, sort berprioritas, bookmark |
| 6 | Candidate Profile & Application | Profil kandidat lengkap, lamaran menyeluruh, cegah lamaran ganda, withdraw |
| 7 | Candidate Management (HR View) | Database kandidat, pencarian, filter, tagging (sisi HR) |
| 8 | Pipeline | Kanban board tahapan seleksi (kustom per lowongan) |
| 9 | Interview & Schedule | Penjadwalan, reschedule, & pembatalan interview |
| 10 | Decision (Offer/Reject/Withdrawn) | Penentuan hasil akhir & surat resmi opsional |
| 11 | Email Template | Manajemen template email formal (offer & reject) |
| 12 | Notes & Scoring | Catatan internal & skor evaluasi kandidat |
| 13 | Candidate Tracking Portal | Tracking status lamaran & lowongan tersimpan (publik) |
| 14 | Analytics Dashboard | Statistik funnel, time-to-hire, sumber kandidat |
| 15 | Activity Log | Riwayat aktivitas per kandidat/lowongan |

---

## 2. Functional Requirements & User Stories

### 2.1 Modul: Workspace & Authentication (Perusahaan)

**FR-1.1** Sistem harus mendukung multi-tenant, di mana setiap perusahaan memiliki workspace terisolasi (data tidak dapat diakses oleh workspace lain).
**FR-1.2** Sistem menyediakan dua peran pengguna dalam satu workspace: **Admin** dan **HR/Recruiter**.
**FR-1.3** Admin dapat mengundang/mengelola anggota tim (HR/Recruiter) dalam workspace-nya.
**FR-1.4** Sistem menggunakan autentikasi berbasis email & password, dengan sesi yang aman (token-based).

**User Story US-1.1**
> Sebagai calon pengguna, saya ingin mendaftarkan perusahaan saya ke RecruitFlow, agar saya bisa mulai menggunakan sistem untuk merekrut kandidat.

*Acceptance Criteria:*
- Diberikan form registrasi (nama perusahaan, nama admin, email, password), ketika submit valid, maka workspace baru dibuat dan akun Admin otomatis aktif.
- Ketika email sudah terdaftar, maka sistem menampilkan pesan error yang jelas.

**User Story US-1.2**
> Sebagai Admin, saya ingin mengundang anggota tim HR lain ke workspace saya, agar kami bisa berkolaborasi mengelola rekrutmen.

*Acceptance Criteria:*
- Diberikan email anggota baru, ketika Admin mengirim undangan, maka anggota menerima akses dengan role HR/Recruiter.
- Admin dapat menghapus/menonaktifkan anggota tim kapan saja.

---

### 2.2 Modul: Candidate Authentication

Akun kandidat bersifat **global** — satu akun berlaku untuk melamar ke perusahaan manapun di platform, terpisah sepenuhnya dari sistem login perusahaan/HR.

**FR-2.1** Kandidat dapat mendaftar menggunakan email & password.
**FR-2.2** Kandidat dapat login menggunakan kredensial yang sudah terdaftar.
**FR-2.3** Kandidat dapat mereset password melalui tautan yang dikirim ke email terdaftar. *(Ini adalah email transaksional terkait keamanan akun, bukan update status lamaran — merupakan pengecualian yang wajar terhadap prinsip notifikasi pada bagian 3A.)*
**FR-2.4** Satu akun kandidat menyimpan satu profil (lihat Modul 2.6) yang dapat digunakan untuk melamar ke lowongan di perusahaan manapun.

**User Story US-2.1**
> Sebagai pencari kerja, saya ingin membuat satu akun yang bisa saya pakai untuk melamar ke berbagai perusahaan di platform ini, agar saya tidak perlu mendaftar ulang setiap kali melamar ke perusahaan berbeda.

*Acceptance Criteria:*
- Diberikan akun kandidat yang sudah dibuat, ketika kandidat melamar ke lowongan dari perusahaan berbeda-beda, maka kandidat cukup login dengan satu akun yang sama.

---

### 2.3 Modul: Company Profile

Profil perusahaan harus cukup lengkap sehingga kandidat dapat mengenal perusahaan sepenuhnya tanpa perlu mencari informasi dari sumber lain, dan cukup meyakinkan sebagai "halaman etalase" perusahaan di job board publik.

**FR-3.1** Admin dapat melengkapi profil perusahaan dengan:
- Logo & banner perusahaan
- Nama perusahaan & tagline singkat
- Industri/sektor bisnis
- Ukuran perusahaan (rentang jumlah karyawan)
- Tahun berdiri
- Lokasi kantor (dapat lebih dari satu cabang)
- Website resmi & tautan sosial media (LinkedIn, Instagram, dll.)
- Deskripsi perusahaan (rich text — visi, budaya kerja, dll.)
- Daftar benefit/fasilitas umum perusahaan (mis. asuransi kesehatan, kerja remote, cuti tambahan)
- Galeri foto (opsional — suasana kantor/kegiatan tim)

**FR-3.2** Profil perusahaan yang belum lengkap (field wajib minimum belum terisi) tidak dapat mempublikasikan lowongan — mencegah lowongan tampil tanpa konteks perusahaan yang memadai.
**FR-3.3** Halaman profil perusahaan dapat diakses publik, menampilkan seluruh informasi di atas beserta daftar lowongan aktif dari perusahaan tersebut.

**User Story US-3.1**
> Sebagai Admin, saya ingin melengkapi profil perusahaan saya secara detail, agar kandidat memiliki gambaran menyeluruh tentang perusahaan sebelum melamar.

*Acceptance Criteria:*
- Diberikan field wajib profil perusahaan (nama, industri, lokasi, deskripsi minimum), ketika belum terisi lengkap, maka sistem mencegah publish lowongan dan menampilkan indikator kelengkapan profil.
- Diberikan profil lengkap, ketika kandidat membuka halaman perusahaan, maka seluruh informasi (deskripsi, benefit, lokasi, lowongan aktif) tampil dengan baik.

---

### 2.4 Modul: Job Posting

Form pembuatan lowongan dirancang selengkap mungkin agar HR tidak perlu mencantumkan tautan eksternal (mis. Google Form) hanya karena sistem dianggap kurang detail.

**FR-4.1** HR/Admin dapat membuat lowongan dengan detail:
- Judul posisi & departemen/kategori
- Jenis pekerjaan: Full-time, Part-time, Kontrak, Magang/Internship, Freelance
- Pengaturan kerja: On-site, Remote, Hybrid
- Lokasi penempatan
- Level pengalaman: Entry-level, Mid-level, Senior, Manajerial
- Pendidikan minimum yang dibutuhkan
- Jumlah kuota/posisi yang dibuka
- Rentang gaji (opsional ditampilkan publik atau disembunyikan — pilihan HR)
- Deskripsi pekerjaan (rich text)
- Tanggung jawab (job responsibilities — list)
- Kualifikasi wajib (requirements — list)
- Kualifikasi nilai tambah (preferred/nice-to-have — list)
- Keahlian yang dibutuhkan (skill tags)
- Benefit spesifik posisi ini (opsional, melengkapi benefit umum perusahaan)
- Batas akhir pelamaran (deadline) — opsional
- **Pertanyaan seleksi tambahan (custom application questions)** — HR dapat menambahkan pertanyaan spesifik untuk lowongan ini (pilihan ganda/isian singkat/esai), yang akan dijawab kandidat saat melamar

**FR-4.2** Lowongan memiliki status: **Draft**, **Published**, **Closed**.
**FR-4.3** Hanya lowongan berstatus *Published* yang tampil di Public Job Board.
**FR-4.4** Sistem menampilkan jumlah kuota terisi vs total kuota pada setiap lowongan (mis. "3 dari 5 posisi terisi"). Lowongan **otomatis berstatus Closed** ketika seluruh kuota terisi (seluruh posisi ber-status Hired), atau ketika tanggal deadline (jika diisi) telah lewat — mana yang tercapai lebih dulu. HR tetap dapat membuka kembali (reopen) lowongan secara manual jika diperlukan (mis. ada kandidat yang mengundurkan diri setelah offer).
**FR-4.5** HR/Admin dapat mengedit atau menutup (close) lowongan kapan saja secara manual.
**FR-4.6** Saat membuat lowongan, HR dapat menentukan **tahapan pipeline** yang akan digunakan untuk lowongan tersebut (lihat Modul 2.8 untuk detail aturan kustomisasi).

**User Story US-4.1**
> Sebagai HR, saya ingin membuat lowongan kerja dengan seluruh detail yang dibutuhkan kandidat, termasuk pertanyaan seleksi khusus, agar saya tidak perlu mengarahkan kandidat ke formulir eksternal.

*Acceptance Criteria:*
- Diberikan form job posting, HR dapat mengisi seluruh field di atas termasuk menambahkan custom question (minimal 0, tidak dibatasi maksimum yang wajar).
- Ketika lowongan di-publish, maka seluruh informasi dan pertanyaan tambahan tampil pada form aplikasi yang dilihat kandidat.

**User Story US-4.2**
> Sebagai HR, saya ingin lowongan otomatis ditutup ketika kuota sudah terisi penuh, agar saya tidak perlu terus memantau dan menutupnya secara manual.

*Acceptance Criteria:*
- Diberikan lowongan dengan kuota 3 posisi, ketika kandidat ke-3 berstatus "Hired", maka status lowongan otomatis berubah menjadi "Closed" dan tidak lagi tampil di Job Board.

---

### 2.5 Modul: Public Job Board

Halaman publik utama menampilkan **seluruh lowongan dari seluruh perusahaan** (bukan per perusahaan saja), dilengkapi pencarian, filter majemuk, sistem pengurutan (sort) berbasis prioritas, dan bookmark.

**FR-5.1** Halaman job board menampilkan seluruh lowongan berstatus *Published* dari seluruh perusahaan yang terdaftar.
**FR-5.2** Sistem menyediakan kolom pencarian berbasis kata kunci (judul posisi, perusahaan, skill).
**FR-5.3** Sistem menyediakan filter yang dapat dipilih lebih dari satu nilai sekaligus (multi-select) per kategori, dan dapat dikombinasikan antar kategori filter:
- Lokasi (kota/provinsi/remote)
- Jenis pekerjaan (Full-time, Part-time, Kontrak, Magang, Freelance)
- Pengaturan kerja (On-site, Remote, Hybrid)
- Level pengalaman (Entry, Mid, Senior, Manajerial)
- Kategori/departemen
- Rentang gaji (jika tersedia/ditampilkan)
- Perusahaan tertentu (opsional, untuk pengguna yang ingin fokus ke perusahaan tertentu)

**FR-5.4** Sistem menyediakan opsi pengurutan (sort) berikut:
- Paling Relevan (berdasarkan kecocokan kata kunci pencarian)
- Terbaru (tanggal publish)
- Kuota Terbanyak
- Pelamar Tersedikit
- Pelamar Terbanyak
- Batas Waktu Terdekat (deadline segera berakhir)

**FR-5.5** Pengguna dapat memilih **lebih dari satu kriteria sort sekaligus** dan **mengatur urutan prioritasnya** (mis. prioritas 1: Relevan, prioritas 2: Terbaru, prioritas 3: Kuota Terbanyak, dst). Sistem mengurutkan data berdasarkan kriteria prioritas pertama; jika terdapat kesamaan nilai (tie), pengurutan dilanjutkan berdasarkan kriteria prioritas berikutnya, dan seterusnya secara berjenjang.
**FR-5.6** Pengguna dapat mengubah urutan prioritas kriteria sort yang sudah dipilih (reorder), maupun menghapus salah satu kriteria dari daftar prioritas.
**FR-5.7** Filter dan sort yang dipilih tercermin pada URL (query parameter), sehingga hasil pencarian dapat dibagikan atau di-bookmark.
**FR-5.8** Kandidat dapat mengklik lowongan untuk melihat detail lengkap dan melamar langsung dari halaman ini.
**FR-5.9** Kandidat yang sudah login dapat **menyimpan (bookmark)** lowongan untuk dilihat/dilamar kembali nanti, dapat diakses melalui Candidate Tracking Portal (lihat FR-13.4).

**User Story US-5.1**
> Sebagai pencari kerja, saya ingin mencari lowongan dari berbagai perusahaan sekaligus dengan filter yang bisa dikombinasikan, agar saya bisa menemukan lowongan yang paling sesuai dengan preferensi saya secara efisien.

*Acceptance Criteria:*
- Diberikan beberapa filter aktif sekaligus (mis. Lokasi: Jakarta + Bandung, Jenis: Full-time + Remote), ketika diterapkan, maka hasil menampilkan lowongan yang memenuhi kombinasi filter tersebut (logika OR di dalam kategori yang sama, AND antar kategori berbeda).

**User Story US-5.2**
> Sebagai pencari kerja, saya ingin menyusun beberapa kriteria pengurutan sesuai prioritas saya sendiri, agar hasil pencarian benar-benar mencerminkan apa yang paling saya pedulikan.

*Acceptance Criteria:*
- Diberikan daftar kriteria sort yang tersedia, ketika pengguna memilih beberapa kriteria dan mengatur urutannya (mis. drag untuk reorder), maka hasil job board terurut sesuai prioritas berjenjang tersebut.
- Ketika dua atau lebih lowongan memiliki nilai sama pada kriteria prioritas pertama, maka pengurutan mengacu ke kriteria prioritas kedua, dan seterusnya.

**User Story US-5.3**
> Sebagai pencari kerja, saya ingin menyimpan lowongan yang menarik untuk saya lamar nanti, agar saya tidak kehilangan jejak lowongan yang sudah saya lihat.

*Acceptance Criteria:*
- Diberikan lowongan pada job board, ketika kandidat menekan tombol simpan, maka lowongan tersebut muncul di daftar "Lowongan Tersimpan" pada akun kandidat.

---

### 2.6 Modul: Candidate Profile & Application

Profil dan form lamaran kandidat dirancang selengkap mungkin agar kandidat tidak perlu mengirimkan berkas/informasi tambahan melalui kanal lain (email, WhatsApp, dsb.), dan agar HR memiliki seluruh data yang dibutuhkan untuk menyeleksi tanpa perlu follow-up manual.

**FR-6.1** Kandidat dapat membuat profil (tersimpan untuk digunakan kembali pada lamaran berikutnya) yang mencakup:
- **Data Pribadi**: nama lengkap, email, no. telepon, domisili/lokasi, foto profil (opsional), tanggal lahir (opsional)
- **Ringkasan Profesional**: deskripsi singkat tentang diri (about me)
- **Pengalaman Kerja**: nama perusahaan, posisi, periode kerja, deskripsi tanggung jawab (dapat menambahkan lebih dari satu entri, termasuk "belum berpengalaman" untuk fresh graduate)
- **Riwayat Pendidikan**: institusi, jenjang, jurusan, tahun mulai/selesai (dapat lebih dari satu entri)
- **Keahlian (Skills)**: daftar skill dalam bentuk tag
- **Sertifikasi**: nama sertifikat, penerbit, tahun (opsional, dapat lebih dari satu)
- **Tautan Pendukung**: LinkedIn, portofolio online, GitHub, website pribadi (opsional, dapat lebih dari satu)
- **Dokumen**: unggah CV/resume (wajib), unggah dokumen pendukung lain seperti transkrip nilai, sertifikat, contoh karya (opsional, dapat lebih dari satu file)
- **Preferensi**: ekspektasi gaji (opsional), ketersediaan mulai bekerja/notice period

**FR-6.2** Saat melamar lowongan tertentu, kandidat dapat menyertakan surat lamaran (cover letter — teks bebas, opsional) serta menjawab pertanyaan seleksi tambahan yang ditentukan HR untuk lowongan tersebut (lihat FR-4.1).
**FR-6.3** Kandidat dapat menggunakan profil yang sudah tersimpan untuk melamar ke lowongan lain tanpa mengisi ulang data dari awal (hanya melengkapi hal spesifik lowongan seperti cover letter/pertanyaan tambahan).
**FR-6.4** HR/Admin yang melihat profil kandidat mendapatkan seluruh informasi di atas dalam satu tampilan terstruktur (tidak perlu membuka file CV terpisah untuk mengetahui data dasar kandidat).
**FR-6.5** Kandidat dapat menyimpan **lebih dari satu versi CV/dokumen** pada profilnya, masing-masing dengan label bebas (mis. "CV — Software Engineer", "CV — Digital Marketing"), agar dapat memilih dokumen yang paling relevan untuk tiap lowongan.
**FR-6.6** Saat melamar, kandidat dapat memilih salah satu dokumen dari koleksi yang tersimpan di profil, **atau** mengunggah dokumen baru yang berlaku **khusus untuk lamaran tersebut saja** (tidak menggantikan/mengubah dokumen utama di profil).
**FR-6.7** Setiap lamaran menyimpan referensi dokumen yang benar-benar digunakan pada lamaran itu (snapshot), sehingga perubahan dokumen di profil di kemudian hari tidak mengubah dokumen yang sudah tercatat pada lamaran lama.
**FR-6.8** Saat melamar, kandidat dapat secara **opsional** memilih "Dari mana kamu tahu lowongan ini?" (mis. Pencarian di RecruitFlow, Referral Karyawan, Media Sosial, Website Perusahaan, Lainnya) — data ini digunakan untuk analitik sumber kandidat (lihat FR-14.4).
**FR-6.9** Sistem **mencegah kandidat mengirim lebih dari satu lamaran aktif** untuk lowongan yang sama; jika kandidat sudah pernah melamar, sistem menampilkan status lamaran yang sudah ada alih-alih formulir aplikasi baru.
**FR-6.10** Kandidat dapat **menarik (withdraw)** lamaran yang masih aktif (belum berstatus Hired/Rejected) kapan saja melalui Candidate Tracking Portal. Status lamaran berubah menjadi **Withdrawn**, tercatat pada activity log, dan tetap tersimpan sebagai data historis (tidak dihapus) untuk keperluan pipeline & analitik HR.

**User Story US-6.1**
> Sebagai kandidat, saya ingin mengisi profil saya secara lengkap satu kali, agar saya bisa melamar ke berbagai lowongan tanpa perlu mengulang proses input data maupun mengirim dokumen tambahan lewat kanal lain.

*Acceptance Criteria:*
- Diberikan profil kandidat yang sudah lengkap (data pribadi, pengalaman, pendidikan, skill, CV), ketika kandidat melamar lowongan baru, maka data tersebut otomatis terpakai dan kandidat hanya perlu mengisi hal yang spesifik terhadap lowongan itu.

**User Story US-6.2**
> Sebagai HR, saya ingin melihat seluruh informasi relevan kandidat dalam satu halaman terstruktur, agar saya bisa menyeleksi kandidat tanpa perlu meminta data tambahan melalui email atau WhatsApp.

*Acceptance Criteria:*
- Diberikan profil kandidat yang melamar, ketika HR membuka detail kandidat, maka seluruh data (pengalaman, pendidikan, skill, dokumen, jawaban pertanyaan seleksi) tampil lengkap dan terstruktur.

**User Story US-6.3**
> Sebagai kandidat, saya ingin menggunakan CV yang berbeda untuk lowongan/bidang yang berbeda, agar lamaran saya lebih relevan dengan posisi yang saya tuju tanpa harus mengganti CV utama di profil saya.

*Acceptance Criteria:*
- Diberikan koleksi CV pada profil kandidat, ketika kandidat melamar sebuah lowongan, maka kandidat dapat memilih salah satu CV dari koleksi atau mengunggah CV baru khusus lamaran ini.

**User Story US-6.4**
> Sebagai kandidat, saya ingin membatalkan lamaran yang sudah saya kirim jika saya berubah pikiran, agar status saya di sistem HR perusahaan tetap akurat dan tidak menggantung.

*Acceptance Criteria:*
- Diberikan lamaran aktif milik kandidat, ketika kandidat menekan "Tarik Lamaran", maka status berubah menjadi "Withdrawn", HR melihat perubahan ini di pipeline mereka, dan kandidat tidak dapat mengubahnya kembali menjadi aktif (harus melamar ulang jika berubah pikiran lagi, mengikuti aturan FR-6.9).

---

### 2.7 Modul: Candidate Management (HR View)

**FR-7.1** HR/Admin dapat mencari & memfilter kandidat berdasarkan nama, lowongan yang dilamar, status pipeline, skill, atau tag.
**FR-7.2** HR/Admin dapat menambahkan tag kustom pada kandidat (mis. "Top Talent", "Blacklist", "Referral").
**FR-7.3** HR/Admin dapat melihat riwayat seluruh lamaran seorang kandidat **hanya untuk lamaran yang ditujukan ke perusahaan mereka sendiri** — riwayat lamaran kandidat ke perusahaan lain di platform tidak dapat diakses (lihat NFR Isolasi Data Kandidat pada bagian 3).

**User Story US-7.1**
> Sebagai HR, saya ingin mencari kandidat berdasarkan nama, skill, atau tag, agar saya cepat menemukan profil yang saya butuhkan.

*Acceptance Criteria:*
- Diberikan kata kunci pencarian, ketika dimasukkan, maka daftar kandidat terfilter sesuai kecocokan nama/skill/tag secara real-time.

---

### 2.8 Modul: Pipeline (Seleksi Kandidat)

**FR-8.1** Sistem menyediakan template pipeline default: **Applied → Screening → Interview → Offer → Hired**, sebagai titik awal saat membuat lowongan baru.
**FR-8.2** HR dapat **mengustomisasi tahapan pipeline per lowongan** — menambah, menghapus, mengganti nama, atau mengubah urutan tahap tengah (mis. menambahkan "Technical Test", memecah "Interview" menjadi "HR Interview" dan "User Interview"), sesuai kebutuhan proses seleksi masing-masing lowongan.
**FR-8.3** Tiga status bersifat **tetap (anchor)** dan tidak dapat dihapus/diganti nama oleh HR karena menjadi acuan sistem di seluruh modul (analytics, tracking portal, dsb.): **Applied** (tahap awal, otomatis saat kandidat melamar), **Hired** (status akhir positif), **Rejected** dan **Withdrawn** (status akhir negatif — masing-masing dipicu oleh aksi berbeda, lihat Modul 2.10).
**FR-8.4** Tampilan pipeline berbentuk kanban board, dengan kandidat sebagai kartu yang dapat dipindahkan antar kolom (drag-and-drop) sesuai tahap kustom yang berlaku untuk lowongan tersebut.
**FR-8.5** Perpindahan tahap kandidat tercatat dalam activity log.
**FR-8.6** Perubahan konfigurasi pipeline (tambah/hapus/ubah tahap) hanya memengaruhi lowongan tersebut, tidak memengaruhi lowongan lain yang sudah ada.

**User Story US-8.1**
> Sebagai HR, saya ingin memindahkan kandidat dari satu tahap seleksi ke tahap berikutnya secara visual, agar saya bisa dengan mudah memantau progres seluruh kandidat dalam satu lowongan.

*Acceptance Criteria:*
- Diberikan kandidat pada kolom "Screening", ketika HR drag kartu ke kolom "Interview", maka status kandidat berubah dan tersimpan otomatis.
- Perubahan status memicu pencatatan pada activity log kandidat tersebut.

**User Story US-8.2**
> Sebagai HR, saya ingin menyesuaikan tahapan seleksi untuk lowongan tertentu yang butuh proses lebih panjang (mis. ada tes teknis), agar pipeline benar-benar merepresentasikan proses rekrutmen saya yang sebenarnya.

*Acceptance Criteria:*
- Diberikan pipeline default saat membuat lowongan, ketika HR menambahkan tahap baru di antara "Screening" dan "Offer", maka tahap tersebut tersimpan dan tampil sebagai kolom tambahan pada kanban board lowongan itu saja.

---

### 2.9 Modul: Interview & Schedule

**FR-9.1** HR/Admin dapat menjadwalkan interview untuk kandidat: tanggal, waktu, jenis (online/offline), pewawancara (nama, dapat lebih dari satu), catatan.
**FR-9.2** Jadwal interview tampil pada tampilan kalender (mingguan/bulanan) di dalam sistem.
**FR-9.3** Begitu jadwal interview disimpan, status lamaran kandidat pada Candidate Tracking Portal otomatis diperbarui beserta detail jadwalnya — ini menjadi **sumber informasi utama** bagi kandidat, bukan email (lihat prinsip notifikasi pada bagian 3A).
**FR-9.4** HR/Admin dapat **mengubah jadwal (reschedule)** atau **membatalkan** interview yang sudah dibuat. Perubahan ini langsung tercermin di Candidate Tracking Portal kandidat secara real-time.

**User Story US-9.1**
> Sebagai HR, saya ingin menjadwalkan interview untuk kandidat dan melihatnya dalam tampilan kalender, agar saya tidak bentrok jadwal dengan interview lain.

*Acceptance Criteria:*
- Diberikan detail jadwal valid, ketika disimpan, maka jadwal muncul di kalender internal HR dan status + detail jadwal tersebut langsung terlihat oleh kandidat di Candidate Tracking Portal miliknya.

**User Story US-9.2**
> Sebagai HR, saya ingin mengubah jadwal interview yang berbenturan, agar kandidat mendapat informasi jadwal terbaru tanpa saya perlu menghubunginya secara terpisah.

*Acceptance Criteria:*
- Diberikan jadwal interview yang sudah ada, ketika HR mengubah tanggal/waktu, maka Candidate Tracking Portal kandidat menampilkan jadwal terbaru secara otomatis.

---

### 2.10 Modul: Decision — Offer, Reject & Withdrawn

Ini adalah satu-satunya dua titik dalam alur rekrutmen di mana pengiriman email bersifat relevan — digunakan untuk formalitas hasil akhir, bukan untuk update status rutin (lihat prinsip notifikasi pada bagian 3A).

**FR-10.1** Status kandidat dapat diubah menjadi **Hired** atau **Rejected** langsung dari pipeline oleh HR/Admin — perubahan ini segera tercermin di Candidate Tracking Portal terlepas dari apakah email dikirim atau tidak.
**FR-10.2** Status **Withdrawn** hanya dapat dipicu oleh aksi kandidat sendiri (lihat FR-6.10), bukan oleh HR — jika HR ingin "menolak" kandidat yang sebenarnya sudah tidak berminat, HR tetap menggunakan status Rejected atau mengonfirmasi kandidat menarik lamarannya sendiri melalui portal.
**FR-10.3** HR/Admin dapat **secara opsional** mengirimkan surat offer resmi berbasis template (dengan variabel otomatis: nama kandidat, posisi, dsb.) saat kandidat berstatus Hired, untuk kebutuhan surat-menyurat formal.
**FR-10.4** HR/Admin dapat **secara opsional** mengirimkan email penolakan berbasis template saat kandidat berstatus Rejected, untuk kebutuhan formalitas.
**FR-10.5** Status akhir kandidat (Hired/Rejected/Withdrawn) tercatat permanen dan terlihat di riwayat pipeline, terlepas dari status pengiriman email. Saat kandidat Hired, kuota posisi terisi otomatis bertambah (lihat FR-4.4).
**FR-10.6** Sistem mencatat status pengiriman email formal secara terpisah (mis. "Belum Dikirim" / "Terkirim") pada profil kandidat, sehingga HR tahu mana yang masih perlu ditindaklanjuti secara resmi.

**User Story US-10.1**
> Sebagai HR, saya ingin mengirimkan surat penawaran kerja resmi dari sistem menggunakan template ketika kandidat sudah saya tandai diterima, agar ada dokumentasi formal tanpa harus menulis ulang setiap kali.

*Acceptance Criteria:*
- Diberikan kandidat yang statusnya diubah menjadi Hired, ketika HR memilih untuk mengirim surat offer, maka email terkirim ke kandidat dan tercatat sebagai "Surat Offer Terkirim".
- Diberikan kandidat berstatus Hired namun HR belum mengirim surat offer, status di Candidate Tracking Portal kandidat tetap menampilkan "Diterima" secara real-time.

---

### 2.11 Modul: Email Template

Karena email hanya digunakan untuk formalitas hasil akhir (lihat bagian 3A), modul ini hanya mencakup dua jenis template utama.

**FR-11.1** Sistem menyediakan template default untuk: **surat offer/diterima** dan **surat penolakan** — dapat disunting oleh Admin/HR agar sesuai gaya bahasa perusahaan.
**FR-11.2** Template mendukung variabel dinamis (mis. `{{candidate_name}}`, `{{job_title}}`, `{{company_name}}`).
**FR-11.3** Sistem tidak mengirimkan email otomatis untuk perubahan tahap pipeline lainnya maupun notifikasi internal ke HR/Admin — seluruh update tersebut cukup tercermin di dalam sistem.

---

### 2.12 Modul: Notes & Candidate Scoring

**FR-12.1** HR/Admin dapat menambahkan catatan (notes) bebas pada profil kandidat, terlihat oleh seluruh anggota workspace.
**FR-12.2** HR/Admin dapat memberikan skor/rating (1–5) setelah interview, sebagai bagian dari evaluasi kandidat.
**FR-12.3** Jika lebih dari satu anggota HR memberikan skor pada kandidat yang sama, sistem menampilkan **seluruh skor individual** (lengkap dengan nama pemberi & waktu), **serta** rata-rata otomatis sebagai ringkasan cepat.

**User Story US-12.1**
> Sebagai HR, saya ingin mencatat hasil evaluasi interview pada profil kandidat, agar tim dapat membuat keputusan bersama berdasarkan catatan tersebut.

*Acceptance Criteria:*
- Diberikan form catatan pada profil kandidat, ketika disimpan, maka catatan tampil dengan nama penulis dan waktu penulisan.

**User Story US-12.2**
> Sebagai Admin, saya ingin melihat rata-rata skor kandidat dari seluruh pewawancara sekaligus rincian tiap skor, agar saya bisa cepat menilai konsensus tim tanpa kehilangan detail penilaian masing-masing.

*Acceptance Criteria:*
- Diberikan kandidat yang dinilai oleh 3 anggota HR berbeda, ketika profil kandidat dibuka, maka sistem menampilkan rata-rata skor beserta daftar skor individual masing-masing penilai.

---

### 2.13 Modul: Candidate Tracking Portal (Publik/Akun Kandidat)

**FR-13.1** Kandidat dapat mengecek status lamaran mereka melalui akun kandidat (lihat Modul 2.2), tanpa perlu kanal komunikasi tambahan.
**FR-13.2** Status yang ditampilkan ke kandidat disederhanakan (mis. "Dalam Peninjauan", "Interview Dijadwalkan", "Diterima", "Tidak Lolos", "Ditarik") — tanpa menampilkan detail internal (catatan HR, skor, dsb).
**FR-13.3** Kandidat dapat melihat riwayat seluruh lamaran yang pernah diajukan (ke perusahaan manapun di platform) dalam satu dashboard.
**FR-13.4** Kandidat dapat melihat daftar **lowongan tersimpan (bookmark)** miliknya, dan melamar langsung dari daftar tersebut.
**FR-13.5** Kandidat dapat menarik (withdraw) lamaran aktif langsung dari halaman ini (lihat FR-6.10).

**User Story US-13.1**
> Sebagai kandidat, saya ingin mengecek status seluruh lamaran saya di satu tempat, agar saya tidak perlu terus-menerus menghubungi HR untuk update.

*Acceptance Criteria:*
- Diberikan akun kandidat dengan beberapa lamaran aktif, ketika dashboard dibuka, maka seluruh status lamaran (lintas perusahaan) tampil dengan jelas.

---

### 2.14 Modul: Analytics Dashboard

**FR-14.1** Dashboard menampilkan ringkasan: jumlah lowongan aktif, jumlah kandidat per tahap pipeline, rata-rata time-to-hire.
**FR-14.2** Dashboard menampilkan funnel conversion rate antar tahap pipeline (menyesuaikan tahap kustom masing-masing lowongan jika dilihat per lowongan; menggunakan tahap standar Applied/Interview/Offer/Hired/Rejected/Withdrawn jika dilihat agregat lintas lowongan).
**FR-14.3** Data dashboard difilter berdasarkan rentang waktu dan/atau lowongan tertentu.
**FR-14.4** Dashboard menampilkan distribusi **sumber kandidat** (berdasarkan data opsional pada FR-6.8) untuk lowongan/perusahaan tertentu.
**FR-14.5** Dashboard membedakan status **Rejected** (ditolak perusahaan) dan **Withdrawn** (kandidat mengundurkan diri) sebagai metrik terpisah, agar funnel drop-off dapat dianalisis lebih akurat.

**User Story US-14.1**
> Sebagai Admin, saya ingin melihat funnel rekrutmen dalam bentuk visual, agar saya bisa mengidentifikasi tahap mana yang paling banyak kehilangan kandidat.

*Acceptance Criteria:*
- Diberikan data pipeline yang ada, ketika dashboard dibuka, maka funnel chart menampilkan jumlah kandidat di setiap tahap secara akurat sesuai data terkini, dengan Rejected dan Withdrawn ditampilkan sebagai kategori terpisah.

---

### 2.15 Modul: Activity Log

**FR-15.1** Setiap perubahan penting (perpindahan tahap, pengiriman email, penambahan catatan, withdraw, reschedule interview) tercatat dengan informasi: aktor, waktu, jenis aksi.
**FR-15.2** Activity log ditampilkan secara kronologis pada profil kandidat.

---

## 3A. Prinsip Notifikasi & Peran Email

Untuk menghindari kesalahpahaman lintas dokumen, berikut prinsip yang berlaku di seluruh sistem:

1. **Sistem (in-app) adalah sumber kebenaran utama** untuk status lamaran, di setiap tahap (termasuk tahap kustom): Applied, tahap-tahap tengah (Screening, Interview, dsb.), hingga Hired/Rejected/Withdrawn. Seluruh perubahan tahap ini **wajib** langsung terlihat oleh kandidat melalui Candidate Tracking Portal secara real-time.
2. **Email bersifat opsional dan hanya digunakan untuk formalitas hasil akhir** — yaitu saat kandidat dinyatakan **Diterima** atau **Ditolak** (FR-10.3, FR-10.4). Tujuannya adalah menghasilkan dokumen/surat resmi yang lazim dibutuhkan secara administratif, bukan sebagai mekanisme notifikasi utama.
3. **Tidak ada email yang dikirim ke pihak HR/Admin/recruiter** untuk aktivitas rutin (kandidat baru melamar, kandidat pindah tahap, dsb.) — seluruhnya disampaikan melalui notifikasi in-app/dashboard.
4. **Pengecualian**: email untuk keperluan keamanan akun (reset password kandidat maupun HR, FR-2.3) tetap dikirim karena sifatnya berbeda dari notifikasi status lamaran.
5. Tahap-tahap selain Diterima/Ditolak (Screening, Interview dijadwalkan, dsb.) **tidak memicu pengiriman email otomatis** — cukup tercermin di status Candidate Tracking Portal.

---

## 3. Non-Functional Requirements (NFR)

| Kategori | Requirement |
|---|---|
| **Keamanan** | Isolasi data antar tenant harus mutlak. Password disimpan ter-hash. Endpoint publik (job board, tracking, form aplikasi) tidak boleh mengekspos data internal HR (catatan, skor). Form aplikasi publik dilindungi mekanisme anti-spam/rate-limiting untuk mencegah lamaran otomatis/bot. |
| **Isolasi Data Kandidat** | Karena akun kandidat bersifat global (lintas perusahaan), setiap perusahaan **hanya** dapat melihat data & riwayat lamaran kandidat yang ditujukan ke perusahaan mereka sendiri. Riwayat lamaran kandidat ke perusahaan lain tidak boleh terekspos ke pihak manapun kecuali kandidat itu sendiri. |
| **Performa** | Waktu muat halaman utama < 2 detik. Filter, search, dan sort berprioritas pada job board harus responsif meski diterapkan bersamaan. |
| **Skalabilitas** | Arsitektur database harus mendukung penambahan tenant baru tanpa migrasi manual, serta pertumbuhan jumlah lowongan/kandidat pada job board publik. |
| **Usability** | Antarmuka HR harus dapat digunakan tanpa training. Mekanisme pengaturan prioritas sort pada job board dan kustomisasi tahap pipeline harus intuitif bagi pengguna awam. |
| **Ketersediaan** | Sistem menargetkan uptime tinggi untuk kebutuhan operasional harian HR maupun akses publik job board. |
| **Kompatibilitas** | Aplikasi harus responsif di desktop maupun tablet untuk sisi HR; job board & form aplikasi harus responsif penuh di mobile. |
| **Auditabilitas** | Seluruh aksi penting harus tercatat di activity log dan tidak dapat dihapus oleh pengguna biasa. |
| **Portabilitas Data** | Struktur data harus memungkinkan ekspor data kandidat (mis. ke CSV) untuk kebutuhan pelaporan. |
| **Kelengkapan Data** | Sistem harus mencegah publish lowongan/profil yang belum memenuhi kelengkapan data minimum. |
| **Notifikasi** | Update status lamaran ke kandidat wajib real-time di dalam sistem (bukan bergantung email). Notifikasi internal ke HR/Admin disampaikan in-app, bukan email — lihat bagian 3A. |

---

## 4. Batasan & Asumsi

- Role pengguna internal dibatasi pada Admin & HR/Recruiter (tidak ada role Hiring Manager/Interviewer terpisah pada versi ini).
- Interview dilakukan dan dicatat oleh HR/Admin; pewawancara eksternal tidak memiliki akun sistem sendiri (dicatat sebagai data teks).
- Pengiriman email diasumsikan menggunakan layanan pihak ketiga (akan ditentukan pada System Design).
- Tidak ada integrasi pembayaran/payroll pada versi ini.
- Kandidat memiliki akun tersendiri (berbeda dari akun perusahaan) untuk menyimpan profil dan melacak lamaran, berlaku lintas seluruh perusahaan di platform.
- Relevansi pencarian ("Paling Relevan") menggunakan pencocokan teks pada judul, deskripsi, dan skill lowongan — bukan sistem rekomendasi berbasis riwayat pengguna.
- Kustomisasi pipeline dibatasi pada tahap tengah; status anchor (Applied, Hired, Rejected, Withdrawn) tetap seragam di seluruh sistem agar analytics tetap dapat dibandingkan lintas lowongan/perusahaan.
- Tracking sumber kandidat (FR-6.8) bersifat opsional dan self-reported oleh kandidat — bukan tracking teknis (mis. UTM parameter), sehingga akurasinya bergantung pada kejujuran pengisian.

---

*Dokumen ini menjadi acuan untuk penyusunan UI/UX Specification & Flow Document pada tahap berikutnya.*
