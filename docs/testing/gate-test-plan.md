# Gate Feasibility Spike — Test Plan & Matrix

Dokumen rencana uji coba untuk memvalidasi mekanisme deteksi dan penundaan Quran Gate pada perangkat Android fisik.

---

## Matriks Kasus Uji (Test Cases)

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-01** | Buka Aplikasi Terproteksi (Instagram) | 1. Aktifkan monitor Quran First.<br>2. Tekan Home.<br>3. Buka aplikasi Instagram. | Quran Gate muncul dalam rentang 0.5s - 1.5s menghadirkan jeda tilawah. | Siap Diuji |
| **TC-02** | Aplikasi Tanpa Proteksi (WhatsApp/Settings) | 1. Buka aplikasi yang tidak diproteksi (misal: WhatsApp). | Aplikasi terbuka normal tanpa interupsi Quran Gate. | Siap Diuji |
| **TC-03** | Selesaikan Tilawah (Quran Pass) | 1. Pada Quran Gate, baca target ayat (5 ayat).<br>2. Tekan "Buka Instagram Sekarang". | Quran Pass aktif selama 30 menit. Instagram terbuka dan tidak diinterupsi lagi selama durasi pass. | Siap Diuji |
| **TC-04** | Alur "Baca Nanti" (Penundaan) | 1. Pada Quran Gate, pilih "Baca Nanti". | 5 ayat masuk ke daftar Tilawah Tertunda. Pengguna dapat membuka Instagram sementara tanpa rasa bersalah. | Siap Diuji |
| **TC-05** | Perpindahan Antar Aplikasi (App Switcher) | 1. Buka Instagram (Gate selesai -> Pass aktif).<br>2. Beralih ke YouTube (terproteksi, belum ada pass). | Gate muncul untuk YouTube, tetapi Instagram tetap memiliki pass tersendiri. | Siap Diuji |
| **TC-06** | Screen Lock & Unlock | 1. Kunci layar saat Instagram sedang aktif.<br>2. Buka kunci layar setelah pass berakhir. | Gate kembali muncul sebelum Instagram dapat digunakan. | Siap Diuji |
| **TC-07** | Background Service Persistence | 1. Buka beberapa aplikasi berat untuk menguji memory pressure.<br>2. Buka Instagram kembali. | Notifikasi Foreground Service tetap berjalan dan Gate tetap terpicu. | Siap Diuji |

---

## Prosedur Pengujian pada Perangkat Android

1. Sambungkan perangkat Android fisik ke komputer dengan kabel data (USB Debugging diaktifkan).
2. Jalankan perintah:
   ```bash
   npx expo run:android
   ```
3. Buka aplikasi Quran First di ponsel.
4. Buka tab **Pengaturan** atau tombol di **Beranda**, lalu izinkan:
   - **Akses Penggunaan (Usage Access)**
   - **Tampil di Atas Aplikasi Lain (Display over other apps)**
5. Tekan tombol **Mulai Monitor Background**.
6. Tekan tombol Home di ponsel, lalu buka aplikasi **Instagram**.
7. Verifikasi kemunculan layar Quran Gate dan lakukan skenario **Baca Sekarang** dan **Baca Nanti**.
