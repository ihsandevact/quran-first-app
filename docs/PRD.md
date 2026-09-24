# Product Requirements Document (PRD) — Quran First v0.1

## 1. Visi Produk
Quran First menghadirkan jeda terencana (*intentional pause*) sebelum pengguna membuka aplikasi-aplikasi yang mendistraksi di smartphone Android.
Filosofi utama:
> *"Baca Al-Qur'an dulu, buka aplikasi kemudian."*

Aplikasi ini bertujuan membangun kebiasaan baik (*habit-building*), bukan instrumen hukuman atau pengawasan. Pengguna selalu memegang kendali penuh atas:
- Aplikasi apa yang ingin diberi jeda proteksi.
- Berapa jumlah ayat yang menjadi komitmen tilawah sebelum membuka aplikasi.

## 2. Alur Pengguna (User Flow)
1. **Pemicu**: Pengguna membuka aplikasi terproteksi (contoh: Instagram).
2. **Quran First Gate**: Aplikasi mendeteksi Instagram dan menampilkan layar Quran Gate.
3. **Pilihan Pengguna**:
   - **Baca Sekarang**: Pengguna membaca ayat yang ditentukan (contoh: 5 ayat). Setelah selesai, Quran Pass aktif selama 30 menit dan Instagram dapat diakses.
   - **Baca Nanti**: Tilawah ditunda dan dicatat ke antrean **Pending Tilawah**. Pengguna diberikan akses sementara tanpa rasa bersalah (*no shame*).

## 3. Prinsip Bahasa & Tone of Voice
- Hindari nada menghakimi/agresif:
  - ❌ *"Kamu membuang-buang waktu!"*
  - ❌ *"Kamu gagal menahan diri."*
- Gunakan bahasa yang tenang, menghormati, dan spiritual:
  - ✅ *"Luangkan sejenak untuk membaca."*
  - ✅ *"Baca 5 ayat terlebih dahulu."*
  - ✅ *"Tilawah ditunda. Selesaikan nanti ketika kamu punya waktu."*
  - ✅ *"Alhamdulillah, tilawah selesai."*

## 4. Ruang Lingkup v0.1 (MVP Spike)
### In-Scope:
- Expo project setup dengan TypeScript & Expo Router.
- Design system dengan warna hijau mendalam (`#1B4D3E`), putih hangat (`#F8F9F5`), dan aksen emas lembut (`#D4AF37`).
- Layar Welcome, Beranda (Home), Progres, Pengaturan (Settings), dan Debug Gate.
- Local Android Native Feasibility Spike (`expo-app-gate`):
  - Deteksi foreground application menggunakan `UsageStatsManager`.
  - Foreground Service untuk pemantauan latar belakang.
  - Hardcoded target: Instagram (`com.instagram.android`).
  - Quran Pass in-memory & local state (30 menit).
  - Mekanisme penundaan ke Pending Tilawah.

### Out-of-Scope (Roadmap v0.2+):
- Dataset lengkap 114 Surah terverifikasi (v0.1 menggunakan mock dataset).
- Audio murattal, tafsir, bookmark mendalam.
- Cloud sync / autentikasi backend.
- Notifikasi push terjadwal.
- Dukungan iOS (karena batasan platform sandbox iOS terhadap app detection).
