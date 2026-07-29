# Screen & Component Build Tracker
## RecruitFlow — Panduan Pengerjaan Sistematis Tahap 6 (Mockup Halaman)

*Dokumen kerja (bukan dokumen final seperti PDD/PRD/dst) — dipakai untuk melacak progres pembuatan mockup HTML per screen, memastikan tiap screen konsisten memakai komponen yang sudah didefinisikan di Design.md, dan menjaga urutan pengerjaan logis.*

---

## 1. Gap yang Ditemukan Sebelum Mulai

Saat memetakan screen ke komponen, ditemukan **1 komponen yang dibutuhkan tapi belum terdefinisi** di Design.md:

- **Kalender/Date Picker** — dibutuhkan oleh **[H-11] Kalender Interview** dan **[H-14] Modal Jadwalkan Interview**.

✅ **Sudah ditutup** — spesifikasinya telah ditambahkan sebagai **Design.md §7.21 Calendar** (grid bulanan/mingguan, indikator jadwal, navigasi, integrasi dengan Modal 7.8). Referensi di tabel checklist bagian 3 sudah diperbarui.

---

## 2. Urutan Pengerjaan yang Disarankan

Bukan urutan acak — mengikuti logika "screen yang membangun pola dasar dikerjakan dulu", supaya screen berikutnya tinggal reuse pola yang sudah teruji, bukan menciptakan pola baru terus-menerus.

| Batch | Alasan Urutan |
|---|---|
| **1. Auth & Fondasi** | Form sederhana, membangun pola Input & Form (§7.4) yang dipakai di hampir semua screen lain |
| **2. Area Publik (lanjutan)** | Membangun pola Card, Badge, Navbar publik lebih jauh dari P-01 yang sudah jadi |
| **3. Alur Lamaran** | Bergantung pada P-02, memperkenalkan pola Form multi-step & File Upload |
| **4. Area Kandidat** | Memperkenalkan Stage Rail versi fungsional (bukan cuma ambient) |
| **5. Fondasi Dashboard HR** | Membangun shell Sidebar Nav — dipakai oleh SEMUA screen H- berikutnya |
| **6. Alur Inti HR** | Job Posting → Pipeline, jantung produk |
| **7. Operasional HR Lanjutan** | Bergantung pada screen batch 6 sudah ada (Candidate Detail perlu data dari Pipeline, dst) |
| **8. Admin & Analytics** | Paling tidak kritis untuk demo alur inti, dikerjakan terakhir |

---

## 3. Checklist Screen × Komponen

*Kolom "Komponen Dipakai" merujuk ke nomor section Design.md §7 (dan §4/§6/§10/§11 untuk Logo/Stage Rail/Data Viz/Ilustrasi). Kolom Status: ✅ selesai · ⬜ belum.*

### Batch 1 — Auth & Fondasi

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | H-01 | Register Perusahaan | 7.4 Input&Form, 7.1 Button |
| ✅ | H-02 | Login HR/Admin | 7.4, 7.1 |
| ✅ | P-04 | Register/Login Kandidat | 7.4, 7.1, 7.10 Tabs |

### Batch 2 — Area Publik

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | P-01 | Job Board (Home) | §4 Logo, §6 Stage Rail (ambient), 7.1, 7.3, 7.6, 7.7, 7.15, 7.19 Footer |
| ✅ | P-02 | Job Detail | 7.1, 7.2 Badge, 7.3 Card, 7.6 Navbar, 7.19 Footer |
| ✅ | P-03 | Company Profile (Publik) | 7.1, 7.3, 7.10 Tabs, §11 Ilustrasi/Foto, 7.19 Footer |

### Batch 3 — Alur Lamaran

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | P-05 | Form Aplikasi | 7.4 (multi-step), 7.16 File Upload, 7.12 Checkbox/Radio (custom Q), §6 Stage Rail (step indicator) |
| ✅ | P-06 | Konfirmasi Lamaran | 7.1, 7.3, §6 Stage Rail |

### Batch 4 — Area Kandidat

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | C-01 | Candidate Dashboard | 7.6 Navbar (varian kandidat), 7.3, 7.2 Badge, 7.7 Filter Chip |
| ✅ | C-02 | Detail Lamaran | **§6 Stage Rail (fungsional)**, 7.3, 7.1 (withdraw), 7.8 Modal (konfirmasi) |
| ✅ | C-03 | Lowongan Tersimpan | 7.3 (reuse Job Card), 7.2 Badge (Sudah Ditutup) |
| ✅ | C-04 | Edit Profil Kandidat | 7.4 (banyak section repeatable), progress indicator + daftar field kosong |
| ✅ | C-05 | Dokumen Saya | 7.16 File Upload, 7.1, peringatan dokumen terpakai |

### Batch 5 — Fondasi Dashboard HR

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | H-03 | Dashboard Utama | **7.6 Sidebar Nav (shell dipakai semua screen H- berikutnya)**, 7.3, §10 Data Viz (ringkas) |

### Batch 6 — Alur Inti HR

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | H-06 | Daftar Lowongan | 7.6 Sidebar, 7.9 Table, 7.2 Badge, 7.7 Filter Chip |
| ✅ | H-07 | Buat/Edit Lowongan | 7.6, 7.4, 7.17 Rich Text, 7.11 Dropdown, custom Q builder, pipeline stage builder |
| ✅ | H-08 | Pipeline Board | 7.6, **7.5 Kanban Board**, 7.3, 7.14 Avatar, 7.18 Score, drag+dropdown alternatif |

### Batch 7 — Operasional HR Lanjutan

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | H-09 | Candidate Detail (HR) | 7.6, 7.10 Tabs, 7.3, 7.18 Score Input, §6 Stage Rail (mini), 7.8 Modal (H-14,H-15) |
| ✅ | H-10 | Database Kandidat | 7.6, 7.9 Table, 7.7 Filter Chip, 7.14 Avatar |
| ✅ | H-11 | Kalender Interview | 7.6, **7.21 Calendar**, link ke H-09 utk detail |
| ✅ | H-14 | *(Modal)* Jadwalkan/Reschedule | 7.8 Modal, 7.4 — diimplementasikan di H-09 |
| ✅ | H-15 | *(Modal)* Decision | 7.8 Modal, 7.12 Toggle, preview email — diimplementasikan di H-09 |
| ✅ | H-12 | Template Email | 7.6, 7.17 Rich Text, 7.10 Tabs (Offer/Reject) |

### Batch 8 — Admin & Analytics

| Status | Kode | Screen | Komponen Dipakai |
|---|---|---|---|
| ✅ | H-04 | Company Profile (Edit) | 7.6, 7.4, 7.16 File Upload, 7.17 Rich Text, indikator kelengkapan |
| ✅ | H-05 | Manajemen Tim | 7.6, 7.9 Table, 7.8 Modal, 7.11 Dropdown |
| ✅ | H-13 | Analitik | 7.6, **§10 Data Viz (penuh: funnel, trend, distribusi, breakdown table)** |

---

## 4. Cara Pakai Dokumen Ini

- Setiap kali satu screen selesai dibuat & disetujui, tandai ✅ di sini.
- Kalau saat mengerjakan satu screen ternyata butuh komponen baru yang belum ada di Design.md (seperti kasus Calendar), berhenti dulu → tambahkan spesifikasinya ke Design.md → baru lanjut build, supaya semua komponen tetap terdokumentasi di satu tempat sebagai sumber kebenaran.

---

*Dokumen ini akan diperbarui seiring progres pembuatan mockup.*
